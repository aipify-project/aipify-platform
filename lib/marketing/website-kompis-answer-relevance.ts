/**
 * Detect FAQ hub / accordion dumps that are lists of questions rather than one Q+A answer.
 */
export function looksLikeFaqQuestionList(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  const questionMarks = (trimmed.match(/\?/g) ?? []).length;
  const lines = trimmed
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length >= 12);
  if (lines.length === 0) {
    return questionMarks >= 4;
  }
  const questionLine = (line: string) =>
    /\?\s*$/.test(line) ||
    /^(hva|hvordan|hvorfor|kan jeg|må jeg|hvilke|what|how|why|can i|do i|should i)\b/i.test(line);
  const questionLines = lines.filter(questionLine);
  if (questionMarks >= 3 && questionLines.length >= 3) return true;
  if (lines.length >= 4 && questionLines.length / lines.length >= 0.55) return true;
  return false;
}

/** Prefer answer prose over bare FAQ question headings. */
export function looksLikeBareFaqQuestionHeading(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length > 160) return false;
  if (!/\?\s*$/.test(trimmed)) return false;
  return /^(hva|hvordan|hvorfor|hvor|kan jeg|må jeg|hvilke|what|how|why|where|can i)\b/i.test(
    trimmed,
  );
}

const PRICE_AMOUNT =
  /(?:^|[^\d])(\d{1,3}(?:[.\s]\d{3})*(?:,\d{2})?|\d+(?:[.,]\d{2})?)\s*(?:kr|nok|usd|eur|\$)|(?:kr|nok)\s*(\d{1,3}(?:[.\s]\d{3})*(?:,\d{2})?|\d+(?:[.,]\d{2})?)/i;

export function textLooksLikePublishedPrice(text: string): boolean {
  return PRICE_AMOUNT.test(text);
}

/** Concrete published cost: currency amount or an explicit point count (not process wording alone). */
export function textLooksLikeConcretePublishedCost(text: string): boolean {
  return (
    textLooksLikePublishedPrice(text) || /\b\d{1,7}\s*(?:poeng|points?)\b/i.test(text)
  );
}

export function isProductOrPriceVisitorQuestion(question: string): boolean {
  const q = question.trim().toLowerCase();
  if (!q) return false;
  // Prefix forms: prisen, gavekortene, template(s), upgrade(s).
  return /\b(pris\w*|koster|kostnad\w*|price\w*|cost\w*|kjøp\w*|kjop\w*|buy|purchase|produkt\w*|product\w*|template\w*|upgrade\w*|gavekort\w*|gift\s*cards?|abonnement\w*|offer\w*|tilbud\w*)\b/i.test(
    q,
  );
}

/**
 * Visitor is asking for a published amount (price / points), not merely where/how
 * to buy or activate. "Kjøpe" alone must not trigger the missing-cost gap template.
 */
export function isConcreteCostSeekingVisitorQuestion(question: string): boolean {
  const q = question.trim().toLowerCase();
  if (!q) return false;
  return /\b(pris\w*|koster|kostnad\w*|price\w*|cost\w*|poeng\w*|points?|beløp|amount)\b/i.test(
    q,
  );
}

export function isPurchaseProcessVisitorQuestion(question: string): boolean {
  const q = question.trim().toLowerCase();
  return /\b(kjøp\w*|kjop\w*|buy|purchase|bestill\w*|order|aktiver\w*|activat\w*|hvordan kjøper|how (?:do|can) i (?:buy|purchase|activate))\b/i.test(
    q,
  );
}

/** Soft synonym expansion for FAQ intent matching (not translation). */
export function expandFaqIntentTokens(question: string): string[] {
  const lower = question.toLowerCase();
  const extras: string[] = [];
  if (/\b(ekte\s+navn|real\s+name|riktig\s+navn)\b/.test(lower)) {
    extras.push("ekte", "navn", "brukernavn", "pseudonym");
  }
  if (/\b(ledig\s+nå|ledig\s+naa|available\s+now)\b/.test(lower)) {
    extras.push("ledig", "tilgjengelig", "online", "status");
  }
  if (/\b(reise|reiser|travel)\b/.test(lower)) {
    extras.push("reise", "reiser", "travel", "tur");
  }
  return extras;
}

export function dedupeCompanionSourcesByRoute<T extends { title: string; route: string }>(
  sources: T[],
): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const source of sources) {
    const key = normalizeSourceRouteKey(source.route);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(source);
  }
  return out;
}

function normalizeSourceRouteKey(route: string): string {
  const trimmed = route.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("website-kompis-")) {
    return trimmed.toLowerCase();
  }
  try {
    const url = new URL(trimmed, "https://example.invalid");
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    const path = url.pathname.replace(/\/+$/, "") || "/";
    return `${url.protocol}//${host}${path}${url.search}`.toLowerCase();
  } catch {
    return trimmed.toLowerCase();
  }
}
