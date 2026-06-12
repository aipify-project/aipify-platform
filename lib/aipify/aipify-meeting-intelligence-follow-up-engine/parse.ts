import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  ExecutiveReview,
  AipifyMeetingIntelligenceFollowUpEngineBlueprint,
  AipifyMeetingIntelligenceFollowUpEngineCard,
  AipifyMeetingIntelligenceFollowUpEngineDashboard,
  AipifyMeetingIntelligenceFollowUpEngineEngagementSummary,
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

function parseEngagementSummary(data: unknown): AipifyMeetingIntelligenceFollowUpEngineEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as AipifyMeetingIntelligenceFollowUpEngineEngagementSummary;
}

function parseBlueprintBlock(data: unknown): AipifyMeetingIntelligenceFollowUpEngineBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as AipifyMeetingIntelligenceFollowUpEngineBlueprint;
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

export function parseAipifyMeetingIntelligenceFollowUpEngineCard(data: unknown): AipifyMeetingIntelligenceFollowUpEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    aipify_meeting_intelligence_follow_up_score: Number(d.aipify_meeting_intelligence_follow_up_score ?? 0),
    enabled: Boolean(d.enabled),
    meeting_follow_up_mode: typeof d.meeting_follow_up_mode === "string" ? d.meeting_follow_up_mode : undefined,
    follow_up_readiness_level: Number(d.follow_up_readiness_level ?? 1),
    reflections_count: Number(d.reflections_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    aipify_meeting_intelligence_follow_up_mission: typeof d.aipify_meeting_intelligence_follow_up_mission === "string" ? d.aipify_meeting_intelligence_follow_up_mission : undefined,
    aipify_meeting_intelligence_follow_up_abos_principle: typeof d.aipify_meeting_intelligence_follow_up_abos_principle === "string" ? d.aipify_meeting_intelligence_follow_up_abos_principle : undefined,
    aipify_meeting_intelligence_follow_up_engagement_summary: parseEngagementSummary(d.aipify_meeting_intelligence_follow_up_engagement_summary),
    aipify_meeting_intelligence_follow_up_note: typeof d.aipify_meeting_intelligence_follow_up_note === "string" ? d.aipify_meeting_intelligence_follow_up_note : undefined,
    aipify_meeting_intelligence_follow_up_vision_note: typeof d.aipify_meeting_intelligence_follow_up_vision_note === "string" ? d.aipify_meeting_intelligence_follow_up_vision_note : undefined,
  };
}

