import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  CultureSnapshot,
  EngagementSummary,
  EthicsReview,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LimitationPrinciples,
  OrganizationalWisdomBlueprint,
  OrganizationalWisdomCard,
  OrganizationalWisdomCouncilBlueprint,
  OrganizationalWisdomDashboard,
  Phase157EngagementSummary,
  Phase157Sections,
  ReflectionWorkspace,
  SelfLoveConnection,
  WisdomPractice,
} from "./types";
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

function parseReflectionWorkspaces(data: unknown): ReflectionWorkspace[] {
  if (!Array.isArray(data)) return [];
  return data as ReflectionWorkspace[];
}

function parseEthicsReviews(data: unknown): EthicsReview[] {
  if (!Array.isArray(data)) return [];
  return data as EthicsReview[];
}

function parseCultureSnapshots(data: unknown): CultureSnapshot[] {
  if (!Array.isArray(data)) return [];
  return data as CultureSnapshot[];
}

function parseWisdomPractices(data: unknown): WisdomPractice[] {
  if (!Array.isArray(data)) return [];
  return data as WisdomPractice[];
}

function parseLimitationPrinciples(data: unknown): LimitationPrinciples | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as LimitationPrinciples;
}

function parseSelfLoveConnection(data: unknown): SelfLoveConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SelfLoveConnection;
}

function parseEngagementSummary(data: unknown): EngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as EngagementSummary;
}

function parseBlueprintBlock(data: unknown): OrganizationalWisdomBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as OrganizationalWisdomBlueprint;
}

function parsePhase157BlueprintBlock(data: unknown): OrganizationalWisdomCouncilBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as OrganizationalWisdomCouncilBlueprint;
}

function parsePhase157EngagementSummary(data: unknown): Phase157EngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as Phase157EngagementSummary;
}

function parsePhase157Sections(data: unknown): Phase157Sections | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as Phase157Sections;
}

function parseStringArray(data: unknown): string[] {
  if (!Array.isArray(data)) return [];
  return data.filter((item): item is string => typeof item === "string");
}

function parseRecord(data: unknown): Record<string, unknown> | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as Record<string, unknown>;
}

function parseRecordArray(data: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(data)) return [];
  return data as Array<Record<string, unknown>>;
}

export function parseOrganizationalWisdomCard(data: unknown): OrganizationalWisdomCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    wisdom_maturity_score: Number(d.wisdom_maturity_score ?? 0),
    active_reflection_workspaces: Number(d.active_reflection_workspaces ?? 0),
    ethics_reviews: Number(d.ethics_reviews ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    wisdom_center_enabled: Boolean(d.wisdom_center_enabled ?? true),
    implementation_blueprint_phase129: parseBlueprintMeta(d.implementation_blueprint_phase129),
    organizational_wisdom_mission:
      typeof d.organizational_wisdom_mission === "string" ? d.organizational_wisdom_mission : undefined,
    organizational_wisdom_abos_principle:
      typeof d.organizational_wisdom_abos_principle === "string"
        ? d.organizational_wisdom_abos_principle
        : undefined,
    organizational_wisdom_engagement_summary: parseEngagementSummary(d.organizational_wisdom_engagement_summary),
    organizational_wisdom_vision_note:
      typeof d.organizational_wisdom_vision_note === "string" ? d.organizational_wisdom_vision_note : undefined,
    implementation_blueprint_phase157: parseBlueprintMeta(d.implementation_blueprint_phase157),
    phase157_mission: typeof d.phase157_mission === "string" ? d.phase157_mission : undefined,
    phase157_abos_principle: typeof d.phase157_abos_principle === "string" ? d.phase157_abos_principle : undefined,
    phase157_vision: typeof d.phase157_vision === "string" ? d.phase157_vision : undefined,
    phase157_engagement_summary: parsePhase157EngagementSummary(d.phase157_engagement_summary),
    phase157_note: typeof d.phase157_note === "string" ? d.phase157_note : undefined,
    phase157_distinction_note:
      typeof d.phase157_distinction_note === "string" ? d.phase157_distinction_note : undefined,
  };
}

