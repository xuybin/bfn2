import { error } from "./error.ts";
import { dirname, join, parseArgs,fromFileUrl,relative,resolve} from "./deps.ts";
import { Manifest } from "../server/mod.ts";

const help = `Initialize a new route file.

To generate './mydir/route.ts' in the './mydir' subdirectory:
    COMMAND ./mydir
  
To generate './route.ts' in the current directory:
    COMMAND .

USAGE:
    COMMAND [OPTIONS] <DIRECTORY>

OPTIONS:
    -h, --help                   Prints help information
    -i, --info                   Prints this command info  
    -d, --deploy==<host|edge>    How to deploy, host or edge(default)
    -D, --Dockerfile             Generate Dockerfile
    -o, --offline                Offline dependency file via 'deno vendor route.ts'
`;

export interface Args {
  help: boolean;
  info: boolean;
  offline: boolean;
  deploy: "host" | "edge";
  Dockerfile: boolean;
  directory: string | null;
}

// deno-lint-ignore no-explicit-any
export async function command(rawArgs: Record<string, any>) {
  if (rawArgs.deploy != "edge" && rawArgs.deploy != "host") {
    error("Invalid deploy option.");
  }
  const args: Args = {
    help: !!rawArgs.help,
    info: !!rawArgs.info,
    offline: !!rawArgs.offline,
    Dockerfile: !!rawArgs.Dockerfile,
    deploy: rawArgs.deploy,
    directory: (typeof rawArgs._[0] === "string") ? rawArgs._[0] : null,
  };

  if (args.help) {
    console.log(help);
    Deno.exit(0);
  } else if (args.info) {
    console.log(`${import.meta.url}`);
    Deno.exit(0);
  } else if (!args.directory) {
    error("No directory given.");
  } else {
    await Deno.mkdir(args.directory, { recursive: true });
    const templetUrl = new URL(`../templet/${args.deploy}.ts`, import.meta.url);
    const resp = await fetch(templetUrl);
    let content=await resp.text();
    const toBeReplacedImport="../server/mod.ts";
    const importUrl=new URL(toBeReplacedImport, import.meta.url);
    if(importUrl.protocol == "file:"){
      const p = relative(resolve(Deno.cwd(), args.directory), fromFileUrl(importUrl)).replaceAll("\\","/");
      content=content.replace("../server/mod.ts",p)
    }else{
      content=content.replace("../server/mod.ts",importUrl.href)
    }
    await Deno.writeTextFile(
      join(args.directory, "routes.ts"),
      content,
    );

    // deno-lint-ignore no-explicit-any
    const manifest = ((await import(templetUrl.href)) as any)
      .default as Manifest;
    if (manifest.static) {
      for (const [_, url] of Object.entries(manifest.static)) {
        if (url.startsWith(".")) {
          const relativeStatic = new URL(
            url,
            new URL("../templet/", manifest.baseUrl).href,
          );
          const resp = await fetch(relativeStatic);
          await Deno.mkdir(join(args.directory, dirname(url)), {
            recursive: true,
          });
          await Deno.writeTextFile(
            join(args.directory, url),
            await resp.text(),
          );
        }
      }
    }
  }
}

if (import.meta.main) {
  const args = parseArgs(Deno.args, {
    alias: {
      "help": "h",
      "info": "i",
      "offline": "o",
      "deploy": "d",
      "Dockerfile": "D",
    },
    boolean: [
      "help",
      "info",
      "Dockerfile",
    ],
    string: ["deploy"],
    default: {
      "deploy": "edge",
    },
  });
  await command(args);
}
