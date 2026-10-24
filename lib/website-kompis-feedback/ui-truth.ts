import { WPKF_SOURCE_URL_MAX_LENGTH } from "@/lib/website-kompis-faq/constants";

/**
 * Presentation split for the feedback drawer.
 * faq_publish_state and review_disposition_state stay separate.
 * A published FAQ does not finish the review case.
 */

export type FaqListCandidate = {
  id?: string;
  title?: string;
  locale?: string;
  status?: string;
  installId?: string | null;
  sourceUrl?: string | null;
};

export type FaqMatch =
  | { kind: "published"; id: string }
  | { kind: "draft"; id: string }
  | { kind: "none" };

export type FaqLookup = FaqMatch | "lookup_failed";

export function selectFaqMatchForInstall(
  items: FaqListCandidate[],
  input: { question: string; locale: string; installId: string },
): FaqMatch {
  const question = input.question.trim();
  const locale = input.locale.trim().toLowerCase();
  const installId = input.installId.trim();
  if (!question || !locale || !installId) return { kind: "none" };

  const matches = items.filter(
    (item) =>
      Boolean(item.id) &&
      item.title?.trim() === question &&
      (item.locale ?? "").trim().toLowerCase() === locale &&
      (item.installId ?? "") === installId &&
      (item.status === "published" || item.status === "draft"),
  );
  const published = matches.find((item) => item.status === "published");
  if (published?.id) return { kind: "published", id: published.id };
  const draft = matches.find((item) => item.status === "draft");
  if (draft?.id) return { kind: "draft", id: draft.id };
  return { kind: "none" };
}

/** A failed lookup or an already published FAQ must not create another row. */
export function feedbackFaqWriteAllowed(lookup: FaqLookup, savedId?: string | null): boolean {
  if (lookup === "lookup_failed") return false;
  if (lookup.kind === "published" && lookup.id !== savedId) return false;
  return true;
}

export type ReviewAfterFaqPublish = {
  faqPublishState: "published";
  reviewDispositionState: "completed" | "unavailable" | "still_open";
  removeReviewCard: boolean;
  closeDrawer: boolean;
  notice: "faq_published_review_open" | "faq_published_review_completed";
};

function reviewStaysOpen(
  reviewDispositionState: "unavailable" | "still_open",
): ReviewAfterFaqPublish {
  return {
    faqPublishState: "published",
    reviewDispositionState,
    removeReviewCard: false,
    closeDrawer: false,
    notice: "faq_published_review_open",
  };
}

export function presentReviewAfterFaqPublish(input: {
  dispositionReady: boolean;
  dispositionHttpStatus?: number | null;
  dispositionCode?: string | null;
  reviewDisposition?: string | null;
}): ReviewAfterFaqPublish {
  if (input.dispositionReady !== true) return reviewStaysOpen("unavailable");
  if (input.dispositionHttpStatus === 501 || input.dispositionCode === "disposition_unavailable") {
    return reviewStaysOpen("unavailable");
  }
  if (input.dispositionHttpStatus === 200 && input.reviewDisposition === "published") {
    return {
      faqPublishState: "published",
      reviewDispositionState: "completed",
      removeReviewCard: true,
      closeDrawer: true,
      notice: "faq_published_review_completed",
    };
  }
  return reviewStaysOpen("still_open");
}

export type DispositionFailureNotice = "unavailable" | "forbidden" | "still_open";

/** A failed disposition keeps the case in the active queue. Success is a separate check. */
export function presentDispositionFailure(input: {
  httpOk: boolean;
  httpStatus: number;
  code?: string | null;
  reviewDisposition?: string | null;
  expected: string;
}): DispositionFailureNotice | null {
  if (input.httpOk && input.reviewDisposition === input.expected) return null;
  if (input.httpStatus === 501 || input.code === "disposition_unavailable") return "unavailable";
  if (input.httpStatus === 403 || input.code === "forbidden") return "forbidden";
  return "still_open";
}

export function removalStatusWhileDispositionOff(input: {
  dispositionReady: boolean;
  vote?: string | null;
  reviewDisposition?: string | null;
  reviewStatus?: string | null;
}): "hidden" | "explain_unavailable" {
  if (input.dispositionReady === true) return "hidden";
  if (input.vote !== "not_helpful") return "hidden";
  if (input.reviewDisposition === "published" || input.reviewDisposition === "rejected") return "hidden";
  if (input.reviewStatus === "closed") return "hidden";
  return "explain_unavailable";
}

/** Same column and trim as the FAQ upsert. Empty is stored as null. */
export function normalizeFeedbackFaqSourceUrl(value: string): string | null {
  const trimmed = value.trim().slice(0, WPKF_SOURCE_URL_MAX_LENGTH);
  return trimmed || null;
}

export function buildFeedbackFaqWriteBody(input: {
  itemId: string | null;
  installId: string;
  locale: string;
  question: string;
  answer: string;
  category: string;
  publicSafe: boolean;
  sourceUrl: string;
  validFrom: string | null;
  validUntil: string | null;
}) {
  return {
    itemId: input.itemId,
    installId: input.installId,
    locale: input.locale.trim(),
    title: input.question.trim(),
    question: input.question.trim(),
    answer: input.answer.trim(),
    contentType: "faq" as const,
    category: input.category.trim(),
    publicSafe: input.publicSafe,
    priority: 100,
    tags: [] as string[],
    sourceUrl: normalizeFeedbackFaqSourceUrl(input.sourceUrl),
    validFrom: input.validFrom,
    validUntil: input.validUntil,
  };
}

export function sourceUrlMatchesPersisted(sent: string | null, reopened: string | null): boolean {
  const stored = reopened?.trim() || null;
  return sent === stored;
}
