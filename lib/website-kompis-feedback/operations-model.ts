/**
 * Job 64 — safe APP presentation model for Website Kompis Q&A / feedback operations.
 * Uses only fields returned by get_website_kompis_answer_feedback_overview (no new schema).
 */

import type { WebsiteKompisAnswerFeedbackVote } from "@/lib/marketing/website-kompis-answer-feedback";

export type FeedbackOpsVoteFilter = "all" | "helpful" | "not_helpful";
export type FeedbackOpsCommentFilter = "all" | "with_comment" | "without_comment";

export type FeedbackOpsRow = {
  id: string;
  vote: WebsiteKompisAnswerFeedbackVote;
  comment: string | null;
  questionPreview: string;
  answerPreview: string;
  pagePathname: string | null;
  locale: string | null;
  createdAt: string;
  reviewStatus?: "open" | "closed" | null;
  reviewedAt?: string | null;
};

export type FeedbackOpsStatusTone = "emerald" | "amber" | "slate" | "purple" | "review";

/** Active review only. Not a global warning color. */
export const FEEDBACK_REVIEW_BADGE_CLASS =
  "bg-[#FDECEC] text-[#9F1239] ring-[#F3C1C1]";

export type FeedbackOpsStatus = {
  tone: FeedbackOpsStatusTone;
  /** i18n key suffix under customerApp.websiteKompisFeedback.status.* */
  key: "helpful" | "needsReview" | "commented" | "noFeedbackSignal" | "closed";
};

export type FeedbackOpsNextAction = {
  /** i18n key suffix under customerApp.websiteKompisFeedback.actions.* */
  key: "reviewAnswer" | "openFaq" | "suggestFaqDraft" | "checkConnection";
  href?: string;
};

/** Privacy / field matrix (authoritative for APP exposure). */
export const WEBSITE_KOMPIS_FEEDBACK_FIELD_MATRIX = [
  {
    field: "feedback.id",
    source: "website_kompis_answer_feedback.id",
    tenantGate: "RPC _wpkf_auth_tenant_id + owner/admin",
    sensitivity: "internal_id",
    ownerVisible: true,
    mask: "none",
  },
  {
    field: "question_preview",
    source: "website_kompis_answer_receipts.question (left 180)",
    tenantGate: "same",
    sensitivity: "visitor_content",
    ownerVisible: true,
    mask: "preview_only_until_detail_rpc",
  },
  {
    field: "answer_preview",
    source: "website_kompis_answer_receipts.answer_text (left 220)",
    tenantGate: "same",
    sensitivity: "assistant_content",
    ownerVisible: true,
    mask: "preview_only_until_detail_rpc",
  },
  {
    field: "vote",
    source: "website_kompis_answer_feedback.vote",
    tenantGate: "same",
    sensitivity: "low",
    ownerVisible: true,
    mask: "none",
  },
  {
    field: "comment",
    source: "website_kompis_answer_feedback.comment",
    tenantGate: "same",
    sensitivity: "visitor_content",
    ownerVisible: true,
    mask: "none",
  },
  {
    field: "page_pathname",
    source: "receipts.page_pathname",
    tenantGate: "same",
    sensitivity: "low",
    ownerVisible: true,
    mask: "none",
  },
  {
    field: "locale",
    source: "receipts.locale",
    tenantGate: "same",
    sensitivity: "low",
    ownerVisible: true,
    mask: "none",
  },
  {
    field: "visitor_key_hash",
    source: "feedback.visitor_key_hash",
    tenantGate: "n/a",
    sensitivity: "pseudonym",
    ownerVisible: false,
    mask: "never_return_to_app",
  },
  {
    field: "sources",
    source: "receipts.sources jsonb",
    tenantGate: "exists in DB; not in overview RPC",
    sensitivity: "public_urls",
    ownerVisible: false,
    mask: "blocked_until_detail_rpc",
  },
  {
    field: "system_prompt / provider payload",
    source: "not stored on receipts",
    tenantGate: "n/a",
    sensitivity: "secret",
    ownerVisible: false,
    mask: "never",
  },
] as const;

export function resolveFeedbackOpsStatus(row: FeedbackOpsRow): FeedbackOpsStatus {
  if (row.reviewStatus === "closed") {
    return { tone: "slate", key: "closed" };
  }
  if (row.vote === "not_helpful") {
    return { tone: "review", key: "needsReview" };
  }
  if (row.comment?.trim()) {
    return { tone: "purple", key: "commented" };
  }
  return { tone: "emerald", key: "helpful" };
}

export function buildFaqSuggestHref(input: {
  questionPreview: string;
  locale: string | null;
}): string {
  const params = new URLSearchParams();
  const question = input.questionPreview.trim().slice(0, 500);
  if (question) params.set("suggestQuestion", question);
  if (input.locale?.trim()) params.set("suggestLocale", input.locale.trim().slice(0, 16));
  params.set("fromFeedback", "1");
  const qs = params.toString();
  return qs ? `/app/website-kompis/faq?${qs}` : "/app/website-kompis/faq";
}

