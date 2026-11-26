/**
 * Seller dashboard KPI cards must show numeric/money primary values.
 * Empty copy belongs in the hint — never as the main value.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const overview = readFileSync(
  join(root, "components/partners-portal/CertifiedSalesPartnerPortalPanels.tsx"),
  "utf8",
);

test("overview sales card uses salesTotal as primary value with empty hint", () => {
  assert.match(overview, /value=\{portal\.salesTotal\}/);
  assert.match(overview, /hint=\{portal\.salesTotal === 0 \? labels\.salesNone/);
  assert.doesNotMatch(
    overview,
    /value=\{portal\.salesTotal === 0 \? labels\.salesNone : portal\.salesTotal\}/,
  );
});

test("overview balance card uses emptyAsZero and never puts balanceNone as primary value", () => {
  assert.match(overview, /emptyAsZero/);
  assert.match(overview, /formatEmptyCommissionBalance/);
  assert.match(overview, /return "NOK 00,00"/);
  assert.doesNotMatch(
    overview,
    /value=\{<BalanceText balances=\{portal\.ledgerByCurrency\} none=\{labels\.balanceNone\} locale=\{locale\} \/>\}/,
  );
});

console.log("seller dashboard KPI display contract passed");
