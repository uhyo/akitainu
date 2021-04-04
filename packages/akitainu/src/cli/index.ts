#! /usr/bin/env node

import { cosmiconfig } from "cosmiconfig";
import path from "path";
import { Checker } from "../checker";
import { runRule } from "../core";
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
  const rules = await getRules(config);

  const results = await Promise.all(rules.map((rule) => runRule(rule)));
  console.log(results);
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
