import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PLATFORM_CAPABILITY_MATRIX } from "./capability-matrix";
import { PLATFORM_EXCEPTION_DEFINITIONS } from "./exceptions";
import { PLATFORM_CONTROL_PLANE_IA, listPrimaryNavSurfaces } from "./information-architecture";
import {
  getPlatformControlPlaneLocales,
  platformTextDirection,
  resolvePlatformControlPlaneLocale,
} from "./locale";
import { roleHasCapability } from "./permissions";
import {
  formatControlPlaneMetric,
  parsePlatformControlPlaneOverview,
} from "./overview";
import { LOCALES } from "@/lib/i18n/config";

describe("platform-control-plane", () => {
  it("defines seven IA sections without stubs in primary surfaces", () => {
    assert.equal(PLATFORM_CONTROL_PLANE_IA.length, 7);
    const surfaces = listPrimaryNavSurfaces();
    assert.ok(surfaces.length >= 20);
    assert.ok(surfaces.every((s) => s.readiness !== "stub"));
    assert.ok(surfaces.some((s) => s.href === "/platform/partners"));
    assert.ok(surfaces.every((s) => !s.href.includes("unonight")));
  });

  it("capability matrix covers customers finance partners operations", () => {
    const areas = PLATFORM_CAPABILITY_MATRIX.map((row) => row.area.toLowerCase());
    assert.ok(areas.some((a) => a.includes("organization") || a.includes("overview")));
    assert.ok(areas.some((a) => a.includes("payment")));
    assert.ok(areas.some((a) => a.includes("partner")));
    assert.ok(areas.every((a) => !a.includes("unonight")));
  });

  it("exception queue links to existing authoritative routes only", () => {
    for (const item of PLATFORM_EXCEPTION_DEFINITIONS) {
      assert.ok(item.href.startsWith("/platform/") || item.href.startsWith("/partners/"));
      assert.ok(!item.href.includes("unonight"));
    }
  });

  it("uses canonical dynamic locale list", () => {
    assert.deepEqual([...getPlatformControlPlaneLocales()], [...LOCALES]);
    assert.equal(resolvePlatformControlPlaneLocale("sv"), "sv");
    assert.equal(resolvePlatformControlPlaneLocale("zz-new"), "en");
    assert.equal(platformTextDirection("en"), "ltr");
    assert.equal(platformTextDirection("ar"), "rtl");
  });

  it("never formats null metrics as zero", () => {
    const labels = { noData: "No data", error: "Update failed" };
    assert.equal(formatControlPlaneMetric(null, labels), "No data");
    assert.equal(formatControlPlaneMetric(3, labels), "3");
  });

  it("parses control plane overview with null-safe finance fields", () => {
    const parsed = parsePlatformControlPlaneOverview({
      generated_at: "2026-08-01T10:00:00.000Z",
      source: "get_platform_control_plane_overview",
      customers: {
        organizations_total: 12,
        active_subscriptions: 9,
        requiring_attention: 2,
        open_support: 4,
      },
      finance: {
        payment_active: 9,
        payment_past_due: 1,
        payment_trialing: 2,
        outstanding_invoices: 2500,
        outstanding_invoice_currency: "NOK",
        failed_payments: null,
        monthly_recurring_revenue: 9000,
        mrr_currency: "NOK",
        source_note: "subscriptions_and_invoices_aligned_with_get_platform_metrics",
      },
      partners: {
        active_partners: 3,
        earned_commission: null,
        pending_partner_invoices: 1,
        source_note: "partial",
      },
      operations: {
        system_health: null,
        open_incidents: null,
        pending_approvals: null,
        source_note: "no_fake_health",
      },
    });

    assert.equal(parsed.customers.organizationsTotal, 12);
    assert.equal(parsed.finance.outstandingInvoices, 2500);
    assert.equal(parsed.finance.monthlyRecurringRevenue, 9000);
    assert.equal(parsed.finance.failedPayments, null);
    assert.equal(parsed.operations.systemHealth, null);
    assert.equal(parsed.freshness.partial, true);
  });

  it("exception queue partner settlement points at Platform ops view", () => {
    const partner = PLATFORM_EXCEPTION_DEFINITIONS.find((e) => e.id === "partner_settlement");
    assert.equal(partner?.href, "/platform/partners/settlement");
  });

  it("enforces least-privilege capability defaults", () => {
    assert.equal(roleHasCapability("platform_support", "finance_write"), false);
    assert.equal(roleHasCapability("platform_support", "finance_read"), true);
    assert.equal(roleHasCapability("super_admin", "commission_approve"), true);
    assert.equal(roleHasCapability(null, "customer_read"), false);
  });
});
