import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { PLATFORM_NAV_GROUPS, PLATFORM_COLLAPSIBLE_GROUPS } from "./nav-groups";
import { getPlatformActiveNavId, PLATFORM_ADMIN_NAV } from "./nav-config";
import { LOCALES } from "@/lib/i18n/config";

const ROOT = process.cwd();

test("sellers group collects growth partner routes; commercial has invoices", () => {
  const sellers = PLATFORM_NAV_GROUPS.find((g) => g.id === "sellers");
  const commercial = PLATFORM_NAV_GROUPS.find((g) => g.id === "commercial");
  assert.ok(sellers);
  assert.deepEqual(
    sellers!.items.map((i) => i.id),
    ["growthPartners", "growthPartnerAttribution", "commissions"],
  );
  assert.ok(commercial);
  assert.deepEqual(
    commercial!.items.map((i) => i.id),
    ["payments", "invoices", "subscriptions", "marketplace"],
  );
  assert.ok(PLATFORM_COLLAPSIBLE_GROUPS.includes("sellers"));
  assert.equal(
    commercial!.items.some((i) => i.id === "growthPartners"),
    false,
    "growth partners must not remain under commercial",
  );
});

test("invoices nav points at existing billing invoices route", () => {
  const invoices = PLATFORM_ADMIN_NAV.find((i) => i.id === "invoices");
  assert.ok(invoices);
  assert.equal(invoices!.href, "/platform/billing/invoices");
  assert.equal(invoices!.labelKey, "platform.nav.invoices");
});

test("active nav resolves payments, invoices, and sellers routes", () => {
  assert.equal(getPlatformActiveNavId("/platform/billing"), "payments");
  assert.equal(getPlatformActiveNavId("/platform/billing/invoices"), "invoices");
  assert.equal(getPlatformActiveNavId("/platform/billing/enterprise-invoices"), "invoices");
  assert.equal(getPlatformActiveNavId("/platform/invoices"), "invoices");
  assert.equal(
    getPlatformActiveNavId("/platform/billing/growth-partner-attribution"),
    "growthPartnerAttribution",
  );
  assert.equal(getPlatformActiveNavId("/platform/billing/commissions"), "commissions");
  assert.equal(getPlatformActiveNavId("/platform/pilot-operations"), "growthPartners");
  assert.equal(getPlatformActiveNavId("/platform/subscriptions"), "subscriptions");
});

test("locale parity for sellers group and commercial invoice labels", () => {
  for (const locale of LOCALES) {
    const data = JSON.parse(
      readFileSync(join(ROOT, `locales/${locale}/platform.json`), "utf8"),
    ) as {
      navGroups?: { sellers?: string; commercial?: string };
      nav?: {
        invoices?: string;
        growthPartners?: string;
        growthPartnerAttribution?: string;
        commissions?: string;
      };
    };
    assert.ok(data.navGroups?.sellers, `missing navGroups.sellers for ${locale}`);
    assert.ok(data.nav?.invoices, `missing nav.invoices for ${locale}`);
    assert.ok(data.nav?.growthPartnerAttribution, `missing attribution for ${locale}`);
    assert.ok(data.nav?.commissions, `missing commissions for ${locale}`);
  }

  const no = JSON.parse(
    readFileSync(join(ROOT, "locales/no/platform.json"), "utf8"),
  ) as { navGroups: { sellers: string }; nav: { invoices: string } };
  assert.equal(no.navGroups.sellers, "Selgere");
  assert.equal(no.nav.invoices, "Fakturaer");
});

console.log("platform-nav-sellers-commercial-structure: all tests passed");
