#! /usr/bin/env node

import yargs from "yargs";
import { main } from "../core/main.js";

yargs(process.argv.slice(2))
  .command(
    "$0 [configfile]",
    "Run akitainu",
    (yargs) => {
      return yargs.positional("configfile", {
        type: "string",
      });
    },
    (argv) => {
      const configFile = argv.configfile;
      main(configFile)
        .then((result) => {
          if (result.hasErrors) {
            process.exit(64);
          }
        })
        .catch((err) => {
          console.error(err);
          process.exit(1);
        });
    }
  )
  .help().argv;
