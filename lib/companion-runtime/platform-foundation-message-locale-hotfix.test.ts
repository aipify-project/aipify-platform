import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  resolveAnswerLocale,
  resolveCompanionResponseLocale,
} from "@/lib/companion-platform-knowledge/language";
import {
  classifyCompanionSubmitPath,
  resolveDirectTurnRoute,
} from "@/lib/companion-runtime/companion-submit-path";
import {
  buildFoxFoundationAnswer,
  buildPlatformFoundationGapAnswer,
} from "@/lib/companion-runtime/platform-foundation-answer";
import { resolvePlatformFoundationTopicId } from "@/lib/companion-runtime/platform-foundation-intent";
import { coerceToCustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";

const repoRoot = path.join(import.meta.dirname, "..", "..");
const INTERNAL_CODE_PATTERN =
  /playful_fox_exchange|foundation_unavailable|gapTopicLine|Grunnmur utilgjengelig|Topic:\s*\{/i;

function loadJson(relativePath: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8")) as Record<
    string,
    unknown
  >;
}

function createPlatformKnowledgeTranslator(locale: string) {
  const platformKnowledge = loadJson(`locales/${locale}/customer-app/companionPlatformKnowledge.json`);
  return (key: string): string => {
    const parts = key.split(".");
    const rest = parts.slice(2).join(".");
    const root = platformKnowledge.companionPlatformKnowledge as Record<string, unknown>;
    const walk = (node: Record<string, unknown>, dotted: string): unknown =>
      dotted.split(".").reduce<unknown>((acc, part) => {
        if (acc && typeof acc === "object" && part in (acc as Record<string, unknown>)) {
          return (acc as Record<string, unknown>)[part];
        }
        return undefined;
      }, node);
    const value = walk(root, rest);
    return typeof value === "string" ? value : key;
  };
}

async function runTests() {
  assert.equal(resolveAnswerLocale("no", "What does the fox say?"), "en");
  assert.equal(resolveAnswerLocale("no", "Hva sier reven?"), "no");
  assert.equal(resolveAnswerLocale("en", "Hva sier reven?"), "no");
  assert.equal(resolveAnswerLocale("sv", "What does the fox say?"), "en");
  assert.equal(resolveAnswerLocale("pl", "Co mówi lis?"), "pl");
  assert.equal(resolveAnswerLocale("uk", "Що каже лис?"), "uk");
  assert.equal(resolveAnswerLocale("no", "ok"), "no", "short unclear falls back to app locale");

  const appLocaleNo = "no";
  const englishFox = "What does the fox say?";
  const responseLocale = coerceToCustomerActiveLocale(
    resolveCompanionResponseLocale(appLocaleNo, englishFox),
  );
  assert.equal(responseLocale, "en");
  assert.equal(resolvePlatformFoundationTopicId(englishFox), "playful_fox_exchange");
  assert.equal(resolveDirectTurnRoute(englishFox, appLocaleNo), "foundation");
  assert.equal(
    classifyCompanionSubmitPath(englishFox, appLocaleNo),
    "direct",
    "foundation queries execute direct without queue",
  );

  const directTurnSource = fs.readFileSync(
    path.join(repoRoot, "lib/app/companion/chat-queue/direct-organization-turn.ts"),
    "utf8",
  );
  assert.ok(
    directTurnSource.includes("resolveAnswerLocale"),
    "direct foundation turn resolves message locale",
  );

  const routingSource = fs.readFileSync(
    path.join(repoRoot, "lib/companion-runtime/platform-foundation-routing.ts"),
    "utf8",
  );
  assert.ok(
    !routingSource.includes("humor_enabled"),
    "playful fox foundation must not block on default humor flag",
  );
  assert.ok(
    !routingSource.includes("gapTopicLine"),
    "foundation routing must not expose internal topic labels",
  );

  const enT = createPlatformKnowledgeTranslator("en");
  const noT = createPlatformKnowledgeTranslator("no");

  const englishFoxAnswer = buildFoxFoundationAnswer({
    response: enT("customerApp.companionPlatformKnowledge.foundation.foxResponse"),
    followUp: enT("customerApp.companionPlatformKnowledge.foundation.foxFollowUp"),
    t: enT,
  });
  assert.ok(englishFoxAnswer.directAnswer.includes("Ring-ding"));
  assert.ok(!INTERNAL_CODE_PATTERN.test(englishFoxAnswer.directAnswer));

  const norwegianFoxAnswer = buildFoxFoundationAnswer({
    response: noT("customerApp.companionPlatformKnowledge.foundation.foxResponse"),
    followUp: noT("customerApp.companionPlatformKnowledge.foundation.foxFollowUp"),
    t: noT,
  });
  assert.ok(norwegianFoxAnswer.directAnswer.includes("Ring-ding"));
  assert.ok(norwegianFoxAnswer.directAnswer.includes("leken"), "Norwegian follow-up stays Norwegian");

  const gap = buildPlatformFoundationGapAnswer(enT, "foundation_unavailable");
  assert.equal(gap.explanation, "");
  assert.ok(!gap.directAnswer.includes("playful_fox_exchange"));
  assert.ok(!INTERNAL_CODE_PATTERN.test(`${gap.directAnswer}\n${gap.explanation}`));

  const foxAnswer = buildFoxFoundationAnswer({
    response: "Ring-ding-ding-ding-dingeringeding 🦊",
    followUp: "A playful moment — ready when you are to continue.",
    t: enT,
  });
  assert.ok(!INTERNAL_CODE_PATTERN.test(foxAnswer.directAnswer));

  for (const locale of ["en", "no", "sv", "da", "pl", "uk"] as const) {
    const platformKnowledge = loadJson(`locales/${locale}/customer-app/companionPlatformKnowledge.json`);
    const foundation = (platformKnowledge.companionPlatformKnowledge as Record<string, unknown>)
      .foundation as Record<string, unknown>;
    assert.ok(typeof foundation.foxResponse === "string", `${locale} foxResponse`);
    assert.ok(typeof foundation.foxFollowUp === "string", `${locale} foxFollowUp`);
  }

  console.log("platform-foundation-message-locale-hotfix tests passed");
}

void runTests();
