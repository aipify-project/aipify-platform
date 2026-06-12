import type {
  AbosSuccessCriterion,
  AnonymizationPrinciples,
  BestPracticeEvolution,
  CollectiveInsightExamples,
  CollectiveIntelligenceSources,
  CollectiveObservations,
  CollectiveSummary,
  CommunityCollectiveIntelligenceBlueprintPhase89,
  CommunityContributionsBlueprint,
  CommunityEngagementSummary,
  CommunityIntelligenceCard,
  CommunityIntelligenceDashboard,
  CommunityIntelligenceAdmin,
  CommunityActionResult,
  CommunityBriefingResult,
  CommunityObjective,
  CommunityRecognition,
  CompanionExample,
  CompanionGuidance,
  Ccibp89EngagementSummary,
  ExecutiveConnection,
  IdeaDiscovery,
  IntegrationLink,
  KnowledgeCenterConnection,
  LearningOrganizationConnection,
  PrivacyPrinciples,
  SalesExpertConnection,
  SelfLoveConnection,
  TrustConnection,
} from "./types";

function contributions<T>(d: Record<string, unknown>, key: string): T[] {
  return Array.isArray(d[key]) ? (d[key] as T[]) : [];
}

function parseStringArray(data: unknown): string[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((item): item is string => typeof item === "string");
}

function parseSuccessCriteria(data: unknown): AbosSuccessCriterion[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as AbosSuccessCriterion[];
}

function parseIntegrationLinks(data: unknown): IntegrationLink[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as IntegrationLink[];
}

function parseCommunityObjectives(data: unknown): CommunityObjective[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as CommunityObjective[];
}

function parseCollectiveInsightExamples(data: unknown): CollectiveInsightExamples | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CollectiveInsightExamples;
}

function parsePrivacyPrinciples(data: unknown): PrivacyPrinciples | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as PrivacyPrinciples;
}

function parseCommunityContributionsBlueprint(data: unknown): CommunityContributionsBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CommunityContributionsBlueprint;
}

function parseCompanionExamples(data: unknown): CompanionExample[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as CompanionExample[];
}

function parseSelfLoveConnection(data: unknown): SelfLoveConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SelfLoveConnection;
}

function parseTrustConnection(data: unknown): TrustConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as TrustConnection;
}

function parseEngagementSummary(data: unknown): CommunityEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CommunityEngagementSummary;
}

function parseCollectiveSummary(data: unknown): CollectiveSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CollectiveSummary;
}

function parseCollectiveObservations(data: unknown): CollectiveObservations | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CollectiveObservations;
}

function parseBestPracticeEvolution(data: unknown): BestPracticeEvolution | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as BestPracticeEvolution;
}

function parseAnonymizationPrinciples(data: unknown): AnonymizationPrinciples | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as AnonymizationPrinciples;
}

function parseKnowledgeCenterConnection(data: unknown): KnowledgeCenterConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as KnowledgeCenterConnection;
}

function parseSalesExpertConnection(data: unknown): SalesExpertConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SalesExpertConnection;
}

function parseExecutiveConnection(data: unknown): ExecutiveConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ExecutiveConnection;
}

function parseCollectiveIntelligenceSources(data: unknown): CollectiveIntelligenceSources | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CollectiveIntelligenceSources;
}

function parseIdeaDiscovery(data: unknown): IdeaDiscovery | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as IdeaDiscovery;
}

function parseCompanionGuidance(data: unknown): CompanionGuidance | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CompanionGuidance;
}

function parseCommunityRecognition(data: unknown): CommunityRecognition | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CommunityRecognition;
}

function parseLearningOrganizationConnection(data: unknown): LearningOrganizationConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as LearningOrganizationConnection;
}

function parseCcibp89EngagementSummary(data: unknown): Ccibp89EngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as Ccibp89EngagementSummary;
}

function parseCommunityCollectiveIntelligenceBlueprintPhase89(
  data: unknown
): CommunityCollectiveIntelligenceBlueprintPhase89 | undefined {
  if (typeof data !== "object" || !data) return undefined;
  const d = data as Record<string, unknown>;
  return {
    implementation_blueprint_phase89: d.implementation_blueprint_phase89 as CommunityCollectiveIntelligenceBlueprintPhase89["implementation_blueprint_phase89"],
    community_collective_intelligence_note: d.community_collective_intelligence_note as string | undefined,
    distinction_note: d.distinction_note as string | undefined,
    mission: d.mission as string | undefined,
    philosophy: d.philosophy as string | undefined,
    abos_principle: d.abos_principle as string | undefined,
    vision: d.vision as string | undefined,
    objectives: parseCommunityObjectives(d.objectives),
    collective_intelligence_sources: parseCollectiveIntelligenceSources(d.collective_intelligence_sources),
    community_observations: parseCollectiveObservations(d.community_observations),
    idea_discovery: parseIdeaDiscovery(d.idea_discovery),
    companion_guidance: parseCompanionGuidance(d.companion_guidance),
    community_recognition: parseCommunityRecognition(d.community_recognition),
    learning_organization_connection: parseLearningOrganizationConnection(d.learning_organization_connection),
    self_love_connection: parseSelfLoveConnection(d.self_love_connection),
    trust_connection: parseTrustConnection(d.trust_connection),
    privacy_principles: parsePrivacyPrinciples(d.privacy_principles),
    dogfooding: d.dogfooding as CommunityCollectiveIntelligenceBlueprintPhase89["dogfooding"],
    success_criteria: parseSuccessCriteria(d.success_criteria),
    integration_links: parseIntegrationLinks(d.integration_links),
    engagement_summary: parseCcibp89EngagementSummary(d.engagement_summary),
    shared_learning_not_surveillance_note: d.shared_learning_not_surveillance_note as string | undefined,
    privacy_note: d.privacy_note as string | undefined,
  };
}

