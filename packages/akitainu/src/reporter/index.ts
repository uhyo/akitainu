import { RuleError } from "../core/runRule.js";

export type ReporterInput = {
  errors: readonly RuleError[];
};

export type Reporter = {
  /**
   * Name of reporter.
   */
  name: string;
  run: (input: ReporterInput) => Promise<void>;
};
