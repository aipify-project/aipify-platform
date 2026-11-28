/**
 * H. Platform Admin commercial overview readiness — code only, read-only.
 * Never invents numbers: every metric is `{ available: false }` unless the caller supplies a real value.
 * Performs no writes, no publish flips, no financial mutations. Preserves #525/#530 (Product Center +
 * commission editor are untouched; this module only reads their shapes).
 */

import type { ProductVariantDefinition } from "@/lib/product-catalog/variants";
import type { SalesPartnerLicenseLevelConfig } from "@/lib/sales-partner-commercial-license";
import { percentCommissionIsActivatable, resolveCommissionRuleSnapshot, COMMISSION_SETTLEMENT_POLICY } from "./commission";
import { COMMERCIAL_BILLING_SALES_MASTER, COMMERCIAL_BILLING_SQL_CANDIDATES, COMMERCIAL_OPEN_OWNER_APPROVALS } from "./contract";
import { majorToMinorExact, normalizeCurrency } from "./money";
import type { PriceMappingPlan } from "./stripe-mapping";

export type Metric<T> = { available: true; value: T } | { available: false; reason: "not_provided" };

export function metric<T>(value: T | null | undefined): Metric<T> {
  return value == null ? { available: false, reason: "not_provided" } : { available: true, value };
}

export type ParityIssue =
  | "price_missing"
  | "commission_not_configured"
  | "commission_percent_blocked"
  | "commission_inactive"
  | "commission_currency_mismatch"
  | "commission_amount_invalid"
  | "commission_exceeds_price";

/** Price ↔ commission parity per (variant, interval). Pure, read-only. */
export function checkVariantPriceCommissionParity(variant: ProductVariantDefinition): Array<{
  interval: "month" | "year" | "one_time";
  issues: ParityIssue[];
}> {
  const rows: Array<{ interval: "month" | "year" | "one_time"; issues: ParityIssue[] }> = [];
  const pairs: Array<["month" | "year" | "one_time", ProductVariantDefinition["monthlyPrice"]]> = [
    ["month", variant.monthlyPrice],
    ["year", variant.yearlyPrice],
    ["one_time", variant.oneTimePrice],
  ];
  for (const [interval, price] of pairs) {
    if (!price) continue; // interval not offered
    const issues: ParityIssue[] = [];
    const currency = normalizeCurrency(price.currency);
    const priceMinor = currency ? majorToMinorExact(price.amountMajor, currency) : null;
    if (!priceMinor || !priceMinor.ok) issues.push("price_missing");
    const snap = resolveCommissionRuleSnapshot(price.commission ?? null, price.currency);
    if (!snap.configured) {
      const map: Record<string, ParityIssue> = {
        not_configured: "commission_not_configured",
        percent_core_blocked: "commission_percent_blocked",
        needs_core_contract: "commission_percent_blocked",
        rule_inactive: "commission_inactive",
        currency_mismatch: "commission_currency_mismatch",
        currency_invalid: "commission_currency_mismatch",
        amount_missing: "commission_not_configured",
        amount_invalid: "commission_amount_invalid",
      };
      issues.push(map[snap.reason] ?? "commission_not_configured");
    } else if (priceMinor && priceMinor.ok && snap.amountMinor > priceMinor.value) {
      issues.push("commission_exceeds_price");
    }
    rows.push({ interval, issues });
  }
  return rows;
}

export type CommercialOverviewInput = {
  /** Real values only. Omit / null => reported as unavailable. */
  licenseLevels?: readonly SalesPartnerLicenseLevelConfig[] | null;
  mappingPlan?: PriceMappingPlan | null;
  variants?: readonly ProductVariantDefinition[] | null;
  licenseSnapshotRpcReachable?: boolean | null;
  stagingFoundationApplied?: boolean | null;
  productionFoundationApplied?: boolean | null;
  counts?: {
    activeTenantLicenses?: number | null;
    capturedPayments?: number | null;
    registeredCommissionSales?: number | null;
    earnedCommissionSales?: number | null;
  } | null;
};

