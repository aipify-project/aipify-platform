/**
 * Generic Website Kompis retrieval intent rewrite.
 * Improves search without inventing facts or encoding customer-specific Q/A.
 */

export type WebsiteKompisRetrievalIntent = {
  /** Visitor-facing normalized intent label (debug/tests). */
  normalizedIntent: string;
  /** Query string for FAQ / public site-index search. */
  retrievalQuery: string;
  /** Focus tokens for ranking (includes soft synonym expansion). */
  focusTokens: string[];
  /** Prior user topic attached for low-signal / referential follow-ups only. */
  followUpTopicAttached: boolean;
};

const LOW_SIGNAL_FOLLOW_UP_RE =
  /^(fortell mer|kan du utdype|tell me more|what does that mean|hva betyr det|utdyp|hvordan gjør jeg (det|dette)|how do i (do that|do this)|more please|og mer)[?.!\s]*$/i;

const REFERENTIAL_FOLLOW_UP_RE =
  /\b(det|dette|den|denne|that|this|those|these|der|there)\b/i;

/** Soft synonym families — generic commerce/site language, not tenant copy. */
const SYNONYM_FAMILIES: Array<{ match: RegExp; tokens: string[] }> = [
  {
    match: /\b(gavekort\w*|gift\s*cards?|voucher\w*|kupong\w*)\b/i,
    tokens: ["gavekort", "gift", "card", "cards", "voucher", "innløs", "redeem", "bruke", "use"],
  },
  {
    match: /\b(bruke|brukes|innløs\w*|innlos\w*|redeem\w*|where can i use|hvor kan jeg bruke)\b/i,
    tokens: ["bruke", "use", "innløs", "redeem", "aktivere", "activate"],
  },
  {
    match: /\b(medlemskap\w*|membership\w*|member\w*|bli medlem)\b/i,
    tokens: ["medlemskap", "membership", "member", "medlem"],
  },
  // Travel stems stay in expandFaqIntentTokens (stricter \breise\b) — broad
  // reise\w* here over-boosts guide paths vs FAQ Q→A on natural paraphrases.
  {
    match: /\b(pris\w*|koster|kostnad\w*|price\w*|cost\w*|poeng\w*|points?)\b/i,
    tokens: ["pris", "price", "kost", "cost", "poeng", "points"],
  },
  {
    match: /\b(sikkerhet\w*|trygg\w*|safety|secure|verification|verifiser\w*)\b/i,
    tokens: ["sikkerhet", "safety", "trygg", "verifisering", "verification"],
  },
  {
    // Narrow gift paraphrase across NO/EN/SV/DA. Not English "gave up".
    match:
      /\b(presang\w*|gåv(?:a|or|an)|gaver|gaven|gave(?!\s+up\b)|gifts?|gifting|presents?)\b/i,
    tokens: ["presang", "gave", "gåva", "gift", "gavekort", "present"],
  },
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);
}

export function isLowSignalWebsiteKompisFollowUp(question: string): boolean {
  const trimmed = question.trim();
  if (!trimmed) return false;
  if (LOW_SIGNAL_FOLLOW_UP_RE.test(trimmed)) return true;
  const tokens = tokenize(trimmed);
  return (
    tokens.length > 0 &&
    tokens.length <= 4 &&
    /^(fortell|utdyp|more|how|hvordan|kan|please)/i.test(tokens[0] ?? "")
  );
}

export function expandWebsiteKompisRetrievalSynonymTokens(question: string): string[] {
  const extras: string[] = [];
  for (const family of SYNONYM_FAMILIES) {
    if (family.match.test(question)) {
      extras.push(...family.tokens);
    }
  }
  return extras;
}

/**
 * Synonym tokens safe to merge into site-index topic ranking.
 * General paraphrase boost (not a gift-only allowlist). Excludes bare
 * price/membership generics that inflate false hits on weak FAQ/legal rows
 * via URL/title substring collisions (e.g. member ⊂ medlemskap).
 */
const TOPIC_BOOST_GENERIC_NOISE = new Set([
  "pris",
  "price",
  "kost",
  "cost",
  "poeng",
  "points",
  "medlemskap",
  "membership",
  "member",
  "medlem",
  "card",
  "cards",
]);

export function expandWebsiteKompisTopicBoostTokens(question: string): string[] {
  return expandWebsiteKompisRetrievalSynonymTokens(question)
    .map((t) => t.toLowerCase())
    .filter((t) => t.length >= 4 && !TOPIC_BOOST_GENERIC_NOISE.has(t));
}

function lastUserTopic(recentContext?: Array<{ role: string; text: string }> | null): string {
  if (!recentContext?.length) return "";
  for (let i = recentContext.length - 1; i >= 0; i -= 1) {
    const entry = recentContext[i];
    if (entry?.role === "user" && entry.text.trim()) {
      return entry.text.trim().slice(0, 280);
    }
  }
  return "";
}

/**
 * Build a retrieval-focused query: current turn + optional last user topic,
 * never the full chat transcript as the search string.
 */
export function rewriteWebsiteKompisRetrievalIntent(input: {
  question: string;
  recentContext?: Array<{ role: "user" | "assistant"; text: string }> | null;
}): WebsiteKompisRetrievalIntent {
  const question = input.question.trim();
  const synonyms = expandWebsiteKompisRetrievalSynonymTokens(question);
  const baseTokens = tokenize(question).filter((t) => t.length >= 3);
  const focusTokens = Array.from(new Set([...baseTokens, ...synonyms])).slice(0, 16);

  const lowSignal = isLowSignalWebsiteKompisFollowUp(question);
  const referential =
    !lowSignal &&
    REFERENTIAL_FOLLOW_UP_RE.test(question) &&
    tokenize(question).length <= 8;
  const priorTopic = lastUserTopic(input.recentContext);
  const attachPrior = Boolean(priorTopic) && (lowSignal || referential);

  // Synonyms live in focusTokens / ranking expanders only — never append them to the
  // retrieval string. Cross-language boosts (e.g. membership) would fail FAQ distinctive
  // overlap checks against same-locale published answers.
  let retrievalQuery = question;
  if (attachPrior) {
    retrievalQuery = `${priorTopic}\n${question}`.trim().slice(0, 900);
  }

  const normalizedIntent =
    focusTokens.length > 0 ? focusTokens.slice(0, 8).join(" ") : question.toLowerCase();

  return {
    normalizedIntent,
    retrievalQuery,
    focusTokens,
    followUpTopicAttached: attachPrior,
  };
}
