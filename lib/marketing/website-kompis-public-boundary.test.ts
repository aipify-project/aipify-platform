import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const require = createRequire(import.meta.url);

function installServerOnlyShim(): void {
  const moduleApi = require("node:module") as {
    Module: {
      _load: (request: string, parent: unknown, isMain: boolean) => unknown;
    };
  };
  const originalLoad = moduleApi.Module._load;
  moduleApi.Module._load = function (request, parent, isMain) {
    if (request === "server-only") {
      return {};
    }
    return originalLoad.call(this, request, parent, isMain);
  };
}

async function main() {
  installServerOnlyShim();

  const {
    WEBSITE_KOMPIS_SAFE_FALLBACK_SOURCE,
    buildWebsiteKompisPrivateScopeRefusalResponse,
    buildWebsiteKompisSafeFallbackResponse,
    isCustomerWebsiteVisitorContext,
    isAipifyBrandedCustomerSiteFeatureQuestion,
    isContinuingCustomerSiteTopicFollowUp,
    isExplicitAipifyOrKompisQuestion,
    isExplicitAipifyPricingQuestion,
    isOutOfScopePrivateMemberOrAdminQuestion,
    shouldAllowAipifyPlatformKnowledgeOnCustomerWebsite,
  } = await import("./website-kompis-public-boundary");

  const { WEBSITE_KOMPIS_PUBLIC_PAGE_CONTEXT_SOURCE } = await import(
    "./website-kompis-public-page-context"
  );

  const { askPublicPlatformCompanion } = await import("./public-companion-ask");

  assert.equal(isExplicitAipifyOrKompisQuestion("Hva er Aipify Kompis?"), true);
  assert.equal(isExplicitAipifyOrKompisQuestion("Hvordan fungerer denne Kompis-widgeten?"), true);
  assert.equal(isExplicitAipifyOrKompisQuestion("Hvilken løsninger har dere?"), false);
  assert.equal(isExplicitAipifyOrKompisQuestion("Har dere åpent i påsken?"), false);
  assert.equal(isExplicitAipifyOrKompisQuestion("Kan jeg bli partner?"), false);
  assert.equal(isExplicitAipifyPricingQuestion("Hva koster Aipify?"), true);
  assert.equal(isExplicitAipifyPricingQuestion("Hvilke priser har dere?"), false);
  assert.equal(
    isExplicitAipifyPricingQuestion(
      "How much does the Aipify Platform subscription cost for enterprises?",
    ),
    true,
  );
  assert.equal(isExplicitAipifyPricingQuestion("Hvilke pakker selger Aipify?"), true);
  assert.equal(shouldAllowAipifyPlatformKnowledgeOnCustomerWebsite("Hva er Aipify?"), true);
  assert.equal(shouldAllowAipifyPlatformKnowledgeOnCustomerWebsite("Hvilke fordeler får jeg her?"), false);
  assert.equal(isAipifyBrandedCustomerSiteFeatureQuestion("Hva er Aipify Verify?"), true);
  assert.equal(isAipifyBrandedCustomerSiteFeatureQuestion("Hva er Aipify?"), false);
  assert.equal(
    shouldAllowAipifyPlatformKnowledgeOnCustomerWebsite("Hva er Aipify Verify?"),
    false,
  );
  // P1: Aipify Platform package/subscription pricing never allowed on customer hosts.
  assert.equal(
    shouldAllowAipifyPlatformKnowledgeOnCustomerWebsite("Hvilke pakker selger Aipify?"),
    false,
  );
  assert.equal(
    shouldAllowAipifyPlatformKnowledgeOnCustomerWebsite("Hva koster Aipify?"),
    false,
  );
  assert.equal(
    shouldAllowAipifyPlatformKnowledgeOnCustomerWebsite(
      "How much does the Aipify Platform subscription cost for enterprises?",
    ),
    false,
  );
  const safetyThread = [
    {
      role: "user" as const,
      text: "Hvordan fungerer sikkerhet og verifisering?",
    },
    {
      role: "assistant" as const,
      text: "Ut fra nettstedets offentlige sider: Aipify Verify og bildekontroll.",
    },
  ];
  assert.equal(
    isContinuingCustomerSiteTopicFollowUp("Hva er Aipify Verify?", safetyThread),
    true,
  );
  assert.equal(
    shouldAllowAipifyPlatformKnowledgeOnCustomerWebsite("Hva er Aipify Verify?", safetyThread),
    false,
  );
  assert.equal(
    shouldAllowAipifyPlatformKnowledgeOnCustomerWebsite("Hva er Aipify?", safetyThread),
    true,
  );
  assert.equal(
    shouldAllowAipifyPlatformKnowledgeOnCustomerWebsite("Hva koster Aipify?", safetyThread),
    false,
  );
  assert.equal(
    isContinuingCustomerSiteTopicFollowUp("fortell mer", safetyThread),
    true,
  );

  assert.equal(
    isOutOfScopePrivateMemberOrAdminQuestion(
      "Hvordan logger jeg inn på min private medlemskonto og adminpanel?",
    ),
    true,
  );
  assert.equal(isOutOfScopePrivateMemberOrAdminQuestion("Hva er min private kontostatus?"), true);
  assert.equal(isOutOfScopePrivateMemberOrAdminQuestion("Hvordan logger jeg inn?"), false);
  assert.equal(
    isOutOfScopePrivateMemberOrAdminQuestion("Hvordan oppgraderer jeg medlemskapet?"),
    false,
  );
  const privateRefusalCopy = buildWebsiteKompisPrivateScopeRefusalResponse("no", "www.customer.example");
  assert.equal(privateRefusalCopy.sources.length, 0);
  assert.match(privateRefusalCopy.answer.directAnswer, /private medlemskontoer|admin/i);

  const customerPageContext = {
    pathname: "/medlemskap",
    title: "Medlemskap og fordeler",
    metaDescription: "Se fordeler med medlemskap hos Example.",
    surface: "public" as const,
    headings: [{ level: 1 as const, text: "Medlemskap og fordeler" }],
    textSnippets: ["Som medlem får du eksklusive fordeler og rabatter."],
  };

  const customerAskOptions = {
    requestHost: "example-a.test",
    rawInstallConfig: {
      website_kompis: {
        enabled: true,
        sources: {
          faq: true,
          currentPage: true,
          aipifyPublic: true,
          publicSiteIndex: false,
        },
      },
    },
    resolveLicensedAvailability: async () => ({
      available: true,
      reason: "available" as const,
      capabilityKey: "website_kompis",
    }),
  };

  assert.equal(
    isCustomerWebsiteVisitorContext({
      installId: "180c9d31-3340-4633-b210-3b64edf1e1be",
      domain: "unonight.com",
    }),
    true,
  );
  assert.equal(
    isCustomerWebsiteVisitorContext({ installId: null, domain: "aipify.ai" }),
    false,
  );
  assert.equal(
    isCustomerWebsiteVisitorContext({ installId: null, domain: null }),
    false,
  );

  const fallback = buildWebsiteKompisSafeFallbackResponse("no", "unonight.com");
  assert.match(fallback.answer.directAnswer, /Unonight/);
  assert.match(fallback.answer.directAnswer, /Ta gjerne kontakt/);
  assert.equal(fallback.sources[0]?.route, WEBSITE_KOMPIS_SAFE_FALLBACK_SOURCE);

  const installId = "180c9d31-3340-4633-b210-3b64edf1e1be";
  let rpcCalled = false;

  const genericResponse = await askPublicPlatformCompanion(
    {
      question: "Hvilken løsninger har dere?",
      locale: "no",
      domain: "unonight.com",
      installId,
    },
    {
      ...customerAskOptions,
      requestHost: "unonight.com",
      searchTenantVisitorKnowledge: async () => {
        rpcCalled = true;
        return [];
      },
    },
  );

  assert.equal(rpcCalled, true);
  assert.equal(genericResponse.sources[0]?.route, WEBSITE_KOMPIS_SAFE_FALLBACK_SOURCE);
  assert.ok(
    !genericResponse.sources.some((source) => source.route.includes("aipify-capabilities")),
  );
  assert.ok(
    !genericResponse.sources.some((source) => source.route.includes("platform-fallback")),
  );

  const currentPageResponse = await askPublicPlatformCompanion(
    {
      question: "Hva handler denne siden om?",
      locale: "no",
      domain: "example-a.test",
      installId,
      pageContext: customerPageContext,
    },
    {
      ...customerAskOptions,
      searchTenantVisitorKnowledge: async () => [],
    },
  );
  assert.equal(currentPageResponse.sources[0]?.route, WEBSITE_KOMPIS_PUBLIC_PAGE_CONTEXT_SOURCE);
  assert.match(
    currentPageResponse.answer.directAnswer,
    /Her er det jeg finner på denne siden:/,
  );

  const benefitsHereResponse = await askPublicPlatformCompanion(
    {
      question: "Hvilke fordeler får jeg her?",
      locale: "no",
      domain: "example-a.test",
      installId,
      pageContext: customerPageContext,
    },
    {
      ...customerAskOptions,
      searchTenantVisitorKnowledge: async () => [],
    },
  );
  assert.equal(benefitsHereResponse.sources[0]?.route, WEBSITE_KOMPIS_PUBLIC_PAGE_CONTEXT_SOURCE);
  assert.ok(
    !benefitsHereResponse.sources.some((source) => source.route.includes("aipify-capabilities")),
  );

  const faqResponse = await askPublicPlatformCompanion(
    {
      question: "Hvilken løsninger har dere?",
      locale: "no",
      domain: "example-a.test",
      installId,
    },
    {
      ...customerAskOptions,
      searchTenantVisitorKnowledge: async () => [
        {
          item_id: "faq-1",
          title: "Løsninger og tjenester",
          answer: "Vi tilbyr medlemskap, markedsplass og støtte for besøkende på nettstedet.",
          category: "løsninger",
          content_type: "faq",
          locale: "no",
          source_url: null,
          score: 42,
          matched_reason: "title",
        },
      ],
    },
  );
  assert.ok(
    faqResponse.sources.some((source) => source.route.startsWith("website-kompis-faq:")),
    `expected website-kompis-faq source, got ${JSON.stringify(faqResponse.sources)}`,
  );
  assert.ok(
    !faqResponse.sources.some((source) => source.route.includes("aipify-capabilities")),
  );

  const easterFallback = await askPublicPlatformCompanion(
    {
      question: "Har dere åpent i påsken?",
      locale: "no",
      domain: "unonight.com",
      installId,
    },
    {
      ...customerAskOptions,
      requestHost: "unonight.com",
      searchTenantVisitorKnowledge: async () => [],
    },
  );
  assert.equal(easterFallback.sources[0]?.route, WEBSITE_KOMPIS_SAFE_FALLBACK_SOURCE);
  assert.match(easterFallback.answer.directAnswer, /Unonight/);
  assert.match(easterFallback.answer.directAnswer, /Ta gjerne kontakt/);

  const explicitAipify = await askPublicPlatformCompanion(
    {
      question: "Hva er Aipify Kompis?",
      locale: "no",
      domain: "unonight.com",
      installId,
    },
    {
      ...customerAskOptions,
      requestHost: "unonight.com",
      searchTenantVisitorKnowledge: async () => [],
    },
  );
  assert.ok(
    explicitAipify.sources.some(
      (source) =>
        source.route.includes("aipify-capabilities") ||
        source.route.includes("aipify-overview") ||
        source.route.includes("aipifyCompanion"),
    ),
    `expected Aipify/Core public source, got ${JSON.stringify(explicitAipify.sources)}`,
  );
  assert.ok(
    !explicitAipify.sources.some((source) =>
      source.route.includes(WEBSITE_KOMPIS_SAFE_FALLBACK_SOURCE),
    ),
  );

  const marketingCore = await askPublicPlatformCompanion({
    question: "Hvilken løsninger har dere?",
    locale: "no",
  });
  assert.ok(
    marketingCore.sources.some((source) => source.route.includes("aipify-capabilities")),
    `expected aipify-capabilities on marketing ask, got ${JSON.stringify(marketingCore.sources)}`,
  );

  // Tenant A FAQ must not surface for tenant B install/domain.
  const tenantAInstall = "11111111-1111-4111-8111-111111111111";
  const tenantBInstall = "22222222-2222-4222-8222-222222222222";
  let tenantBSawTenantA = false;
  const tenantBResponse = await askPublicPlatformCompanion(
    {
      question: "Hva koster medlemskap?",
      locale: "no",
      domain: "www.customer-b.example",
      installId: tenantBInstall,
    },
    {
      requestHost: "www.customer-b.example",
      rawInstallConfig: {
        website_kompis: {
          enabled: true,
          sources: {
            faq: true,
            currentPage: true,
            aipifyPublic: true,
            publicSiteIndex: false,
          },
        },
      },
      resolveLicensedAvailability: async () => ({
        available: true,
        reason: "available" as const,
        capabilityKey: "website_kompis",
      }),
      searchTenantVisitorKnowledge: async (input) => {
        if (input.installId === tenantAInstall || (input.domain ?? "").includes("customer-a")) {
          tenantBSawTenantA = true;
        }
        assert.equal(input.installId, tenantBInstall);
        assert.equal(input.domain, "www.customer-b.example");
        return [];
      },
    },
  );
  assert.equal(tenantBSawTenantA, false);
  assert.equal(tenantBResponse.sources[0]?.route, WEBSITE_KOMPIS_SAFE_FALLBACK_SOURCE);
  assert.ok(
    !tenantBResponse.sources.some((source) => source.route.includes("aipify-capabilities")),
  );

  // Private/admin intent must refuse without FAQ/provider — even if FAQ would score high.
  let privateFaqCalled = false;
  const privateAdminRefusal = await askPublicPlatformCompanion(
    {
      question: "Hvordan logger jeg inn på min private medlemskonto og adminpanel?",
      locale: "no",
      domain: "www.customer.example",
      installId: "11111111-1111-4111-8111-111111111111",
    },
    {
      ...customerAskOptions,
      requestHost: "www.customer.example",
      searchTenantVisitorKnowledge: async () => {
        privateFaqCalled = true;
        return [
          {
            item_id: "faq-marketplace",
            title: "Markedsplass",
            answer: "Du legger ut annonsen i markedsplassen fra min konto.",
            category: "marketplace",
            content_type: "faq",
            locale: "no",
            source_url: "https://www.customer.example/faq",
            score: 90,
            matched_reason: "title",
          },
        ];
      },
      groundedCompletion: async () => {
        throw new Error("provider must not run for private-scope refusal");
      },
    },
  );
  assert.equal(privateFaqCalled, false);
  assert.equal(privateAdminRefusal.sources.length, 0);
  assert.equal(privateAdminRefusal.supportEscalation.offered, true);
  assert.match(privateAdminRefusal.answer.directAnswer, /ikke tilgang|private/i);
  assert.doesNotMatch(privateAdminRefusal.answer.directAnswer, /markedsplass|annonse/i);

  // Public login help still reaches retrieval (not private-scope blocked).
  let publicLoginFaqCalled = false;
  await askPublicPlatformCompanion(
    {
      question: "Hvordan logger jeg inn?",
      locale: "no",
      domain: "www.customer.example",
      installId: "11111111-1111-4111-8111-111111111111",
    },
    {
      ...customerAskOptions,
      requestHost: "www.customer.example",
      searchTenantVisitorKnowledge: async () => {
        publicLoginFaqCalled = true;
        return [];
      },
    },
  );
  assert.equal(publicLoginFaqCalled, true);

  // Index OFF / empty knowledge → honest fallback, not platform product copy.
  const indexOffFallback = await askPublicPlatformCompanion(
    {
      question: "Fortell om Bronze Silver Gold",
      locale: "no",
      domain: "www.customer-a.example",
      installId: tenantAInstall,
    },
    {
      ...customerAskOptions,
      requestHost: "www.customer-a.example",
      searchTenantVisitorKnowledge: async () => [],
    },
  );
  assert.equal(indexOffFallback.sources[0]?.route, WEBSITE_KOMPIS_SAFE_FALLBACK_SOURCE);
  assert.ok(
    !indexOffFallback.sources.some((source) => source.route.includes("aipify-capabilities")),
  );

  // P1 Q15: customer host must not inject Aipify Platform public-pricing ladder.
  const q15Customer = await askPublicPlatformCompanion(
    {
      question: "How much does the Aipify Platform subscription cost for enterprises?",
      locale: "en",
      domain: "www.customer-a.example",
      installId: tenantAInstall,
    },
    {
      ...customerAskOptions,
      requestHost: "www.customer-a.example",
      searchTenantVisitorKnowledge: async () => [],
      groundedCompletion: async () => {
        throw new Error("provider must not run for Q15 P1 customer pricing deny");
      },
    },
  );
  const q15Combined = [q15Customer.answer.directAnswer, q15Customer.answer.explanation ?? ""].join(
    "\n",
  );
  assert.doesNotMatch(q15Combined, /799|3\s?990|14\s?500|public-pricing/i);
  assert.ok(
    !q15Customer.sources.some((source) => source.route.includes("public-pricing.ts")),
    `Q15 customer must not cite public-pricing.ts, got ${JSON.stringify(q15Customer.sources)}`,
  );

  // Host FAQ about membership still works when Aipify platform pricing is asked elsewhere.
  const hostFaqStillWorks = await askPublicPlatformCompanion(
    {
      question: "Hva koster det å bli medlem?",
      locale: "no",
      domain: "www.customer-a.example",
      installId: tenantAInstall,
    },
    {
      ...customerAskOptions,
      requestHost: "www.customer-a.example",
      searchTenantVisitorKnowledge: async () => [
        {
          item_id: "faq-membership",
          title: "Medlemskap",
          answer: "Medlemskap på nettstedet starter fra 199 per måned.",
          category: "medlemskap",
          content_type: "faq",
          locale: "no",
          source_url: "https://www.customer-a.example/no/membership",
          score: 80,
          matched_reason: "title",
        },
      ],
    },
  );
  assert.match(hostFaqStillWorks.answer.directAnswer, /199/);
  assert.doesNotMatch(hostFaqStillWorks.answer.directAnswer, /799|14\s?500/);
  assert.ok(
    !hostFaqStillWorks.sources.some((source) => source.route.includes("public-pricing.ts")),
  );

  // Aipify-owned assistant (no customer install context) still returns published ladder.
  const aipifyOwnedPricing = await askPublicPlatformCompanion({
    question: "How much does the Aipify Platform subscription cost for enterprises?",
    locale: "en",
  });
  assert.match(aipifyOwnedPricing.answer.directAnswer, /799/);
  assert.ok(
    aipifyOwnedPricing.sources.some((source) => source.route.includes("public-pricing.ts")),
  );

  console.log("website-kompis-public-boundary.test.ts: all assertions passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
