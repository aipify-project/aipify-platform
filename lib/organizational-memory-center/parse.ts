import type {
  MemoryContribution,
  MemoryGap,
  MemoryInsight,
  MemoryItem,
  OrganizationalMemoryCenter,
  RetentionRisk,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseItem(raw: unknown): MemoryItem {
  const row = asRecord(raw);
  return {
    item_key: String(row.item_key ?? ""),
    title: String(row.title ?? ""),
    category: String(row.category ?? ""),
    summary: String(row.summary ?? ""),
    validation_status: String(row.validation_status ?? "published"),
    health_level: String(row.health_level ?? "healthy"),
    usage_count: Number(row.usage_count ?? 0),
    owner_label: row.owner_label ? String(row.owner_label) : null,
    last_reviewed_at: row.last_reviewed_at ? String(row.last_reviewed_at) : null,
    source_type: row.source_type ? String(row.source_type) : null,
    created_at: row.created_at ? String(row.created_at) : null,
    updated_at: row.updated_at ? String(row.updated_at) : null,
  };
}

export function parseOrganizationalMemoryCenter(raw: unknown): OrganizationalMemoryCenter {
  const row = asRecord(raw);
  const dash = asRecord(row.dashboard);

  return {
    dashboard:
      Object.keys(dash).length > 0
        ? {
            knowledge_health_score: Number(dash.knowledge_health_score ?? 0),
            health_label: String(dash.health_label ?? "healthy"),
            recent_added_count: Number(dash.recent_added_count ?? 0),
            gaps_open_count: Number(dash.gaps_open_count ?? 0),
            usage_total: Number(dash.usage_total ?? 0),
            critical_risks_count: Number(dash.critical_risks_count ?? 0),
            retention_risks_count: Number(dash.retention_risks_count ?? 0),
            contributions_pending: Number(dash.contributions_pending ?? 0),
            reuse_rate: Number(dash.reuse_rate ?? 0),
          }
        : null,
    recent_knowledge: Array.isArray(row.recent_knowledge) ? row.recent_knowledge.map(parseItem) : [],
    knowledge_items: Array.isArray(row.knowledge_items) ? row.knowledge_items.map(parseItem) : [],
    knowledge_gaps: Array.isArray(row.knowledge_gaps)
      ? row.knowledge_gaps.map((g) => {
          const item = asRecord(g);
          return {
            gap_key: String(item.gap_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
            status: String(item.status ?? "open"),
          } satisfies MemoryGap;
        })
      : [],
    retention_risks: Array.isArray(row.retention_risks)
      ? row.retention_risks.map((r) => {
          const item = asRecord(r);
          return {
            risk_key: String(item.risk_key ?? ""),
            message: String(item.message ?? ""),
            risk_type: String(item.risk_type ?? ""),
            status: String(item.status ?? "open"),
          } satisfies RetentionRisk;
        })
      : [],
    insights: Array.isArray(row.insights)
      ? row.insights.map((i) => {
          const item = asRecord(i);
          return {
            insight_key: String(item.insight_key ?? ""),
            message: String(item.message ?? ""),
            priority: String(item.priority ?? "medium"),
          } satisfies MemoryInsight;
        })
      : [],
    contributions: Array.isArray(row.contributions)
      ? row.contributions.map((c) => {
          const item = asRecord(c);
          return {
            contribution_key: String(item.contribution_key ?? ""),
            contributor_label: String(item.contributor_label ?? ""),
            title: String(item.title ?? ""),
            content: String(item.content ?? ""),
            category: String(item.category ?? ""),
            status: String(item.status ?? "draft"),
            created_at: item.created_at ? String(item.created_at) : null,
          } satisfies MemoryContribution;
        })
      : [],
    links: row.links
      ? Object.fromEntries(Object.entries(asRecord(row.links)).map(([k, v]) => [k, String(v)]))
      : null,
    can_manage: Boolean(row.can_manage),
    can_contribute: Boolean(row.can_contribute),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}