export function parseOrganizationalWisdomDashboard(data: unknown): OrganizationalWisdomDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    wisdom_center_enabled: Boolean(d.wisdom_center_enabled ?? true),
    ethical_reflection_enabled: Boolean(d.ethical_reflection_enabled ?? true),
    values_alignment_enabled: Boolean(d.values_alignment_enabled ?? true),
    decision_reflection_enabled: Boolean(d.decision_reflection_enabled ?? true),
    perspective_expansion_enabled: Boolean(d.perspective_expansion_enabled ?? true),
    governance_integration_enabled: Boolean(d.governance_integration_enabled ?? true),
    culture_insights_enabled: Boolean(d.culture_insights_enabled ?? true),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    wisdom_maturity_score: Number(d.wisdom_maturity_score ?? 0),
    active_reflection_workspaces: Number(d.active_reflection_workspaces ?? 0),
    ethics_reviews: Number(d.ethics_reviews ?? 0),
    culture_theme_snapshots: Number(d.culture_theme_snapshots ?? 0),
    wisdom_practices_count: Number(d.wisdom_practices_count ?? 0),
    wisdom_center_capabilities_count: Number(d.wisdom_center_capabilities_count ?? 0),
    ethical_questions_count: Number(d.ethical_questions_count ?? 0),
    values_dimensions_count: Number(d.values_dimensions_count ?? 0),
    perspective_groups_count: Number(d.perspective_groups_count ?? 0),
    reflection_workspaces: parseReflectionWorkspaces(d.reflection_workspaces),
    ethics_reviews_list: parseEthicsReviews(d.ethics_reviews_list),
    culture_snapshots: parseCultureSnapshots(d.culture_snapshots),
    wisdom_practices: parseWisdomPractices(d.wisdom_practices),
    ethical_question_scaffolds: parseRecordArray(d.ethical_question_scaffolds),
    values_dimension_scaffolds: parseRecordArray(d.values_dimension_scaffolds),
    perspective_group_scaffolds: parseRecordArray(d.perspective_group_scaffolds),
    decision_ethics_prompt_scaffolds: parseRecordArray(d.decision_ethics_prompt_scaffolds),
    culture_insight_area_scaffolds: parseRecordArray(d.culture_insight_area_scaffolds),
    wisdom_practice_scaffolds: parseRecordArray(d.wisdom_practice_scaffolds),
    integration_links: parseIntegrationLinks(d.integration_links),
    implementation_blueprint_phase129: parseBlueprintMeta(d.implementation_blueprint_phase129),
    organizational_wisdom_blueprint: parseBlueprintBlock(d.organizational_wisdom_blueprint),
    organizational_wisdom_mission:
      typeof d.organizational_wisdom_mission === "string" ? d.organizational_wisdom_mission : undefined,
    organizational_wisdom_philosophy:
      typeof d.organizational_wisdom_philosophy === "string" ? d.organizational_wisdom_philosophy : undefined,
    organizational_wisdom_abos_principle:
      typeof d.organizational_wisdom_abos_principle === "string"
        ? d.organizational_wisdom_abos_principle
        : undefined,
    organizational_wisdom_objectives: parseObjectives(d.organizational_wisdom_objectives),
    wisdom_center: parseRecord(d.wisdom_center),
    ethical_intelligence_engine: parseRecord(d.ethical_intelligence_engine),
    values_alignment_engine: parseRecord(d.values_alignment_engine),
    multi_perspective_framework: parseRecord(d.multi_perspective_framework),
    wisdom_companion: parseRecord(d.wisdom_companion),
    decision_ethics_review: parseRecord(d.decision_ethics_review),
    culture_insight_engine: parseRecord(d.culture_insight_engine),
    wisdom_practices_library: parseRecord(d.wisdom_practices_library),
    companion_limitations: parseRecord(d.companion_limitations),
    self_love_in_wisdom: parseSelfLoveConnection(d.self_love_in_wisdom),
    ethical_governance_integration: parseRecord(d.ethical_governance_integration),
    owebp129_cross_links: parseIntegrationLinks(d.owebp129_cross_links),
    limitation_principles: parseLimitationPrinciples(d.limitation_principles),
    companion_adaptation: parseRecord(d.companion_adaptation),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    success_criteria: parseSuccessCriteria(d.success_criteria),
    success_metrics: parseRecordArray(d.success_metrics),
    organizational_wisdom_vision:
      typeof d.organizational_wisdom_vision === "string" ? d.organizational_wisdom_vision : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    implementation_blueprint_phase157: parseBlueprintMeta(d.implementation_blueprint_phase157),
    wisdom_council_ethical_foresight_blueprint: parsePhase157BlueprintBlock(
      d.wisdom_council_ethical_foresight_blueprint,
    ),
    phase157_distinction_note:
      typeof d.phase157_distinction_note === "string" ? d.phase157_distinction_note : undefined,
    phase157_mission: typeof d.phase157_mission === "string" ? d.phase157_mission : undefined,
    phase157_philosophy: typeof d.phase157_philosophy === "string" ? d.phase157_philosophy : undefined,
    phase157_abos_principle: typeof d.phase157_abos_principle === "string" ? d.phase157_abos_principle : undefined,
    phase157_vision: typeof d.phase157_vision === "string" ? d.phase157_vision : undefined,
    phase157_objectives: parseObjectives(d.phase157_objectives),
    phase157_wisdom_council_center: parseRecord(d.phase157_wisdom_council_center),
    phase157_ethical_foresight_engine: parseRecord(d.phase157_ethical_foresight_engine),
    phase157_stakeholder_awareness_framework: parseRecord(d.phase157_stakeholder_awareness_framework),
    phase157_executive_wisdom_reviews: parseRecord(d.phase157_executive_wisdom_reviews),
    phase157_wisdom_companion: parseRecord(d.phase157_wisdom_companion),
    phase157_ethical_innovation_engine: parseRecord(d.phase157_ethical_innovation_engine),
    phase157_future_consequence_framework: parseRecord(d.phase157_future_consequence_framework),
    phase157_wisdom_memory_engine: parseRecord(d.phase157_wisdom_memory_engine),
    phase157_companion_limitations: parseRecord(d.phase157_companion_limitations),
    phase157_self_love_connection: parseSelfLoveConnection(d.phase157_self_love_connection),
    phase157_security_requirements: parseRecord(d.phase157_security_requirements),
    owcebp157_integration_links: parseIntegrationLinks(d.owcebp157_integration_links),
    phase157_dogfooding: parseRecord(d.phase157_dogfooding),
    phase157_success_criteria: parseSuccessCriteria(d.phase157_success_criteria),
    phase157_engagement_summary: parsePhase157EngagementSummary(d.phase157_engagement_summary),
    phase157_vision_phrases: parseStringArray(d.phase157_vision_phrases),
    organizational_wisdom_council_note:
      typeof d.organizational_wisdom_council_note === "string" ? d.organizational_wisdom_council_note : undefined,
    phase157_privacy_note: typeof d.phase157_privacy_note === "string" ? d.phase157_privacy_note : undefined,
    phase157_sections: parsePhase157Sections(d.phase157_sections),
  };
}
