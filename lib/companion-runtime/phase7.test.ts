import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  canAccessCommandBrief,
  canAccessSinceLastLogin,
  createEmptyCompanionOperationalContext,
  isOperationalAppSuspended,
  normalizeCompanionOperationalContext,
} from "./companion-operational-context";
import { matchOperationalQuery } from "./companion-operational-query-match";
import { buildGroundedOperationalAnswer, buildOperationalGapAnswer } from "./operational-answer";
import { createEmptyCompanionTenantContext } from "./companion-tenant-context";
import type { ExecutiveCommandCenter } from "@/lib/executive-command-center-engine/parse";
import type { ActivityOperationsCenter } from "@/lib/activity-operations/types";

const executiveCenter: ExecutiveCommandCenter = {
  found: true,
  since_last_login: [
    {
      item_key: "completed:brief",
      item_title: "Daily briefing prepared",
      summary: "Aipify prepared the daily command briefing.",
      priority: "completed",
      item_category: "companion",
      occurred_at: "2026-06-22T08:00:00.000Z",
    },
  ],
  alerts: [
    {
      alert_key: "alert:open-1",
      alert_title: "Support queue review",
      summary: "Two cases await review.",
      priority: "attention",
      alert_status: "open",
    },
  ],
  actions: [
    {
      action_key: "action:critical-1",
      action_title: "Approve emergency policy",
      action_type: "approval",
      summary: "Critical policy update blocked.",
      priority: "critical",
      action_status: "blocked",
    },
  ],
  timeline: [],
};

const activityCenter: ActivityOperationsCenter = {
  found: true,
  since_last_login: {
    since: "2026-06-21T18:00:00.000Z",
    summary_lines: [{ text: "Two operational updates were recorded.", priority: "information" }],
    top_changes: [
      {
        id: "evt-1",
        scope: "organization",
        category: "operational_activity",
        priority: "information",
        title: "Workflow sync completed",
        occurred_at: "2026-06-22T07:30:00.000Z",
      },
    ],
    recommended_actions: [{ title: "Review pending approvals", href: "/app/approvals" }],
  },
};

const operationalContext = normalizeCompanionOperationalContext({
  executiveCenter,
  activityCenter,
  commandBriefing: {
    has_customer: true,
    enabled: true,
    key_items: [{ title: "Support queue stable", severity: "info", source_module: "support" }],
  },
  enabledModules: ["support", "approvals"],
  activeBusinessPacks: ["core_operations"],
});

assert.equal(operationalContext.since, "2026-06-21T18:00:00.000Z");
assert.ok(operationalContext.completed_items.length >= 1);
assert.ok(operationalContext.attention_items.length >= 1);
assert.ok(operationalContext.important_changes.length >= 1);
assert.ok(operationalContext.recommended_next_actions.length >= 1);
assert.ok(operationalContext.source_modules.length >= 1);
assert.equal(operationalContext.completeness, "complete");

const inactivePackContext = normalizeCompanionOperationalContext({
  executiveCenter,
  activityCenter: {
    ...activityCenter,
    since_last_login: {
      ...activityCenter.since_last_login!,
      top_changes: [
        {
          id: "evt-pack",
          scope: "organization",
          category: "business_pack_activity",
          priority: "information",
          title: "Inactive pack event",
          business_pack_key: "inactive_pack",
          occurred_at: "2026-06-22T07:00:00.000Z",
        },
      ],
    },
  },
  commandBriefing: null,
  enabledModules: ["support"],
  activeBusinessPacks: ["core_operations"],
});

assert.equal(
  inactivePackContext.important_changes.some((item) => item.title.includes("Inactive pack")),
  false,
);

const suspended = normalizeCompanionOperationalContext({
  executiveCenter,
  activityCenter,
  commandBriefing: null,
  enabledModules: [],
  activeBusinessPacks: [],
  appSuspended: true,
});
assert.equal(suspended.warnings.includes("app_suspended"), true);
assert.equal(suspended.completeness, "missing");

assert.equal(isOperationalAppSuspended("paused"), true);
assert.equal(canAccessCommandBrief(["executive.view"]), true);
assert.equal(canAccessSinceLastLogin(["activity_history.view"]), true);

const tenantContext = createEmptyCompanionTenantContext({
  commandBriefAvailable: true,
  sinceLastLoginAvailable: true,
  operationalContext,
  effectivePermissions: ["executive.view", "activity_history.view"],
});

const sinceMatch = matchOperationalQuery("what happened since last login", tenantContext);
assert.ok(sinceMatch);
assert.equal(sinceMatch?.kind, "since_last");

const attentionMatch = matchOperationalQuery("what requires attention", tenantContext);
assert.ok(attentionMatch);
assert.equal(attentionMatch?.kind, "attention");

const completedMatch = matchOperationalQuery("what did aipify complete", tenantContext);
assert.ok(completedMatch);
assert.equal(completedMatch?.kind, "completed");

const emptyTenant = createEmptyCompanionTenantContext({
  commandBriefAvailable: false,
  sinceLastLoginAvailable: false,
  operationalContext: createEmptyCompanionOperationalContext(),
});
assert.equal(matchOperationalQuery("command brief summary", emptyTenant), null);

const t = (key: string) => key;
const grounded = buildGroundedOperationalAnswer(
  operationalContext,
  { kind: "attention", score: 10 },
  t,
  "en",
);
assert.ok(grounded.directAnswer.includes("operational.leadAttention"));
assert.ok(grounded.explanation?.includes("operational.sourceLine"));
assert.equal(grounded.source, "customer_context");

const emptyGrounded = buildGroundedOperationalAnswer(
  createEmptyCompanionOperationalContext({ warnings: ["empty"], completeness: "missing" }),
  { kind: "overview", score: 5 },
  t,
  "en",
);
assert.ok(emptyGrounded.directAnswer.includes("operational.emptyOverview"));

const gap = buildOperationalGapAnswer(t, "permission_denied");
assert.ok(gap.explanation?.includes("operational.permissionDenied"));

const coreFiles = [
  "companion-operational-context.ts",
  "companion-operational-query-match.ts",
  "operational-answer.ts",
  "load-companion-operational-context.ts",
];
for (const file of coreFiles) {
  const source = fs.readFileSync(path.join(process.cwd(), "lib/companion-runtime", file), "utf8");
}

const locales = ["en", "no", "sv", "da", "es", "pl", "uk"];
for (const locale of locales) {
  const raw = fs.readFileSync(
    path.join(process.cwd(), `locales/${locale}/customer-app/companionPlatformKnowledge.json`),
    "utf8",
  );
  const parsed = JSON.parse(raw) as {
    companionPlatformKnowledge: { operational?: Record<string, string> };
  };
  assert.ok(parsed.companionPlatformKnowledge.operational?.sourceLine, locale);
  assert.ok(parsed.companionPlatformKnowledge.operational?.leadSinceLast, locale);
}

console.log("phase7 companion runtime tests passed");
