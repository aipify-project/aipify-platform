import { BUSINESS_PHRASE_PATTERNS } from "./business-phrase-detection";
import { BUSINESS_PHRASE_VOCABULARY } from "./business-phrase-vocabulary";
import { pickClosingPhrase } from "./describe";
import { COMMAND_CORE_PRINCIPLE } from "./command-vocabulary";
import { NBLE_VISION, NATURAL_BUSINESS_VOCABULARY } from "./nble-vocabulary";
import type {
  BusinessLanguageEntry,
  BusinessLanguageIntentKey,
  BusinessLanguageSource,
  BusinessPhraseIntentKey,
  NbleGuidance,
  NbleIntentKey,
} from "./types";

const NBLE_PATTERNS: Array<{ pattern: RegExp; key: NbleIntentKey; priority?: number }> = [
  { pattern: /\b(?:fallen|falling|got|getting|am|i'm) behind.{0,30}\b(?:email|inbox|mail)/i, key: "email_behind", priority: 10 },
  { pattern: /\bwhat (?:do )?i need to (?:answer|reply|respond)/i, key: "email_unanswered", priority: 9 },
  { pattern: /\bclean(?:\s+up)? my inbox\b/i, key: "email_cleanup", priority: 9 },
  { pattern: /\bdid i forget (?:anyone|anybody|someone)\b/i, key: "email_forgotten", priority: 9 },
  { pattern: /\bwhen do i have time\b/i, key: "calendar_time", priority: 8 },
  { pattern: /\bprepare me for.{0,30}\b(?:meeting|today)/i, key: "calendar_prepare", priority: 8 },
  { pattern: /\b(?:can you |could you )?fit (?:this|it) in somewhere\b/i, key: "calendar_fit", priority: 8 },
  { pattern: /\bwhat should i focus on(?: today)?\b/i, key: "task_focus", priority: 7 },
  { pattern: /\bi(?:'m| am) overwhelmed\b/i, key: "task_overwhelmed", priority: 7 },
  { pattern: /\bget me back on track\b/i, key: "task_back_on_track", priority: 7 },
  { pattern: /\bwhat(?:'s| is) burning(?: right now)?\b/i, key: "support_burning", priority: 9 },
  {
    pattern: /\b(?:anything|something) important\b.{0,40}\b(?:support|ticket|case|queue|customer)/i,
    key: "support_important",
    priority: 6,
  },
  {
    pattern: /\b(?:support|ticket|case|queue).{0,40}\b(?:anything|something) important\b/i,
    key: "support_important",
    priority: 6,
  },
  { pattern: /\bwho needs help first\b/i, key: "support_who_first", priority: 8 },
  { pattern: /\bwho should i call\b/i, key: "sales_who_call", priority: 8 },
  { pattern: /\b(?:deals?|opportunit(?:y|ies)).{0,30}\b(?:slipping|at risk|going cold)/i, key: "sales_slipping", priority: 8 },
  { pattern: /\bwhat deals are slipping\b/i, key: "sales_slipping", priority: 9 },
  { pattern: /\bwhere should i spend my time\b/i, key: "sales_where_time", priority: 8 },
  { pattern: /\bshow me what needs approval\b/i, key: "action_show_approval", priority: 9 },
  { pattern: /\bcan we automate (?:this|that|it)\b/i, key: "action_automate", priority: 9 },
  { pattern: /\bcan aipify take care of (?:this|that|it)\b/i, key: "action_take_care", priority: 9 },
  { pattern: /\bi(?:'m| am) stressed\b/i, key: "emotional_stressed", priority: 5 },
  { pattern: /\bi don(?:'t| not) know where to start\b/i, key: "emotional_where_start", priority: 5 },
  { pattern: /\bi feel behind\b/i, key: "emotional_behind", priority: 5 },
];

type ScoredMatch = {
  key: BusinessLanguageIntentKey;
  source: BusinessLanguageSource;
  priority: number;
};

function findNbleMatch(message: string): ScoredMatch | null {
  const matches = NBLE_PATTERNS.filter(({ pattern }) => pattern.test(message));
  if (matches.length === 0) return null;

  matches.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  return {
    key: matches[0].key,
    source: "nble",
    priority: matches[0].priority ?? 0,
  };
}

function findBusinessPhraseScoredMatch(message: string): ScoredMatch | null {
  const matches = BUSINESS_PHRASE_PATTERNS.filter(({ pattern }) => pattern.test(message));
  if (matches.length === 0) return null;

  matches.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  return {
    key: matches[0].key,
    source: "business_phrase",
    priority: matches[0].priority ?? 0,
  };
}

function findBestBusinessLanguageMatch(message: string): ScoredMatch | null {
  const nbleMatch = findNbleMatch(message);
  const phraseMatch = findBusinessPhraseScoredMatch(message);

  if (!nbleMatch && !phraseMatch) return null;
  if (!nbleMatch) return phraseMatch;
  if (!phraseMatch) return nbleMatch;

  return nbleMatch.priority >= phraseMatch.priority ? nbleMatch : phraseMatch;
}

function getBusinessLanguageEntry(
  key: BusinessLanguageIntentKey,
  source: BusinessLanguageSource
): BusinessLanguageEntry {
  if (source === "nble") {
    return NATURAL_BUSINESS_VOCABULARY[key as NbleIntentKey];
  }
  return BUSINESS_PHRASE_VOCABULARY[key as BusinessPhraseIntentKey];
}

function buildBusinessLanguageReply(entry: BusinessLanguageEntry): string {
  const meaningNote =
    entry.meanings.length > 0
      ? `\n\nI understand you want to: ${entry.meanings.slice(0, 3).join(", ").toLowerCase()}.`
      : "";

  return `${entry.response}${meaningNote}\n\n${COMMAND_CORE_PRINCIPLE}`;
}

function isSupportiveDomain(domain: string): boolean {
  return domain === "emotional" || domain === "productivity";
}

export function detectNaturalBusinessIntent(message: string): NbleGuidance | null {
  const trimmed = message.trim();
  if (!trimmed) return null;

  const match = findBestBusinessLanguageMatch(trimmed);
  if (!match) return null;

  const entry = getBusinessLanguageEntry(match.key, match.source);
  return {
    detected: true,
    intentKey: match.key,
    source: match.source,
    reply: buildBusinessLanguageReply(entry),
    domain: entry.domain,
    meanings: entry.meanings,
    dashboardPath: entry.dashboardPath,
    closingPhrase: pickClosingPhrase(isSupportiveDomain(entry.domain) ? 2 : 1),
  };
}

export function getNbleVision(): string {
  return NBLE_VISION;
}
