export const IMPLEMENTATION_BLUEPRINT_PHASE24_MISSION =
  "Identify broader patterns, shared learning, and collective improvements across organizations — preserving privacy, security, and trust.";

export const IMPLEMENTATION_BLUEPRINT_PHASE24_PHILOSOPHY =
  "Organizations should not solve every problem alone — shared learning accelerates progress; collective intelligence without compromising confidentiality.";

export const IMPLEMENTATION_BLUEPRINT_PHASE24_ABOS_PRINCIPLE =
  "Wisdom grows when experiences are shared responsibly.";

export const IMPLEMENTATION_BLUEPRINT_PHASE24_CORE_PRINCIPLE =
  "Organizations own their knowledge. Organizations control participation.";

export const IMPLEMENTATION_BLUEPRINT_PHASE24_COMMUNITY_OBJECTIVE_KEYS = [
  "best_practice_recommendations",
  "industry_trend_awareness",
  "cross_org_learning",
  "emerging_pattern_detection",
  "community_driven_improvements",
  "benchmarking_opportunities",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE24_COLLECTIVE_INSIGHT_DOMAINS = [
  "support",
  "knowledge",
  "operational",
  "strategic",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE24_VISION_PHRASES = [
  'Benefit from broader ecosystem lessons — "we would never have discovered this on our own."',
  "Wisdom grows when experiences are shared responsibly — collective intelligence without compromising confidentiality.",
  "Organizations should not solve every problem alone — shared learning accelerates progress.",
  "Organizations own their knowledge. Organizations control participation.",
  "Trust is non-negotiable — anonymized aggregation, explicit governance, voluntary participation.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE24_COMPANION_EXAMPLES = [
  "🦉 Other organizations approached morning triage differently — a pattern worth exploring without exposing who shared it.",
  "🌹 You are not alone — similar knowledge gaps appear across the ecosystem.",
  "🔔 A community insight on escalation workflows is worth exploring — validated by multiple organizations.",
  "🦉 Emerging trends in support best practices suggest prioritizing knowledge gap reviews.",
] as const;

export function getImplementationBlueprintPhase24Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE24_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE24_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE24_ABOS_PRINCIPLE,
    corePrinciple: IMPLEMENTATION_BLUEPRINT_PHASE24_CORE_PRINCIPLE,
    communityObjectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE24_COMMUNITY_OBJECTIVE_KEYS,
    collectiveInsightDomains: IMPLEMENTATION_BLUEPRINT_PHASE24_COLLECTIVE_INSIGHT_DOMAINS,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE24_VISION_PHRASES,
    companionExamples: IMPLEMENTATION_BLUEPRINT_PHASE24_COMPANION_EXAMPLES,
    engineRoute: "/app/community",
    adminRoute: "/app/community/admin",
    enginePhase: "Phase 89",
    blueprintPhase: "Phase 24 — Community & Collective Intelligence Engine",
    crossTenantDistinction: "Cross-Tenant Intelligence A.71 — platform-wide patterns, distinct from tenant community hub",
    benchmarkingDistinction: "Organizational Benchmarking A.58 — anonymized aggregates only",
    learningDistinction: "Learning & Adaptation Phase 23 — tenant learning loops, not collective community insights",
    selfLoveBoundary: "Self Love normalizes challenges and celebrates collective progress — principle only; Community Intelligence stores anonymized metadata, not wellbeing content.",
  };
}
