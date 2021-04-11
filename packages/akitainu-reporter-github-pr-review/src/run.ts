import { RuleError } from "akitainu/src/core";
import { exec } from "child_process";
import { Octokit } from "octokit";
import parseDiff from "parse-diff";
import { promisify } from "util";
import { generateReviewComments } from "./generateReviewComments";
import { groupErrorsByFile } from "./groupErrorsByFile";
import { mapErrorsToDiff } from "./mapErrorsToDiff";

type Repo = {
  owner: string;
  repo: string;
};

export async function run(
  errors: readonly RuleError[],
  octokit: Octokit,
  prNumber: number,
  repo: Repo
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

  const { noLocationErrors, errorsByFile } = groupErrorsByFile(
    errors,
    gitToplevelDir.trim()
  );
  // sort errors by position
  for (const errors of errorsByFile.values()) {
    errors.sort(
      (a, b) =>
        a.location.line - b.location.line ||
        a.location.column - b.location.column
    );
  }
  console.log(noLocationErrors);
  console.log(errorsByFile);

  // we specified `format: "diff"` so data is a string diff
  const diff = ((await prDiff).data as unknown) as string;
  console.log(diff);
  const parsedDiff = parseDiff(diff);
  console.log(parsedDiff[0]);
  const diffErrors = mapErrorsToDiff(errorsByFile, parsedDiff);

  const comments = generateReviewComments(diffErrors);

  const body = `🐕 Found **${errors.length}** error${
    errors.length > 1 ? "s" : ""
  }.

<!-- akitainu: {} -->`;

  await octokit.rest.pulls.createReview({
    ...repo,
    pull_number: prNumber,
    event: "COMMENT",
    body,
    comments,
  });
}
