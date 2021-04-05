import { CheckError } from "../checker";
import { Reporter } from "../reporter";
import { Rule } from "../rule";

export type RunRuleResult = {
  errors: CheckError[];
};

export async function runRule(rule: Rule): Promise<RunRuleResult> {
  const filterResult = await rule.source?.run();
  const result = await rule.checker.run({
    targetFiles: filterResult?.targetFiles,
  });
  return {
    errors: result.errors,
  };
}

export type RunRulesResult = {
  errors: CheckError[];
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
  errors: readonly CheckError[];
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
