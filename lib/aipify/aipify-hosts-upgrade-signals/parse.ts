import type {
  HostsUpgradeRecommendation,
  HostsUpgradeSignal,
  HostsUpgradeSignalActionResult,
  HostsUpgradeSignalsCard,
  HostsUpgradeSignalsDashboard,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseSignals(data: unknown): HostsUpgradeSignal[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.signal_key) return null;
      return {
        signal_key: String(d.signal_key),
        severity: typeof d.severity === "string" ? d.severity : "moderate",
        priority: Number(d.priority ?? 0),
        title: typeof d.title === "string" ? d.title : "",
        message: typeof d.message === "string" ? d.message : "",
        context: typeof d.context === "object" && d.context ? (d.context as Record<string, unknown>) : {},
      };
    })
    .filter((r): r is HostsUpgradeSignal => r !== null);
}

function parseRecommendations(data: unknown): HostsUpgradeRecommendation[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.recommendation_key) return null;
      return {
        recommendation_key: String(d.recommendation_key),
        recommendation_type: typeof d.recommendation_type === "string" ? d.recommendation_type : "",
        title: typeof d.title === "string" ? d.title : "",
        message: typeof d.message === "string" ? d.message : "",
        action_type: typeof d.action_type === "string" ? d.action_type : "",
        action_target: typeof d.action_target === "string" ? d.action_target : "",
        priority: Number(d.priority ?? 0),
        routes: typeof d.routes === "object" && d.routes ? (d.routes as Record<string, string>) : {},
      };
    })
    .filter((r): r is HostsUpgradeRecommendation => r !== null);
}

function parseRecommendation(data: unknown): HostsUpgradeRecommendation | undefined {
  if (!data || typeof data !== "object") return undefined;
  const parsed = parseRecommendations([data]);
  return parsed[0];
}

export function parseAipifyHostsUpgradeSignalsDashboard(data: unknown): HostsUpgradeSignalsDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;
  return {
    has_customer: true,
    enabled: Boolean(d.enabled),
    package_key: typeof d.package_key === "string" ? d.package_key : "",
    surface: typeof d.surface === "string" ? d.surface : "",
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    principle: typeof d.principle === "string" ? d.principle : "",
    governance_note: typeof d.governance_note === "string" ? d.governance_note : "",
    licensing: typeof d.licensing === "object" && d.licensing ? (d.licensing as Record<string, unknown>) : {},
    signals: parseSignals(d.signals),
    recommendations: parseRecommendations(d.recommendations),
    routes: typeof d.routes === "object" && d.routes ? (d.routes as Record<string, string>) : {},
  };
}

export function parseAipifyHostsUpgradeSignalsCard(data: unknown): HostsUpgradeSignalsCard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;
  return {
    has_customer: true,
    show_banner: Boolean(d.show_banner),
    signal_count: d.signal_count != null ? Number(d.signal_count) : undefined,
    recommendation_count: d.recommendation_count != null ? Number(d.recommendation_count) : undefined,
    primary_recommendation: parseRecommendation(d.primary_recommendation),
    licensing: typeof d.licensing === "object" && d.licensing ? (d.licensing as Record<string, unknown>) : undefined,
    principle: typeof d.principle === "string" ? d.principle : undefined,
  };
}

export function parseAipifyHostsUpgradeSignalActionResult(data: unknown): HostsUpgradeSignalActionResult {
  const d = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;
  return {
    status: typeof d.status === "string" ? d.status : "",
    message: typeof d.message === "string" ? d.message : undefined,
    billing_route: typeof d.billing_route === "string" ? d.billing_route : undefined,
    workspace_route: typeof d.workspace_route === "string" ? d.workspace_route : undefined,
    marketplace_route: typeof d.marketplace_route === "string" ? d.marketplace_route : undefined,
    requires_payment: d.requires_payment != null ? Boolean(d.requires_payment) : undefined,
  };
}
