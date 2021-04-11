import { Octokit } from "octokit";
import { isReviewCommentMetadata } from "./reviewCommentMetadata";
import { Repo } from "./run";

export function getReviewPositionString(
  path: string,
  position: number,
  checker: string,
  code: string
): string {
  return `${path}$$$${position}$$$${checker}$$$${code}`;
}

/**
 * Fetch existing reviews from GitHub and sort.
 * Result is set of strings of form `filePath$$$position$$$checker$$$code`
 */
export async function getExistingReviews(
  octokit: Octokit,
  repo: Repo,
  prNumber: number,
  metadataTag: string
): Promise<Set<string>> {
  const result = new Set<string>();
  const iter = octokit.paginate.iterator(
    octokit.rest.pulls.listReviewComments,
    {
      ...repo,
      pull_number: prNumber,
    }
  );
  for await (const { data } of iter) {
    for (const comment of data) {
      const commentLineMatch = comment.body.match(/<!--(.+)-->\s*$/);
      if (!commentLineMatch) {
        continue;
      }
      const commentLine = (commentLineMatch[1] as string).trim();
      if (!commentLine.startsWith(`${metadataTag}:`)) {
        continue;
      }
      try {
        const metadata = JSON.parse(
          commentLine.slice(metadataTag.length + 1).trim()
        );
        if (!isReviewCommentMetadata(metadata)) {
          continue;
        }
        result.add(
          getReviewPositionString(
            comment.path,
            comment.position,
            metadata.checker,
            metadata.code
          )
        );
        metadata;
      } catch {
        continue;
      }
    }
  }
  return result;
}
