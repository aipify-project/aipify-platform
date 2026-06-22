import { assertCoreSourceFreeOfCustomerPilotNames } from "./companion-core-source-hygiene";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import { createEmptyCompanionTenantContext } from "./companion-tenant-context";
import {
  buildCompanionModelContext,
  extractGroundedFactsFromAnswer,
  orderSourceMetadataForModel,
} from "./companion-model-context";
import { resolveCompanionIntelligenceTask, selectCompanionModelProfile } from "./companion-model-routing";
import {
  companionModelSynthesisAllowedInPhase12,
  evaluateCompanionSynthesisEligibility,
  feedbackMayBecomeCanonicalTruth,
} from "./companion-model-synthesis-governance";
import {
  applyCompanionModelSynthesis,
  synthesizeCompanionAnswer,
} from "./companion-model-synthesis";
import { validateFactIntegrity } from "./companion-output-pipeline";
import {
  setSynthesisAdapterFailureForTests,
} from "./companion-synthesis-adapter";

const groundedAnswer: PlatformKnowledgeAnswer = {
  directAnswer: "Aipify prepared a read-only answer.\nstatus: available\nactive_modules: 2",
  explanation: "Source: provider:demo · Checked: 22 Jun 2026, 12:00",
  steps: [],
  actions: [],
  sources: [
    { id: "demo.read", label: "Verified live data", kind: "verified_integration", meta: "fresh" },
    { id: "memory-1", label: "Confirmed memory", kind: "org_knowledge" },
  ],
  sourceId: "demo.read",
  source: "verified_integration",
  confidence: "high",
  liveIntegrationToolUsed: true,
};

const gapAnswer: PlatformKnowledgeAnswer = {
  directAnswer: "customerApp.companionPlatformKnowledge.gap.noGroundedAnswer",
  explanation: "No grounded basis.",
  steps: [],
  actions: [],
  sources: [{ id: "knowledge-gap", label: "Knowledge gap", kind: "platform_corpus" }],
  sourceId: "knowledge-gap",
  source: "fallback",
  confidence: "low",
};

const tenantContext = createEmptyCompanionTenantContext({
  organizationId: "org-a",
  organizationName: "Acme",
  effectivePermissions: ["read.metrics"],
  memoryContext: {
    confirmed_knowledge: [
      {
        id: "m1",
        title: "Policy",
        summary: "Returns accepted within 30 days.",
        source_reference: "mem-1",
        review_status: "confirmed",
        effective_from: "2026-06-01T00:00:00.000Z",
        audit_reference: "AUD-1",
        source_kind: "organization_memory",
      },
    ],
    organization_preferences: [],
    terminology_preferences: [],
    workflow_preferences: [],
    approved_response_patterns: [],
    source_references: [],
    effective_from: null,
    review_status: "confirmed",
    freshness: "fresh",
    permission_status: "allowed",
  },
});

const t = (key: string) => key;

assert.equal(companionModelSynthesisAllowedInPhase12(), true);
assert.equal(feedbackMayBecomeCanonicalTruth(), false);

const facts = extractGroundedFactsFromAnswer(groundedAnswer);
assert.ok(facts.includes("status: available"));
assert.ok(facts.includes("active_modules: 2"));

const orderedSources = orderSourceMetadataForModel(groundedAnswer.sources, true);
assert.equal(orderedSources[0]?.priority, "live");
assert.equal(orderedSources[0]?.id, "demo.read");

const modelContext = buildCompanionModelContext({
  query: "what is the connection status",
  locale: "en",
  answer: groundedAnswer,
  tenantContext,
  liveAnswer: true,
});

assert.equal(modelContext.live_data_present, true);
assert.ok(modelContext.grounded_facts.length >= 2);
assert.equal(modelContext.organization_context.organization_id, "org-a");

const task = resolveCompanionIntelligenceTask(modelContext);
assert.equal(task, "knowledge_retrieval");

const profile = selectCompanionModelProfile({ modelContext });
assert.ok(profile);
assert.equal(profile?.profile_id, "aipify-fast");

const synthesis = synthesizeCompanionAnswer({
  result: { answer: groundedAnswer },
  query: "what is the connection status",
  tenantContext,
  locale: "en",
  t,
});

assert.equal(synthesis.synthesized, true);
assert.equal(synthesis.fallback_used, false);
assert.ok(synthesis.profile_id);
assert.ok(synthesis.answer.directAnswer.includes("status: available"));
assert.ok(synthesis.answer.directAnswer.includes("active_modules: 2"));
assert.equal(synthesis.answer.sources.length, groundedAnswer.sources.length);
assert.equal(synthesis.answer.sources[0]?.id, "demo.read");

