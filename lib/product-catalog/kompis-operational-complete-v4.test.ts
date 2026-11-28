/**
 * Kompis Web/Bedrift operational Master V4 — contract fixtures (local).
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { isKompisWebOperationalPath } from "@/lib/core/access-control-plane/tenant-module-lookup";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { APP_CONTENT_MAX_WIDTH_PX, AppLayoutClasses } from "@/lib/design/app-layout";

const root = process.cwd();
const read = (rel: string) => readFileSync(join(root, rel), "utf8");

assert.equal(APP_CONTENT_MAX_WIDTH_PX, 1560);
assert.match(AppLayoutClasses.pageWidth, /1560/);

assert.equal(FOUNDATION_NAV_BINDINGS.kompisWebUsage, "/app/website-kompis/usage");
assert.equal(isKompisWebOperationalPath("/app/website-kompis/usage"), true);
assert.equal(isKompisWebOperationalPath("/app/software"), false);

const usagePage = read("app/app/website-kompis/usage/page.tsx");
assert.match(usagePage, /loadWebsiteKompisLicenseQuotaRead/);
assert.match(usagePage, /WebsiteKompisPlansPanel/);
assert.match(usagePage, /AppLayoutClasses\.pageWidth/);
assert.doesNotMatch(usagePage, /checkout_session|enableBuy|createCheckout/i);
assert.doesNotMatch(usagePage, /prepareCheckoutIntent/);

const webHub = read("app/app/website-kompis/page.tsx");
assert.match(webHub, /loadWebsiteKompisLicenseQuotaRead/);
assert.match(webHub, /kompisWebUsage/);
assert.match(webHub, /loadWebsiteKompisConnectionSummary/);
assert.match(webHub, /getWebsiteKompisAnswerFeedbackOverview/);

const bedriftHub = read("app/app/kompis-bedrift/page.tsx");
assert.match(bedriftHub, /loadSubscriptionProductReads/);
assert.match(bedriftHub, /licenseActive/);
assert.match(bedriftHub, /supportTickets/);
assert.match(bedriftHub, /accountSubscription/);

const appearance = read("app/app/website-kompis/appearance/page.tsx");
assert.doesNotMatch(appearance, /DomainLicenseCenterPanel/);
assert.match(appearance, /appearanceHonestNote/);

const settings = read("app/app/website-kompis/settings/page.tsx");
assert.match(settings, /kompisWebUsage/);
assert.match(settings, /kompisWebConnection/);
assert.match(settings, /supportTickets/);

for (const locale of ["en", "no", "sv", "da", "pl", "uk", "es"] as const) {
  const portal = JSON.parse(read(`locales/${locale}/customer-app/portalStructure.json`)) as {
    portalStructure: {
      nav: Record<string, string>;
      webHub: Record<string, string>;
      productHubs: { web: Record<string, string>; bedrift: Record<string, string> };
    };
  };
  assert.ok(portal.portalStructure.nav.kompisWebUsage);
  assert.ok(portal.portalStructure.webHub.usageDescription);
  assert.ok(portal.portalStructure.productHubs.web.usageCard);
  assert.ok(portal.portalStructure.productHubs.bedrift.licenseActive);
  assert.ok(portal.portalStructure.productHubs.bedrift.licenseInactive);
  assert.ok(portal.portalStructure.productHubs.bedrift.licenseUnknown);
  if (locale === "no" || locale === "sv" || locale === "da") {
    assert.match(portal.portalStructure.productHubs.bedrift.licenseActive, /Kompis/);
    assert.doesNotMatch(portal.portalStructure.productHubs.bedrift.licenseActive, /Buddy/);
  }
}

const quotaLoader = read("lib/website-kompis-plans/load-license-quota-read.ts");
assert.match(quotaLoader, /unavailable/);
assert.match(quotaLoader, /get_website_kompis_answer_quota/);

console.log("kompis-operational-complete-v4.test.ts: ok");
