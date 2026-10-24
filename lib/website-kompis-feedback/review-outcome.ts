import { FEEDBACK_REVIEW_DISPOSITION_READY } from "@/lib/website-kompis-feedback/operations-model";

export const FEEDBACK_REVIEW_BULK_LIMIT = 25;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type ReviewFaqCandidate = {
  tenantId: string;
  installId: string;
  locale: string | null;
  status: string | null;
  publicSafe: boolean;
  surface: "public_faq" | "private_knowledge";
};

export type ReviewCaseScope = {
  tenantId: string;
  installId: string;
  locale: string | null;
  vote: "helpful" | "not_helpful";
  disposition: "open" | "published" | "retrieval_unresolved" | "rejected" | "duplicate";
};

export type ReviewLinkDecision =
  | { ok: true }
  | { ok: false; reason: "tenant" | "install" | "locale" | "not_published" | "private" | "not_open" };

/**
 * A saved draft is not a review outcome. The case stays in the queue.
 * Publishing must already have succeeded before a later disposition call.
 */
export function draftSaveClosesReview(): false {
  return false;
}

export function reviewDispositionIsLive(ready = FEEDBACK_REVIEW_DISPOSITION_READY): boolean {
  return ready === true;
}

export function reviewReasonOk(reason: string): boolean {
  const trimmed = reason.trim();
  return trimmed.length >= 3 && trimmed.length <= 280;
}

export function canLinkPublishedFaq(review: ReviewCaseScope, faq: ReviewFaqCandidate): ReviewLinkDecision {
  if (review.disposition !== "open" || review.vote !== "not_helpful") return { ok: false, reason: "not_open" };
  if (faq.surface !== "public_faq") return { ok: false, reason: "private" };
  if (!faq.tenantId || faq.tenantId !== review.tenantId) return { ok: false, reason: "tenant" };
  if (!faq.installId || faq.installId !== review.installId) return { ok: false, reason: "install" };
  if (faq.status !== "published" || faq.publicSafe !== true) return { ok: false, reason: "not_published" };
  if (!review.locale || faq.locale !== review.locale) return { ok: false, reason: "locale" };
  return { ok: true };
}

export function canMarkRetrievalUnresolved(
  review: ReviewCaseScope,
  faq: ReviewFaqCandidate,
  reason: string,
): ReviewLinkDecision | { ok: false; reason: "reason" } {
  if (!reviewReasonOk(reason)) return { ok: false, reason: "reason" };
  return canLinkPublishedFaq(review, faq);
}

export function canRejectOrDuplicate(
  review: ReviewCaseScope,
  reason: string,
): { ok: true } | { ok: false; reason: "reason" | "not_open" } {
  if (review.disposition !== "open" || review.vote !== "not_helpful") return { ok: false, reason: "not_open" };
  if (!reviewReasonOk(reason)) return { ok: false, reason: "reason" };
  return { ok: true };
}

export function explicitBulkIds(ids: readonly string[]): { ok: true; ids: string[] } | { ok: false; reason: "batch" } {
  const unique: string[] = [];
  for (const id of ids) {
    const normalized = id.trim().toLowerCase();
    if (!UUID_RE.test(normalized)) return { ok: false, reason: "batch" };
    if (!unique.includes(normalized)) unique.push(normalized);
  }
  if (unique.length < 1 || unique.length > FEEDBACK_REVIEW_BULK_LIMIT) return { ok: false, reason: "batch" };
  return { ok: true, ids: unique };
}

export function queueAfterDisposition(
  disposition: ReviewCaseScope["disposition"],
): "review" | "history" {
  if (disposition === "open") return "review";
  return "history";
}

export function followUpStaysOpen(disposition: ReviewCaseScope["disposition"]): boolean {
  return disposition === "retrieval_unresolved";
}

/**
 * An existing published FAQ never becomes a new FAQ and never copies the visitor answer.
 * Resolved closes the case. A search miss stays visible as open follow-up in history.
 */
export function existingPublishedFaqOutcome(kind: "resolved" | "search_miss"): {
  action: "published" | "retrieval_unresolved";
  queue: "history";
  followUpOpen: boolean;
  requiresReason: boolean;
  writesFaq: false;
} {
  if (kind === "search_miss") {
    return {
      action: "retrieval_unresolved",
      queue: "history",
      followUpOpen: true,
      requiresReason: true,
      writesFaq: false,
    };
  }
  return {
    action: "published",
    queue: "history",
    followUpOpen: false,
    requiresReason: false,
    writesFaq: false,
  };
}

/** The visitor's received answer is context. It is not the proposed FAQ answer. */
export function proposedFaqAnswerSeed(): "" {
  return "";
}
