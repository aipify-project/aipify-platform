import assert from "node:assert/strict";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import { createTranslator } from "@/lib/i18n/translate";
import {
  enrichCompanionPlatformAnswer,
  enrichCompanionResponseWithTranslator,
  resolveCompanionEnrichmentIntent,
  resolveCompanionOrganizationState,
} from "./companion-response-enrichment";

const t = createTranslator({});

function baseAnswer(overrides: Partial<PlatformKnowledgeAnswer> = {}): PlatformKnowledgeAnswer {
  return {
    directAnswer: "Example answer text.",
    explanation: "",
    steps: [],
    actions: [],
    sources: [],
    sourceId: "general",
    source: "platform_knowledge",
    confidence: "high",
    ...overrides,
  };
}

// Intent resolution
assert.equal(resolveCompanionEnrichmentIntent("What does pricing look like?"), "pricing");
assert.equal(resolveCompanionEnrichmentIntent("Tell me about business packs"), "business_packs");
assert.equal(
  resolveCompanionEnrichmentIntent("How do I register my organization?"),
  "onboarding",
);
assert.equal(resolveCompanionEnrichmentIntent("I need help with support"), "support");
assert.equal(resolveCompanionEnrichmentIntent("What is the weather today?"), "general");

// Organization state
assert.equal(
  resolveCompanionOrganizationState({ subscription: { status: "active" } }),
  "active",
);
assert.equal(
  resolveCompanionOrganizationState({ subscription: { status: "trialing" } }),
  "trial",
);
assert.equal(resolveCompanionOrganizationState(null), "unknown");

// Pricing intent injects trial + pricing CTAs for new/unknown orgs
{
  const enriched = enrichCompanionResponseWithTranslator({
    text: "Pricing overview",
    intent: "pricing",
    context: { organizationState: "unknown" },
    t,
  });
  assert.equal(enriched.actions.length, 2);
  assert.ok(enriched.actions.some((action) => action.route.includes("pricing")));
}

// Active org on pricing gets view pricing only
{
  const enriched = enrichCompanionResponseWithTranslator({
    text: "Pricing overview",
    intent: "pricing",
    context: { organizationState: "active" },
    t,
  });
  assert.equal(enriched.actions.length, 1);
  assert.ok(enriched.actions[0]?.route.includes("pricing"));
}

// Onboarding for new org
{
  const enriched = enrichCompanionResponseWithTranslator({
    text: "Getting started",
    intent: "onboarding",
    context: { organizationState: "new" },
    t,
  });
  assert.equal(enriched.actions.length, 2);
  assert.ok(enriched.actions.some((action) => action.route.includes("team")));
  assert.ok(enriched.actions.some((action) => action.route.includes("book-demo")));
}

// Onboarding for active org skips register
{
  const enriched = enrichCompanionResponseWithTranslator({
    text: "Getting started",
    intent: "onboarding",
    context: { organizationState: "active" },
    t,
  });
  assert.equal(enriched.actions.length, 1);
  assert.ok(enriched.actions[0]?.route.includes("book-demo"));
}

// Business packs intent
{
  const enriched = enrichCompanionResponseWithTranslator({
    text: "Business packs",
    intent: "business_packs",
    context: { organizationState: "active" },
    t,
  });
  assert.equal(enriched.actions.length, 1);
  assert.ok(enriched.actions[0]?.route.includes("business-packs"));
}

// Support intent
{
  const enriched = enrichCompanionResponseWithTranslator({
    text: "Support",
    intent: "support",
    context: { organizationState: "active" },
    t,
  });
  assert.equal(enriched.actions.length, 1);
  assert.ok(enriched.actions[0]?.route.includes("support"));
}

// General intent without existing actions adds subtle explore
{
  const enriched = enrichCompanionResponseWithTranslator({
    text: "General info",
    intent: "general",
    context: { organizationState: "active" },
    t,
  });
  assert.equal(enriched.actions.length, 1);
  assert.ok(enriched.actions[0]?.route.includes("companion"));
}

// General intent with existing actions does not spam
{
  const enriched = enrichCompanionResponseWithTranslator({
    text: "General info",
    intent: "general",
    context: { organizationState: "active" },
    existingActions: [
      {
        label: "Existing",
        href: "/app/existing",
        routeKey: "existing",
        labelKey: "existing",
        variant: "primary",
      },
    ],
    t,
  });
  assert.equal(enriched.actions.length, 1);
  assert.equal(enriched.actions[0]?.route, "/app/existing");
}

// Platform answer enrichment merges without duplicating
{
  const answer = baseAnswer({ directAnswer: "Price details here." });
  const enriched = enrichCompanionPlatformAnswer(answer, {
    query: "How much does it cost?",
    t,
    organizationState: "unknown",
  });
  assert.ok(enriched.actions.length >= 1);
  assert.equal(enriched.directAnswer, answer.directAnswer);
}

console.log("companion-response-enrichment.test.ts: all assertions passed");
