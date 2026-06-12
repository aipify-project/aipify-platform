import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  ExpertContribution,
  ExpertEngagement,
  ExpertProfile,
  GlobalTalentExpertNetworkBlueprint,
  GlobalTalentExpertNetworkCard,
  GlobalTalentExpertNetworkDashboard,
  GlobalTalentExpertNetworkEngagementSummary,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LimitationPrinciples,
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

function parseEngagementSummary(
  data: unknown,
): GlobalTalentExpertNetworkEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as GlobalTalentExpertNetworkEngagementSummary;
}

function parseBlueprintBlock(data: unknown): GlobalTalentExpertNetworkBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as GlobalTalentExpertNetworkBlueprint;
}

function parseProfiles(data: unknown): ExpertProfile[] {
  if (!Array.isArray(data)) return [];
  return data as ExpertProfile[];
}

function parseEngagements(data: unknown): ExpertEngagement[] {
  if (!Array.isArray(data)) return [];
  return data as ExpertEngagement[];
}

function parseContributions(data: unknown): ExpertContribution[] {
  if (!Array.isArray(data)) return [];
  return data as ExpertContribution[];
}

export function parseGlobalTalentExpertNetworkCard(data: unknown): GlobalTalentExpertNetworkCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    network_score: Number(d.network_score ?? 0),
    enabled: Boolean(d.enabled),
    discovery_maturity_level: Number(d.discovery_maturity_level ?? 1),
    profiles_count: Number(d.profiles_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    executive_approval_required: Boolean(d.executive_approval_required),
    procurement_disclaimer:
      typeof d.procurement_disclaimer === "string" ? d.procurement_disclaimer : undefined,
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    global_talent_expert_network_mission:
      typeof d.global_talent_expert_network_mission === "string"
        ? d.global_talent_expert_network_mission
        : undefined,
    global_talent_expert_network_abos_principle:
      typeof d.global_talent_expert_network_abos_principle === "string"
        ? d.global_talent_expert_network_abos_principle
        : undefined,
    global_talent_expert_network_engagement_summary: parseEngagementSummary(
      d.global_talent_expert_network_engagement_summary,
    ),
    global_talent_expert_network_note:
      typeof d.global_talent_expert_network_note === "string"
        ? d.global_talent_expert_network_note
        : undefined,
    global_talent_expert_network_vision_note:
      typeof d.global_talent_expert_network_vision_note === "string"
        ? d.global_talent_expert_network_vision_note
        : undefined,
  };
}

export function parseGlobalTalentExpertNetworkDashboard(
  data: unknown,
): GlobalTalentExpertNetworkDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: Boolean(d.enabled),
    discovery_maturity_level: Number(d.discovery_maturity_level ?? 1),
    executive_approval_required: Boolean(d.executive_approval_required),
    gp_matching_enabled: Boolean(d.gp_matching_enabled),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    procurement_disclaimer:
      typeof d.procurement_disclaimer === "string" ? d.procurement_disclaimer : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    network_score: Number(d.network_score ?? 0),
    profiles_count: Number(d.profiles_count ?? 0),
    active_profiles_count: Number(d.active_profiles_count ?? 0),
    engagements_count: Number(d.engagements_count ?? 0),
    active_engagements_count: Number(d.active_engagements_count ?? 0),
    contributions_count: Number(d.contributions_count ?? 0),
    expert_profiles: parseProfiles(d.expert_profiles),
    expert_engagements: parseEngagements(d.expert_engagements),
    expert_contributions: parseContributions(d.expert_contributions),
    integration_links: parseIntegrationLinks(d.integration_links),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    global_talent_expert_network_blueprint: parseBlueprintBlock(
      d.global_talent_expert_network_blueprint,
    ),
    global_talent_expert_network_mission:
      typeof d.global_talent_expert_network_mission === "string"
        ? d.global_talent_expert_network_mission
        : undefined,
    global_talent_expert_network_philosophy:
      typeof d.global_talent_expert_network_philosophy === "string"
        ? d.global_talent_expert_network_philosophy
        : undefined,
    global_talent_expert_network_abos_principle:
      typeof d.global_talent_expert_network_abos_principle === "string"
        ? d.global_talent_expert_network_abos_principle
        : undefined,
    global_talent_expert_network_objectives: parseObjectives(
      d.global_talent_expert_network_objectives,
    ),
    global_expert_network_center_meta:
      typeof d.global_expert_network_center_meta === "object" && d.global_expert_network_center_meta
        ? (d.global_expert_network_center_meta as Record<string, unknown>)
        : undefined,
    expert_discovery_engine_meta:
      typeof d.expert_discovery_engine_meta === "object" && d.expert_discovery_engine_meta
        ? (d.expert_discovery_engine_meta as Record<string, unknown>)
        : undefined,
    executive_advisory_network_engine_meta:
      typeof d.executive_advisory_network_engine_meta === "object" &&
      d.executive_advisory_network_engine_meta
        ? (d.executive_advisory_network_engine_meta as Record<string, unknown>)
        : undefined,
    growth_partner_matching_engine_meta:
      typeof d.growth_partner_matching_engine_meta === "object" &&
      d.growth_partner_matching_engine_meta
        ? (d.growth_partner_matching_engine_meta as Record<string, unknown>)
        : undefined,
    specialist_collaboration_framework_meta:
      typeof d.specialist_collaboration_framework_meta === "object" &&
      d.specialist_collaboration_framework_meta
        ? (d.specialist_collaboration_framework_meta as Record<string, unknown>)
        : undefined,
    professional_profile_engine_meta:
      typeof d.professional_profile_engine_meta === "object" && d.professional_profile_engine_meta
        ? (d.professional_profile_engine_meta as Record<string, unknown>)
        : undefined,
    talent_companion_meta:
      typeof d.talent_companion_meta === "object" && d.talent_companion_meta
        ? (d.talent_companion_meta as Record<string, unknown>)
        : undefined,
    professional_contribution_engine_meta:
      typeof d.professional_contribution_engine_meta === "object" &&
      d.professional_contribution_engine_meta
        ? (d.professional_contribution_engine_meta as Record<string, unknown>)
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
    gtenbp147_integration_links: parseIntegrationLinks(d.gtenbp147_integration_links),
    global_talent_expert_network_engagement_summary: parseEngagementSummary(
      d.global_talent_expert_network_engagement_summary,
    ),
    global_talent_expert_network_success_criteria: parseSuccessCriteria(
      d.global_talent_expert_network_success_criteria,
    ),
    global_talent_expert_network_vision:
      typeof d.global_talent_expert_network_vision === "string"
        ? d.global_talent_expert_network_vision
        : undefined,
    global_talent_expert_network_vision_phrases: Array.isArray(
      d.global_talent_expert_network_vision_phrases,
    )
      ? (d.global_talent_expert_network_vision_phrases as string[])
      : undefined,
    global_talent_expert_network_privacy_note:
      typeof d.global_talent_expert_network_privacy_note === "string"
        ? d.global_talent_expert_network_privacy_note
        : undefined,
    global_talent_expert_network_dogfooding:
      typeof d.global_talent_expert_network_dogfooding === "string"
        ? d.global_talent_expert_network_dogfooding
        : undefined,
    global_talent_expert_network_engine_note:
      typeof d.global_talent_expert_network_engine_note === "string"
        ? d.global_talent_expert_network_engine_note
        : undefined,
    global_talent_expert_network_distinction_note:
      typeof d.global_talent_expert_network_distinction_note === "string"
        ? d.global_talent_expert_network_distinction_note
        : undefined,
  };
}
