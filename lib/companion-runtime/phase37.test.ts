import { assertCoreSourceFreeOfCustomerPilotNames } from "./companion-core-source-hygiene";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { COMPANION_COVERAGE_LOCALES } from "@/lib/companion-runtime/companion-foundation-coverage-i18n";
import { buildCompanionFoundationCoverageRegistry } from "@/lib/companion-runtime/companion-foundation-coverage-registry";
import { buildCommandBriefBundle } from "@/lib/companion-runtime/command-brief-orchestrator";
import { collectCommandBriefSignalsFromDomainContexts } from "@/lib/companion-runtime/command-brief-signal-collector";
import { createEmptyCompanionCommunityContext } from "@/lib/companion-runtime/companion-community-context";
import { createEmptyCompanionFinanceContext } from "@/lib/companion-runtime/companion-finance-context";
import { createEmptyCompanionHrContext } from "@/lib/companion-runtime/companion-hr-context";
import { createEmptyCompanionOperationalContext } from "@/lib/companion-runtime/companion-operational-context";
import { createEmptyCompanionProactiveContext } from "@/lib/companion-runtime/companion-proactive-context";
import { createEmptyCompanionSalesContext } from "@/lib/companion-runtime/companion-sales-context";
import { createEmptyCompanionSecurityContext } from "@/lib/companion-runtime/companion-security-context";
import { createEmptyCompanionWarehouseContext } from "@/lib/companion-runtime/companion-warehouse-context";
import { buildBookingCommandBriefSignals } from "@/lib/companion-runtime/booking-read-orchestrator";
import {
  COMMAND_BRIEF_SIGNAL_CATALOG,
  dedupeCommandBriefSignals,
  filterCommandBriefSignalsForPermission,
  isCommandBriefSourceDisplayable,
  prioritizeCommandBriefSignals,
  resolveCommandBriefSinceBoundary,
  type CommandBriefSignal,
} from "@/lib/integration-intelligence/command-brief";

const repoRoot = path.join(import.meta.dirname, "..", "..");
const ORG = "org-command-brief-37";
const sinceBoundary = "2026-06-20T08:00:00.000Z";
const beforeBoundary = "2026-06-19T08:00:00.000Z";
const afterBoundary = "2026-06-21T10:00:00.000Z";

function baseContexts() {
  return {
    hrContext: createEmptyCompanionHrContext({
      command_brief_signals: [{ signal_key: "onboarding_in_progress", count: 2 }],
      command_brief_events_linked: true,
    }),
    warehouseContext: createEmptyCompanionWarehouseContext({
      command_brief_signals: [{ signal_key: "low_stock", count: 4 }],
      command_brief_events_linked: true,
    }),
    financeContext: createEmptyCompanionFinanceContext({
      command_brief_signals: [{ signal_key: "overdue_invoice", count: 1 }],
      command_brief_events_linked: true,
    }),
    salesContext: createEmptyCompanionSalesContext({
      command_brief_signals: [{ signal_key: "churn_risk", count: 3 }],
      command_brief_events_linked: true,
    }),
    securityContext: createEmptyCompanionSecurityContext({
      command_brief_signals: [{ signal_key: "security_incident", count: 1 }],
      command_brief_events_linked: true,
    }),
    communityContext: createEmptyCompanionCommunityContext({
      command_brief_signals: [
        { signal_key: "pending_moderation", count: 5 },
        { signal_key: "activity_change", count: 2 },
      ],
      command_brief_events_linked: true,
    }),
    operationalContext: createEmptyCompanionOperationalContext({
      since: sinceBoundary,
      completed_items: [
        {
          id: "completed-1",
          title: "Companion prepared executive summary",
          category: "completed_by_aipify",
          occurred_at: afterBoundary,
        },
      ],
    }),
    proactiveContext: createEmptyCompanionProactiveContext({
      prioritized_signals: [
        {
          signal_id: "sales:churn_risk",
          signal_type: "risk",
          severity: "high",
          source_module: "sales",
          source_reference: "churn_risk",
          detected_at: afterBoundary,
          freshness: "fresh",
          title: "churn risk",
          summary: "3",
          recommended_action: null,
          required_capability: "risk_signal.read",
          required_permission: "sales.view",
          confidence: "moderate",
          status: "unresolved",
          business_impact: "high",
        },
      ],
    }),
  };
}

assert.ok(COMMAND_BRIEF_SIGNAL_CATALOG.length >= 40);

const boundary = resolveCommandBriefSinceBoundary({
  last_login_at: sinceBoundary,
  last_command_brief_view_at: "2026-06-22T08:00:00.000Z",
});
assert.equal(boundary.source, "last_command_brief_view_at");

