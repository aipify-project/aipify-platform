import {
  FEEDBACK_REVIEW_DISPOSITION_READY,
  type FeedbackOpsRow,
} from "@/lib/website-kompis-feedback/operations-model";
import { explicitBulkIds, reviewReasonOk } from "@/lib/website-kompis-feedback/review-outcome";

export const COMPLETE_FEEDBACK_REVIEW_RPC = "complete_website_kompis_feedback_review_as_published" as const;
export const REJECT_FEEDBACK_REVIEW_RPC = "reject_website_kompis_feedback_review" as const;
export const DUPLICATE_FEEDBACK_REVIEW_RPC = "mark_website_kompis_feedback_review_duplicate" as const;
export const RETRIEVAL_FEEDBACK_REVIEW_RPC = "mark_website_kompis_feedback_retrieval_unresolved" as const;
export const BULK_FEEDBACK_REVIEW_RPC = "bulk_dispose_website_kompis_feedback_reviews" as const;
export const GET_FEEDBACK_REVIEW_QUEUE_RPC = "get_website_kompis_feedback_review_queue" as const;

export const REVIEW_QUEUE_PAGE_LIMIT = 100;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isFeedbackUuid(value: string): boolean {
  return UUID_RE.test(value);
}

export type DispositionAction = "published" | "rejected" | "duplicate" | "retrieval_unresolved";

export function buildPublishedDispositionCall(input: {
  feedbackId: string;
  faqItemId: string;
  feedbackInstallId: string;
  faqInstallId: string;
  publishStatus: string | null | undefined;
}):
  | {
      ok: true;
      rpc: typeof COMPLETE_FEEDBACK_REVIEW_RPC;
      args: { p_feedback_id: string; p_faq_item_id: string; p_confirmation: true };
    }
  | { ok: false; reason: "not_published" | "missing_faq" | "install_mismatch" | "invalid_id" } {
  if (!isFeedbackUuid(input.feedbackId) || !isFeedbackUuid(input.faqItemId)) {
    return { ok: false, reason: "invalid_id" };
  }
  if (input.publishStatus !== "published") return { ok: false, reason: "not_published" };
  if (!input.faqItemId) return { ok: false, reason: "missing_faq" };
  if (input.feedbackInstallId && input.feedbackInstallId !== input.faqInstallId) {
    return { ok: false, reason: "install_mismatch" };
  }
  return {
    ok: true,
    rpc: COMPLETE_FEEDBACK_REVIEW_RPC,
    args: {
      p_feedback_id: input.feedbackId.toLowerCase(),
      p_faq_item_id: input.faqItemId.toLowerCase(),
      p_confirmation: true,
    },
  };
}

export function buildRejectDispositionCall(
  feedbackId: string,
  reason: string,
):
  | {
      ok: true;
      rpc: typeof REJECT_FEEDBACK_REVIEW_RPC;
      args: { p_feedback_id: string; p_reason: string; p_confirmation: true };
    }
  | { ok: false; reason: "invalid_id" | "reason" } {
  if (!isFeedbackUuid(feedbackId)) return { ok: false, reason: "invalid_id" };
  if (!reviewReasonOk(reason)) return { ok: false, reason: "reason" };
  return {
    ok: true,
    rpc: REJECT_FEEDBACK_REVIEW_RPC,
    args: { p_feedback_id: feedbackId.toLowerCase(), p_reason: reason.trim(), p_confirmation: true },
  };
}

export function buildDuplicateDispositionCall(
  feedbackId: string,
  reason: string,
):
  | {
      ok: true;
      rpc: typeof DUPLICATE_FEEDBACK_REVIEW_RPC;
      args: { p_feedback_id: string; p_reason: string; p_confirmation: true };
    }
  | { ok: false; reason: "invalid_id" | "reason" } {
  if (!isFeedbackUuid(feedbackId)) return { ok: false, reason: "invalid_id" };
  if (!reviewReasonOk(reason)) return { ok: false, reason: "reason" };
  return {
    ok: true,
    rpc: DUPLICATE_FEEDBACK_REVIEW_RPC,
    args: { p_feedback_id: feedbackId.toLowerCase(), p_reason: reason.trim(), p_confirmation: true },
  };
}

export function buildRetrievalDispositionCall(input: {
  feedbackId: string;
  faqItemId: string;
  reason: string;
}):
  | {
      ok: true;
      rpc: typeof RETRIEVAL_FEEDBACK_REVIEW_RPC;
      args: { p_feedback_id: string; p_faq_item_id: string; p_reason: string; p_confirmation: true };
    }
  | { ok: false; reason: "invalid_id" | "reason" } {
  if (!isFeedbackUuid(input.feedbackId) || !isFeedbackUuid(input.faqItemId)) {
    return { ok: false, reason: "invalid_id" };
  }
  if (!reviewReasonOk(input.reason)) return { ok: false, reason: "reason" };
  return {
    ok: true,
    rpc: RETRIEVAL_FEEDBACK_REVIEW_RPC,
    args: {
      p_feedback_id: input.feedbackId.toLowerCase(),
      p_faq_item_id: input.faqItemId.toLowerCase(),
      p_reason: input.reason.trim(),
      p_confirmation: true,
    },
  };
}

