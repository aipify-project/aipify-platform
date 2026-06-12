/** Priority & Focus Engine — dimensions, levels, and focus support (Phase A.80). */

export const PRIORITY_FOCUS_MISSION =
  "Transform overwhelming workloads into clear priorities supporting organizational success and human wellbeing.";

export const PRIORITY_FOCUS_ABOS_PRINCIPLE =
  "Operations augments people — Aipify clarifies priorities and prepares focus; humans decide.";

export const PRIORITY_FOCUS_DIMENSIONS = [
  {
    key: "operational",
    label: "Operational",
    description: "Day-to-day workflows, approvals, and operational readiness that keep the organization running.",
  },
  {
    key: "strategic",
    label: "Strategic",
    description: "Longer-horizon initiatives, alignment, and decisions that shape organizational direction.",
  },
  {
    key: "human",
    label: "Human",
    description: "People wellbeing, capacity, and sustainable pace — never pressure or guilt.",
  },
  {
    key: "knowledge",
    label: "Knowledge",
    description: "Approved documentation, learning gaps, and knowledge readiness across teams.",
  },
  {
    key: "relationship",
    label: "Relationship",
    description: "Customer, partner, and team relationship context — coordination without surveillance.",
  },
] as const;

export type PriorityFocusDimensionKey = (typeof PRIORITY_FOCUS_DIMENSIONS)[number]["key"];

export const PRIORITY_FOCUS_LEVELS = [
  { level: 1, code: "P1", label: "Critical", description: "Requires attention soon — organizational impact if delayed." },
  { level: 2, code: "P2", label: "Important", description: "Significant value — schedule deliberately without urgency pressure." },
  { level: 3, code: "P3", label: "Planned", description: "Scheduled work that supports steady progress." },
  { level: 4, code: "P4", label: "Optional", description: "Nice-to-have improvements — safe to defer when capacity is limited." },
] as const;

export const PRIORITY_FOCUS_SUPPORT = [
  "Clarity over volume — fewer priorities with clear levels beat long undifferentiated lists",
  "Human wellbeing first — capacity and rest are valid inputs to prioritization",
  "Gentle focus cues — suggest where attention may help; never shame or guilt",
  "Integration-aware — links to tasks, OKRs, capacity, and executive insights for context",
  "Self Love monitors overload — may soften recommendations when fatigue signals appear",
] as const;

export const PROACTIVE_COMPANION_PRIORITY_EXAMPLES = [
  { example: "You have two P1 operational items — would you like a calm summary before your next meeting?" },
  { example: "Strategic review window opens tomorrow — P2 items are ready when you have capacity." },
  { example: "Human dimension note: workload signals suggest protecting focus time this afternoon." },
  { example: "Knowledge dimension: one approved article review aligns with your P3 planned list." },
] as const;

export const PRIORITY_FOCUS_DISTINCTION =
  "Distinct from TAG Phase 37 (personal focus at /app/assistant/attention) and Goals & OKR A.65 (objectives/key results).";

export function getPriorityFocusDimensions() {
  return PRIORITY_FOCUS_DIMENSIONS;
}

export function getPriorityFocusLevels() {
  return PRIORITY_FOCUS_LEVELS;
}

export function getPriorityFocusSupport() {
  return PRIORITY_FOCUS_SUPPORT;
}

export function getProactiveCompanionPriorityExamples() {
  return PROACTIVE_COMPANION_PRIORITY_EXAMPLES;
}
