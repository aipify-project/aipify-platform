import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { shouldRouteThroughAipifyCore } from "@/lib/companion-platform-knowledge/aipify-core-runtime";
import { companionDirectTurnDictionarySplits } from "@/lib/companion-runtime/companion-oaa-dictionary-splits";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { createTranslator } from "@/lib/i18n/translate";

const repoRoot = path.join(import.meta.dirname, "..", "..", "..", "..");
const PRODUCT_QUERY = "Hvilke løsninger har Aipify?";
const ALT_PRODUCT_QUERY = "Hva tilbyr plattformen?";
const CAPABILITIES_DIRECT_ANSWER_KEY =
  "customerApp.companionPlatformKnowledge.articles.aipifyCapabilities.directAnswer";
const SYNTHESIS_NATURAL_LEAD_KEY =
  "customerApp.companionPlatformKnowledge.synthesis.naturalLead";
const TEMPLATE_LEAK_PATTERN =
  /\b(Natural Lead|Direct Answer|Explanation|Title \(knowledge\)|Step1|Step2)\b/;

async function runTests() {
  assert.equal(
    shouldRouteThroughAipifyCore(PRODUCT_QUERY),
    true,
    "product-knowledge query must route through Core",
  );

  const executeTurnSource = fs.readFileSync(
    path.join(repoRoot, "lib/app/companion/chat-queue/execute-turn.ts"),
    "utf8",
  );
  assert.match(
    executeTurnSource,
    /shouldRouteThroughAipifyCore\(query\)/,
    "lightweight dictionary splits must load platform knowledge for Core-routed queries",
  );

  const minimalDictionary = await getCustomerAppDictionaryForSplits("no", ["companion"]);
  const platformDictionary = await getCustomerAppDictionaryForSplits(
    "no",
    companionDirectTurnDictionarySplits(),
  );
  const tMinimal = createTranslator(minimalDictionary);
  const tPlatform = createTranslator(platformDictionary);

  assert.equal(
    tMinimal(CAPABILITIES_DIRECT_ANSWER_KEY),
    "Direct Answer",
    "missing companionPlatformKnowledge split humanizes corpus keys",
  );
  assert.match(
    tPlatform(CAPABILITIES_DIRECT_ANSWER_KEY),
    /Aipify/,
    "platform dictionary split resolves real product-knowledge copy",
  );
  assert.ok(
    !TEMPLATE_LEAK_PATTERN.test(tPlatform(CAPABILITIES_DIRECT_ANSWER_KEY)),
    "resolved corpus answer must not contain humanized template labels",
  );

  const naturalLead = tPlatform(SYNTHESIS_NATURAL_LEAD_KEY).replace("{locale}", "no").replace(
    "{sourceCount}",
    "1",
  );
  assert.ok(
    !TEMPLATE_LEAK_PATTERN.test(naturalLead),
    "synthesis natural lead must not humanize when platform split is loaded",
  );

  const composed = [naturalLead, tPlatform(CAPABILITIES_DIRECT_ANSWER_KEY)]
    .filter(Boolean)
    .join("\n");
  assert.ok(
    !TEMPLATE_LEAK_PATTERN.test(composed),
    "composed customer-visible answer must not leak internal template labels",
  );

  if (shouldRouteThroughAipifyCore(ALT_PRODUCT_QUERY)) {
    const altAnswer = tPlatform(CAPABILITIES_DIRECT_ANSWER_KEY);
    assert.ok(!TEMPLATE_LEAK_PATTERN.test(altAnswer));
  }

  console.log("product-knowledge-dictionary-splits.test.ts: all assertions passed");
}

runTests().catch((error) => {
  console.error(error);
  process.exit(1);
});
