import { ErrorsForDiff } from "./mapErrorsToDiff";

/**
 * 'comments' item for github API
 */
export type ReviewComment = {
  path: string;
  position: number;
  body: string;
};

export function generateReviewComments(
  errors: readonly ErrorsForDiff[]
): ReviewComment[] {
  return errors.map(({ filePath, position, error }) => {
    const body = `🚥**${error.checker}** ${error.code}

${error.message}`;
    return {
      path: filePath,
      position,
      body,
    };
  });
}
