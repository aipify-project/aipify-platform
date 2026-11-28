import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { bedriftHomeCardState, webHomeCardState } from "@/lib/app/foundation-product-card";
import {
  buildWorkspacePartnerSummary,
  buildWorkspaceTicketSummary,
  detectTicketListCountsPartial,
  shouldShowPartnerSection,
  ticketCountsArePartial,
  workspaceModulesAreEmpty,
} from "@/lib/app-workspace-dashboard";

assert.equal(bedriftHomeCardState(true), "open");
assert.equal(bedriftHomeCardState(false), "unavailable");
assert.equal(bedriftHomeCardState(null), "unknown");
assert.equal(webHomeCardState(null), "unknown");

{
  const unavailable = buildWorkspaceTicketSummary({ listPayload: null });
  assert.equal(unavailable.availability, "unavailable");
  assert.equal(unavailable.countsPartial, false);
  assert.equal(unavailable.counts.open, null);

  const available = buildWorkspaceTicketSummary({
    listPayload: {
      found: true,
      items: [
        {
          id: "11111111-1111-1111-1111-111111111111",
          title: "Need help",
          description: "x",
          category: "general",
          priority: "medium",
          status: "waiting_for_customer",
          created_by: "a",
          assigned_support_owner: "b",
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-02T00:00:00Z",
        },
      ],
    },
  });
  assert.equal(available.availability, "available");
  assert.equal(available.countsPartial, true);
  assert.equal(available.counts.waitingCustomer, 1);
  assert.equal(ticketCountsArePartial(available), true);
  assert.equal(detectTicketListCountsPartial({ found: true, truncated: true, items: [] }, 0), true);
  assert.equal(
    detectTicketListCountsPartial({ found: true, total_count: 50, items: [] }, 10),
    true
  );
}

{
  assert.equal(shouldShowPartnerSection("authorized"), true);
  assert.equal(shouldShowPartnerSection("not_authorized"), false);
  assert.equal(shouldShowPartnerSection("unavailable"), false);
  assert.equal(shouldShowPartnerSection("error"), false);

  const denied = buildWorkspacePartnerSummary({ authorized: false });
  assert.equal(denied.availability, "not_authorized");
  assert.equal(shouldShowPartnerSection(denied.availability), false);
  assert.equal(denied.kpis.registeredSales, null);

  const authError = buildWorkspacePartnerSummary({
    authorized: true,
    overviewPayload: { partner: { id: "p1", status: "active", display_name: "Partner" }, products: [] },
    economyError: "economy_unavailable",
  });
  assert.equal(authError.availability, "unavailable");
  assert.equal(shouldShowPartnerSection(authError.availability), false);

  const authorized = buildWorkspacePartnerSummary({
    authorized: true,
    overviewPayload: { partner: { id: "p1", status: "active", display_name: "Partner" }, products: [] },
    economyPayload: {
      stats: {
        registered_sales: 3,
        pending_commissions: 100,
        earned_commissions: 50,
        upcoming_payouts: 25,
        currency: "NOK",
      },
    },
  });
  assert.equal(authorized.availability, "authorized");
  assert.equal(shouldShowPartnerSection(authorized.availability), true);
}

assert.equal(workspaceModulesAreEmpty([]), true);
assert.equal(
  workspaceModulesAreEmpty([
    {
      moduleKey: "website_kompis",
      state: "active",
      openHref: "/app/kompis-web",
      labelKey: "x",
    },
  ]),
  false
);

const root = process.cwd();
const panel = readFileSync(
  join(root, "components/app/workspace-dashboard/WorkspaceDashboardPanel.tsx"),
  "utf8"
);
assert.match(panel, /shouldShowPartnerSection/);
assert.match(panel, /workspaceModulesAreEmpty/);
assert.match(panel, /CUSTOMER_CATALOG_ROUTE/);
assert.match(panel, /ticketsCountsPartial/);
assert.match(panel, /AppEmptyState/);
assert.match(panel, /variant="compact"/);
assert.doesNotMatch(panel, /bundle\.partner\.availability !== "not_authorized"/);

const home = readFileSync(
  join(root, "components/app/foundation/AppFoundationDashboard.tsx"),
  "utf8"
);
assert.match(home, /bedriftCard === "unknown"/);
assert.match(home, /bedriftDataUnavailable/);
assert.match(home, /attentionEmptyTitle/);
assert.match(home, /AppEmptyState/);
assert.match(home, /variant="compact"/);
assert.match(home, /foundation-products-heading[\s\S]*md:grid-cols-3/);

const homePage = readFileSync(join(root, "app/app/page.tsx"), "utf8");
assert.match(homePage, /AppErrorState/);
assert.match(homePage, /criticalFailure/);

const dashPage = readFileSync(join(root, "app/app/dashboard/page.tsx"), "utf8");
assert.match(dashPage, /AppErrorState/);
assert.match(dashPage, /countsPartial: false/);
assert.match(dashPage, /presentWorkspaceLicenseStatusLabel/);
assert.doesNotMatch(dashPage, /licenseStatusLabel = context\.license_status/);

const homeLoading = readFileSync(join(root, "app/app/loading.tsx"), "utf8");
const dashLoading = readFileSync(join(root, "app/app/dashboard/loading.tsx"), "utf8");
assert.match(homeLoading, /AipifyLoader/);
assert.match(homeLoading, /sr-only/);
assert.match(dashLoading, /AipifyLoader/);
assert.doesNotMatch(homeLoading, /<(p|span|label)[^>]*>\s*Loading/);

for (const locale of ["en", "no", "sv", "da", "pl", "uk", "es"]) {
  const portal = JSON.parse(
    readFileSync(join(root, `locales/${locale}/customer-app/portalStructure.json`), "utf8")
  );
  const fd = portal.portalStructure.foundationDashboard;
  const wd = portal.portalStructure.workspaceDashboard;
  assert.equal(typeof fd.bedriftDataUnavailable, "string");
  assert.equal(typeof fd.attentionEmptyTitle, "string");
  assert.equal(typeof fd.loadErrorTitle, "string");
  assert.equal(typeof wd.modulesEmptyTitle, "string");
  assert.equal(typeof wd.ticketsCountsPartial, "string");
  assert.equal(typeof wd.attentionEmptyCta, "string");
  assert.equal(typeof wd.loadErrorDescription, "string");
}

const enFd = JSON.parse(
  readFileSync(join(root, "locales/en/customer-app/portalStructure.json"), "utf8")
).portalStructure.foundationDashboard;
const enWd = JSON.parse(
  readFileSync(join(root, "locales/en/customer-app/portalStructure.json"), "utf8")
).portalStructure.workspaceDashboard;
assert.notEqual(enFd.description, enWd.description);
assert.match(enFd.webDescription, /visitors|answers|guidance/i);
assert.doesNotMatch(enFd.webDescription, /Public website companion, FAQ/);

const noLicense = JSON.parse(readFileSync(join(root, "locales/no/license.json"), "utf8"));
assert.equal(noLicense.center.subscription.licenseActive, "Aktiv");

console.log("workspace-dashboard-completion.test.ts: OK");
