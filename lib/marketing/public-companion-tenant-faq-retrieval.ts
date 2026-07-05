/** Mirrors SQL tokenization/scoring in search_tenant_public_visitor_knowledge. */

export const PUBLIC_COMPANION_FAQ_QUERY_STOP_WORDS = new Set([
  "har",
  "det",
  "den",
  "der",
  "som",
  "kan",
  "jeg",
  "vi",
  "er",
  "når",
  "hva",
  "hvor",
  "du",
  "dere",
  "deg",
  "din",
  "mitt",
  "vår",
  "for",
  "med",
  "til",
  "fra",
  "om",
  "ikke",
  "eller",
  "en",
  "et",
  "i",
  "på",
  "av",
  "the",
  "and",
  "you",
  "your",
  "our",
  "are",
  "can",
  "how",
  "what",
  "when",
  "where",
  "who",
  "why",
  "is",
  "it",
  "be",
  "to",
  "of",
  "in",
  "on",
  "at",
  "by",
  "an",
  "as",
  "we",
  "me",
  "my",
  "do",
  "does",
  "did",
]);

export type PublicCompanionTenantFaqSearchRow = {
  title: string;
  question?: string | null;
  answer: string;
  category?: string | null;
  content_type: string;
  tags?: readonly string[] | null;
};

export function tokenizePublicCompanionFaqQuery(query: string): string[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const tokens = normalized
    .split(/[^a-z0-9æøå]+/i)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2 && !PUBLIC_COMPANION_FAQ_QUERY_STOP_WORDS.has(token));

  return [...new Set(tokens)];
}

export function scorePublicCompanionTenantFaqMatch(
  query: string,
  row: PublicCompanionTenantFaqSearchRow,
): { score: number; matchedReason: string } {
  const normalizedQuery = query.trim().toLowerCase();
  let score = 0;
  let matchedReason = "fallback";

  if (!normalizedQuery) {
    return { score: 1, matchedReason: "priority" };
  }

  const title = row.title.toLowerCase();
  const question = (row.question ?? "").toLowerCase();
  const answer = row.answer.toLowerCase();
  const category = (row.category ?? "").toLowerCase();
  const contentType = row.content_type.toLowerCase();
  const tags = (row.tags ?? []).map((tag) => tag.toLowerCase());

  if (title.includes(normalizedQuery)) {
    score += 40;
    matchedReason = "title_match";
  } else if (question.includes(normalizedQuery)) {
    score += 30;
    matchedReason = "question_match";
  } else if (answer.includes(normalizedQuery)) {
    score += 20;
    matchedReason = "answer_match";
  } else if (category.includes(normalizedQuery)) {
    score += 15;
    matchedReason = "category_match";
  } else if (tags.some((tag) => tag.includes(normalizedQuery))) {
    score += 25;
    matchedReason = "tag_match";
  } else if (contentType.includes(normalizedQuery)) {
    score += 10;
    matchedReason = "content_type_match";
  }

  for (const token of tokenizePublicCompanionFaqQuery(normalizedQuery)) {
    if (title.includes(token)) {
      score += 12;
      matchedReason = matchedReason === "fallback" ? "title_token_match" : matchedReason;
    }
    if (question.includes(token)) {
      score += 10;
      matchedReason = matchedReason === "fallback" ? "question_token_match" : matchedReason;
    }
    if (answer.includes(token)) {
      score += 8;
      matchedReason = matchedReason === "fallback" ? "answer_token_match" : matchedReason;
    }
    if (category.includes(token)) {
      score += 5;
      matchedReason = matchedReason === "fallback" ? "category_token_match" : matchedReason;
    }
    if (contentType.includes(token)) {
      score += 4;
      matchedReason = matchedReason === "fallback" ? "content_type_token_match" : matchedReason;
    }
    if (tags.some((tag) => tag.includes(token))) {
      score += 6;
      matchedReason = matchedReason === "fallback" ? "tag_token_match" : matchedReason;
    }
  }

  return { score, matchedReason };
}

export function matchesPublicCompanionTenantFaqQuery(
  query: string,
  row: PublicCompanionTenantFaqSearchRow,
): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  const title = row.title.toLowerCase();
  const question = (row.question ?? "").toLowerCase();
  const answer = row.answer.toLowerCase();
  const category = (row.category ?? "").toLowerCase();
  const contentType = row.content_type.toLowerCase();
  const tags = (row.tags ?? []).map((tag) => tag.toLowerCase());

  if (
    title.includes(normalizedQuery) ||
    question.includes(normalizedQuery) ||
    answer.includes(normalizedQuery) ||
    category.includes(normalizedQuery) ||
    contentType.includes(normalizedQuery) ||
    tags.some((tag) => tag.includes(normalizedQuery))
  ) {
    return true;
  }

  return tokenizePublicCompanionFaqQuery(normalizedQuery).some(
    (token) =>
      title.includes(token) ||
      question.includes(token) ||
      answer.includes(token) ||
      category.includes(token) ||
      contentType.includes(token) ||
      tags.some((tag) => tag.includes(token)),
  );
}
