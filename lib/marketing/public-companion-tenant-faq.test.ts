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
    buildPublicCompanionTenantFaqResponse,
    isRelevantPublicCompanionTenantFaqResult,
    resolvePublicCompanionVisitorContext,
    sanitizePublicCompanionDomain,
    sanitizePublicCompanionInstallId,
  } = await import("./public-companion-tenant-faq");

  const installId = "11111111-1111-4111-8111-111111111111";

  assert.equal(sanitizePublicCompanionInstallId(installId), installId);
  assert.equal(sanitizePublicCompanionInstallId("not-a-uuid"), null);
  assert.equal(sanitizePublicCompanionDomain("https://Example-A.test/path"), "example-a.test");
  assert.equal(sanitizePublicCompanionDomain("javascript:alert(1)"), null);

  const context = resolvePublicCompanionVisitorContext({
    clientDomain: "example-a.test",
    installId,
  });
  assert.equal(context.domain, "example-a.test");
  assert.equal(context.installId, installId);

  const fixtureRows = [
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

  assert.equal(
    isRelevantPublicCompanionTenantFaqResult(fixtureRows, "Har dere åpent i påsken?"),
    true,
  );
  assert.equal(isRelevantPublicCompanionTenantFaqResult(fixtureRows, "a"), false);

  const response = buildPublicCompanionTenantFaqResponse(fixtureRows, "no");
  assert.match(response.answer.directAnswer, /stengt 17/);
  assert.ok(response.sources.some((source) => source.title === "Åpningstider i påsken"));
  assert.ok(response.sources.some((source) => source.route === "https://example-a.test/kontakt"));
  assert.equal(response.confidence.level, "high");
  assert.equal(response.supportEscalation.offered, false);

  console.log("public-companion-tenant-faq.test.ts: all assertions passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
