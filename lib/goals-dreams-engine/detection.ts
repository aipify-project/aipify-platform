import type { GoalCategory, GoalTimeframe } from "./dimensions";
import type { GoalDetection, GoalDraft } from "./types";

const GOAL_PATTERNS = [
  /\bi want to\b/i,
  /\bi'd like to\b/i,
  /\bi would love to\b/i,
  /\bi've always dreamed\b/i,
  /\bi should probably\b/i,
  /\bi really want to\b/i,
  /\bmy goal is\b/i,
  /\bhelp me (achieve|reach|work toward)\b/i,
  /\bget healthier\b/i,
  /\bsave more money\b/i,
  /\bstart my own (company|business)\b/i,
  /\bspend more time with\b/i,
  /\blearn a new language\b/i,
  /\blaunch my own\b/i,
];

const VAGUE_HEALTH = /\b(get healthier|be healthier|improve my health)\b/i;
const VAGUE_FINANCIAL = /\b(save more|save money|financial freedom)\b/i;
const VAGUE_FAMILY = /\bspend more time with (my )?(family|kids|children|wife|husband)\b/i;

function inferCategory(message: string): GoalCategory {
  if (/healthier|health|exercise|weight|nutrition|sleep|stress/i.test(message)) return "health";
  if (/save|money|debt|fund|retirement|financial/i.test(message)) return "financial";
  if (/promotion|business|company|career|launch|product|network/i.test(message)) return "career";
  if (/family|kids|children|wife|husband|quality time|present/i.test(message)) return "family";
  if (/learn|language|course|study|certification|education/i.test(message)) return "education";
  if (/travel|hobby|volunteer|screen time|declutter|lifestyle/i.test(message)) return "lifestyle";
  if (/read|skill|routine|habit|develop/i.test(message)) return "personal_development";
  return "personal_development";
}

function inferTimeframe(message: string): GoalTimeframe {
  if (/this year|within a year|short.?term|next few months/i.test(message)) return "short_term";
  if (/lifelong|always|rest of my life|life aspiration/i.test(message)) return "lifelong";
  if (/five years|long.?term|eventually|someday/i.test(message)) return "long_term";
  return "medium_term";
}

function buildTitle(message: string): string {
  const trimmed = message.trim();
  const cleaned = trimmed
    .replace(/^i want to\s+/i, "")
    .replace(/^i'd like to\s+/i, "")
    .replace(/^i would love to\s+/i, "")
    .replace(/^i really want to\s+/i, "")
    .replace(/^i should probably\s+/i, "");
  if (cleaned.length <= 80) return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return `${cleaned.slice(0, 77)}…`;
}

function healthClarification(): GoalDetection {
  return {
    detected: true,
    draft: {
      title: "Get healthier",
      description: "Personal health improvement",
      why_matters: "",
      category: "health",
      timeframe: "medium_term",
      needs_clarification: true,
      clarification_question: "What would healthier look like for you?",
      clarification_options: [
        "Exercise more",
        "Lose weight",
        "Improve sleep",
        "Reduce stress",
        "Improve nutrition",
      ],
    },
    prompt: "What would healthier look like for you?",
    follow_up_options: [
      "Exercise more",
      "Lose weight",
      "Improve sleep",
      "Reduce stress",
      "Improve nutrition",
    ],
  };
}

export function detectGoalIntent(message: string): GoalDetection | null {
  const trimmed = message.trim();
  if (!trimmed) return null;

  const matchesGoal = GOAL_PATTERNS.some((p) => p.test(trimmed));
  if (!matchesGoal) return null;

  if (VAGUE_HEALTH.test(trimmed)) return healthClarification();

  const category = inferCategory(trimmed);
  const timeframe = inferTimeframe(trimmed);
  const title = buildTitle(trimmed);

  const draft: GoalDraft = {
    title,
    description: trimmed,
    why_matters: "",
    category,
    timeframe,
    needs_clarification: false,
  };

  if (VAGUE_FINANCIAL.test(trimmed)) {
    draft.needs_clarification = true;
    draft.clarification_question = "What would saving more look like for you — a specific amount or a habit?";
    draft.clarification_options = ["Emergency fund", "Monthly savings target", "Pay down debt", "Big purchase"];
  }

  if (VAGUE_FAMILY.test(trimmed)) {
    draft.needs_clarification = true;
    draft.clarification_question = "What kind of quality time matters most to you?";
    draft.clarification_options = [
      "Weekly family activities",
      "Device-free evenings",
      "Regular traditions",
      "One-on-one time",
    ];
  }

  const prompt = draft.needs_clarification && draft.clarification_question
    ? draft.clarification_question
    : `I'd love to support you with "${title}". Would you like me to create this goal and break it into manageable milestones?`;

  return {
    detected: true,
    draft,
    prompt,
    follow_up_options: draft.clarification_options ?? [
      "Yes, create this goal",
      "Add why it matters first",
      "Not now",
    ],
  };
}

export function goalDraftFromClarification(
  base: GoalDraft,
  clarification: string
): GoalDraft {
  return {
    ...base,
    title: `${base.title}: ${clarification}`,
    description: `${base.description} — ${clarification}`,
    needs_clarification: false,
    clarification_question: undefined,
    clarification_options: undefined,
  };
}
