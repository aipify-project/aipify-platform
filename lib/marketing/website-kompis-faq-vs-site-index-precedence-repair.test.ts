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

installServerOnlyShim();

const INSTALL_ID = "11111111-1111-4111-8111-111111111111";
const DOMAIN = "www.customer.example";
const QUESTION = "Hva gjør jeg hvis en e-post ikke kommer frem?";
const FAQ_ANSWER =
  "Sjekk søppelpost/spam, vent noen minutter, og be support sende e-posten på nytt. Kontroller også varslingsinnstillingene.";

const strongEmailFaq = {
  item_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  title: "E-post kommer ikke frem",
  answer: FAQ_ANSWER,
  category: "support",
  content_type: "faq",
  locale: "no",
  source_url: null as string | null,
  score: 80,
  matched_reason: "question" as const,
};

/**
 * Off-topic homepage that still scores high enough for current_page (shared "e-post"
 * via verification copy) — mirrors the owner PROD-OBSERVED failure mode without
 * customer-specific Core hardcoding.
 */
const offTopicHeavyPageContext = {
  pathname: "/no",
  title: "Customer — Verifisert voksen sosialplattform",
  metaDescription: "Verifisert fellesskap med e-post og identitetssjekk.",
  surface: "public" as const,
  locale: "no",
  headings: [
    { level: 1 as const, text: "Customer — Verifisert voksen sosialplattform" },
    { level: 2 as const, text: "E-post og identitet" },
  ],
  textSnippets: [
    "Vi støtter flere kjønn og tryggere samhandling.",
    "E-post brukes til e-postverifisering når du oppretter konto.",
    "Identitetssjekk og e-post hjelper oss å bekrefte at medlemmer er voksne.",
    "Hvis e-post mangler i innboksen under verifisering, sjekk spam for verifiseringslenken.",
  ],
};

const offTopicIndexHit = {
  documentId: "11111111-1111-4111-8111-111111111111",
  chunkId: "22222222-2222-4222-8222-222222222222",
  title: "Verifisering og trygghet",
  canonicalUrl: `https://${DOMAIN}/no/verification`,
  pathname: "/no/verification",
  locale: "no",
  excerpt: "Identitetssjekk og e-postverifisering",
  chunkContent:
    "Vi støtter flere kjønn. Identitetssjekk og e-postverifisering holder plattformen trygg for voksne medlemmer. E-post brukes bare til verifisering.",
  score: 22,
  matchedReason: "public_site_index" as const,
  crawledAt: new Date().toISOString(),
};

