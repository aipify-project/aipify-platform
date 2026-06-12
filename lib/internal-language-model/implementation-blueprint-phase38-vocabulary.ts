export const IMPLEMENTATION_BLUEPRINT_PHASE38_MISSION =
  "Structured experimentation — curiosity not recklessness. Innovation as a repeatable organizational capability.";

export const IMPLEMENTATION_BLUEPRINT_PHASE38_PHILOSOPHY =
  "Innovation without chaos — responsible creativity with accountability, visibility, and learning from every outcome.";

export const IMPLEMENTATION_BLUEPRINT_PHASE38_ABOS_PRINCIPLE =
  "Curiosity with structure — experiments teach the organization; failure defines learning, not people.";

export const IMPLEMENTATION_BLUEPRINT_PHASE38_CORE_RULE =
  "Innovation Lab validates ideas through controlled experiments — Simulation Lab predicts without acting.";

export const IMPLEMENTATION_BLUEPRINT_PHASE38_OBJECTIVE_KEYS = [
  "idea_generation",
  "experiment_tracking",
  "pilot_programs",
  "controlled_testing",
  "learning_documentation",
  "innovation_recognition",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE38_IDEA_DOMAINS = [
  "support_workflows",
  "knowledge_center",
  "customer_experience",
  "process_innovation",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE38_VISION_PHRASES = [
  "Innovation becomes a repeatable capability — not a one-off gamble.",
  "Curiosity with structure — experiments teach; failure defines learning, not people.",
  "Every team can propose improvements — visibility and governance keep innovation responsible.",
  "Pilots and sandboxes protect production while ideas earn their place.",
  "The organization grows smarter with every experiment — wins, pivots, and honest lessons alike.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE38_COMPANION_EXAMPLES = [
  "🦉 Your governance workflow experiment aligns with this quarter's operational priorities — worth advancing to pilot.",
  "🌹 Support and operations teams both submitted related workflow ideas — a joint experiment could reduce duplicate effort.",
  "🔔 The messaging tone experiment reached analysis stage — participant feedback is ready for your review.",
  "❤️ The automation discovery experiment did not meet success criteria — the lesson learned is documented and reusable.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE38_RECOGNITION_EXPERIENCES = [
  "🔔 Innovation Contributor — submitted or advanced an idea through review",
  "🌹 Collaboration Champion — enabled cross-team co-creation on experiments or pilots",
  "🦉 Insight Discovery — captured a reusable lesson from any outcome",
] as const;

export function getImplementationBlueprintPhase38Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE38_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE38_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE38_ABOS_PRINCIPLE,
    coreRule: IMPLEMENTATION_BLUEPRINT_PHASE38_CORE_RULE,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE38_OBJECTIVE_KEYS,
    ideaDomains: IMPLEMENTATION_BLUEPRINT_PHASE38_IDEA_DOMAINS,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE38_VISION_PHRASES,
    companionExamples: IMPLEMENTATION_BLUEPRINT_PHASE38_COMPANION_EXAMPLES,
    recognitionExperiences: IMPLEMENTATION_BLUEPRINT_PHASE38_RECOGNITION_EXPERIENCES,
    engineRoute: "/app/innovation-lab",
    enginePhase: "Phase 96",
    blueprintPhase: "Phase 38 — Innovation & Experimentation Lab",
    simulationDistinction:
      "Simulation Lab Phase 78 / Blueprint 22 — simulation predicts, never acts; Innovation Lab validates controlled experiments",
    organizationalMemoryDistinction:
      "Organizational Memory A.34 — learning capture and reusable insights; cross-link only",
    governanceDistinction: "Governance A.14 — experiment approvals; cross-link only",
    selfLoveBoundary:
      "Self Love supports psychological safety — principle only; Innovation Lab stores experiment metadata, not wellbeing content.",
  };
}
