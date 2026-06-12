/** Growth & Evolution Engine — ABOS growth orchestration vocabulary (Phase A.81). */

export const GROWTH_EVOLUTION_MISSION =
  "Guide sustainable organizational growth through continuous learning, adaptation, and improvement.";

export const GROWTH_EVOLUTION_PHILOSOPHY =
  "Growth means becoming better — not just doing more. Learn thoughtfully, improve responsibly, adapt strategically, celebrate progress.";

export const GROWTH_EVOLUTION_ABOS_PRINCIPLE =
  "Success is the ongoing ability to learn, adapt, and improve — not a destination. Aipify orchestrates growth; humans decide.";

export const GROWTH_EVOLUTION_VISION =
  "A companion helping organizations evolve healthier — progress not perfection. A little better every day.";

export const GROWTH_EVOLUTION_DISTINCTION =
  "Distinct from Evolution Governance (Phase 84), Capability Maturity (A.57), Organizational Health (A.56), and Learning Engine customer memory.";

export const GROWTH_DIMENSIONS = [
  {
    key: "operational",
    label: "Operational",
    description: "Process efficiency, workflow maturity, and operational resilience.",
    examples: [
      "Reduce recurring bottlenecks in support triage",
      "Strengthen handoffs between teams",
      "Improve response-time consistency without burnout",
    ],
  },
  {
    key: "knowledge",
    label: "Knowledge",
    description: "Learning assets, documentation quality, and institutional memory.",
    examples: [
      "Close approved knowledge gaps from support patterns",
      "Refresh onboarding paths after process changes",
      "Capture lessons from completed improvements",
    ],
  },
  {
    key: "human",
    label: "Human",
    description: "Skills, wellbeing, collaboration, and sustainable capacity.",
    examples: [
      "Balance ambition with wellbeing during growth pushes",
      "Develop cross-functional capabilities",
      "Celebrate progress without pressure or guilt",
    ],
  },
  {
    key: "customer",
    label: "Customer",
    description: "Experience quality, satisfaction trends, and value delivery.",
    examples: [
      "Improve first-response quality on high-volume topics",
      "Align service levels with customer expectations",
      "Act on satisfaction trends with transparent trade-offs",
    ],
  },
  {
    key: "strategic",
    label: "Strategic",
    description: "Long-term direction, alignment, and intentional evolution.",
    examples: [
      "Align initiatives with stated strategic priorities",
      "Evaluate emerging opportunities with evidence",
      "Adapt plans responsibly when context shifts",
    ],
  },
] as const;

export type GrowthDimensionKey = (typeof GROWTH_DIMENSIONS)[number]["key"];

export const LEARNING_CYCLE_STEPS = [
  { step: 1, key: "observe", label: "Observe", description: "Notice patterns, signals, and context." },
  { step: 2, key: "understand", label: "Understand", description: "Interpret signals with evidence." },
  { step: 3, key: "improve", label: "Improve", description: "Identify thoughtful improvements with trade-offs." },
  { step: 4, key: "implement", label: "Implement", description: "Execute inside approved limits." },
  { step: 5, key: "measure", label: "Measure", description: "Track outcomes with metadata only." },
  { step: 6, key: "learn", label: "Learn", description: "Capture lessons for the next cycle." },
  { step: 7, key: "repeat", label: "Repeat", description: "Continue — progress, not perfection." },
] as const;

export const EVOLUTION_CAPABILITIES = [
  {
    key: "improvement_patterns",
    label: "Detect improvement patterns",
    examplePhrases: [
      "Aipify noticed a consistent improvement in response preparation.",
      "This workflow shows a repeatable pattern worth reinforcing.",
    ],
  },
  {
    key: "stagnation_risks",
    label: "Stagnation risks",
    examplePhrases: [
      "This area has not shown improvement over recent cycles.",
      "Stagnation risk detected — review when convenient, no pressure.",
    ],
  },
  {
    key: "emerging_opportunities",
    label: "Emerging opportunities",
    examplePhrases: [
      "An emerging opportunity aligns with your strategic focus.",
      "Trend data suggests a thoughtful expansion may be worth exploring.",
    ],
  },
  {
    key: "capability_development",
    label: "Capability development",
    examplePhrases: [
      "Developing this capability could strengthen operational resilience.",
      "Cross-training here may reduce single-point dependencies.",
    ],
  },
  {
    key: "healthy_adaptation",
    label: "Healthy adaptation",
    examplePhrases: [
      "Context has shifted — Aipify recommends a measured adaptation.",
      "A small adjustment now may prevent larger disruption later.",
    ],
  },
] as const;

export const GROWTH_EVOLUTION_SELF_LOVE_NOTE =
  "Self Love integration: sustainable growth, reflection, celebrate progress, detect stress, balance ambition and wellbeing.";

export const GROWTH_EVOLUTION_PROACTIVE_COMPANION_NOTE =
  "Proactive Companion (A.79) may surface growth opportunities proactively — this engine governs growth orchestration and learning cycles.";

export const GROWTH_EVOLUTION_TRUST_NOTE =
  "Trust Engine connection: every recommendation includes evidence, trade-offs, and risks — transparent and auditable.";

export function getGrowthDimensions() {
  return GROWTH_DIMENSIONS;
}

export function getLearningCycleSteps() {
  return LEARNING_CYCLE_STEPS;
}

export function getEvolutionCapabilities() {
  return EVOLUTION_CAPABILITIES;
}
