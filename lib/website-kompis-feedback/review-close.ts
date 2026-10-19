import type { FeedbackOpsRow } from "@/lib/website-kompis-feedback/operations-model";

export type FeedbackCloseOutcome =
  | "closed"
  | "unavailable"
  | "forbidden"
  | "missing"
  | "failed";

export type FeedbackReviewCursor = {
  before: string;
  beforeId: string;
};

export type FeedbackReviewPage = {
  rows: FeedbackOpsRow[];
  hasMore: boolean;
  next: FeedbackReviewCursor | null;
};

/**
 * Close stays off until Core returns both flags from the page contract.
 * A hardcoded ready flag is not evidence that the RPC is deployed.
 */
export function feedbackReviewCloseCapability(input: {
  reviewCloseReady?: unknown;
  reviewPageReady?: unknown;
}): boolean {
  return input.reviewCloseReady === true && input.reviewPageReady === true;
}

function reviewStatusOf(value: unknown): "open" | "closed" | null {
  return value === "open" || value === "closed" ? value : null;
}

export function parseFeedbackReviewPage(value: unknown): FeedbackReviewPage | null {
  if (!value || typeof value !== "object") return null;
  const page = value as Record<string, unknown>;
  const rows = (Array.isArray(page.rows) ? page.rows : [])
    .filter((entry): entry is Record<string, unknown> => !!entry && typeof entry === "object")
    .map((entry) => ({
      id: String(entry.id ?? ""),
      vote: (entry.vote === "not_helpful" ? "not_helpful" : "helpful") as FeedbackOpsRow["vote"],
      comment: typeof entry.comment === "string" ? entry.comment : null,
      questionPreview: String(entry.question_preview ?? entry.questionPreview ?? ""),
      answerPreview: String(entry.answer_preview ?? entry.answerPreview ?? ""),
      pagePathname:
        typeof entry.page_pathname === "string"
          ? entry.page_pathname
          : typeof entry.pagePathname === "string"
            ? entry.pagePathname
            : null,
      locale: typeof entry.locale === "string" ? entry.locale : null,
      createdAt: String(entry.created_at ?? entry.createdAt ?? ""),
      reviewStatus: reviewStatusOf(entry.review_status ?? entry.reviewStatus),
      reviewedAt:
        typeof entry.reviewed_at === "string"
          ? entry.reviewed_at
          : typeof entry.reviewedAt === "string"
            ? entry.reviewedAt
            : null,
    }))
    .filter((entry) => entry.id);
  const before = typeof page.next_before === "string"
    ? page.next_before
    : typeof page.nextBefore === "string"
      ? page.nextBefore
      : "";
  const beforeId = typeof page.next_before_id === "string"
    ? page.next_before_id
    : typeof page.nextBeforeId === "string"
      ? page.nextBeforeId
      : "";
  const next = before && beforeId ? { before, beforeId } : null;
  return {
    rows,
    hasMore: page.has_more === true || page.hasMore === true ? next != null : false,
    next,
  };
}

export function appendFeedbackRows(current: FeedbackOpsRow[], incoming: FeedbackOpsRow[]): FeedbackOpsRow[] {
  const seen = new Set(current.map((row) => row.id));
  return current.concat(incoming.filter((row) => !seen.has(row.id)));
}

export function reviewQueueAfterClose(
  rows: FeedbackOpsRow[],
  id: string,
  outcome: FeedbackCloseOutcome,
): FeedbackOpsRow[] {
  if (outcome !== "closed") return rows;
  return rows.map((row) =>
    row.id === id && row.vote === "not_helpful" && row.reviewStatus !== "closed"
      ? { ...row, reviewStatus: "closed" as const }
      : row,
  );
}

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
