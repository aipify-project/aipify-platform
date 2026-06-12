export const IMPLEMENTATION_BLUEPRINT_PHASE46_MISSION =
  "Develop competent professionals — training strengthens confidence; certification reflects genuine competence.";

export const IMPLEMENTATION_BLUEPRINT_PHASE46_PHILOSOPHY =
  "Assessment encourages growth, not fear. Mastery not exclusion. Field enablement supports excellence at a sustainable pace.";

export const IMPLEMENTATION_BLUEPRINT_PHASE46_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) partners grow through genuine capability — certification means readiness to help organizations work smarter.";

export const IMPLEMENTATION_BLUEPRINT_PHASE46_TRAINING_MODULE_KEYS = [
  "introduction",
  "ethical_sales",
  "discovery",
  "demonstrations",
  "implementation",
  "customer_success",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE46_SIMULATION_SCENARIO_KEYS = [
  "cold_conversation",
  "discovery",
  "demo",
  "objections",
  "renewal",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE46_TELEPHONE_STEP_KEYS = [
  "intro",
  "curiosity_discovery",
  "opportunities",
  "demo_invitation",
  "next_steps",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE46_CERTIFICATION_TIER_KEYS = [
  "certified_sales_representative",
  "sales_expert",
  "elite_sales_expert",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE46_ASSESSMENT_DIMENSION_KEYS = [
  "product_understanding",
  "communication",
  "ethical_judgment",
  "customer_focus",
  "demo_readiness",
] as const;

export function getImplementationBlueprintPhase46Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE46_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE46_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE46_ABOS_PRINCIPLE,
    trainingModuleKeys: IMPLEMENTATION_BLUEPRINT_PHASE46_TRAINING_MODULE_KEYS,
    simulationScenarioKeys: IMPLEMENTATION_BLUEPRINT_PHASE46_SIMULATION_SCENARIO_KEYS,
    telephoneStepKeys: IMPLEMENTATION_BLUEPRINT_PHASE46_TELEPHONE_STEP_KEYS,
    certificationTierKeys: IMPLEMENTATION_BLUEPRINT_PHASE46_CERTIFICATION_TIER_KEYS,
    assessmentDimensionKeys: IMPLEMENTATION_BLUEPRINT_PHASE46_ASSESSMENT_DIMENSION_KEYS,
    engineRoute: "/app/sales-expert-engine",
    enginePhase: "A.95",
    blueprintPhase: "Phase 46 — Sales Coach Certification & Field Enablement Engine",
    certificationRoute: "/app/certification-achievement-engine",
    certificationPhase: "A.37",
    learningTrainingRoute: "/app/learning-training-engine",
    learningTrainingPhase: "A.36",
    partnerCertificationRoute: "/app/partners",
    partnerCertificationPhase: 91,
    coachEnablementPhase: 45,
    performanceRecognitionPhase: 41,
    selfLoveRoute: "/app/self-love-engine",
    selfLovePhase: "A.76",
    simulationLabRoute: "/app/simulations",
    maxAttemptsBeforeReview: 3,
    distinctionNote:
      "Distinct from Coach Phase 45 and Performance Phase 41 — Phase 46 is certification pathway and field enablement within /app/sales-expert-engine Certification tab.",
    emailBoundary: "NO mass unsolicited outreach — one-to-one email enablement only.",
  };
}
