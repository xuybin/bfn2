import { parseArgs } from "./deps.ts";
import { command as startSubcommand } from "./start.ts";
import { command as newSubcommand } from "./new.ts";

const help = `The web framework,use it like functions.

To initalize a new route file in directory:
    bfn new ./mydir

To start from route file:
    bfn start ./mydir/route.ts

USAGE:
    bfn [OPTIONS] <ROUTE_FILE>

OPTIONS:
    -h, --help                   Prints help information
    -i, --info                   Prints this command info

SUBCOMMANDS:
    new [OPTIONS] <DIRECTORY>    Initialize a new route file
    start [OPTIONS] <ROUTE_FILE> Start from route file
`;

const args = parseArgs(Deno.args, {
  alias: {
    "help": "h",
    "info": "i",
    "port": "p",
    "static":["s","public"],
    "certFile":["c","cert"],
    "keyFile":["k","key"],
    "offline":"o",
    "deploy":"d",
    "Dockerfile":"D",
  },
  string:["deploy","static","certFile","keyFile"],
  boolean: [
    "help",
    "info",
    "Dockerfile"
  ],
  default:{
    "deploy":'edge',
    "port":8000
  },
});

const subcommand = args._.shift();
switch (subcommand) {
  case "start":
    await startSubcommand(args);
    break;
  case "new":
    await newSubcommand(args);
    break;
  default:
    if (args.info) {
      console.log(`${import.meta.url}`);
      Deno.exit(0);
    }
    if (args.help) {
      console.log(help);
      Deno.exit(0);
    }
    console.error(help);
    Deno.exit(1);
}
