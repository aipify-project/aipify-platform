import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  createEmptyCompanionMemoryContext,
  normalizeCompanionMemoryContext,
} from "./companion-memory-context";
import {
  feedbackAffectsAnswerReadPath,
  helpfulFeedbackBecomesCanonicalTruth,
  negativeFeedbackWritesKnowledgeAutomatically,
  orgConfirmRequiresExplicitGovernance,
  canRecordOrgConfirm,
} from "./companion-feedback-governance";
import { matchConfirmedMemoryQuery } from "./companion-memory-query-match";
import {
  buildConfirmedMemoryAnswer,
  enrichAnswerWithMemoryContext,
} from "./memory-answer";
import { createEmptyCompanionTenantContext } from "./companion-tenant-context";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";

const t = (key: string) => {
  const map: Record<string, string> = {
    "customerApp.companionPlatformKnowledge.memory.sourceLine":
      "Source: {source} · Effective from: {effectiveFrom} · Review: {reviewStatus}",
    "customerApp.companionPlatformKnowledge.memory.sourceLabel": "Confirmed organization memory",
    "customerApp.companionPlatformKnowledge.memory.staleWarning": "Memory may be stale.",
    "customerApp.companionPlatformKnowledge.memory.terminologyLine":
      "Organization terminology preference: {value}",
    "customerApp.companionPlatformKnowledge.memory.workflowLine":
      "Approved workflow preference: {value}",
    "customerApp.companionPlatformKnowledge.grounded.timestampUnavailable": "Not available",
    "customerApp.companionPlatformKnowledge.memory.reviewStatus.confirmed": "confirmed",
    "customerApp.companionPlatformKnowledge.memory.reviewStatus.published": "published",
    "customerApp.companionPlatformKnowledge.memory.reviewStatus.reviewed": "reviewed",
    "customerApp.companionPlatformKnowledge.memory.reviewStatus.missing": "not confirmed",
  };
  return map[key] ?? key;
};

const memoryContext = normalizeCompanionMemoryContext({
  organizationMemoryRecords: [
    {
      id: "mem-1",
      title: "Refund escalation policy",
      summary: "Escalate refund disputes to finance within 24 hours.",
      status: "active",
      category: "process_improvements",
      source_reference: "policy:refunds-v2",
      created_at: "2026-06-01T10:00:00.000Z",
      updated_at: "2026-06-20T10:00:00.000Z",
    },
    {
      id: "mem-archived",
      title: "Old policy",
      summary: "Should be excluded.",
      status: "archived",
      category: "process_improvements",
      source_reference: "policy:old",
      created_at: "2025-01-01T10:00:00.000Z",
      updated_at: "2025-01-01T10:00:00.000Z",
    },
    {
      id: "mem-rejected",
      title: "Rejected draft",
      summary: "Should be excluded.",
      status: "draft",
      category: "support_learnings",
      source_reference: "draft:1",
      created_at: "2026-06-01T10:00:00.000Z",
      updated_at: "2026-06-01T10:00:00.000Z",
    },
  ],
  learningCenter: {
    has_customer: true,
    recent_learnings: [
      {
        id: "learn-1",
        pattern_type: "terminology",
        source_type: "terminology",
        approval_source: "learning_review",
        confidence_level: "high",
        confidence_score: 90,
        skill_key: null,
        explanation: "Use Customer Success instead of Account Manager in external copy.",
        status: "active",
        learned_at: "2026-06-10T10:00:00.000Z",
        reviewed_at: "2026-06-11T10:00:00.000Z",
      },
      {
        id: "learn-unreviewed",
        pattern_type: "draft",
        source_type: "support",
        approval_source: null,
        confidence_level: "low",
        confidence_score: 20,
        skill_key: null,
        explanation: "Unreviewed learning should not be confirmed.",
        status: "active",
        learned_at: "2026-06-10T10:00:00.000Z",
        reviewed_at: null,
      },
    ],
  },
  organizationKnowledgeHits: [
    {
      id: "ok-1",
      title: "Published org article",
      slug: "published-policy",
      category_slug: "operations",
      score: 0.5,
      body: "Published organization knowledge body.",
      source_type: "internal_documentation",
      published_at: "2026-06-15T10:00:00.000Z",
      language: "en",
    },
  ],
  memoryCenterPreferences: [
    {
      preference_key: "term.customer_success",
      preference_title: "Customer Success label",
      preference_category: "terminology",
      preference_value: "Customer Success",
      summary: "Preferred external label for account teams.",
    },
  ],
});

