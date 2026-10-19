export type FeedbackCloseOutcome =
  | "closed"
  | "unavailable"
  | "forbidden"
  | "missing"
  | "failed";

export function interpretFeedbackCloseResponse(input: {
  httpStatus: number;
  reviewStatus?: string | null;
  code?: string | null;
}): FeedbackCloseOutcome {
  if (input.httpStatus === 200 && input.reviewStatus === "closed") return "closed";
  if (input.httpStatus === 501 || input.code === "review_close_unavailable") return "unavailable";
  if (input.httpStatus === 403) return "forbidden";
  if (input.httpStatus === 404) return "missing";
  return "failed";
}
