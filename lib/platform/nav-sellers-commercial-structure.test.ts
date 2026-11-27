import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  PLATFORM_NAV_GROUPS,
  PLATFORM_COLLAPSIBLE_GROUPS,
  getPlatformDefaultExpandedGroupIds,
} from "./nav-groups";
import { getPlatformActiveNavId, PLATFORM_ADMIN_NAV } from "./nav-config";
import { SELLERS_ADMIN_NAV } from "./sellers-admin-nav";
import { LOCALES } from "@/lib/i18n/config";

const ROOT = process.cwd();

test("sidebar group order matches navigation simplification V1", () => {
  assert.deepEqual(
    PLATFORM_NAV_GROUPS.map((g) => g.id),
    ["dashboard", "support", "customers", "modules", "sellers", "billing", "operations", "settings"],
  );
});

test("sellers collapses to one sidebar entry; hub keeps all existing routes", () => {
  const sellers = PLATFORM_NAV_GROUPS.find((g) => g.id === "sellers");
  const commercial = PLATFORM_NAV_GROUPS.find((g) => g.id === "billing");
  const modules = PLATFORM_NAV_GROUPS.find((g) => g.id === "modules");
  assert.deepEqual(sellers!.items.map((i) => i.id), ["sellersOverview"]);
  assert.equal(SELLERS_ADMIN_NAV.length, 13);
  assert.equal(PLATFORM_ADMIN_NAV.find((i) => i.id === "commissions")?.href, "/platform/sellers/commissions");
  assert.deepEqual(commercial!.items.map((i) => i.id), ["payments", "invoices", "subscriptions"]);
  assert.equal(commercial!.labelKey, "platform.navGroups.billing");
  assert.ok(modules!.items.some((i) => i.id === "licenses"));
  assert.ok(modules!.items.some((i) => i.id === "marketplace"));
  assert.ok(PLATFORM_COLLAPSIBLE_GROUPS.includes("sellers"));
});

test("platform collapsible groups default expanded except settings", () => {
  const defaults = getPlatformDefaultExpandedGroupIds();
  for (const id of PLATFORM_COLLAPSIBLE_GROUPS) {
    if (id === "settings") {
      assert.equal(defaults.includes(id), false);
      continue;
    }
    assert.ok(defaults.includes(id), id);
  }
});

test("invoices nav points at existing billing invoices route", () => {
  const invoices = PLATFORM_ADMIN_NAV.find((i) => i.id === "invoices");
  assert.equal(invoices!.href, "/platform/billing/invoices");
});

test("active nav resolves payments, invoices, and sellers hub", () => {
  assert.equal(getPlatformActiveNavId("/platform/billing"), "payments");
  assert.equal(getPlatformActiveNavId("/platform/billing/invoices"), "invoices");
  assert.equal(getPlatformActiveNavId("/platform/sellers/commissions"), "sellersOverview");
  assert.equal(getPlatformActiveNavId("/platform/sellers"), "sellersOverview");
  assert.equal(getPlatformActiveNavId("/platform/sellers/partners"), "sellersOverview");
  assert.equal(getPlatformActiveNavId("/platform/sellers/settlements"), "sellersOverview");
  assert.equal(getPlatformActiveNavId("/platform/subscriptions"), "subscriptions");
});

test("locale parity for sellers group and billing labels", () => {
  for (const locale of LOCALES) {
    const data = JSON.parse(readFileSync(join(ROOT, `locales/${locale}/platform.json`), "utf8")) as {
      navGroups?: { sellers?: string; billing?: string };
      nav?: { invoices?: string; payments?: string; commissions?: string; sellersOverview?: string };
    };
    assert.ok(data.navGroups?.sellers, locale);
    assert.ok(data.navGroups?.billing, locale);
    assert.ok(data.nav?.invoices, locale);
    assert.ok(data.nav?.payments, locale);
    assert.ok(data.nav?.commissions, locale);
    assert.ok(data.nav?.sellersOverview, locale);
  }
  const no = JSON.parse(readFileSync(join(ROOT, "locales/no/platform.json"), "utf8")) as {
    navGroups: { sellers: string; billing: string };
    nav: { invoices: string; payments: string };
  };
  assert.equal(no.navGroups.sellers, "Selgere");
  assert.equal(no.navGroups.billing, "Betaling");
  assert.equal(no.nav.invoices, "Kundefakturaer");
  assert.equal(no.nav.payments, "Økonomioversikt");
});

console.log("platform-nav-sellers-commercial-structure: all tests passed");
