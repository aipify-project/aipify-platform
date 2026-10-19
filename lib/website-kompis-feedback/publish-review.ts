export type FaqListCandidate = {
  id?: string;
  title?: string;
  locale?: string;
  status?: string;
  installId?: string | null;
  sourceUrl?: string | null;
};

export type SelectedFaqMatch =
  | { kind: "published"; id: string; sourceUrl: string | null }
  | { kind: "draft"; id: string; sourceUrl: string | null }
  | { kind: "none" };

export function selectFaqMatchForSite(
  items: FaqListCandidate[],
  input: { question: string; locale: string; installId: string },
): SelectedFaqMatch {
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
  const chosen = published ?? matches.find((item) => item.status === "draft");
  if (!chosen?.id) return { kind: "none" };
  return {
    kind: chosen.status === "published" ? "published" : "draft",
    id: chosen.id,
    sourceUrl: chosen.sourceUrl?.trim() || null,
  };
}

export type FeedbackFaqWritePlan = "revise_published" | "publish_draft";

export function planFeedbackFaqWrite(input: {
  existing: SelectedFaqMatch;
  saved: { id: string; status: string } | null;
}): { plan: FeedbackFaqWritePlan; itemId: string | null } {
  if (input.existing.kind === "published") {
    return { plan: "revise_published", itemId: input.existing.id };
  }
  if (input.saved?.status === "published") {
    return { plan: "revise_published", itemId: input.saved.id };
  }
  if (input.existing.kind === "draft") {
    return { plan: "publish_draft", itemId: input.existing.id };
  }
  return { plan: "publish_draft", itemId: input.saved?.id ?? null };
}

export type FaqWriteFollowUp =
  | { kind: "verified"; id: string; mode: "published" | "revised" }
  | { kind: "publish_failed"; id: string }
  | { kind: "save_failed" };

export function interpretFaqWrite(input: {
  plan: FeedbackFaqWritePlan;
  save: { ok: boolean; id?: string; status?: string } | null;
  publish: { ok: boolean; id?: string; status?: string } | null;
}): FaqWriteFollowUp {
  if (input.plan === "revise_published") {
    if (input.publish) return { kind: "save_failed" };
    if (!input.save?.ok || !input.save.id || input.save.status !== "published") {
      return { kind: "save_failed" };
    }
    return { kind: "verified", id: input.save.id, mode: "revised" };
  }
  if (!input.save?.ok || !input.save.id) return { kind: "save_failed" };
  if (
    !input.publish?.ok ||
    input.publish.status !== "published" ||
    input.publish.id !== input.save.id
  ) {
    return { kind: "publish_failed", id: input.save.id };
  }
  return { kind: "verified", id: input.save.id, mode: "published" };
}

export type ReviewFollowUp = "completed" | "unavailable" | "still_open";

export function interpretReviewDisposition(input: {
  httpStatus: number;
  code?: string | null;
  reviewDisposition?: string | null;
  expected: "published" | "rejected";
}): ReviewFollowUp {
  if (input.httpStatus === 501 || input.code === "disposition_unavailable") return "unavailable";
  if (input.httpStatus === 200 && input.reviewDisposition === input.expected) return "completed";
  return "still_open";
}

export function canOfferRejectReview(row: {
  vote?: string | null;
  reviewDisposition?: string | null;
  reviewStatus?: string | null;
}): boolean {
  return (
    row.vote === "not_helpful" &&
    row.reviewDisposition !== "published" &&
    row.reviewDisposition !== "rejected" &&
    row.reviewStatus !== "closed"
  );
}

/** Direct close stays off until the owner turns the reviewed flag on. */
export function reviewCloseIsBlocked(ready: boolean): boolean {
  return ready !== true;
}
