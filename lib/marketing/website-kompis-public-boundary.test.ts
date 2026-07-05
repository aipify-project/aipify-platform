import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const require = createRequire(import.meta.url);

const TENANT_A = {
  installId: "11111111-1111-4111-8111-111111111111",
  domain: "example-a.com",
  label: "Example-a",
} as const;

const TENANT_B = {
  installId: "22222222-2222-4222-8222-222222222222",
  domain: "demo-clinic.com",
  label: "Demo-clinic",
} as const;

const WEBSITE_KOMPIS_RUNTIME_FILES = [
  "lib/marketing/public-companion-ask.ts",
  "lib/marketing/public-companion-tenant-faq.ts",
  "lib/marketing/public-companion-tenant-faq-retrieval.ts",
  "lib/marketing/website-kompis-public-boundary.ts",
  "app/api/marketing/companion/ask/route.ts",
] as const;

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
      installId: TENANT_A.installId,
      domain: TENANT_A.domain,
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

  const fallbackA = buildWebsiteKompisSafeFallbackResponse("no", TENANT_A.domain);
  assert.match(fallbackA.answer.directAnswer, new RegExp(TENANT_A.label));
  assert.equal(fallbackA.sources[0]?.route, WEBSITE_KOMPIS_SAFE_FALLBACK_SOURCE);

  const fallbackB = buildWebsiteKompisSafeFallbackResponse("no", TENANT_B.domain);
  assert.match(fallbackB.answer.directAnswer, new RegExp(TENANT_B.label));
  assert.doesNotMatch(fallbackB.answer.directAnswer, new RegExp(TENANT_A.label));

  let rpcCalled = false;

  const genericResponse = await askPublicPlatformCompanion(
    {
      question: "Hvilken løsninger har dere?",
      locale: "no",
      domain: TENANT_A.domain,
      installId: TENANT_A.installId,
    },
    {
      requestHost: TENANT_A.domain,
      searchTenantVisitorKnowledge: async () => {
        rpcCalled = true;
        return [];
      },
    },
  );

  assert.equal(rpcCalled, true);
  assert.equal(genericResponse.sources[0]?.route, WEBSITE_KOMPIS_SAFE_FALLBACK_SOURCE);
  assert.match(genericResponse.answer.directAnswer, new RegExp(TENANT_A.label));
  assert.ok(
    !genericResponse.sources.some((source) => source.route.includes("aipify-capabilities")),
  );
  assert.ok(
    !genericResponse.sources.some((source) => source.route.includes("platform-fallback")),
  );

  const tenantBFallback = await askPublicPlatformCompanion(
    {
      question: "Hvilken løsninger har dere?",
      locale: "no",
      domain: TENANT_B.domain,
      installId: TENANT_B.installId,
    },
    {
      searchTenantVisitorKnowledge: async () => [],
    },
  );
  assert.equal(tenantBFallback.sources[0]?.route, WEBSITE_KOMPIS_SAFE_FALLBACK_SOURCE);
  assert.match(tenantBFallback.answer.directAnswer, new RegExp(TENANT_B.label));
  assert.doesNotMatch(tenantBFallback.answer.directAnswer, new RegExp(TENANT_A.label));

  const holidayFallback = await askPublicPlatformCompanion(
    {
      question: "Har dere åpent i påsken?",
      locale: "no",
      domain: TENANT_A.domain,
      installId: TENANT_A.installId,
    },
    {
      searchTenantVisitorKnowledge: async () => [],
    },
  );
  assert.equal(holidayFallback.sources[0]?.route, WEBSITE_KOMPIS_SAFE_FALLBACK_SOURCE);
  assert.match(holidayFallback.answer.directAnswer, new RegExp(TENANT_A.label));

  const explicitAipify = await askPublicPlatformCompanion(
    {
      question: "Hva er Aipify Kompis?",
      locale: "no",
      domain: TENANT_A.domain,
      installId: TENANT_A.installId,
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

  const forbiddenRuntime = /\bunonight\b|\bUnonight\b|unonight\.com|180c9d31-3340-4633-b210-3b64edf1e1be/i;
  for (const relativePath of WEBSITE_KOMPIS_RUNTIME_FILES) {
    const absolutePath = path.join(root, relativePath);
    const source = fs.readFileSync(absolutePath, "utf8");
    assert.doesNotMatch(
      source,
      forbiddenRuntime,
      `${relativePath} must not contain customer-specific runtime symbols`,
    );
  }

  console.log("website-kompis-public-boundary.test.ts: all assertions passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
