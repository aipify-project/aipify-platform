import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { getSoftwareModuleManifest } from "@/lib/app-module-manifest";
import { APP_CONTENT_MAX_WIDTH_PX, AppLayoutClasses } from "@/lib/design/app-layout";
import { SALES_PARTNER_APP_ROUTE_MATRIX } from "@/lib/sales-partner-app-migration/phase-a-contract";
import {
  SALES_PARTNER_APP_MIGRATION_PHASE_B,
  SALES_PARTNER_PHASE_B_NAV_BINDINGS,
  SALES_PARTNER_THIN_HOSTS,
  thinHostsCoverMatrix,
} from "@/lib/sales-partner-app-migration/phase-b-hosts";
import { SALES_PARTNER_LICENSE_ARCHITECTURE } from "@/lib/sales-partner-app-migration/phase-b-license-contract";

const REPO_ROOT = join(import.meta.dirname, "../..");

test("Phase B marker and thin hosts cover matrix", () => {
  assert.equal(SALES_PARTNER_APP_MIGRATION_PHASE_B, "B");
  assert.equal(thinHostsCoverMatrix(), true);
  const matrixThin = SALES_PARTNER_APP_ROUTE_MATRIX.filter((r) => r.hostStrategy === "thin_app_host").length;
  // Shared Surfaces Complete adds help sub-hosts beyond the Phase A matrix rows.
  assert.ok(SALES_PARTNER_THIN_HOSTS.length >= matrixThin);
});

test("each thin host page and partners source module exist on disk", () => {
  assert.equal(existsSync(join(REPO_ROOT, "app/app/sales-partner/layout.tsx")), true);
  for (const host of SALES_PARTNER_THIN_HOSTS) {
    const rel =
      host.appPath === "/app/sales-partner"
        ? "app/app/sales-partner/page.tsx"
        : `app/app/sales-partner/${host.appPath.slice("/app/sales-partner/".length)}/page.tsx`;
    assert.equal(existsSync(join(REPO_ROOT, rel)), true, rel);
    assert.equal(existsSync(join(REPO_ROOT, host.partnersPageModule)), true, host.partnersPageModule);
  }
});

test("Phase B nav bindings match foundation bindings and APP hosts", () => {
  assert.equal(FOUNDATION_NAV_BINDINGS.salesPartnerOverview, SALES_PARTNER_PHASE_B_NAV_BINDINGS.salesPartnerOverview);
  assert.equal(FOUNDATION_NAV_BINDINGS.salesPartnerProducts, SALES_PARTNER_PHASE_B_NAV_BINDINGS.salesPartnerProducts);
  assert.equal(FOUNDATION_NAV_BINDINGS.salesPartnerCustomers, SALES_PARTNER_PHASE_B_NAV_BINDINGS.salesPartnerCustomers);
  assert.equal(
    FOUNDATION_NAV_BINDINGS.salesPartnerCommissions,
    SALES_PARTNER_PHASE_B_NAV_BINDINGS.salesPartnerCommissions,
  );
  assert.equal(FOUNDATION_NAV_BINDINGS.salesPartnerAcademy, SALES_PARTNER_PHASE_B_NAV_BINDINGS.salesPartnerAcademy);
  assert.ok(!FOUNDATION_NAV_BINDINGS.salesPartnerCommissions.includes("business-continuity"));
});

test("manifest canonical route is APP sales-partner host", () => {
  const m = getSoftwareModuleManifest("sales_partner");
  assert.ok(m);
  assert.equal(m!.canonicalRoute, "/app/sales-partner");
  assert.equal(m!.accessPolicy, "partner_identity");
});

test("design tokens remain 1560 pageWidth", () => {
  assert.equal(APP_CONTENT_MAX_WIDTH_PX, 1560);
  assert.match(AppLayoutClasses.pageWidth, /1560/);
});

test("license architecture is documentation-only (no activation)", () => {
  assert.equal(SALES_PARTNER_LICENSE_ARCHITECTURE.activationInThisPhase, false);
  assert.equal(SALES_PARTNER_LICENSE_ARCHITECTURE.aipifyPartner.automaticProductEntitlement, false);
  assert.equal(
    SALES_PARTNER_LICENSE_ARCHITECTURE.commercialSalesPartnerModule.status,
    "foundation_ts_ready_sql_prepared_only",
  );
  assert.equal(SALES_PARTNER_LICENSE_ARCHITECTURE.foundationModule, "lib/sales-partner-commercial-license");
});

test("materials host is distinct from tools host", () => {
  const tools = SALES_PARTNER_THIN_HOSTS.find((h) => h.capability === "tools");
  const materials = SALES_PARTNER_THIN_HOSTS.find((h) => h.capability === "materials");
  assert.equal(tools?.appPath, "/app/sales-partner/tools");
  assert.equal(materials?.appPath, "/app/sales-partner/materials");
  assert.equal(materials?.initialMarketingSection, "library");
  assert.equal(tools?.initialMarketingSection, "center");
});

test("public and excluded surfaces are not thin hosts", () => {
  const paths = new Set(SALES_PARTNER_THIN_HOSTS.map((h) => h.appPath));
  assert.equal(paths.has("/p/[slug]"), false);
  assert.equal(paths.has("/app/growth-partner"), false);
  assert.equal(paths.has("/app/partners"), false);
});
