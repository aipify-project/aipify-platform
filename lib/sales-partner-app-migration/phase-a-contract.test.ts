/**
 * Phase A contract tests — no runtime nav/redirect changes.
 */
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { APP_CONTENT_MAX_WIDTH_PX, AppLayoutClasses } from "@/lib/design/app-layout";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { CSP_PARTNER_PORTAL_ALLOWED_STATUSES } from "@/lib/certified-sales-partner/partner-access";
import { getSoftwareModuleManifest } from "@/lib/app-module-manifest";
import {
  SALES_PARTNER_ACCESS_MATRIX,
  SALES_PARTNER_ALLOWED_STATUSES_CONTRACT,
  SALES_PARTNER_APP_DESIGN_CONTRACT,
  SALES_PARTNER_APP_MODULE_BASE,
  SALES_PARTNER_APP_MIGRATION_PHASE,
  SALES_PARTNER_APP_ROUTE_MATRIX,
  SALES_PARTNER_EXCLUDED_APP_SURFACES,
  SALES_PARTNER_LIVE_BINDING_GAPS,
  SALES_PARTNER_MIGRATION_REQUIREMENTS,
  SALES_PARTNER_MODULE_KEY,
  SALES_PARTNER_PHASE_B_FILE_PLAN,
  SALES_PARTNER_PRODUCT_DISPLAY_CONTRACT,
  SALES_PARTNER_PROGRAM_IDENTITY,
  SALES_PARTNER_PUBLIC_SURFACES,
  findMatrixRowByCurrentPath,
  listCspNavHrefs,
} from "./phase-a-contract";

const REPO_ROOT = join(import.meta.dirname, "../..");

test("Phase A marker and module base", () => {
  assert.equal(SALES_PARTNER_APP_MIGRATION_PHASE, "A");
  assert.equal(SALES_PARTNER_APP_MODULE_BASE, "/app/sales-partner");
  assert.equal(SALES_PARTNER_MODULE_KEY, "sales_partner");
});

test("design contract matches APP layout tokens", () => {
  assert.equal(SALES_PARTNER_APP_DESIGN_CONTRACT.contentMaxWidthPx, 1560);
  assert.equal(SALES_PARTNER_APP_DESIGN_CONTRACT.contentMaxWidthPx, APP_CONTENT_MAX_WIDTH_PX);
  assert.equal(SALES_PARTNER_APP_DESIGN_CONTRACT.pageWidthClass, AppLayoutClasses.pageWidth);
  assert.match(AppLayoutClasses.pageWidth, /max-w-\[1560px\]/);
});

test("manifest sales_partner stays partner_identity (no automatic product entitlement)", () => {
  const m = getSoftwareModuleManifest("sales_partner");
  assert.ok(m);
  assert.equal(m!.accessPolicy, "partner_identity");
  assert.equal(m!.canonicalRoute, "/app/sales-partner");
  assert.equal(SALES_PARTNER_PROGRAM_IDENTITY.aipifyCertifiedProgram.automaticAppProductEntitlement, false);
  assert.equal(SALES_PARTNER_PROGRAM_IDENTITY.futureExternalPaidModule.commercialEngineInPhaseA, false);
});

test("allowed statuses contract matches partner-access", () => {
  assert.deepEqual(
    [...SALES_PARTNER_ALLOWED_STATUSES_CONTRACT],
    [...CSP_PARTNER_PORTAL_ALLOWED_STATUSES],
  );
});

test("route matrix target paths stay under /app/sales-partner or shared APP reuse", () => {
  for (const row of SALES_PARTNER_APP_ROUTE_MATRIX) {
    if (row.hostStrategy === "thin_app_host") {
      assert.ok(
        row.targetAppPath === SALES_PARTNER_APP_MODULE_BASE ||
          row.targetAppPath.startsWith(`${SALES_PARTNER_APP_MODULE_BASE}/`),
        `${row.capability} target ${row.targetAppPath}`,
      );
    } else {
      assert.ok(row.targetAppPath.startsWith("/app/"), `${row.capability} reuse path`);
    }
    assert.ok(row.currentPartnersPath.startsWith("/partners"), row.capability);
  }
});

test("CSP nav hrefs are covered by route matrix (materials query allowed)", () => {
  const hrefs = listCspNavHrefs();
  assert.ok(hrefs.length >= 10);
  for (const href of hrefs) {
    const base = href.split("?")[0]!;
    const covered =
      findMatrixRowByCurrentPath(href) != null ||
      SALES_PARTNER_APP_ROUTE_MATRIX.some((r) => r.currentPartnersPath.split("?")[0] === base);
    assert.ok(covered, `CSP nav href not in matrix: ${href}`);
  }
});