async function main() {
  const {
    askPublicPlatformCompanion,
    shouldDeferCompetingSurfaceForStrongCollectedFaq,
  } = await import("@/lib/marketing/public-companion-ask");
  const { scoreWebsiteKompisPublicPageContextMatch } = await import(
    "@/lib/marketing/website-kompis-public-page-context"
  );
  const { isRelevantPublicCompanionTenantFaqResult } = await import(
    "@/lib/marketing/public-companion-tenant-faq"
  );

  assert.equal(
    isRelevantPublicCompanionTenantFaqResult([strongEmailFaq], QUESTION),
    true,
  );

  const pageScore = scoreWebsiteKompisPublicPageContextMatch(
    QUESTION,
    offTopicHeavyPageContext,
  );
  assert.ok(pageScore >= 4, `expected competing page score >= 4, got ${pageScore}`);

  assert.equal(
    shouldDeferCompetingSurfaceForStrongCollectedFaq({
      question: QUESTION,
      faqRows: [strongEmailFaq],
      competingText: [
        ...offTopicHeavyPageContext.textSnippets,
        offTopicHeavyPageContext.title,
        offTopicHeavyPageContext.metaDescription,
      ].join("\n"),
      competingTopicScore: pageScore,
      competingWinFloor: 6,
    }),
    true,
    "strong email FAQ must defer off-topic verification page",
  );

  process.env.VERCEL_ENV = "preview";

  const askOptions = {
    requestHost: DOMAIN,
    resolveLicensedAvailability: async () => ({
      available: true,
      reason: "available" as const,
      capabilityKey: "website_kompis",
    }),
    groundedCompletion: async () => ({
      ok: false as const,
      errorCode: "test_provider_denied",
      modelProfile: "test",
    }),
    rawInstallConfig: {
      website_kompis: {
        enabled: true,
        sources: {
          faq: true,
          currentPage: true,
          aipifyPublic: false,
          publicSiteIndex: true,
        },
      },
    },
    searchTenantVisitorKnowledge: async () => [strongEmailFaq],
    searchTenantPublicSiteIndex: async () => [offTopicIndexHit],
  };

  const response = await askPublicPlatformCompanion(
    {
      question: QUESTION,
      locale: "no",
      installId: INSTALL_ID,
      domain: DOMAIN,
      pageContext: offTopicHeavyPageContext,
    },
    askOptions,
  );

  // AFTER fix: strong FAQ must win over off-topic page/index.
  assert.equal(response.answer.directAnswer.trim(), FAQ_ANSWER);
  assert.doesNotMatch(
    response.answer.directAnswer,
    /Her er det jeg finner på denne siden:/i,
  );
  assert.doesNotMatch(
    response.answer.directAnswer,
    /kjønn|Identitetssjekk|verifiseringslenken/i,
  );
  const diagnosticPath = (
    response as { diagnostics?: { answerPath?: string; publicAnswerPath?: string } }
  ).diagnostics;
  assert.ok(
    diagnosticPath?.answerPath === "faq" ||
      diagnosticPath?.publicAnswerPath === "faq" ||
      response.answer.directAnswer.trim() === FAQ_ANSWER,
    "expected FAQ answer path after precedence repair",
  );

  // Strong on-topic page must still win over a weak FAQ.
  const weakFaq = {
    ...strongEmailFaq,
    item_id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    title: "Medlemskap",
    answer: "Medlemskap gir tilgang til flere funksjoner.",
    score: 12,
    matched_reason: "token_match" as const,
  };
  const onTopicPage = {
    pathname: "/no/email-help",
    title: "E-post kommer ikke frem",
    metaDescription: "Hjelp når e-post ikke kommer frem",
    surface: "public" as const,
    locale: "no",
    headings: [{ level: 1 as const, text: "E-post kommer ikke frem" }],
    textSnippets: [
      "Hvis e-post ikke kommer frem: sjekk søppelpost, vent, og be oss sende på nytt.",
    ],
  };
  const onTopicPageScore = scoreWebsiteKompisPublicPageContextMatch(QUESTION, onTopicPage);
  assert.equal(
    shouldDeferCompetingSurfaceForStrongCollectedFaq({
      question: QUESTION,
      faqRows: [weakFaq],
      competingText: onTopicPage.textSnippets.join("\n"),
      competingTopicScore: onTopicPageScore,
      competingWinFloor: 6,
    }),
    false,
    "weak/irrelevant FAQ must not defer a stronger on-topic page",
  );

  const onTopicPageAsk = await askPublicPlatformCompanion(
    {
      question: QUESTION,
      locale: "no",
      installId: INSTALL_ID,
      domain: DOMAIN,
      pageContext: onTopicPage,
    },
    {
      ...askOptions,
      searchTenantVisitorKnowledge: async () => [weakFaq],
      searchTenantPublicSiteIndex: async () => [],
    },
  );
  assert.match(
    onTopicPageAsk.answer.directAnswer,
    /Her er det jeg finner på denne siden:|søppelpost|e-post/i,
  );
  assert.doesNotMatch(onTopicPageAsk.answer.directAnswer, /Medlemskap gir tilgang/i);

  // Strong relevant site-index vs weak FAQ → site (no current page)
  const strongIndexHit = {
    ...offTopicIndexHit,
    title: "E-post kommer ikke frem",
    pathname: "/no/email-help",
    canonicalUrl: `https://${DOMAIN}/no/email-help`,
    excerpt: "Sjekk søppelpost når e-post ikke kommer frem",
    chunkContent:
      "Hvis e-post ikke kommer frem: sjekk søppelpost og spam, vent noen minutter, og kontakt support.",
    score: 40,
  };
  const strongIndexAsk = await askPublicPlatformCompanion(
    {
      question: QUESTION,
      locale: "no",
      installId: INSTALL_ID,
      domain: DOMAIN,
      pageContext: {
        pathname: "/no/other",
        title: "Annet",
        surface: "public" as const,
        locale: "no",
        headings: [],
        textSnippets: ["Velkommen til siden."],
      },
    },
    {
      ...askOptions,
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
      searchTenantVisitorKnowledge: async () => [weakFaq],
      searchTenantPublicSiteIndex: async () => [strongIndexHit],
    },
  );
  assert.doesNotMatch(strongIndexAsk.answer.directAnswer, /Medlemskap gir tilgang/i);
  assert.match(strongIndexAsk.answer.directAnswer, /søppelpost|spam|e-post/i);

  // FAQ source off → no FAQ win
  const faqOff = await askPublicPlatformCompanion(
    {
      question: QUESTION,
      locale: "no",
      installId: INSTALL_ID,
      domain: DOMAIN,
      pageContext: offTopicHeavyPageContext,
    },
    {
      ...askOptions,
      rawInstallConfig: {
        website_kompis: {
          enabled: true,
          sources: {
            faq: false,
            currentPage: true,
            aipifyPublic: false,
            publicSiteIndex: false,
          },
        },
      },
      searchTenantVisitorKnowledge: async () => {
        throw new Error("FAQ search must not run when FAQ source is off");
      },
    },
  );
  assert.doesNotMatch(
    faqOff.answer.directAnswer,
    new RegExp(FAQ_ANSWER.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
  );

  // Empty evidence pack behavior from #338: collected FAQ still reachable after deferral
  const emptyPackFaq = await askPublicPlatformCompanion(
    {
      question: QUESTION,
      locale: "no",
      installId: INSTALL_ID,
      domain: DOMAIN,
      pageContext: offTopicHeavyPageContext,
    },
    {
      ...askOptions,
      groundedCompletion: async () => ({
        ok: false as const,
        errorCode: "test_provider_denied",
        modelProfile: "test",
      }),
      searchTenantPublicSiteIndex: async () => [],
    },
  );
  assert.equal(emptyPackFaq.answer.directAnswer.trim(), FAQ_ANSWER);

  console.log(
    "website-kompis-faq-vs-site-index-precedence-repair.test.ts: all assertions passed",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
