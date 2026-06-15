import type { AipifyHostsAutomationCard, AipifyHostsAutomationDashboard } from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

export function parseAipifyHostsAutomationDashboard(data: unknown): AipifyHostsAutomationDashboard | null {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!d.has_customer) return null;

  const snapshot = (typeof d.operational_snapshot === "object" && d.operational_snapshot
    ? d.operational_snapshot
    : {}) as Record<string, unknown>;

  const briefing = (typeof d.daily_briefing === "object" && d.daily_briefing
    ? d.daily_briefing
    : {}) as Record<string, unknown>;

  return {
    has_customer: true,
    enabled: Boolean(d.enabled),
    package_key: typeof d.package_key === "string" ? d.package_key : "hosts_starter",
    property_count: Number(d.property_count ?? 0),
    human_oversight_required: Boolean(d.human_oversight_required ?? true),
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    modules: asArray(d.modules),
    approval_levels: asArray(d.approval_levels),
    playbooks: asArray(d.playbooks),
    provider_categories: asArray<string>(d.provider_categories),
    supply_categories: asArray<string>(d.supply_categories),
    governance: (typeof d.governance === "object" && d.governance
      ? d.governance
      : {
          principle: "",
          approval_required: true,
          audit_required: true,
          human_oversight_required: true,
        }) as AipifyHostsAutomationDashboard["governance"],
    success_metrics: asArray(d.success_metrics),
    knowledge_categories: asArray<string>(d.knowledge_categories),
    operational_snapshot: {
      arrivals_today: Number(snapshot.arrivals_today ?? 0),
      departures_today: Number(snapshot.departures_today ?? 0),
      pending_tasks: Number(snapshot.pending_tasks ?? 0),
      occupancy_forecast_pct: Number(snapshot.occupancy_forecast_pct ?? 0),
      pending_approvals: Number(snapshot.pending_approvals ?? 0),
      active_workflows: Number(snapshot.active_workflows ?? 0),
      low_supply_alerts: Number(snapshot.low_supply_alerts ?? 0),
    },
    arrival_readiness: asArray(d.arrival_readiness),
    daily_briefing: {
      greeting: typeof briefing.greeting === "string" ? briefing.greeting : "Good morning",
      priorities: asArray<string>(briefing.priorities),
      recommendations: asArray<string>(briefing.recommendations),
    },
    recommendations: asArray(d.recommendations),
  };
}

export function parseAipifyHostsAutomationCard(data: unknown): AipifyHostsAutomationCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: d.enabled !== undefined ? Boolean(d.enabled) : undefined,
    package_key: typeof d.package_key === "string" ? d.package_key : undefined,
    property_count: d.property_count !== undefined ? Number(d.property_count) : undefined,
    human_oversight_required: d.human_oversight_required !== undefined ? Boolean(d.human_oversight_required) : undefined,
    positioning: typeof d.positioning === "string" ? d.positioning : undefined,
    route: typeof d.route === "string" ? d.route : undefined,
  };
}
