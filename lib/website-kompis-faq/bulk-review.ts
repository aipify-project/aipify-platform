import { detectWebsiteKompisFaqRiskyWords } from "@/lib/website-kompis-faq/safety";

export const FAQ_PUBLIC_SAFE_BATCH_SIZE = 25;
export const FAQ_MATCH_PAGE_SIZE = 500;
export const FAQ_MATCH_PAGE_CAP = 20;

export type FaqReviewItem = {
  id: string;
  status: string;
  publicSafe: boolean;
  title: string;
  question?: string | null;
  answer: string;
};

export type PublicSafeSkipReason =
  | "not_visible"
  | "not_draft"
  | "already_public_safe"
  | "manual_review"
  | "archived";

export type PublicSafeReviewPlan = {
  readyIds: string[];
  alreadySafeIds: string[];
  manualIds: string[];
  skipped: Array<{ id: string; reason: PublicSafeSkipReason }>;
};

export function chunkFaqIds(ids: readonly string[], size = FAQ_PUBLIC_SAFE_BATCH_SIZE): string[][] {
  const limit = Math.max(1, size);
  const chunks: string[][] = [];
  for (let index = 0; index < ids.length; index += limit) {
    chunks.push(ids.slice(index, index + limit));
  }
  return chunks;
}

/** Drafts with sensitive wording stay out of the batch. Marking does not publish. */
export function planPublicSafeReview(
  items: readonly FaqReviewItem[],
  selectedIds: readonly string[],
): PublicSafeReviewPlan {
  const byId = new Map(items.map((item) => [item.id, item]));
  const readyIds: string[] = [];
  const alreadySafeIds: string[] = [];
  const manualIds: string[] = [];
  const skipped: PublicSafeReviewPlan["skipped"] = [];
  const seen = new Set<string>();

  for (const id of selectedIds) {
    if (seen.has(id)) continue;
    seen.add(id);
    const item = byId.get(id);
    if (!item) {
      skipped.push({ id, reason: "not_visible" });
      continue;
    }
    if (item.status === "archived") {
      skipped.push({ id, reason: "archived" });
      continue;
    }
    if (item.status !== "draft") {
      skipped.push({ id, reason: "not_draft" });
      continue;
    }
    const risky = detectWebsiteKompisFaqRiskyWords(
      `${item.title}\n${item.question ?? ""}\n${item.answer}`,
    );
    if (risky.length > 0) {
      manualIds.push(id);
      skipped.push({ id, reason: "manual_review" });
      continue;
    }
    if (item.publicSafe === true) {
      alreadySafeIds.push(id);
      skipped.push({ id, reason: "already_public_safe" });
      continue;
    }
    readyIds.push(id);
  }

  return { readyIds, alreadySafeIds, manualIds, skipped };
}

export function selectionAfterPublicSafeReview(input: {
  selectedIds: readonly string[];
  markedIds: readonly string[];
  alreadySafeIds: readonly string[];
}): string[] {
  const done = new Set([...input.markedIds, ...input.alreadySafeIds]);
  return input.selectedIds.filter((id) => !done.has(id));
}

export type FaqLibraryPage = { returned: number };

/** A short page ends the walk. A full page is not a total. */
export function faqLibraryWalk(total: number, pageSize = 100): Array<{ offset: number; returned: number; hasMore: boolean }> {
  if (total < 0) return [];
  const pages: Array<{ offset: number; returned: number; hasMore: boolean }> = [];
  let offset = 0;
  if (total === 0) {
    return [{ offset: 0, returned: 0, hasMore: false }];
  }
  while (offset < total) {
    const returned = Math.min(pageSize, total - offset);
    const hasMore = offset + returned < total;
    pages.push({ offset, returned, hasMore });
    offset += returned;
  }
  return pages;
}

export type FaqReviewLookup = {
  status: string | null;
  locale: string | null;
  contentType: string | null;
  query: string | null;
};

/** Stop when every requested id is loaded, the list ends, or the page cap is hit. */
export function faqLookupStop(input: {
  pageReturned: number;
  pageSize: number;
  pagesRead: number;
  pageCap: number;
  wanted: number;
  foundWanted: number;
}): "continue" | "complete" | "capped" {
  if (input.wanted > 0 && input.foundWanted >= input.wanted) return "complete";
  if (input.pageReturned < input.pageSize) return "complete";
  if (input.pagesRead >= input.pageCap) return "capped";
  return "continue";
}

export function authoritativeMatchAllowed(input: {
  countAvailable: boolean;
  reportedTotal: number | null;
  collectedIds: number;
}): boolean {
  return (
    input.countAvailable &&
    input.reportedTotal != null &&
    Number.isInteger(input.reportedTotal) &&
    input.reportedTotal >= 0 &&
    input.collectedIds === input.reportedTotal
  );
}
