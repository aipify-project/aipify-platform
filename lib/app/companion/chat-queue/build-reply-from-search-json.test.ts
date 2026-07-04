import assert from "node:assert/strict";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import { createTranslator } from "@/lib/i18n/translate";
import { buildEnrichedReplyFromSearchJson } from "./build-reply-from-search-json";
import { buildCompanionExperienceLabels } from "../labels";

const t = createTranslator({});
const labels = buildCompanionExperienceLabels(t);

function pricingAnswer(): PlatformKnowledgeAnswer {
  return {
    directAnswer: "Published pricing summary for your workspace.",
    explanation: "",
    steps: [],
    actions: [],
    sources: [],
    sourceId: "subscription-pricing",
    source: "platform_corpus",
    confidence: "high",
  };
}

void (async () => {
  const built = await buildEnrichedReplyFromSearchJson(
    {
      found: true,
      query: "Hva koster det?",
      answer: pricingAnswer(),
      organization_state: "unknown",
    },
    labels,
    "Hva koster det?",
    { locale: "no", organizationState: "unknown" },
  );

  assert.ok(built.message.ctas && built.message.ctas.length > 0, "pricing reply should include CTAs");
  assert.ok(
    built.message.ctas.some((cta) => cta.href.includes("pricing") || cta.href.includes("register")),
    "pricing CTAs should target pricing or registration routes",
  );
  assert.ok(built.payload.ctas && built.payload.ctas.length > 0, "payload should persist CTAs");
  assert.equal(
    built.payload.ctas?.length,
    built.message.ctas?.length,
    "message and payload CTA counts should match",
  );

  console.log("build-reply-from-search-json.test.ts: all assertions passed");
})().catch((error) => {
  throw error;
});
