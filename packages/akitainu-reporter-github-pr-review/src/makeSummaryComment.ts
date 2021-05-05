import { RuleError } from "akitainu";
import { ErrorsForDiff } from "./mapErrorsToDiff.js";

export function makeSummaryComment(
  errors: readonly RuleError[],
  diffErrors: readonly ErrorsForDiff[],
  newReviewComments: readonly ErrorsForDiff[],
  metadataTag: string
): string {
  const totalErrors =
    errors.length === 1
      ? `Found **1** error in this pull request.\n`
      : `Found **${errors.length}** errors in this pull request.\n`;

  const newErrors =
    errors.length === 1
      ? ""
      : newReviewComments.length > 1
      ? `**${newReviewComments.length}** of them are new.\n`
      : `**One** of them is new.\n`;

  const notDiffErrorNum = errors.length - diffErrors.length;
  const notDiffErrors =
    notDiffErrorNum === 0
      ? ""
      : notDiffErrorNum === 1
      ? "There is one error that is not in the diff of this pull request.\n"
      : `There are ${notDiffErrorNum} errors that are not in the diff of this pull request.\n`;
  const metadata = `<!-- ${metadataTag}: {} -->`;

  const body = `🐕 ${totalErrors}${newErrors}${notDiffErrors}
${metadata}`;

  return body;
}