const domainSignals = collectCommandBriefSignalsFromDomainContexts({
  organization_id: ORG,
  contexts: baseContexts(),
  booking_candidates: [
    { signal_key: "upcoming_bookings", count: 2, source_exact: true },
    { signal_key: "booking_conflict", count: 1, source_exact: false },
  ],
});
assert.ok(domainSignals.some((signal) => signal.source_module === "community"));
assert.ok(domainSignals.some((signal) => signal.source_module === "booking"));
assert.equal(
  domainSignals.some((signal) => signal.source_reference === "booking_conflict"),
  false,
  "partial booking signal excluded",
);

const partialOnly = collectCommandBriefSignalsFromDomainContexts({
  organization_id: ORG,
  contexts: {
    ...baseContexts(),
    communityContext: createEmptyCompanionCommunityContext({
      command_brief_signals: [{ signal_key: "pending_moderation", count: 2 }],
    }),
  },
  booking_candidates: [{ signal_key: "availability_gap", count: 1, source_exact: false }],
});
assert.equal(partialOnly.some((signal) => signal.signal_id.includes("availability_gap")), false);

const bundle = buildCommandBriefBundle({
  organization_id: ORG,
  effectivePermissions: [
    "executive.view",
    "sales.view",
    "hr.view",
    "warehouse.view",
    "billing.view",
    "security.view",
    "customer_community.view",
    "appointments.view",
  ],
  subscriptionStatus: "active",
  contexts: baseContexts(),
  last_login_at: sinceBoundary,
  booking_candidates: [{ signal_key: "upcoming_bookings", count: 2, source_exact: true }],
});

assert.equal(bundle.app_entitlement_blocked, false);
assert.ok(bundle.sections.length === 5);
assert.ok(bundle.prioritized_signals.length >= 5);
assert.ok(bundle.sections.every((section) => section.title_key.includes("commandBriefCore.sections")));
assert.ok(
  bundle.prioritized_signals.every((signal) => isCommandBriefSourceDisplayable(signal.source_tier)),
);

const deduped = dedupeCommandBriefSignals([
  ...bundle.all_signals,
  ...bundle.all_signals,
]);
assert.equal(deduped.length, bundle.all_signals.length);

const duplicateSales: CommandBriefSignal = {
  ...bundle.all_signals.find((signal) => signal.source_reference === "churn_risk")!,
  detected_at: beforeBoundary,
  freshness: "stale",
  source_tier: "compatible_live",
};
const fresherSales: CommandBriefSignal = {
  ...duplicateSales,
  detected_at: afterBoundary,
  freshness: "fresh",
  source_tier: "exact_live",
};
const dedupedTier = dedupeCommandBriefSignals([duplicateSales, fresherSales]);
assert.equal(dedupedTier.length, 1);
assert.equal(dedupedTier[0]?.source_tier, "exact_live");

const prioritized = prioritizeCommandBriefSignals(bundle.all_signals);
assert.ok(prioritized[0]!.priority >= prioritized[prioritized.length - 1]!.priority);

const permissionFiltered = filterCommandBriefSignalsForPermission(bundle.all_signals, ["executive.view"]);
assert.equal(permissionFiltered.length, 0);

const suspended = buildCommandBriefBundle({
  organization_id: ORG,
  effectivePermissions: ["executive.view", "sales.view"],
  subscriptionStatus: "paused",
  contexts: baseContexts(),
});
assert.equal(suspended.app_entitlement_blocked, true);
assert.equal(suspended.prioritized_signals.length, 0);

const sinceLastSection = bundle.sections.find((section) => section.section_key === "since_last");
assert.ok(sinceLastSection);

assert.ok(
  buildBookingCommandBriefSignals([
    { signal_key: "upcoming_bookings", count: 1, source_exact: true },
  ]).length === 1,
);

for (const locale of COMPANION_COVERAGE_LOCALES) {
  const dict = JSON.parse(
    fs.readFileSync(path.join(repoRoot, `locales/${locale}/customer-app/companionPlatformKnowledge.json`), "utf8"),
  );
  const core = dict.companionPlatformKnowledge.commandBriefCore;
  assert.ok(core?.sections?.requiresAttention?.title, `${locale} commandBriefCore sections`);
  assert.ok(core?.signals?.churn_risk?.title, `${locale} commandBriefCore signal`);
  if (locale !== "en") {
    assert.notEqual(
      core.sections.requiresAttention.title,
      "Requires attention",
      `${locale} English fallback in sections`,
    );
  }
}

const coverage = buildCompanionFoundationCoverageRegistry();
assert.ok(coverage.some((entry) => entry.module_id === "core.command_brief_signals"));

for (const file of [
  "lib/integration-intelligence/command-brief/pipeline.ts",
  "lib/integration-intelligence/command-brief/sections.ts",
  "lib/integration-intelligence/command-brief/since-last.ts",
]) {
  const source = fs.readFileSync(path.join(repoRoot, file), "utf8");
  assertCoreSourceFreeOfCustomerPilotNames(source, file);
}

assert.ok(
  bundle.prioritized_signals.every(
    (signal) => !signal.related_action || signal.source_tier !== "source_missing",
  ),
);

console.log("phase37.test.ts: all assertions passed");
