import type { AipifyHostsCard, AipifyHostsDashboard } from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

export function parseAipifyHostsDashboard(data: unknown): AipifyHostsDashboard | null {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!d.has_customer) return null;
  return {
    has_customer: true,
    enabled: Boolean(d.enabled),
    package_key: (typeof d.package_key === "string" ? d.package_key : "hosts_starter") as AipifyHostsDashboard["package_key"],
    property_count: Number(d.property_count ?? 0),
    human_oversight_required: Boolean(d.human_oversight_required),
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    platforms: asArray(d.platforms),
    modules: asArray(d.modules),
    packages: asArray(d.packages),
    executive_widgets: asArray(d.executive_widgets),
    success_metrics: asArray(d.success_metrics),
    governance: (typeof d.governance === "object" && d.governance ? d.governance : {
      principle: "",
      approval_required: true,
      audit_required: true,
    }) as AipifyHostsDashboard["governance"],
    property_health_score: Number(d.property_health_score ?? 0),
    properties: asArray(d.properties),
  };
}

export function parseAipifyHostsCard(data: unknown): AipifyHostsCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: d.enabled !== undefined ? Boolean(d.enabled) : undefined,
    package_key: typeof d.package_key === "string" ? (d.package_key as AipifyHostsCard["package_key"]) : undefined,
    property_count: d.property_count !== undefined ? Number(d.property_count) : undefined,
    human_oversight_required: d.human_oversight_required !== undefined ? Boolean(d.human_oversight_required) : undefined,
    positioning: typeof d.positioning === "string" ? d.positioning : undefined,
    route: typeof d.route === "string" ? d.route : undefined,
  };
}
