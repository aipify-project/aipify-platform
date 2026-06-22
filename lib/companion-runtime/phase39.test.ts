import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { COMPANION_COVERAGE_LOCALES } from "@/lib/companion-runtime/companion-foundation-coverage-i18n";
import { buildCompanionFoundationCoverageRegistry } from "@/lib/companion-runtime/companion-foundation-coverage-registry";
import { collectCommandBriefSignalsFromDomainContexts } from "@/lib/companion-runtime/command-brief-signal-collector";
import { createEmptyCompanionCommunityContext } from "@/lib/companion-runtime/companion-community-context";
import { createEmptyCompanionFinanceContext } from "@/lib/companion-runtime/companion-finance-context";
import { createEmptyCompanionHrContext } from "@/lib/companion-runtime/companion-hr-context";
import { createEmptyCompanionHostsContext } from "@/lib/companion-runtime/companion-hosts-context";
import { createEmptyCompanionOperationalContext } from "@/lib/companion-runtime/companion-operational-context";
import { createEmptyCompanionProactiveContext } from "@/lib/companion-runtime/companion-proactive-context";
import { createEmptyCompanionSalesContext } from "@/lib/companion-runtime/companion-sales-context";
import { createEmptyCompanionSecurityContext } from "@/lib/companion-runtime/companion-security-context";
import { createEmptyCompanionWarehouseContext } from "@/lib/companion-runtime/companion-warehouse-context";
import {
  buildHostsCommandBriefSignals,
  executeHostsPortfolioRead,
  executeHostsReservationRead,
  type HostsProviderReader,
} from "@/lib/companion-runtime/hosts-read-orchestrator";
import { executeHostsWrite } from "@/lib/companion-runtime/hosts-write-orchestrator";
import {
  listHostsAuditEvents,
  resetHostsAuditLogForTests,
} from "@/lib/companion-runtime/hosts-audit";
import { resolveHostsSemanticIntent } from "@/lib/companion-runtime/hosts-semantic-intent";
import { maskHostsGuestReference } from "@/lib/integration-intelligence/hosts/masking";
import {
  normalizePropertyStatus,
  normalizeReservationStatus,
} from "@/lib/integration-intelligence/hosts/status-normalization";
import {
  HOSTS_BLOCKED_CAPABILITY_KEYS,
  HOSTS_V2_SPECIFICATION_ONLY_ENGINES,
  isHostsCapabilityBlocked,
} from "@/lib/integration-intelligence/hosts/types";
import { mapHostsV1Bundle } from "@/lib/integration-intelligence/providers/aipify-hosts/hosts-v1-contract";
import { HOSTS_V1_SOURCE_MAP } from "@/lib/integration-intelligence/providers/aipify-hosts/hosts-source-map";
import { listHostsProviderManifests } from "@/lib/integration-intelligence/hosts/registry";
import { getCommandBriefCatalogEntry } from "@/lib/integration-intelligence/command-brief/signal-catalog";

const repoRoot = path.join(import.meta.dirname, "..", "..");
const ORG = "org-hosts-39";

assert.equal(normalizeReservationStatus("checked_in"), "checked_in");
assert.equal(normalizeReservationStatus("canceled"), "cancelled");
assert.equal(normalizePropertyStatus("maintenance"), "maintenance");
assert.match(maskHostsGuestReference("guest@example.com"), /\*\*\*@example\.com/);
assert.equal(isHostsCapabilityBlocked("guest_response.send"), true);
assert.equal(isHostsCapabilityBlocked("pricing.change"), true);
for (const blocked of HOSTS_BLOCKED_CAPABILITY_KEYS) {
  assert.equal(isHostsCapabilityBlocked(blocked), true);
}

const hostsPayload = {
  propertyData: {
    properties: [
      { id: "prop-1", display_name: "Fjord View", status: "active", location: "Bergen" },
    ],
  },
  bookingData: {
    reservations: [
      {
        reservation_key: "res-1",
        property_id: "prop-1",
        guest_name: "Anna Guest",
        check_in_date: "2026-06-22",
        check_out_date: "2026-06-25",
        booking_status: "confirmed",
        number_of_guests: 2,
        total_amount: 4200,
      },
      {
        reservation_key: "res-2",
        property_id: "prop-1",
        guest_name: "Pending Guest",
        check_in_date: "2026-06-23",
        booking_status: "pending",
      },
    ],
  },
  operationsData: {
    has_customer: true,
    today_snapshot: {
      arrivals_today: 2,
      departures_today: 1,
      open_guest_requests: 1,
      pending_approvals: 1,
    },
    boards: {
      arrivals: [
        {
          id: "arr-1",
          property_readiness: "attention_required",
        },
      ],
      departures: [{ id: "dep-1" }],
      cleaning: [
        { completion_status: "pending" },
        { completion_status: "overdue" },
      ],
      maintenance: [{ priority: "urgent" }, { priority: "low" }],
      guest_requests: [{ id: "gr-1" }],
    },
    notifications: [{ key: "occupancy_deviation", active: true, count: 1 }],
  },
  financeData: {
    has_customer: true,
    overview: {
      revenue_this_month: 12000,
      revenue_ytd: 84000,
      upcoming_payouts: 3500,
      outstanding_expenses: 900,
    },
    forecast: {
      expected_revenue: 15000,
      expected_expenses: 4000,
      estimated_net_position: 11000,
    },
    payouts: [{ payout_status: "delayed" }, { payout_status: "scheduled" }],
    notifications: [{ key: "forecast_warning", active: true }],
  },
};

