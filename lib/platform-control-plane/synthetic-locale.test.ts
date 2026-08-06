import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getPlatformControlPlaneLocales,
  platformTextDirection,
  resolvePlatformControlPlaneLocale,
} from "./locale";
import { LOCALES } from "@/lib/i18n/config";
import { PLATFORM_SEARCH_SURFACES } from "./search-classification";
import { PLATFORM_KPI_SOURCE_MATRIX } from "./kpi-source-matrix";
import { formatControlPlaneMoney, parsePlatformControlPlaneOverview } from "./overview";
import { parsePartnerSettlementOperations } from "./settlement-operations";

describe("platform-control-plane synthetic locale + closeout proofs", () => {
  it("accepts synthetic locale via registry without wizard/route code changes", () => {
    const registry = [...LOCALES, "fr-test"] as const;
    assert.ok(getPlatformControlPlaneLocales(registry).includes("fr-test"));
    assert.equal(platformTextDirection("fr-test"), "ltr");
    // Production resolver still falls back to English for unknown production locales.
    assert.equal(resolvePlatformControlPlaneLocale("fr-test"), "en");
  });

  it("formats outstanding invoice money with locale-aware currency", () => {
    const labels = { noData: "No data", error: "Error" };
    const formatted = formatControlPlaneMoney(1250.5, "NOK", "sv", labels);
    assert.ok(formatted.includes("1") && formatted.includes("NOK"));
    assert.equal(formatControlPlaneMoney(null, "NOK", "en", labels), "No data");
  });

  it("parses finance KPI e2e payload without faking null as zero", () => {
    const parsed = parsePlatformControlPlaneOverview({
      generated_at: "2026-08-01T10:00:00.000Z",
      source: "get_platform_control_plane_overview",
      finance: {
        outstanding_invoices: 4400,
        outstanding_invoice_currency: "NOK",
        monthly_recurring_revenue: 12000,
        mrr_currency: "NOK",
        failed_payments: null,
        source_note: "subscriptions_and_invoices_aligned_with_get_platform_metrics",
        drill_down: {
          outstanding_invoices: "/platform/billing/invoices",
        },
      },
      operations: { system_health: null, source_note: "no_fake_health" },
    });
    assert.equal(parsed.finance.outstandingInvoices, 4400);
    assert.equal(parsed.finance.outstandingInvoiceCurrency, "NOK");
    assert.equal(parsed.finance.failedPayments, null);
    assert.equal(parsed.operations.systemHealth, null);
    assert.equal(parsed.finance.drillDown.outstandingInvoices, "/platform/billing/invoices");
  });

  it("parses partner settlement ops read-only bundle", () => {
    const parsed = parsePartnerSettlementOperations({
      generated_at: "2026-08-01T10:00:00.000Z",
      availability: "partial",
      mutations_allowed: false,
      settlements: [
        {
          id: "s1",
          partner_name: "Partner A",
          settlement_period: "2026-07",
          commission_basis: 1000,
          settlement_status: "approved",
          matching_status: "missing_invoice",
          currency: "NOK",
          read_only: true,
        },
      ],
      discrepancies: [
        {
          id: "s1:missing_invoice",
          severity: "attention",
          partner_name: "Partner A",
          reason: "missing_invoice",
          expected: 1000,
          actual: null,
        },
      ],
    });
    assert.equal(parsed.mutationsAllowed, false);
    assert.equal(parsed.settlements.length, 1);
    assert.equal(parsed.discrepancies[0]?.reason, "missing_invoice");
  });

  it("classifies navigation search vs entity search gap", () => {
    const nav = PLATFORM_SEARCH_SURFACES.find((s) => s.kind === "navigation");
    const entity = PLATFORM_SEARCH_SURFACES.find((s) => s.kind === "entity");
    assert.equal(nav?.delivered, true);
    assert.equal(entity?.delivered, false);
  });

  it("documents authoritative outstanding invoice KPI source", () => {
    const row = PLATFORM_KPI_SOURCE_MATRIX.find((r) => r.kpi === "outstanding_invoices");
    assert.ok(row);
    assert.ok(row?.tableViewOrRpc.includes("outstanding_invoices"));
    assert.equal(row?.drillDown, "/platform/billing/invoices");
    assert.ok(row?.formula.includes("sent"));
  });
});
