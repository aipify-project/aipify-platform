import type {
  EnterpriseReadinessEngineCard,
  EnterpriseReadinessEngineDashboard,
  EnterpriseReadinessSummary,
  EnterpriseReport,
  ImplementationBlueprintPhase37,
} from "./types";

function asRecordList(value: unknown): Array<Record<string, unknown>> {
  return Array.isArray(value) ? (value as Array<Record<string, unknown>>) : [];
}

function parseBlueprintPhase37(d: Record<string, unknown>): ImplementationBlueprintPhase37 | undefined {
  const bp = d.implementation_blueprint_phase37;
  if (typeof bp !== "object" || !bp) return undefined;
  const b = bp as Record<string, unknown>;
  return {
    phase: typeof b.phase === "number" ? b.phase : undefined,
    title: typeof b.title === "string" ? b.title : undefined,
    doc: typeof b.doc === "string" ? b.doc : undefined,
    engine_phase: typeof b.engine_phase === "string" ? b.engine_phase : undefined,
    route: typeof b.route === "string" ? b.route : undefined,
    mapping_note: typeof b.mapping_note === "string" ? b.mapping_note : undefined,
  };
}

export function parseEnterpriseReadinessEngineCard(data: unknown): EnterpriseReadinessEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    overall_readiness_score:
      typeof d.overall_readiness_score === "number" ? d.overall_readiness_score : undefined,
    health_status: typeof d.health_status === "string" ? d.health_status : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    implementation_blueprint_phase37: parseBlueprintPhase37(d),
    enterprise_deployment_governance_phase:
      typeof d.enterprise_deployment_governance_phase === "number"
        ? d.enterprise_deployment_governance_phase
        : undefined,
    enterprise_abos_principle:
      typeof d.enterprise_abos_principle === "string" ? d.enterprise_abos_principle : undefined,
    enterprise_summary:
      typeof d.enterprise_summary === "object" && d.enterprise_summary
        ? (d.enterprise_summary as EnterpriseReadinessEngineCard["enterprise_summary"])
        : undefined,
    blueprint_note: typeof d.blueprint_note === "string" ? d.blueprint_note : undefined,
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
    implementation_blueprint_phase37: parseBlueprintPhase37(d),
    enterprise_deployment_governance_mission:
      typeof d.enterprise_deployment_governance_mission === "string"
        ? d.enterprise_deployment_governance_mission
        : undefined,
    enterprise_deployment_governance_philosophy:
      typeof d.enterprise_deployment_governance_philosophy === "string"
        ? d.enterprise_deployment_governance_philosophy
        : undefined,
    enterprise_objectives: Array.isArray(d.enterprise_objectives)
      ? (d.enterprise_objectives as EnterpriseReadinessEngineDashboard["enterprise_objectives"])
      : undefined,
    deployment_models:
      typeof d.deployment_models === "object" && d.deployment_models
        ? (d.deployment_models as EnterpriseReadinessEngineDashboard["deployment_models"])
        : undefined,
    identity_access_management:
      typeof d.identity_access_management === "object" && d.identity_access_management
        ? (d.identity_access_management as EnterpriseReadinessEngineDashboard["identity_access_management"])
        : undefined,
    multi_entity_support:
      typeof d.multi_entity_support === "object" && d.multi_entity_support
        ? (d.multi_entity_support as EnterpriseReadinessEngineDashboard["multi_entity_support"])
        : undefined,
    governance_controls:
      typeof d.governance_controls === "object" && d.governance_controls
        ? (d.governance_controls as EnterpriseReadinessEngineDashboard["governance_controls"])
        : undefined,
    executive_capabilities:
      typeof d.executive_capabilities === "object" && d.executive_capabilities
        ? (d.executive_capabilities as EnterpriseReadinessEngineDashboard["executive_capabilities"])
        : undefined,
    enterprise_self_love_connection:
      typeof d.enterprise_self_love_connection === "object" && d.enterprise_self_love_connection
        ? (d.enterprise_self_love_connection as EnterpriseReadinessEngineDashboard["enterprise_self_love_connection"])
        : undefined,
    enterprise_trust_connection:
      typeof d.enterprise_trust_connection === "object" && d.enterprise_trust_connection
        ? (d.enterprise_trust_connection as EnterpriseReadinessEngineDashboard["enterprise_trust_connection"])
        : undefined,
    enterprise_dogfooding:
      typeof d.enterprise_dogfooding === "object" && d.enterprise_dogfooding
        ? (d.enterprise_dogfooding as EnterpriseReadinessEngineDashboard["enterprise_dogfooding"])
        : undefined,
    enterprise_success_criteria: Array.isArray(d.enterprise_success_criteria)
      ? (d.enterprise_success_criteria as EnterpriseReadinessEngineDashboard["enterprise_success_criteria"])
      : undefined,
    enterprise_vision_phrases: Array.isArray(d.enterprise_vision_phrases)
      ? (d.enterprise_vision_phrases as string[])
      : undefined,
    enterprise_abos_principle:
      typeof d.enterprise_abos_principle === "string" ? d.enterprise_abos_principle : undefined,
    enterprise_distinction_note:
      typeof d.enterprise_distinction_note === "string" ? d.enterprise_distinction_note : undefined,
    enterprise_integration_links: Array.isArray(d.enterprise_integration_links)
      ? (d.enterprise_integration_links as EnterpriseReadinessEngineDashboard["enterprise_integration_links"])
      : undefined,
    enterprise_summary:
      typeof d.enterprise_summary === "object" && d.enterprise_summary
        ? (d.enterprise_summary as EnterpriseReadinessEngineDashboard["enterprise_summary"])
        : undefined,
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
