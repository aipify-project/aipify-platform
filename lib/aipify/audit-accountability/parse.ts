import type { AuditAccountabilityCard, AuditAccountabilityDashboard } from "./types";

export function parseAuditAccountabilityCard(data: unknown): AuditAccountabilityCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    total_events: Number(d.total_events ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
  };
}

export function parseAuditAccountabilityDashboard(data: unknown): AuditAccountabilityDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    recent_activity: Array.isArray(d.recent_activity)
      ? (d.recent_activity as AuditAccountabilityDashboard["recent_activity"])
      : [],
    pending_approvals: Number(d.pending_approvals ?? 0),
    ai_activity_timeline: Array.isArray(d.ai_activity_timeline)
      ? (d.ai_activity_timeline as AuditAccountabilityDashboard["ai_activity_timeline"])
      : [],
    failed_actions: Array.isArray(d.failed_actions)
      ? (d.failed_actions as AuditAccountabilityDashboard["failed_actions"])
      : [],
    security_events: Array.isArray(d.security_events)
      ? (d.security_events as AuditAccountabilityDashboard["security_events"])
      : [],
    top_action_categories: Array.isArray(d.top_action_categories)
      ? (d.top_action_categories as AuditAccountabilityDashboard["top_action_categories"])
      : [],
    retention_policy:
      typeof d.retention_policy === "object" && d.retention_policy
        ? (d.retention_policy as AuditAccountabilityDashboard["retention_policy"])
        : undefined,
    total_events: Number(d.total_events ?? 0),
    ai_events: Number(d.ai_events ?? 0),
    export_formats: Array.isArray(d.export_formats) ? (d.export_formats as string[]) : undefined,
  };
}
