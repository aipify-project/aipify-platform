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

  await test("natural pricing question finds pricing answer without exact FAQ text", async () => {
    const response = await askPublicPlatformCompanion({
      question: "Hva koster Aipify?",
      locale: "no",
    });

    assert.ok(response.answer.directAnswer.length > 20);
    assert.match(response.answer.directAnswer.toLowerCase(), /kost|pris|plan|abonnement|price|subscription/);
    assert.ok(["high", "medium"].includes(response.confidence.level));
    assert.ok(response.sources.length > 0);
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
