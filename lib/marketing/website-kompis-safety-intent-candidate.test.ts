/**
 * Safety-intent candidate. Generic inflections only. Not a release.
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import Module from "node:module";
import { join } from "node:path";
import {
  buildPublicSiteIndexAnswer,
  filterAndRankPublicSiteIndexHits,
  type PublicSiteIndexHit,
} from "./website-kompis-public-site-index/answer";
import {
  expandWebsiteKompisRetrievalSynonymTokens,
  rewriteWebsiteKompisRetrievalIntent,
} from "./website-kompis-retrieval-intent";

function hit(
  partial: Partial<PublicSiteIndexHit> &
    Pick<PublicSiteIndexHit, "pathname" | "title" | "chunkContent">,
): PublicSiteIndexHit {
  return {
    documentId: partial.documentId ?? `doc:${partial.pathname}`,
    chunkId: partial.chunkId ?? `chunk:${partial.pathname}`,
    title: partial.title,
    canonicalUrl: partial.canonicalUrl ?? `https://www.customer.example${partial.pathname}`,
    pathname: partial.pathname,
    locale: partial.locale ?? "no",
    excerpt: partial.excerpt ?? partial.chunkContent.slice(0, 140),
    chunkContent: partial.chunkContent,
    score: partial.score ?? 42,
    matchedReason: partial.matchedReason ?? "public_site_index",
    crawledAt: partial.crawledAt ?? null,
  };
}

const safety = hit({
  pathname: "/no/safety",
  title: "Sikkerhet",
  chunkContent:
    "Sikkerhet beskriver verifisering og et trygt fellesskap.",
});
const shop = hit({
  pathname: "/no/shop",
  title: "Shop",
  chunkContent: "Butikken har digitale produkter og gavekort.",
});
const membership = hit({
  pathname: "/no/membership-guide",
  title: "Medlemskap",
  chunkContent: "Medlemskap styrer profil, synlighet og kontakt.",
});
const gift = hit({
  pathname: "/no/gift-guide",
  title: "Gaveguide",
  chunkContent: "Slik gir du en presang og et gavekort.",
});

const safetyQuestions = ["Er det sikkert?", "Er dette trygt?", "Hvordan ivaretas sikkerheten?"];
for (const question of safetyQuestions) {
  const tokens = expandWebsiteKompisRetrievalSynonymTokens(question);
  assert.ok(tokens.includes("sikkerhet"), question);
  const ranked = filterAndRankPublicSiteIndexHits([shop, membership, safety], question);
  assert.equal(ranked[0]?.pathname, "/no/safety", question);
  const answer = buildPublicSiteIndexAnswer([safety], "no", "www.customer.example", question);
  assert.ok(answer);
  assert.match(answer!.answer.directAnswer, /sikkerhet|trygt/i, question);
  assert.doesNotMatch(answer!.answer.directAnswer, /sertifisert|100\s*%/i, question);
}

const withoutSafety = filterAndRankPublicSiteIndexHits([shop, gift], "Er det sikkert?");
assert.equal(withoutSafety.length, 0);

const competingRewrite = rewriteWebsiteKompisRetrievalIntent({
  question: "Er det sikkert?",
  recentContext: [{ role: "user", text: "Hva er medlemskap?" }],
});
assert.match(competingRewrite.retrievalQuery, /medlemskap/);
assert.doesNotMatch(competingRewrite.retrievalQuery, /sikkerhet/);
assert.ok(!expandWebsiteKompisRetrievalSynonymTokens(competingRewrite.retrievalQuery).includes("sikkerhet"));

const isolatedSafety = rewriteWebsiteKompisRetrievalIntent({ question: "Er det sikkert?" });
assert.match(isolatedSafety.retrievalQuery, /sikkerhet/);
assert.equal(isolatedSafety.followUpTopicAttached, false);

const commission = expandWebsiteKompisRetrievalSynonymTokens("Hvordan fungerer provisjon?");
assert.ok(!commission.includes("sikkerhet"));
assert.ok(!commission.includes("sikkert"));

assert.ok(
  expandWebsiteKompisRetrievalSynonymTokens("Hvordan gir jeg en presang?").includes("gavekort"),
);
assert.ok(expandWebsiteKompisRetrievalSynonymTokens("presang").includes("gave"));

const priceFollow = rewriteWebsiteKompisRetrievalIntent({
  question: "Hva koster den?",
  recentContext: [{ role: "user", text: "Hva er medlemskap?" }],
});
assert.equal(priceFollow.followUpTopicAttached, true);
assert.match(priceFollow.retrievalQuery, /medlemskap/);
assert.ok(!priceFollow.retrievalQuery.includes("sikkerhet"));

const clearFollow = expandWebsiteKompisRetrievalSynonymTokens("Er dette trygt?");
assert.ok(clearFollow.includes("trygg"));
assert.ok(expandWebsiteKompisRetrievalSynonymTokens("How is safety handled?").includes("safety"));

const require = createRequire(
  join(process.cwd(), "lib/marketing/website-kompis-safety-intent-candidate.test.ts"),
);
const moduleWithResolve = Module as unknown as {
  _resolveFilename: (request: string, parent: unknown, isMain: boolean, options: unknown) => string;
};
const originalResolve = moduleWithResolve._resolveFilename;
moduleWithResolve._resolveFilename = function resolveWithServerOnlyStub(
  request: string,
  parent: unknown,
  isMain: boolean,
  options: unknown,
) {
  if (request === "server-only") {
    return require.resolve("../kompis-content-languages/server-only-empty.cjs");
  }
  return originalResolve.call(this, request, parent, isMain, options);
};

void import("./website-kompis-grounded-answer").then(
  ({
    buildWebsiteKompisEvidencePack,
    buildWebsiteKompisIndexEvidence,
    evidenceSnippetMatchesQuestionTopic,
  }) => {
    for (const question of safetyQuestions) {
      const [snippet] = buildWebsiteKompisIndexEvidence([safety]);
      assert.equal(evidenceSnippetMatchesQuestionTopic(snippet, question), true, question);
    }
    const emptyPack = buildWebsiteKompisEvidencePack({
      question: "Er det sikkert?",
      locale: "no",
      siteIndexHits: [shop, gift],
    });
    assert.equal(emptyPack.evidence.length, 0);
    const safetyPack = buildWebsiteKompisEvidencePack({
      question: "Er det sikkert?",
      locale: "no",
      siteIndexHits: [shop, safety],
      verifiedHost: "www.customer.example",
    });
    assert.ok(safetyPack.evidence.some((item) => item.url?.includes("/no/safety")));
    assert.ok(safetyPack.evidence.every((item) => !/sertifisert|100\s*%/i.test(item.text)));
    const deferredPack = buildWebsiteKompisEvidencePack({
      question: "Er det sikkert?",
      locale: "no",
      recentContext: [{ role: "user", text: "Hva er medlemskap?" }],
      siteIndexHits: [membership, safety],
      verifiedHost: "www.customer.example",
    });
    assert.ok(!deferredPack.evidence.some((item) => item.url?.includes("/no/safety")));
    assert.equal(deferredPack.evidence.length, 0);
    console.log("website-kompis-safety-intent-candidate.test.ts: ok");
  },
  (error: unknown) => {
    console.error(error);
    process.exit(1);
  },
);
