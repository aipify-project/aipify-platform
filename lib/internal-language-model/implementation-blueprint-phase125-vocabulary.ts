export const IMPLEMENTATION_BLUEPRINT_PHASE125_MISSION =
  "Help leaders think clearly about important decisions — structure, perspective, and wisdom that strengthen judgment without deciding for them.";

export const IMPLEMENTATION_BLUEPRINT_PHASE125_PHILOSOPHY =
  "People First. Wisdom before speed. Better thinking not faster decisions. Aipify expands perspective; leaders retain accountability. Metadata only — no raw transcripts or PII.";

export const IMPLEMENTATION_BLUEPRINT_PHASE125_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) — Decision Intelligence Center orchestrates decision workspaces, advisory briefings, assumption reviews, and outcome learning. Personal DSE and ODSE remain authoritative for their domains.";

export const IMPLEMENTATION_BLUEPRINT_PHASE125_VISION =
  "Leaders navigate complexity with clearer thinking — structured reflection, alternative perspectives, and institutional wisdom that outlasts any single decision moment.";

export const IMPLEMENTATION_BLUEPRINT_PHASE125_OBJECTIVE_KEYS = [
  "decision_quality",
  "reduce_impulsive",
  "alternative_perspectives",
  "clarify_assumptions",
  "organizational_alignment",
  "transparency",
  "learn_from_previous",
  "long_term_wisdom",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE125_INTELLIGENCE_CENTER = [
  "decision_workspaces",
  "decision_journals",
  "advisory_briefings",
  "assumption_reviews",
  "tradeoff_analysis",
  "stakeholder_mapping",
  "historical_references",
  "outcome_tracking",
  "reflection_sessions",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE125_WORKSPACE_FIELDS = [
  "decision_statement",
  "objectives",
  "constraints",
  "alternatives",
  "dependencies",
  "stakeholders",
  "benefits",
  "risks",
  "unknowns",
  "supporting_knowledge",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE125_COMPANION_SUPPORTS = [
  "thoughtful_questions",
  "blind_spots",
  "historical_context",
  "alternative_viewpoints",
  "tradeoffs",
  "knowledge_resources",
  "reflection",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE125_COMPANION_LIMITATIONS = [
  "no_executive_decisions",
  "no_guaranteed_outcomes",
  "no_suppressing_disagreement",
  "no_certainty_framing",
  "no_overriding_judgment",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE125_COMPANION_ADAPTATION = [
  "🦉 Three assumptions in this workspace may benefit from review — shall Aipify prepare a challenge summary for your reflection?",
  "🌹 A trade-off analysis scaffold is ready — would exploring who benefits and who is affected feel helpful before you decide?",
  "🔔 A prior decision on a similar topic may offer context — shall Aipify summarize the outcome learning entry?",
] as const;

export function getImplementationBlueprintPhase125Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE125_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE125_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE125_ABOS_PRINCIPLE,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE125_VISION,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE125_OBJECTIVE_KEYS,
    intelligenceCenterCapabilities: IMPLEMENTATION_BLUEPRINT_PHASE125_INTELLIGENCE_CENTER,
    workspaceFields: IMPLEMENTATION_BLUEPRINT_PHASE125_WORKSPACE_FIELDS,
    companionSupports: IMPLEMENTATION_BLUEPRINT_PHASE125_COMPANION_SUPPORTS,
    companionLimitations: IMPLEMENTATION_BLUEPRINT_PHASE125_COMPANION_LIMITATIONS,
    companionAdaptation: IMPLEMENTATION_BLUEPRINT_PHASE125_COMPANION_ADAPTATION,
    engineRoute: "/app/decision-intelligence-engine",
    enginePhase: "Repo Phase 125 — Decision Intelligence & Executive Advisory Engine",
    blueprintPhase: "Phase 125 — Decision Intelligence & Executive Advisory",
    enterpriseIntelligenceEra: "Enterprise Intelligence Era (121–130)",
    personalDseDistinction: "Personal DSE Phase 38/60 at /app/assistant/decisions — cross-link only, never duplicate _dse_*",
    odseDistinction: "ODSE A.54 at /app/organizational-decision-support-engine — cross-link only, never duplicate _odse_*",
    metadataOnly: "Metadata only in journals — no raw chat, email, meeting transcripts, or PII",
    humansDecide: "Humans decide — no binding recommendations or executive decisions on behalf of leaders",
  };
}
