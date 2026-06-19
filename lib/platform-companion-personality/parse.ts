import type { InteractionRecord, PlatformCompanionPersonalityCenter } from "./types";

function parseInteraction(row: Record<string, unknown>): InteractionRecord {
  return {
    interaction_type: String(row.interaction_type ?? ""),
    summary: String(row.summary ?? ""),
    topic_key: row.topic_key ? String(row.topic_key) : undefined,
    style_used: row.style_used ? String(row.style_used) : undefined,
    quality_score: row.quality_score != null ? Number(row.quality_score) : undefined,
    recorded_at: row.recorded_at ? String(row.recorded_at) : undefined,
  };
}

export function parsePlatformCompanionPersonalityCenter(
  row: Record<string, unknown> | null
): PlatformCompanionPersonalityCenter | null {
  if (!row || typeof row !== "object") return null;
  return {
    found: row.found === true,
    principle: row.principle ? String(row.principle) : undefined,
    philosophy: row.philosophy ? String(row.philosophy) : undefined,
    section: row.section ? String(row.section) : undefined,
    overview: row.overview as Record<string, string | number | unknown> | undefined,
    personality: row.personality as Record<string, unknown> | undefined,
    communication: row.communication as Record<string, unknown> | undefined,
    preferences: row.preferences as Record<string, unknown> | undefined,
    relationship_model: row.relationship_model as Record<string, unknown> | undefined,
    interaction_history: Array.isArray(row.interaction_history)
      ? row.interaction_history.map((r) => parseInteraction(r as Record<string, unknown>))
      : undefined,
    adaptation: row.adaptation as Record<string, unknown> | undefined,
    reports: row.reports as Record<string, unknown> | undefined,
    executive_dashboard: row.executive_dashboard as Record<string, unknown> | undefined,
    tenant_aggregate: row.tenant_aggregate as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? row.audit_recent.map((entry) => {
          const e = entry as Record<string, unknown>;
          return {
            event_type: String(e.event_type ?? ""),
            summary: String(e.summary ?? ""),
            created_at: e.created_at ? String(e.created_at) : undefined,
          };
        })
      : undefined,
    mobile_access: row.mobile_access as Record<string, unknown> | undefined,
    routes: row.routes as Record<string, string> | undefined,
    notifications: row.notifications as Record<string, unknown> | undefined,
  };
}
