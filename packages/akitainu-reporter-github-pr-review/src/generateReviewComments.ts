import { ErrorsForDiff } from "./mapErrorsToDiff.js";
import { ReviewCommentMetadata } from "./reviewCommentMetadata.js";

/**
 * 'comments' item for github API
 */
export type ReviewComment = {
  path: string;
  position: number;
  body: string;
};

export function generateReviewComments(
  errors: readonly ErrorsForDiff[],
  metadataTag: string
): ReviewComment[] {
  return errors.map(({ filePath, position, error }) => {
    const metadata: ReviewCommentMetadata = {
      checker: error.checker,
      code: error.code,
    };
    const body = `🚥**${error.checker}** ${error.code}

${error.message}

<!-- ${metadataTag}: ${JSON.stringify(metadata)} -->`;
    return {
      path: filePath,
      position,
      body,
    };
  });
}
