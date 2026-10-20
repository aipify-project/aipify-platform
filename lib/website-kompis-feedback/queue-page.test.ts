import assert from "node:assert/strict";
import { pageFeedbackReviewRows, type PagedFeedbackRow } from "@/lib/website-kompis-feedback/disposition";

const tenantA = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1";
const tenantB = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2";
const installA = "cccccccc-cccc-4ccc-8ccc-ccccccccccc3";
const installB = "dddddddd-dddd-4ddd-8ddd-ddddddddddd4";
const sameTime = "2026-10-20T12:00:00.000Z";
const olderTime = "2026-10-19T12:00:00.000Z";

function idFor(n: number): string {
  return `10000000-0000-4000-8000-${n.toString(16).padStart(12, "0")}`;
}

function row(n: number, patch: Partial<PagedFeedbackRow> = {}): PagedFeedbackRow {
  return {
    id: idFor(n),
    tenantId: tenantA,
    installId: n % 2 === 0 ? installA : installB,
    createdAt: n % 5 === 0 ? sameTime : olderTime,
    vote: "not_helpful",
    reviewDisposition: "open",
    ...patch,
  };
}

function walk(rows: PagedFeedbackRow[], queue: "review" | "history", limit: number): string[] {
  const seen: string[] = [];
  let before: string | null = null;
  let beforeId: string | null = null;
  for (let page = 0; page < 10; page += 1) {
    const result = pageFeedbackReviewRows(rows, { tenantId: tenantA, queue, before, beforeId, limit });
    assert.equal(result.ok, true);
    if (!result.ok) return seen;
    seen.push(...result.items.map((item) => item.id));
    if (!result.next) break;
    before = result.next.before;
    beforeId = result.next.beforeId;
  }
  return seen;
}

const reviewRows = Array.from({ length: 101 }, (_, index) => row(index + 1));
const historyRows = Array.from({ length: 101 }, (_, index) =>
  row(index + 200, {
    vote: index % 2 === 0 ? "helpful" : "not_helpful",
    reviewDisposition: index % 2 === 0 ? "open" : index % 3 === 0 ? "published" : "rejected",
  }),
);
const otherTenant = row(900, { tenantId: tenantB, installId: installA });
const dataset = [...reviewRows, ...historyRows, otherTenant];

const reviewSeen = walk(dataset, "review", 100);
assert.equal(reviewSeen.length, 101);
assert.equal(new Set(reviewSeen).size, 101);
assert.deepEqual(reviewSeen.slice().sort(), reviewRows.map((item) => item.id).sort());
assert.equal(reviewSeen.includes(otherTenant.id), false);
assert.equal(reviewSeen.some((id) => historyRows.some((item) => item.id === id)), false);

const historySeen = walk(dataset, "history", 40);
assert.equal(historySeen.length, 101);
assert.equal(new Set(historySeen).size, 101);
assert.equal(historySeen.some((id) => reviewRows.some((item) => item.id === id)), false);

const tied = pageFeedbackReviewRows(
  [
    row(1, { createdAt: sameTime, id: idFor(1) }),
    row(2, { createdAt: sameTime, id: idFor(3) }),
    row(3, { createdAt: sameTime, id: idFor(2) }),
  ],
  { tenantId: tenantA, queue: "review", limit: 3 },
);
assert.equal(tied.ok, true);
if (tied.ok) assert.deepEqual(tied.items.map((item) => item.id), [idFor(3), idFor(2), idFor(1)]);

const first = pageFeedbackReviewRows(reviewRows, { tenantId: tenantA, queue: "review", limit: 100 });
assert.equal(first.ok, true);
if (!first.ok || !first.next) throw new Error("expected a full first page");
const newer = row(950, { createdAt: "2026-10-21T12:00:00.000Z" });
const insertedOlder = row(951, { createdAt: "2026-10-18T12:00:00.000Z" });
const continued = pageFeedbackReviewRows([...reviewRows, newer, insertedOlder], {
  tenantId: tenantA,
  queue: "review",
  before: first.next.before,
  beforeId: first.next.beforeId,
  limit: 100,
});
assert.equal(continued.ok, true);
if (continued.ok) {
  const continuedIds = continued.items.map((item) => item.id);
  assert.equal(continuedIds.includes(newer.id), false);
  assert.equal(continuedIds.includes(insertedOlder.id), true);
  assert.equal(continuedIds.some((id) => first.items.some((item) => item.id === id)), false);
}

assert.equal(
  pageFeedbackReviewRows(reviewRows, { tenantId: tenantA, queue: "review", before: sameTime, beforeId: null }).ok,
  false,
);
assert.equal(
  pageFeedbackReviewRows(reviewRows, { tenantId: tenantA, queue: "review", beforeId: "not-a-uuid" }).ok,
  false,
);
assert.equal(pageFeedbackReviewRows(reviewRows, { tenantId: " ", queue: "review" }).ok, false);
assert.equal(
  pageFeedbackReviewRows([row(1, { createdAt: "" })], { tenantId: tenantA, queue: "review" }).ok,
  false,
);
assert.equal(
  pageFeedbackReviewRows([row(1), row(1)], { tenantId: tenantA, queue: "review" }).ok,
  false,
);

console.log("queue-page.test.ts: ok");
