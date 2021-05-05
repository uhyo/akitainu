import { RuleError } from "akitainu";
import path from "path";
import { upsert } from "./util/upsert.js";

const emptyArr = () => [];

export type RuleErrorWithLocation = RuleError & {
  location: NonNullable<RuleError["location"]>;
};

export function groupErrorsByFile(
  errors: readonly RuleError[],
  baseDir: string
): {
  errorsByFile: Map<string, RuleErrorWithLocation[]>;
  noLocationErrors: RuleError[];
} {
  const noLocationErrors: RuleError[] = [];
  const errorsByFile = new Map<string, RuleErrorWithLocation[]>();
  for (const error of errors) {
    if (!error.location) {
      noLocationErrors.push(error);
      continue;
    }
    const relativeFilePath = path.relative(baseDir, error.location.file);
    upsert(errorsByFile, relativeFilePath, emptyArr).push(
      // checked for existence of error.location above
      error as RuleErrorWithLocation
    );
  }
  return { errorsByFile, noLocationErrors };
}
