import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  ExecutiveReview,
  AipifyEnterpriseKnowledgeValidationQualityAssuranceEngineBlueprint,
  AipifyEnterpriseKnowledgeValidationQualityAssuranceEngineCard,
  AipifyEnterpriseKnowledgeValidationQualityAssuranceEngineDashboard,
  AipifyEnterpriseKnowledgeValidationQualityAssuranceEngineEngagementSummary,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LimitationPrinciples,
  ReflectionEntry,
  ScaffoldNote,
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

function parseEngagementSummary(data: unknown): AipifyEnterpriseKnowledgeValidationQualityAssuranceEngineEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as AipifyEnterpriseKnowledgeValidationQualityAssuranceEngineEngagementSummary;
}

function parseBlueprintBlock(data: unknown): AipifyEnterpriseKnowledgeValidationQualityAssuranceEngineBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as AipifyEnterpriseKnowledgeValidationQualityAssuranceEngineBlueprint;
}

function parseExecutiveReviews(data: unknown): ExecutiveReview[] {
  if (!Array.isArray(data)) return [];
  return data as ExecutiveReview[];
}

function parseReflections(data: unknown): ReflectionEntry[] {
  if (!Array.isArray(data)) return [];
  return data as ReflectionEntry[];
}

function parseScaffoldNotes(data: unknown): ScaffoldNote[] {
  if (!Array.isArray(data)) return [];
  return data as ScaffoldNote[];
}

export function parseAipifyEnterpriseKnowledgeValidationQualityAssuranceEngineCard(data: unknown): AipifyEnterpriseKnowledgeValidationQualityAssuranceEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    aipify_enterprise_knowledge_validation_quality_assurance_score: Number(d.aipify_enterprise_knowledge_validation_quality_assurance_score ?? 0),
    enabled: Boolean(d.enabled),
    enterprise_knowledge_validation_quality_assurance_mode: typeof d.enterprise_knowledge_validation_quality_assurance_mode === "string" ? d.enterprise_knowledge_validation_quality_assurance_mode : undefined,
    enterprise_knowledge_validation_quality_assurance_maturity_level: Number(d.enterprise_knowledge_validation_quality_assurance_maturity_level ?? 1),
    reflections_count: Number(d.reflections_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    aipify_enterprise_knowledge_validation_quality_assurance_mission: typeof d.aipify_enterprise_knowledge_validation_quality_assurance_mission === "string" ? d.aipify_enterprise_knowledge_validation_quality_assurance_mission : undefined,
    aipify_enterprise_knowledge_validation_quality_assurance_abos_principle: typeof d.aipify_enterprise_knowledge_validation_quality_assurance_abos_principle === "string" ? d.aipify_enterprise_knowledge_validation_quality_assurance_abos_principle : undefined,
    aipify_enterprise_knowledge_validation_quality_assurance_engagement_summary: parseEngagementSummary(d.aipify_enterprise_knowledge_validation_quality_assurance_engagement_summary),
    aipify_enterprise_knowledge_validation_quality_assurance_note: typeof d.aipify_enterprise_knowledge_validation_quality_assurance_note === "string" ? d.aipify_enterprise_knowledge_validation_quality_assurance_note : undefined,
    aipify_enterprise_knowledge_validation_quality_assurance_vision_note: typeof d.aipify_enterprise_knowledge_validation_quality_assurance_vision_note === "string" ? d.aipify_enterprise_knowledge_validation_quality_assurance_vision_note : undefined,
  };
}

