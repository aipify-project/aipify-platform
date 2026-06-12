export const IMPLEMENTATION_BLUEPRINT_PHASE62_MISSION =
  "Help organizations introduce new systems, processes, structures, and ways of working while supporting people affected.";

export const IMPLEMENTATION_BLUEPRINT_PHASE62_PHILOSOPHY =
  "People resist uncertainty, confusion, and lack of involvement — not change itself. Successful change requires communication, support, and empathy.";

export const IMPLEMENTATION_BLUEPRINT_PHASE62_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) — change is not just implementation; help people move confidently from one reality to another.";

export const IMPLEMENTATION_BLUEPRINT_PHASE62_OBJECTIVE_KEYS = [
  "change_planning",
  "communication_guidance",
  "stakeholder_awareness",
  "adoption_support",
  "progress_visibility",
  "reinforcement_strategies",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE62_CHANGE_TYPE_KEYS = [
  "operational",
  "technology",
  "organizational",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE62_COMPANION_EXAMPLES = [
  "🦉 Stakeholders may benefit from another briefing — additional communication may help reduce uncertainty.",
  "🌹 Training completion is below target — stakeholders may need more preparation before the next milestone.",
  "🔔 Impact assessment milestone completed — consider a progress update to reinforce momentum.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE62_VISION_PHRASES = [
  "Transformation without losing people — leaders supported, employees included.",
  "This change was handled thoughtfully.",
  "Help people move confidently from one reality to another.",
  "Communication, support, and empathy — not just implementation checklists.",
  "Constructive resistance handled with dialogue — organizational resilience grows.",
] as const;

export function getImplementationBlueprintPhase62Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE62_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE62_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE62_ABOS_PRINCIPLE,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE62_OBJECTIVE_KEYS,
    changeTypeKeys: IMPLEMENTATION_BLUEPRINT_PHASE62_CHANGE_TYPE_KEYS,
    companionExamples: IMPLEMENTATION_BLUEPRINT_PHASE62_COMPANION_EXAMPLES,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE62_VISION_PHRASES,
    engineRoute: "/app/change-management-engine",
    enginePhase: "Phase A.47",
    blueprintPhase: "Phase 62 — Change Management Engine",
    evolutionDistinction:
      "Evolution Governance Phase 84 — Aipify software evolution at /app/evolution, not org change initiatives",
    enterpriseDistinction:
      "Enterprise Deployment Framework Phase 92 — deployment change section at /app/enterprise/framework",
    stakeholderDistinction:
      "Stakeholder Communication A.53 — multi-channel delivery at /app/stakeholder-communication-engine",
    orgHealthDistinction:
      "Organizational Health Blueprint Phase 61 A.56 — distinct from initiative management at /app/organizational-health-engine",
    learningRoute: "/app/learning-training-engine",
    selfLoveRoute: "/app/self-love-engine",
    selfLoveBoundary:
      "Self Love supports patience and recovery during transition — principle only; Change Management stores initiative metadata.",
    helperPrefix: "_cmbp_",
    engineHelperPrefix: "_cme_",
    adjustmentPhrase: "Adjustment often requires time.",
  };
}
