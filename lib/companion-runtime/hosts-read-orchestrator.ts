import { hostsReadOutcomeKey } from "@/lib/integration-intelligence/hosts/outcomes";
import {
  assertHostsReadAllowed,
  assertHostsTenantScope,
  canReadHostsFinance,
  canReadHostsPortfolio,
  type HostsPermissionContext,
} from "@/lib/integration-intelligence/hosts/permissions";
import type {
  HostFinanceSummary,
  HostOperationsSummary,
  HostsPortfolioReadResult,
  HostsReadOutcome,
  PropertySummary,
  ReservationSummary,
} from "@/lib/integration-intelligence/hosts/types";
import { mapHostsV1Bundle } from "@/lib/integration-intelligence/providers/aipify-hosts/hosts-v1-contract";
import { createHostsAuditEvent } from "./hosts-audit";

export type HostsProviderReader = {
  provider_key: string;
  active: boolean;
  read_portfolio: () => Promise<{
    propertyData: unknown;
    bookingData: unknown;
    operationsData: unknown;
    financeData: unknown;
    limitations: readonly string[];
  }>;
  read_reservation: (reservationId: string) => Promise<{
    reservation: ReservationSummary | null;
    limitations: readonly string[];
  }>;
};

function emptyPortfolioResult(
  outcome: HostsReadOutcome,
  limitations: readonly string[] = [],
): HostsPortfolioReadResult {
  return {
    outcome,
    properties: [],
    reservations: [],
    operations: null,
    finance: null,
    outcome_key: hostsReadOutcomeKey(outcome),
    audit_id: null,
    limitations,
  };
}

export async function executeHostsPortfolioRead(input: {
  organization_id: string;
  tenant_id: string;
  user_role: string;
  permission: HostsPermissionContext;
  providers: readonly HostsProviderReader[];
  include_finance?: boolean;
}): Promise<HostsPortfolioReadResult> {
  if (
    !assertHostsTenantScope({
      queryOrganizationId: input.organization_id,
      sessionOrganizationId: input.permission.organization_id,
    })
  ) {
    return emptyPortfolioResult("permission_denied", ["Cross-tenant Hosts reads are forbidden."]);
  }

  const block = assertHostsReadAllowed(input.permission);
  if (block) return emptyPortfolioResult(block);

  if (!canReadHostsPortfolio(input.permission)) {
    return emptyPortfolioResult("permission_denied");
  }

  if (input.include_finance && !canReadHostsFinance(input.permission)) {
    return emptyPortfolioResult("permission_denied");
  }

  const activeProviders = input.providers.filter((provider) => provider.active);
  if (activeProviders.length === 0) {
    return emptyPortfolioResult("provider_missing");
  }

  const limitations: string[] = [];
  let bundle = {
    properties: [] as PropertySummary[],
    reservations: [] as ReservationSummary[],
    operations: null as HostOperationsSummary | null,
    finance: null as HostFinanceSummary | null,
    source_exact: false,
  };
  let providerKey = activeProviders[0]!.provider_key;

  for (const provider of activeProviders) {
    providerKey = provider.provider_key;
    const payload = await provider.read_portfolio();
    limitations.push(...payload.limitations);
    const mapped = mapHostsV1Bundle({
      propertyData: payload.propertyData,
      bookingData: payload.bookingData,
      operationsData: payload.operationsData,
      financeData: input.include_finance === false ? null : payload.financeData,
    });
    bundle = {
      properties: [...bundle.properties, ...mapped.properties],
      reservations: [...bundle.reservations, ...mapped.reservations],
      operations: mapped.operations ?? bundle.operations,
      finance: mapped.finance ?? bundle.finance,
      source_exact: bundle.source_exact || mapped.source_exact,
    };
  }

  let outcome: HostsReadOutcome = "source_missing";
  if (bundle.properties.length === 0 && bundle.reservations.length === 0 && !bundle.operations) {
    outcome = bundle.source_exact ? "empty_portfolio" : "source_missing";
  } else if (!bundle.source_exact) {
    outcome = "partial_result";
  } else {
    outcome = "exact_match";
  }

  const audit = createHostsAuditEvent({
    organization_id: input.organization_id,
    tenant_id: input.tenant_id,
    user_role: input.user_role,
    capability_key: "property.read",
    outcome,
    provider_key: providerKey,
    operations: bundle.operations,
    finance: bundle.finance,
  });

  return {
    outcome,
    properties: bundle.properties,
    reservations: bundle.reservations,
    operations: bundle.operations,
    finance: bundle.finance,
    outcome_key: hostsReadOutcomeKey(outcome),
    audit_id: audit.audit_id,
    limitations,
  };
}

