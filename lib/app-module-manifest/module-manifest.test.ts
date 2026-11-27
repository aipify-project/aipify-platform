import assert from "node:assert/strict";
import { resolveAppMenuCapabilityBundle } from "@/lib/core/app-menu-capability/resolve";
import type { Translator } from "@/lib/i18n/translate";
import { presentAppNavFromCapabilities } from "@/lib/app-portal/canonical-nav/present-from-capabilities";
import {
  APP_SOFTWARE_MODULE_MANIFESTS,
  resolveSoftwareModuleAccess,
} from "@/lib/app-module-manifest";
import { buildWorkspaceTicketSummary } from "@/lib/app-workspace-dashboard/ticket-summary";
import { buildWorkspacePartnerSummary } from "@/lib/app-workspace-dashboard/partner-summary";

const t: Translator = ((key: string) => key) as Translator;

function bundle(activeModuleKeys: Set<string>, salesPartnerAuthorized = false) {
  return resolveAppMenuCapabilityBundle({
    organizationId: "org",
    userId: "user",
    role: "organization_owner",
    featureEnabled: new Map([
      ["billing", true],
      ["integrations", true],
    ]),
    permissionGranted: new Map(),
    activePackKeys: new Set(),
    pendingPackKeys: new Set(),
    revokedPackKeys: new Set(),
    activeModuleKeys,
    salesPartnerAuthorized,
  });
}

{
  assert.ok(APP_SOFTWARE_MODULE_MANIFESTS.some((m) => m.moduleKey === "website_kompis"));
  assert.ok(APP_SOFTWARE_MODULE_MANIFESTS.some((m) => m.moduleKey === "kompis_bedrift"));
  assert.ok(APP_SOFTWARE_MODULE_MANIFESTS.some((m) => m.moduleKey === "sales_partner"));
}

{
  const webOnly = bundle(new Set(["website_kompis"]));
  const access = resolveSoftwareModuleAccess({ bundle: webOnly, salesPartnerAuthorized: false });
  assert.equal(access.find((a) => a.moduleKey === "website_kompis")?.entitled, true);
  assert.equal(access.find((a) => a.moduleKey === "kompis_bedrift")?.entitled, false);
  assert.equal(access.find((a) => a.moduleKey === "sales_partner")?.entitled, false);

  const presented = presentAppNavFromCapabilities(webOnly, t);
  assert.ok(presented.navGroups.some((g) => g.id === "shared"));
  assert.ok(presented.navGroups.some((g) => g.id === "kompisWeb"));
  assert.ok(!presented.navGroups.some((g) => g.id === "kompisBedrift"));
  assert.ok(!presented.navGroups.some((g) => g.id === "salesPartner"));
  assert.ok(presented.navConfig.some((i) => i.id === "workspaceDashboard"));
  assert.ok(presented.navConfig.some((i) => i.id === "supportTickets"));
  assert.ok(!presented.navConfig.some((i) => i.id.startsWith("kompisBedrift")));
}

{
  const both = bundle(new Set(["website_kompis", "kompis_bedrift"]), true);
  const presented = presentAppNavFromCapabilities(both, t);
  assert.ok(presented.navGroups.some((g) => g.id === "kompisWeb"));
  assert.ok(presented.navGroups.some((g) => g.id === "kompisBedrift"));
  assert.ok(presented.navGroups.some((g) => g.id === "salesPartner"));
  assert.ok(presented.navGroups.some((g) => g.id === "administration"));
}

{
  const flat = presentAppNavFromCapabilities(bundle(new Set(["website_kompis", "kompis_bedrift"])), t, {
    mode: "flat_product",
    activeProduct: "kompisWeb",
  });
  assert.equal(flat.navGroups.length, 1);
  assert.ok(!flat.navConfig.some((i) => i.id.startsWith("kompisBedrift")));
}

{
  const unavailable = buildWorkspaceTicketSummary({ listPayload: null });
  assert.equal(unavailable.availability, "unavailable");
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
  assert.equal(available.counts.waitingCustomer, 1);
  assert.equal(available.recent.length, 1);
}

{
  const denied = buildWorkspacePartnerSummary({ authorized: false });
  assert.equal(denied.availability, "not_authorized");
  assert.equal(denied.kpis.registeredSales, null);

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
  assert.equal(authorized.kpis.registeredSales, 3);
  assert.equal(authorized.kpis.pendingCommission, 100);
  assert.equal(authorized.partnerHref, "/partners");
}

console.log("module-manifest + workspace dashboard adapters: ok");
