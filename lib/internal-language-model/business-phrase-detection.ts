import type { BusinessPhraseIntentKey } from "./types";

export const BUSINESS_PHRASE_PATTERNS: Array<{
  pattern: RegExp;
  key: BusinessPhraseIntentKey;
  priority?: number;
}> = [
  { pattern: /\bgive me the big picture\b/i, key: "exec_big_picture", priority: 9 },
  {
    pattern: /\bwhat should i know before (?:today )?starts?\b/i,
    key: "exec_morning_briefing",
    priority: 9,
  },
  {
    pattern: /\bwhat(?:'s| is) keeping (?:this )?(?:business|us) from moving faster\b/i,
    key: "exec_bottleneck",
    priority: 9,
  },
  {
    pattern: /\banything i should be worried about\b/i,
    key: "exec_worried",
    priority: 8,
  },
  { pattern: /\bwho(?:'s| has) been waiting too long\b/i, key: "support_waiting_long", priority: 9 },
  {
    pattern: /\bwhat(?:'s| is) causing the most trouble(?: today)?\b/i,
    key: "support_most_trouble",
    priority: 9,
  },
  { pattern: /\bcan we answer (?:these|them) faster\b/i, key: "support_answer_faster", priority: 8 },
  {
    pattern: /\bshow me the angry customers?\b/i,
    key: "support_angry_customers",
    priority: 9,
  },
  { pattern: /\bwhat(?:'s| is) selling best\b/i, key: "retail_selling_best", priority: 8 },
  { pattern: /\bwhat isn(?:'t| not) moving\b/i, key: "retail_not_moving", priority: 8 },
  {
    pattern: /\bwhat should we push this week\b/i,
    key: "retail_push_week",
    priority: 8,
  },
  { pattern: /\bdo we have enough stock\b/i, key: "retail_stock", priority: 8 },
  {
    pattern: /\bare customers abandoning (?:their )?carts?\b/i,
    key: "retail_cart_abandon",
    priority: 9,
  },
  { pattern: /\bwho(?:'s| is) closest to buying\b/i, key: "sales_closest_buying", priority: 9 },
  { pattern: /\bwho has gone cold\b/i, key: "sales_gone_cold", priority: 9 },
  {
    pattern: /\bwhat opportunit(?:y|ies) are we missing\b/i,
    key: "sales_missing_opportunities",
    priority: 9,
  },
  {
    pattern: /\bwhat(?:'s| is) working\??\s*$/i,
    key: "marketing_working",
    priority: 5,
  },
  {
    pattern: /\bwhat(?:'s| is) wasting money\b/i,
    key: "marketing_wasting_money",
    priority: 8,
  },
  {
    pattern: /\bwhat should we test next\b/i,
    key: "marketing_test_next",
    priority: 8,
  },
  { pattern: /\bhave we been paid\b/i, key: "accounting_paid", priority: 9 },
  { pattern: /\bwhat(?:'s| is) overdue\b/i, key: "accounting_overdue", priority: 8 },
  {
    pattern: /\bdo we have any surprises coming\b/i,
    key: "accounting_surprises",
    priority: 9,
  },
  { pattern: /\bhow is everyone doing\b/i, key: "hr_team_status", priority: 8 },
  { pattern: /\bwho(?:'s| is) overloaded\b/i, key: "hr_overloaded", priority: 9 },
  { pattern: /\bare we on track\b/i, key: "project_on_track", priority: 8 },
  { pattern: /\bwhat(?:'s| is) blocking us\b/i, key: "project_blocking", priority: 9 },
  {
    pattern: /\bwhat slipped through the cracks\b/i,
    key: "project_slipped",
    priority: 9,
  },
  {
    pattern: /\bwhat(?:'s| is) still waiting for me\b/i,
    key: "admin_waiting",
    priority: 9,
  },
  {
    pattern: /\bwhat happened while i was away\b/i,
    key: "admin_while_away",
    priority: 9,
  },
  {
    pattern: /\bwhat(?:'s| is) my day looking like\b/i,
    key: "admin_day_looking",
    priority: 9,
  },
  { pattern: /\bhelp me get organized\b/i, key: "productivity_organized", priority: 8 },
  { pattern: /\bi(?:'m| am) drowning\b/i, key: "productivity_drowning", priority: 7 },
  { pattern: /\bwhere do i even start\b/i, key: "productivity_where_start", priority: 7 },
  { pattern: /\bwhat would you do\b/i, key: "aipify_what_would_you_do", priority: 8 },
  {
    pattern: /\bcan you take care of (?:this|that|it)\b/i,
    key: "aipify_take_care",
    priority: 8,
  },
  { pattern: /\bcan this be automated\b/i, key: "aipify_automate", priority: 9 },
  {
    pattern: /\bmake sure this doesn(?:'t| not) happen again\b/i,
    key: "aipify_prevent_repeat",
    priority: 9,
  },
  { pattern: /\bcan you help me catch up\b/i, key: "vision_catch_up", priority: 8 },
  {
    pattern: /\bdid i forget something important\b/i,
    key: "vision_forgot_important",
    priority: 8,
  },
  { pattern: /\btake a look at (?:this|that|it)\b/i, key: "vision_take_a_look", priority: 7 },
  {
    pattern: /\bcan you make sense of (?:this|that) mess\b/i,
    key: "vision_make_sense",
    priority: 8,
  },
];

export function findBusinessPhraseMatch(message: string): BusinessPhraseIntentKey | null {
  const matches = BUSINESS_PHRASE_PATTERNS.filter(({ pattern }) => pattern.test(message));
  if (matches.length === 0) return null;

  matches.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  return matches[0].key;
}

export function findBusinessPhraseScoredMatch(message: string): {
  key: BusinessPhraseIntentKey;
  priority: number;
} | null {
  const matches = BUSINESS_PHRASE_PATTERNS.filter(({ pattern }) => pattern.test(message));
  if (matches.length === 0) return null;

  matches.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  return { key: matches[0].key, priority: matches[0].priority ?? 0 };
}
