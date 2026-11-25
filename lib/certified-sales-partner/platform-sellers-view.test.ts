import assert from "node:assert/strict";
import test from "node:test";
import {
  countPendingApplications,
  nextSettlementStep,
  parseSellersOverview,
  parseSettlementList,
  partnerStatusKind,
  suggestedPartnerStatus,
} from "./platform-sellers-view";

test("overview: parses the Core payload and keeps unreported figures null", () => {
  const o = parseSellersOverview({
    found: true,
    partners_by_status: { under_review: 2, approved: 3, needs_information: 1 },
    partners_total: 6,
    products_total: 4,
    products_published: 2,
    open_settlements: { count: 1, by_currency: { NOK: 1500 } },
    unpaid_settlements_count: 3,
  });
  assert.equal(o.partnersTotal, 6);
  assert.equal(countPendingApplications(o.partnersByStatus), 3);
  assert.equal(o.openSettlementsByCurrency.NOK, 1500);
  assert.equal(o.certifiedPartners, null);
  assert.equal(o.qualifiedSales, null);
  assert.equal(o.academy, null);
  assert.equal(o.partners, null);
  assert.equal(o.products, null);
});

test("overview: empty / malformed payload never fabricates numbers", () => {
  const o = parseSellersOverview(null);
  assert.equal(o.partnersTotal, null);
  assert.deepEqual(o.partnersByStatus, {});
  assert.equal(countPendingApplications(o.partnersByStatus), 0);
});

test("overview: optional lists distinguish absent from empty", () => {
  const o = parseSellersOverview({ partners: [], products: [{ id: "p1", product_key: "k", published: true }] });
  assert.deepEqual(o.partners, []);
  assert.equal(o.products?.[0]?.productKey, "k");
  assert.equal(o.products?.[0]?.published, true);
});

test("overview: academy summary only when Core returns it", () => {
  const o = parseSellersOverview({ academy: { attempts_total: 10, attempts_passed: 7, certifications_active: 5 } });
  assert.equal(o.academy?.attemptsTotal, 10);
  assert.equal(o.academy?.attemptsFailed, null);
  assert.equal(o.certifiedPartners, 5);
});

test("settlements: parses RPC rows and drops rows without id", () => {
  const rows = parseSettlementList({
    found: true,
    settlements: [
      { id: "s1", partner_id: "p1", period_month: "2026-10-01", status: "open", total_amount: "1200.50", currency: "NOK", line_count: 3 },
      { status: "open" },
    ],
  });
  assert.equal(rows?.length, 1);
  assert.equal(rows?.[0]?.totalAmount, 1200.5);
  assert.equal(parseSettlementList({ found: true }), null);
});

test("next settlement step follows the allowed forward path", () => {
  assert.equal(nextSettlementStep("open"), "approved");
  assert.equal(nextSettlementStep("approved"), "closed");
  assert.equal(nextSettlementStep("closed"), "paid");
  assert.equal(nextSettlementStep("paid"), null);
  assert.equal(nextSettlementStep("voided"), null);
});

test("status presentation: unknown codes get a safe kind, suggestions are valid statuses", () => {
  assert.equal(partnerStatusKind("approved"), "verified");
  assert.equal(partnerStatusKind("something_new"), "information");
  assert.equal(suggestedPartnerStatus("under_review"), "approved");
  assert.equal(suggestedPartnerStatus("approved"), "suspended");
});
