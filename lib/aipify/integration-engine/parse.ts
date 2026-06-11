import type { IntegrationEngineCard, IntegrationEngineDashboard } from "./types";

export function parseIntegrationEngineCard(data: unknown): IntegrationEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    active_integrations: Number(d.active_integrations ?? 0),
    failed_integrations: Number(d.failed_integrations ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
  };
}

export function parseIntegrationEngineDashboard(data: unknown): IntegrationEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    connected_integrations: Array.isArray(d.connected_integrations)
      ? (d.connected_integrations as IntegrationEngineDashboard["connected_integrations"])
      : [],
    catalog: Array.isArray(d.catalog) ? (d.catalog as IntegrationEngineDashboard["catalog"]) : [],
    recent_failures: Array.isArray(d.recent_failures)
      ? (d.recent_failures as IntegrationEngineDashboard["recent_failures"])
      : [],
    recent_webhooks: Array.isArray(d.recent_webhooks)
      ? (d.recent_webhooks as IntegrationEngineDashboard["recent_webhooks"])
      : [],
    pending_actions: Array.isArray(d.pending_actions)
      ? (d.pending_actions as IntegrationEngineDashboard["pending_actions"])
      : [],
    health_summary:
      typeof d.health_summary === "object" && d.health_summary
        ? (d.health_summary as IntegrationEngineDashboard["health_summary"])
        : undefined,
    unonight_pilot:
      typeof d.unonight_pilot === "object" && d.unonight_pilot
        ? (d.unonight_pilot as IntegrationEngineDashboard["unonight_pilot"])
        : undefined,
  };
}
