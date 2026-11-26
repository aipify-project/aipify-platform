import assert from "node:assert/strict";
import test from "node:test";
import {
  buildSellerProfileKpis,
  countActiveCertifications,
  parseSellerProfileData,
  summarizeLedgerEarned,
} from "./seller-profile-view";

test("KPIs are all null when Core reported nothing", () => {
  assert.deepEqual(buildSellerProfileKpis(null, null), {
    clicks: null,
    registrations: null,
    sales: null,
    commissionsEarnedByCurrency: null,
    certifications: null,
    openSettlements: null,
  });
});

test("a reported zero stays zero, an unreported value stays null", () => {
  const data = parseSellerProfileData({
    profile: { totals: { clicks: 0, registrations: null, qualifiedSales: 2 }, ledger: null },
  });
  const kpis = buildSellerProfileKpis(data, [{ status: "passed" }, { status: "failed" }]);
  assert.equal(kpis.clicks, 0);
  assert.equal(kpis.registrations, null);
  assert.equal(kpis.sales, 2);
  assert.equal(kpis.openSettlements, null);
  assert.equal(kpis.commissionsEarnedByCurrency, null);
  assert.equal(kpis.certifications, 1);
});

test("countActiveCertifications is null for an unknown list and 0 for an empty one", () => {
  assert.equal(countActiveCertifications(null), null);
  assert.equal(countActiveCertifications(undefined), null);
  assert.equal(countActiveCertifications([]), 0);
});

test("summarizeLedgerEarned sums earned entries per currency and never returns partial totals", () => {
  const entries = [
    { entryType: "earned", amount: 10.1, currency: "NOK" },
    { entryType: "earned", amount: 20.2, currency: "NOK" },
    { entryType: "paid", amount: 5, currency: "NOK" },
    { entryType: "earned", amount: 7, currency: "EUR" },
    { entryType: "earned", amount: null, currency: "EUR" },
  ];
  assert.deepEqual(summarizeLedgerEarned(entries, false), { NOK: 30.3, EUR: 7 });
  assert.equal(summarizeLedgerEarned(entries, true), null);
  assert.deepEqual(summarizeLedgerEarned([], false), {});
});

test("parseSellerProfileData rejects malformed payloads and keeps unreadable segments null", () => {
  assert.equal(parseSellerProfileData(null), null);
  assert.equal(parseSellerProfileData({ found: true }), null);
  const parsed = parseSellerProfileData({
    profile: {
      totals: { clicks: "12", registrations: -1 },
      links: [{ id: "l1", code: "abc", active: true, clicks: 3 }, { id: "l2" }],
      sales: null,
      ledger: { entries: [{ id: "e1", entryType: "earned", amount: "4.5", currency: "NOK" }], earnedByCurrency: null },
    },
  });
  assert.ok(parsed);
  assert.equal(parsed.totals.clicks, 12);
  assert.equal(parsed.totals.registrations, null);
  assert.equal(parsed.links?.length, 1);
  assert.equal(parsed.sales, null);
  assert.equal(parsed.settlements, null);
  assert.equal(parsed.audit, null);
  assert.equal(parsed.ledger?.entries[0].amount, 4.5);
  assert.equal(parsed.ledger?.earnedByCurrency, null);
});
