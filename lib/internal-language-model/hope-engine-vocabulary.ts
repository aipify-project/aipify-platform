/** Hope Engine — realistic encouragement language (Phase A.92). */

export const HOPE_ENGINE_MISSION =
  "Maintain perspective, confidence, and motivation during uncertainty and difficulty — balanced optimism that supports resilience and action.";

export const HOPE_ENGINE_ABOS_PRINCIPLE =
  "Sometimes people need reassurance that their effort still matters — hope inspires action, not passivity.";

export const HOPE_ENGINE_PHILOSOPHY =
  "Hope is not blind optimism — acknowledge difficulty while improvement remains possible; realistic encouragement during demanding times.";

export const HOPE_ENGINE_VISION =
  "Setbacks feel temporary; growth remains possible — leave people feeling capable of the next step.";

export const HOPE_ENGINE_DISTINCTION =
  "Distinct from Wonder Engine A.88 (amazement), Presence & Comfort A.90 (emotional reassurance), Dedication A.91 (persistent follow-through), Organizational Resilience A.50 (crisis continuity), and Growth & Evolution A.81 (learning orchestration). Hope = realistic encouragement and balanced optimism during difficulty.";

export const WHEN_HOPE_MATTERS = [
  { key: "change", label: "Organizational change" },
  { key: "setback", label: "Setback" },
  { key: "demanding_project", label: "Demanding project" },
  { key: "failed_attempt", label: "Failed attempt" },
  { key: "uncertainty", label: "Uncertainty" },
  { key: "invisible_progress", label: "Invisible progress" },
  { key: "personal_challenge", label: "Personal challenge" },
] as const;

export const HOPE_COMMUNICATION_PHRASES = [
  "What you are building takes time — the effort you put in still matters.",
  "This is hard, and you are making progress even when it is not visible yet.",
  "Setbacks are part of the journey — what you learn here can still move you forward.",
  "One thoughtful next step is enough for today.",
  "Improvement is still possible — focus on what you can influence next.",
  "You do not have to solve everything at once to be moving in a good direction.",
] as const;

export const HOPE_BOUNDARY_PHRASES = {
  avoid: [
    "Everything will be fine",
    "It will definitely work out",
    "Just stay positive — nothing to worry about",
    "Unrealistic promises about outcomes or timelines",
    "Minimizing genuine difficulty or loss",
    "Empty cheerleading without acknowledging the challenge",
  ],
  prefer: [
    "This is difficult, and your effort still matters",
    "Improvement remains possible — one step at a time",
    "Setbacks are temporary; growth is still ahead",
    "What you can influence next is enough for now",
    "Progress may be quiet — that does not mean it is absent",
    "Hope supports action — not waiting for things to fix themselves",
  ],
} as const;

export function getHopeEngineMission() {
  return HOPE_ENGINE_MISSION;
}

export function getHopeEnginePhilosophy() {
  return HOPE_ENGINE_PHILOSOPHY;
}
