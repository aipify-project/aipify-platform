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

/**
 * Isolated ask-path: mocked RPC body_window hit → answerPath public_site_index.
 * Does not call live Core or create feedback receipts (ask layer only).
 */
async function main() {
  const { askPublicPlatformCompanion } = await import("@/lib/marketing/public-companion-ask");

  let siteIndexCalled = false;
  const response = await askPublicPlatformCompanion(
    {
      question: "Hvordan fungerer provisjon?",
      locale: "no",
      installId: "11111111-1111-4111-8111-111111111111",
      domain: "www.customer.example",
      pageContext: {
        pathname: "/no/how-it-works",
        title: "Slik fungerer det",
        surface: "public",
        textSnippets: ["Provisjonsmodellen brukes naar handel er fullfoert."],
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
            documentId: "dddddddd-dddd-4ddd-8ddd-dddddddddd10",
            chunkId: "body-window-synthetic",
            title: "Slik fungerer det",
            canonicalUrl: "https://www.customer.example/no/how-it-works",
            pathname: "/no/how-it-works",
            locale: "nb",
            excerpt:
              "Paa denne siden beskrives provisjonsmodellen for medlemsplattformen uten a oppgi noen sats.",
            chunkContent:
              "Paa denne siden beskrives provisjonsmodellen for medlemsplattformen uten a oppgi noen sats. Teksten forklarer bare at provisjonsmodellen brukes naar en handel er fullfoert.",
            score: 20,
            matchedReason: "public_site_index_body_window",
            crawledAt: "2026-10-26T00:00:00.000Z",
          },
        ];
      },
    },
  );

  assert.equal(siteIndexCalled, true, "public site-index search must be invoked");
  const answerText = `${response.answer.directAnswer} ${response.answer.explanation ?? ""}`;
  assert.match(answerText, /provisjon/i);
  assert.doesNotMatch(answerText, /\d+\s*%/);
  assert.ok(
    response.sources.some((s) => s.route.includes("/no/how-it-works")),
    "source must remain how-it-works",
  );
  console.log("website-kompis public site index ask-path-body-window: passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