export function parseCommunityIntelligenceCard(data: unknown): CommunityIntelligenceCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    health_score: d.health_score as number | undefined,
    intelligence_score: d.intelligence_score as number | undefined,
    contribution_score: (d.contribution_score ?? d.intelligence_score) as number | undefined,
    pending_reviews: d.pending_reviews as number | undefined,
    philosophy: d.philosophy as string | undefined,
    participation_voluntary: d.participation_voluntary as boolean | undefined,
    mission: d.mission as string | undefined,
    clwbp_mission: d.clwbp_mission as string | undefined,
    abos_principle: d.abos_principle as string | undefined,
    clwbp_abos_principle: d.clwbp_abos_principle as string | undefined,
    core_principle: d.core_principle as string | undefined,
    implementation_blueprint: d.implementation_blueprint as CommunityIntelligenceCard["implementation_blueprint"],
    collective_learning_wisdom_blueprint: d.collective_learning_wisdom_blueprint as CommunityIntelligenceCard["collective_learning_wisdom_blueprint"],
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    collective_summary: parseCollectiveSummary(d.collective_summary),
    inform_not_prescribe_note: d.inform_not_prescribe_note as string | undefined,
    clwbp_distinction_note: d.clwbp_distinction_note as string | undefined,
    ccibp89_distinction_note: d.ccibp89_distinction_note as string | undefined,
    ccibp89_mission: d.ccibp89_mission as string | undefined,
    ccibp89_philosophy: d.ccibp89_philosophy as string | undefined,
    ccibp89_abos_principle: d.ccibp89_abos_principle as string | undefined,
    ccibp89_vision: d.ccibp89_vision as string | undefined,
    ccibp89_engagement_summary: parseCcibp89EngagementSummary(d.ccibp89_engagement_summary),
    shared_learning_not_surveillance_note: d.shared_learning_not_surveillance_note as string | undefined,
    community_collective_intelligence_blueprint_phase89: d.community_collective_intelligence_blueprint_phase89 as CommunityIntelligenceCard["community_collective_intelligence_blueprint_phase89"],
    blueprint_note: d.blueprint_note as string | undefined,
  };
}

