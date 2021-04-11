import { RuleError } from "akitainu/src/core";
import { exec } from "child_process";
import { Octokit } from "octokit";
import parseDiff from "parse-diff";
import { promisify } from "util";
import { filterReviewComments } from "./filterReviewComments";
import { generateReviewComments } from "./generateReviewComments";
import { getExistingReviews } from "./getExistingReviews";
import { groupErrorsByFile } from "./groupErrorsByFile";
import { makeSummaryComment } from "./makeSummaryComment";
import { mapErrorsToDiff } from "./mapErrorsToDiff";

export type Repo = {
  owner: string;
  repo: string;
};

export async function run(
  errors: readonly RuleError[],
  octokit: Octokit,
  prNumber: number,
  repo: Repo,
  metadataTag: string
): Promise<void> {
  if (errors.length === 0) {
    // no errors! :tada:
    return;
  }
  // get toplevel directory of git
  const { stdout: gitToplevelDir } = await promisify(exec)(
    "git rev-parse --show-toplevel"
  );
  const prDiff = octokit.rest.pulls.get({
    ...repo,
    pull_number: prNumber,
    mediaType: {
      format: "diff",
    },
  });

  const { errorsByFile } = groupErrorsByFile(errors, gitToplevelDir.trim());
  // sort errors by position
  for (const errors of errorsByFile.values()) {
    errors.sort(
      (a, b) =>
        a.location.line - b.location.line ||
        a.location.column - b.location.column
    );
  }

  // we specified `format: "diff"` so data is a string diff
  const diff = ((await prDiff).data as unknown) as string;

  const existingReviewsP = getExistingReviews(
    octokit,
    repo,
    prNumber,
    metadataTag
  );

  // console.log(diff);
  // console.log(errorsByFile);

  const parsedDiff = parseDiff(diff);
  const diffErrors = mapErrorsToDiff(errorsByFile, parsedDiff);

  const existingReviews = await existingReviewsP;

  const newReviewComments = filterReviewComments(diffErrors, existingReviews);

  if (newReviewComments.length === 0) {
    // no new comments
    return;
  }

  const comments = generateReviewComments(newReviewComments, metadataTag);

  const body = makeSummaryComment(
    errors,
    diffErrors,
    newReviewComments,
    metadataTag
  );

  await octokit.rest.pulls.createReview({
    ...repo,
    pull_number: prNumber,
    event: "COMMENT",
    body,
    comments,
  });
}
