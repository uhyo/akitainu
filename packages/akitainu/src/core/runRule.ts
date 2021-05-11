import { CheckError } from "../checker/index.js";
import { Reporter } from "../reporter/index.js";
import { Rule } from "../rule/index.js";

export type RunRuleOptionns = {
  baseDirectory: string;
};

export type RuleError = CheckError & {
  /**
   * Name of checker that produced this error.
   */
  checker: string;
};

export type RunRuleResult = {
  errors: RuleError[];
};

export async function runRule(
  rule: Rule,
  { baseDirectory }: RunRuleOptionns
): Promise<RunRuleResult> {
  const sourceResult = await rule.source?.run();
  const result = await rule.checker.run({
    targetFiles: sourceResult?.targetFiles,
    baseDirectory,
  });
  let ruleErrors = result.errors.map((err) => ({
    ...err,
    checker: rule.checker.name,
  }));

  for (const filter of rule.filters ?? []) {
    ({ errors: ruleErrors } = await filter.run({
      errors: ruleErrors,
    }));
  }

  return {
    errors: ruleErrors,
  };
}

export type RunRulesResult = {
  errors: RuleError[];
};

export async function runRules(
  rules: readonly Rule[],
  options: RunRuleOptionns
): Promise<RunRulesResult> {
  const results = await Promise.all(
    rules.map((rule) => runRule(rule, options))
  );
  return {
    errors: results.flatMap((result) => result.errors),
  };
}

export type RunReportersInput = {
  reporters: readonly Reporter[];
  errors: readonly RuleError[];
};

export async function runReporters({
  reporters,
  errors,
}: RunReportersInput): Promise<void> {
  await Promise.all(
    reporters.map(async (reporter) => {
      await reporter.run({
        errors,
      });
    })
  );
}
