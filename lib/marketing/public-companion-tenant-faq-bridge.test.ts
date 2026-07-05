import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

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

  const publicCompanionAskSource = fs.readFileSync(
    path.join(root, "lib/marketing/public-companion-ask.ts"),
    "utf8",
  );
  const routeSource = fs.readFileSync(
    path.join(root, "app/api/marketing/companion/ask/route.ts"),
    "utf8",
  );
  const tenantFaqSource = fs.readFileSync(
    path.join(root, "lib/marketing/public-companion-tenant-faq.ts"),
    "utf8",
  );

  const { askPublicPlatformCompanion, validatePublicCompanionAskRequest } = await import(
    "./public-companion-ask"
  );

  assert.throws(
    () =>
      validatePublicCompanionAskRequest({
        question: "Har dere åpent i påsken?",
        tenant_id: "00000000-0000-4000-8000-000000000000",
      }),
    /Invalid request field/,
  );

  const installId = "11111111-1111-4111-8111-111111111111";
  let rpcCalled = false;

  const easterResponse = await askPublicPlatformCompanion(
    {
      question: "Har dere åpent i påsken?",
      locale: "no",
      domain: "example-a.test",
      installId,
    },
    {
      requestHost: "example-a.test",
      searchTenantVisitorKnowledge: async () => {
        rpcCalled = true;
        return [
          {
            item_id: "22222222-2222-4222-8222-222222222222",
            title: "Åpningstider i påsken",
            answer: "Vi holder stengt 17.–21. april. Kundeservice svarer igjen 22. april.",
            category: "hours",
            content_type: "holiday_notice",
            locale: "no",
            source_url: "https://example-a.test/kontakt",
            score: 40,
            matched_reason: "title_match",
          },
        ];
      },
    },
  );

  assert.equal(rpcCalled, true);
  assert.match(easterResponse.answer.directAnswer, /stengt 17/);
  assert.ok(
    easterResponse.sources.some(
      (source) =>
        source.route.startsWith("website-kompis-faq:") || source.route.startsWith("https://"),
    ),
  );

  const fallbackResponse = await askPublicPlatformCompanion(
    {
      question: "Har dere åpent i påsken?",
      locale: "no",
      domain: "example-a.test",
      installId,
    },
    {
      searchTenantVisitorKnowledge: async () => [],
    },
  );
  assert.equal(fallbackResponse.sources[0]?.route, "website-kompis-safe-fallback");
  assert.match(fallbackResponse.answer.directAnswer, /Example-a|virksomheten/i);

  const pageContext = {
    pathname: "/services/consulting",
    title: "Consulting Services",
    metaDescription: "We offer consulting services for growing teams.",
    surface: "public" as const,
    headings: [{ level: 1 as const, text: "Consulting Services" }],
    textSnippets: ["Our consulting packages help teams adopt new workflows."],
  };

  const faqWins = await askPublicPlatformCompanion(
    {
      question: "Har dere åpent i påsken?",
      locale: "no",
      domain: "example-a.test",
      installId,
      pageContext,
    },
    {
      searchTenantVisitorKnowledge: async () => [
        {
          item_id: "22222222-2222-4222-8222-222222222222",
          title: "Åpningstider i påsken",
          answer: "Vi holder stengt 17.–21. april.",
          category: "hours",
          content_type: "holiday_notice",
          locale: "no",
          source_url: "https://example-a.test/kontakt",
          score: 40,
          matched_reason: "title_match",
        },
      ],
    },
  );
  assert.match(faqWins.answer.directAnswer, /stengt 17/);
  assert.ok(
    faqWins.sources.some(
      (source) =>
        source.route.startsWith("website-kompis-faq:") || source.route.startsWith("https://"),
    ),
  );

  const pageContextAnswer = await askPublicPlatformCompanion(
    {
      question: "Tell me about consulting services",
      locale: "en",
      domain: "example-a.test",
      installId,
      pageContext,
    },
    {
      searchTenantVisitorKnowledge: async () => [],
    },
  );
  assert.equal(pageContextAnswer.sources[0]?.route, "website-kompis-current-page");
  assert.match(pageContextAnswer.answer.directAnswer, /consulting/i);

  const unrelatedWithContext = await askPublicPlatformCompanion(
    {
      question: "What is the weather today?",
      locale: "en",
      domain: "example-a.test",
      installId,
      pageContext,
    },
    {
      searchTenantVisitorKnowledge: async () => [],
    },
  );
  assert.equal(unrelatedWithContext.sources[0]?.route, "website-kompis-safe-fallback");

  const disabledResponse = await askPublicPlatformCompanion(
    {
      question: "Tell me about consulting services",
      locale: "en",
      domain: "example-a.test",
      installId,
      pageContext,
    },
    {
      rawInstallConfig: { website_kompis: { enabled: false } },
      searchTenantVisitorKnowledge: async () => {
        throw new Error("FAQ should not run when disabled");
      },
    },
  );
  assert.equal(disabledResponse.sources[0]?.route, "website-kompis-disabled");

  const faqDisabled = await askPublicPlatformCompanion(
    {
      question: "Har dere åpent i påsken?",
      locale: "no",
      domain: "example-a.test",
      installId,
    },
    {
      rawInstallConfig: { website_kompis: { sources: { faq: false, currentPage: false } } },
      searchTenantVisitorKnowledge: async () => {
        throw new Error("FAQ should not run when sources.faq is false");
      },
    },
  );
  assert.equal(faqDisabled.sources[0]?.route, "website-kompis-safe-fallback");

  const pageOnly = await askPublicPlatformCompanion(
    {
      question: "Tell me about consulting services",
      locale: "en",
      domain: "example-a.test",
      installId,
      pageContext,
    },
    {
      rawInstallConfig: { website_kompis: { sources: { faq: false, currentPage: true } } },
      searchTenantVisitorKnowledge: async () => [],
    },
  );
  assert.equal(pageOnly.sources[0]?.route, "website-kompis-current-page");

  const noAipifyPublic = await askPublicPlatformCompanion(
    {
      question: "What is Aipify Kompis?",
      locale: "en",
      domain: "example-a.test",
      installId,
    },
    {
      rawInstallConfig: { website_kompis: { sources: { aipifyPublic: false } } },
      searchTenantVisitorKnowledge: async () => [],
    },
  );
  assert.equal(noAipifyPublic.sources[0]?.route, "website-kompis-safe-fallback");
  assert.ok(
    !noAipifyPublic.sources.some((source) => source.route.includes("aipify-overview")),
  );

  assert.match(publicCompanionAskSource, /tryBuildWebsiteKompisCurrentPublicPageAnswer/);
  assert.match(publicCompanionAskSource, /getWebsiteKompisInstallConfigForPublicRequest/);
  assert.doesNotMatch(publicCompanionAskSource, /search_organization_knowledge|member\.search/);

  rpcCalled = false;
  const coreResponse = await askPublicPlatformCompanion(
    {
      question: "Hvilken løsninger har dere?",
      locale: "no",
      domain: "example-a.test",
      installId,
    },
    {
      searchTenantVisitorKnowledge: async () => {
        rpcCalled = true;
        return [];
      },
    },
  );

  assert.equal(rpcCalled, true);
  assert.equal(coreResponse.sources[0]?.route, "website-kompis-safe-fallback");
  assert.ok(
    !coreResponse.sources.some((source) => source.route.includes("aipify-capabilities")),
    `expected safe fallback, got ${JSON.stringify(coreResponse.sources)}`,
  );

  assert.match(tenantFaqSource, /search_tenant_public_visitor_knowledge/);
  assert.doesNotMatch(tenantFaqSource, /search_organization_knowledge/);
  assert.doesNotMatch(tenantFaqSource, /enqueue_companion_chat_message/);
  assert.doesNotMatch(publicCompanionAskSource, /search_organization_knowledge/);
  assert.match(publicCompanionAskSource, /searchPublicCompanionTenantFaq/);
  assert.match(routeSource, /requestHost/);
  assert.doesNotMatch(routeSource, /tenant_id|tenantId/);

  console.log("public-companion-tenant-faq-bridge.test.ts: all assertions passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
