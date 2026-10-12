/**
 * Job 53 — intent rewrite + multi-source retrieval through the ask chain.
 * Generic fixtures only (NETTSTED / customer.example). No UnoNight production copy.
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
  } = await import("./website-kompis-retrieval-intent");
  const {
    askPublicPlatformCompanion,
    buildPublicCompanionRetrievalQuestion,
    resolvePublicCompanionRetrievalIntent,
  } = await import("./public-companion-ask");
  const {
    buildWebsiteKompisEvidencePack,
  } = await import("./website-kompis-grounded-answer");
  const {
    filterAndRankPublicSiteIndexHits,
    topicTokensForPublicSiteIndex,
  } = await import("./website-kompis-public-site-index/answer");
  const {
    WEBSITE_KOMPIS_PUBLIC_ANSWER_POLICY_ID,
    buildWebsiteKompisPublicAnswerPolicyPrompt,
    resolveWebsiteKompisPublicAnswerPolicyRuntimeLink,
  } = await import("./website-kompis-public-answer-policy");
  const {
    expandPublicSiteIndexSearchLocales,
  } = await import("./website-kompis-public-site-index/locale-contract");
  const {
    WEBSITE_KOMPIS_EMBED_CLOSED_WIDTH_PX,
    WEBSITE_KOMPIS_EMBED_OPEN_WIDTH_PX,
    WEBSITE_KOMPIS_EMBED_OPEN_HEIGHT_PX,
  } = await import("./website-kompis-embed");

  // --- Locked regressions (approved behavior) ---
  assert.deepEqual(expandPublicSiteIndexSearchLocales("no"), ["no", "nb"]);
  assert.deepEqual(expandPublicSiteIndexSearchLocales("nn"), ["nn"]);
  assert.equal(WEBSITE_KOMPIS_EMBED_CLOSED_WIDTH_PX, 72);
  assert.equal(WEBSITE_KOMPIS_EMBED_OPEN_WIDTH_PX, 450);
  assert.equal(WEBSITE_KOMPIS_EMBED_OPEN_HEIGHT_PX, 800);
  assert.match(
    buildWebsiteKompisPublicAnswerPolicyPrompt("no"),
    new RegExp(WEBSITE_KOMPIS_PUBLIC_ANSWER_POLICY_ID),
  );
  assert.equal(
    resolveWebsiteKompisPublicAnswerPolicyRuntimeLink().policyId,
    WEBSITE_KOMPIS_PUBLIC_ANSWER_POLICY_ID,
  );
  assert.equal(
    resolveWebsiteKompisPublicAnswerPolicyRuntimeLink().toneHelper,
    "buildWebsiteKompisWarmSafeFallbackCopy",
  );

  // 1) Natural gift-card paraphrase → synonym-boosted retrieval
  const giftQ = "Hvor kan jeg bruke gavekortene?";
  const giftIntent = rewriteWebsiteKompisRetrievalIntent({ question: giftQ });
  assert.match(giftIntent.normalizedIntent, /gavekort|gift|bruke|redeem|innløs/i);
  assert.match(giftIntent.retrievalQuery, /gavekort/i);
  assert.ok(giftIntent.focusTokens.some((t) => /innløs|redeem|bruke|gift/i.test(t)));
  const giftTopics = topicTokensForPublicSiteIndex(giftQ);
  assert.ok(giftTopics.some((t) => /gavekort|gift|innløs|redeem/i.test(t)));

  const giftIndexHits = filterAndRankPublicSiteIndexHits(
    [
      {
        documentId: "doc-gift",
        chunkId: "chunk-gift",
        title: "Gaveguide",
        canonicalUrl: "https://customer.example/no/gifts",
        pathname: "/no/gifts",
        locale: "no",
        excerpt: "Innløs gavekort når du handler i markedsplassen.",
        chunkContent:
          "Gavekort kan innløses i markedsplassen og ved betaling for medlemskap på NETTSTED_NAVN.",
        score: 28,
        matchedReason: "public_site_index",
        crawledAt: null,
      },
      {
        documentId: "doc-privacy",
        chunkId: "chunk-privacy",
        title: "Personvern",
        canonicalUrl: "https://customer.example/no/privacy",
        pathname: "/no/privacy",
        locale: "no",
        excerpt: "Slik behandler vi personopplysninger.",
        chunkContent: "Personvernregler for NETTSTED_NAVN.",
        score: 40,
        matchedReason: "public_site_index",
        crawledAt: null,
      },
    ],
    giftIntent.retrievalQuery,
  );
  assert.ok(giftIndexHits.length >= 1);
  assert.match(giftIndexHits[0]!.pathname, /gift/i);

  // 2) Product/info page from site-index even with large unrelated FAQ present
  const productQ = "Hvordan fungerer markedsplassen?";
  const productPack = buildWebsiteKompisEvidencePack({
    question: productQ,
    locale: "no",
    faqRows: [
      {
        item_id: "faq-unrelated",
        title: "Åpningstider",
        answer: "Vi har åpent hele døgnet for support.",
        category: "Support",
        content_type: "faq",
        locale: "no",
        source_url: "https://customer.example/no/faq/hours",
        score: 55,
        matched_reason: "question_match",
      },
    ],
    siteIndexHits: [
      {
        documentId: "doc-market",
        chunkId: "chunk-market",
        title: "Markedsplassen",
        canonicalUrl: "https://customer.example/no/marketplace",
        pathname: "/no/marketplace",
        locale: "no",
        excerpt: "Kjøp og selg trygt mellom medlemmer.",
        chunkContent:
          "Markedsplassen lar medlemmer kjøpe og selge produkter trygt på NETTSTED_NAVN.",
        score: 36,
        matchedReason: "public_site_index",
        crawledAt: null,
      },
    ],
  });
  assert.ok(productPack.evidence.some((e) => e.kind === "public-site-index"));
  assert.ok(
    !productPack.evidence.some((e) => e.kind === "faq" && /åpningstid/i.test(e.text)),
  );

  // 3) Real FAQ question still selects FAQ evidence
  const faqQ = "Er medlemskap gratis?";
  const faqPack = buildWebsiteKompisEvidencePack({
    question: faqQ,
    locale: "no",
    faqRows: [
      {
        item_id: "faq-member",
        title: "Medlemskap",
        answer: "Bronze-medlemskap er gratis for nye medlemmer.",
        category: "Medlemskap",
        content_type: "faq",
        locale: "no",
        source_url: "https://customer.example/no/faq/membership",
        score: 48,
        matched_reason: "question_match",
      },
    ],
    siteIndexHits: [],
  });
  assert.ok(faqPack.evidence.some((e) => e.kind === "faq"));
  assert.match(faqPack.evidence[0]!.text, /gratis/i);

  // 4) Ambiguous question must not keep thematically unrelated high-score FAQ
  const ambQ = "Hvordan sender jeg gaver?";
  const ambPack = buildWebsiteKompisEvidencePack({
    question: ambQ,
    locale: "no",
    faqRows: [
      {
        item_id: "faq-billing",
        title: "Faktura",
        answer: "Du finner faktura under kontoinnstillinger for betaling.",
        category: "Billing",
        content_type: "faq",
        locale: "no",
        source_url: "https://customer.example/no/faq/billing",
        score: 90,
        matched_reason: "question_match",
      },
    ],
    siteIndexHits: [
      {
        documentId: "doc-gifts",
        chunkId: "chunk-gifts",
        title: "Gaver",
        canonicalUrl: "https://customer.example/no/gifts",
        pathname: "/no/gifts",
        locale: "no",
        excerpt: "Send gaver trygt til andre medlemmer.",
        chunkContent: "Slik sender du gaver og gavekort på NETTSTED_NAVN.",
        score: 30,
        matchedReason: "public_site_index",
        crawledAt: null,
      },
    ],
  });
  assert.ok(ambPack.evidence.some((e) => e.kind === "public-site-index"));
  assert.ok(!ambPack.evidence.some((e) => e.id.includes("faq-billing")));

  // 5) Follow-up uses last user topic; older themes stay out of retrieval string
  const follow = resolvePublicCompanionRetrievalIntent("fortell mer", [
    { role: "user", text: "Hvordan fungerer frakt på markedsplassen?" },
    { role: "assistant", text: "Selgeren setter fraktprisen." },
    { role: "user", text: "Hva med personvernreglene fra i fjor?" },
    { role: "assistant", text: "Se personvernsiden." },
    { role: "user", text: "Hvordan fungerer frakt på markedsplassen?" },
    { role: "assistant", text: "Selgeren setter fraktprisen for fysiske varer." },
  ]);
  assert.equal(follow.followUpTopicAttached, true);
  assert.match(follow.retrievalQuery, /frakt|markedsplass/i);
  // Must not concatenate the entire transcript as role-prefixed lines
  assert.doesNotMatch(follow.retrievalQuery, /^user:/m);
  assert.doesNotMatch(
    buildPublicCompanionRetrievalQuestion("Hva koster medlemskap?", [
      { role: "user", text: "Gammelt tema om faktura" },
      { role: "assistant", text: "Se faktura." },
    ]),
    /Gammelt tema om faktura/,
  );

  // 6) Provider + fallback share the same policy id (cannot bypass)
  const policyPrompt = buildWebsiteKompisPublicAnswerPolicyPrompt("en");
  assert.match(policyPrompt, /human-friendly|Policy-id/i);
  assert.match(policyPrompt, /ONLY the provided evidence/i);

  // Ask-chain: gift paraphrase finds index evidence; FAQ regression still works
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

  const giftAsk = await askPublicPlatformCompanion(
    {
      question: giftQ,
      locale: "no",
      domain: "www.customer.example",
      installId: "11111111-1111-4111-8111-111111111111",
    },
    {
      ...askOptionsBase,
      searchTenantVisitorKnowledge: async () => [
        {
          item_id: "faq-hours",
          title: "Support",
          answer: "Support er tilgjengelig hele døgnet.",
          category: "Support",
          content_type: "faq",
          locale: "no",
          source_url: "https://www.customer.example/no/faq/support",
          score: 40,
          matched_reason: "question_match",
        },
      ],
      searchTenantPublicSiteIndex: async () => [
        {
          documentId: "doc-gift",
          chunkId: "chunk-gift",
          title: "Gaveguide",
          canonicalUrl: "https://www.customer.example/no/gifts",
          pathname: "/no/gifts",
          locale: "no",
          excerpt: "Innløs gavekort i markedsplassen.",
          chunkContent:
            "Du kan bruke gavekortene i markedsplassen og ved betaling for medlemskap.",
          score: 34,
          matchedReason: "public_site_index",
          crawledAt: null,
        },
      ],
      groundedCompletion: async () => ({
        ok: true as const,
        text: JSON.stringify({
          covered: true,
          answer:
            "Du kan bruke gavekortene i markedsplassen og ved betaling for medlemskap.",
          sourceIds: ["index:chunk-gift"],
          followUp: null,
        }),
        modelProfile: "kompis_result_summary_v1",
        latencyMs: 10,
        usage: { inputUnits: 10, outputUnits: 12, totalUnits: 22 },
      }),
    },
  );
  assert.match(giftAsk.answer.directAnswer, /gavekort|markedsplass/i);
  assert.ok(
    giftAsk.sources.some((s) => /gift/i.test(s.route) || /gave/i.test(s.title)),
  );

  const faqAsk = await askPublicPlatformCompanion(
    {
      question: "Er medlemskap gratis?",
      locale: "no",
      domain: "www.customer.example",
      installId: "11111111-1111-4111-8111-111111111111",
    },
    {
      ...askOptionsBase,
      searchTenantVisitorKnowledge: async () => [
        {
          item_id: "faq-member",
          title: "Medlemskap",
          answer: "Bronze-medlemskap er gratis for nye medlemmer.",
          category: "Medlemskap",
          content_type: "faq",
          locale: "nb",
          source_url: "https://www.customer.example/no/faq/membership",
          score: 52,
          matched_reason: "question_match",
        },
      ],
      searchTenantPublicSiteIndex: async () => [],
      groundedCompletion: async () => ({
        ok: true as const,
        text: JSON.stringify({
          covered: true,
          answer: "Bronze-medlemskap er gratis for nye medlemmer.",
          sourceIds: ["faq:faq-member"],
          followUp: null,
        }),
        modelProfile: "kompis_result_summary_v1",
        latencyMs: 10,
        usage: { inputUnits: 10, outputUnits: 12, totalUnits: 22 },
      }),
    },
  );
  assert.match(faqAsk.answer.directAnswer, /gratis/i);

  console.log(
    JSON.stringify(
      {
        controls: {
          giftParaphrase: {
            normalizedIntent: giftIntent.normalizedIntent,
            retrievalQuery: giftIntent.retrievalQuery,
            evidenceIds: giftIndexHits.map((h) => h.chunkId),
            policyId: WEBSITE_KOMPIS_PUBLIC_ANSWER_POLICY_ID,
            result: "pass",
          },
          siteIndexOverFaq: {
            evidenceKinds: productPack.evidence.map((e) => e.kind),
            result: "pass",
          },
          faqStillWins: {
            evidenceIds: faqPack.evidence.map((e) => e.id),
            result: "pass",
          },
          ambiguousRejectsUnrelatedFaq: {
            evidenceIds: ambPack.evidence.map((e) => e.id),
            result: "pass",
          },
          followUpTopic: {
            retrievalQuery: follow.retrievalQuery,
            followUpTopicAttached: follow.followUpTopicAttached,
            result: "pass",
          },
          policyLink: {
            policyId: WEBSITE_KOMPIS_PUBLIC_ANSWER_POLICY_ID,
            result: "pass",
          },
        },
      },
      null,
      2,
    ),
  );
  console.log("website-kompis-intent-multi-source-retrieval-53.test.ts: all assertions passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
