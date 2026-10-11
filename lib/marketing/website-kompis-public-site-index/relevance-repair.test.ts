/**
 * REPAIR.12 — local relevance regressions from APPLY.11 failures.
 * Uses public snapshot-shaped hits (no credentials / PII).
 */
import assert from "node:assert/strict";
import {
  buildPublicSiteIndexAnswer,
  filterAndRankPublicSiteIndexHits,
  focusPublicSiteIndexQuery,
  isRelevantPublicSiteIndexResult,
  topicTokensForPublicSiteIndex,
  type PublicSiteIndexHit,
} from "./answer";

function hit(partial: Partial<PublicSiteIndexHit> & Pick<PublicSiteIndexHit, "pathname" | "title" | "chunkContent">): PublicSiteIndexHit {
  return {
    documentId: partial.documentId ?? `doc:${partial.pathname}`,
    chunkId: partial.chunkId ?? `chunk:${partial.pathname}`,
    title: partial.title,
    canonicalUrl: partial.canonicalUrl ?? `https://www.customer.example${partial.pathname}`,
    pathname: partial.pathname,
    locale: partial.locale ?? "no",
    excerpt: partial.excerpt ?? partial.chunkContent.slice(0, 120),
    chunkContent: partial.chunkContent,
    score: partial.score ?? 40,
    matchedReason: "public_site_index",
    crawledAt: null,
  };
}

const gifting = hit({
  pathname: "/no/how-gifting-works",
  title: "Slik fungerer gaver",
  chunkContent:
    "Send gaver trygt og diskret på kunden — gavekort, produkter, medlemskap og ønskelistegaver.",
  score: 62,
  locale: "no",
});

const hottest = hit({
  pathname: "/no/faq/photo-contest-hottest-photo",
  title: "Slik fungerer Hotteste bilde",
  chunkContent: "Hotteste bilde er en månedlig bildekonkurranse med stemmer.",
  score: 60,
  locale: "no",
});

const safety = hit({
  pathname: "/no/safety",
  title: "Sikkerhetssenter",
  chunkContent:
    "Plattformen er bygget rundt proaktiv beskyttelse: verifisering, personvernkontroller og responsiv support.",
  score: 48,
  locale: "no",
});

const verificationGuide = hit({
  pathname: "/no/verification-guide",
  title: "Verifiseringsguide",
  chunkContent: "Slik verifiserer du kontoen din og bidrar til et trygt fellesskap.",
  score: 48,
  locale: "no",
});

const termsEn = hit({
  pathname: "/en/terms-and-conditions",
  title: "Terms and Conditions",
  chunkContent:
    "Legal agreement for profiles, chat, marketplace, wishlist, gifts, membership, and shop.",
  score: 60,
  locale: "en",
});

const faqEn = hit({
  pathname: "/en/faq",
  title: "FAQ — help and answers",
  chunkContent: "Quick answers about joining, safety, chat, gifts, marketplace, membership.",
  score: 58,
  locale: "en",
});

const membershipEn = hit({
  pathname: "/en/membership-guide",
  title: "Membership Guide",
  chunkContent:
    "Membership levels unlock visibility and features. Compare Bronze, Silver, Gold and Elite benefits.",
  score: 50,
  locale: "en",
});

const membershipNo = hit({
  pathname: "/no/membership-guide",
  title: "Medlemskapsguide",
  chunkContent:
    "Medlemskapsnivåene låser opp synlighet og funksjoner. Sammenlign Bronse, Sølv, Gull og Elite.",
  score: 50,
  locale: "no",
});

const howItWorksEn = hit({
  pathname: "/en/how-it-works",
  title: "How it works",
  chunkContent: "See how members use marketplace, gifts, subscriptions and travel.",
  score: 54,
  locale: "en",
});

const giftGuideNo = hit({
  pathname: "/no/gift-guide",
  title: "Gaveguide",
  chunkContent: "Gaveguiden forklarer hvordan du sender gaver og gavekort trygt.",
  score: 54,
  locale: "no",
});

// --- focus query ---
assert.match(
  focusPublicSiteIndexQuery(
    "Hvordan fungerer sikkerhet og verifisering på NETTSTED_NAVN?",
  ),
  /sikkerhet/,
);
assert.match(
  focusPublicSiteIndexQuery(
    "Hvordan fungerer sikkerhet og verifisering på NETTSTED_NAVN?",
  ),
  /verifisering/,
);
assert.doesNotMatch(
  focusPublicSiteIndexQuery(
    "Hvordan fungerer sikkerhet og verifisering på NETTSTED_NAVN?",
  ),
  /fungerer/,
);
assert.match(
  focusPublicSiteIndexQuery(
    "What does the membership guide say about membership levels?",
  ),
  /membership/,
);

