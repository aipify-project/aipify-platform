import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { classifyBridgeAccessDenial, mapGpStatusFromCsp } from "./parse";
import { UNIFIED_SELLER_BRIDGE_SQL_CANDIDATE } from "./constants";

const sql = readFileSync(UNIFIED_SELLER_BRIDGE_SQL_CANDIDATE, "utf8");

test("negative access: unauthenticated callers are unauthorized", () => {
  for (const rpc of ["ensureForCsp", "ensureOwn", "syncFromCsp", "getOwnLinks"] as const) {
    assert.equal(
      classifyBridgeAccessDenial({
        authenticated: false,
        isPlatformAdmin: false,
        ownsCspPartner: false,
        rpc,
      }),
      "unauthorized",
    );
  }
});

test("negative access: non-admin cannot call platform ensure", () => {
  assert.equal(
    classifyBridgeAccessDenial({
      authenticated: true,
      isPlatformAdmin: false,
      ownsCspPartner: true,
      rpc: "ensureForCsp",
    }),
    "forbidden",
  );
});

test("negative access: internal SECURITY DEFINER helpers are never client-callable", () => {
  for (const rpc of ["internalMap", "internalSync", "internalEnsure"] as const) {
    assert.equal(
      classifyBridgeAccessDenial({
        authenticated: true,
        isPlatformAdmin: true,
        ownsCspPartner: true,
        rpc,
      }),
      "forbidden",
    );
  }
});

test("negative access: sync requires platform admin or CSP owner", () => {
  assert.equal(
    classifyBridgeAccessDenial({
      authenticated: true,
      isPlatformAdmin: false,
      ownsCspPartner: false,
      rpc: "syncFromCsp",
    }),
    "forbidden",
  );
  assert.equal(
    classifyBridgeAccessDenial({
      authenticated: true,
      isPlatformAdmin: false,
      ownsCspPartner: true,
      rpc: "syncFromCsp",
    }),
    "allowed",
  );
});

test("SQL revokes client EXECUTE on all internal helpers", () => {
  assert.match(sql, /revoke all on function public\._usb_map_gp_status_from_csp/);
  assert.match(sql, /revoke all on function public\._usb_sync_gp_status_from_csp_internal/);
  assert.match(sql, /revoke all on function public\._usb_ensure_gp_profile_for_csp/);
  assert.match(sql, /revoke all on function public\._usb_provision_dedicated_gp_org_for_auth/);
  assert.match(sql, /revoke all on function public\._usb_on_csp_partner_status_change/);
  assert.doesNotMatch(sql, /grant execute on function public\._usb_/);
});

test("SQL refuses APP customer org conversion and uses dedicated GP org", () => {
  assert.match(sql, /existing_app_customer_org/);
  assert.match(sql, /dedicated_bridge_org/);
  assert.match(sql, /NEVER mutates existing APP customer tenants/i);
  assert.match(sql, /Keep users\.company_id unchanged/i);
});

test("SQL requires product-specific kompis_web certification for certified+active link", () => {
  assert.match(sql, /sp\.product_key = v_product_key/);
  assert.match(sql, /p_product_key text default 'kompis_web'/);
  assert.match(sql, /join public\.csp_sales_products sp on sp\.id = c\.product_id/);
});

test("SQL suspend path disables all tracking links and keeps CSP history tables untouched", () => {
  assert.match(sql, /update public\.growth_partner_tracking_links/);
  assert.match(sql, /where profile_id = v_profile\.id/);
  assert.match(sql, /trg_usb_csp_partner_status_sync/);
  assert.doesNotMatch(sql, /delete from public\.csp_attribution_links/i);
  assert.doesNotMatch(sql, /delete from public\.csp_commission_ledger/i);
  assert.doesNotMatch(sql, /delete from public\.csp_monthly_settlements/i);
  assert.doesNotMatch(sql, /delete from public\.growth_partner_ops_leads/i);
});

test("SQL concurrency uses advisory lock and unique_violation recovery", () => {
  assert.match(sql, /pg_advisory_xact_lock/);
  assert.match(sql, /unified-seller-bridge-v1/);
  assert.match(sql, /when unique_violation then/i);
});

test("SQL signup patch preserves Production confirmations and only adds CSP guard", () => {
  assert.match(sql, /csp_seller_exists/);
  assert.match(sql, /terms_accepted is required/);
  assert.match(sql, /info_accurate_confirmed is required/);
  assert.match(sql, /redirect_path', '\/app\/growth-partner'/);
  assert.match(sql, /partner_link', v_link/);
});

test("any-product cert alone does not certify without status+product key", () => {
  // Pure helper: productCertPassed must be computed for kompis_web by Core.
  assert.equal(mapGpStatusFromCsp({ cspStatus: "approved", productCertPassed: false }).linkActive, false);
  assert.equal(mapGpStatusFromCsp({ cspStatus: "in_academy", productCertPassed: true }).partnerStatus, "certification_required");
});

test("SHA-256 sidecar matches hardened candidate", () => {
  const digest = createHash("sha256").update(readFileSync(UNIFIED_SELLER_BRIDGE_SQL_CANDIDATE)).digest("hex");
  const shaFile = readFileSync(`${UNIFIED_SELLER_BRIDGE_SQL_CANDIDATE}.sha256`, "utf8").trim();
  assert.equal(shaFile.split(/\s+/)[0], digest);
});
