import assert from "node:assert/strict";
import { createTranslator } from "@/lib/i18n/translate";
import { isTrueCompanionSmalltalk } from "./aipify-core-runtime";
import {
  isAipifyCoreKnowledgeQuery,
  isPlatformProductKnowledgeQuery,
  resolvePlatformProductCorpusArticleId,
  resolvePlatformProductFoundationTopic,
  shouldBypassOrganizationIntelligenceForProductQuery,
} from "./aipify-core-runtime";
import { buildGrowthPartnersFoundationResult } from "./platform-product-foundation-answer";
import { resolvePlatformCorpus } from "./answer-builder";
import { PLATFORM_KNOWLEDGE_CORPUS } from "./platform-corpus";

const t = createTranslator({});

const VALIDATION_QUERIES: Array<{
  query: string;
  topic: ReturnType<typeof resolvePlatformProductFoundationTopic>;
  corpusId: ReturnType<typeof resolvePlatformProductCorpusArticleId>;
}> = [
  { query: "Hva er Aipify?", topic: "aipify_overview", corpusId: "aipify-overview" },
  {
    query: "Hva kan Aipify hjelpe meg med?",
    topic: "aipify_capabilities",
    corpusId: "aipify-capabilities",
  },
  {
    query: "Hva koster Aipify?",
    topic: "subscription_pricing",
    corpusId: "subscription-pricing",
  },
  {
    query: "Hvor registrerer jeg meg?",
    topic: "onboarding_registration",
    corpusId: "install-web-app",
  },
  {
    query: "Hvordan blir jeg Aipify Partner?",
    topic: "growth_partners",
    corpusId: "growth-partners",
  },
  {
    query: "Hva er Growth Partners?",
    topic: "growth_partners",
    corpusId: "growth-partners",
  },
  {
    query: "Hva er Business Packs?",
    topic: "business_packs",
    corpusId: "business-packs",
  },
  {
    query: "Hvordan legger jeg til ansatte i APP?",
    topic: "team_members",
    corpusId: "add-team-members",
  },
  {
    query: "Hva kan Aipify gjøre for bedriften min?",
    topic: "aipify_capabilities",
    corpusId: "aipify-capabilities",
  },
  {
    query: "Hvordan kontakter jeg support?",
    topic: "support_contact",
    corpusId: "contact-support",
  },
];

for (const { query, topic, corpusId } of VALIDATION_QUERIES) {
  assert.equal(
    resolvePlatformProductFoundationTopic(query),
    topic,
    `topic for: ${query}`,
  );
  assert.equal(
    resolvePlatformProductCorpusArticleId(query),
    corpusId,
    `corpus for: ${query}`,
  );
  assert.equal(isPlatformProductKnowledgeQuery(query), true, `product query: ${query}`);
  assert.equal(
    shouldBypassOrganizationIntelligenceForProductQuery(query),
    true,
    `bypass org intel: ${query}`,
  );
  assert.equal(isTrueCompanionSmalltalk(query), false, `not smalltalk: ${query}`);
}

const growthResult = buildGrowthPartnersFoundationResult(t, {
  userRole: "owner",
  enabledFeatures: [],
});
assert.equal(growthResult.matchedArticleId, "growth-partners");
assert.ok(growthResult.answer.directAnswer.trim().length > 0);
assert.ok(growthResult.answer.actions.some((action) => action.href.includes("growth-partners")));

const corpus = resolvePlatformCorpus(PLATFORM_KNOWLEDGE_CORPUS, t, () => []);
for (const { corpusId } of VALIDATION_QUERIES) {
  if (corpusId === "growth-partners") continue;
  assert.ok(
    corpus.some((article) => article.id === corpusId),
    `corpus article exists: ${corpusId}`,
  );
}

console.log("platform-product-foundation.test.ts: all assertions passed");
