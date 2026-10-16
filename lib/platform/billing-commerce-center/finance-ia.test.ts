import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  BILLING_COMMERCE_NAV,
  BILLING_COMMERCE_NAV_GROUPS,
  getBillingCommerceActiveNavId,
  getBillingCommercePrimaryNav,
  getBillingCommerceNavByPlacement,
} from "./config";
import { CORE_LOCALES } from "@/lib/i18n/config";

const ROOT = process.cwd();
const FINANCE_LOCALES = [...CORE_LOCALES, "es"] as const;

test("primary finance sub-nav excludes product, sellers, and customer identity pills", () => {
  const primary = getBillingCommercePrimaryNav().map((i) => i.id);
  assert.deepEqual(primary, [
    "invoices",
    "billingProfiles",
    "subscriptions",
    "paymentProviders",
    "vatEngine",
    "taxRules",
    "disputes",
    "reports",
    "accountingExport",
    "accountingIntegration",
  ]);
  assert.equal(getBillingCommerceNavByPlacement("relatedProduct").length, 4);
  assert.equal(getBillingCommerceNavByPlacement("relatedSellers").length, 2);
  assert.equal(getBillingCommerceNavByPlacement("relatedCustomers").length, 1);
  assert.ok(!primary.includes("businessPacks"));
  assert.ok(!primary.includes("commissions"));
  assert.ok(!primary.includes("customerIdentity"));
});

test("finance nav groups cover every primary item exactly once", () => {
  const grouped = BILLING_COMMERCE_NAV_GROUPS.flatMap((g) => g.itemIds);
  const primary = getBillingCommercePrimaryNav().map((i) => i.id);
  assert.deepEqual([...grouped].sort(), [...primary].sort());
  assert.equal(new Set(grouped).size, grouped.length);
});

test("billing routes and active ids are preserved", () => {
  assert.equal(getBillingCommerceActiveNavId("/platform/billing"), "overview");
  assert.equal(getBillingCommerceActiveNavId("/platform/billing/invoices"), "invoices");
  assert.equal(getBillingCommerceActiveNavId("/platform/billing/tax-rules"), "taxRules");
  assert.equal(getBillingCommerceActiveNavId("/platform/billing/commissions"), "commissions");
  assert.equal(
    getBillingCommerceActiveNavId("/platform/billing/growth-partner-attribution"),
    "growthPartnerAttribution",
  );
  for (const item of BILLING_COMMERCE_NAV) {
    assert.ok(item.href.startsWith("/platform/billing"), item.id);
  }
});

test("billing layout uses shared Platform page frame (not narrow max-w billing rail)", () => {
  const layout = readFileSync(join(ROOT, "app/platform/billing/layout.tsx"), "utf8");
  assert.match(layout, /PlatformPageFrame/);
  assert.doesNotMatch(layout, /max-w-7xl|max-w-6xl|max-w-5xl/);
});

test("shared Platform shell removes redundant portal banner stripe", () => {
  const layout = readFileSync(join(ROOT, "app/platform/layout.tsx"), "utf8");
  assert.doesNotMatch(layout, /PlatformPortalBanner/);
  assert.doesNotMatch(layout, /bannerTitle|bannerBody/);
});

test("billing overview uses Økonomioversikt title and drops decorative principle box", () => {
  const panel = readFileSync(
    join(ROOT, "components/platform/billing/BillingCommerceOverviewPanel.tsx"),
    "utf8",
  );
  assert.match(panel, /labels\.overview/);
  assert.match(panel, /labels\.subtitle/);
  assert.doesNotMatch(panel, /labels\.principle/);
  assert.doesNotMatch(panel, /center\.principle/);
  assert.doesNotMatch(panel, /\{labels\.title\}/);
});

