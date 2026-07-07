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
    buildWebsiteKompisSafeFallbackResponse,
    isCustomerWebsiteVisitorContext,
    isExplicitAipifyOrKompisQuestion,
    isExplicitAipifyPricingQuestion,
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
  assert.equal(shouldAllowAipifyPlatformKnowledgeOnCustomerWebsite("Hva er Aipify?"), true);
  assert.equal(shouldAllowAipifyPlatformKnowledgeOnCustomerWebsite("Hvilke fordeler får jeg her?"), false);

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
          title: "Opening hours",
          answer: "We are open Monday to Friday.",
          category: "hours",
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

  console.log("website-kompis-public-boundary.test.ts: all assertions passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
