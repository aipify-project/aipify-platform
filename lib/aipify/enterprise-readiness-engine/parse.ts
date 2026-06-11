import type {
  EnterpriseReadinessEngineCard,
  EnterpriseReadinessEngineDashboard,
  EnterpriseReadinessSummary,
  EnterpriseReport,
} from "./types";

function asRecordList(value: unknown): Array<Record<string, unknown>> {
  return Array.isArray(value) ? (value as Array<Record<string, unknown>>) : [];
}

export function parseEnterpriseReadinessEngineCard(data: unknown): EnterpriseReadinessEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    overall_readiness_score:
      typeof d.overall_readiness_score === "number" ? d.overall_readiness_score : undefined,
    health_status: typeof d.health_status === "string" ? d.health_status : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    ...d,
  };
}

export function parseEnterpriseReadinessEngineDashboard(
  data: unknown
): EnterpriseReadinessEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  const summary =
    typeof d.summary === "object" && d.summary ? (d.summary as EnterpriseReadinessSummary) : undefined;

  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary,
    health_overview:
      typeof d.health_overview === "object" && d.health_overview
        ? (d.health_overview as Record<string, unknown>)
        : undefined,
    approval_bottlenecks: asRecordList(d.approval_bottlenecks),
    security_posture:
      typeof d.security_posture === "object" && d.security_posture
        ? (d.security_posture as Record<string, unknown>)
        : undefined,
    integration_landscape:
      typeof d.integration_landscape === "object" && d.integration_landscape
        ? (d.integration_landscape as Record<string, unknown>)
        : undefined,
    operational_risks: asRecordList(d.operational_risks),
    delegated_admins: asRecordList(d.delegated_admins),
    approval_chains: asRecordList(d.approval_chains),
    onboarding_milestones: asRecordList(d.onboarding_milestones),
    enterprise_settings:
      typeof d.enterprise_settings === "object" && d.enterprise_settings
        ? (d.enterprise_settings as Record<string, unknown>)
        : undefined,
    deployment_readiness:
      typeof d.deployment_readiness === "object" && d.deployment_readiness
        ? (d.deployment_readiness as Record<string, unknown>)
        : undefined,
    reports_available: Array.isArray(d.reports_available) ? (d.reports_available as string[]) : undefined,
    ...d,
  };
}

export function parseEnterpriseReport(data: unknown): EnterpriseReport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    report_type: typeof d.report_type === "string" ? d.report_type : undefined,
    generated_at: typeof d.generated_at === "string" ? d.generated_at : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    ...d,
  };
}
