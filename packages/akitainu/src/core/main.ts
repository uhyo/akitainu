import { cosmiconfig } from "cosmiconfig";
import path from "path";
import { Checker } from "../checker/index.js";
import { AkitainuConfig, getDefaultConfig } from "../core/config.js";
import { resolvePackage } from "../core/resolvePackage.js";
import { Filter } from "../filter/index.js";
import { Reporter } from "../reporter/index.js";
import { Rule } from "../rule/index.js";
import { Source } from "../source/index.js";
import { nullSource } from "../source/nullSource.js";
import { RuleError, runReporters, runRules } from "./runRule.js";

export type AkitainuResult =
  | {
      /**
       * Whether there are errors.
       */
      hasErrors: true;
      errors: RuleError[];
    }
  | {
      /**
       * Whether there are errors.
       */
      hasErrors: false;
      errors: [];
    };

export async function main(
  configFile: string | undefined
): Promise<AkitainuResult> {
  const { configDir, config: rawConfig } = await loadConfig(configFile);
  const config: AkitainuConfig = {
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
    return {
      hasErrors: true,
      errors: result.errors,
    };
  } else {
    return {
      hasErrors: false,
      errors: [],
    };
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

function getRules(config: AkitainuConfig): Promise<Rule[]> {
  return Promise.all(
    config.rules.map(async (rule) => ({
      name: rule.name,
      source: rule.source
        ? ((await resolvePackage(rule.source)) as Source)
        : nullSource(),
      checker: (await resolvePackage(rule.checker)) as Checker,
      filters: await Promise.all(
        rule.filters?.map((p) => resolvePackage(p) as Promise<Filter>) ?? []
      ),
    }))
  );
}

function getReporters(config: AkitainuConfig): Promise<Reporter[]> {
  return Promise.all(
    config.reporters.map((rep) => resolvePackage(rep) as Promise<Reporter>)
  );
}