export async function executeHostsReservationRead(input: {
  organization_id: string;
  tenant_id: string;
  user_role: string;
  reservation_id: string;
  permission: HostsPermissionContext;
  providers: readonly HostsProviderReader[];
}): Promise<HostsPortfolioReadResult> {
  const portfolio = await executeHostsPortfolioRead({
    organization_id: input.organization_id,
    tenant_id: input.tenant_id,
    user_role: input.user_role,
    permission: input.permission,
    providers: input.providers,
    include_finance: false,
  });

  const match = portfolio.reservations.find(
    (reservation) => reservation.reservation_id === input.reservation_id,
  );

  if (match) {
    return {
      ...portfolio,
      outcome: match.completeness === "partial" ? "partial_result" : "exact_match",
      reservations: [match],
      outcome_key: hostsReadOutcomeKey(match.completeness === "partial" ? "partial_result" : "exact_match"),
    };
  }

  for (const provider of input.providers.filter((entry) => entry.active)) {
    const payload = await provider.read_reservation(input.reservation_id);
    if (payload.reservation) {
      const audit = createHostsAuditEvent({
        organization_id: input.organization_id,
        tenant_id: input.tenant_id,
        user_role: input.user_role,
        capability_key: "reservation.read",
        outcome: "partial_result",
        entity_id: input.reservation_id,
        provider_key: provider.provider_key,
      });
      return {
        outcome: "partial_result",
        properties: portfolio.properties,
        reservations: [payload.reservation],
        operations: portfolio.operations,
        finance: null,
        outcome_key: hostsReadOutcomeKey("partial_result"),
        audit_id: audit.audit_id,
        limitations: payload.limitations,
      };
    }
  }

  return {
    ...portfolio,
    outcome: "no_match",
    reservations: [],
    outcome_key: hostsReadOutcomeKey("no_match"),
  };
}

export type HostsCommandBriefSignalCandidate = {
  signal_key: string;
  count: number | null;
  source_exact: boolean;
};

export function buildHostsCommandBriefSignals(input: {
  operations: HostOperationsSummary | null;
  finance: HostFinanceSummary | null;
  reservations: readonly ReservationSummary[];
  source_exact: boolean;
}): Array<{ signal_key: string; count: number | null }> {
  if (!input.source_exact || !input.operations) return [];

  const signals: Array<{ signal_key: string; count: number | null }> = [];

  if (input.operations.property_not_ready > 0) {
    signals.push({ signal_key: "property_not_ready", count: input.operations.property_not_ready });
  }
  if (input.operations.upcoming_arrivals > 0) {
    signals.push({ signal_key: "arrival_today", count: input.operations.upcoming_arrivals });
  }
  if (input.operations.upcoming_departures > 0) {
    signals.push({ signal_key: "departure_today", count: input.operations.upcoming_departures });
  }
  if (input.operations.cleaning_due > 0) {
    signals.push({ signal_key: "cleaning_due", count: input.operations.cleaning_due });
  }
  if (input.operations.cleaning_overdue > 0) {
    signals.push({ signal_key: "cleaning_overdue", count: input.operations.cleaning_overdue });
  }
  if (input.operations.maintenance_open > 0) {
    signals.push({ signal_key: "maintenance_open", count: input.operations.maintenance_open });
  }
  if (input.operations.maintenance_urgent > 0) {
    signals.push({ signal_key: "maintenance_urgent", count: input.operations.maintenance_urgent });
  }
  if (input.operations.guest_attention_required > 0) {
    signals.push({
      signal_key: "guest_attention_required",
      count: input.operations.guest_attention_required,
    });
  }
  if (input.operations.unresolved_tasks > 0) {
    signals.push({ signal_key: "unresolved_host_task", count: input.operations.unresolved_tasks });
  }

  if (input.operations.reservation_changes > 0) {
    signals.push({ signal_key: "reservation_change", count: input.operations.reservation_changes });
  }
  if (input.operations.occupancy_deviation > 0) {
    signals.push({ signal_key: "occupancy_deviation", count: input.operations.occupancy_deviation });
  }

  const cancellations = input.reservations.filter((row) => row.status === "cancelled").length;
  if (cancellations > 0) {
    signals.push({ signal_key: "cancellation_attention", count: cancellations });
  }

  if (input.finance) {
    if (input.finance.payouts.upcoming_amount && input.finance.payouts.upcoming_amount > 0) {
      signals.push({ signal_key: "payout_due", count: 1 });
    }
    if (input.finance.payouts.overdue_count > 0) {
      signals.push({ signal_key: "payout_overdue", count: input.finance.payouts.overdue_count });
    }
    if (input.finance.expenses.outstanding_amount && input.finance.expenses.outstanding_amount > 0) {
      signals.push({ signal_key: "expense_attention", count: 1 });
    }
    if (input.finance.forecast_warning_active) {
      signals.push({ signal_key: "forecast_warning", count: 1 });
    }
  }

  return signals;
}

export function buildHostsCommandBriefCandidates(input: {
  operations: HostOperationsSummary | null;
  finance: HostFinanceSummary | null;
  reservations: readonly ReservationSummary[];
  source_exact: boolean;
}): HostsCommandBriefSignalCandidate[] {
  return buildHostsCommandBriefSignals(input).map((signal) => ({
    ...signal,
    source_exact: input.source_exact,
  }));
}
