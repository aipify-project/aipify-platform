import type {
  AbosSuccessCriterion,
  BlueprintGuidanceBlock,
  BlueprintObjective,
  BlueprintPrincipleBlock,
  OrganizationalResilienceEngineCard,
  OrganizationalResilienceEngineDashboard,
  ResiliencePlanRecord,
  ResilienceReviewRecord,
  ResilienceSimulationRecord,
  ResilienceVulnerabilityRecord,
  RiskNavigationEngagementSummary,
  RecoveryEngagementSummary,
  SelfLoveConnection,
  TrustConnection,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseObjectList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseGuidanceBlock(data: unknown): BlueprintGuidanceBlock | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as BlueprintGuidanceBlock;
}

function parsePrincipleBlock(data: unknown): BlueprintPrincipleBlock | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as BlueprintPrincipleBlock;
}

function parseEngagementSummary(data: unknown): RiskNavigationEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as RiskNavigationEngagementSummary;
}

function parseRecoveryEngagementSummary(data: unknown): RecoveryEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as RecoveryEngagementSummary;
}

export function parseOrganizationalResilienceEngineCard(
  data: unknown
): OrganizationalResilienceEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    recovery_engagement_summary: parseRecoveryEngagementSummary(d.recovery_engagement_summary),
    ...d,
  } as OrganizationalResilienceEngineCard;
}

export function parseOrganizationalResilienceEngineDashboard(
  data: unknown
): OrganizationalResilienceEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    plans: parseRecordList<ResiliencePlanRecord>(d.plans),
    simulations: parseRecordList<ResilienceSimulationRecord>(d.simulations),
    vulnerabilities: parseRecordList<ResilienceVulnerabilityRecord>(d.vulnerabilities),
    reviews: parseRecordList<ResilienceReviewRecord>(d.reviews),
    executive_summary:
      typeof d.executive_summary === "object" && d.executive_summary
        ? (d.executive_summary as Record<string, unknown>)
        : undefined,
    integration_notes:
      typeof d.integration_notes === "object" && d.integration_notes
        ? (d.integration_notes as Record<string, string>)
        : undefined,
    integration_summaries:
      typeof d.integration_summaries === "object" && d.integration_summaries
        ? (d.integration_summaries as Record<string, unknown>)
        : undefined,
    blueprint_objectives: parseObjectList<BlueprintObjective>(d.blueprint_objectives),
    risk_categories: parseGuidanceBlock(d.risk_categories),
    risk_questions: parseGuidanceBlock(d.risk_questions),
    companion_guidance: parseGuidanceBlock(d.companion_guidance),
    risk_preparedness: parseGuidanceBlock(d.risk_preparedness),
    risk_opportunity_balance: parseGuidanceBlock(d.risk_opportunity_balance),
    leadership_insights: parseGuidanceBlock(d.leadership_insights),
    blueprint_self_love_connection:
      typeof d.blueprint_self_love_connection === "object" && d.blueprint_self_love_connection
        ? (d.blueprint_self_love_connection as SelfLoveConnection)
        : undefined,
    blueprint_trust_connection:
      typeof d.blueprint_trust_connection === "object" && d.blueprint_trust_connection
        ? (d.blueprint_trust_connection as TrustConnection)
        : undefined,
    limitation_principles: parsePrincipleBlock(d.limitation_principles),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_success_criteria: parseObjectList<AbosSuccessCriterion>(d.blueprint_success_criteria),
    blueprint_vision_phrases: Array.isArray(d.blueprint_vision_phrases)
      ? (d.blueprint_vision_phrases as string[])
      : undefined,
    recovery_objectives: parseObjectList<BlueprintObjective>(d.recovery_objectives),
    recovery_resilience_questions: parseGuidanceBlock(d.recovery_resilience_questions),
    recovery_resilience_domains: parseGuidanceBlock(d.recovery_resilience_domains),
    recovery_companion_guidance: parseGuidanceBlock(d.recovery_companion_guidance),
    recovery_reflection: parseGuidanceBlock(d.recovery_reflection),
    recovery_leadership_insights: parseGuidanceBlock(d.recovery_leadership_insights),
    recovery_self_love_connection:
      typeof d.recovery_self_love_connection === "object" && d.recovery_self_love_connection
        ? (d.recovery_self_love_connection as SelfLoveConnection)
        : undefined,
    recovery_trust_connection:
      typeof d.recovery_trust_connection === "object" && d.recovery_trust_connection
        ? (d.recovery_trust_connection as TrustConnection)
        : undefined,
    recovery_limitation_principles: parsePrincipleBlock(d.recovery_limitation_principles),
    recovery_engagement_summary: parseRecoveryEngagementSummary(d.recovery_engagement_summary),
    recovery_success_criteria: parseObjectList<AbosSuccessCriterion>(d.recovery_success_criteria),
    recovery_vision_phrases: Array.isArray(d.recovery_vision_phrases)
      ? (d.recovery_vision_phrases as string[])
      : undefined,
    ...d,
  } as OrganizationalResilienceEngineDashboard;
}
