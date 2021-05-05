import { RuleError } from "../core/index.js";

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
