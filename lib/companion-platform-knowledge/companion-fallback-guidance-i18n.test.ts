import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { buildFallbackAnswer } from "@/lib/companion-platform-knowledge/answer-builder";
import { buildCompanionExperienceLabels } from "@/lib/app/companion/labels";
import { COMPANION_COVERAGE_LOCALES } from "@/lib/companion-runtime/companion-foundation-coverage-i18n";

const repoRoot = path.join(import.meta.dirname, "..", "..");

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

console.log("companion-fallback-guidance-i18n.test.ts: all assertions passed");
