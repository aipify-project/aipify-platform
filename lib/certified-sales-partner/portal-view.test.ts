import assert from "node:assert/strict";
import test from "node:test";
import {
  deriveCspNextAction,
  listSellableProductKeys,
  parseCspPortalView,
  parseCspSaleRows,
  parseCspSettlementRows,
} from "./portal-view";

const PRODUCT_ID = "11111111-1111-4111-8111-111111111111";

const payload = (status: string, cert: string, links: unknown[] = []) => ({
  found: true,
  partner: { id: "p1", display_name: "Partner", status },
  products: [
    { id: PRODUCT_ID, product_key: "kompis_web", fixed_commission_amount: 100, currency: "NOK", certification_status: cert },
    { id: "22222222-2222-4222-8222-222222222222", product_key: "kompis_bedrift", certification_status: "not_started" },
  ],
  certifications: [{ product_id: PRODUCT_ID, product_key: "kompis_web", status: cert }],
  links,
  sales_summary: { by_status: { earned: 2, paid: 1 }, ledger_balance_by_currency: { NOK: "300" } },
  bank_profile: { has_profile: false, status: null },
});

test("view: counts only what Core returned", () => {
  const v = parseCspPortalView(payload("approved", "passed"));
  assert.equal(v.passedCertificationCount, 1);
  assert.equal(v.publishedProductCount, 2);
  assert.equal(v.salesTotal, 3);
  assert.deepEqual(v.ledgerByCurrency, { NOK: 300 });
  assert.equal(v.hasBankProfile, false);
  assert.deepEqual(listSellableProductKeys(v), ["kompis_web", "kompis_bedrift"]);
});

test("view: missing slots stay empty, never zero-faked money", () => {
  const v = parseCspPortalView({ found: true, partner: { id: "p", status: "approved" } });
  assert.deepEqual(v.ledgerByCurrency, {});
  assert.equal(v.hasBankProfile, null);
  assert.equal(v.salesTotal, 0);
});

test("next action: approval → train → create link → view sales", () => {
  assert.equal(deriveCspNextAction(parseCspPortalView(payload("under_review", "not_started"))).key, "awaiting_approval");
  assert.equal(deriveCspNextAction(parseCspPortalView(payload("needs_information", "not_started"))).key, "provide_information");
  assert.equal(deriveCspNextAction(parseCspPortalView(payload("suspended", "passed"))).key, "not_active");
  assert.equal(deriveCspNextAction(parseCspPortalView(payload("approved", "not_started"))).key, "train");
  assert.equal(deriveCspNextAction(parseCspPortalView(payload("approved", "passed"))).key, "create_link");
  const withLink = payload("approved", "passed", [{ id: "l1", code: "csp-abc", channel_origin: "email", active: true }]);
  assert.equal(deriveCspNextAction(parseCspPortalView(withLink)).key, "view_sales");
  const inactive = payload("approved", "passed", [{ id: "l1", code: "csp-abc", channel_origin: "email", active: false }]);
  assert.equal(deriveCspNextAction(parseCspPortalView(inactive)).key, "create_link");
});

test("rows: sales and settlements parse partner-safe columns; empty/garbage → []", () => {
  const sales = parseCspSaleRows({
    found: true,
    sales: [{ id: "s1", product_key: "kompis_web", status: "earned", paid_periods_count: 2, snapshot_amount: "100", snapshot_currency: "NOK", customer_org_id: "secret" }],
  });
  assert.equal(sales.length, 1);
  assert.equal(sales[0].snapshotAmount, 100);
  assert.equal("customer_org_id" in sales[0], false);
  assert.deepEqual(parseCspSaleRows(null), []);
  assert.deepEqual(parseCspSettlementRows({ settlements: "x" }), []);
  const settlements = parseCspSettlementRows({ settlements: [{ id: "m1", period_month: "2026-01-01", status: "open", total_amount: 0, currency: "NOK", line_count: 0 }] });
  assert.equal(settlements[0].totalAmount, 0);
});