export function parseAipifyEnterpriseKnowledgeValidationQualityAssuranceEngineDashboard(data: unknown): AipifyEnterpriseKnowledgeValidationQualityAssuranceEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    enterprise_knowledge_validation_quality_assurance_mode: typeof d.enterprise_knowledge_validation_quality_assurance_mode === "string" ? d.enterprise_knowledge_validation_quality_assurance_mode : undefined,
    enterprise_knowledge_validation_quality_assurance_maturity_level: Number(d.enterprise_knowledge_validation_quality_assurance_maturity_level ?? 1),
    human_oversight_required: Boolean(d.human_oversight_required),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    aipify_enterprise_knowledge_validation_quality_assurance_score: Number(d.aipify_enterprise_knowledge_validation_quality_assurance_score ?? 0),
    executive_reviews_count: Number(d.executive_reviews_count ?? 0),
    reflections_count: Number(d.reflections_count ?? 0),
    enterprise_knowledge_validation_quality_assurance_notes_count: Number(d.enterprise_knowledge_validation_quality_assurance_notes_count ?? 0),
    active_reflections_count: Number(d.active_reflections_count ?? 0),
    era_phases_count: Number(d.era_phases_count ?? 0),
    executive_reviews: parseExecutiveReviews(d.executive_reviews),
    reflections: parseReflections(d.reflections),
    scaffold_notes: parseScaffoldNotes(d.scaffold_notes),
    integration_links: parseIntegrationLinks(d.integration_links),
    era_opener_summary: parseIntegrationLinks(d.era_opener_summary),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    aipify_enterprise_knowledge_validation_quality_assurance_blueprint: parseBlueprintBlock(d.aipify_enterprise_knowledge_validation_quality_assurance_blueprint),
    aipify_enterprise_knowledge_validation_quality_assurance_mission: typeof d.aipify_enterprise_knowledge_validation_quality_assurance_mission === "string" ? d.aipify_enterprise_knowledge_validation_quality_assurance_mission : undefined,
    aipify_enterprise_knowledge_validation_quality_assurance_philosophy: typeof d.aipify_enterprise_knowledge_validation_quality_assurance_philosophy === "string" ? d.aipify_enterprise_knowledge_validation_quality_assurance_philosophy : undefined,
    aipify_enterprise_knowledge_validation_quality_assurance_abos_principle: typeof d.aipify_enterprise_knowledge_validation_quality_assurance_abos_principle === "string" ? d.aipify_enterprise_knowledge_validation_quality_assurance_abos_principle : undefined,
    aipify_enterprise_knowledge_validation_quality_assurance_objectives: parseObjectives(d.aipify_enterprise_knowledge_validation_quality_assurance_objectives),
    center_meta: typeof d.center_meta === "object" && d.center_meta ? (d.center_meta as Record<string, unknown>) : undefined,
    engine_meta: typeof d.engine_meta === "object" && d.engine_meta ? (d.engine_meta as Record<string, unknown>) : undefined,
    framework_meta: typeof d.framework_meta === "object" && d.framework_meta ? (d.framework_meta as Record<string, unknown>) : undefined,
    executive_reviews_meta: typeof d.executive_reviews_meta === "object" && d.executive_reviews_meta ? (d.executive_reviews_meta as Record<string, unknown>) : undefined,
    companion_meta: typeof d.companion_meta === "object" && d.companion_meta ? (d.companion_meta as Record<string, unknown>) : undefined,
    sub_engine_meta: typeof d.sub_engine_meta === "object" && d.sub_engine_meta ? (d.sub_engine_meta as Record<string, unknown>) : undefined,
    companion_limitations_meta: parseLimitationPrinciples(d.companion_limitations_meta),
    self_love_connection_meta: typeof d.self_love_connection_meta === "object" && d.self_love_connection_meta ? (d.self_love_connection_meta as Record<string, unknown>) : undefined,
    security_requirements_meta: typeof d.security_requirements_meta === "object" && d.security_requirements_meta ? (d.security_requirements_meta as Record<string, unknown>) : undefined,
    aekvqaebp254_integration_links: parseIntegrationLinks(d.aekvqaebp254_integration_links),
    aekvqaebp254_era_opener_summary: parseIntegrationLinks(d.aekvqaebp254_era_opener_summary),
    aipify_enterprise_knowledge_validation_quality_assurance_engagement_summary: parseEngagementSummary(d.aipify_enterprise_knowledge_validation_quality_assurance_engagement_summary),
    aipify_enterprise_knowledge_validation_quality_assurance_success_criteria: parseSuccessCriteria(d.aipify_enterprise_knowledge_validation_quality_assurance_success_criteria),
    aipify_enterprise_knowledge_validation_quality_assurance_vision: typeof d.aipify_enterprise_knowledge_validation_quality_assurance_vision === "string" ? d.aipify_enterprise_knowledge_validation_quality_assurance_vision : undefined,
    aipify_enterprise_knowledge_validation_quality_assurance_vision_phrases: Array.isArray(d.aipify_enterprise_knowledge_validation_quality_assurance_vision_phrases) ? (d.aipify_enterprise_knowledge_validation_quality_assurance_vision_phrases as string[]) : undefined,
    aipify_enterprise_knowledge_validation_quality_assurance_privacy_note: typeof d.aipify_enterprise_knowledge_validation_quality_assurance_privacy_note === "string" ? d.aipify_enterprise_knowledge_validation_quality_assurance_privacy_note : undefined,
    aipify_enterprise_knowledge_validation_quality_assurance_dogfooding: typeof d.aipify_enterprise_knowledge_validation_quality_assurance_dogfooding === "string" ? d.aipify_enterprise_knowledge_validation_quality_assurance_dogfooding : undefined,
    aipify_enterprise_knowledge_validation_quality_assurance_engine_note: typeof d.aipify_enterprise_knowledge_validation_quality_assurance_engine_note === "string" ? d.aipify_enterprise_knowledge_validation_quality_assurance_engine_note : undefined,
    aipify_enterprise_knowledge_validation_quality_assurance_distinction_note: typeof d.aipify_enterprise_knowledge_validation_quality_assurance_distinction_note === "string" ? d.aipify_enterprise_knowledge_validation_quality_assurance_distinction_note : undefined,
  };
}