const bundle = mapHostsV1Bundle(hostsPayload);
assert.equal(bundle.properties.length, 1);
assert.equal(bundle.reservations.length, 2);
assert.ok(bundle.operations);
assert.ok(bundle.finance);
assert.equal(bundle.finance?.revenue.is_forecast, false);
assert.equal(bundle.finance?.forecast.is_forecast, true);
assert.ok(bundle.source_exact);
assert.equal(bundle.reservations[0]?.guest_reference.includes("Anna"), false);

const briefSignals = buildHostsCommandBriefSignals({
  operations: bundle.operations,
  finance: bundle.finance,
  reservations: bundle.reservations,
  source_exact: true,
});
assert.ok(briefSignals.some((signal) => signal.signal_key === "arrival_today"));
assert.ok(briefSignals.some((signal) => signal.signal_key === "cleaning_overdue"));
assert.ok(briefSignals.some((signal) => signal.signal_key === "property_not_ready"));
assert.ok(briefSignals.some((signal) => signal.signal_key === "forecast_warning"));
assert.ok(briefSignals.some((signal) => signal.signal_key === "reservation_change"));
assert.equal(
  buildHostsCommandBriefSignals({
    operations: bundle.operations,
    finance: bundle.finance,
    reservations: bundle.reservations,
    source_exact: false,
  }).length,
  0,
);

const permission = {
  organization_id: ORG,
  tenant_id: ORG,
  user_role: "owner",
  app_suspended: false,
  provider_active: true,
  can_read_portfolio: true,
  can_read_guests: true,
  can_read_finance: true,
  can_draft_guest_response: true,
  can_create_tasks: true,
  rate_limit_ok: true,
};

const testProvider: HostsProviderReader = {
  provider_key: "short_term_property",
  active: true,
  read_portfolio: async () => ({
    propertyData: hostsPayload.propertyData,
    bookingData: hostsPayload.bookingData,
    operationsData: hostsPayload.operationsData,
    financeData: hostsPayload.financeData,
    limitations: [],
  }),
  read_reservation: async (reservationId) => ({
    reservation: bundle.reservations.find((row) => row.reservation_id === reservationId) ?? null,
    limitations: [],
  }),
};

async function runPhase39AsyncTests() {
  resetHostsAuditLogForTests();

  const portfolioRead = await executeHostsPortfolioRead({
    organization_id: ORG,
    tenant_id: ORG,
    user_role: "owner",
    permission,
    providers: [testProvider],
    include_finance: true,
  });
  assert.equal(portfolioRead.outcome, "exact_match");
  assert.ok(portfolioRead.properties.length > 0);
  assert.ok(portfolioRead.finance);
  assert.equal(portfolioRead.finance?.forecast.is_forecast, true);

  const reservationRead = await executeHostsReservationRead({
    organization_id: ORG,
    tenant_id: ORG,
    user_role: "owner",
    reservation_id: "res-1",
    permission,
    providers: [testProvider],
  });
  assert.equal(reservationRead.outcome, "partial_result");
  assert.equal(reservationRead.reservations[0]?.reservation_id, "res-1");

  const draftWrite = await executeHostsWrite({
    organization_id: ORG,
    tenant_id: ORG,
    user_role: "owner",
    permission,
    provider_key: "short_term_communications",
    provider_write: { write_source_available: false, requires_approval_before_execution: true },
    request: {
      capability_key: "guest_response.draft",
      entity_id: "res-1",
      draft_text: "Welcome — check-in details are in your inbox.",
      task_summary: null,
      assignee_reference: null,
      grounded_sources: ["business_dna_knowledge"],
      confirmed: false,
      idempotency_key: "draft-1",
    },
  });
  assert.equal(draftWrite.outcome, "draft_created");
  assert.ok(draftWrite.proposal);
  assert.equal(draftWrite.proposal?.requires_confirmation, true);

  const taskWrite = await executeHostsWrite({
    organization_id: ORG,
    tenant_id: ORG,
    user_role: "owner",
    permission,
    provider_key: "short_term_operations",
    provider_write: { write_source_available: false, requires_approval_before_execution: true },
    request: {
      capability_key: "cleaning_task.assign",
      entity_id: "clean-1",
      draft_text: null,
      task_summary: "Assign cleaner for turnover",
      assignee_reference: "cleaner-team",
      grounded_sources: [],
      confirmed: true,
      idempotency_key: "task-1",
    },
  });
  assert.equal(taskWrite.outcome, "execution_source_missing");
  assert.equal(taskWrite.entity_id, "clean-1");

  const denied = await executeHostsPortfolioRead({
    organization_id: "other-org",
    tenant_id: ORG,
    user_role: "owner",
    permission,
    providers: [testProvider],
  });
  assert.equal(denied.outcome, "permission_denied");

  const audit = listHostsAuditEvents(ORG);
  assert.ok(audit.length > 0);
  const auditPayload = JSON.stringify(audit);
  assert.doesNotMatch(auditPayload, /Anna Guest/);
  assert.doesNotMatch(auditPayload, /guest@example\.com/);
}

