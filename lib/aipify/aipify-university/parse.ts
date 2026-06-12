import type {
  AbosSuccessCriterion,
  AipifyUniversityBlueprint,
  AipifyUniversityCard,
  AipifyUniversityDashboard,
  AnalyticsSnapshot,
  BlueprintObjective,
  EngagementSummary,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LimitationPrinciples,
  MicroLearningEvent,
  SelfLoveConnection,
  UniversityPathway,
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

function parsePathways(data: unknown): UniversityPathway[] {
  if (!Array.isArray(data)) return [];
  return data as UniversityPathway[];
}

function parseMicroLearning(data: unknown): MicroLearningEvent[] {
  if (!Array.isArray(data)) return [];
  return data as MicroLearningEvent[];
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

function parseAnalyticsSnapshot(data: unknown): AnalyticsSnapshot | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as AnalyticsSnapshot;
}

function parseBlueprintBlock(data: unknown): AipifyUniversityBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as AipifyUniversityBlueprint;
}

function parseRecordArray(data: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(data)) return [];
  return data as Array<Record<string, unknown>>;
}

function parseRecord(data: unknown): Record<string, unknown> | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as Record<string, unknown>;
}

export function parseAipifyUniversityCard(data: unknown): AipifyUniversityCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    aggregate_learning_score: Number(d.aggregate_learning_score ?? 0),
    active_pathways: Number(d.active_pathways ?? 0),
    participation_rate: Number(d.participation_rate ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    wellbeing_aware_enabled: Boolean(d.wellbeing_aware_enabled ?? true),
    healthy_pacing_default: Boolean(d.healthy_pacing_default ?? true),
    implementation_blueprint_phase115: parseBlueprintMeta(d.implementation_blueprint_phase115),
    aipify_university_mission:
      typeof d.aipify_university_mission === "string" ? d.aipify_university_mission : undefined,
    aipify_university_abos_principle:
      typeof d.aipify_university_abos_principle === "string"
        ? d.aipify_university_abos_principle
        : undefined,
    aipify_university_engagement_summary: parseEngagementSummary(d.aipify_university_engagement_summary),
    aipify_university_vision_note:
      typeof d.aipify_university_vision_note === "string" ? d.aipify_university_vision_note : undefined,
  };
}

export function parseAipifyUniversityDashboard(data: unknown): AipifyUniversityDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    continuous_learning_enabled: Boolean(d.continuous_learning_enabled ?? true),
    wellbeing_aware_enabled: Boolean(d.wellbeing_aware_enabled ?? true),
    healthy_pacing_default: Boolean(d.healthy_pacing_default ?? true),
    micro_learning_enabled: Boolean(d.micro_learning_enabled ?? true),
    companion_coaching_enabled: Boolean(d.companion_coaching_enabled ?? true),
    default_pacing: typeof d.default_pacing === "string" ? d.default_pacing : undefined,
    active_pathways: Number(d.active_pathways ?? 0),
    total_enrollments: Number(d.total_enrollments ?? 0),
    completed_enrollments: Number(d.completed_enrollments ?? 0),
    in_progress_enrollments: Number(d.in_progress_enrollments ?? 0),
    micro_learning_events: Number(d.micro_learning_events ?? 0),
    aggregate_learning_score: Number(d.aggregate_learning_score ?? 0),
    participation_rate: Number(d.participation_rate ?? 0),
    completion_rate: Number(d.completion_rate ?? 0),
    pathways: parsePathways(d.pathways),
    micro_learning_recent: parseMicroLearning(d.micro_learning_recent),
    analytics_snapshot: parseAnalyticsSnapshot(d.analytics_snapshot),
    integration_links: parseIntegrationLinks(d.integration_links),
    implementation_blueprint: parseBlueprintBlock(d.implementation_blueprint),
    implementation_blueprint_phase115: parseBlueprintMeta(d.implementation_blueprint_phase115),
    aipify_university_mission:
      typeof d.aipify_university_mission === "string" ? d.aipify_university_mission : undefined,
    aipify_university_philosophy:
      typeof d.aipify_university_philosophy === "string" ? d.aipify_university_philosophy : undefined,
    aipify_university_abos_principle:
      typeof d.aipify_university_abos_principle === "string"
        ? d.aipify_university_abos_principle
        : undefined,
    aipify_university_objectives: parseObjectives(d.aipify_university_objectives),
    learning_experiences: parseRecordArray(d.learning_experiences),
    learning_pathways_blueprint: parseRecordArray(d.learning_pathways_blueprint),
    micro_learning_engine: parseRecord(d.micro_learning_engine),
    companion_coaching: parseRecord(d.companion_coaching),
    onboarding_acceleration: parseRecord(d.onboarding_acceleration),
    knowledge_retention: parseRecord(d.knowledge_retention),
    executive_education: parseRecord(d.executive_education),
    learning_analytics_meta: parseRecord(d.learning_analytics_meta),
    certification_framework: parseRecord(d.certification_framework),
    self_love_in_learning: parseSelfLoveConnection(d.self_love_in_learning),
    wellbeing_aware_learning: parseRecord(d.wellbeing_aware_learning),
    knowledge_center_integration: parseRecord(d.knowledge_center_integration),
    security_training: parseRecord(d.security_training),
    companion_adaptation: parseRecord(d.companion_adaptation),
    limitation_principles: parseLimitationPrinciples(d.limitation_principles),
    aubp115_cross_links: parseIntegrationLinks(d.aubp115_cross_links),
    success_metrics: parseRecordArray(d.success_metrics),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    success_criteria: parseSuccessCriteria(d.success_criteria),
    aipify_university_vision:
      typeof d.aipify_university_vision === "string" ? d.aipify_university_vision : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
  };
}
