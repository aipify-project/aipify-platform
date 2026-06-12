/** Legacy Engine — organizational wisdom and storytelling language (Phase A.86). */

export const LEGACY_ENGINE_MISSION =
  "Protect organizational wisdom for future employees, customers, and leaders.";

export const LEGACY_ENGINE_ABOS_PRINCIPLE = "Remembering why progress mattered.";

export const LEGACY_ENGINE_PHILOSOPHY =
  "Organizations are stories — lessons, challenges, innovations, and support form legacy.";

export const LEGACY_ENGINE_VISION = "We built something meaningful.";

export const LEGACY_ENGINE_DISTINCTION =
  "Distinct from Organizational Memory A.34, OME Phase 50, and Impact Engine A.85 — storytelling, milestone recognition, wisdom preservation.";

export const LEGACY_DIMENSIONS = [
  {
    key: "knowledge",
    label: "Knowledge legacy",
    bullets: [
      "Processes evolved and lessons captured for future teams",
      "Knowledge Center origins and articles that changed how work gets done",
      "Approved learning that improved quality over time",
    ],
  },
  {
    key: "people",
    label: "People legacy",
    bullets: [
      "Teams who built sustainable rhythms and supported each other",
      "Leaders who modeled curiosity, humility, and human-centered decisions",
      "Collaboration patterns worth passing to new employees",
    ],
  },
  {
    key: "customer",
    label: "Customer legacy",
    bullets: [
      "Customer feedback that improved products and support quality",
      "Relationships strengthened through honest, helpful communication",
      "Support improvements that customers still benefit from today",
    ],
  },
  {
    key: "innovation",
    label: "Innovation legacy",
    bullets: [
      "Experiments that led to better ways of working",
      "Innovations adopted because they solved real problems",
      "Bold questions that opened new possibilities",
    ],
  },
] as const;

export const LEGACY_MILESTONE_EXAMPLES = [
  "One year of meaningful improvement — worth remembering why it mattered.",
  "10,000 thoughtful interactions — a quiet bell for sustained care.",
  "Knowledge doubled — future teams inherit what we learned.",
  "Goal achieved — pause to recognize progress, challenges, and gratitude.",
] as const;

export function getLegacyEngineMission() {
  return LEGACY_ENGINE_MISSION;
}

export function getLegacyEngineDistinction() {
  return LEGACY_ENGINE_DISTINCTION;
}

export function getLegacyDimensions() {
  return LEGACY_DIMENSIONS;
}
