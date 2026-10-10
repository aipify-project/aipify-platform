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
    if (request === "server-only") {
      return {};
    }
    return originalLoad.call(this, request, parent, isMain);
  };
}

installServerOnlyShim();

async function main() {
  const { askPublicPlatformCompanion } = await import("@/lib/marketing/public-companion-ask");

  let siteIndexCalled = false;
  const response = await askPublicPlatformCompanion(
    {
      question: "Hva er forskjellen mellom Bronze Silver Gold og Elite Diamond?",
      locale: "no",
      installId: "11111111-1111-4111-8111-111111111111",
      domain: "www.customer.example",
      pageContext: {
        pathname: "/no",
        title: "Hjem",
        surface: "public",
        textSnippets: ["Velkommen til startsiden."],
      },
    },
    {
      requestHost: "www.customer.example",
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
      resolveLicensedAvailability: async () => ({
        available: true,
        reason: "available" as const,
        capabilityKey: "website_kompis",
      }),
      searchTenantVisitorKnowledge: async () => [],
      searchTenantPublicSiteIndex: async () => {
        siteIndexCalled = true;
        return [
          {
            documentId: "11111111-1111-4111-8111-111111111111",
            chunkId: "22222222-2222-4222-8222-222222222222",
            title: "Medlemsguide",
            canonicalUrl: "https://www.customer.example/no/membership-guide",
            pathname: "/no/membership-guide",
            locale: "no",
            excerpt: "Sammenlign medlemsnivåer",
            chunkContent:
              "Bronze, Silver, Gold og Elite Diamond har ulike fordeler. Se medlemsguiden for sammenligning.",
            score: 44,
            matchedReason: "public_site_index",
            crawledAt: new Date().toISOString(),
          },
        ];
      },
    },
  );

  assert.equal(siteIndexCalled, true);
  assert.match(response.answer.directAnswer, /Ut fra nettstedets offentlige sider/);
  assert.match(response.answer.directAnswer, /Bronze/);
  assert.equal(
    response.sources[0]?.route,
    "https://www.customer.example/no/membership-guide",
  );
  console.log("website-kompis public site index ask-path: passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
