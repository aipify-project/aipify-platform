export const IMPLEMENTATION_BLUEPRINT_PHASE138_MISSION =
  "Deepen organizational purpose alignment across leadership, companions, and daily practice — reflection not enforcement.";

export const IMPLEMENTATION_BLUEPRINT_PHASE138_PHILOSOPHY =
  "Purpose guides action — not words on a website. Reflection not ideology enforcement. Culture health reflects organizational patterns — never individual surveillance.";

export const IMPLEMENTATION_BLUEPRINT_PHASE138_ABOS_PRINCIPLE =
  "Stewardship through responsibility. Humans define purpose and values; companions support reflection only. Growth Partner terminology — never Affiliate. People First.";

export const IMPLEMENTATION_BLUEPRINT_PHASE138_VISION =
  "Organizations live their purpose — values visible in decisions, companions, and culture — because reflection and alignment are practiced, not imposed.";

export const IMPLEMENTATION_BLUEPRINT_PHASE138_OBJECTIVE_KEYS = [
  "purpose_alignment_center",
  "values_framework_engine",
  "alignment_review_engine",
  "purpose_companion",
  "culture_health_engine",
  "purpose_integration",
  "values_memory",
  "executive_purpose_reviews",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE138_DEFAULT_VALUES = [
  "Integrity",
  "Compassion",
  "Curiosity",
  "Responsibility",
  "Transparency",
  "Excellence",
  "Community",
  "Growth",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE138_COMPANION_LIMITATIONS = [
  "Never impose beliefs or ideological framing",
  "Never claim objective truth about organizational purpose",
  "Never replace leadership purpose definition",
  "Never suppress diversity of perspective or dissent",
  "Never override governance, Trust Actions, or Human Oversight gates",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE138_CULTURE_HEALTH_INDICATORS = [
  "Knowledge sharing",
  "Recognition patterns",
  "Leadership accessibility",
  "Psychological safety signals",
  "Learning participation",
  "Community engagement",
  "Support experiences",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE138_VISION_PHRASES = [
  "Purpose guides action — not words on a website.",
  "Reflection not ideology enforcement — humans define purpose; companions facilitate.",
  "Culture health reflects organizational patterns — never employee surveillance.",
  "Stewardship through responsibility — Growth Partner terminology, People First.",
  "Values visible in decisions, companions, and culture — practiced, not imposed.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE138_ERA_PHASES = [
  { phase: "131", route: "/app/human-oversight-engine", label: "Autonomy Governance & Human Oversight" },
  { phase: "132", route: "/app/companion-workforce-engine", label: "Coordinated Companion Workforce" },
  { phase: "133", route: "/app/workflow-orchestration-engine", label: "Autonomous Workflow Orchestration" },
  { phase: "134", route: "/app/continuous-improvement-engine", label: "Adaptive Organization & Continuous Optimization" },
  { phase: "137", route: "/app/collective-decision-council-engine", label: "Collective Decision & Human-Companion Council" },
  { phase: "138", route: "/app/purpose-values-engine", label: "Organizational Purpose Alignment & Values" },
] as const;

export function getImplementationBlueprintPhase138Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE138_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE138_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE138_ABOS_PRINCIPLE,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE138_VISION,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE138_OBJECTIVE_KEYS,
    defaultValues: IMPLEMENTATION_BLUEPRINT_PHASE138_DEFAULT_VALUES,
    companionLimitations: IMPLEMENTATION_BLUEPRINT_PHASE138_COMPANION_LIMITATIONS,
    cultureHealthIndicators: IMPLEMENTATION_BLUEPRINT_PHASE138_CULTURE_HEALTH_INDICATORS,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE138_VISION_PHRASES,
    eraPhases: IMPLEMENTATION_BLUEPRINT_PHASE138_ERA_PHASES,
    engineRoute: "/app/purpose-values-engine",
    enginePhase: "Phase A.82 (extends Blueprint Phases 64 & 95)",
    blueprintPhase: "Phase 138 — Organizational Purpose Alignment & Values Engine",
    socialImpactDistinction:
      "Social Impact & Purpose Phase 118 at /app/social-impact-purpose-engine — cross-link only",
    collectiveDecisionDistinction:
      "Collective Decision Council Phase 137 at /app/collective-decision-council-engine — cross-link only",
    strategicAlignmentDistinction: "Strategic Alignment A.55 at /app/strategic-alignment-engine",
    inclusionDistinction: "Inclusion & Humanity A.83 at /app/inclusion-humanity-engine",
    selfLoveRoute: "/app/self-love-engine",
    privacyNote:
      "Metadata only — no hidden cultural scoring, no individual behavior metrics, no employee surveillance.",
  };
}