export function buildBulkDispositionCall(input: {
  feedbackIds: readonly string[];
  action: "rejected" | "duplicate";
  reason: string;
}):
  | {
      ok: true;
      rpc: typeof BULK_FEEDBACK_REVIEW_RPC;
      args: { p_feedback_ids: string[]; p_disposition: "rejected" | "duplicate"; p_reason: string; p_confirmation: true };
    }
  | { ok: false; reason: "batch" | "reason" } {
  const ids = explicitBulkIds(input.feedbackIds);
  if (!ids.ok) return ids;
  if (!reviewReasonOk(input.reason)) return { ok: false, reason: "reason" };
  return {
    ok: true,
    rpc: BULK_FEEDBACK_REVIEW_RPC,
    args: {
      p_feedback_ids: ids.ids,
      p_disposition: input.action,
      p_reason: input.reason.trim(),
      p_confirmation: true,
    },
  };
}

export function retryFaqId(savedFaqId: string | null | undefined): string | null {
  const id = savedFaqId?.trim() ?? "";
  return isFeedbackUuid(id) ? id.toLowerCase() : null;
}

export function shouldRemoveReviewCard(input: {
  httpOk: boolean;
  reviewDisposition?: string | null;
  expected: DispositionAction;
}): boolean {
  return input.httpOk && input.reviewDisposition === input.expected;
}

export function buildReviewQueueRpcArgs(input: {
  limit: number;
  queue: "review" | "history";
  before?: string | null;
  beforeId?: string | null;
}):
  | {
      ok: true;
      rpc: typeof GET_FEEDBACK_REVIEW_QUEUE_RPC;
      args: {
        p_limit: number;
        p_queue: "review" | "history";
        p_before: string | null;
        p_before_id: string | null;
      };
    }
  | { ok: false; reason: "cursor" } {
  const before = input.before?.trim() || null;
  const beforeId = input.beforeId?.trim() || null;
  if (Boolean(before) !== Boolean(beforeId)) return { ok: false, reason: "cursor" };
  if (beforeId && !isFeedbackUuid(beforeId)) return { ok: false, reason: "cursor" };
  const limit = Math.min(REVIEW_QUEUE_PAGE_LIMIT, Math.max(1, Math.trunc(input.limit) || REVIEW_QUEUE_PAGE_LIMIT));
  return {
    ok: true,
    rpc: GET_FEEDBACK_REVIEW_QUEUE_RPC,
    args: {
      p_limit: limit,
      p_queue: input.queue,
      p_before: before,
      p_before_id: beforeId ? beforeId.toLowerCase() : null,
    },
  };
}

export function cursorFromQueuePage(
  items: { id: string; createdAt: string }[],
  pageLimit = REVIEW_QUEUE_PAGE_LIMIT,
): { before: string; beforeId: string } | null {
  const limit = Math.min(REVIEW_QUEUE_PAGE_LIMIT, Math.max(1, Math.trunc(pageLimit) || REVIEW_QUEUE_PAGE_LIMIT));
  if (items.length < limit) return null;
  const last = items[items.length - 1];
  if (!last?.id || !last.createdAt) return null;
  return { before: last.createdAt, beforeId: last.id };
}

export type PagedFeedbackRow = {
  id: string;
  tenantId: string;
  installId: string;
  createdAt: string;
  vote: "helpful" | "not_helpful";
  reviewDisposition: "open" | "published" | "retrieval_unresolved" | "rejected" | "duplicate";
};

export function feedbackQueueMembership(row: PagedFeedbackRow, queue: "review" | "history"): boolean {
  if (queue === "review") return row.reviewDisposition === "open" && row.vote === "not_helpful";
  return (
    row.vote === "helpful" ||
    row.reviewDisposition === "published" ||
    row.reviewDisposition === "retrieval_unresolved" ||
    row.reviewDisposition === "rejected" ||
    row.reviewDisposition === "duplicate"
  );
}

function feedbackSortsBeforeCursor(row: PagedFeedbackRow, createdAt: string, id: string): boolean {
  if (row.createdAt !== createdAt) return row.createdAt < createdAt;
  return row.id < id;
}

