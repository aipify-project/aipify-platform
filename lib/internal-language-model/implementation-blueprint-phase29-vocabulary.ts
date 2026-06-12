export const IMPLEMENTATION_BLUEPRINT_PHASE29_MISSION =
  "Reduce onboarding friction by safely analyzing connected systems and recommending tailored configurations.";

export const IMPLEMENTATION_BLUEPRINT_PHASE29_PHILOSOPHY =
  "Aipify should adapt to organizations — discovery should reduce complexity, not create it.";

export const IMPLEMENTATION_BLUEPRINT_PHASE29_ABOS_PRINCIPLE =
  "Understanding creates relevance — the more appropriately Aipify understands an organization, the more effectively it can assist.";

export const IMPLEMENTATION_BLUEPRINT_PHASE29_HUMAN_APPROVAL =
  "Recommend, analyze, suggest — never modify systems, access restricted data, or activate capabilities without explicit approval.";

export const IMPLEMENTATION_BLUEPRINT_PHASE29_VISION_PHRASES = [
  "It already knows how we work.",
  "Not because Aipify guessed — because it listened responsibly.",
  "Discovery reduced complexity instead of creating it.",
  "We understood recommendations before we activated anything.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE29_COMPANION_EXAMPLES = [
  "🌹 Your organization appears to rely heavily on support workflows. Aipify Support may be valuable.",
  "🦉 Several disconnected knowledge sources have been identified.",
  "🔔 An onboarding milestone has been completed.",
  "❤️ You have made excellent progress configuring Aipify.",
] as const;

export function getImplementationBlueprintPhase29Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE29_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE29_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE29_ABOS_PRINCIPLE,
    humanApproval: IMPLEMENTATION_BLUEPRINT_PHASE29_HUMAN_APPROVAL,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE29_VISION_PHRASES,
    companionExamples: IMPLEMENTATION_BLUEPRINT_PHASE29_COMPANION_EXAMPLES,
    engineRoute: "/app/aipify-install-engine",
    enginePhase: "A.22",
    blueprintPhase: "Phase 29 — AI Install & Discovery Engine",
    embeddedRuntime: "/api/install/*, /api/embed/*, /app/install",
    phase28Distinction:
      "Onboarding & Success Blueprint Phase 28 at /app/customer-onboarding-engine — journey framing; Phase 29 focuses on environment discovery on A.22",
    curiosityDistinction:
      "Curiosity & Discovery A.87 — question-led culture; not environment scan",
    selfLoveBoundary: "Self Love is a principle — not a product toggle. No ™ in product copy.",
  };
}
