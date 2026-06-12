import type {
  BlueprintItem,
  BlueprintObjective,
  ComplianceAuditReadinessItem,
  ComplianceCompanionBlueprint,
  ComplianceEngagementSummary,
  CompliancePolicyRegistryItem,
  ComplianceRegulatoryReadinessEngineCard,
  ComplianceRegulatoryReadinessEngineDashboard,
  ComplianceReviewCycle,
  IntegrationLink,
  SelfLoveConnection,
  SuccessCriterion,
} from "./types";

function asStringArray(value: unknown): string[] | undefined {
  return Array.isArray(value) ? (value as string[]) : undefined;
}

function asObjectArray<T>(value: unknown): T[] | undefined {
  return Array.isArray(value) ? (value as T[]) : undefined;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : undefined;
}

function parseEngagementSummary(value: unknown): ComplianceEngagementSummary | undefined {
  const d = asRecord(value);
  if (!d) return undefined;
  return d as ComplianceEngagementSummary;
}

function parseCompanionBlueprint(value: unknown): ComplianceCompanionBlueprint | undefined {
  const d = asRecord(value);
  if (!d) return undefined;
  return {
    principle: typeof d.principle === "string" ? d.principle : undefined,
    may: asStringArray(d.may),
    must_avoid: asStringArray(d.must_avoid),
    legal_disclaimer: typeof d.legal_disclaimer === "string" ? d.legal_disclaimer : undefined,
  };
}

function parseSelfLoveConnection(value: unknown): SelfLoveConnection | undefined {
  const d = asRecord(value);
  if (!d) return undefined;
  return {
    principle: typeof d.principle === "string" ? d.principle : undefined,
    practices: asStringArray(d.practices),
    self_love_route: typeof d.self_love_route === "string" ? d.self_love_route : undefined,
    boundary_note: typeof d.boundary_note === "string" ? d.boundary_note : undefined,
  };
}

function parseSections(value: unknown): ComplianceRegulatoryReadinessEngineDashboard["sections"] {
  const d = asRecord(value);
  if (!d) return undefined;
  return {
    policy_registry: asObjectArray<CompliancePolicyRegistryItem>(d.policy_registry),
    review_cycles: asObjectArray<ComplianceReviewCycle>(d.review_cycles),
    audit_readiness_items: asObjectArray<ComplianceAuditReadinessItem>(d.audit_readiness_items),
  };
}

export function parseComplianceRegulatoryReadinessEngineCard(data: unknown): ComplianceRegulatoryReadinessEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    open_records: typeof d.open_records === "number" ? d.open_records : undefined,
    implementation_blueprint_phase145: asRecord(d.implementation_blueprint_phase145),
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    legal_disclaimer: typeof d.legal_disclaimer === "string" ? d.legal_disclaimer : undefined,
    blueprint_note: typeof d.blueprint_note === "string" ? d.blueprint_note : undefined,
    companion_note: typeof d.companion_note === "string" ? d.companion_note : undefined,
    ...d,
  } as ComplianceRegulatoryReadinessEngineCard;
}

export function parseComplianceRegulatoryReadinessEngineDashboard(data: unknown): ComplianceRegulatoryReadinessEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: asStringArray(d.principles),
    summary: asRecord(d.summary),
    records: asObjectArray<Record<string, unknown>>(d.records),
    retention_policies: asObjectArray<Record<string, unknown>>(d.retention_policies),
    review_schedules: asObjectArray<Record<string, unknown>>(d.review_schedules),
    implementation_blueprint_phase145: asRecord(d.implementation_blueprint_phase145),
    global_compliance_regulatory_intelligence_note:
      typeof d.global_compliance_regulatory_intelligence_note === "string"
        ? d.global_compliance_regulatory_intelligence_note
        : undefined,
    blueprint_distinction_note:
      typeof d.blueprint_distinction_note === "string" ? d.blueprint_distinction_note : undefined,
    blueprint_mission: typeof d.blueprint_mission === "string" ? d.blueprint_mission : undefined,
    blueprint_philosophy: typeof d.blueprint_philosophy === "string" ? d.blueprint_philosophy : undefined,
    blueprint_abos_principle:
      typeof d.blueprint_abos_principle === "string" ? d.blueprint_abos_principle : undefined,
    vision: typeof d.vision === "string" ? d.vision : undefined,
    phase145_objectives: asObjectArray<BlueprintObjective>(d.phase145_objectives),
    global_compliance_center: asRecord(d.global_compliance_center),
    regulatory_intelligence_engine: asObjectArray<BlueprintItem>(d.regulatory_intelligence_engine),
    policy_management_engine: asObjectArray<BlueprintItem>(d.policy_management_engine),
    compliance_review_engine: asObjectArray<BlueprintItem>(d.compliance_review_engine),
    executive_compliance_dashboard: asRecord(d.executive_compliance_dashboard),
    compliance_companion: parseCompanionBlueprint(d.compliance_companion),
    audit_readiness_engine: asObjectArray<BlueprintItem>(d.audit_readiness_engine),
    growth_partner_compliance_support: asRecord(d.growth_partner_compliance_support),
    phase145_companion_limitations: asStringArray(d.phase145_companion_limitations),
    phase145_self_love_connection: parseSelfLoveConnection(d.phase145_self_love_connection),
    phase145_security_requirements: asObjectArray<BlueprintItem>(d.phase145_security_requirements),
    phase145_integration_links: asObjectArray<IntegrationLink>(d.phase145_integration_links),
    dogfooding_phase145: asRecord(d.dogfooding_phase145),
    phase145_success_criteria: asObjectArray<SuccessCriterion>(d.phase145_success_criteria),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    vision_phrases: asStringArray(d.vision_phrases),
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    legal_disclaimer: typeof d.legal_disclaimer === "string" ? d.legal_disclaimer : undefined,
    sections: parseSections(d.sections),
    ...d,
  } as ComplianceRegulatoryReadinessEngineDashboard;
}