export function pageFeedbackReviewRows(
  rows: readonly PagedFeedbackRow[],
  input: {
    tenantId: string;
    queue: "review" | "history";
    before?: string | null;
    beforeId?: string | null;
    limit?: number;
  },
):
  | { ok: true; items: PagedFeedbackRow[]; next: { before: string; beforeId: string } | null }
  | { ok: false; reason: "cursor" | "row" | "tenant" } {
  if (!input.tenantId.trim()) return { ok: false, reason: "tenant" };
  const before = input.before?.trim() || null;
  const beforeId = input.beforeId?.trim().toLowerCase() || null;
  if (Boolean(before) !== Boolean(beforeId)) return { ok: false, reason: "cursor" };
  if (beforeId && !isFeedbackUuid(beforeId)) return { ok: false, reason: "cursor" };
  const limit = Math.min(REVIEW_QUEUE_PAGE_LIMIT, Math.max(1, Math.trunc(input.limit ?? REVIEW_QUEUE_PAGE_LIMIT) || REVIEW_QUEUE_PAGE_LIMIT));
  const eligible = rows.filter((row) => row.tenantId === input.tenantId && feedbackQueueMembership(row, input.queue));
  if (eligible.some((row) => !row.id || !row.createdAt || !isFeedbackUuid(row.id))) return { ok: false, reason: "row" };
  if (new Set(eligible.map((row) => row.id)).size !== eligible.length) return { ok: false, reason: "row" };
  const ranked = [...eligible].sort((left, right) => {
    if (left.createdAt !== right.createdAt) return left.createdAt < right.createdAt ? 1 : -1;
    if (left.id !== right.id) return left.id < right.id ? 1 : -1;
    return 0;
  });
  const page = ranked.filter((row) => !before || !beforeId || feedbackSortsBeforeCursor(row, before, beforeId)).slice(0, limit);
  return { ok: true, items: page, next: cursorFromQueuePage(page, limit) };
}

const QUEUE_VOTES = new Set(["helpful", "not_helpful"]);
const QUEUE_DISPOSITIONS = new Set(["open", "published", "retrieval_unresolved", "rejected", "duplicate"]);
const CLOSED_DISPOSITIONS = new Set(["published", "retrieval_unresolved", "rejected", "duplicate"]);

export type FeedbackReviewQueuePage = {
  items: FeedbackOpsRow[];
  next: { before: string; beforeId: string } | null;
  openReviewCount: number;
  publishedCount: number;
  rejectedCount: number;
};

export function isOpenNegativeReview(row: Pick<FeedbackOpsRow, "vote" | "reviewDisposition" | "reviewStatus">): boolean {
  return (
    row.vote === "not_helpful" &&
    row.reviewDisposition !== "published" &&
    row.reviewDisposition !== "retrieval_unresolved" &&
    row.reviewDisposition !== "rejected" &&
    row.reviewDisposition !== "duplicate" &&
    row.reviewStatus !== "closed"
  );
}

export function isHistoryFeedback(row: Pick<FeedbackOpsRow, "vote" | "reviewDisposition" | "reviewStatus">): boolean {
  return (
    row.vote === "helpful" ||
    row.reviewDisposition === "published" ||
    row.reviewDisposition === "retrieval_unresolved" ||
    row.reviewDisposition === "rejected" ||
    row.reviewDisposition === "duplicate" ||
    row.reviewStatus === "closed"
  );
}

export function mapReviewQueueItem(raw: unknown): FeedbackOpsRow | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  if (typeof row.id !== "string" || typeof row.created_at !== "string") return null;
  if (typeof row.vote !== "string" || !QUEUE_VOTES.has(row.vote)) return null;
  const disposition = typeof row.review_disposition === "string" ? row.review_disposition : "open";
  if (!QUEUE_DISPOSITIONS.has(disposition)) return null;
  const reviewDisposition = disposition as NonNullable<FeedbackOpsRow["reviewDisposition"]>;
  return {
    id: row.id,
    vote: row.vote as FeedbackOpsRow["vote"],
    comment: typeof row.comment === "string" ? row.comment : null,
    questionPreview: typeof row.question_preview === "string" ? row.question_preview : "",
    answerPreview: typeof row.answer_preview === "string" ? row.answer_preview : "",
    pagePathname: typeof row.page_pathname === "string" ? row.page_pathname : null,
    locale: typeof row.locale === "string" ? row.locale : null,
    createdAt: row.created_at,
    reviewDisposition,
    reviewStatus: CLOSED_DISPOSITIONS.has(reviewDisposition) ? "closed" : "open",
    reviewedAt: typeof row.reviewed_at === "string" ? row.reviewed_at : null,
    installId: typeof row.install_id === "string" ? row.install_id : null,
    publishedFaqItemId: typeof row.published_faq_item_id === "string" ? row.published_faq_item_id : null,
    reviewReason: typeof row.review_reason === "string" ? row.review_reason : null,
    followUpStatus: row.follow_up_status === "open" ? "open" : "none",
  };
}

export function dispositionUnavailable(ready = FEEDBACK_REVIEW_DISPOSITION_READY): boolean {
  return ready !== true;
}
