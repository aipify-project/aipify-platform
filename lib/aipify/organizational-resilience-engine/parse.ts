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
  ContinuityCompanionEngagementSummary,
  SelfHealingEngagementSummary,
  AdaptiveContinuityEngagementSummary,
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

function parseContinuityCompanionEngagementSummary(
  data: unknown
): ContinuityCompanionEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ContinuityCompanionEngagementSummary;
}

function parseSelfHealingEngagementSummary(data: unknown): SelfHealingEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SelfHealingEngagementSummary;
}

function parseAdaptiveContinuityEngagementSummary(
  data: unknown
): AdaptiveContinuityEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as AdaptiveContinuityEngagementSummary;
}

export function parseOrganizationalResilienceEngineCard(
  data: unknown
): OrganizationalResilienceEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    recovery_engagement_summary: parseRecoveryEngagementSummary(d.recovery_engagement_summary),
    continuity_companion_engagement_summary: parseContinuityCompanionEngagementSummary(
      d.continuity_companion_engagement_summary
    ),
    self_healing_engagement_summary: parseSelfHealingEngagementSummary(d.self_healing_engagement_summary),
    adaptive_continuity_engagement_summary: parseAdaptiveContinuityEngagementSummary(
      d.adaptive_continuity_engagement_summary
    ),
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
    continuity_companion_objectives: parseObjectList<BlueprintObjective>(d.continuity_companion_objectives),
    resilience_center: parseObjectList<BlueprintObjective>(d.resilience_center),
    business_continuity_engine: parseObjectList<BlueprintObjective>(d.business_continuity_engine),
    resilience_assessment: parseObjectList<BlueprintObjective>(d.resilience_assessment),
    dependency_protection: parseGuidanceBlock(d.dependency_protection),
    recovery_orchestration: parseObjectList<BlueprintObjective>(d.recovery_orchestration),
    resilience_companion_supports: parseObjectList<BlueprintObjective>(d.resilience_companion_supports),
    leadership_continuity_supports: parseGuidanceBlock(d.leadership_continuity_supports),
    resilience_exercise_framework: parseGuidanceBlock(d.resilience_exercise_framework),
    continuity_self_love_connection:
      typeof d.continuity_self_love_connection === "object" && d.continuity_self_love_connection
        ? (d.continuity_self_love_connection as SelfLoveConnection)
        : undefined,
    continuity_knowledge_library: parseObjectList<BlueprintObjective>(d.continuity_knowledge_library),
    continuity_companion_limitation_principles: parsePrincipleBlock(d.continuity_companion_limitation_principles),
    continuity_companion_adaptation: parseGuidanceBlock(d.continuity_companion_adaptation),
    continuity_companion_engagement_summary: parseContinuityCompanionEngagementSummary(
      d.continuity_companion_engagement_summary
    ),
    continuity_companion_success_criteria: parseObjectList<AbosSuccessCriterion>(
      d.continuity_companion_success_criteria
    ),
    self_healing_objectives: parseObjectList<BlueprintObjective>(d.self_healing_objectives),
    self_healing_operations_center: parseObjectList<BlueprintObjective>(d.self_healing_operations_center),
    operational_health_engine: parseObjectList<BlueprintObjective>(d.operational_health_engine),
    recovery_detection_engine: parseObjectList<BlueprintObjective>(d.recovery_detection_engine),
    self_healing_framework: parseGuidanceBlock(d.self_healing_framework),
    incident_learning_engine: parseObjectList<BlueprintObjective>(d.incident_learning_engine),
    recovery_orchestration_engine: parseObjectList<BlueprintObjective>(d.recovery_orchestration_engine),
    organizational_healing_principles: parseObjectList<BlueprintObjective>(d.organizational_healing_principles),
    self_healing_self_love_connection:
      typeof d.self_healing_self_love_connection === "object" && d.self_healing_self_love_connection
        ? (d.self_healing_self_love_connection as SelfLoveConnection)
        : undefined,
    self_healing_security_requirements: parseObjectList<BlueprintObjective>(d.self_healing_security_requirements),
    self_healing_limitation_principles: parsePrincipleBlock(d.self_healing_limitation_principles),
    self_healing_companion_adaptation: parseGuidanceBlock(d.self_healing_companion_adaptation),
    self_healing_engagement_summary: parseSelfHealingEngagementSummary(d.self_healing_engagement_summary),
    self_healing_success_criteria: parseObjectList<AbosSuccessCriterion>(d.self_healing_success_criteria),
    self_healing_vision_phrases: Array.isArray(d.self_healing_vision_phrases)
      ? (d.self_healing_vision_phrases as string[])
      : undefined,
    adaptive_continuity_objectives: parseObjectList<BlueprintObjective>(d.adaptive_continuity_objectives),
    adaptive_resilience_center: parseObjectList<BlueprintObjective>(d.adaptive_resilience_center),
    adaptive_continuity_engine: parseObjectList<BlueprintObjective>(d.adaptive_continuity_engine),
    scenario_preparedness_engine: parseObjectList<BlueprintObjective>(d.scenario_preparedness_engine),
    leadership_resilience_reviews: parseObjectList<BlueprintObjective>(d.leadership_resilience_reviews),
    adaptive_resilience_companion: parseObjectList<BlueprintObjective>(d.adaptive_resilience_companion),
    organizational_flexibility_engine: parseObjectList<BlueprintObjective>(d.organizational_flexibility_engine),
    employee_support_framework: parseObjectList<BlueprintObjective>(d.employee_support_framework),
    continuity_memory_engine: parseObjectList<BlueprintObjective>(d.continuity_memory_engine),
    adaptive_continuity_self_love_connection:
      typeof d.adaptive_continuity_self_love_connection === "object" && d.adaptive_continuity_self_love_connection
        ? (d.adaptive_continuity_self_love_connection as SelfLoveConnection)
        : undefined,
    adaptive_continuity_security_requirements: parseObjectList<BlueprintObjective>(
      d.adaptive_continuity_security_requirements
    ),
    adaptive_continuity_limitation_principles: parsePrincipleBlock(d.adaptive_continuity_limitation_principles),
    adaptive_continuity_companion_adaptation: parseGuidanceBlock(d.adaptive_continuity_companion_adaptation),
    adaptive_continuity_engagement_summary: parseAdaptiveContinuityEngagementSummary(
      d.adaptive_continuity_engagement_summary
    ),
    adaptive_continuity_success_criteria: parseObjectList<AbosSuccessCriterion>(d.adaptive_continuity_success_criteria),
    adaptive_continuity_vision_phrases: Array.isArray(d.adaptive_continuity_vision_phrases)
      ? (d.adaptive_continuity_vision_phrases as string[])
      : undefined,
    ...d,
  } as OrganizationalResilienceEngineDashboard;
}
