export const IMPLEMENTATION_BLUEPRINT_PHASE93_MISSION =
  "Identify emerging capability needs and create adaptive learning experiences for long-term success.";

export const IMPLEMENTATION_BLUEPRINT_PHASE93_PHILOSOPHY =
  "Learning happens daily through work — capture and cultivate intentionally.";

export const IMPLEMENTATION_BLUEPRINT_PHASE93_ABOS_PRINCIPLE =
  "Organizations that learn fastest thrive — not necessarily those with greatest resources.";

export const IMPLEMENTATION_BLUEPRINT_PHASE93_OBJECTIVE_KEYS = [
  "capability_needs_detection",
  "adaptive_experiences",
  "intentional_capture",
  "organizational_capability",
  "empowerment_not_surveillance",
  "sustained_success",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE93_LEARNING_SIGNAL_KEYS = [
  "support_requests",
  "mistakes_corrections",
  "strategic_initiatives",
  "new_technology",
  "sales_expert_observations",
  "customer_feedback_trends",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE93_ADAPTIVE_PATHWAY_KEYS = [
  "micro_learning",
  "kc_recommendations",
  "companion_guided_coaching",
  "peer_learning",
  "simulation_based",
  "leadership_pathways",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE93_CAPABILITY_QUESTIONS = [
  "🦉 What capability gaps are emerging from daily work?",
  "🌹 What learning progress deserves recognition?",
  "❤️ How can learning feel empowering rather than mandatory?",
  "🔔 What adaptive pathways would strengthen organizational capability?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE93_COMPANION_GUIDANCE_EXAMPLES = [
  "🦉 A recurring support theme may indicate a capability gap — would reviewing related Knowledge Center articles feel helpful?",
  "🌹 Recent learning approvals suggest growing organizational capability — shall I highlight progress worth recognizing?",
  "🔔 A simulation scenario may help practice a new workflow — would exploring it at your own pace feel supportive?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE93_PRIVACY_LIMITATIONS = [
  "No surveillance-based mandatory learning",
  "No hidden evaluations or individual capability scoring",
  "No public ranking or leaderboard framing",
  "No punishment framing for mistakes or incomplete learning",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE93_VISION =
  "I am continually becoming more capable because this organization encourages me to learn.";

export const IMPLEMENTATION_BLUEPRINT_PHASE93_VISION_PHRASES = [
  "I am continually becoming more capable because this organization encourages me to learn.",
  "Learning happens daily through work — capture and cultivate intentionally.",
  "Organizations that learn fastest thrive — not necessarily those with greatest resources.",
  "Empowerment not control — voluntary, transparent adaptive learning.",
  "Growth not compliance — Companion scaffolds pathways; humans decide.",
] as const;

export function getImplementationBlueprintPhase93Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE93_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE93_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE93_ABOS_PRINCIPLE,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE93_OBJECTIVE_KEYS,
    learningSignalKeys: IMPLEMENTATION_BLUEPRINT_PHASE93_LEARNING_SIGNAL_KEYS,
    adaptivePathwayKeys: IMPLEMENTATION_BLUEPRINT_PHASE93_ADAPTIVE_PATHWAY_KEYS,
    capabilityQuestions: IMPLEMENTATION_BLUEPRINT_PHASE93_CAPABILITY_QUESTIONS,
    companionGuidanceExamples: IMPLEMENTATION_BLUEPRINT_PHASE93_COMPANION_GUIDANCE_EXAMPLES,
    privacyLimitations: IMPLEMENTATION_BLUEPRINT_PHASE93_PRIVACY_LIMITATIONS,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE93_VISION,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE93_VISION_PHRASES,
    engineRoute: "/app/learning",
    enginePhase: "Phase 65",
    reviewPhase: "Phase 29",
    blueprintPhase: "Phase 93 — Adaptive Learning & Organizational Capability Engine",
    companionGuidanceName: "Companion-guided coaching",
    notLabel: "AI coach",
    phase23Distinction:
      "Blueprint Phase 23 at same route — operational learning adaptation; Phase 93 is adaptive capability and organizational capability.",
    learningTrainingDistinction:
      "Learning & Training A.36 / Phase 92 at /app/learning-training-engine — formal talent development cross-link.",
    wisdomEngineDistinction: "Wisdom Engine A.93 at /app/wisdom-engine — repo engine phase collision only.",
    commercialDistinction: "Billing/Packaging repo Phase 93 at /app/commercial — phase number collision only.",
    empowermentNote: "Empowerment not surveillance — no mandatory tracking.",
  };
}
