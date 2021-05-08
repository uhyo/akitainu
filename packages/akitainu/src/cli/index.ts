#! /usr/bin/env node

import { cosmiconfig } from "cosmiconfig";
import path from "path";
import yargs from "yargs";
import { Checker } from "../checker/index.js";
import { runReporters, runRules } from "../core/index.js";
import { Filter } from "../filter/index.js";
import { noFilter } from "../filter/noFilter.js";
import { Reporter } from "../reporter/index.js";
import { Rule } from "../rule/index.js";
import { Source } from "../source/index.js";
import { nullSource } from "../source/nullSource.js";
import { CliConfig, getDefaultConfig } from "./config.js";
import { resolvePackage } from "./resolvePackage.js";

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
      main(configFile).catch((err) => {
        console.error(err);
        process.exit(1);
      });
    }
  )
  .help().argv;

async function main(configFile: string | undefined) {
  const { configDir, config: rawConfig } = await loadConfig(configFile);
  const config: CliConfig = {
    ...getDefaultConfig(configDir),
    ...rawConfig,
  };
  const [rules, reporters] = await Promise.all([
    getRules(config),
    getReporters(config),
  ]);

  const result = await runRules(rules, {
    baseDirectory: config.baseDirectory,
  });

  await runReporters({
    reporters,
    errors: result.errors,
  });

  if (result.errors.length > 0) {
    // If there was an error, exit with non-zero exit code
    process.exit(64);
  }
}

async function loadConfig(configFile: string | undefined) {
  const explorer = cosmiconfig("akitainu");
  const searchResult =
    configFile === undefined
      ? await explorer.search()
      : await explorer.load(configFile);
  return {
    configDir: searchResult
      ? path.dirname(searchResult.filepath)
      : process.cwd(),
    config: searchResult?.config ?? {},
  };
}

function getRules(config: CliConfig): Promise<Rule[]> {
  return Promise.all(
    config.rules.map(async (rule) => ({
      name: rule.name,
      source: rule.source
        ? ((await resolvePackage(rule.source)) as Source)
        : nullSource(),
      checker: (await resolvePackage(rule.checker)) as Checker,
      filter: rule.filter
        ? ((await resolvePackage(rule.filter)) as Filter)
        : noFilter(),
    }))
  );
}

function getReporters(config: CliConfig): Promise<Reporter[]> {
  return Promise.all(
    config.reporters.map((rep) => resolvePackage(rep) as Promise<Reporter>)
  );
}