test("live bindings point at Phase B APP thin hosts", () => {
  const byId = Object.fromEntries(SALES_PARTNER_LIVE_BINDING_GAPS.map((g) => [g.navId, g]));
  for (const gap of SALES_PARTNER_LIVE_BINDING_GAPS) {
    assert.equal(gap.issue, "ok", gap.navId);
    assert.equal(gap.liveHref, gap.contractTarget, gap.navId);
  }
  assert.equal(byId.salesPartnerCustomers?.liveHref, "/app/sales-partner/customers");
  assert.equal(byId.salesPartnerAcademy?.liveHref, "/app/sales-partner/academy");
  assert.equal(byId.salesPartnerCommissions?.liveHref, "/app/sales-partner/commissions");
  assert.equal(FOUNDATION_NAV_BINDINGS.salesPartnerCommissions, "/app/sales-partner/commissions");
  assert.ok(findMatrixRowByCurrentPath("/partners/settlement"));
});

test("partners roots and settlement sources exist; APP thin hosts exist", () => {
  assert.equal(existsSync(join(REPO_ROOT, "app/partners/customers/page.tsx")), true);
  assert.equal(existsSync(join(REPO_ROOT, "app/partners/academy/page.tsx")), true);
  assert.equal(existsSync(join(REPO_ROOT, "app/partners/settlement/page.tsx")), true);
  assert.equal(existsSync(join(REPO_ROOT, "app/partners/customers/prospects/page.tsx")), true);
  assert.equal(existsSync(join(REPO_ROOT, "app/partners/academy/training/page.tsx")), true);
  assert.equal(existsSync(join(REPO_ROOT, "app/app/sales-partner/page.tsx")), true);
  assert.equal(existsSync(join(REPO_ROOT, "app/app/sales-partner/commissions/page.tsx")), true);
});

test("excluded surfaces are not in route matrix targets", () => {
  const targets = new Set(SALES_PARTNER_APP_ROUTE_MATRIX.map((r) => r.targetAppPath));
  for (const excluded of SALES_PARTNER_EXCLUDED_APP_SURFACES) {
    assert.equal(targets.has(excluded), false);
    assert.ok(
      !SALES_PARTNER_APP_ROUTE_MATRIX.some(
        (r) => r.targetAppPath === excluded || r.targetAppPath.startsWith(`${excluded}/`),
      ),
      excluded,
    );
  }
});

test("public surfaces stay outside APP module base", () => {
  for (const surf of SALES_PARTNER_PUBLIC_SURFACES) {
    assert.ok(!surf.path.startsWith("/app/sales-partner"));
  }
});

test("access matrix: customer without partner denied; approved seller allowed; suspended denied", () => {
  const customer = SALES_PARTNER_ACCESS_MATRIX.find((a) => a.actor === "app_customer_no_partner");
  const approved = SALES_PARTNER_ACCESS_MATRIX.find((a) => a.actor === "csp_approved_seller");
  const suspended = SALES_PARTNER_ACCESS_MATRIX.find((a) => a.actor === "csp_suspended_seller");
  assert.equal(customer?.salesPartnerModuleVisible, false);
  assert.equal(approved?.salesPartnerModuleVisible, true);
  assert.equal(suspended?.salesPartnerModuleVisible, false);
  assert.equal(suspended?.partnersPanelAllowed, false);
});

test("product display forbids hard-coded prices and customer buy CTA", () => {
  assert.equal(SALES_PARTNER_PRODUCT_DISPLAY_CONTRACT.hardCodedPricesForbidden, true);
  assert.ok(SALES_PARTNER_PRODUCT_DISPLAY_CONTRACT.sellerMustNotSee.includes("customer_purchase_cta"));
  assert.equal(SALES_PARTNER_PRODUCT_DISPLAY_CONTRACT.agent2DependencySqlForbiddenInThisStream, true);
});

test("migration requirements document load/messages/materials for Phase B", () => {
  const ids = SALES_PARTNER_MIGRATION_REQUIREMENTS.map((r) => r.id);
  assert.ok(ids.includes("portal_load_60_120s"));
  assert.ok(ids.includes("messages_missing_send"));
  assert.ok(ids.includes("materials_section_query_panel_switch"));
  assert.ok(SALES_PARTNER_MIGRATION_REQUIREMENTS.every((r) => r.phase === "B"));
});

test("Phase B file plan starts with hosts registry and APP layout", () => {
  assert.equal(SALES_PARTNER_PHASE_B_FILE_PLAN[0]?.path, "lib/sales-partner-app-migration/phase-b-hosts.ts");
  assert.equal(SALES_PARTNER_PHASE_B_FILE_PLAN[1]?.path, "app/app/sales-partner/layout.tsx");
  assert.ok(SALES_PARTNER_PHASE_B_FILE_PLAN.some((f) => f.path.includes("sales-partner/page.tsx")));
});
