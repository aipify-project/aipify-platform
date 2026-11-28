import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { UNIFIED_SELLER_BRIDGE_RPC, UNIFIED_SELLER_BRIDGE_SQL_CANDIDATE } from "./constants";

const sql = readFileSync(UNIFIED_SELLER_BRIDGE_SQL_CANDIDATE, "utf8");
const shaFile = readFileSync(`${UNIFIED_SELLER_BRIDGE_SQL_CANDIDATE}.sha256`, "utf8").trim();

test("SQL candidate is NOT_APPLIED and documents hard bounds", () => {
  assert.match(sql, /NOT_APPLIED/);
  assert.match(sql, /NO_PRODUCTION_WRITE/);
  assert.match(sql, /NO_ACCOUNT_CONVERSION/);
  assert.match(sql, /NO_AUTO_CERTIFICATION/);
  assert.match(sql, /MUST NOT be copied into/);
  assert.match(sql, /supabase\/migrations/);
  assert.match(sql, /ZERO new portal \/ get_growth_portal_access dependency/);
  assert.doesNotMatch(sql, /create or replace function public\.get_growth_portal_access/i);
  assert.doesNotMatch(sql, /stripe\.com|stripe_customer|stripe_subscription/i);
});

test("SQL candidate exposes idempotent ensure + sync + own links RPCs", () => {
  for (const name of Object.values(UNIFIED_SELLER_BRIDGE_RPC)) {
    assert.match(sql, new RegExp(`function public\\.${name}`));
  }
  assert.match(sql, /security definer/i);
  assert.match(sql, /is_platform_admin/);
  assert.match(sql, /csp_product_certifications/);
  assert.match(sql, /status = 'passed'/);
  assert.match(sql, /link_status = case when v_link_active then 'active' else 'disabled' end/);
  assert.match(sql, /csp_seller_exists/);
  assert.match(sql, /auth_user_conflict/);
});

test("SHA-256 sidecar matches candidate bytes", () => {
  const digest = createHash("sha256").update(readFileSync(UNIFIED_SELLER_BRIDGE_SQL_CANDIDATE)).digest("hex");
  assert.equal(shaFile.split(/\s+/)[0], digest);
});

test("sales-page module no longer invents /s/{csp-code} as the personal path source of truth", () => {
  const page = readFileSync("app/partners/sales-page/page.tsx", "utf8");
  assert.match(page, /getOwnUnifiedSellerSalesLinks|resolvePersonalSalesPath/);
  assert.doesNotMatch(page, /personalPath = link\?\.code \? `\/s\/\$\{link\.code\}/);
});