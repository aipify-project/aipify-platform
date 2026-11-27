import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { SELLERS_ADMIN_NAV, sellersAdminNavActive } from "./sellers-admin-nav";

const root = new URL("../../", import.meta.url);

test("seller section pages use hub tabs; partner profile stays free of duplicate row", () => {
  const live = readFileSync(new URL("lib/platform/sellers-action-page.tsx", root), "utf8");
  const ops = readFileSync(new URL("lib/platform/sellers-ops-page.tsx", root), "utf8");
  const shell = readFileSync(
    new URL("components/platform/sellers/PlatformSellersHubShell.tsx", root),
    "utf8",
  );
  const profile = readFileSync(new URL("app/platform/sellers/partners/[id]/page.tsx", root), "utf8");
  assert.match(live, /PlatformSellersHubShell/);
  assert.match(ops, /PlatformSellersHubShell/);
  assert.match(shell, /SellersAdminNav/);
  assert.doesNotMatch(profile, /SellersAdminNav/);
  assert.doesNotMatch(profile, /PlatformSellersHubShell/);
});

test("seller admin nav reuses the twelve existing routes once", () => {
  const hrefs = SELLERS_ADMIN_NAV.map((item) => item.href);
  assert.equal(new Set(hrefs).size, hrefs.length);
  assert.equal(hrefs.length, 13);
  assert.equal(sellersAdminNavActive("/platform/sellers", "/platform/sellers"), true);
  assert.equal(sellersAdminNavActive("/platform/sellers/partners/abc", "/platform/sellers/partners"), true);
  assert.equal(sellersAdminNavActive("/platform/sellers/partners", "/platform/sellers"), false);
});

test("commissions page is not the settlement editor", () => {
  const commissions = readFileSync(new URL("app/platform/sellers/commissions/page.tsx", root), "utf8");
  const settlements = readFileSync(new URL("app/platform/sellers/settlements/page.tsx", root), "utf8");
  assert.match(commissions, /section: "commissions"/);
  assert.match(settlements, /section: "settlements"/);
});

test("partner rows open the full profile and percent commission is not submitted", () => {
  const panel = readFileSync(new URL("components/platform/sellers/CertifiedSellersLivePanel.tsx", root), "utf8");
  const form = readFileSync(new URL("components/platform/sellers/CertifiedSellersActionPanel.tsx", root), "utf8");
  const sql = readFileSync(new URL("docs/platform/sql-candidates/csp_percent_commission_v3.sql", root), "utf8");
  assert.match(panel, /\/platform\/sellers\/partners\/\$\{p\.id\}/);
  assert.doesNotMatch(panel, /<CertifiedSellersPartnerDetailsDrawer/);
  assert.doesNotMatch(form, /commission_percent/);
  assert.match(form, /percentUnavailable/);
  assert.match(sql, /PREPARED_ONLY/);
  assert.match(sql, /APPLY_BLOCKED_PERCENT_COMMISSION_HAS_NO_LEDGER/);
  assert.doesNotMatch(sql, /create table/i);
});
