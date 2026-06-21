import type {
  SupportHistoryCase,
  SupportHistoryCategoryInsight,
  SupportHistoryInsights,
  SupportHistoryOverview,
  SupportHistoryPagination,
  SupportHistoryResponse,
} from "./types";

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown, fb = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fb;
}

function parseOverview(raw: unknown): SupportHistoryOverview | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    total_historical: num(d.total_historical),
    resolved: num(d.resolved),
    closed: num(d.closed),
    reopened: num(d.reopened),
    archived: num(d.archived),
    avg_resolution_days: num(d.avg_resolution_days),
  };
}

function parseInsights(raw: unknown): SupportHistoryInsights | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  const topCategories: SupportHistoryCategoryInsight[] = Array.isArray(d.top_categories)
    ? d.top_categories.map((row) => {
        const item = row as Record<string, unknown>;
        return {
          category: str(item.category, "general") as SupportHistoryCategoryInsight["category"],
          count: num(item.count),
        };
      })
    : [];
  return {
    top_categories: topCategories,
    reopen_rate_percent: num(d.reopen_rate_percent),
    most_recent_resolution_at: str(d.most_recent_resolution_at) || undefined,
  };
}

function parsePagination(raw: unknown): SupportHistoryPagination | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    page: num(d.page, 1),
    page_size: num(d.page_size, 10),
    total: num(d.total),
    total_pages: num(d.total_pages),
  };
}

function parseCase(raw: unknown): SupportHistoryCase {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: str(d.id),
    title: str(d.title),
    description: str(d.description),
    category: str(d.category, "general") as SupportHistoryCase["category"],
    priority: str(d.priority, "medium") as SupportHistoryCase["priority"],
    status: str(d.status, "resolved") as SupportHistoryCase["status"],
    channel: str(d.channel, "app_portal") as SupportHistoryCase["channel"],
    created_by_id: str(d.created_by_id) || undefined,
    created_by: str(d.created_by, "Unknown"),
    assigned_support_owner_id: str(d.assigned_support_owner_id) || undefined,
    assigned_support_owner: str(d.assigned_support_owner, "Unassigned"),
    related_module: str(d.related_module) || undefined,
    attachments: Array.isArray(d.attachments) ? d.attachments : [],
    created_at: str(d.created_at),
    updated_at: str(d.updated_at),
    resolved_at: str(d.resolved_at) || undefined,
  };
}

export function parseSupportHistory(data: unknown): SupportHistoryResponse {
  if (!data || typeof data !== "object") return { found: false, items: [] };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_manage: d.can_manage === true,
    can_reopen: d.can_reopen === true,
    overview: parseOverview(d.overview),
    insights: parseInsights(d.insights),
    items: Array.isArray(d.items) ? d.items.map(parseCase) : [],
    pagination: parsePagination(d.pagination),
    principle: str(d.principle),
  };
}
