export type {
  Checker,
  CheckerInput,
  CheckerResult,
  CheckError,
} from "./checker";
export type { RuleError } from "./core";
export type { Filter, FilterInput, FilterResult } from "./filter";
export type { Reporter, ReporterInput } from "./reporter";
export type { Source, SourceResult } from "./source";

/**
 * Run Akitainu.
 * Returns true when the check was successful.
 */
export async function run(): Promise<boolean> {
  return true;
}