export function nextActionsForFeedbackRow(row: FeedbackOpsRow): FeedbackOpsNextAction[] {
  const actions: FeedbackOpsNextAction[] = [{ key: "reviewAnswer" }];
  if (row.vote === "not_helpful") {
    actions.push({
      key: "suggestFaqDraft",
      href: buildFaqSuggestHref({
        questionPreview: row.questionPreview,
        locale: row.locale,
      }),
    });
  }
  actions.push({ key: "openFaq", href: "/app/website-kompis/faq" });
  return actions;
}

export function filterFeedbackOpsRows(
  rows: FeedbackOpsRow[],
  filters: {
    vote: FeedbackOpsVoteFilter;
    comment: FeedbackOpsCommentFilter;
    query: string;
    locale: string;
    page: string;
    dateFrom?: string;
    dateTo?: string;
  },
): FeedbackOpsRow[] {
  const q = filters.query.trim().toLowerCase();
  const locale = filters.locale.trim().toLowerCase();
  const page = filters.page.trim().toLowerCase();

  return rows.filter((row) => {
    if (filters.vote !== "all" && row.vote !== filters.vote) return false;
    const hasComment = Boolean(row.comment?.trim());
    if (filters.comment === "with_comment" && !hasComment) return false;
    if (filters.comment === "without_comment" && hasComment) return false;
    if (locale && (row.locale ?? "").toLowerCase() !== locale) return false;
    if (page && !(row.pagePathname ?? "").toLowerCase().includes(page)) return false;
    const day = createdDay(row.createdAt);
    if (filters.dateFrom && day && day < filters.dateFrom) return false;
    if (filters.dateTo && day && day > filters.dateTo) return false;
    if (q) {
      const hay = [
        row.questionPreview,
        row.answerPreview,
        row.comment ?? "",
        row.pagePathname ?? "",
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

/**
 * Knowledge-gap queue from existing signals only:
 * not_helpful feedback (optionally with comments). Not security rejects — those are not stored here.
 */
export function selectKnowledgeGapCandidates(rows: FeedbackOpsRow[]): FeedbackOpsRow[] {
  return rows
    .filter((row) => row.vote === "not_helpful" && row.reviewStatus !== "closed")
    .slice()
    .sort((a, b) => {
      const ac = a.comment?.trim() ? 1 : 0;
      const bc = b.comment?.trim() ? 1 : 0;
      if (ac !== bc) return bc - ac;
      return String(b.createdAt).localeCompare(String(a.createdAt));
    });
}

/** Persisted owner approval does not exist. Hiding a row is not approval. */
export const OWNER_REVIEW_APPROVAL_SUPPORTED = false;

/**
 * The close RPC is not in Core yet. The button stays off until the owner
 * applies the reviewed SQL file and this flag is turned on in a later change.
 */
export const FEEDBACK_REVIEW_CLOSE_READY = false;

/**
 * The disposition RPCs are not in Core yet. Review completion and spam
 * rejection stay off until the owner applies the disposition SQL and a later
 * change turns this flag on. The existing overview remains the live queue.
 */
export const FEEDBACK_REVIEW_DISPOSITION_READY = false;

export function canOfferFeedbackReviewClose(
  row: Pick<FeedbackOpsRow, "vote" | "reviewStatus">,
  ready = FEEDBACK_REVIEW_CLOSE_READY,
): boolean {
  return ready && row.vote === "not_helpful" && row.reviewStatus !== "closed";
}

export const FEEDBACK_REVIEW_PAGE_SIZE = 8;

function createdDay(value: string): string {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return "";
  return new Date(parsed).toISOString().slice(0, 10);
}

/**
 * Active review is negative feedback only.
 * Helpful ratings stay historical evidence, including when they have a comment.
 * Unanswered and fallback events are not in this read.
 */
export function partitionFeedbackWorkspace(rows: FeedbackOpsRow[]): {
  review: FeedbackOpsRow[];
  history: FeedbackOpsRow[];
} {
  const review = selectKnowledgeGapCandidates(rows);
  const reviewIds = new Set(review.map((row) => row.id));
  const history = rows
    .filter((row) => !reviewIds.has(row.id))
    .slice()
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  return { review, history };
}

export function takeFeedbackPage<T>(rows: T[], visible: number): { items: T[]; hasMore: boolean } {
  const count = Math.max(FEEDBACK_REVIEW_PAGE_SIZE, visible);
  return { items: rows.slice(0, count), hasMore: rows.length > count };
}

/** Unanswered / rejected / technical error are NOT available in current overview schema. */
export const FEEDBACK_OPS_UNSUPPORTED_WITHOUT_MIGRATION = [
  "full_answer_and_sources_detail_rpc",
  "structured_negative_reason_codes",
  "owner_review_state",
  "cursor_pagination_and_server_filters",
  "list_all_answer_receipts_without_feedback",
  "unanswered_or_rejected_ask_outcomes",
  "security_reject_vs_knowledge_gap_split",
] as const;
