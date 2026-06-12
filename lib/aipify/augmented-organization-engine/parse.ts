import type {
  AbosSuccessCriterion,
  AgencyRecord,
  AugmentedOrganizationBlueprint,
  AugmentedOrganizationCard,
  AugmentedOrganizationDashboard,
  AugmentedOrganizationEngagementSummary,
  BlueprintObjective,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LimitationPrinciples,
  SymbiosisAssessment,
  TrustSignal,
} from "./types";

function parseBlueprintMeta(data: unknown): ImplementationBlueprintMeta | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ImplementationBlueprintMeta;
}

function parseObjectives(data: unknown): BlueprintObjective[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as BlueprintObjective[];
}

function parseSuccessCriteria(data: unknown): AbosSuccessCriterion[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as AbosSuccessCriterion[];
}

function parseIntegrationLinks(data: unknown): IntegrationLink[] {
  if (!Array.isArray(data)) return [];
  return data as IntegrationLink[];
}

function parseLimitationPrinciples(data: unknown): LimitationPrinciples | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as LimitationPrinciples;
}

function parseEngagementSummary(data: unknown): AugmentedOrganizationEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as AugmentedOrganizationEngagementSummary;
}

function parseBlueprintBlock(data: unknown): AugmentedOrganizationBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as AugmentedOrganizationBlueprint;
}

function parseAssessments(data: unknown): SymbiosisAssessment[] {
  if (!Array.isArray(data)) return [];
  return data as SymbiosisAssessment[];
}

function parseTrustSignals(data: unknown): TrustSignal[] {
  if (!Array.isArray(data)) return [];
  return data as TrustSignal[];
}

function parseAgencyRecords(data: unknown): AgencyRecord[] {
  if (!Array.isArray(data)) return [];
  return data as AgencyRecord[];
}

export function parseAugmentedOrganizationCard(data: unknown): AugmentedOrganizationCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    symbiosis_score: Number(d.symbiosis_score ?? 0),
    symbiosis_maturity_level: Number(d.symbiosis_maturity_level ?? 1),
    symbiosis_assessments_count: Number(d.symbiosis_assessments_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    human_agency_protection_enabled: Boolean(d.human_agency_protection_enabled),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    augmented_organization_mission:
      typeof d.augmented_organization_mission === "string" ? d.augmented_organization_mission : undefined,
    augmented_organization_abos_principle:
      typeof d.augmented_organization_abos_principle === "string"
        ? d.augmented_organization_abos_principle
        : undefined,
    augmented_organization_engagement_summary: parseEngagementSummary(
      d.augmented_organization_engagement_summary,
    ),
    augmented_organization_note:
      typeof d.augmented_organization_note === "string" ? d.augmented_organization_note : undefined,
    augmented_organization_vision_note:
      typeof d.augmented_organization_vision_note === "string"
        ? d.augmented_organization_vision_note
        : undefined,
  };
}

