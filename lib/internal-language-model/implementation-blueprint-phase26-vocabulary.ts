export const IMPLEMENTATION_BLUEPRINT_PHASE26_MISSION =
  "Build and maintain trusted long-term relationships — trust earned through consistency, transparency, and reliability.";

export const IMPLEMENTATION_BLUEPRINT_PHASE26_PHILOSOPHY =
  "Trust grows slowly through thousands of small moments — reliable, respectful, transparent, helpful, consistent; lost quickly when promises break.";

export const IMPLEMENTATION_BLUEPRINT_PHASE26_ABOS_PRINCIPLE =
  "Technology earns trust through actions, not slogans.";

export const IMPLEMENTATION_BLUEPRINT_PHASE26_RELATIONSHIP_OBJECTIVE_KEYS = [
  "consistent_experiences",
  "transparent_recommendations",
  "clear_explanations",
  "respectful_communication",
  "responsible_assistance",
  "long_term_confidence",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE26_RELATIONSHIP_PRINCIPLE_KEYS = [
  "keep_promises",
  "admit_uncertainty",
  "explain_recommendations",
  "respect_boundaries",
  "support_autonomy",
  "remember_harmless_preferences",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE26_EXAMPLE_PHRASES = [
  "I am not fully confident about this yet — here is what I do know.",
  "We could explore another approach if you prefer.",
  "Based on previous successful outcomes in your organization, this path may fit.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE26_VISION_PHRASES = [
  "An honest, consistent, genuinely helpful companion — one interaction at a time.",
  "Trust grows slowly through thousands of small moments — lost quickly when promises break.",
  "Technology earns trust through actions, not slogans.",
  "Appropriate reliance — Aipify informs and prepares; humans decide.",
  "Transparent recommendations build long-term confidence across every module.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE26_COMPANION_EXAMPLES = [
  "🌹 Aipify remembers you prefer concise summaries — briefings stay focused unless you ask for detail.",
  "🔔 Trust milestone on workflow approvals — steady consistency builds confidence over time.",
  "🦉 Not fully confident about this path yet — two alternatives worth comparing before you decide.",
  "❤️ Demanding week — celebrate progress; sustainable pace matters more than speed.",
] as const;

export function getImplementationBlueprintPhase26Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE26_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE26_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE26_ABOS_PRINCIPLE,
    relationshipObjectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE26_RELATIONSHIP_OBJECTIVE_KEYS,
    relationshipPrincipleKeys: IMPLEMENTATION_BLUEPRINT_PHASE26_RELATIONSHIP_PRINCIPLE_KEYS,
    examplePhrases: IMPLEMENTATION_BLUEPRINT_PHASE26_EXAMPLE_PHRASES,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE26_VISION_PHRASES,
    companionExamples: IMPLEMENTATION_BLUEPRINT_PHASE26_COMPANION_EXAMPLES,
    engineRoute: "/app/trust-reputation-engine",
    enginePhase: "Phase A.72",
    blueprintPhase: "Phase 26 — Trust & Relationship Engine",
    trustActionDistinction: "Trust & Action Engine Phase 30 — sensitive approvals at /app/approvals",
    securityDashboardDistinction:
      "Trust Architecture Security Dashboard — customer transparency at /app/settings/security",
    companionIdentityDistinction:
      "Companion Identity A.84 — communication style at /app/companion-identity-engine",
    rsiDistinction:
      "Relationship Intelligence A.78 organizational vs personal RSI at /app/assistant/relationships",
    selfLoveBoundary:
      "Self Love supports reflection and sustainable pace — principle only; Trust & Reputation stores metadata signals.",
  };
}
