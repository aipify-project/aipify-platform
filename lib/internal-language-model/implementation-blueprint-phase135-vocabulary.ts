export const IMPLEMENTATION_BLUEPRINT_PHASE135_MISSION =
  "Help organizations notice emerging patterns early, anticipate support needs compassionately, and strengthen preventative care — care not control, wisdom before speed.";

export const IMPLEMENTATION_BLUEPRINT_PHASE135_PHILOSOPHY =
  "Organizational patterns only — never individual employee monitoring. People First. Companions support awareness without unnecessary urgency. Humans responsible; approved governance for any automated intervention.";

export const IMPLEMENTATION_BLUEPRINT_PHASE135_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) — Proactive Organization Center surfaces aggregate early signals and preventative recommendations. Companions highlight trends and encourage reflection; humans decide and connect.";

export const IMPLEMENTATION_BLUEPRINT_PHASE135_VISION =
  "Organizations stay ahead with compassionate early awareness — supported by anticipatory companions that prepare teams without surveillance or false certainty.";

export const IMPLEMENTATION_BLUEPRINT_PHASE135_OBJECTIVE_KEYS = [
  "early_awareness",
  "anticipatory_support",
  "preventative_action",
  "org_pulse",
  "knowledge_delivery",
  "executive_anticipation",
  "companion_coordination",
  "care_not_surveillance",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE135_CENTER_CAPABILITIES = [
  "emerging_signals",
  "support_opportunities",
  "preventative_recommendations",
  "pulse_monitoring",
  "companion_alerts",
  "knowledge_gaps",
  "executive_notifications",
  "anticipation_dashboards",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE135_SIGNAL_TYPES = [
  "support_volume",
  "knowledge_access",
  "workflow_bottleneck",
  "transformation_fatigue",
  "companion_adoption",
  "learning_participation",
  "csat_change",
  "leadership_overload",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE135_COMPANION_LIMITATIONS = [
  "unnecessary_anxiety",
  "false_certainty",
  "governance_override",
  "opaque_action",
  "replace_relationships",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE135_COMPANION_ADAPTATION = [
  "🔔 Aipify noticed support volume trending up — shall we review whether teams need additional resources?",
  "🌿 Transformation pace may be creating fatigue — would a lighter change cadence help?",
  "📚 Knowledge access patterns suggest a refresh opportunity — shall Aipify prepare role-based reinforcement?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE135_VISION_PHRASES = [
  "Care not surveillance",
  "Wisdom before speed",
  "Anticipate with compassion",
  "Humans decide — companions prepare",
  "Organizational patterns — not employee monitoring",
] as const;

export function getImplementationBlueprintPhase135Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE135_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE135_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE135_ABOS_PRINCIPLE,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE135_VISION,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE135_OBJECTIVE_KEYS,
    centerCapabilities: IMPLEMENTATION_BLUEPRINT_PHASE135_CENTER_CAPABILITIES,
    signalTypes: IMPLEMENTATION_BLUEPRINT_PHASE135_SIGNAL_TYPES,
    companionLimitations: IMPLEMENTATION_BLUEPRINT_PHASE135_COMPANION_LIMITATIONS,
    companionAdaptation: IMPLEMENTATION_BLUEPRINT_PHASE135_COMPANION_ADAPTATION,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE135_VISION_PHRASES,
    engineRoute: "/app/proactive-organization-engine",
    enginePhase: "Repo Phase 135 — Proactive Organization & Anticipatory Support Engine",
    blueprintPhase: "Phase 135 — Proactive Organization & Anticipatory Support",
    autonomousOrganizationEra: "Autonomous Organization Era (131–140)",
    proactiveCompanionDistinction:
      "Proactive Companion A.79 at /app/proactive-companion-engine — individual nudges; cross-link only",
    orgHealthDistinction:
      "Organizational Health A.56 at /app/organizational-health-engine — health indicators cross-link",
    metadataOnly: "Aggregate organizational metadata — no raw chat, email, or PII",
    notSurveillance: "Organizational patterns — NOT employee surveillance",
    growthPartnerTerminology: "Growth Partner terminology — never Affiliate",
  };
}
