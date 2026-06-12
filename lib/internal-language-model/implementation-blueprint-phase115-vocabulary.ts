export const IMPLEMENTATION_BLUEPRINT_PHASE115_MISSION =
  "Continuously educate teams — learning as part of everyday work, not a separate burden.";

export const IMPLEMENTATION_BLUEPRINT_PHASE115_PHILOSOPHY =
  "People First. Wisdom before speed. Growth through support. Learning empowers confidence, not pressure — purpose is growth, not perfection.";

export const IMPLEMENTATION_BLUEPRINT_PHASE115_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) — Aipify University is the centralized learning environment. Companion coaches support growth; humans decide pace. Metadata only in analytics.";

export const IMPLEMENTATION_BLUEPRINT_PHASE115_VISION =
  "Learning continuous, accessible, practical — woven into everyday work so organizations grow without overwhelm.";

export const IMPLEMENTATION_BLUEPRINT_PHASE115_OBJECTIVE_KEYS = [
  "continuously_educate",
  "accelerate_onboarding",
  "companion_adoption",
  "preserve_knowledge",
  "build_leadership",
  "reduce_change_resistance",
  "security_awareness",
  "lifelong_culture",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE115_LEARNING_PATHWAYS = [
  "Executive Leadership",
  "Support Excellence",
  "Companion Adoption",
  "Security Awareness",
  "Governance Excellence",
  "Commerce Excellence",
  "Growth Partner",
  "Department-Specific",
  "New Employee Onboarding",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE115_COMPANION_COACHING = [
  "🌹 You are making thoughtful progress — shall we review the next module when you are ready?",
  "🦉 A Knowledge Center guide might help with this topic — would you like a link?",
  "🔔 This area is new for many teams — a short refresher could build confidence.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE115_SELF_LOVE_PRACTICES = [
  "Healthy pacing — no guilt for incomplete modules",
  "Reflection moments between sessions",
  "Progress recognition without perfection pressure",
  "Mistakes are opportunities — retakes normalized",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE115_LIMITATION_FORBIDDEN = [
  "Duplicating Learning Engine customer_learning_memory",
  "Duplicating A.36 training_assessments RPCs",
  "Hidden employee scoring or punitive wellbeing surveillance",
  "Storing raw chat, assessment answers, or PII",
  "Pressure framing — mandatory guilt or perfection demands",
] as const;

export function getImplementationBlueprintPhase115Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE115_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE115_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE115_ABOS_PRINCIPLE,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE115_VISION,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE115_OBJECTIVE_KEYS,
    learningPathways: IMPLEMENTATION_BLUEPRINT_PHASE115_LEARNING_PATHWAYS,
    companionCoaching: IMPLEMENTATION_BLUEPRINT_PHASE115_COMPANION_COACHING,
    selfLovePractices: IMPLEMENTATION_BLUEPRINT_PHASE115_SELF_LOVE_PRACTICES,
    limitationForbidden: IMPLEMENTATION_BLUEPRINT_PHASE115_LIMITATION_FORBIDDEN,
    engineRoute: "/app/aipify-university",
    enginePhase: "Repo Phase 115 Aipify University Engine",
    blueprintPhase: "Phase 115 — Aipify University & Continuous Learning Engine",
    learningEngineDistinction:
      "Learning Engine Phase 29/65 at /app/learning — operational learning memory, NOT user education",
    learningTrainingDistinction:
      "Learning & Training A.36 at /app/learning-training-engine — formal talent development paths",
    certificationDistinction:
      "Certification & Achievement A.37 at /app/certification-achievement-engine — internal certs cross-link",
  };
}