// --- BEFORE failure shape: gifting/hottest outrank safety for NL safety question ---
const safetyFailHits = [gifting, gifting, hottest, safety, verificationGuide];
assert.equal(
  isRelevantPublicSiteIndexResult([gifting, hottest], "Hvordan fungerer sikkerhet og verifisering?"),
  false,
  "gifting/hottest must not pass as safety evidence",
);
const safetyRanked = filterAndRankPublicSiteIndexHits(
  safetyFailHits,
  "Hvordan fungerer sikkerhet og verifisering?",
);
assert.ok(safetyRanked[0]?.pathname.includes("safety") || safetyRanked[0]?.pathname.includes("verification"));
assert.ok(!safetyRanked.some((h) => h.pathname.includes("how-gifting") || h.pathname.includes("hottest")));

const safetyAnswer = buildPublicSiteIndexAnswer(
  safetyFailHits,
  "no",
  "www.customer.example",
  "Hvordan fungerer sikkerhet og verifisering?",
);
assert.ok(safetyAnswer);
assert.ok(
  safetyAnswer!.sources.every(
    (s) => s.route.includes("/safety") || s.route.includes("verification"),
  ),
);

// paraphrase
const safetyParaphrase = filterAndRankPublicSiteIndexHits(
  safetyFailHits,
  "Er det trygt med verifisering og personvern?",
);
assert.ok(
  safetyParaphrase[0]?.pathname.includes("safety") ||
    safetyParaphrase[0]?.pathname.includes("verification"),
);

// EN safety-like topic
const enSafetyHits = [
  hit({
    pathname: "/en/gift-guide",
    title: "How gifting works",
    chunkContent: "Send gifts safely and discreetly.",
    score: 60,
    locale: "en",
  }),
  hit({
    pathname: "/en/safety",
    title: "Safety center",
    chunkContent: "Verification, privacy controls and responsive support protect members.",
    score: 48,
    locale: "en",
  }),
];
const enSafetyRanked = filterAndRankPublicSiteIndexHits(
  enSafetyHits,
  "How does safety and verification work?",
);
assert.equal(enSafetyRanked[0]?.pathname, "/en/safety");

// --- membership: terms/faq must lose to membership-guide ---
const membershipFailHits = [termsEn, termsEn, faqEn, membershipEn];
const membershipRanked = filterAndRankPublicSiteIndexHits(
  membershipFailHits,
  "What does the membership guide say about membership levels?",
);
assert.equal(membershipRanked[0]?.pathname, "/en/membership-guide");
assert.ok(!membershipRanked.slice(0, 2).some((h) => h.pathname.includes("terms")));

const membershipAnswer = buildPublicSiteIndexAnswer(
  membershipFailHits,
  "en",
  "www.customer.example",
  "What does the membership guide say about membership levels?",
);
assert.ok(membershipAnswer);
assert.ok(membershipAnswer!.sources[0]?.route.includes("membership-guide"));

const noMembershipRanked = filterAndRankPublicSiteIndexHits(
  [termsEn, membershipNo, faqEn],
  "Hva sier medlemskapsguiden om medlemskap?",
);
assert.equal(noMembershipRanked[0]?.pathname, "/no/membership-guide");

// Competing FAQ/terms with no guide → honest gap (not false high relevance on terms alone)
assert.equal(
  isRelevantPublicSiteIndexResult(
    [termsEn, faqEn],
    "What does the membership guide say about membership levels?",
  ),
  false,
);

// --- positives preserved ---
assert.equal(
  isRelevantPublicSiteIndexResult(
    [howItWorksEn],
    "How does the site work according to the how-it-works page?",
  ),
  true,
);
assert.equal(
  isRelevantPublicSiteIndexResult([giftGuideNo], "Hvordan fungerer gaveguiden?"),
  true,
);

// topic tokens exclude process verbs
const topics = topicTokensForPublicSiteIndex("Hvordan fungerer sikkerhet?");
assert.ok(topics.includes("sikkerhet"));
assert.ok(!topics.includes("fungerer"));

// LIVE.13: membership-cost must not accept marketplace Push FAQ via body "medlemmer"/"koster".
const marketplacePush = hit({
  pathname: "/no/faq/marketplace-listing-push",
  title: "Push annonsen til toppen av markedsplassen",
  chunkContent:
    "Dette kan gjøre annonsen mer synlig for andre medlemmer. En Push koster {pushCost} poeng. Før poengene trekkes, får du alltid se kostnaden.",
  score: 40,
  locale: "no",
});
assert.equal(
  isRelevantPublicSiteIndexResult(
    [marketplacePush],
    "Hva koster det å bli medlem?",
  ),
  false,
);
assert.equal(
  buildPublicSiteIndexAnswer(
    [marketplacePush],
    "no",
    "www.customer.example",
    "Hva koster det å bli medlem?",
  ),
  null,
);

// Placeholder sentences must not be composed even on an otherwise topical Push question.
const pushCostQuestion = buildPublicSiteIndexAnswer(
  [marketplacePush],
  "no",
  "www.customer.example",
  "Hva koster en Push på markedsplassen?",
);
if (pushCostQuestion) {
  assert.doesNotMatch(pushCostQuestion.answer.directAnswer, /\{pushCost\}/);
}

console.log("website-kompis-public-site-index relevance-repair: passed");