test("primary finance nav hrefs stay unchanged", () => {
  const expected: Record<string, string> = {
    invoices: "/platform/billing/invoices",
    billingProfiles: "/platform/billing/profiles",
    subscriptions: "/platform/billing/subscriptions",
    paymentProviders: "/platform/billing/payment-providers",
    vatEngine: "/platform/billing/vat-engine",
    taxRules: "/platform/billing/tax-rules",
    disputes: "/platform/billing/disputes",
    reports: "/platform/billing/reports",
    accountingExport: "/platform/billing/accounting-export",
    accountingIntegration: "/platform/billing/accounting-integration",
  };
  for (const [id, href] of Object.entries(expected)) {
    const item = BILLING_COMMERCE_NAV.find((nav) => nav.id === id);
    assert.ok(item, id);
    assert.equal(item.href, href);
  }
  assert.deepEqual(
    BILLING_COMMERCE_NAV_GROUPS.map((g) => g.id),
    ["core", "tax", "reporting"],
  );
  assert.deepEqual(BILLING_COMMERCE_NAV_GROUPS[0].itemIds, [
    "invoices",
    "billingProfiles",
    "subscriptions",
    "paymentProviders",
  ]);
  assert.deepEqual(BILLING_COMMERCE_NAV_GROUPS[1].itemIds, ["vatEngine", "taxRules"]);
  assert.deepEqual(BILLING_COMMERCE_NAV_GROUPS[2].itemIds, [
    "disputes",
    "reports",
    "accountingExport",
    "accountingIntegration",
  ]);
});

test("sub-nav uses color families per finance group without changing destinations", () => {
  const subNav = readFileSync(
    join(ROOT, "components/platform/billing/BillingCommerceSubNav.tsx"),
    "utf8",
  );
  assert.match(subNav, /GROUP_CHIP_STYLES/);
  assert.match(subNav, /sky-/);
  assert.match(subNav, /orange-/);
  assert.match(subNav, /violet-/);
  assert.match(subNav, /fromProps\?\.href \?\? fromConfig\.href/);
});

test("locale parity for finance business labels", () => {
  for (const locale of FINANCE_LOCALES) {
    const data = JSON.parse(
      readFileSync(join(ROOT, `locales/${locale}/platform.json`), "utf8"),
    ) as {
      billingCommerceCenter?: {
        nav?: Record<string, string>;
        modules?: Record<string, string>;
        moduleDescriptions?: Record<string, string>;
        groups?: Record<string, string>;
        sections?: Record<string, string>;
        subNavAria?: string;
      };
      nav?: { payments?: string; licenses?: string; commissions?: string; invoices?: string };
    };
    const bcc = data.billingCommerceCenter;
    assert.ok(bcc, `missing billingCommerceCenter for ${locale}`);
    assert.ok(bcc.subNavAria, `missing subNavAria for ${locale}`);
    for (const key of ["core", "tax", "reporting"] as const) {
      assert.ok(bcc.groups?.[key], `missing groups.${key} for ${locale}`);
    }
    for (const key of [
      "finance",
      "customers",
      "product",
      "sellers",
      "customersHint",
      "productHint",
      "sellersHint",
    ] as const) {
      assert.ok(bcc.sections?.[key], `missing sections.${key} for ${locale}`);
    }
    for (const item of BILLING_COMMERCE_NAV) {
      assert.ok(bcc.nav?.[item.id], `missing nav.${item.id} for ${locale}`);
      assert.ok(bcc.modules?.[item.id], `missing modules.${item.id} for ${locale}`);
      assert.ok(
        bcc.moduleDescriptions?.[item.id],
        `missing moduleDescriptions.${item.id} for ${locale}`,
      );
    }
    assert.ok(data.nav?.payments, `missing nav.payments for ${locale}`);
    assert.ok(data.nav?.licenses, `missing nav.licenses for ${locale}`);
    assert.ok(data.nav?.commissions, `missing nav.commissions for ${locale}`);
  }

  const no = JSON.parse(
    readFileSync(join(ROOT, "locales/no/platform.json"), "utf8"),
  ) as {
    billingCommerceCenter: {
      nav: Record<string, string>;
      title: string;
    };
    nav: { payments: string; licenses: string; commissions: string; invoices: string };
  };
  assert.equal(no.nav.invoices, "Kundefakturaer");
  assert.equal(no.nav.payments, "Økonomioversikt");
  assert.equal(no.nav.licenses, "Lisensregister");
  assert.equal(no.nav.commissions, "Selgerprovisjoner");
  assert.equal(no.billingCommerceCenter.nav.invoices, "Kundefakturaer");
  assert.equal(no.billingCommerceCenter.nav.vatEngine, "Avgifter og MVA");
  assert.equal(no.billingCommerceCenter.nav.disputes, "Refusjoner og betalingstvister");
  assert.equal(no.billingCommerceCenter.nav.reports, "Økonomirapporter");
  assert.equal(no.billingCommerceCenter.nav.accountingExport, "Regnskapseksport");
  assert.equal(no.billingCommerceCenter.nav.licenses, "Lisensregister");
  assert.equal(no.billingCommerceCenter.nav.commissions, "Selgerprovisjoner");
});

console.log("billing-commerce-finance-ia: all tests passed");