const semanticArrivals = resolveHostsSemanticIntent({
  query: "Hvem kommer i dag?",
  locale: "no",
});
assert.equal(semanticArrivals.metric, "arrivals_today");
assert.equal(semanticArrivals.capability_key, "arrival.read");

const semanticRevenue = resolveHostsSemanticIntent({
  query: "Hvor mye har vi tjent denne måneden?",
  locale: "no",
});
assert.equal(semanticRevenue.capability_key, "host_revenue.read");

const semanticDraft = resolveHostsSemanticIntent({
  query: "Lag et svarutkast til gjesten",
  locale: "no",
});
assert.equal(semanticDraft.operation, "draft");
assert.equal(semanticDraft.capability_key, "guest_response.draft");

const hostsContext = createEmptyCompanionHostsContext({
  operations_center_enabled: true,
  finance_center_enabled: true,
  operations_summary: bundle.operations,
  finance_summary: bundle.finance,
  property_summaries: bundle.properties,
  reservation_summaries: bundle.reservations,
  command_brief_signals: briefSignals,
  hosts_source_exact: true,
  command_brief_events_linked: true,
});

const domainSignals = collectCommandBriefSignalsFromDomainContexts({
  organization_id: ORG,
  contexts: {
    hrContext: createEmptyCompanionHrContext(),
    warehouseContext: createEmptyCompanionWarehouseContext(),
    financeContext: createEmptyCompanionFinanceContext(),
    salesContext: createEmptyCompanionSalesContext(),
    securityContext: createEmptyCompanionSecurityContext(),
    communityContext: createEmptyCompanionCommunityContext(),
    operationalContext: createEmptyCompanionOperationalContext(),
    proactiveContext: createEmptyCompanionProactiveContext(),
    hostsContext,
  },
  hostsContext,
});
assert.ok(domainSignals.some((signal) => signal.source_module === "hosts"));

for (const signalKey of [
  "arrival_today",
  "departure_today",
  "property_not_ready",
  "cleaning_due",
  "cleaning_overdue",
  "maintenance_open",
  "maintenance_urgent",
  "guest_attention_required",
  "reservation_change",
  "cancellation_attention",
  "payout_due",
  "payout_overdue",
  "expense_attention",
  "occupancy_deviation",
  "forecast_warning",
  "unresolved_host_task",
]) {
  assert.ok(getCommandBriefCatalogEntry(signalKey), signalKey);
}

const v2Manifests = listHostsProviderManifests().filter(
  (manifest) => manifest.implementation_status === "specification_only",
);
assert.ok(v2Manifests.some((manifest) => manifest.provider_key === "hosts_v2_smart_scheduling"));
for (const engine of HOSTS_V2_SPECIFICATION_ONLY_ENGINES) {
  assert.ok(v2Manifests.some((manifest) => manifest.source_engine === engine));
}

runPhase39AsyncTests()
  .then(() => {
    const coverage = buildCompanionFoundationCoverageRegistry();
    assert.ok(coverage.some((entry) => entry.module_id === "hosts.property_read"));
    assert.ok(coverage.some((entry) => entry.module_id === "hosts.command_brief_signals"));
    assert.ok(coverage.some((entry) => entry.module_id === "hosts.v2_specification_only"));
    assert.notEqual(
      coverage.find((entry) => entry.module_id === "hosts.property_read")?.readiness,
      "production_ready",
    );

    const coreSources = [
      "lib/companion-runtime/hosts-read-orchestrator.ts",
      "lib/companion-runtime/hosts-semantic-intent.ts",
      "lib/integration-intelligence/hosts/types.ts",
    ].map((file) => fs.readFileSync(path.join(repoRoot, file), "utf8"));
    for (const source of coreSources) {
      assert.doesNotMatch(source, /airbnb/i);
      assert.doesNotMatch(source, /booking\.com/i);
      assert.doesNotMatch(source, /guest_email/i);
      assert.doesNotMatch(source, /channel_provider/i);
    }

    assert.ok(HOSTS_V1_SOURCE_MAP.length >= 8);

    for (const locale of COMPANION_COVERAGE_LOCALES) {
      const dict = JSON.parse(
        fs.readFileSync(path.join(repoRoot, `locales/${locale}/customer-app/companionPlatformKnowledge.json`), "utf8"),
      );
      const hosts = dict.companionPlatformKnowledge.hosts;
      assert.ok(hosts.outcomes?.exactMatch, locale);
      assert.ok(hosts.reservationStatus?.confirmed, locale);
      assert.ok(hosts.commandBrief?.arrivalToday, locale);
      assert.ok(hosts.warnings?.writeExecutionSourceMissing, locale);
      assert.ok(hosts.finance?.forecastNotActual, locale);
    }

    console.log("phase39.test.ts passed");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
