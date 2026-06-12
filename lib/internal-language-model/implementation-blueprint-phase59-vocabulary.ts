export const IMPLEMENTATION_BLUEPRINT_PHASE59_MISSION =
  "Support strategic reflection and leadership clarity — priority alignment, opportunity awareness, and long-term planning on executive insights metadata.";

export const IMPLEMENTATION_BLUEPRINT_PHASE59_PHILOSOPHY =
  "Strategic thinking needs space for reflection — Aipify surfaces priorities, hypotheses, and alignment signals; leadership retains every strategic decision.";

export const IMPLEMENTATION_BLUEPRINT_PHASE59_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) prepares strategic context — humans decide; hypotheses are labeled separately from verified data.";

export const IMPLEMENTATION_BLUEPRINT_PHASE59_OBJECTIVE_KEYS = [
  "strategic_reflection",
  "priority_clarification",
  "opportunity_exploration",
  "long_term_planning",
  "executive_preparation",
  "organizational_alignment",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE59_CONVERSATION_EXAMPLES = [
  "🦉 What strategic priorities deserve your attention this quarter — and which can wait?",
  "🌹 Where is the team stretched thinnest — and what would healthy prioritization look like?",
  "🔔 Before committing resources — do current initiatives still align with stated objectives?",
  "🦉 Which strategic assumptions are hypotheses today — and what data would confirm or challenge them?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE59_BRIEFING_EXAMPLES = [
  "📈 Organization health and strategic opportunity count — here is the trajectory for your quarterly briefing.",
  "🦉 Before your strategic review — three hypotheses and two verified trends deserve leadership attention.",
  "🌹 Several critical strategic items surfaced — would it help to sequence priorities before the executive session?",
  "🔔 Two organizational decisions are ready when you want to prepare — no urgency implied.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE59_VISION_PHRASES = [
  "Strategic clarity grows from reflection — not from more dashboards.",
  "Hypotheses and data serve different roles — label both honestly.",
  "Leadership retains every strategic decision — Aipify prepares context.",
  "Sustainable strategy respects pacing — not every decision is urgent.",
  "Alignment visibility helps leaders choose focus — Aipify never auto-reprioritizes.",
] as const;

export function getImplementationBlueprintPhase59Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE59_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE59_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE59_ABOS_PRINCIPLE,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE59_OBJECTIVE_KEYS,
    conversationExamples: IMPLEMENTATION_BLUEPRINT_PHASE59_CONVERSATION_EXAMPLES,
    briefingExamples: IMPLEMENTATION_BLUEPRINT_PHASE59_BRIEFING_EXAMPLES,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE59_VISION_PHRASES,
    engineRoute: "/app/executive-insights-engine",
    enginePhase: "A.35",
    blueprintPhase: "Phase 59 — Strategic Thinking Engine",
    phase13Blueprint: "Phase 13 — Executive Insights Engine Foundation",
    documentOutputDistinction:
      "Document & Output Engine Phase A.59 — operational document generation at /app/document-output-engine",
    qualityGuardianDistinction:
      "Quality Guardian Phases 58–59 — operational quality at /app/quality, not strategic reflection",
    executiveBriefingDistinction:
      "Customer /app/executive daily briefings — distinct from strategic thinking scaffolds",
    strategicAlignmentRoute: "/app/strategic-alignment-engine",
    strategicIntelligenceRoute: "/app/strategic-intelligence-foundation-engine",
    decisionSupportRoute: "/app/assistant/decisions",
    orgDecisionSupportRoute: "/app/organizational-decision-support-engine",
    predictiveInsightsRoute: "/app/predictive-insights-engine",
    goalsOkrRoute: "/app/goals-okr-engine",
    selfLoveRoute: "/app/self-love-engine",
    ecosystemGrowthRoute: "/app/marketplace-partner-ecosystem-foundation-engine",
    selfLoveBoundary:
      "Self Love supports reflection and sustainable pacing — principle only; Strategic Thinking stores metadata scaffolds.",
    dataVsHypothesesNote:
      "Verified data and hypotheses are labeled separately — uncertainty acknowledged; leadership validates before action.",
    noAutoExecutionNote: "Aipify advises — humans decide; no automated strategic execution.",
  };
}
