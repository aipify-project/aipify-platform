/**
 * FAQ library window.
 * The existing list RPC returns at most 500 rows and no total.
 * A full page means more rows may exist. A short page ends the tenant list.
 * Site filtering happens after that page, so a short visible page is not a site total.
 * Selecting every match needs an approved count contract. It stays off.
 */

export const FAQ_LIST_PAGE_SIZE = 100;
export const FAQ_GLOBAL_MATCH_SELECT_SUPPORTED = false;

export type FaqListTotalState = "exact_tenant" | "at_least_tenant";

export type FaqListWindow = {
  offset: number;
  limit: number;
  tenantReturned: number;
  visibleReturned: number;
  hasMore: boolean;
  totalState: FaqListTotalState;
  /** Set only when the tenant page itself is short. This is the tenant filter total. */
  tenantTotal: number | null;
  /** Lower bound of the tenant list, including this page. */
  tenantMinimum: number;
  /**
   * Selected-site total after the same site rule as the list.
   * Known only when the tenant page is short, so the filter covered every match.
   */
  siteTotal: number | null;
};

export function clampFaqListOffset(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) return 0;
  return Math.min(parsed, 100_000);
}

export function clampFaqListLimit(value: unknown, fallback = FAQ_LIST_PAGE_SIZE): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, FAQ_LIST_PAGE_SIZE);
}

export function buildFaqListWindow(input: {
  offset: number;
  limit: number;
  tenantReturned: number;
  visibleReturned: number;
}): FaqListWindow {
  const offset = clampFaqListOffset(input.offset);
  const limit = clampFaqListLimit(input.limit);
  const tenantReturned = Math.max(0, input.tenantReturned);
  const visibleReturned = Math.max(0, input.visibleReturned);
  const hasMore = tenantReturned >= limit;
  const exact = !hasMore;
  return {
    offset,
    limit,
    tenantReturned,
    visibleReturned,
    hasMore,
    totalState: exact ? "exact_tenant" : "at_least_tenant",
    tenantTotal: exact ? offset + tenantReturned : null,
    tenantMinimum: offset + tenantReturned,
    siteTotal: exact && offset === 0 ? visibleReturned : null,
  };
}

export function visibleRowRange(window: Pick<FaqListWindow, "offset" | "visibleReturned">): {
  from: number;
  to: number;
} {
  if (window.visibleReturned <= 0) return { from: 0, to: 0 };
  return {
    from: window.offset + 1,
    to: window.offset + window.visibleReturned,
  };
}

export function pruneSelectionToVisible(selectedIds: readonly string[], visibleIds: readonly string[]): string[] {
  const visible = new Set(visibleIds);
  return selectedIds.filter((id) => visible.has(id));
}

export type VisiblePublishSkipReason = "not_visible" | "not_draft" | "not_public_safe";

export type VisiblePublishPlan = {
  readyIds: string[];
  skipped: Array<{ id: string; reason: VisiblePublishSkipReason }>;
};

/** Only checked rows on the current page. Drafts that are not public-safe are skipped. */
export function planVisibleDraftPublish(
  items: readonly { id: string; status: string; publicSafe: boolean }[],
  selectedIds: readonly string[],
): VisiblePublishPlan {
  const byId = new Map(items.map((item) => [item.id, item]));
  const readyIds: string[] = [];
  const skipped: VisiblePublishPlan["skipped"] = [];
  const seen = new Set<string>();

  for (const id of selectedIds) {
    if (seen.has(id)) continue;
    seen.add(id);
    const item = byId.get(id);
    if (!item) {
      skipped.push({ id, reason: "not_visible" });
      continue;
    }
    if (item.status !== "draft") {
      skipped.push({ id, reason: "not_draft" });
      continue;
    }
    if (item.publicSafe !== true) {
      skipped.push({ id, reason: "not_public_safe" });
      continue;
    }
    readyIds.push(id);
  }

  return { readyIds, skipped };
}

export type VisiblePublishSummary = {
  selected: number;
  ready: number;
  published: number;
  draftNotReady: number;
  archived: number;
  notVisible: number;
};

/** Counts for the visible page only. Published rows are not republish candidates. */
export function summarizeVisiblePublish(
  items: readonly { id: string; status: string; publicSafe: boolean }[],
  selectedIds: readonly string[],
): VisiblePublishSummary {
  const plan = planVisibleDraftPublish(items, selectedIds);
  const byId = new Map(items.map((item) => [item.id, item]));
  let published = 0;
  let draftNotReady = 0;
  let archived = 0;
  let notVisible = 0;
  for (const skip of plan.skipped) {
    const item = byId.get(skip.id);
    if (!item || skip.reason === "not_visible") {
      notVisible += 1;
      continue;
    }
    if (item.status === "published") published += 1;
    else if (item.status === "archived") archived += 1;
    else if (item.status === "draft") draftNotReady += 1;
    else notVisible += 1;
  }
  return {
    selected: plan.readyIds.length + plan.skipped.length,
    ready: plan.readyIds.length,
    published,
    draftNotReady,
    archived,
    notVisible,
  };
}

export function visiblePublishBlock(
  summary: VisiblePublishSummary,
): "none_selected" | "already_published" | "none_ready" | "ready" {
  if (summary.selected === 0) return "none_selected";
  if (summary.ready > 0) return "ready";
  if (summary.published === summary.selected && summary.published > 0) return "already_published";
  return "none_ready";
}

/** Failed publish calls stay selected. Skipped and successful rows do not. */
export function selectionAfterVisiblePublish(failedIds: readonly string[]): string[] {
  return [...failedIds];
}
