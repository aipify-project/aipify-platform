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
  } = await import("./website-kompis-public-boundary");

  const { askPublicPlatformCompanion } = await import("./public-companion-ask");

  assert.equal(isExplicitAipifyOrKompisQuestion("Hva er Aipify Kompis?"), true);
  assert.equal(isExplicitAipifyOrKompisQuestion("Hvordan fungerer denne Kompis-widgeten?"), true);
  assert.equal(isExplicitAipifyOrKompisQuestion("Hvilken løsninger har dere?"), false);
  assert.equal(isExplicitAipifyOrKompisQuestion("Har dere åpent i påsken?"), false);
  assert.equal(isExplicitAipifyOrKompisQuestion("Kan jeg bli partner?"), false);

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

  const easterFallback = await askPublicPlatformCompanion(
    {
      question: "Har dere åpent i påsken?",
      locale: "no",
      domain: "unonight.com",
      installId,
    },
    {
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
