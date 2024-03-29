import { RuleError } from "../core/runRule.js";

export type FilterInput = {
  readonly errors: RuleError[];
};

export type FilterResult = {
  errors: RuleError[];
};

export type Filter = {
  /**
   * Name of filter.
   */
  name: string;
  run: (input: FilterInput) => Promise<FilterResult>;
};
