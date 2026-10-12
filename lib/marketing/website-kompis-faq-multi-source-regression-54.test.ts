/**
 * Job 54 — FAQ Q→A must beat weak home/campaign pages after multi-source ranking.
 * Generic fixtures only (customer.example / NETTSTED_NAVN). No owner LIVE copy as special rules.
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function installServerOnlyShim(): void {
  const moduleApi = require("node:module") as {
    Module: {
      _load: (request: string, parent: unknown, isMain: boolean) => unknown;
    };
  };
  const originalLoad = moduleApi.Module._load;
  moduleApi.Module._load = function (request, parent, isMain) {
    if (request === "server-only") return {};
    return originalLoad.call(this, request, parent, isMain);
  };
}

async function main() {
  installServerOnlyShim();

  const {
    rewriteWebsiteKompisRetrievalIntent,
    expandWebsiteKompisTopicBoostTokens,
  } = await import("./website-kompis-retrieval-intent");
  const {
    askPublicPlatformCompanion,
    preferStrongSiteIndexOverSparseFaq,
    resolvePublicCompanionRetrievalIntent,
  } = await import("./public-companion-ask");
  const { buildWebsiteKompisEvidencePack } = await import(
    "./website-kompis-grounded-answer"
  );
  const {
    filterAndRankPublicSiteIndexHits,
    isWeakGeneralPublicSitePath,
    topicTokensForPublicSiteIndex,
  } = await import("./website-kompis-public-site-index/answer");
  const { expandPublicSiteIndexSearchLocales } = await import(
    "./website-kompis-public-site-index/locale-contract"
  );
  const {
    WEBSITE_KOMPIS_PUBLIC_ANSWER_POLICY_ID,
    resolveWebsiteKompisPublicAnswerPolicyRuntimeLink,
  } = await import("./website-kompis-public-answer-policy");

  // Locked locale + policy
  assert.deepEqual(expandPublicSiteIndexSearchLocales("no"), ["no", "nb"]);
  assert.deepEqual(expandPublicSiteIndexSearchLocales("nn"), ["nn"]);
  assert.equal(
    resolveWebsiteKompisPublicAnswerPolicyRuntimeLink().policyId,
    WEBSITE_KOMPIS_PUBLIC_ANSWER_POLICY_ID,
  );

  // Topic boost is general (not gift-only allowlist); price noise excluded
  const giftBoost = expandWebsiteKompisTopicBoostTokens(
    "Hvor kan jeg bruke gavekortene?",
  );
  assert.ok(giftBoost.some((t) => /innløs|redeem|gavekort|gift/i.test(t)));
  const priceBoost = expandWebsiteKompisTopicBoostTokens("Hva koster en Push?");
  assert.ok(!priceBoost.includes("pris"));
  assert.ok(!priceBoost.includes("cost"));

  assert.equal(isWeakGeneralPublicSitePath("/no"), true);
  assert.equal(isWeakGeneralPublicSitePath("/no/referrals"), true);
  assert.equal(isWeakGeneralPublicSitePath("/no/faq"), false);
  assert.equal(isWeakGeneralPublicSitePath("/no/gift-guide"), false);

  // --- 1) Natural paraphrase → relevant FAQ Q→A over home/referrals ---
  const privacyQ = "Kan profilen min dukke opp i søkemotorer?";
  const privacyIntent = rewriteWebsiteKompisRetrievalIntent({ question: privacyQ });
  assert.equal(privacyIntent.followUpTopicAttached, false);
  assert.equal(privacyIntent.retrievalQuery, privacyQ);

  const privacyFaq = {
    item_id: "faq-search-visibility",
    title: "Profil og søkemotorer",
    answer:
      "Nei. Profilen din indekseres ikke av eksterne søkemotorer. Kun innloggede medlemmer ser profilinnholdet.",
    category: "Personvern",
    content_type: "faq",
    locale: "nb",
    source_url: "https://www.customer.example/no/faq",
    score: 44,
    matched_reason: "question_match" as const,
  };

  const privacyHits = [
    {
      documentId: "d-ref",
      chunkId: "c-ref",
      title: "Verv en venn",
      canonicalUrl: "https://www.customer.example/no/referrals",
      pathname: "/no/referrals",
      locale: "no",
      excerpt: "Del profilen din med venner.",
      chunkContent:
        "Når du verver venner blir profilen din mer synlig i nettverket. Søkemotorer er ikke en del av vervingen.",
      score: 55,
      matchedReason: "public_site_index",
      crawledAt: null,
    },
    {
      documentId: "d-home",
      chunkId: "c-home",
      title: "Hjem",
      canonicalUrl: "https://www.customer.example/no",
      pathname: "/no",
      locale: "no",
      excerpt: "Profiler og fellesskap",
      chunkContent:
        "Opprett profil på NETTSTED_NAVN. Synlig for andre medlemmer. Søkemotorer omtales ikke her.",
      score: 50,
      matchedReason: "public_site_index",
      crawledAt: null,
    },
    {
      documentId: "d-faq",
      chunkId: "c-faq",
      title: "Vanlige spørsmål",
      canonicalUrl: "https://www.customer.example/no/faq",
      pathname: "/no/faq",
      locale: "nb",
      excerpt: "Personvern",
      chunkContent:
        "Kan profilen min dukke opp i søkemotorer? Nei. Profilen din indekseres ikke av eksterne søkemotorer. Kun innloggede medlemmer ser profilinnholdet.",
      score: 40,
      matchedReason: "public_site_index",
      crawledAt: null,
    },
  ];

  const rankedPrivacy = filterAndRankPublicSiteIndexHits(
    privacyHits,
    privacyIntent.retrievalQuery,
  );
  assert.ok(rankedPrivacy.length >= 1);
  assert.equal(rankedPrivacy[0]?.pathname, "/no/faq");
  assert.ok(!rankedPrivacy.some((h) => h.pathname === "/no/referrals"));

  const preferredPrivacy = preferStrongSiteIndexOverSparseFaq({
    question: privacyIntent.retrievalQuery,
    faqRows: [privacyFaq],
    siteIndexHits: rankedPrivacy,
  });
  assert.equal(preferredPrivacy.faqRows.length, 1);

  const privacyPack = buildWebsiteKompisEvidencePack({
    question: privacyQ,
    locale: "no",
    faqRows: preferredPrivacy.faqRows,
    siteIndexHits: preferredPrivacy.siteIndexHits,
  });
  assert.ok(
    privacyPack.evidence.some(
      (e) =>
        (e.kind === "faq" || e.kind === "public-site-index") &&
        /søkemotor|indekseres|ikke/i.test(e.text),
    ),
  );
  assert.ok(
    !privacyPack.evidence.some((e) => /\/referrals/i.test(e.url ?? "")),
  );
  assert.ok(!privacyPack.evidence.some((e) => (e.url ?? "").endsWith("/no")));

  // --- 2) Relevant guide still beats weak FAQ ---
  const guideQ = "Hvordan fungerer markedsplassen?";
  const guidePack = buildWebsiteKompisEvidencePack({
    question: guideQ,
    locale: "no",
    faqRows: [
      {
        item_id: "faq-hours",
        title: "Åpningstider",
        answer: "Support er tilgjengelig hele døgnet.",
        category: "Support",
        content_type: "faq",
        locale: "no",
        source_url: "https://www.customer.example/no/faq/hours",
        score: 80,
        matched_reason: "question_match",
      },
    ],
    siteIndexHits: [
      {
        documentId: "d-mkt",
        chunkId: "c-mkt",
        title: "Markedsplassen",
        canonicalUrl: "https://www.customer.example/no/marketplace",
        pathname: "/no/marketplace",
        locale: "no",
        excerpt: "Kjøp og selg trygt",
        chunkContent:
          "Markedsplassen lar medlemmer kjøpe og selge trygt på NETTSTED_NAVN.",
        score: 34,
        matchedReason: "public_site_index",
        crawledAt: null,
      },
    ],
  });
  assert.ok(guidePack.evidence.some((e) => /marketplace/i.test(e.url ?? "")));
  assert.ok(!guidePack.evidence.some((e) => e.kind === "faq"));

  // --- 3) Gift paraphrase still finds guide ---
  const giftQ = "Hvor kan jeg bruke gavekortene?";
  const giftTopics = topicTokensForPublicSiteIndex(giftQ);
  assert.ok(giftTopics.some((t) => /gavekort|gift|innløs|redeem/i.test(t)));
  const giftRanked = filterAndRankPublicSiteIndexHits(
    [
      {
        documentId: "d-gift",
        chunkId: "c-gift",
        title: "Gaveguide",
        canonicalUrl: "https://www.customer.example/no/gift-guide",
        pathname: "/no/gift-guide",
        locale: "no",
        excerpt: "Innløs gavekort i markedsplassen.",
        chunkContent:
          "Gavekort kan innløses i markedsplassen og ved betaling for medlemskap.",
        score: 28,
        matchedReason: "public_site_index",
        crawledAt: null,
      },
      {
        documentId: "d-ref2",
        chunkId: "c-ref2",
        title: "Verv",
        canonicalUrl: "https://www.customer.example/no/referrals",
        pathname: "/no/referrals",
        locale: "no",
        excerpt: "Verv venner",
        chunkContent: "Verv og få fordeler.",
        score: 50,
        matchedReason: "public_site_index",
        crawledAt: null,
      },
    ],
    giftQ,
  );
  assert.equal(giftRanked[0]?.pathname, "/no/gift-guide");

  // --- 4) Independent non-FAQ product page ---
  const modelQ = "Hva kan jeg bruke en modellprofil til?";
  const modelPack = buildWebsiteKompisEvidencePack({
    question: modelQ,
    locale: "no",
    faqRows: [],
    siteIndexHits: [
      {
        documentId: "d-model",
        chunkId: "c-model",
        title: "Modellguide",
        canonicalUrl: "https://www.customer.example/no/modell-guide",
        pathname: "/no/modell-guide",
        locale: "no",
        excerpt: "Modellprofiler",
        chunkContent:
          "En modellprofil brukes til å vise portefølje og tilgjengelighet for samarbeid.",
        score: 40,
        matchedReason: "public_site_index",
        crawledAt: null,
      },
      {
        documentId: "d-home2",
        chunkId: "c-home2",
        title: "Hjem",
        canonicalUrl: "https://www.customer.example/no",
        pathname: "/no",
        locale: "no",
        excerpt: "Velkommen",
        chunkContent: "Profiler og medlemskap på NETTSTED_NAVN.",
        score: 45,
        matchedReason: "public_site_index",
        crawledAt: null,
      },
    ],
  });
  assert.ok(
    modelPack.evidence.some((e) => /modell-guide/i.test(e.url ?? "")),
  );
  assert.ok(!modelPack.evidence.some((e) => (e.url ?? "").endsWith("/no")));

  // --- 5) Follow-up uses last user topic only ---
  const follow = resolvePublicCompanionRetrievalIntent("Hvordan gjør jeg det?", [
    { role: "user", text: "Hvor kan jeg bruke gavekortene?" },
    { role: "assistant", text: "Du kan innløse dem i markedsplassen." },
    { role: "user", text: "Hva koster Push?" },
    { role: "assistant", text: "Se publisert prisliste." },
  ]);
  // Last user topic is Push price — follow-up attaches that, not the full chat / gift turn.
  assert.equal(follow.followUpTopicAttached, true);
  assert.match(follow.retrievalQuery, /Push/i);
  assert.doesNotMatch(follow.retrievalQuery, /gavekort/i);

  // --- 6) Ask-chain: FAQ wins over referrals when both returned ---
  const askOptionsBase = {
    requestHost: "www.customer.example",
    rawInstallConfig: {
      website_kompis: {
        enabled: true,
        sources: {
          faq: true,
          currentPage: false,
          aipifyPublic: false,
          publicSiteIndex: true,
        },
      },
    },
    resolveLicensedAvailability: async () => ({
      available: true,
      reason: "available" as const,
      capabilityKey: "website_kompis",
    }),
  };

  // Index-only path (faqCount=0): FAQ hub Q→A must still surface over referrals/home
  const indexOnlyPack = buildWebsiteKompisEvidencePack({
    question: privacyQ,
    locale: "no",
    faqRows: [],
    siteIndexHits: rankedPrivacy,
  });
  assert.ok(
    indexOnlyPack.evidence.some((e) => /\/faq/i.test(e.url ?? "")),
  );
  assert.ok(
    !indexOnlyPack.evidence.some((e) => /\/referrals/i.test(e.url ?? "")),
  );

  const askPrivacyIndexOnly = await askPublicPlatformCompanion(
    {
      question: privacyQ,
      locale: "no",
      domain: "www.customer.example",
      installId: "11111111-1111-4111-8111-111111111111",
    },
    {
      ...askOptionsBase,
      searchTenantVisitorKnowledge: async () => [],
      searchTenantPublicSiteIndex: async () => privacyHits,
      groundedCompletion: async () => ({
        ok: true as const,
        text: JSON.stringify({
          covered: true,
          answer:
            "Nei. Profilen din indekseres ikke av eksterne søkemotorer. Kun innloggede medlemmer ser profilinnholdet.",
          sourceIds: ["index:c-faq"],
          followUp: null,
        }),
        modelProfile: "kompis_result_summary_v1",
        latencyMs: 10,
        usage: { inputUnits: 10, outputUnits: 12, totalUnits: 22 },
      }),
    },
  );
  assert.match(askPrivacyIndexOnly.answer.directAnswer, /ikke|søkemotor|medlem/i);
  assert.ok(askPrivacyIndexOnly.sources.some((s) => /faq/i.test(s.route)));
  assert.ok(!askPrivacyIndexOnly.sources.some((s) => /referral/i.test(s.route)));

  const askPrivacy = await askPublicPlatformCompanion(
    {
      question: privacyQ,
      locale: "no",
      domain: "www.customer.example",
      installId: "11111111-1111-4111-8111-111111111111",
    },
    {
      ...askOptionsBase,
      searchTenantVisitorKnowledge: async () => [privacyFaq],
      searchTenantPublicSiteIndex: async () => privacyHits,
      groundedCompletion: async () => ({
        ok: true as const,
        text: JSON.stringify({
          covered: true,
          answer:
            "Nei. Profilen din indekseres ikke av eksterne søkemotorer. Kun innloggede medlemmer ser profilinnholdet.",
          sourceIds: ["faq:faq-search-visibility"],
          followUp: null,
        }),
        modelProfile: "kompis_result_summary_v1",
        latencyMs: 10,
        usage: { inputUnits: 10, outputUnits: 12, totalUnits: 22 },
      }),
    },
  );
  assert.match(askPrivacy.answer.directAnswer, /ikke|søkemotor|medlem/i);
  assert.ok(
    askPrivacy.sources.some((s) => /faq/i.test(s.route)),
  );
  assert.ok(!askPrivacy.sources.some((s) => /referral/i.test(s.route)));

  console.log(
    JSON.stringify(
      {
        firstBreak:
          "FAQ hub body matches (topicScore 2–3) were demoted to 0 and dropped; weak / and /referrals kept loose keyword ties",
        controls: {
          faqOverWeakGeneral: "pass",
          guideOverWeakFaq: "pass",
          giftParaphrase: "pass",
          modelGuide: "pass",
          followUpLastTopic: "pass",
          askChainFaq: "pass",
        },
      },
      null,
      2,
    ),
  );
  console.log("website-kompis-faq-multi-source-regression-54.test.ts: all assertions passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
