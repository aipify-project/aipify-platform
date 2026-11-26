/**
 * Pure view helpers for the Support Center ticket list / detail.
 * No I/O — shared by the panel and unit tests.
 */

import type { PlatformSupportTicketsListItem } from "@/lib/platform-portal/support-tickets-read-adapter";
import type { SupportCenterTabId } from "./types";

export type SupportTicketCounts = {
  total: number;
  open: number;
  waiting: number;
  resolved_or_closed: number;
};

/** Filter the loaded list for the active tab (Mine = assigned to the viewer). */
export function filterTicketsForTab(
  items: readonly PlatformSupportTicketsListItem[],
  tab: SupportCenterTabId,
  viewerUserId: string | null | undefined,
): PlatformSupportTicketsListItem[] {
  if (tab !== "mine") return [...items];
  if (!viewerUserId) return [];
  return items.filter((item) => item.assigned_support_owner_id === viewerUserId);
}

export type SupportKpiState =
  | { state: "loading" }
  | { state: "unavailable" }
  | { state: "value"; value: number; source: "counts" | "page" };

export type SupportKpiSet = {
  open: SupportKpiState;
  inProgress: SupportKpiState;
  waiting: SupportKpiState;
  critical: SupportKpiState;
  resolved: SupportKpiState;
  /** True when at least one card is computed from the currently loaded page. */
  usesLoadedPage: boolean;
};

export type SupportKpiInput = {
  status: "loading" | "ready" | "unavailable";
  counts: SupportTicketCounts | null;
  items: readonly PlatformSupportTicketsListItem[];
};

const LOADING: SupportKpiState = { state: "loading" };
const UNAVAILABLE: SupportKpiState = { state: "unavailable" };

export function isCriticalPriority(priority: string): boolean {
  const p = priority.toLowerCase();
  return p === "critical" || p === "urgent";
}

/**
 * Open / waiting / resolved come from the counts API. In progress and critical
 * are derived from the loaded page. Loading, zero and unavailable are always
 * distinguishable — a zero is only reported when the data is actually ready.
 */
export function computeSupportKpis(input: SupportKpiInput): SupportKpiSet {
  if (input.status === "loading") {
    return {
      open: LOADING,
      inProgress: LOADING,
      waiting: LOADING,
      critical: LOADING,
      resolved: LOADING,
      usesLoadedPage: false,
    };
  }
  if (input.status === "unavailable") {
    return {
      open: UNAVAILABLE,
      inProgress: UNAVAILABLE,
      waiting: UNAVAILABLE,
      critical: UNAVAILABLE,
      resolved: UNAVAILABLE,
      usesLoadedPage: false,
    };
  }

  const fromCounts = (value: number | undefined): SupportKpiState =>
    input.counts && typeof value === "number"
      ? { state: "value", value, source: "counts" }
      : UNAVAILABLE;

  return {
    open: fromCounts(input.counts?.open),
    inProgress: {
      state: "value",
      value: input.items.filter((i) => i.status === "in_progress").length,
      source: "page",
    },
    waiting: fromCounts(input.counts?.waiting),
    critical: {
      state: "value",
      value: input.items.filter((i) => isCriticalPriority(i.priority)).length,
      source: "page",
    },
    resolved: fromCounts(input.counts?.resolved_or_closed),
    usesLoadedPage: true,
  };
}

/** Allowed next statuses for the status select (current status first). */
export function nextStatusOptions(
  current: string,
  transitions: Record<string, readonly string[]>,
): string[] {
  return [current, ...(transitions[current] ?? [])];
}

export type SupportTimelineEntryKind = "internal_note" | "reply_draft" | "reply" | "event";

export type SupportTimelineEntry = {
  id: string;
  kind: SupportTimelineEntryKind;
  text: string;
  at: string | null;
  /** Reply delivery state when the entry came from the message thread. */
  deliveryStatus: string | null;
};

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

/**
 * Normalise the unknown `timeline` payload from the detail RPC into display
 * entries. Handles both audit-event rows (`description`) and message-thread
 * rows (`body_text` + `direction`). Unknown rows are dropped, never invented.
 */
export function normalizeSupportTimeline(raw: unknown): SupportTimelineEntry[] {
  if (!Array.isArray(raw)) return [];
  const entries: SupportTimelineEntry[] = [];
  raw.forEach((row, index) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) return;
    const r = row as Record<string, unknown>;
    const text = asString(r.body_text) ?? asString(r.body) ?? asString(r.description);
    if (!text) return;
    const direction = asString(r.direction);
    const delivery = asString(r.delivery_status);
    let kind: SupportTimelineEntryKind = "event";
    if (direction === "internal_note") kind = "internal_note";
    else if (direction === "outbound") {
      kind = delivery === "sent" ? "reply" : "reply_draft";
    }
    entries.push({
      id: asString(r.id) ?? `row-${index}`,
      kind,
      text,
      at: asString(r.created_at),
      deliveryStatus: delivery,
    });
  });
  return entries;
}

/** Full ticket text from a detail payload (falls back to the list preview). */
export function resolveTicketDescription(
  detailItem: Record<string, unknown> | null | undefined,
  fallbackPreview: string,
): string {
  const full = detailItem ? asString(detailItem.description) : null;
  return full ?? fallbackPreview;
}

/** Short, display-only ticket reference. */
export function ticketReference(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

/**
 * Minimal list-shaped ticket built from a detail payload — used when a ticket
 * is opened directly (deep link) and is not on the currently loaded list page.
 */
export function ticketFromDetailItem(
  id: string,
  item: Record<string, unknown> | null | undefined,
): PlatformSupportTicketsListItem | null {
  if (!item) return null;
  const title = str(item.title);
  if (!title) return null;
  const updated = str(item.updated_at, str(item.created_at));
  return {
    id,
    company_id: str(item.company_id),
    company_name: typeof item.company_name === "string" ? item.company_name : null,
    title,
    description_preview: str(item.description_preview, str(item.description)),
    category: str(item.category, "general"),
    priority: str(item.priority, "normal"),
    status: str(item.status, "open"),
    channel: str(item.channel, "app_portal"),
    source_locale: null,
    related_module: typeof item.related_module === "string" ? item.related_module : null,
    assigned_support_owner_id:
      typeof item.assigned_support_owner_id === "string"
        ? item.assigned_support_owner_id
        : null,
    attachment_count: Number(item.attachment_count) || 0,
    created_at: str(item.created_at, updated),
    updated_at: updated,
    resolved_at: typeof item.resolved_at === "string" ? item.resolved_at : null,
  };
}