export function parseAipifyMeetingIntelligenceFollowUpEngineDashboard(data: unknown): AipifyMeetingIntelligenceFollowUpEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    meeting_follow_up_mode: typeof d.meeting_follow_up_mode === "string" ? d.meeting_follow_up_mode : undefined,
    follow_up_readiness_level: Number(d.follow_up_readiness_level ?? 1),
    human_oversight_required: Boolean(d.human_oversight_required),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    aipify_meeting_intelligence_follow_up_score: Number(d.aipify_meeting_intelligence_follow_up_score ?? 0),
    executive_reviews_count: Number(d.executive_reviews_count ?? 0),
    reflections_count: Number(d.reflections_count ?? 0),
    meeting_notes_count: Number(d.meeting_notes_count ?? 0),
    active_reflections_count: Number(d.active_reflections_count ?? 0),
    era_phases_count: Number(d.era_phases_count ?? 0),
    executive_reviews: parseExecutiveReviews(d.executive_reviews),
    reflections: parseReflections(d.reflections),
    scaffold_notes: parseScaffoldNotes(d.scaffold_notes),
    integration_links: parseIntegrationLinks(d.integration_links),
    era_opener_summary: parseIntegrationLinks(d.era_opener_summary),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    aipify_meeting_intelligence_follow_up_blueprint: parseBlueprintBlock(d.aipify_meeting_intelligence_follow_up_blueprint),
    aipify_meeting_intelligence_follow_up_mission: typeof d.aipify_meeting_intelligence_follow_up_mission === "string" ? d.aipify_meeting_intelligence_follow_up_mission : undefined,
    aipify_meeting_intelligence_follow_up_philosophy: typeof d.aipify_meeting_intelligence_follow_up_philosophy === "string" ? d.aipify_meeting_intelligence_follow_up_philosophy : undefined,
    aipify_meeting_intelligence_follow_up_abos_principle: typeof d.aipify_meeting_intelligence_follow_up_abos_principle === "string" ? d.aipify_meeting_intelligence_follow_up_abos_principle : undefined,
    aipify_meeting_intelligence_follow_up_objectives: parseObjectives(d.aipify_meeting_intelligence_follow_up_objectives),
    center_meta: typeof d.center_meta === "object" && d.center_meta ? (d.center_meta as Record<string, unknown>) : undefined,
    engine_meta: typeof d.engine_meta === "object" && d.engine_meta ? (d.engine_meta as Record<string, unknown>) : undefined,
    framework_meta: typeof d.framework_meta === "object" && d.framework_meta ? (d.framework_meta as Record<string, unknown>) : undefined,
    executive_reviews_meta: typeof d.executive_reviews_meta === "object" && d.executive_reviews_meta ? (d.executive_reviews_meta as Record<string, unknown>) : undefined,
    companion_meta: typeof d.companion_meta === "object" && d.companion_meta ? (d.companion_meta as Record<string, unknown>) : undefined,
    sub_engine_meta: typeof d.sub_engine_meta === "object" && d.sub_engine_meta ? (d.sub_engine_meta as Record<string, unknown>) : undefined,
    companion_limitations_meta: parseLimitationPrinciples(d.companion_limitations_meta),
    self_love_connection_meta: typeof d.self_love_connection_meta === "object" && d.self_love_connection_meta ? (d.self_love_connection_meta as Record<string, unknown>) : undefined,
    security_requirements_meta: typeof d.security_requirements_meta === "object" && d.security_requirements_meta ? (d.security_requirements_meta as Record<string, unknown>) : undefined,
    amifuebp206_integration_links: parseIntegrationLinks(d.amifuebp206_integration_links),
    amifuebp206_era_opener_summary: parseIntegrationLinks(d.amifuebp206_era_opener_summary),
    aipify_meeting_intelligence_follow_up_engagement_summary: parseEngagementSummary(d.aipify_meeting_intelligence_follow_up_engagement_summary),
    aipify_meeting_intelligence_follow_up_success_criteria: parseSuccessCriteria(d.aipify_meeting_intelligence_follow_up_success_criteria),
    aipify_meeting_intelligence_follow_up_vision: typeof d.aipify_meeting_intelligence_follow_up_vision === "string" ? d.aipify_meeting_intelligence_follow_up_vision : undefined,
    aipify_meeting_intelligence_follow_up_vision_phrases: Array.isArray(d.aipify_meeting_intelligence_follow_up_vision_phrases) ? (d.aipify_meeting_intelligence_follow_up_vision_phrases as string[]) : undefined,
    aipify_meeting_intelligence_follow_up_privacy_note: typeof d.aipify_meeting_intelligence_follow_up_privacy_note === "string" ? d.aipify_meeting_intelligence_follow_up_privacy_note : undefined,
    aipify_meeting_intelligence_follow_up_dogfooding: typeof d.aipify_meeting_intelligence_follow_up_dogfooding === "string" ? d.aipify_meeting_intelligence_follow_up_dogfooding : undefined,
    aipify_meeting_intelligence_follow_up_engine_note: typeof d.aipify_meeting_intelligence_follow_up_engine_note === "string" ? d.aipify_meeting_intelligence_follow_up_engine_note : undefined,
    aipify_meeting_intelligence_follow_up_distinction_note: typeof d.aipify_meeting_intelligence_follow_up_distinction_note === "string" ? d.aipify_meeting_intelligence_follow_up_distinction_note : undefined,
  };
}
