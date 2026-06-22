import type { PlatformCorpusArticleId } from "./types";

export type PlatformQuestionIntent =
  | "what-is-api"
  | "find-api-key"
  | "create-api-key"
  | "connect-system"
  | "connect-store"
  | "aipify-data-access";

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ").replace(/[?!.]+$/, "");
}

const INTENT_ARTICLE_MAP: Record<PlatformQuestionIntent, PlatformCorpusArticleId> = {
  "what-is-api": "what-is-api",
  "find-api-key": "find-api-key",
  "create-api-key": "create-api-key",
  "connect-system": "connect-system",
  "connect-store": "connect-shopify",
  "aipify-data-access": "aipify-data-access",
};

/** Detect platform question intent before generic corpus scoring. */
export function detectPlatformQuestionIntent(query: string): PlatformQuestionIntent | null {
  const q = normalizeQuery(query);

  if (
    /^(hva er (et |en )?api|what is (an )?api)\b/.test(q) ||
    /\b(hva er api|what is api)\b/.test(q)
  ) {
    return "what-is-api";
  }

  if (
    /(hvor finner|where (do i |can i )?find|finne.*api.?nøkkel|find.*api key|api.?nøkkel.*finn)/.test(q)
  ) {
    return "find-api-key";
  }

  if (
    /(hvordan oppretter|how (do i |to )?create|lage.*api.?nøkkel|generate.*api key|opprette.*api.?nøkkel)/.test(
      q,
    )
  ) {
    return "create-api-key";
  }

  if (/(nettbutikk|webshop|online store|e-?commerce|shopify|woocommerce)/.test(q)) {
    if (/(koble|connect|integrer|integrate|tilkoble)/.test(q)) {
      return "connect-store";
    }
  }

  if (
    /(hvordan kobler|how (do i |to )?connect|koble.*system|connect.*system|tilkoble.*system|integrer.*system)/.test(
      q,
    )
  ) {
    return "connect-system";
  }

  if (
    /(hva får aipify tilgang|what (does|can) aipify access|aipify.*tilgang|what data.*aipify|hva.*aipify.*tilgang)/.test(
      q,
    )
  ) {
    return "aipify-data-access";
  }

  return null;
}

export function resolveArticleIdForIntent(intent: PlatformQuestionIntent): PlatformCorpusArticleId {
  return INTENT_ARTICLE_MAP[intent];
}

export function isDefinitionQuery(query: string): boolean {
  return detectPlatformQuestionIntent(query) === "what-is-api";
}
