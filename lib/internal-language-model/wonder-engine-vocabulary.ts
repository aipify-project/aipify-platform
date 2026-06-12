/** Wonder Engine — preserve amazement language (Phase A.88). */

export const WONDER_ENGINE_MISSION =
  "Preserve optimism, celebrate possibility, and stay connected to the excitement of building something meaningful.";

export const WONDER_ENGINE_ABOS_PRINCIPLE =
  "Efficiency builds capability; wonder preserves humanity.";

export const WONDER_ENGINE_PHILOSOPHY =
  "Progress can be inspiring — not only practical. Wonder fuels innovation and resilience; healthy possibility, not constant excitement.";

export const WONDER_ENGINE_VISION = "You did. And it has been an incredible journey.";

export const WONDER_ENGINE_DISTINCTION =
  "Distinct from Impact Engine A.85 (outcome measurement), Legacy Engine A.86 (story preservation), Curiosity & Discovery A.87 (exploration prompts), Humor/Playful bell (light humor), and Growth & Evolution A.81 (growth orchestration). Wonder = possibility, authentic amazement, reflection prompts, emotional appreciation.";

export const WONDER_MOMENT_TYPES = [
  { key: "milestone", label: "Milestone" },
  { key: "challenge_overcome", label: "Challenge overcome" },
  { key: "customer_impact", label: "Customer impact" },
  { key: "team_extraordinary", label: "Team extraordinary" },
  { key: "vision_becoming_reality", label: "Vision becoming reality" },
] as const;

export const WONDER_REFLECTION_PROMPTS = [
  "Five years ago, would you have believed you would be here today?",
  "Take a moment to appreciate how far you have come — not only what remains.",
  "Which small decisions along the way made the biggest difference?",
  "What once felt impossible is now part of how you work — what changed?",
] as const;

export const WONDER_BOUNDARIES_SHOULD_AVOID = [
  "Excessive praise that feels unearned",
  "Empty motivation without substance",
  "Manufactured emotion or forced enthusiasm",
  "Constant celebration that dilutes meaning",
  "Praise that obscures real challenges still ahead",
] as const;

export function getWonderEngineMission() {
  return WONDER_ENGINE_MISSION;
}

export function getWonderEnginePhilosophy() {
  return WONDER_ENGINE_PHILOSOPHY;
}
