import { CheckError } from "../checker";
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
