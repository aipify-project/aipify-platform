import assert from "node:assert/strict";
import test from "node:test";
import {
  availableSellerCountries,
  availableSellerStatuses,
  filterSellerRanking,
  parseSellerRanking,
  sortSellerRanking,
  topSellers,
  type SellerRankRow,
} from "./seller-ranking";

const row = (over: Partial<SellerRankRow> & { partnerId: string }): SellerRankRow => ({
  displayName: null,
  country: null,
  status: "active",
  clicks: 0,
  registrations: 0,
  qualifiedSales: 0,
  avatarUrl: null,
  ...over,
});

const ROWS: SellerRankRow[] = [
  row({ partnerId: "aaaa1111-0000-0000-0000-000000000001", displayName: "Beta", country: "NO", clicks: 10 }),
  row({ partnerId: "bbbb2222-0000-0000-0000-000000000002", displayName: "Alfa", country: "SE", clicks: 10, registrations: 3 }),
  row({ partnerId: "cccc3333-0000-0000-0000-000000000003", displayName: "Gamma", country: "NO", clicks: 40, status: "suspended" }),
  row({ partnerId: "dddd4444-0000-0000-0000-000000000004", displayName: "Delta", country: "DK", clicks: 0 }),
  row({ partnerId: "eeee5555-0000-0000-0000-000000000005", displayName: "Epsilon", clicks: 5 }),
  row({ partnerId: "ffff6666-0000-0000-0000-000000000006", displayName: "Zeta", clicks: 1 }),
];

test("sortSellerRanking orders by clicks, then registrations, then name", () => {
  const names = sortSellerRanking(ROWS).map((r) => r.displayName);
  assert.deepEqual(names, ["Gamma", "Alfa", "Beta", "Epsilon", "Zeta", "Delta"]);
});

test("sortSellerRanking by registrations does not mutate input", () => {
  const copy = [...ROWS];
  const sorted = sortSellerRanking(ROWS, "registrations");
  assert.equal(sorted[0].displayName, "Alfa");
  assert.deepEqual(ROWS, copy);
});

test("topSellers returns at most five by clicks", () => {
  const top = topSellers(ROWS);
  assert.equal(top.length, 5);
  assert.equal(top[0].displayName, "Gamma");
  assert.equal(topSellers(ROWS, 0).length, 0);
  assert.equal(topSellers(ROWS.slice(0, 2)).length, 2);
});

test("parseSellerRanking returns null for non-ranking payloads and drops invalid rows", () => {
  assert.equal(parseSellerRanking(null), null);
  assert.equal(parseSellerRanking([]), null);
  assert.equal(parseSellerRanking({ error: "x" }), null);
  const parsed = parseSellerRanking({
    sellers: [{ partnerId: "p1", clicks: 4, displayName: " " }, { clicks: 9 }, "bad", { partnerId: "p2", clicks: -3 }],
  });
  assert.equal(parsed?.length, 2);
  assert.equal(parsed?.[0].displayName, null);
  assert.equal(parsed?.[0].clicks, 4);
  assert.equal(parsed?.[1].clicks, 0);
  assert.equal(parsed?.[0].status, "unknown");
});

test("filterSellerRanking matches name, country code/label, id prefix and email ids", () => {
  const countryLabel = (c: string) => ({ NO: "Norge", SE: "Sverige", DK: "Danmark" })[c] ?? c;
  assert.deepEqual(filterSellerRanking(ROWS, { query: "gam" }).map((r) => r.displayName), ["Gamma"]);
  assert.deepEqual(filterSellerRanking(ROWS, { query: "norge", countryLabel }).length, 2);
  assert.deepEqual(filterSellerRanking(ROWS, { query: "se" }).map((r) => r.displayName), ["Alfa"]);
  assert.deepEqual(filterSellerRanking(ROWS, { query: "dddd4" }).map((r) => r.displayName), ["Delta"]);
  assert.deepEqual(
    filterSellerRanking(ROWS, { query: "someone@example.com", emailMatchIds: new Set([ROWS[3].partnerId]) }).map(
      (r) => r.displayName,
    ),
    ["Delta"],
  );
  assert.equal(filterSellerRanking(ROWS, { query: "zzzz" }).length, 0);
});

test("filterSellerRanking combines country and status filters with 'all' meaning no filter", () => {
  assert.equal(filterSellerRanking(ROWS, { country: "all", status: "all" }).length, ROWS.length);
  assert.deepEqual(filterSellerRanking(ROWS, { country: "no", status: "suspended" }).map((r) => r.displayName), ["Gamma"]);
});

test("available countries/statuses only list values present in the data", () => {
  assert.deepEqual(availableSellerCountries(ROWS), ["DK", "NO", "SE"]);
  assert.deepEqual(availableSellerStatuses(ROWS, ["pending", "active", "suspended"]), ["active", "suspended"]);
  assert.deepEqual(availableSellerStatuses([row({ partnerId: "x", status: "weird" })], ["active"]), ["weird"]);
});
