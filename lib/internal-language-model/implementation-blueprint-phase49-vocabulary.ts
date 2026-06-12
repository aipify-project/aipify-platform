export const IMPLEMENTATION_BLUEPRINT_PHASE49_MISSION =
  "Help Sales Experts see their pipeline clearly, prioritize thoughtfully, and act with integrity — intelligence informs, humans decide.";

export const IMPLEMENTATION_BLUEPRINT_PHASE49_PHILOSOPHY =
  "Not every opportunity is urgent. Scores and categories support focus — sustainable pacing protects wellbeing and professional judgment.";

export const IMPLEMENTATION_BLUEPRINT_PHASE49_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) partners grow through informed, relationship-first sales — Aipify prepares context; Sales Experts choose every action.";

export const IMPLEMENTATION_BLUEPRINT_PHASE49_OBJECTIVE_KEYS = [
  "opportunity_awareness",
  "prioritization",
  "industry_insights",
  "follow_up_recommendations",
  "pipeline_visibility",
  "market_observations",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE49_PIPELINE_CATEGORY_KEYS = [
  "early_stage",
  "demo_candidates",
  "follow_up_priorities",
  "renewal_related",
  "expansion_conversations",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE49_INDUSTRY_KEYS = [
  "commerce",
  "professional_services",
  "community_platforms",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE49_SCORING_DIMENSION_KEYS = [
  "engagement",
  "demo_completed",
  "stakeholders",
  "positive_signals",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE49_COMPANION_EXAMPLES = [
  "🦉 Three opportunities may benefit from a thoughtful follow-up this week — here is what Aipify noticed from pipeline metadata.",
  "🌹 A prospect in qualification may be ready for a focused demo — prepare discovery questions first.",
  "🔔 One opportunity has been quiet for a while — a gentle check-in may reopen the conversation.",
] as const;

export function getImplementationBlueprintPhase49Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE49_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE49_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE49_ABOS_PRINCIPLE,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE49_OBJECTIVE_KEYS,
    pipelineCategoryKeys: IMPLEMENTATION_BLUEPRINT_PHASE49_PIPELINE_CATEGORY_KEYS,
    industryKeys: IMPLEMENTATION_BLUEPRINT_PHASE49_INDUSTRY_KEYS,
    scoringDimensionKeys: IMPLEMENTATION_BLUEPRINT_PHASE49_SCORING_DIMENSION_KEYS,
    companionExamples: IMPLEMENTATION_BLUEPRINT_PHASE49_COMPANION_EXAMPLES,
    engineRoute: "/app/sales-expert-engine",
    enginePhase: "A.95",
    blueprintPhase: "Phase 49 — Sales Intelligence & Opportunity Engine",
    intelligenceTab: "Intelligence",
    opportunitiesTab: "Opportunities",
    selfLoveRoute: "/app/self-love-engine",
    selfLovePhase: "A.76",
    industryIntelligenceRoute: "/app/industry-intelligence-foundation-engine",
    industryIntelligencePhase: "A.44",
    predictiveInsightsRoute: "/app/predictive-insights-engine",
    predictiveInsightsPhase: "A.66",
    decisionSupportRoute: "/app/organizational-decision-support-engine",
    decisionSupportPhase: "A.54",
    engagementBookingPhase: 43,
    renewalExpansionPhase: 44,
    salesCoachPhase: 45,
    distinctionNote:
      "Distinct from Predictive Insights A.66, Strategic Intelligence A.31, Industry Intelligence A.44, Cross-Tenant A.71 — Phase 49 is Sales Expert opportunity guidance in the partner portal only.",
    scoringPrinciple: "Opportunity scoring informs prioritization — never dictates.",
    noCrossTenant: true,
  };
}
