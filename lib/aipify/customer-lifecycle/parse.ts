import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  CompanionGuidance,
  CustomerJourneyEngagementSummary,
  CustomerJourneyIntelligenceBlueprint,
  CustomerLifecycleCard,
  CustomerLifecycleDashboard,
  ImplementationBlueprintMeta,
  IntegrationLink,
  JourneyStage,
  PrivacyPrinciples,
  RecommendationActionResult,
  SelfLoveConnection,
  TrustConnection,
} from "./types";

function parseBlueprintMeta(data: unknown): ImplementationBlueprintMeta | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ImplementationBlueprintMeta;
}

function parseObjectives(data: unknown): BlueprintObjective[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as BlueprintObjective[];
}

function parseJourneyStages(data: unknown): JourneyStage[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as JourneyStage[];
}

function parseSuccessCriteria(data: unknown): AbosSuccessCriterion[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as AbosSuccessCriterion[];
}

function parseIntegrationLinks(data: unknown): IntegrationLink[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as IntegrationLink[];
}

function parseCompanionGuidance(data: unknown): CompanionGuidance | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CompanionGuidance;
}

function parsePrivacyPrinciples(data: unknown): PrivacyPrinciples | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as PrivacyPrinciples;
}

function parseSelfLoveConnection(data: unknown): SelfLoveConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SelfLoveConnection;
}

function parseTrustConnection(data: unknown): TrustConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as TrustConnection;
}

function parseEngagementSummary(data: unknown): CustomerJourneyEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CustomerJourneyEngagementSummary;
}

function parseBlueprintBlock(data: unknown): CustomerJourneyIntelligenceBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CustomerJourneyIntelligenceBlueprint;
}

function parseRecord(data: unknown): Record<string, unknown> | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as Record<string, unknown>;
}

function parseStringList(data: unknown): string[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((item): item is string => typeof item === "string");
}

export function parseCustomerLifecycleCard(data: unknown): CustomerLifecycleCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    success_score: d.success_score as number | undefined,
    health_band: d.health_band as string | undefined,
    health_band_label: d.health_band_label as string | undefined,
    lifecycle_stage: d.lifecycle_stage as string | undefined,
    quick_wins_count: d.quick_wins_count as number | undefined,
    philosophy: d.philosophy as string | undefined,
    no_pressure: d.no_pressure as boolean | undefined,
    implementation_blueprint_phase108: parseBlueprintMeta(d.implementation_blueprint_phase108),
    customer_journey_intelligence_mission:
      typeof d.customer_journey_intelligence_mission === "string"
        ? d.customer_journey_intelligence_mission
        : undefined,
    customer_journey_intelligence_abos_principle:
      typeof d.customer_journey_intelligence_abos_principle === "string"
        ? d.customer_journey_intelligence_abos_principle
        : undefined,
    customer_journey_intelligence_engagement_summary: parseEngagementSummary(
      d.customer_journey_intelligence_engagement_summary,
    ),
    customer_journey_intelligence_note:
      typeof d.customer_journey_intelligence_note === "string"
        ? d.customer_journey_intelligence_note
        : undefined,
    customer_journey_intelligence_vision_note:
      typeof d.customer_journey_intelligence_vision_note === "string"
        ? d.customer_journey_intelligence_vision_note
        : undefined,
  };
}

