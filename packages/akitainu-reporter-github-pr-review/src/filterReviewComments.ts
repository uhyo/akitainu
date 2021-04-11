import { getReviewPositionString } from "./getExistingReviews";
import { ErrorsForDiff } from "./mapErrorsToDiff";

export function filterReviewComments(
  errors: readonly ErrorsForDiff[],
  existingReviews: Set<string>
): ErrorsForDiff[] {
  return errors.filter(
    (error) =>
      !existingReviews.has(
        getReviewPositionString(
          error.filePath,
          error.position,
          error.error.checker,
          error.error.code
        )
      )
  );
}
