export type {
  Checker,
  CheckerInput,
  CheckerResult,
  CheckError,
} from "./checker/index.js";
export type { AkitainuConfig } from "./core/config.js";
export type { Filter, FilterInput, FilterResult } from "./filter/index.js";
export type { Reporter, ReporterInput } from "./reporter/index.js";
export type { Source, SourceResult } from "./source/index.js";
export type { RuleError, AkitainuResult };
import { AkitainuResult, main } from "./core/main.js";
import type { RuleError } from "./core/runRule.js";

/**
 * Run Akitainu.
 */
export function run(configFile?: string): Promise<AkitainuResult> {
  return main(configFile);
}
