import { CheckError } from "../checker";
import { Reporter } from "../reporter";
import { Rule } from "../rule";

export type RuleError = CheckError & {
  /**
   * Name of checker that produced this error.
   */
  checker: string;
};

export type RunRuleResult = {
  errors: RuleError[];
};

export async function runRule(rule: Rule): Promise<RunRuleResult> {
  const sourceResult = await rule.source?.run();
  const result = await rule.checker.run({
    targetFiles: sourceResult?.targetFiles,
  });
  const ruleErrors = result.errors.map((err) => ({
    ...err,
    checker: rule.checker.name,
  }));

  const filterResult = (await rule.filter?.run({
    errors: ruleErrors,
  })) ?? { errors: ruleErrors };

  return {
    errors: filterResult.errors,
  };
}

export type RunRulesResult = {
  errors: RuleError[];
};

export async function runRules(
  rules: readonly Rule[]
): Promise<RunRulesResult> {
  const results = await Promise.all(rules.map(runRule));
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
