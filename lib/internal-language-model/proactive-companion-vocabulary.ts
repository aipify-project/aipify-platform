/** Proactive Companion Engine — assistance categories and companion style (Phase A.79). */

export const PROACTIVE_COMPANION_MISSION =
  "Deliver timely, relevant, responsible proactive assistance before things become urgent.";

export const PROACTIVE_COMPANION_ABOS_PRINCIPLE =
  "Assistance augments people — Aipify informs and prepares; humans decide.";

export const PROACTIVE_COMPANION_ASSISTANCE_CATEGORIES = [
  {
    key: "operational",
    label: "Operational",
    description: "Workflow readiness, task follow-ups, and operational checkpoints before deadlines.",
  },
  {
    key: "support",
    label: "Support",
    description: "Queue awareness, escalation readiness, and customer response preparation.",
  },
  {
    key: "knowledge",
    label: "Knowledge",
    description: "Approved knowledge gaps, documentation updates, and learning opportunities.",
  },
  {
    key: "executive",
    label: "Executive",
    description: "Briefing preparation, decision context, and strategic alignment reminders.",
  },
  {
    key: "team_awareness",
    label: "Team awareness",
    description: "Shared context and coordination cues — never colleague surveillance.",
  },
] as const;

export type ProactiveCompanionCategoryKey =
  (typeof PROACTIVE_COMPANION_ASSISTANCE_CATEGORIES)[number]["key"];

export const COMPANION_STYLE_EXAMPLES = [
  {
    style: "supportive" as const,
    example: "When you have a moment, three support items may benefit from review.",
  },
  {
    style: "supportive" as const,
    example: "Your weekly briefing is ready — would you like a summary before your meeting?",
  },
  {
    style: "balanced" as const,
    example: "Two operational nudges are pending. Review when convenient.",
  },
  {
    style: "minimal" as const,
    example: "1 approval pending.",
  },
] as const;

export const PROACTIVE_COMPANION_BOUNDARIES = [
  "No anxiety-inducing urgency language",
  "No notification flooding — daily caps and quiet hours respected",
  "No surveillance — metadata summaries only, never keystrokes or colleague monitoring",
  "Human control — nudges suggest; users dismiss, snooze, or act",
  "Self Love monitors fatigue — reduces frequency when overload signals appear",
] as const;

export const PROACTIVE_COMPANION_DISTINCTION =
  "Distinct from Companion Presence (A.67 — floating orb) and ILM proactive guidance (assistant language patterns).";

export function getProactiveCompanionCategories() {
  return PROACTIVE_COMPANION_ASSISTANCE_CATEGORIES;
}

export function getCompanionStyleExamples() {
  return COMPANION_STYLE_EXAMPLES;
}

export function getProactiveCompanionBoundaries() {
  return PROACTIVE_COMPANION_BOUNDARIES;
}
