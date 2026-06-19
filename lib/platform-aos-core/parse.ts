import type { AosEngine, PlatformAosCoreCenter } from "./types";

function parseEngine(row: Record<string, unknown>): AosEngine {
  return {
    id: String(row.id ?? row.engine_key ?? ""),
    engine_key: String(row.engine_key ?? ""),
    engine_name: String(row.engine_name ?? ""),
    engine_version: row.engine_version ? String(row.engine_version) : undefined,
    owner_team: row.owner_team ? String(row.owner_team) : undefined,
    engine_status: row.engine_status ? String(row.engine_status) : undefined,
    health_score: row.health_score != null ? Number(row.health_score) : undefined,
    dependencies: row.dependencies,
    business_pack_usage: row.business_pack_usage,
    activity_summary: row.activity_summary ? String(row.activity_summary) : undefined,
  };
}

export function parsePlatformAosCoreCenter(
  row: Record<string, unknown> | null
): PlatformAosCoreCenter | null {
  if (!row || typeof row !== "object") return null;
  return {
    found: row.found === true,
    principle: row.principle ? String(row.principle) : undefined,
    philosophy: row.philosophy ? String(row.philosophy) : undefined,
    section: row.section ? String(row.section) : undefined,
    overview: row.overview as Record<string, string | number | undefined> | undefined,
    engine_registry: Array.isArray(row.engine_registry)
      ? row.engine_registry.map((r) => parseEngine(r as Record<string, unknown>))
      : undefined,
    orchestration: row.orchestration as Record<string, unknown> | undefined,
    dependency_engine: row.dependency_engine as Record<string, unknown> | undefined,
    platform_governor: row.platform_governor as Record<string, unknown> | undefined,
    feature_flags: Array.isArray(row.feature_flags) ? row.feature_flags : undefined,
    platform_health: Array.isArray(row.platform_health) ? row.platform_health : undefined,
    platform_health_center: Array.isArray(row.platform_health_center)
      ? row.platform_health_center
      : undefined,
    companion_governance: row.companion_governance as Record<string, unknown> | undefined,
    execution_coordination: row.execution_coordination as Record<string, unknown> | undefined,
    cross_engine_messaging: Array.isArray(row.cross_engine_messaging)
      ? row.cross_engine_messaging
      : undefined,
    event_bus: row.event_bus as Record<string, unknown> | undefined,
    business_pack_registry: Array.isArray(row.business_pack_registry)
      ? row.business_pack_registry
      : undefined,
    platform_policies: Array.isArray(row.platform_policies) ? row.platform_policies : undefined,
    simulation_integration: row.simulation_integration as Record<string, unknown> | undefined,
    companion_advisor: row.companion_advisor as Record<string, unknown> | undefined,
    enterprise_readiness: row.enterprise_readiness as Record<string, unknown> | undefined,
    executive_dashboard: row.executive_dashboard as Record<string, unknown> | undefined,
    reports: row.reports as Record<string, unknown> | undefined,
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
  };
}