export function parseAugmentedOrganizationDashboard(data: unknown): AugmentedOrganizationDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    symbiosis_maturity_level: Number(d.symbiosis_maturity_level ?? 1),
    human_agency_protection_enabled: Boolean(d.human_agency_protection_enabled),
    trust_transparency_enabled: Boolean(d.trust_transparency_enabled),
    human_oversight_required: Boolean(d.human_oversight_required),
    governance_visibility:
      typeof d.governance_visibility === "string" ? d.governance_visibility : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    symbiosis_score: Number(d.symbiosis_score ?? 0),
    symbiosis_assessments_count: Number(d.symbiosis_assessments_count ?? 0),
    trust_signals_count: Number(d.trust_signals_count ?? 0),
    agency_records_count: Number(d.agency_records_count ?? 0),
    symbiosis_assessments: parseAssessments(d.symbiosis_assessments),
    trust_signals: parseTrustSignals(d.trust_signals),
    agency_records: parseAgencyRecords(d.agency_records),
    integration_links: parseIntegrationLinks(d.integration_links),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    augmented_organization_blueprint: parseBlueprintBlock(d.augmented_organization_blueprint),
    augmented_organization_mission:
      typeof d.augmented_organization_mission === "string" ? d.augmented_organization_mission : undefined,
    augmented_organization_philosophy:
      typeof d.augmented_organization_philosophy === "string"
        ? d.augmented_organization_philosophy
        : undefined,
    augmented_organization_abos_principle:
      typeof d.augmented_organization_abos_principle === "string"
        ? d.augmented_organization_abos_principle
        : undefined,
    augmented_organization_objectives: parseObjectives(d.augmented_organization_objectives),
    augmented_organization_center_meta:
      typeof d.augmented_organization_center_meta === "object" && d.augmented_organization_center_meta
        ? (d.augmented_organization_center_meta as Record<string, unknown>)
        : undefined,
    human_companion_symbiosis_model_meta:
      typeof d.human_companion_symbiosis_model_meta === "object" &&
      d.human_companion_symbiosis_model_meta
        ? (d.human_companion_symbiosis_model_meta as Record<string, unknown>)
        : undefined,
    symbiosis_design_principles_meta:
      typeof d.symbiosis_design_principles_meta === "object" && d.symbiosis_design_principles_meta
        ? (d.symbiosis_design_principles_meta as Record<string, unknown>)
        : undefined,
    augmented_experience_engine_meta:
      typeof d.augmented_experience_engine_meta === "object" && d.augmented_experience_engine_meta
        ? (d.augmented_experience_engine_meta as Record<string, unknown>)
        : undefined,
    human_agency_protection_framework_meta:
      typeof d.human_agency_protection_framework_meta === "object" &&
      d.human_agency_protection_framework_meta
        ? (d.human_agency_protection_framework_meta as Record<string, unknown>)
        : undefined,
    trust_engine_meta:
      typeof d.trust_engine_meta === "object" && d.trust_engine_meta
        ? (d.trust_engine_meta as Record<string, unknown>)
        : undefined,
    relationship_intelligence_engine_meta:
      typeof d.relationship_intelligence_engine_meta === "object" &&
      d.relationship_intelligence_engine_meta
        ? (d.relationship_intelligence_engine_meta as Record<string, unknown>)
        : undefined,
    augmented_organization_maturity_model_meta:
      typeof d.augmented_organization_maturity_model_meta === "object" &&
      d.augmented_organization_maturity_model_meta
        ? (d.augmented_organization_maturity_model_meta as Record<string, unknown>)
        : undefined,
    companion_limitations_meta: parseLimitationPrinciples(d.companion_limitations_meta),
    self_love_connection_meta:
      typeof d.self_love_connection_meta === "object" && d.self_love_connection_meta
        ? (d.self_love_connection_meta as Record<string, unknown>)
        : undefined,
    security_requirements_meta:
      typeof d.security_requirements_meta === "object" && d.security_requirements_meta
        ? (d.security_requirements_meta as Record<string, unknown>)
        : undefined,
    auorgbp140_era_capstone_summary: parseIntegrationLinks(d.auorgbp140_era_capstone_summary),
    auorgbp140_extended_cross_links: parseIntegrationLinks(d.auorgbp140_extended_cross_links),
    auorgbp140_integration_links: parseIntegrationLinks(d.auorgbp140_integration_links),
    augmented_organization_engagement_summary: parseEngagementSummary(
      d.augmented_organization_engagement_summary,
    ),
    augmented_organization_success_criteria: parseSuccessCriteria(
      d.augmented_organization_success_criteria,
    ),
    augmented_organization_vision:
      typeof d.augmented_organization_vision === "string" ? d.augmented_organization_vision : undefined,
    augmented_organization_vision_phrases: Array.isArray(d.augmented_organization_vision_phrases)
      ? (d.augmented_organization_vision_phrases as string[])
      : undefined,
    augmented_organization_privacy_note:
      typeof d.augmented_organization_privacy_note === "string"
        ? d.augmented_organization_privacy_note
        : undefined,
    augmented_organization_dogfooding:
      typeof d.augmented_organization_dogfooding === "string"
        ? d.augmented_organization_dogfooding
        : undefined,
    augmented_organization_engine_note:
      typeof d.augmented_organization_engine_note === "string"
        ? d.augmented_organization_engine_note
        : undefined,
    augmented_organization_distinction_note:
      typeof d.augmented_organization_distinction_note === "string"
        ? d.augmented_organization_distinction_note
        : undefined,
  };
}