export function parseCustomerLifecycleDashboard(data: unknown): CustomerLifecycleDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    no_pressure: d.no_pressure as boolean | undefined,
    expansion_follows_value: d.expansion_follows_value as boolean | undefined,
    orchestration_enabled: d.orchestration_enabled as boolean | undefined,
    philosophy: d.philosophy as string | undefined,
    safety_note: d.safety_note as string | undefined,
    success_score: d.success_score as number | undefined,
    health_band: d.health_band as string | undefined,
    health_band_label: d.health_band_label as string | undefined,
    lifecycle_stage: d.lifecycle_stage as string | undefined,
    lifecycle_stage_label: d.lifecycle_stage_label as string | undefined,
    score_components: d.score_components as Record<string, number> | undefined,
    milestones: Array.isArray(d.milestones) ? (d.milestones as CustomerLifecycleDashboard["milestones"]) : [],
    quick_wins: Array.isArray(d.quick_wins) ? (d.quick_wins as CustomerLifecycleDashboard["quick_wins"]) : [],
    recommendations: Array.isArray(d.recommendations)
      ? (d.recommendations as CustomerLifecycleDashboard["recommendations"])
      : [],
    playbooks: Array.isArray(d.playbooks) ? (d.playbooks as CustomerLifecycleDashboard["playbooks"]) : [],
    briefings: Array.isArray(d.briefings) ? (d.briefings as CustomerLifecycleDashboard["briefings"]) : [],
    signals: d.signals as CustomerLifecycleDashboard["signals"],
    lifecycle_stages: Array.isArray(d.lifecycle_stages)
      ? (d.lifecycle_stages as CustomerLifecycleDashboard["lifecycle_stages"])
      : [],
    integrations: d.integrations as Record<string, string> | undefined,
    implementation_blueprint_phase108: parseBlueprintMeta(d.implementation_blueprint_phase108),
    customer_journey_intelligence_engine_note:
      typeof d.customer_journey_intelligence_engine_note === "string"
        ? d.customer_journey_intelligence_engine_note
        : undefined,
    customer_journey_intelligence_blueprint: parseBlueprintBlock(d.customer_journey_intelligence_blueprint),
    customer_journey_intelligence_distinction_note:
      typeof d.customer_journey_intelligence_distinction_note === "string"
        ? d.customer_journey_intelligence_distinction_note
        : undefined,
    customer_journey_intelligence_mission:
      typeof d.customer_journey_intelligence_mission === "string"
        ? d.customer_journey_intelligence_mission
        : undefined,
    customer_journey_intelligence_philosophy:
      typeof d.customer_journey_intelligence_philosophy === "string"
        ? d.customer_journey_intelligence_philosophy
        : undefined,
    customer_journey_intelligence_abos_principle:
      typeof d.customer_journey_intelligence_abos_principle === "string"
        ? d.customer_journey_intelligence_abos_principle
        : undefined,
    customer_journey_intelligence_objectives: parseObjectives(d.customer_journey_intelligence_objectives),
    customer_journey_stages: parseJourneyStages(d.customer_journey_stages),
    journey_insights: parseRecord(d.journey_insights),
    customer_experience_dashboard: parseRecord(d.customer_experience_dashboard),
    onboarding_intelligence: parseRecord(d.onboarding_intelligence),
    adoption_intelligence: parseRecord(d.adoption_intelligence),
    customer_success_opportunities: parseRecord(d.customer_success_opportunities),
    advocacy_identification: parseRecord(d.advocacy_identification),
    customer_success_companion_guidance: parseCompanionGuidance(d.customer_success_companion_guidance),
    meeting_companion_connection: parseRecord(d.meeting_companion_connection),
    growth_partner_connection: parseRecord(d.growth_partner_connection),
    customer_journey_self_love_connection: parseSelfLoveConnection(d.customer_journey_self_love_connection),
    customer_journey_leadership_connection: parseRecord(d.customer_journey_leadership_connection),
    customer_journey_trust_connection: parseTrustConnection(d.customer_journey_trust_connection),
    customer_journey_privacy_principles: parsePrivacyPrinciples(d.customer_journey_privacy_principles),
    customer_journey_intelligence_dogfooding: parseRecord(d.customer_journey_intelligence_dogfooding),
    cjibp108_integration_links: parseIntegrationLinks(d.cjibp108_integration_links),
    customer_journey_intelligence_engagement_summary: parseEngagementSummary(
      d.customer_journey_intelligence_engagement_summary,
    ),
    customer_journey_intelligence_success_criteria: parseSuccessCriteria(
      d.customer_journey_intelligence_success_criteria,
    ),
    customer_journey_intelligence_vision:
      typeof d.customer_journey_intelligence_vision === "string"
        ? d.customer_journey_intelligence_vision
        : undefined,
    customer_journey_intelligence_vision_phrases: parseStringList(d.customer_journey_intelligence_vision_phrases),
    customer_journey_intelligence_privacy_note:
      typeof d.customer_journey_intelligence_privacy_note === "string"
        ? d.customer_journey_intelligence_privacy_note
        : undefined,
  };
}

export function parseRecommendationActionResult(data: unknown): RecommendationActionResult {
  return (data ?? {}) as RecommendationActionResult;
}
