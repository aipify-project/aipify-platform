import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const require = createRequire(import.meta.url);

const EASTER_FAQ = {
  title: "Åpningstider i påsken",
  question: "Har dere åpent i påsken?",
  answer: "Vi holder stengt 17.–21. april. Kundeservice svarer igjen 22. april.",
  category: "hours",
  content_type: "holiday_notice",
  tags: ["påske", "helligdager", "kundeservice"],
} as const;

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
  const {
    isRelevantPublicCompanionTenantFaqResult,
    buildPublicCompanionTenantFaqResponse,
  } = await import("./public-companion-tenant-faq");
  const {
    matchesPublicCompanionTenantFaqQuery,
    scorePublicCompanionTenantFaqMatch,
  } = await import("./public-companion-tenant-faq-retrieval");

  installServerOnlyShim();
  const { askPublicPlatformCompanion } = await import("./public-companion-ask");

  const titleQuery = "Har dere åpent i påsken?";
  assert.equal(matchesPublicCompanionTenantFaqQuery(titleQuery, EASTER_FAQ), true);
  const titleScore = scorePublicCompanionTenantFaqMatch(titleQuery, EASTER_FAQ);
  assert.ok(titleScore.score >= 10, `expected title/question match score >= 10, got ${titleScore.score}`);

  const answerBodyQuery = "Når svarer kundeservice igjen?";
  assert.equal(matchesPublicCompanionTenantFaqQuery(answerBodyQuery, EASTER_FAQ), true);
  const answerBodyScore = scorePublicCompanionTenantFaqMatch(answerBodyQuery, EASTER_FAQ);
  assert.ok(answerBodyScore.score >= 10, `expected answer-body match score >= 10, got ${answerBodyScore.score}`);

  const answerDateQuery = "Er kundeservice tilbake 22. april?";
  assert.equal(matchesPublicCompanionTenantFaqQuery(answerDateQuery, EASTER_FAQ), true);
  const answerDateScore = scorePublicCompanionTenantFaqMatch(answerDateQuery, EASTER_FAQ);
  assert.ok(answerDateScore.score >= 10, `expected answer-date match score >= 10, got ${answerDateScore.score}`);

  const fixtureRow = {
    item_id: "22222222-2222-4222-8222-222222222222",
    title: EASTER_FAQ.title,
    answer: EASTER_FAQ.answer,
    category: EASTER_FAQ.category,
    content_type: EASTER_FAQ.content_type,
    locale: "no",
    source_url: null,
    score: answerBodyScore.score,
    matched_reason: answerBodyScore.matchedReason,
  };

  for (const query of [titleQuery, answerBodyQuery, answerDateQuery]) {
    assert.equal(isRelevantPublicCompanionTenantFaqResult([fixtureRow], query), true);
    const response = buildPublicCompanionTenantFaqResponse([fixtureRow], "no");
    assert.match(response.answer.directAnswer, /stengt 17/);
    assert.ok(
      response.sources.some((source) => source.route === "website-kompis-faq:holiday_notice"),
      `expected website-kompis-faq source for ${query}`,
    );
  }

  const installId = "11111111-1111-4111-8111-111111111111";
  const fallbackResponse = await askPublicPlatformCompanion(
    {
      question: "Hvilken løsninger har dere?",
      locale: "no",
      domain: "example-a.test",
      installId,
    },
    {
      searchTenantVisitorKnowledge: async () => [],
    },
  );
  assert.equal(fallbackResponse.sources[0]?.route, "website-kompis-safe-fallback");
  assert.ok(
    !fallbackResponse.sources.some((source) => source.route.includes("aipify-capabilities")),
  );

  const explicitAipifyOnMarketing = await askPublicPlatformCompanion(
    {
      question: "Hva er Aipify Kompis?",
      locale: "no",
      domain: "aipify.ai",
      installId,
    },
    {
      searchTenantVisitorKnowledge: async () => [],
    },
  );
  assert.ok(
    explicitAipifyOnMarketing.sources.some(
      (source) =>
        source.route === "aipify-overview" ||
        source.route === "knowledgeCenter" ||
        source.route.includes("aipify"),
    ),
    `expected Aipify/Core source on aipify.ai, got ${JSON.stringify(explicitAipifyOnMarketing.sources)}`,
  );

  const explicitAipifyOnCustomerSite = await askPublicPlatformCompanion(
    {
      question: "Hva er Aipify Kompis?",
      locale: "no",
      domain: "example-a.test",
      installId,
    },
    {
      searchTenantVisitorKnowledge: async () => [],
    },
  );
  assert.ok(
    explicitAipifyOnCustomerSite.sources.some(
      (source) =>
        source.route === "aipify-overview" ||
        source.route === "knowledgeCenter" ||
        source.route.includes("aipify"),
    ),
    `expected explicit Aipify/Core source on customer site, got ${JSON.stringify(explicitAipifyOnCustomerSite.sources)}`,
  );

  console.log("public-companion-tenant-faq-retrieval.test.ts: all assertions passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
