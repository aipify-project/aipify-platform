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

installServerOnlyShim();

const publicCompanionAskSource = fs.readFileSync(
  path.join(root, "lib/marketing/public-companion-ask.ts"),
  "utf8",
);
const routeSource = fs.readFileSync(
  path.join(root, "app/api/marketing/companion/ask/route.ts"),
  "utf8",
);

function test(name: string, fn: () => void | Promise<void>) {
  return (async () => {
    try {
      await fn();
      console.log(`ok ${name}`);
    } catch (error) {
      console.error(`fail ${name}`);
      throw error;
    }
  })();
}

async function main() {
  const {
    PUBLIC_COMPANION_ASK_MAX_QUESTION_LENGTH,
    askPublicPlatformCompanion,
    buildPublicCompanionQuery,
    sanitizePublicCompanionActions,
    validatePublicCompanionAskRequest,
  } = await import("./public-companion-ask");

  await test("natural pricing question returns canonical published ladder", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Hva koster Aipify?",
      locale: "no",
    });

    const combined = [response.answer.directAnswer, response.answer.explanation ?? ""].join("\n");
    assert.match(combined, /799/);
    assert.match(combined, /3\s?990/);
    assert.match(combined, /14\s?500/);
    assert.match(combined.toLowerCase(), /tilpasset/);
    assert.match(combined, /25\s+lisenser/);
    assert.equal(response.confidence.level, "high");
    assert.equal(response.supportEscalation.offered, false);
    assert.ok(response.actions.some((action) => action.href === "/pricing"));
    assert.ok(!response.actions.some((action) => action.href.startsWith("/app/")));
    assert.ok(response.sources.some((source) => source.route.includes("public-pricing.ts")));
  });

  await test("pricing questions in Norwegian and English use published summary", async () => {
    for (const question of ["Hvilke priser har dere?", "What does Aipify cost?"]) {
      const response = await askPublicPlatformCompanion({
        question,
        locale: question.startsWith("H") ? "no" : "en",
      });
      assert.match(response.answer.directAnswer, /799/);
      assert.match(response.answer.directAnswer, /3[,\s]?990/);
      assert.equal(response.confidence.level, "high");
      assert.equal(response.supportEscalation.offered, false);
    }
  });

  await test("business-specific pricing question includes business ladder line", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Hva koster Business?",
      locale: "no",
    });

    assert.match(response.answer.directAnswer, /Business:\s*14\s?500/);
    assert.match(response.answer.directAnswer, /25\s+lisenser/);
  });

  await test("natural demo question returns safe internal action", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Kan jeg bestille en demonstrasjon?",
      locale: "no",
    });

    assert.ok(response.answer.directAnswer.length > 10);
    assert.ok(response.actions.length > 0, "expected at least one safe internal action");
    for (const action of response.actions) {
      assert.ok(action.href.startsWith("/app/"));
      assert.ok(!action.href.includes("javascript:"));
    }
  });

  await test("business pack question understands alternative phrasing", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Hvordan fungerer disse pakkene for bedrifter?",
      locale: "no",
    });

    assert.ok(response.answer.directAnswer.length > 20);
    assert.match(response.answer.directAnswer.toLowerCase(), /business pack|forretningspak|modul|pack/);
  });

  await test("unanswered question returns honest gap and support escalation", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Kan Aipify hjelpe meg med helt ukjent intergalaktisk flux?",
      locale: "no",
    });

    assert.equal(response.confidence.level, "low");
    assert.equal(response.supportEscalation.offered, true);
    assert.ok(
      response.supportEscalation.reason === "knowledge_gap" ||
        response.supportEscalation.reason === "low_confidence",
    );
    assert.ok(response.answer.directAnswer.length > 10);
  });

  await test("high or medium confidence does not offer unnecessary escalation for pricing", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Hva koster Aipify?",
      locale: "no",
    });

    assert.ok(["high", "medium"].includes(response.confidence.level));
    assert.equal(response.supportEscalation.offered, false);
  });

  await test("messageLocale overrides page locale", async () => {
    const response = await askPublicPlatformCompanion({
      question: "How do I contact support?",
      locale: "no",
      messageLocale: "en",
    });

    assert.equal(response.locale, "en");
    assert.ok(response.answer.directAnswer.length > 20);
  });

  await test("invalid locale falls back to en", async () => {
    const response = await askPublicPlatformCompanion({
      question: "What is Aipify?",
      locale: "de",
      messageLocale: "fr",
    });

    assert.equal(response.locale, "en");
  });

  await test("invalid or external actions are removed", () => {
    const sanitized = sanitizePublicCompanionActions([
      {
        labelKey: "x",
        label: "Safe",
        href: "/app/support/requests",
        routeKey: "supportRequests",
      },
      {
        labelKey: "y",
        label: "External",
        href: "https://evil.example",
        routeKey: "supportRequests",
      },
      {
        labelKey: "z",
        label: "Script",
        href: "javascript:alert(1)",
        routeKey: "supportRequests",
      },
      {
        labelKey: "w",
        label: "Mismatch",
        href: "/app/settings/billing",
        routeKey: "supportRequests",
      },
    ]);

    assert.equal(sanitized.length, 1);
    assert.equal(sanitized[0]?.href, "/app/support/requests");
  });

  await test("tenant organization and user ids cannot be sent in", () => {
    assert.throws(
      () =>
        validatePublicCompanionAskRequest({
          question: "Hva koster Aipify?",
          tenantId: "tenant-1",
        }),
      /Invalid request field/,
    );
    assert.throws(
      () =>
        validatePublicCompanionAskRequest({
          question: "Hva koster Aipify?",
          organizationId: "org-1",
        }),
      /Invalid request field/,
    );
    assert.throws(
      () =>
        validatePublicCompanionAskRequest({
          question: "Hva koster Aipify?",
          userId: "user-1",
        }),
      /Invalid request field/,
    );
    assert.throws(
      () =>
        validatePublicCompanionAskRequest({
          question: "Hva koster Aipify?",
          providerId: "unonight",
        }),
      /Invalid request field/,
    );
  });

  await test("overlong question is rejected", () => {
    assert.throws(
      () =>
        validatePublicCompanionAskRequest({
          question: "x".repeat(PUBLIC_COMPANION_ASK_MAX_QUESTION_LENGTH + 1),
        }),
      /question too long/,
    );
  });

  await test("recent context is bounded and sanitized", () => {
    assert.throws(
      () =>
        validatePublicCompanionAskRequest({
          question: "Hva koster Aipify?",
          recentContext: Array.from({ length: 7 }, (_, index) => ({
            role: "user",
            text: `message ${index}`,
          })),
        }),
      /recentContext too long/,
    );

    assert.throws(
      () =>
        validatePublicCompanionAskRequest({
          question: "Hva koster Aipify?",
          recentContext: [{ role: "user", text: "x".repeat(501) }],
        }),
      /recentContext text too long/,
    );

    const validated = validatePublicCompanionAskRequest({
      question: "Hva koster Aipify?",
      recentContext: [
        { role: "assistant", text: "  Earlier answer  " },
        { role: "user", text: "Follow-up" },
      ],
    });

    const query = buildPublicCompanionQuery(validated.question, validated.recentContext);
    assert.match(query, /assistant: Earlier answer/);
    assert.match(query, /user: Follow-up/);
    assert.match(query, /user: Hva koster Aipify\?/);
  });

  await test("getting started question is understood naturally", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Hvor finner jeg hjelp til å komme i gang?",
      locale: "no",
    });

    assert.ok(response.answer.directAnswer.length > 20);
    assert.ok(response.actions.length > 0 || response.sources.length > 0);
  });

  const FORBIDDEN_ENGLISH_SOURCE_TITLES = [
    "Upgrade Options",
    "Knowledge Center",
    "Marketplace",
    "Getting Started",
  ];

  function assertNoEnglishRouteSourceTitles(
    sources: Array<{ title: string }>,
    context: string,
  ) {
    for (const title of FORBIDDEN_ENGLISH_SOURCE_TITLES) {
      assert.ok(
        !sources.some((source) => source.title === title),
        `${context}: unexpected English source title "${title}"`,
      );
    }
  }

  await test("Norwegian pricing source titles use published pricing source", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Hva koster Aipify?",
      locale: "no",
    });

    assert.equal(response.locale, "no");
    assertNoEnglishRouteSourceTitles(response.sources, "pricing");
    assert.ok(
      response.sources.some((source) => source.title === "Abonnementspriser"),
      `expected Abonnementspriser source, got: ${response.sources.map((s) => s.title).join(", ")}`,
    );
    assert.ok(
      response.sources.some((source) => source.route.includes("public-pricing.ts")),
      "expected canonical pricing source route",
    );
  });

  await test("Norwegian knowledge source titles use portalStructure locale", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Kan noen vise meg hvordan Aipify fungerer?",
      locale: "no",
    });

    assert.equal(response.locale, "no");
    assertNoEnglishRouteSourceTitles(response.sources, "knowledge");
    assert.ok(
      response.sources.some((source) => source.title === "Kunnskapssenter"),
      `expected Kunnskapssenter source, got: ${response.sources.map((s) => s.title).join(", ")}`,
    );
    for (const action of response.actions) {
      assert.ok(!FORBIDDEN_ENGLISH_SOURCE_TITLES.includes(action.label));
    }
  });

  await test("Norwegian marketplace source titles use portalStructure locale", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Hvordan fungerer disse pakkene for bedrifter?",
      locale: "no",
    });

    assert.equal(response.locale, "no");
    assertNoEnglishRouteSourceTitles(response.sources, "marketplace");
    assert.ok(
      response.sources.some((source) => source.title === "Markedsplass"),
      `expected Markedsplass source, got: ${response.sources.map((s) => s.title).join(", ")}`,
    );
  });

  await test("Norwegian response uses same locale for sources and action labels", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Kan noen vise meg hvordan Aipify fungerer?",
      locale: "no",
    });

    assert.equal(response.locale, "no");
    assert.ok(response.sources.length > 0);
    assert.ok(response.actions.length > 0);
    assert.ok(response.actions.some((action) => action.label === "Kom i gang"));
    assert.ok(response.actions.some((action) => action.label === "Åpne Aipify Companion"));
    assertNoEnglishRouteSourceTitles(response.sources, "locale consistency");
  });

  await test("messageLocale en keeps English pricing source titles", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Hva koster Aipify?",
      locale: "no",
      messageLocale: "en",
    });

    assert.equal(response.locale, "en");
    assert.ok(
      response.sources.some((source) => source.title === "Subscription pricing"),
      `expected English Subscription pricing source, got: ${response.sources.map((s) => s.title).join(", ")}`,
    );
    assert.ok(!response.sources.some((source) => source.title === "Abonnementspriser"));
  });

  await test("invalid locale falls back to English pricing source titles", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Hva koster Aipify?",
      locale: "de",
    });

    assert.equal(response.locale, "en");
    assert.ok(
      response.sources.some((source) => source.title === "Subscription pricing"),
      `expected English Subscription pricing source, got: ${response.sources.map((s) => s.title).join(", ")}`,
    );
    assert.ok(!response.sources.some((source) => source.title === "Abonnementspriser"));
  });

  await test("runtime loads portalStructure without hardcoded source titles", () => {
    assert.match(
      publicCompanionAskSource,
      /getCustomerAppDictionaryForSplits\(\s*locale as Locale,\s*\[[\s\S]*?"companionPlatformKnowledge"[\s\S]*?"portalStructure"[\s\S]*?\]\s*\)/,
    );
    assert.match(publicCompanionAskSource, /buildPublishedPricingSummary/);
    assert.doesNotMatch(publicCompanionAskSource, /Oppgraderinger|Kunnskapssenter|Markedsplass/);
  });

  await test("output does not require raw HTML or markdown links", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Hva koster Aipify?",
      locale: "no",
    });

    const combined = [
      response.answer.directAnswer,
      response.answer.explanation ?? "",
      ...response.answer.steps,
      ...response.actions.map((action) => action.label),
    ].join("\n");

    assert.doesNotMatch(combined, /<\/?[a-z][\s\S]*>/i);
    assert.doesNotMatch(combined, /\[[^\]]+\]\([^)]+\)/);
  });

  await test("new files do not reference Unonight or customer-specific runtime symbols", () => {
    const forbidden =
      /\bunonight\b|loadCompanionTenantContext|search_organization_knowledge|record_companion_answer_feedback/i;
    assert.doesNotMatch(publicCompanionAskSource, forbidden);
    assert.doesNotMatch(routeSource, forbidden);
    assert.match(publicCompanionAskSource, /searchPlatformKnowledge/);
    assert.match(publicCompanionAskSource, /createEmptyCompanionTenantContext/);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
