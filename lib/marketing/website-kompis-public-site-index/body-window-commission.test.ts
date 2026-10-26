import assert from "node:assert/strict";
import {
  buildPublicSiteIndexAnswer,
  filterAndRankPublicSiteIndexHits,
  isRelevantPublicSiteIndexResult,
  type PublicSiteIndexHit,
} from "./answer";
import { withWebsiteKompisPublicAnswerPathDiagnostic } from "@/lib/marketing/website-kompis-public-answer-policy";

/**
 * Isolated TS contract: a search RPC body-window hit (chunk from body_text, not FAQ chunk)
 * must remain usable through filter/rerank/answer builder. Does not claim Production PASS.
 */
const bodyWindowHit: PublicSiteIndexHit = {
  documentId: "dddddddd-dddd-4ddd-8ddd-dddddddddd10",
  chunkId: "body-window-synthetic",
  title: "Slik fungerer det",
  canonicalUrl: "https://customer.example/no/how-it-works",
  pathname: "/no/how-it-works",
  locale: "nb",
  excerpt:
    "Paa denne siden beskrives provisjonsmodellen for medlemsplattformen uten a oppgi noen sats.",
  chunkContent:
    "Paa denne siden beskrives provisjonsmodellen for medlemsplattformen uten a oppgi noen sats. Teksten forklarer bare at provisjonsmodellen brukes naar en handel er fullfoert.",
  score: 20,
  matchedReason: "public_site_index_body_window",
  crawledAt: "2026-10-26T00:00:00.000Z",
};

const question = "Hvordan fungerer provisjon?";

assert.equal(bodyWindowHit.matchedReason, "public_site_index_body_window");
assert.match(bodyWindowHit.chunkContent, /provisjonsmodellen/i);
assert.doesNotMatch(bodyWindowHit.chunkContent, /\d+\s*%/);
assert.ok(bodyWindowHit.chunkContent.length <= 900);
assert.ok((bodyWindowHit.excerpt ?? "").length <= 420);

const ranked = filterAndRankPublicSiteIndexHits([bodyWindowHit], question);
assert.ok(ranked.length >= 1, "body-window hit must survive filter/rerank");
assert.equal(ranked[0]?.matchedReason, "public_site_index_body_window");
assert.match(ranked[0]?.chunkContent ?? "", /provisjonsmodellen/i);

assert.equal(isRelevantPublicSiteIndexResult([bodyWindowHit], question), true);

const built = buildPublicSiteIndexAnswer(
  [bodyWindowHit],
  "nb",
  "customer.example",
  question,
);
assert.ok(built, "answer builder must produce a site-index answer from body-window evidence");
assert.match(
  `${built!.answer.directAnswer} ${built!.answer.explanation ?? ""}`,
  /provisjon/i,
);
assert.doesNotMatch(
  `${built!.answer.directAnswer} ${built!.answer.explanation ?? ""}`,
  /\d+\s*%/,
);
assert.ok(
  built!.sources.some((s) => s.route.includes("/no/how-it-works")),
  "source URL must remain how-it-works",
);

const tagged = withWebsiteKompisPublicAnswerPathDiagnostic(
  { answer: built!.answer, diagnostics: {} } as {
    answer: unknown;
    diagnostics?: { answerPath?: string };
  },
  "public_site_index",
  { includeDiagnostics: true },
);
assert.equal(
  tagged.diagnostics?.answerPath,
  "public_site_index",
  "SQL body_window maps to answerPath public_site_index (not a separate path)",
);

// Dense-style fallback-looking chunk WITHOUT stem must not be treated as commission evidence
const fallbackChunk: PublicSiteIndexHit = {
  ...bodyWindowHit,
  chunkId: "faq-fallback",
  matchedReason: "public_site_index",
  chunkContent: "Syntetisk FAQ-chunk uten det soekte ordet. Hvordan fungerer medlemskapet generelt?",
  excerpt: "Generell forklaring uten stamme",
  score: 52,
};
assert.equal(
  isRelevantPublicSiteIndexResult([fallbackChunk], question),
  false,
  "stem-less hub/fallback chunk must not pass commission relevance alone",
);

console.log("website-kompis-public-site-index body-window-commission: passed");
