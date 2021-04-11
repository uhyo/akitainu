import { File } from "parse-diff";
import { RuleErrorWithLocation } from "./groupErrorsByFile";

/**
 * ReviewComment for GitHub API
 */
export type ErrorsForDiff = {
  filePath: string;
  position: number;
  error: RuleErrorWithLocation;
};

/**
 * Assumes errorsByFile is sorted by location
 */
export function mapErrorsToDiff(
  errorsByFile: ReadonlyMap<string, readonly RuleErrorWithLocation[]>,
  diffs: readonly File[]
): ErrorsForDiff[] {
  const result: ErrorsForDiff[] = [];
  for (const diff of diffs) {
    if (!diff.to) {
      continue;
    }
    const errorsForFile = errorsByFile.get(diff.to);
    if (!errorsForFile) {
      continue;
    }

    let nextErrorIndex = 0;
    let positionStart = 1;
    for (const chunk of diff.chunks) {
      const { changes } = chunk;
      console.log(chunk);

      for (const [changeIndex, change] of changes.entries()) {
        if (change.type === "del") {
          // this line no longer exists
          continue;
        }

        const lineNumber = change.type === "normal" ? change.ln2 : change.ln;

        let error: RuleErrorWithLocation | undefined;
        while ((error = errorsForFile[nextErrorIndex])) {
          if (error.location.line < lineNumber) {
            // already passed
            nextErrorIndex++;
            continue;
          }
          break;
        }

        if (error === undefined) {
          break;
        }

        if (lineNumber === error.location.line) {
          result.push({
            filePath: diff.to,
            position: positionStart + changeIndex,
            error,
          });
          nextErrorIndex++;
        }
      }
      positionStart += changes.length;
    }
  }
  return result;
}
