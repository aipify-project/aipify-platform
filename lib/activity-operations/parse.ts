import type { ActivityEvent, ActivityHighlight, ActivityOperationsCenter, SinceLastLoginSummary } from "./types";

function parseEvent(row: Record<string, unknown>): ActivityEvent {
  return {
    id: String(row.id ?? ""),
    event_number: row.event_number ? String(row.event_number) : undefined,
    scope: String(row.scope ?? "organization"),
    category: String(row.category ?? ""),
    priority: String(row.priority ?? "information"),
    title: String(row.title ?? ""),
    summary: row.summary ? String(row.summary) : undefined,
    actor_user_id: row.actor_user_id ? String(row.actor_user_id) : undefined,
    department_id: row.department_id ? String(row.department_id) : undefined,
    domain_id: row.domain_id ? String(row.domain_id) : undefined,
    business_pack_key: row.business_pack_key ? String(row.business_pack_key) : undefined,
    entity_type: row.entity_type ? String(row.entity_type) : undefined,
    entity_id: row.entity_id ? String(row.entity_id) : undefined,
    record_href: row.record_href ? String(row.record_href) : undefined,
    impact_note: row.impact_note ? String(row.impact_note) : undefined,
    recommendation: row.recommendation ? String(row.recommendation) : undefined,
    occurred_at: row.occurred_at ? String(row.occurred_at) : undefined,
    data_classification: row.data_classification ? String(row.data_classification) : undefined,
    source_verified: row.source_verified === true ? true : row.source_verified === false ? false : undefined,
    readiness: row.readiness ? String(row.readiness) : undefined,
    freshness: row.freshness ? String(row.freshness) : undefined,
    source_reference: row.source_reference ? String(row.source_reference) : undefined,
  };
}

function parseEvents(value: unknown): ActivityEvent[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((row) => parseEvent(row as Record<string, unknown>));
}

function parseHighlights(value: unknown): ActivityHighlight[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      id: String(r.id ?? r.title ?? ""),
      highlight_type: String(r.highlight_type ?? ""),
      title: String(r.title ?? ""),
      summary: r.summary ? String(r.summary) : undefined,
      priority: String(r.priority ?? "information"),
      record_href: r.record_href ? String(r.record_href) : undefined,
    };
  });
}

function parseSinceLastLogin(value: unknown): SinceLastLoginSummary | undefined {
  if (!value || typeof value !== "object") return undefined;
  const row = value as Record<string, unknown>;
  const lines = Array.isArray(row.summary_lines)
    ? row.summary_lines.map((line) => {
        const l = line as Record<string, unknown>;
        return { text: String(l.text ?? ""), priority: String(l.priority ?? "information") };
      })
    : undefined;
  return {
    since: row.since ? String(row.since) : undefined,
    headline: row.headline ? String(row.headline) : undefined,
    summary_lines: lines,
    top_changes: parseEvents(row.top_changes),
    top_risks: parseEvents(row.top_risks),
    top_opportunities: parseEvents(row.top_opportunities),
    recommended_actions: Array.isArray(row.recommended_actions)
      ? row.recommended_actions.map((a) => {
          const item = a as Record<string, unknown>;
          return { title: String(item.title ?? ""), href: String(item.href ?? "/app/activity") };
        })
      : undefined,
    companion_summary: row.companion_summary ? String(row.companion_summary) : undefined,
    stats: row.stats as Record<string, number> | undefined,
  };
}

export function parseActivityOperationsCenter(row: Record<string, unknown>): ActivityOperationsCenter {
  return {
    found: row.found === true,
    principle: row.principle ? String(row.principle) : undefined,
    philosophy: row.philosophy ? String(row.philosophy) : undefined,
    overview: row.overview as Record<string, string | number | undefined> | undefined,
    since_last_login: parseSinceLastLogin(row.since_last_login),
    personal_timeline: parseEvents(row.personal_timeline),
    organization_timeline: parseEvents(row.organization_timeline),
    team_timeline: parseEvents(row.team_timeline),
    categories: Array.isArray(row.categories)
      ? row.categories.map((c) => {
          const item = c as Record<string, unknown>;
          return { key: String(item.key ?? ""), label: String(item.label ?? "") };
        })
      : undefined,
    priorities: Array.isArray(row.priorities)
      ? row.priorities.map((p) => {
          const item = p as Record<string, unknown>;
          return {
            key: String(item.key ?? ""),
            label: String(item.label ?? ""),
            icon: item.icon ? String(item.icon) : undefined,
          };
        })
      : undefined,
    timeline_ranges: Array.isArray(row.timeline_ranges) ? row.timeline_ranges.map(String) : undefined,
    approval_feed: parseEvents(row.approval_feed),
    business_pack_activity: parseEvents(row.business_pack_activity),
    domain_activity: parseEvents(row.domain_activity),
    companion_highlights: parseHighlights(row.companion_highlights),
    activity_intelligence: row.activity_intelligence as Record<string, unknown> | undefined,
    executive_briefing: row.executive_briefing as Record<string, unknown> | undefined,
    notifications_integration: row.notifications_integration as Record<string, unknown> | undefined,
    search_integration: row.search_integration as Record<string, unknown> | undefined,
    reports: row.reports as Record<string, unknown> | undefined,
    companion_integration: row.companion_integration as Record<string, unknown> | undefined,
    mobile_access: row.mobile_access as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? row.audit_recent.map((entry) => {
          const e = entry as Record<string, unknown>;
          return {
            action: String(e.action ?? ""),
            summary: String(e.summary ?? ""),
            section: e.section ? String(e.section) : undefined,
            created_at: e.created_at ? String(e.created_at) : undefined,
          };
        })
      : undefined,
    routes: row.routes as Record<string, string> | undefined,
    error: row.error ? String(row.error) : undefined,
    access_state: row.access_state ? String(row.access_state) : undefined,
  };
}

export function parseActivitySearchResult(row: Record<string, unknown>): ActivityEvent[] {
  if (row.found !== true || !Array.isArray(row.results)) return [];
  return row.results.map((r) => parseEvent(r as Record<string, unknown>));
}
