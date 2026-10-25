/**
 * Proposal tests for the frozen retrieval patch.
 * Run only against a temporary applied copy. Not part of the runtime patch.
 */
import assert from "node:assert/strict";
import {
  buildPublicSiteIndexAnswer,
  filterAndRankPublicSiteIndexHits,
  focusPublicSiteIndexQuery,
  type PublicSiteIndexHit,
} from "./answer";
import {
  expandWebsiteKompisRetrievalSynonymTokens,
  rewriteWebsiteKompisRetrievalIntent,
} from "../website-kompis-retrieval-intent";

function hit(
  partial: Partial<PublicSiteIndexHit> &
    Pick<PublicSiteIndexHit, "pathname" | "title" | "chunkContent">,
): PublicSiteIndexHit {
  return {
    documentId: partial.documentId ?? `doc:${partial.pathname}`,
    chunkId: partial.chunkId ?? `chunk:${partial.pathname}`,
    title: partial.title,
    canonicalUrl:
      partial.canonicalUrl ?? `https://www.customer.example${partial.pathname}`,
    pathname: partial.pathname,
    locale: partial.locale ?? "no",
    excerpt: partial.excerpt ?? partial.chunkContent.slice(0, 140),
    chunkContent: partial.chunkContent,
    score: partial.score ?? 40,
    matchedReason: "public_site_index",
    crawledAt: null,
  };
}

const brand = "Eksempelplattform";
const how = hit({
  pathname: "/no/how-it-works",
  title: `Slik fungerer ${brand}`,
  chunkContent: `${brand} er en plattform der medlemmer kobler sammen, gir gaver og handler med hverandre. Plattformen tar ikke provisjon av salg mellom medlemmer på markedsplassen.`,
  score: 30,
});
const shop = hit({
  pathname: "/no/shop",
  title: `${brand} Shop`,
  chunkContent: `${brand} Shop selger oppgraderinger og kort.`,
  score: 80,
});
const terms = hit({
  pathname: "/no/terms-and-conditions",
  title: `Vilkår for ${brand}`,
  chunkContent: `${brand} sitt avtaleverk dekker profiler og handel. Plattformen er ikke ansvarlig for private salg.`,
  score: 90,
});
const faq = hit({
  pathname: "/no/faq",
  title: `FAQ — ${brand}`,
  chunkContent: `${brand} tar ikke provisjon av salg mellom medlemmer på markedsplassen. Plattformen er ikke ansvarlig for private salg.`,
  score: 85,
});
const guide = hit({
  pathname: "/no/membership-guide",
  title: "Medlemskapsguide",
  chunkContent: "Velg medlemskapet som passer. Alle starter med grunnleggende tilgang.",
  score: 44,
});
const safety = hit({
  pathname: "/no/safety",
  title: "Sikkerhetssenter",
  chunkContent: "Verifisering, personvernkontroller og support beskytter medlemmene.",
  score: 42,
});
const gift = hit({
  pathname: "/no/gift-guide",
  title: "Gaveguide",
  chunkContent: "Slik sender du et gavekort, en gave eller en presang uten å dele betalingsinformasjon.",
  score: 36,
});

const paths = (rows: PublicSiteIndexHit[]) => rows.map((row) => row.pathname);

// A. Definitional question prefers the explanatory page already in the window.
const defined = filterAndRankPublicSiteIndexHits(
  [terms, shop, faq, how],
  `Hva er ${brand}?`,
);
assert.equal(defined[0]?.pathname, "/no/how-it-works");
assert.ok(!paths(defined).some((p) => /shop|terms|\/faq$/.test(p)));

for (const question of [
  `Vad är ${brand}?`,
  `Hvad er ${brand}?`,
  `What is ${brand}?`,
]) {
  const ranked = filterAndRankPublicSiteIndexHits([terms, shop, how], question);
  assert.equal(ranked[0]?.pathname, "/no/how-it-works", question);
}

// Coverage limit: eight candidates without the explanatory page cannot invent it.
const windowWithoutExplanation = [
  terms,
  shop,
  faq,
  hit({
    pathname: "/no/privacy",
    title: `Personvern ${brand}`,
    chunkContent: `${brand} beskriver personvern.`,
    score: 70,
  }),
  hit({
    pathname: "/no/premium",
    title: `Premium ${brand}`,
    chunkContent: `${brand} premium.`,
    score: 60,
  }),
  hit({
    pathname: "/sv/shop",
    title: `${brand} Shop`,
    chunkContent: `${brand} butik.`,
    score: 55,
  }),
  hit({
    pathname: "/da/terms-and-conditions",
    title: `Vilkår ${brand}`,
    chunkContent: `${brand} vilkår.`,
    score: 50,
  }),
  hit({
    pathname: "/en/faq",
    title: `FAQ ${brand}`,
    chunkContent: `${brand} questions.`,
    score: 48,
  }),
];
assert.equal(windowWithoutExplanation.length, 8);
const missed = filterAndRankPublicSiteIndexHits(
  windowWithoutExplanation,
  `Hva er ${brand}?`,
);
assert.ok(!paths(missed).includes("/no/how-it-works"));

