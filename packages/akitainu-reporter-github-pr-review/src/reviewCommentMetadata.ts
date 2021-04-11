export type ReviewCommentMetadata = {
  checker: string;
  code: string;
};

export function isReviewCommentMetadata(
  data: unknown
): data is ReviewCommentMetadata {
  if (data === null || data === undefined) {
    return false;
  }
  // now data is property-accessible
  const d = data as Record<string, unknown>;
  return typeof d.checker === "string" && typeof d.code === "string";
}
