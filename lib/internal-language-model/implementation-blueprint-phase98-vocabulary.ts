export const IMPLEMENTATION_BLUEPRINT_PHASE98_MISSION =
  "Deploy and use Aipify responsibly — ethical awareness, human oversight, and governance that scales with capability.";

export const IMPLEMENTATION_BLUEPRINT_PHASE98_PHILOSOPHY =
  "Technology serves people. More capability requires more stewardship. Ethics by design — not as an afterthought.";

export const IMPLEMENTATION_BLUEPRINT_PHASE98_VISION =
  "We trust Aipify because we understand it, govern it thoughtfully, and use it in ways that reflect our values.";

export const IMPLEMENTATION_BLUEPRINT_PHASE98_ABOS_PRINCIPLE =
  "The future depends on the wisdom of how people choose to use intelligent systems — Aipify Business Operating System (ABOS) earns trust through transparent governance, human agency, and values-aligned deployment.";

export const IMPLEMENTATION_BLUEPRINT_PHASE98_OBJECTIVE_KEYS = [
  "responsible_aipify_practices",
  "human_oversight",
  "governance_transparency",
  "values_aligned_deployment",
  "ethical_review_practices",
  "trust_stewardship",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE98_ETHICAL_QUESTIONS = [
  "🦉 Are we deploying Aipify in ways that support human judgment — not replace it?",
  "🌹 Does our use of Aipify increase trust — explainable, optional, honest about uncertainty?",
  "❤️ Does our governance respect dignity and autonomy — can people decline without friction?",
  "🔔 What unintended consequences might emerge — hidden automation, surveillance feel, accountability gaps?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE98_HUMAN_IN_THE_LOOP_KEYS = [
  "employment",
  "legal",
  "financial",
  "sensitive_comms",
  "strategic",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE98_PRIVACY_NEVER = [
  "Hidden automation without disclosure",
  "Manipulation or pressure framing",
  "Surveillance of individual behavior",
  "Removing human accountability",
  "Dignity tradeoffs for efficiency",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE98_SELF_LOVE_QUOTE =
  "Technology should support humanity, not diminish it — Aipify exists to augment people, not replace their judgment or worth.";

export const IMPLEMENTATION_BLUEPRINT_PHASE98_VISION_PHRASES = [
  "We trust Aipify because we understand it, govern it thoughtfully, and use it in ways that reflect our values.",
  "Technology serves people — more capability requires more stewardship.",
  "Humans decide — Aipify informs, prepares, and explains.",
  "Ethics by design — not as an afterthought.",
] as const;

export function getImplementationBlueprintPhase98Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE98_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE98_PHILOSOPHY,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE98_VISION,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE98_ABOS_PRINCIPLE,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE98_OBJECTIVE_KEYS,
    ethicalQuestions: IMPLEMENTATION_BLUEPRINT_PHASE98_ETHICAL_QUESTIONS,
    humanInTheLoopKeys: IMPLEMENTATION_BLUEPRINT_PHASE98_HUMAN_IN_THE_LOOP_KEYS,
    privacyNever: IMPLEMENTATION_BLUEPRINT_PHASE98_PRIVACY_NEVER,
    selfLoveQuote: IMPLEMENTATION_BLUEPRINT_PHASE98_SELF_LOVE_QUOTE,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE98_VISION_PHRASES,
    engineRoute: "/app/ai-ethics-responsible-use-engine",
    enginePhase: "A.46",
    blueprintPhase: "Phase 98 — Trust, Ethics & Human Governance Engine",
    phase54BlueprintPhase: "Phase 54 — Ethics, Safety & Companion Governance Engine",
    phase65BlueprintPhase: "Phase 65 — Companion Evolution Council Engine",
    constitutionRoute: "/app/constitution",
    constitutionDistinction:
      "Aipify Constitution & Core Principles repo Phase 98 at /app/constitution — cross-link only, never duplicate constitution tables.",
    governancePolicyRoute: "/app/governance-policy-engine",
    trustActionsRoute: "/app/approvals",
    trustEngineRoute: "/app/trust",
    purposeValuesRoute: "/app/purpose-values-engine",
    purposeValuesBlueprintPhase: 95,
  };
}