export type CommercialOverview = {
  licenseLevels: Metric<Array<{ key: string; label: string; maxActiveSellers: number | null; seatCapConfigured: boolean }>>;
  productMapping: Metric<{ paid: number; freeAccess: number; blocked: number; providerWritesPerformed: false }>;
  priceCommissionParity: Metric<{ variantsChecked: number; issueCount: number; issues: Array<{ variantKey: string; interval: string; issue: ParityIssue }> }>;
  paymentStatus: { capturedPayments: Metric<number> };
  commissionStatus: { registeredSales: Metric<number>; earnedSales: Metric<number> };
  capacity: { activeTenantLicenses: Metric<number> };
  readiness: {
    stripeLiveEnabled: false;
    checkoutLiveEnabled: false;
    realPaymentsEnabled: false;
    payoutActivationEnabled: false;
    percentCommissionActivatable: false;
    settlementManualOnly: true;
    foundationSqlStagingApplied: Metric<boolean>;
    foundationSqlProductionApplied: Metric<boolean>;
    snapshotReadSqlStatus: "PREPARED_ONLY";
    licenseSnapshotRpcReachable: Metric<boolean>;
    productCenterAndCommissionEditorPreserved: true;
  };
  openOwnerApprovals: readonly string[];
  /** Hard marker: this overview exposes no write path. */
  mutationsAvailable: false;
};

export function buildCommercialOverview(input: CommercialOverviewInput = {}): CommercialOverview {
  const levels = input.licenseLevels
    ? metric(
        input.licenseLevels.map((l) => ({
          key: l.licenseLevelKey,
          label: l.label,
          maxActiveSellers: l.maxActiveSellers,
          seatCapConfigured: l.maxActiveSellers != null,
        })),
      )
    : metric<never>(null);

  const mapping = input.mappingPlan
    ? metric({
        paid: input.mappingPlan.paidCount,
        freeAccess: input.mappingPlan.freeAccessCount,
        blocked: input.mappingPlan.blockedCount,
        providerWritesPerformed: false as const,
      })
    : metric<never>(null);

  let parity: CommercialOverview["priceCommissionParity"] = metric<never>(null);
  if (input.variants) {
    const issues: Array<{ variantKey: string; interval: string; issue: ParityIssue }> = [];
    for (const v of input.variants) {
      for (const row of checkVariantPriceCommissionParity(v)) {
        for (const issue of row.issues) issues.push({ variantKey: v.variantKey, interval: row.interval, issue });
      }
    }
    parity = metric({ variantsChecked: input.variants.length, issueCount: issues.length, issues });
  }

  return {
    licenseLevels: levels,
    productMapping: mapping,
    priceCommissionParity: parity,
    paymentStatus: { capturedPayments: metric(input.counts?.capturedPayments) },
    commissionStatus: {
      registeredSales: metric(input.counts?.registeredCommissionSales),
      earnedSales: metric(input.counts?.earnedCommissionSales),
    },
    capacity: { activeTenantLicenses: metric(input.counts?.activeTenantLicenses) },
    readiness: {
      stripeLiveEnabled: COMMERCIAL_BILLING_SALES_MASTER.switches.stripeLiveEnabled,
      checkoutLiveEnabled: COMMERCIAL_BILLING_SALES_MASTER.switches.liveCheckoutSessionCreationEnabled,
      realPaymentsEnabled: COMMERCIAL_BILLING_SALES_MASTER.switches.realPaymentsEnabled,
      payoutActivationEnabled: COMMISSION_SETTLEMENT_POLICY.payoutActivation,
      percentCommissionActivatable: percentCommissionIsActivatable() as false,
      settlementManualOnly: COMMISSION_SETTLEMENT_POLICY.manualOnly,
      foundationSqlStagingApplied: metric(input.stagingFoundationApplied),
      foundationSqlProductionApplied: metric(input.productionFoundationApplied),
      snapshotReadSqlStatus: COMMERCIAL_BILLING_SQL_CANDIDATES.snapshotRead.applyStatus,
      licenseSnapshotRpcReachable: metric(input.licenseSnapshotRpcReachable),
      productCenterAndCommissionEditorPreserved: true,
    },
    openOwnerApprovals: COMMERCIAL_OPEN_OWNER_APPROVALS,
    mutationsAvailable: false,
  };
}
