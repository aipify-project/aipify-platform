import type {
  SavedSearch,
  SearchResultItem,
  UniversalSearchCenter,
  UniversalSearchQueryResult,
} from "./types";

export function parseUniversalSearchCenter(row: Record<string, unknown>): UniversalSearchCenter {
  return {
    found: row.found === true,
    principle: row.principle ? String(row.principle) : undefined,
    philosophy: row.philosophy ? String(row.philosophy) : undefined,
    overview: row.overview as Record<string, string | number | undefined> | undefined,
    categories: Array.isArray(row.categories) ? row.categories.map(String) : undefined,
    search_modes: Array.isArray(row.search_modes)
      ? row.search_modes.map((m) => {
          const item = m as Record<string, unknown>;
          return { key: String(item.key ?? ""), label: String(item.label ?? "") };
        })
      : undefined,
    filters: row.filters as Record<string, unknown> | undefined,
    saved_searches: parseSavedSearches(row.saved_searches),
    default_saved_searches: parseSavedSearches(row.default_saved_searches),
    analytics: row.analytics as Record<string, unknown> | undefined,
    executive_dashboard: row.executive_dashboard as Record<string, unknown> | undefined,
    companion_integration: row.companion_integration as Record<string, unknown> | undefined,
    smart_recommendations: row.smart_recommendations as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? row.audit_recent.map((entry) => {
          const e = entry as Record<string, unknown>;
          return {
            action: String(e.action ?? ""),
            summary: String(e.summary ?? ""),
            query: e.query ? String(e.query) : undefined,
            created_at: e.created_at ? String(e.created_at) : undefined,
          };
        })
      : undefined,
    routes: row.routes as Record<string, string> | undefined,
    error: row.error ? String(row.error) : undefined,
  };
}

function parseSavedSearches(value: unknown): SavedSearch[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      id: String(r.id ?? r.name ?? ""),
      name: String(r.name ?? ""),
      query: String(r.query ?? ""),
      search_mode: String(r.search_mode ?? "global"),
      filters: r.filters as Record<string, unknown> | undefined,
    };
  });
}

function parseResultItem(row: Record<string, unknown>): SearchResultItem {
  return {
    id: String(row.id ?? ""),
    entity_type: String(row.entity_type ?? ""),
    entity_id: row.entity_id ? String(row.entity_id) : undefined,
    title: String(row.title ?? ""),
    summary: row.summary ? String(row.summary) : undefined,
    status: String(row.status ?? "active"),
    department_id: row.department_id ? String(row.department_id) : undefined,
    domain_id: row.domain_id ? String(row.domain_id) : undefined,
    business_pack_key: row.business_pack_key ? String(row.business_pack_key) : undefined,
    record_href: row.record_href ? String(row.record_href) : undefined,
    quick_actions: Array.isArray(row.quick_actions) ? row.quick_actions : undefined,
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  };
}

export function parseUniversalSearchQueryResult(row: Record<string, unknown>): UniversalSearchQueryResult {
  return {
    found: row.found === true,
    query: row.query ? String(row.query) : undefined,
    mode: row.mode ? String(row.mode) : undefined,
    natural_language: row.natural_language as Record<string, unknown> | undefined,
    results: Array.isArray(row.results)
      ? row.results.map((r) => parseResultItem(r as Record<string, unknown>))
      : undefined,
    total: row.total != null ? Number(row.total) : undefined,
    discovery: Array.isArray(row.discovery)
      ? row.discovery.map((d) => {
          const item = d as Record<string, unknown>;
          return {
            entity_type: String(item.entity_type ?? ""),
            title: String(item.title ?? ""),
            record_href: String(item.record_href ?? ""),
          };
        })
      : undefined,
    suggestions: Array.isArray(row.suggestions) ? row.suggestions.map(String) : undefined,
    permission_note: row.permission_note ? String(row.permission_note) : undefined,
    error: row.error ? String(row.error) : undefined,
  };
}
