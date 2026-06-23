import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  isPlatformFoundationQuery,
  resolvePlatformFoundationTopicId,
} from "@/lib/companion-runtime/platform-foundation-intent";
import { loadPlayfulFoxFoundationSpec, loadSelfLoveFoundationSpec } from "@/lib/companion-runtime/platform-foundation-loader";
import { buildSelfLoveFoundationAnswer } from "@/lib/companion-runtime/platform-foundation-answer";
import { COMPANION_COVERAGE_LOCALES } from "@/lib/companion-runtime/companion-foundation-coverage-i18n";

const repoRoot = path.join(import.meta.dirname, "..", "..");

const FOUNDATION_CANARIES = [
  { query: "Hva er Self Love?", topic: "self_love_principle" as const },
  { query: "Hva sier reven?", topic: "playful_fox_exchange" as const },
];

for (const { query, topic } of FOUNDATION_CANARIES) {
  assert.equal(isPlatformFoundationQuery(query), true, query);
  assert.equal(resolvePlatformFoundationTopicId(query), topic, query);
}

assert.equal(resolvePlatformFoundationTopicId("Vis aktive medlemmer."), null);
assert.equal(resolvePlatformFoundationTopicId("Hvor finner jeg fakturaer?"), null);

const selfLoveSpec = loadSelfLoveFoundationSpec();
assert.ok(selfLoveSpec.philosophy.length > 20);
assert.ok(selfLoveSpec.boundaries.length > 0);

const foxSpec = loadPlayfulFoxFoundationSpec();
assert.ok(foxSpec.fox_exchange.aipify_responds.includes("Ring-ding"));

function loadJson(relativePath: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8")) as Record<
    string,
    unknown
  >;
}

function createTranslator(locale: string) {
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

const t = createTranslator("no");
const selfLoveAnswer = buildSelfLoveFoundationAnswer({
  body: "Self Love test body",
  sourceLabel: "Aipify platform knowledge",
  sourceId: "self-love-test",
  source: "knowledge_center",
  sourceKind: "knowledge_center",
  t,
  locale: "no",
});

assert.match(selfLoveAnswer.directAnswer, /Self Love test body/);
assert.equal(selfLoveAnswer.orgConfirmEligible, false);
assert.ok(selfLoveAnswer.sources.length > 0);
assert.match(selfLoveAnswer.explanation ?? "", /Kilde:|Source:/i);

const orchestratorSource = fs.readFileSync(
  path.join(repoRoot, "lib/companion-runtime/orchestrator.ts"),
  "utf8",
);
assert.ok(orchestratorSource.includes("resolvePlatformFoundationAnswer"));
const foundationIndex = orchestratorSource.indexOf("await resolvePlatformFoundationAnswer");
const orgIntelIndex = orchestratorSource.indexOf("await resolveOrganizationIntelligenceAnswer");
assert.ok(foundationIndex > 0 && foundationIndex < orgIntelIndex);

for (const locale of COMPANION_COVERAGE_LOCALES) {
  const dict = loadJson(`locales/${locale}/customer-app/companionPlatformKnowledge.json`);
  const section = (dict.companionPlatformKnowledge as Record<string, unknown>).foundation as
    | Record<string, string>
    | undefined;
  assert.ok(section?.selfLoveLead, `${locale} foundation.selfLoveLead`);
  assert.ok(section?.foxBellTitle, `${locale} foundation.foxBellTitle`);
}

console.log("platform-foundation-intent.test.ts: all assertions passed");
