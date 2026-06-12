export const IMPLEMENTATION_BLUEPRINT_PHASE32_MISSION =
  "Accelerate adoption and increase relevance by providing industry-specific solutions built upon the Aipify foundation.";

export const IMPLEMENTATION_BLUEPRINT_PHASE32_PHILOSOPHY =
  "Every organization is unique — many industries share common challenges. Aipify balances flexibility with specialization.";

export const IMPLEMENTATION_BLUEPRINT_PHASE32_ABOS_PRINCIPLE =
  "Organizations benefit when technology understands their world. Specialization should increase value without sacrificing flexibility.";

export const IMPLEMENTATION_BLUEPRINT_PHASE32_INDUSTRY_PACK_KEYS = [
  "commerce",
  "healthcare",
  "professional_services",
  "hospitality",
  "community_platform",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE32_VISION_PHRASES = [
  "We know how to succeed in our industry with Aipify.",
  "Meaningful guidance begins with understanding context.",
  "Specialization increases value without sacrificing flexibility.",
  "Technology understands our world — customization remains possible.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE32_COMPANION_EXAMPLES = [
  "🌹 This recommendation reflects common practices within your industry.",
  "🦉 Organizations similar to yours often approach this differently.",
  "🔔 An industry milestone has been achieved.",
] as const;

export function getImplementationBlueprintPhase32Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE32_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE32_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE32_ABOS_PRINCIPLE,
    industryPackKeys: IMPLEMENTATION_BLUEPRINT_PHASE32_INDUSTRY_PACK_KEYS,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE32_VISION_PHRASES,
    companionExamples: IMPLEMENTATION_BLUEPRINT_PHASE32_COMPANION_EXAMPLES,
    engineRoute: "/app/industry-intelligence-foundation-engine",
    enginePhase: "A.44",
    blueprintPhase: "Phase 32 — Industry Solutions Engine",
    businessPacksRoute: "/app/business-packs-foundation-engine",
    industryBlueprintsRoute: "/app/industry-blueprints",
    knowledgeCenterRoute: "/app/knowledge-center-engine",
    unonightPilot: "First external pilot — commerce industry solutions",
    selfLoveBoundary: "Self Love is a principle — specialization without pressure. No ™ in product copy.",
  };
}