const preserved = ["status: available", "active_modules: 2"];
assert.ok(
  validateFactIntegrity(groundedAnswer.directAnswer, synthesis.answer.directAnswer, preserved),
);

const gapSynthesis = synthesizeCompanionAnswer({
  result: { answer: gapAnswer },
  query: "unknown topic",
  tenantContext,
  locale: "en",
  t,
});
assert.equal(gapSynthesis.synthesized, false);
assert.equal(gapSynthesis.fallback_used, true);
assert.equal(gapSynthesis.error_code, "fallback_answer");
assert.equal(gapSynthesis.answer.directAnswer, gapAnswer.directAnswer);

const permissionDeniedContext = buildCompanionModelContext({
  query: "restricted",
  locale: "en",
  answer: groundedAnswer,
  tenantContext: createEmptyCompanionTenantContext({
    actionContext: {
      ...tenantContext.actionContext,
      permission_denied: true,
    },
  }),
});
const permissionDenied = evaluateCompanionSynthesisEligibility({
  answer: groundedAnswer,
  modelContext: permissionDeniedContext,
});
assert.equal(permissionDenied.eligible, false);
if (!permissionDenied.eligible) {
  assert.equal(permissionDenied.reason, "permission_denied");
}

const highRiskContext = {
  ...modelContext,
  data_classification: "restricted" as const,
  risk_level: "high" as const,
  warnings: [...modelContext.warnings, "sensitive"],
};
const highRisk = evaluateCompanionSynthesisEligibility({
  answer: groundedAnswer,
  modelContext: highRiskContext,
});
assert.equal(highRisk.eligible, false);
if (!highRisk.eligible) {
  assert.equal(highRisk.reason, "high_risk");
}

setSynthesisAdapterFailureForTests("managed-fast");
const providerFailure = synthesizeCompanionAnswer({
  result: { answer: groundedAnswer },
  query: "what is the connection status",
  tenantContext,
  locale: "en",
  t,
});
setSynthesisAdapterFailureForTests(null);

assert.equal(providerFailure.synthesized, false);
assert.equal(providerFailure.fallback_used, true);
assert.equal(providerFailure.error_code, "provider_failure");
assert.equal(providerFailure.answer.directAnswer, groundedAnswer.directAnswer);

const actionPath = applyCompanionModelSynthesis({
  result: { answer: groundedAnswer },
  query: "execute send email",
  tenantContext,
  locale: "en",
  t,
  skipSynthesis: true,
});
assert.equal(actionPath.answer.directAnswer, groundedAnswer.directAnswer);

const tenantB = createEmptyCompanionTenantContext({ organizationId: "org-b" });
const tenantASynthesis = synthesizeCompanionAnswer({
  result: { answer: groundedAnswer },
  query: "status",
  tenantContext,
  locale: "en",
  t,
});
const tenantBSynthesis = synthesizeCompanionAnswer({
  result: { answer: groundedAnswer },
  query: "status",
  tenantContext: tenantB,
  locale: "en",
  t,
});
assert.notEqual(
  tenantContext.organizationId,
  tenantB.organizationId,
);
assert.ok(tenantASynthesis.synthesized);
assert.ok(tenantBSynthesis.synthesized);

const orchestratorSource = fs.readFileSync(
  path.join(process.cwd(), "lib/companion-runtime/orchestrator.ts"),
  "utf8",
);
assert.ok(orchestratorSource.includes("applyCompanionModelSynthesis"));
assert.equal(/selectModelProfile\s*\(\s*\{\s*task:\s*["']gpt/i.test(orchestratorSource), false);
assert.equal(/openai|claude|gemini/i.test(orchestratorSource), false);

const phase12Files = [
  "companion-model-context.ts",
  "companion-model-routing.ts",
  "companion-model-synthesis-governance.ts",
  "companion-model-synthesis.ts",
  "companion-synthesis-adapter.ts",
];
for (const file of phase12Files) {
  const source = fs.readFileSync(path.join(process.cwd(), "lib/companion-runtime", file), "utf8");
  assertCoreSourceFreeOfCustomerPilotNames(source, file);
}

const locales = ["no", "en", "sv", "da", "es", "pl", "uk"] as const;
for (const locale of locales) {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "locales", locale, "customer-app/companionPlatformKnowledge.json"),
    "utf8",
  );
  assert.ok(raw.includes('"synthesis"'), locale);
  assert.ok(raw.includes("naturalLead"), locale);
}

console.log("phase12 companion runtime tests passed");
