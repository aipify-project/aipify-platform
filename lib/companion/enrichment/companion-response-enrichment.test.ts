import assert from "node:assert/strict";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import { createTranslator } from "@/lib/i18n/translate";
import type { CompanionEnrichmentDecisionLog } from "./companion-response-enrichment-types";
import { classifyCompanionTurnRoute } from "@/lib/companion-runtime/companion-turn-route";
import {
  __setCompanionEnrichmentLogSinkForTests,
  enrichCompanionPlatformAnswer,
  enrichCompanionResponseWithTranslator,
  enrichCompanionSearchJson,
  isCompanionOnboardingRegistrationQuery,
  resolveCompanionEnrichmentIntent,
  resolveCompanionOrganizationState,
  shouldDeferLightweightConversationalAnswer,
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
    source: "platform_corpus",
    confidence: "high",
    ...overrides,
  };
}

function captureEnrichmentLogs(run: () => void | Promise<void>): CompanionEnrichmentDecisionLog[] {
  const logs: CompanionEnrichmentDecisionLog[] = [];
  __setCompanionEnrichmentLogSinkForTests((decision) => {
    logs.push(structuredClone(decision));
  });
  try {
    const result = run();
    if (result instanceof Promise) {
      throw new Error("Use captureEnrichmentLogsAsync for async enrichment calls");
    }
  } finally {
    __setCompanionEnrichmentLogSinkForTests(null);
  }
  return logs;
}

async function captureEnrichmentLogsAsync(
  run: () => void | Promise<void>,
): Promise<CompanionEnrichmentDecisionLog[]> {
  const logs: CompanionEnrichmentDecisionLog[] = [];
  __setCompanionEnrichmentLogSinkForTests((decision) => {
    logs.push(structuredClone(decision));
  });
  try {
    await run();
  } finally {
    __setCompanionEnrichmentLogSinkForTests(null);
  }
  return logs;
}

function assertNoSensitiveContent(log: CompanionEnrichmentDecisionLog): void {
  const serialized = JSON.stringify(log);
  assert.doesNotMatch(serialized, /directAnswer|question|userMessage|answer text|Pricing overview|Getting started/i);
  assert.ok(!("text" in log));
  assert.ok(!("query" in log));
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

assert.equal(shouldDeferLightweightConversationalAnswer("Hva koster det?"), true);
assert.equal(shouldDeferLightweightConversationalAnswer("What is the weather today?"), false);
assert.equal(isCompanionOnboardingRegistrationQuery("hvor registrer jeg meg?"), true);
assert.equal(
  resolveCompanionEnrichmentIntent("hvor registrer jeg meg?"),
  "onboarding",
);
assert.equal(classifyCompanionTurnRoute("hvor registrer jeg meg?", "no"), "full");

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

// Pricing intent logs injected actions
{
  const logs = captureEnrichmentLogs(() => {
    enrichCompanionPlatformAnswer(baseAnswer(), {
      query: "What does pricing look like?",
      t,
      organizationState: "unknown",
      logContext: { correlationId: "corr-pricing-1" },
    });
  });
  assert.equal(logs.length, 1);
  const log = logs[0]!;
  assert.equal(log.intent, "pricing");
  assert.equal(log.organizationState, "unknown");
  assert.equal(log.existingActionCount, 0);
  assert.ok(log.injectedActionIds.includes("startFreeTrial"));
  assert.ok(log.injectedActionIds.includes("viewPricing"));
  assert.equal(log.finalActionCount, 2);
  assert.equal(log.skippedReason, undefined);
  assert.equal(log.correlationId, "corr-pricing-1");
  assertNoSensitiveContent(log);
}

// Onboarding intent logs injected actions
{
  const logs = captureEnrichmentLogs(() => {
    enrichCompanionPlatformAnswer(baseAnswer(), {
      query: "How do I register my organization?",
      t,
      organizationState: "new",
    });
  });
  assert.equal(logs.length, 1);
  const log = logs[0]!;
  assert.equal(log.intent, "onboarding");
  assert.ok(log.injectedActionIds.includes("registerOrganization"));
  assert.ok(log.injectedActionIds.includes("bookDemo"));
  assert.equal(log.finalActionCount, 2);
  assertNoSensitiveContent(log);
}

// General intent logs skipped/no-op when existing CTAs are present
{
  const logs = captureEnrichmentLogs(() => {
    enrichCompanionPlatformAnswer(
      baseAnswer({
        actions: [
          {
            label: "Existing",
            href: "/app/existing",
            routeKey: "existing",
            labelKey: "existing",
            variant: "primary",
          },
        ],
      }),
      {
        query: "What is the weather today?",
        t,
        organizationState: "active",
      },
    );
  });
  assert.equal(logs.length, 1);
  const log = logs[0]!;
  assert.equal(log.intent, "general");
  assert.equal(log.skippedReason, "general_existing_actions");
  assert.deepEqual(log.injectedActionIds, []);
  assert.equal(log.existingActionCount, 1);
  assert.equal(log.finalActionCount, 1);
  assertNoSensitiveContent(log);
}

// Existing CTAs are deduped and logging reflects final count
{
  const logs = captureEnrichmentLogs(() => {
    enrichCompanionPlatformAnswer(
      baseAnswer({
        actions: [
          {
            label: "Pricing",
            href: "/pricing",
            routeKey: "upgradeOptions",
            labelKey: "customerApp.companionPlatformKnowledge.actions.upgradeOptions",
            variant: "primary",
          },
        ],
      }),
      {
        query: "What does pricing look like?",
        t,
        organizationState: "unknown",
      },
    );
  });
  assert.equal(logs.length, 1);
  const log = logs[0]!;
  assert.equal(log.existingActionCount, 1);
  assert.equal(log.injectedActionIds.length, 1);
  assert.ok(log.injectedActionIds.includes("viewPricing"));
  assert.equal(log.finalActionCount, 2);
  assertNoSensitiveContent(log);
}

// Empty answer logs skip without user or answer text — run at end via async IIFE
async function runAsyncEnrichmentLoggingTests(): Promise<void> {
  const logs = await captureEnrichmentLogsAsync(async () => {
    await enrichCompanionSearchJson(
      { answer: { ...baseAnswer(), directAnswer: "   " } },
      {
        query: "secret user question text",
        locale: "en",
        organizationState: "unknown",
      },
    );
  });
  assert.equal(logs.length, 1);
  const log = logs[0]!;
  assert.equal(log.skippedReason, "empty_answer");
  assert.deepEqual(log.injectedActionIds, []);
  assert.equal(log.finalActionCount, 0);
  assertNoSensitiveContent(log);
}

void runAsyncEnrichmentLoggingTests()
  .then(() => {
    console.log("companion-response-enrichment.test.ts: all assertions passed");
  })
  .catch((error) => {
    throw error;
  });
