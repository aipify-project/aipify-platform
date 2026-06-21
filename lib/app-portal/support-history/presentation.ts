import {
  mapExecutivePriorityToSeverity,
  mapReliabilityStatusToSemantic,
  type SemanticBadgeType,
} from "@/lib/design/semantic-status-system";
import type { SupportRequestStatus } from "@/lib/app-portal/support-requests";
import {
  DEFAULT_PAGE_SIZE,
  HISTORICAL_STATUSES,
  MAX_PAGE_SIZE,
  SUPPORT_HISTORY_SORT_OPTIONS,
  type SUPPORT_HISTORY_CHANNELS,
} from "./config";
import type {
  SupportHistoryFilterState,
  SupportHistorySortOption,
} from "./types";

export function isHistoricalStatus(status: string): boolean {
  return (HISTORICAL_STATUSES as readonly string[]).includes(status);
}

export function isActiveStatus(status: string): boolean {
  return !isHistoricalStatus(status);
}

export function containsPhasePlaceholderText(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes("future phase") ||
    lower.includes("coming soon") ||
    lower.includes("capabilities will expand") ||
    lower.includes("phase 620") ||
    lower.includes("phase 621")
  );
}

export function mapSupportHistoryStatusToSemantic(status: SupportRequestStatus | string): {
  type: SemanticBadgeType;
  value: string;
} {
  const key = String(status).toLowerCase();
  switch (key) {
    case "resolved":
    case "closed":
      return { type: "workflow", value: "completed" };
    case "reopened":
      return { type: "workflow", value: "in_progress" };
    case "archived":
      return { type: "lifecycle", value: "archived" };
    case "open":
      return { type: "workflow", value: "open" };
    case "in_review":
      return { type: "workflow", value: "in_progress" };
    case "waiting_for_customer":
    case "waiting_for_aipify":
      return { type: "workflow", value: "pending" };
    default:
      return mapReliabilityStatusToSemantic(key);
  }
}

export function mapSupportPriorityToSeverity(priority: string): string {
  return mapExecutivePriorityToSeverity(
    priority === "urgent" ? "urgent" : priority === "high" ? "attention" : priority === "low" ? "information" : "medium"
  );
}

export function isValidSortOption(value: string): value is SupportHistorySortOption {
  return (SUPPORT_HISTORY_SORT_OPTIONS as readonly string[]).includes(value);
}

export function isValidChannel(value: string): value is (typeof SUPPORT_HISTORY_CHANNELS)[number] {
  return ["app_portal", "email", "chat", "phone", "assistant"].includes(value);
}

export function clampPage(page: number): number {
  return Math.max(1, Math.floor(page) || 1);
}

export function clampPageSize(size: number): number {
  const n = Math.floor(size) || DEFAULT_PAGE_SIZE;
  return Math.min(Math.max(1, n), MAX_PAGE_SIZE);
}

export function buildHistoryQueryParams(filters: SupportHistoryFilterState): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.category) params.set("category", filters.category);
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.channel) params.set("channel", filters.channel);
  if (filters.assigned) params.set("assigned", filters.assigned);
  if (filters.dateFrom) params.set("date_from", filters.dateFrom);
  if (filters.dateTo) params.set("date_to", filters.dateTo);
  if (filters.search.trim()) params.set("search", filters.search.trim());
  if (filters.sort !== "updated_desc") params.set("sort", filters.sort);
  if (filters.page > 1) params.set("page", String(filters.page));
  return params;
}

export function parseHistoryFiltersFromSearchParams(
  searchParams: URLSearchParams
): SupportHistoryFilterState {
  const sortRaw = searchParams.get("sort") ?? "updated_desc";
  return {
    status: (searchParams.get("status") ?? "") as SupportHistoryFilterState["status"],
    category: (searchParams.get("category") ?? "") as SupportHistoryFilterState["category"],
    priority: (searchParams.get("priority") ?? "") as SupportHistoryFilterState["priority"],
    channel: (searchParams.get("channel") ?? "") as SupportHistoryFilterState["channel"],
    assigned: searchParams.get("assigned") ?? "",
    dateFrom: searchParams.get("date_from") ?? "",
    dateTo: searchParams.get("date_to") ?? "",
    search: searchParams.get("search") ?? "",
    sort: isValidSortOption(sortRaw) ? sortRaw : "updated_desc",
    page: clampPage(Number(searchParams.get("page") ?? "1")),
  };
}

export function filterCasesExcludeActive<T extends { status: string }>(items: T[]): T[] {
  return items.filter((item) => isHistoricalStatus(item.status));
}

export function hasPagination(pagination?: { total_pages: number; page: number }): boolean {
  return (pagination?.total_pages ?? 0) > 1;
}
