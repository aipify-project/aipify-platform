import {
  SUPPORT_CREATE_HREF,
  SUPPORT_REQUESTS_HREF,
  resolveCaseDetailHref,
} from "@/lib/app-portal/support-history/config";
import {
  parseSupportRequestList,
  supportTicketReference,
  type SupportRequestItem,
  type SupportRequestStatus,
} from "@/lib/app-portal/support-requests";
import type { WorkspaceTicketSummary } from "./types";

const OPEN_STATUSES: SupportRequestStatus[] = ["open", "in_review", "reopened"];
const WAITING_AIPIFY: SupportRequestStatus[] = ["waiting_for_aipify"];
const WAITING_CUSTOMER: SupportRequestStatus[] = ["waiting_for_customer"];
/** Resolved KPI is only truly resolved — closed/archived are ended, not “solved”. */
const RESOLVED_STATUSES: SupportRequestStatus[] = ["resolved"];

function countBy(
  items: SupportRequestItem[],
  statuses: SupportRequestStatus[]
): number {
  return items.filter((item) => statuses.includes(item.status)).length;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

/**
 * Counts from a list RPC are partial when the payload signals truncation, or
 * always when we only have the loaded list (no authoritative total).
 */
export function detectTicketListCountsPartial(
  listPayload: unknown,
  itemCount: number
): boolean {
  const root = asRecord(listPayload);
  if (!root) return true;
  if (root.truncated === true || root.has_more === true) return true;
  const total =
    typeof root.total_count === "number" && Number.isFinite(root.total_count)
      ? root.total_count
      : typeof root.total === "number" && Number.isFinite(root.total)
        ? root.total
        : null;
  if (total != null && total > itemCount) return true;
  // List-derived without an aggregate total — label as partial for honesty.
  return true;
}

/**
 * Fail-closed ticket summary for the shared APP dashboard.
 * Never invents zero counts when Core is unavailable.
 */
export function buildWorkspaceTicketSummary(input: {
  listPayload: unknown;
  listError?: string | null;
  httpStatus?: number | null;
}): WorkspaceTicketSummary {
  const base = {
    listHref: SUPPORT_REQUESTS_HREF,
    createHref: SUPPORT_CREATE_HREF,
    createEnabled: true,
    countsPartial: false,
  };

  if (input.httpStatus === 403 || input.listError === "Unauthorized") {
    return {
      ...base,
      availability: "forbidden",
      counts: { open: null, waitingAipify: null, waitingCustomer: null, resolved: null },
      recent: [],
      lastUpdatedAt: null,
      createEnabled: false,
      createHref: null,
      messageKey: "forbidden",
    };
  }

  if (input.listError || input.listPayload == null) {
    return {
      ...base,
      availability: "unavailable",
      counts: { open: null, waitingAipify: null, waitingCustomer: null, resolved: null },
      recent: [],
      lastUpdatedAt: null,
      createEnabled: false,
      createHref: null,
      messageKey: input.listError ? "error" : "unavailable",
    };
  }

  const parsed = parseSupportRequestList(input.listPayload);
  if (!parsed.found) {
    return {
      ...base,
      availability: "unavailable",
      counts: { open: null, waitingAipify: null, waitingCustomer: null, resolved: null },
      recent: [],
      lastUpdatedAt: null,
      createEnabled: false,
      createHref: null,
      messageKey: "unavailable",
    };
  }

  const items = parsed.items;
  const sorted = [...items].sort((a, b) =>
    (b.updated_at || "").localeCompare(a.updated_at || "")
  );
  const recent = sorted.slice(0, 3).map((item) => ({
    id: item.id,
    reference: supportTicketReference(item.id),
    title: item.title,
    status: item.status,
    updatedAt: item.updated_at || null,
    href: resolveCaseDetailHref(item.id),
  }));

  return {
    ...base,
    availability: "available",
    countsPartial: detectTicketListCountsPartial(input.listPayload, items.length),
    counts: {
      open: countBy(items, OPEN_STATUSES),
      waitingAipify: countBy(items, WAITING_AIPIFY),
      waitingCustomer: countBy(items, WAITING_CUSTOMER),
      resolved: countBy(items, RESOLVED_STATUSES),
    },
    recent,
    lastUpdatedAt: sorted[0]?.updated_at ?? null,
    createEnabled: true,
  };
}

export function mapTicketStatusLabelKey(
  status: SupportRequestStatus | "unknown"
): string {
  switch (status) {
    case "open":
      return "statusNew";
    case "in_review":
      return "statusInProgress";
    case "waiting_for_aipify":
      return "statusWaitingAipify";
    case "waiting_for_customer":
      return "statusWaitingCustomer";
    case "resolved":
      return "statusResolved";
    case "closed":
      return "statusClosed";
    case "reopened":
      return "statusReopened";
    case "archived":
      return "statusArchived";
    default:
      return "statusUnknown";
  }
}
