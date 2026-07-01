import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { buildFallbackAnswer } from "@/lib/companion-platform-knowledge/answer-builder";
import { buildCompanionExperienceLabels } from "@/lib/app/companion/labels";
import { COMPANION_COVERAGE_LOCALES } from "@/lib/companion-runtime/companion-foundation-coverage-i18n";

const repoRoot = path.join(import.meta.dirname, "..", "..");
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

const ENGLISH_STEP1 =
  "Open Aipify Companion from the Intelligence section or ask about a specific topic.";
const ENGLISH_STEP2 = "Use the suggested links to go directly to the relevant page.";

const FALLBACK_KEYS = ["directAnswer", "explanation", "step1", "step2", "subscriptionUnavailable"] as const;
const FALLBACK_ACTION_KEYS = ["aipifyCompanion", "knowledgeCenter", "contactSupport"] as const;
const FEEDBACK_KEYS = [
  "feedbackHelpful",
  "feedbackNotHelpful",
  "feedbackOrgConfirm",
  "sourcesShow",
  "supportEscalationHint",
  "createSupportRequest",
] as const;

const NO_EXPECTED = {
  step1: "Åpne Aipify Companion fra Intelligence-seksjonen, eller spør om et bestemt tema.",
  step2: "Bruk de foreslåtte lenkene for å gå direkte til den relevante siden.",
};

const ARTICLE_TRANSLATABLE_FIELDS = [
  "title",
  "directAnswer",
  "explanation",
  "step1",
  "step2",
  "step3",
] as const;

const PUBLIC_ARTICLE_IDS = [
  "upgradeSubscription",
  "aipifyOverview",
  "businessPacks",
  "knowledgeCenter",
  "companionOverview",
] as const;

const FORBIDDEN_ENGLISH_SOURCE_TITLES = new Set([
  "Upgrade Options",
  "Getting Started",
  "Knowledge Center",
  "Available Business Packs",
  "Installed Business Packs",
  "Subscription",
]);

const ALLOWED_PRODUCT_TOKENS =
  /\b(Aipify|Companion|Business Packs|API|CRM|APP|ABOS|Command Center|Command Brief|Intelligence|Shopify|Chrome|Edge|Safari|Enterprise|Starter|Professional|Business|FAQ|2FA|PDF|QR|NOK)\b/i;

