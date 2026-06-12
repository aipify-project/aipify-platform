export const IMPLEMENTATION_BLUEPRINT_PHASE61_MISSION =
  "Help leaders improve collaboration, reduce unnecessary strain, and support sustainable organizational performance.";

export const IMPLEMENTATION_BLUEPRINT_PHASE61_PHILOSOPHY =
  "Performance should not come at the expense of wellbeing — success and wellbeing reinforce each other; resilient cultures sustain high performance without sacrificing people.";

export const IMPLEMENTATION_BLUEPRINT_PHASE61_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) — organizations flourish when people feel supported, respected, and valued; organizational health is a strategic priority.";

export const IMPLEMENTATION_BLUEPRINT_PHASE61_OBJECTIVE_KEYS = [
  "team_wellbeing_awareness",
  "workload_visibility",
  "collaboration_insights",
  "recognition_experiences",
  "early_strain_awareness",
  "sustainable_growth",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE61_DOMAIN_KEYS = [
  "communication_health",
  "operational_health",
  "people_health",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE61_OBSERVATION_EXAMPLES = [
  "🦉 A small number of roles appear heavily relied upon — worth a leadership conversation about distribution and recovery, not blame.",
  "🌹 Recognition activity has increased this period — team celebrations may be strengthening collaboration.",
  "🔔 Workload concentration in a few areas deserves leadership attention — sustainability matters alongside delivery.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE61_VISION_PHRASES = [
  "High performance without sacrificing wellbeing — leaders pay attention to the people behind performance.",
  "Resilient cultures where success and wellbeing reinforce each other.",
  "Workload sustainability alongside operational excellence.",
  "Recognition and recovery as strategic organizational priorities.",
  "Trust through transparent, aggregate health indicators — humans decide action.",
] as const;

export function getImplementationBlueprintPhase61Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE61_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE61_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE61_ABOS_PRINCIPLE,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE61_OBJECTIVE_KEYS,
    domainKeys: IMPLEMENTATION_BLUEPRINT_PHASE61_DOMAIN_KEYS,
    observationExamples: IMPLEMENTATION_BLUEPRINT_PHASE61_OBSERVATION_EXAMPLES,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE61_VISION_PHRASES,
    engineRoute: "/app/organizational-health-engine",
    enginePhase: "Phase A.56",
    blueprintPhase: "Phase 61 — Organizational Health Engine",
    observabilityDistinction:
      "Observability Platform Health A.19 — infrastructure/incidents at /app/observability-platform-health-engine",
    customerSuccessDistinction: "Customer Success A.26 — health scores cross-link at /app/customer-success-engine",
    executiveDistinction: "Executive Insights A.35 — executive reporting cross-link at /app/executive-insights-engine",
    gratitudeRoute: "/app/gratitude-recognition-engine",
    selfLoveRoute: "/app/self-love-engine",
    selfLoveBoundary:
      "Self Love supports boundaries and sustainable pacing — principle only; Organizational Health stores aggregate metadata.",
    privacyNote: "No individual surveillance, hidden monitoring, or punitive interpretations — metadata only.",
  };
}
