#! /usr/bin/env node

import { cosmiconfig } from "cosmiconfig";
import path from "path";
import { Checker } from "../checker";
import { runReporters, runRules } from "../core";
import { Reporter } from "../reporter";
import { Rule } from "../rule";
import { Source } from "../source";
import { nullSource } from "../source/nullSource";
import { CliConfig, getDefaultConfig } from "./config";
import { resolvePackage } from "./resolvePackage";

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  const explorer = cosmiconfig("akitainu");
  const searchResult = await explorer.search();
  const config: CliConfig = {
    ...getDefaultConfig(
      searchResult ? path.dirname(searchResult.filepath) : process.cwd()
    ),
    ...(searchResult?.config ?? {}),
  };
  const [rules, reporters] = await Promise.all([
    getRules(config),
    getReporters(config),
  ]);

  const result = await runRules(rules);

  await runReporters({
    reporters,
    errors: result.errors,
  });
}

function getRules(config: CliConfig): Promise<Rule[]> {
  return Promise.all(
    config.rules.map(async (rule) => ({
      name: rule.name,
      source: rule.source
        ? ((await resolvePackage(rule.source)) as Source)
        : nullSource(),
      checker: (await resolvePackage(rule.checker)) as Checker,
    }))
  );
}

function getReporters(config: CliConfig): Promise<Reporter[]> {
  return Promise.all(
    config.reporters.map((rep) => resolvePackage(rep) as Promise<Reporter>)
  );
}