export function parseCommunityIntelligenceDashboard(data: unknown): CommunityIntelligenceDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  const featured = contributions<CommunityIntelligenceDashboard["featured_learnings"][number]>(
    d,
    "featured_learnings"
  );
  return {
    has_customer: Boolean(d.has_customer),
    participation_enabled: d.participation_enabled as boolean | undefined,
    participation_voluntary: d.participation_voluntary as boolean | undefined,
    anonymization_required: d.anonymization_required as boolean | undefined,
    philosophy: d.philosophy as string | undefined,
    safety_note: d.safety_note as string | undefined,
    health_score: d.health_score as number | undefined,
    intelligence_score: d.intelligence_score as number | undefined,
    contribution_score: (d.contribution_score ?? d.intelligence_score) as number | undefined,
    score_components: d.score_components as Record<string, number> | undefined,
    featured_learnings: featured.length > 0 ? featured : contributions(d, "featured_insights"),
    featured_insights: contributions(d, "featured_insights").length > 0
      ? contributions(d, "featured_insights")
      : featured,
    best_practices: contributions(d, "best_practices"),
    top_rated: contributions(d, "top_rated"),
    popular_resources: contributions<CommunityIntelligenceDashboard["popular_resources"][number]>(
      d,
      "popular_resources"
    ).length > 0
      ? contributions(d, "popular_resources")
      : contributions(d, "top_rated"),
    recently_validated: contributions(d, "recently_validated"),
    blueprint_recommendations: contributions(d, "blueprint_recommendations").length > 0
      ? contributions(d, "blueprint_recommendations")
      : contributions(d, "blueprint_discussions"),
    blueprint_discussions: contributions(d, "blueprint_discussions"),
    industry_insights: contributions(d, "industry_insights"),
    briefings: contributions(d, "briefings"),
    intelligence_categories: contributions(d, "intelligence_categories"),
    contribution_types: contributions(d, "contribution_types"),
    approval_workflow: contributions(d, "approval_workflow"),
    integrations: d.integrations as Record<string, string> | undefined,
    implementation_blueprint: d.implementation_blueprint as CommunityIntelligenceDashboard["implementation_blueprint"],
    mission: d.mission as string | undefined,
    community_philosophy: d.community_philosophy as string | undefined,
    abos_principle: d.abos_principle as string | undefined,
    core_principle: d.core_principle as string | undefined,
    vision: d.vision as string | undefined,
    community_intelligence_note: d.community_intelligence_note as string | undefined,
    distinction_note: d.distinction_note as string | undefined,
    community_objectives: parseCommunityObjectives(d.community_objectives),
    collective_insight_examples: parseCollectiveInsightExamples(d.collective_insight_examples),
    privacy_principles: parsePrivacyPrinciples(d.privacy_principles),
    community_contributions_blueprint: parseCommunityContributionsBlueprint(d.community_contributions_blueprint),
    companion_examples: parseCompanionExamples(d.companion_examples),
    self_love_connection: parseSelfLoveConnection(d.self_love_connection),
    trust_connection: parseTrustConnection(d.trust_connection),
    dogfooding: d.dogfooding as CommunityIntelligenceDashboard["dogfooding"],
    integration_links: parseIntegrationLinks(d.integration_links),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    success_criteria: parseSuccessCriteria(d.success_criteria),
    vision_phrases: parseStringArray(d.vision_phrases),
    privacy_note: d.privacy_note as string | undefined,
    principles: parseStringArray(d.principles),
    collective_learning_wisdom_blueprint: d.collective_learning_wisdom_blueprint as CommunityIntelligenceDashboard["collective_learning_wisdom_blueprint"],
    clwbp_mission: d.clwbp_mission as string | undefined,
    clwbp_philosophy: d.clwbp_philosophy as string | undefined,
    clwbp_abos_principle: d.clwbp_abos_principle as string | undefined,
    clwbp_objectives: parseCommunityObjectives(d.clwbp_objectives),
    collective_observations: parseCollectiveObservations(d.collective_observations),
    best_practice_evolution: parseBestPracticeEvolution(d.best_practice_evolution),
    clwbp_anonymization_principles: parseAnonymizationPrinciples(d.clwbp_anonymization_principles),
    knowledge_center_connection: parseKnowledgeCenterConnection(d.knowledge_center_connection),
    sales_expert_connection: parseSalesExpertConnection(d.sales_expert_connection),
    executive_connection: parseExecutiveConnection(d.executive_connection),
    clwbp_self_love_connection: parseSelfLoveConnection(d.clwbp_self_love_connection),
    clwbp_trust_connection: parseTrustConnection(d.clwbp_trust_connection),
    clwbp_dogfooding: d.clwbp_dogfooding as CommunityIntelligenceDashboard["clwbp_dogfooding"],
    clwbp_integration_links: parseIntegrationLinks(d.clwbp_integration_links),
    collective_summary: parseCollectiveSummary(d.collective_summary),
    clwbp_success_criteria: parseSuccessCriteria(d.clwbp_success_criteria),
    clwbp_distinction_note: d.clwbp_distinction_note as string | undefined,
    clwbp_vision_phrases: parseStringArray(d.clwbp_vision_phrases),
    inform_not_prescribe_note: d.inform_not_prescribe_note as string | undefined,
    community_collective_intelligence_blueprint_phase89: parseCommunityCollectiveIntelligenceBlueprintPhase89(
      d.community_collective_intelligence_blueprint_phase89
    ),
  };
}

export function parseCommunityIntelligenceAdmin(data: unknown): CommunityIntelligenceAdmin {
  const d = (data ?? {}) as Record<string, unknown>;
  const governanceQueue = contributions<CommunityIntelligenceAdmin["governance_queue"][number]>(
    d,
    "governance_queue"
  );
  return {
    has_customer: Boolean(d.has_customer),
    participation_enabled: d.participation_enabled as boolean | undefined,
    require_governance_review: d.require_governance_review as boolean | undefined,
    health_score: d.health_score as number | undefined,
    intelligence_score: d.intelligence_score as number | undefined,
    contribution_score: (d.contribution_score ?? d.intelligence_score) as number | undefined,
    pending_reviews: contributions(d, "pending_reviews"),
    governance_queue: governanceQueue.length > 0 ? governanceQueue : contributions(d, "governance_flags"),
    contribution_queue: contributions(d, "contribution_queue"),
    governance_flags: contributions(d, "governance_flags"),
    contribution_trends: contributions(d, "contribution_trends").length > 0
      ? contributions(d, "contribution_trends")
      : contributions(d, "intelligence_trends"),
    intelligence_trends: contributions(d, "intelligence_trends"),
    intelligence_categories: contributions(d, "intelligence_categories"),
    participation_insights: d.participation_insights as CommunityIntelligenceAdmin["participation_insights"],
    pending_count: d.pending_count as number | undefined,
    queue_count: d.queue_count as number | undefined,
  };
}

export function parseCommunityActionResult(data: unknown): CommunityActionResult {
  return (data ?? {}) as CommunityActionResult;
}

export function parseCommunityBriefingResult(data: unknown): CommunityBriefingResult {
  return (data ?? {}) as CommunityBriefingResult;
}