assert.equal(memoryContext.permission_status, "allowed");
assert.equal(memoryContext.confirmed_knowledge.length, 3);
assert.ok(memoryContext.confirmed_knowledge.every((item) => item.review_status !== "missing"));
assert.ok(memoryContext.terminology_preferences.length >= 1);
assert.ok(memoryContext.workflow_preferences.length >= 1);
assert.ok(memoryContext.source_references.includes("policy:refunds-v2"));
assert.equal(memoryContext.review_status, "confirmed");

const tenantContext = createEmptyCompanionTenantContext({
  memoryContext,
  confirmedOrganizationKnowledgeAvailable: true,
});

const match = matchConfirmedMemoryQuery("refund escalation policy", tenantContext);
assert.ok(match);
assert.equal(match?.item.id, "mem-1");

const memoryAnswer = buildConfirmedMemoryAnswer(match!, memoryContext, t, "en");
assert.ok(memoryAnswer.directAnswer.includes("Escalate refund disputes"));
assert.ok(memoryAnswer.explanation?.includes("policy:refunds-v2"));
assert.equal(memoryAnswer.source, "organization_knowledge");

const deniedContext = createEmptyCompanionMemoryContext({ permission_status: "denied" });
const deniedTenant = createEmptyCompanionTenantContext({
  memoryContext: deniedContext,
  confirmedOrganizationKnowledgeAvailable: false,
});
assert.equal(matchConfirmedMemoryQuery("refund escalation policy", deniedTenant), null);

assert.equal(feedbackAffectsAnswerReadPath(), false);
assert.equal(helpfulFeedbackBecomesCanonicalTruth(), false);
assert.equal(negativeFeedbackWritesKnowledgeAutomatically(), false);
assert.equal(orgConfirmRequiresExplicitGovernance(), true);
assert.equal(canRecordOrgConfirm("owner"), true);
assert.equal(canRecordOrgConfirm("staff"), false);

const corpusAnswer: PlatformKnowledgeAnswer = {
  directAnswer: "General guidance without live numbers.",
  explanation: "From approved sources.",
  steps: [],
  actions: [],
  sources: [{ id: "corpus", label: "Guide", kind: "platform_corpus" }],
  sourceId: "corpus",
  source: "platform_corpus",
  confidence: "moderate",
};

const enriched = enrichAnswerWithMemoryContext(
  corpusAnswer,
  "customer success terminology",
  memoryContext,
  t,
);
assert.ok(enriched.explanation?.includes("Organization terminology preference"));

const liveAnswer: PlatformKnowledgeAnswer = {
  ...corpusAnswer,
  directAnswer: "active_modules: 3",
  source: "verified_integration",
  liveIntegrationToolUsed: true,
};
const liveEnriched = enrichAnswerWithMemoryContext(
  liveAnswer,
  "customer success terminology",
  memoryContext,
  t,
  { liveAnswer: true },
);
assert.equal(liveEnriched.explanation, corpusAnswer.explanation);

const orchestratorSource = fs.readFileSync(
  path.join(process.cwd(), "lib/companion-runtime/orchestrator.ts"),
  "utf8",
);
assert.ok(orchestratorSource.includes("resolveConfirmedMemoryAnswer"));
assert.ok(orchestratorSource.includes("resolveApprovedOrganizationKnowledgeAnswer"));
assert.ok(orchestratorSource.indexOf("resolveLiveToolAnswer") < orchestratorSource.indexOf("resolveConfirmedMemoryAnswer"));
assert.ok(
  orchestratorSource.indexOf("resolveConfirmedMemoryAnswer") <
    orchestratorSource.indexOf("resolveApprovedOrganizationKnowledgeAnswer"),
);

const coreFiles = [
  "companion-memory-context.ts",
  "companion-feedback-governance.ts",
  "load-companion-memory-context.ts",
  "memory-answer.ts",
  "companion-memory-query-match.ts",
];
for (const file of coreFiles) {
  const source = fs.readFileSync(path.join(process.cwd(), "lib/companion-runtime", file), "utf8");
  assert.equal(/record_companion_answer_feedback/i.test(source), false, file);
}

const locales = ["no", "en", "sv", "da", "es", "pl", "uk"] as const;
for (const locale of locales) {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "locales", locale, "customer-app/companionPlatformKnowledge.json"),
    "utf8",
  );
  assert.ok(raw.includes('"memory"'), locale);
  assert.ok(raw.includes("reviewStatus"), locale);
}

console.log("phase9 companion runtime tests passed");