function stripAllowedProductTokens(value: string): string {
  return value
    .replace(/\b(Aipify|Companion|Business Packs|API|CRM|APP|ABOS|Command Center|Command Brief|Intelligence|Shopify|Chrome|Edge|Safari|Enterprise|Starter|Professional|Business|FAQ|2FA|PDF|QR|NOK)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isLikelyEnglishPlaceholder(noValue: string, enValue: string): boolean {
  if (noValue.trim() === enValue.trim()) {
    return !isAllowedIdenticalValue(noValue);
  }
  return false;
}

function isAllowedIdenticalValue(value: string): boolean {
  const stripped = stripAllowedProductTokens(value);
  return stripped.length === 0;
}

function loadJson(relativePath: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8")) as Record<string, unknown>;
}

function nestedGet(obj: Record<string, unknown>, dotted: string): unknown {
  return dotted.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function createLocaleTranslator(locale: string) {
  const platformKnowledge = loadJson(`locales/${locale}/customer-app/companionPlatformKnowledge.json`);
  const companion = loadJson(`locales/${locale}/customer-app/companion.json`);
  const enPlatform = locale === "en" ? platformKnowledge : loadJson("locales/en/customer-app/companionPlatformKnowledge.json");
  const enCompanion = locale === "en" ? companion : loadJson("locales/en/customer-app/companion.json");

  return (key: string): string => {
    const parts = key.split(".");
    const namespace = parts[1];
    const rest = parts.slice(2).join(".");
    const root =
      namespace === "companionPlatformKnowledge"
        ? platformKnowledge.companionPlatformKnowledge
        : namespace === "companionExperience"
          ? companion.companionExperience
          : undefined;
    const enRoot =
      namespace === "companionPlatformKnowledge"
        ? enPlatform.companionPlatformKnowledge
        : namespace === "companionExperience"
          ? enCompanion.companionExperience
          : undefined;
    const value = nestedGet(root as Record<string, unknown>, rest) ?? nestedGet(enRoot as Record<string, unknown>, rest);
    return typeof value === "string" ? value : key;
  };
}

for (const locale of COMPANION_COVERAGE_LOCALES) {
  const dict = loadJson(`locales/${locale}/customer-app/companionPlatformKnowledge.json`);
  const fallback = (dict.companionPlatformKnowledge as Record<string, unknown>).fallback as Record<string, string>;
  const actions = (dict.companionPlatformKnowledge as Record<string, unknown>).actions as Record<string, string>;

  for (const key of FALLBACK_KEYS) {
    assert.ok(fallback[key]?.trim(), `${locale} missing fallback.${key}`);
    assert.doesNotMatch(fallback[key], /^customerApp\./, `${locale} raw key in fallback.${key}`);
  }

  for (const key of FALLBACK_ACTION_KEYS) {
    assert.ok(actions[key]?.trim(), `${locale} missing actions.${key}`);
    assert.doesNotMatch(actions[key], /^customerApp\./, `${locale} raw key in actions.${key}`);
  }

  if (locale !== "en") {
    assert.notEqual(fallback.step1, ENGLISH_STEP1, `${locale} fallback.step1 must not be English`);
    assert.notEqual(fallback.step2, ENGLISH_STEP2, `${locale} fallback.step2 must not be English`);
  }
}

const noFallback = (
  loadJson("locales/no/customer-app/companionPlatformKnowledge.json").companionPlatformKnowledge as {
    fallback: Record<string, string>;
  }
).fallback;
assert.equal(noFallback.step1, NO_EXPECTED.step1);
assert.equal(noFallback.step2, NO_EXPECTED.step2);

const tNo = createLocaleTranslator("no");
const fallbackAnswer = buildFallbackAnswer(tNo, { userRole: "owner" });
assert.equal(fallbackAnswer.steps[0], NO_EXPECTED.step1);
assert.equal(fallbackAnswer.steps[1], NO_EXPECTED.step2);
assert.ok(fallbackAnswer.actions.some((action) => action.label === "Åpne Aipify Companion"));
assert.ok(fallbackAnswer.actions.some((action) => action.label === "Les om sikker tilkobling"));
assert.ok(fallbackAnswer.actions.some((action) => action.label === "Kontakt support"));

for (const locale of COMPANION_COVERAGE_LOCALES) {
  const companion = loadJson(`locales/${locale}/customer-app/companion.json`);
  const experience = companion.companionExperience as Record<string, string> | undefined;
  assert.ok(experience, `${locale} companionExperience section`);
  for (const key of FEEDBACK_KEYS) {
    const value = experience[key];
    assert.ok(value?.trim(), `${locale} missing companionExperience.${key}`);
    assert.doesNotMatch(value, /^customerApp\./, `${locale} raw key in companionExperience.${key}`);
    if (locale !== "en") {
      assert.notEqual(value, nestedGet(
        loadJson("locales/en/customer-app/companion.json").companionExperience as Record<string, unknown>,
        key,
      ), `${locale} companionExperience.${key} must not English-fallback copy`);
    }
  }

  const labels = buildCompanionExperienceLabels(createLocaleTranslator(locale));
  assert.doesNotMatch(labels.feedbackHelpful, /^customerApp\./, `${locale} feedbackHelpful label`);
  assert.doesNotMatch(labels.sourcesShow, /^customerApp\./, `${locale} sourcesShow label`);
}

const enArticles = (
  loadJson("locales/en/customer-app/companionPlatformKnowledge.json").companionPlatformKnowledge as {
    articles: Record<string, Record<string, string>>;
  }
).articles;
const noArticles = (
  loadJson("locales/no/customer-app/companionPlatformKnowledge.json").companionPlatformKnowledge as {
    articles: Record<string, Record<string, string>>;
    gap: Record<string, string>;
  }
).articles;
const noGap = (
  loadJson("locales/no/customer-app/companionPlatformKnowledge.json").companionPlatformKnowledge as {
    gap: Record<string, string>;
  }
).gap;
const enGap = (
  loadJson("locales/en/customer-app/companionPlatformKnowledge.json").companionPlatformKnowledge as {
    gap: Record<string, string>;
  }
).gap;

for (const articleId of Object.keys(enArticles)) {
  const enArticle = enArticles[articleId] ?? {};
  const noArticle = noArticles[articleId] ?? {};
  for (const field of ARTICLE_TRANSLATABLE_FIELDS) {
    const noValue = noArticle[field];
    const enValue = enArticle[field];
    if (!noValue?.trim() || !enValue?.trim()) continue;
    assert.ok(
      !isLikelyEnglishPlaceholder(noValue, enValue),
      `no articles.${articleId}.${field} must not remain English canonical placeholder`,
    );
  }
}

const upgradeSubscription = noArticles.upgradeSubscription;
assert.equal(upgradeSubscription.title, "Oppgrader abonnementet");
assert.match(upgradeSubscription.directAnswer, /Fakturering|Sammenlign planer/);
assert.match(upgradeSubscription.explanation, /Oppgraderinger gir/);
assert.match(upgradeSubscription.step1, /Fakturering → Oppgraderingsalternativer/);
assert.match(upgradeSubscription.step2, /Sammenlign planer/);
assert.match(upgradeSubscription.step3, /Fullfør oppgraderingsflyten/);

assert.notEqual(noGap.noGroundedAnswer, enGap.noGroundedAnswer);
assert.match(noGap.noGroundedAnswer, /Jeg fant ikke/);
assert.notEqual(noGap.sourceLabel, enGap.sourceLabel);

const portalNav = (
  loadJson("locales/no/customer-app/portalStructure.json").portalStructure as {
    nav: Record<string, string>;
  }
).nav;

assert.equal(portalNav.upgradeOptions, "Oppgraderinger");
assert.equal(portalNav.knowledgeCenter, "Kunnskapssenter");
assert.equal(portalNav.gettingStarted, "Kom i gang");
assert.equal(portalNav.availableBusinessPacks, "Tilgjengelige Business Packs");
assert.equal(portalNav.subscription, "Abonnement");
assert.equal(portalNav.aipifyCompanion, "Aipify Companion");

for (const title of Object.values(portalNav)) {
  assert.ok(!FORBIDDEN_ENGLISH_SOURCE_TITLES.has(title), `portal nav title must not be English: ${title}`);
}

async function assertNorwegianPublicCompanionResponses(): Promise<void> {
  installServerOnlyShim();
  const { askPublicPlatformCompanion } = await import("@/lib/marketing/public-companion-ask");

  const ENGLISH_CANONICAL_SNIPPETS = [
    "Upgrades unlock additional capacity",
    "Open Billing → Upgrade Options",
    "Compare plans and select the best fit",
    "Browse available packs under Business Packs → Available",
    "Open Business Packs → Available to browse the catalog",
    "Aipify Companion is your in-portal guide",
    "Knowledge Center complements Companion",
    "Approved guides and FAQ articles live under Support → Knowledge Center",
  ];

  function assertConsistentNorwegianPublicResponse(
    response: Awaited<ReturnType<typeof askPublicPlatformCompanion>>,
  ) {
    assert.equal(response.locale, "no");
    const combined = [
      response.answer.directAnswer,
      response.answer.explanation ?? "",
      ...response.answer.steps,
      ...response.actions.map((action) => action.label),
    ].join("\n");

    for (const snippet of ENGLISH_CANONICAL_SNIPPETS) {
      assert.ok(!combined.includes(snippet), `unexpected English snippet: ${snippet}`);
    }
  }

  const publicNoCases = [
    {
      question: "Hva koster Aipify?",
      assertExtra: (response: Awaited<ReturnType<typeof askPublicPlatformCompanion>>) => {
        assert.match(response.answer.explanation ?? "", /Oppgraderinger gir|Priser kommer/);
        assert.ok(response.answer.steps.length > 0);
      },
    },
    {
      question: "Kan noen vise meg hvordan Aipify fungerer?",
      assertExtra: (response: Awaited<ReturnType<typeof askPublicPlatformCompanion>>) => {
        assert.ok(response.actions.length > 0);
      },
    },
    {
      question: "Hvordan fungerer disse pakkene for bedrifter?",
      assertExtra: (response: Awaited<ReturnType<typeof askPublicPlatformCompanion>>) => {
        assert.match(response.answer.directAnswer.toLowerCase(), /business pack|forretningspak|modul|pack/);
      },
    },
    {
      question: "Jeg er ny her, hva burde jeg begynne med?",
      assertExtra: (response: Awaited<ReturnType<typeof askPublicPlatformCompanion>>) => {
        assert.ok(response.answer.directAnswer.length > 20);
      },
    },
  ] as const;

  for (const scenario of publicNoCases) {
    const response = await askPublicPlatformCompanion({ question: scenario.question, locale: "no" });
    assertConsistentNorwegianPublicResponse(response);
    scenario.assertExtra(response);
  }

  const gapResponse = await askPublicPlatformCompanion({
    question: "Kan Aipify hjelpe meg med helt ukjent intergalaktisk flux?",
    locale: "no",
  });
  assert.match(gapResponse.answer.directAnswer, /Jeg fant ikke/);
  assert.equal(gapResponse.supportEscalation.offered, true);
  assertConsistentNorwegianPublicResponse(gapResponse);
}

assertNorwegianPublicCompanionResponses().then(() => {
  console.log("companion-fallback-guidance-i18n.test.ts: all assertions passed");
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
