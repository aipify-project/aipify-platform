import type { HumanOversightEngineCard, HumanOversightEngineDashboard } from "./types";

export function parseHumanOversightEngineCard(data: unknown): HumanOversightEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as HumanOversightEngineCard;
}

export function parseHumanOversightEngineDashboard(data: unknown): HumanOversightEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    settings:
      typeof d.settings === "object" && d.settings
        ? (d.settings as HumanOversightEngineDashboard["settings"])
        : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    accountability_metrics:
      typeof d.accountability_metrics === "object" && d.accountability_metrics
        ? (d.accountability_metrics as Record<string, unknown>)
        : undefined,
    pending_approvals: Array.isArray(d.pending_approvals)
      ? (d.pending_approvals as HumanOversightEngineDashboard["pending_approvals"])
      : undefined,
    rejected_recommendations: Array.isArray(d.rejected_recommendations)
      ? (d.rejected_recommendations as HumanOversightEngineDashboard["rejected_recommendations"])
      : undefined,
    high_risk_actions: Array.isArray(d.high_risk_actions)
      ? (d.high_risk_actions as HumanOversightEngineDashboard["high_risk_actions"])
      : undefined,
    override_trends: Array.isArray(d.override_trends)
      ? (d.override_trends as Record<string, unknown>[])
      : undefined,
    risk_distribution: Array.isArray(d.risk_distribution)
      ? (d.risk_distribution as HumanOversightEngineDashboard["risk_distribution"])
      : undefined,
    integration_links:
      typeof d.integration_links === "object" && d.integration_links
        ? (d.integration_links as Record<string, string>)
        : undefined,
    ...d,
  } as HumanOversightEngineDashboard;
}
