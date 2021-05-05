export type {
  Checker,
  CheckerInput,
  CheckerResult,
  CheckError,
} from "./checker/index.js";
export type { RuleError } from "./core/index.js";
export type { Filter, FilterInput, FilterResult } from "./filter/index.js";
export type { Reporter, ReporterInput } from "./reporter/index.js";
export type { Source, SourceResult } from "./source/index.js";

/**
 * Run Akitainu.
 * Returns true when the check was successful.
 */
export async function run(): Promise<boolean> {
  return true;
}