// B. Long definite compounds only.
assert.match(focusPublicSiteIndexQuery("Hvor finner jeg medlemskapsguiden?"), /medlemskapsguid/);
assert.match(focusPublicSiteIndexQuery("Hva beskytter sikkerhetssenteret?"), /sikkerhetssenter/);
assert.doesNotMatch(focusPublicSiteIndexQuery("Hva er medlemskapet?"), /\bmedlemskap\b/);
const childrenQuery = focusPublicSiteIndexQuery("Where are the children?");
assert.ok(!childrenQuery.split(" ").includes("childr"));
assert.equal(
  focusPublicSiteIndexQuery("Hva er medlemskapet?").includes("medlemskap "),
  false,
);

const membershipRanked = filterAndRankPublicSiteIndexHits(
  [shop, safety, guide],
  "Hvor finner jeg medlemskapsguiden?",
);
assert.equal(membershipRanked[0]?.pathname, "/no/membership-guide");

const safetyRanked = filterAndRankPublicSiteIndexHits(
  [shop, terms, safety],
  "Hva beskytter sikkerhetssenteret?",
);
assert.equal(safetyRanked[0]?.pathname, "/no/safety");

// C. Gift paraphrase, including Swedish and Danish.
for (const question of [
  "Hvordan gir jeg en presang?",
  "Hur ger jag en present?",
  "Hvordan giver jeg en gave?",
  "How do I send a gift?",
]) {
  const tokens = expandWebsiteKompisRetrievalSynonymTokens(question);
  assert.ok(tokens.includes("gavekort"), question);
  const ranked = filterAndRankPublicSiteIndexHits([shop, terms, gift], question);
  assert.equal(ranked[0]?.pathname, "/no/gift-guide", question);
}
assert.deepEqual(expandWebsiteKompisRetrievalSynonymTokens("I gave up on the idea"), []);

// Commission: FAQ hub loses when how-it-works already covers the long token.
const commission = filterAndRankPublicSiteIndexHits(
  [faq, shop, terms, how],
  "Tar plattformen provisjon av salg mellom medlemmer på markedsplassen?",
);
assert.equal(commission[0]?.pathname, "/no/how-it-works");
assert.ok(!paths(commission).includes("/no/faq"));
const commissionAnswer = buildPublicSiteIndexAnswer(
  [faq, how],
  "no",
  "www.customer.example",
  "Tar plattformen provisjon av salg mellom medlemmer på markedsplassen?",
);
assert.ok(commissionAnswer);
assert.match(commissionAnswer!.answer.directAnswer, /provisjon/i);
assert.doesNotMatch(commissionAnswer!.answer.directAnswer, /ansvarlig for private salg/i);
assert.ok(commissionAnswer!.sources.every((source) => source.route.includes("how-it-works")));

// A shop question still keeps the shop, even when how-it-works is present.
const shopRanked = filterAndRankPublicSiteIndexHits(
  [how, shop],
  "Hva kan jeg kjøpe i shoppen?",
);
assert.ok(paths(shopRanked).includes("/no/shop"));

// D. No invented price, no invented right, no carried context.
const priceAnswer = buildPublicSiteIndexAnswer(
  [guide],
  "no",
  "www.customer.example",
  "Hva koster den?",
);
if (priceAnswer) {
  assert.doesNotMatch(priceAnswer.answer.directAnswer, /\d/);
  assert.equal(priceAnswer.supportEscalation.reason, "knowledge_gap");
}
const tokyo = filterAndRankPublicSiteIndexHits(
  [how, shop, guide],
  "Får jeg ubegrenset helikoptertransport til Reykjavik?",
);
assert.equal(tokyo.length, 0);

const priceFollow = rewriteWebsiteKompisRetrievalIntent({
  question: "Hva koster den?",
  recentContext: [{ role: "user", text: "Hva er medlemskapet?" }],
});
assert.equal(priceFollow.followUpTopicAttached, true);
assert.match(priceFollow.retrievalQuery, /medlemskapet/);

const fresh = rewriteWebsiteKompisRetrievalIntent({
  question: "Hva beskytter sikkerhetssenteret?",
});
assert.equal(fresh.followUpTopicAttached, false);
assert.doesNotMatch(fresh.retrievalQuery, /koster|medlemskap/i);

// Private path stays out of visitor sources.
const account = hit({
  pathname: "/account/billing",
  title: `${brand} konto`,
  chunkContent: `${brand} konto og betaling for medlemmer.`,
  score: 95,
});
const definedAnswer = buildPublicSiteIndexAnswer(
  [account, terms, how],
  "no",
  "www.customer.example",
  `Hva er ${brand}?`,
);
assert.ok(definedAnswer);
assert.ok(definedAnswer!.sources.every((source) => !source.route.includes("/account")));
assert.ok(definedAnswer!.sources[0]?.route.includes("how-it-works"));

console.log("retrieval-answer-path-proposal: passed");
