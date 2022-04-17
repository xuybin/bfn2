import { Manifest, ServerContext,serveTls,serve } from "../server/mod.ts";
import { error } from "./error.ts";
import { parseArgs,resolve, toFileUrl } from "./deps.ts";

const help = `Start from route file.

To start from local route file:
    COMMAND ./route.ts

To start from remote route file:
    COMMAND https://raw.githubusercontents.com/xuybin/bfn/main/templet/edge.ts

USAGE:
    COMMAND [OPTIONS] <ROUTE_FILE>

OPTIONS:
    -h, --help                   Prints help information
    -i, --info                   Prints this command info
    -p, --port=<PORT>            Serve port
    -s, --static=<DIR>           Serve static directory
    -k, --keyFile=<FILE>         ServeTls keyFile
    -c, --certFile=<FILE>        ServeTls certFile
`;
export interface Args {
  help: boolean;
  info: boolean;
  port:string
  static:string|null
  keyFile:string|null
  certFile:string|null
  directory:string|null
}

// deno-lint-ignore no-explicit-any
export async function command(rawArgs: Record<string, any>) {
  if (!parseInt(rawArgs.port) || parseInt(rawArgs.port)<0 || parseInt(rawArgs.port)>65535) {
    error("Invalid port option.");
  }
  const args: Args = {
    help: !!rawArgs.help,
    info: !!rawArgs.info,
    port: rawArgs.port,
    static:rawArgs.static?rawArgs.static:null,
    keyFile:rawArgs.keyFile?rawArgs.keyFile:null,
    certFile:rawArgs.certFile?rawArgs.certFile:null,
    directory:(typeof rawArgs._[0] === "string")? rawArgs._[0]: null
  };
  
  if (args.help) {
    console.log(help);
    Deno.exit(0);
  }else if (args.info) {
    console.log(`${import.meta.url}`);
    Deno.exit(0);
  }else if (!args.directory) {
    error("No routefile given.");
  }else{
    let importUrl = args.directory;
    if (!importUrl.toLowerCase().startsWith("http")) {
      try {
        importUrl = resolve(Deno.cwd(), importUrl);
        //console.log(importUrl)
        const fileInfo = await Deno.stat(importUrl);
        if (!fileInfo.isFile) {
          error("given route file not isFile.");
        }
        importUrl = toFileUrl(importUrl).href;
        //console.log(importUrl)
      } catch (_) {
        error("given route file not isFile.");
      }
    }
    // deno-lint-ignore no-explicit-any
    const manifest = ((await import(importUrl)) as any).default as Manifest;
    // command line variable override
    if(rawArgs.static){
      if(manifest.static){
        error("given routes file already contains static files.");
      }
      manifest.static = {'_':toFileUrl(resolve(Deno.cwd(), rawArgs.static)).href};
    }
    const ctx = await ServerContext.fromManifest(manifest);
    console.log(`Server listening on http${(rawArgs.certFile && rawArgs.keyFile)?'s':''}://localhost:${rawArgs.port}`);
    if(rawArgs.certFile && rawArgs.keyFile){
      serveTls(ctx.handler(), {
        port: rawArgs.port,
        certFile: rawArgs.certFile,
        keyFile: rawArgs.keyFile,
      });
    }else{
      await serve(ctx.handler(), {
        port: rawArgs.port,
      });
    }
  }
}

if (import.meta.main) {
  const args = parseArgs(Deno.args, {
    alias: {
      "help": "h",
      "info": "i",
      "port": "p",
      "static":["s","public"],
      "certFile":["c","cert"],
      "keyFile":["k","key"],
    },
    boolean: [
      "help",
      "info",
    ],
    string:["static","certFile","keyFile"],
    default:{
      "port":8000
    },
  });
  await command(args);
}