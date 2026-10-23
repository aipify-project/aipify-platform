import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  AIPIFY_FAQ_LOCAL_FIXTURE_NOT_PRODUCTION,
  FIXTURE_SITE_A,
  FIXTURE_SITE_B,
  FaqLocalFixture,
} from "@/lib/website-kompis-faq/local-fixture-api";

function list(fixture: FaqLocalFixture, search: string) {
  return fixture.list(new URL(`http://fixture.local/api/website-kompis/faq${search}`));
}

const eight = new FaqLocalFixture({ count: 8 });
const first = list(eight, `?installId=${FIXTURE_SITE_A}&status=draft`);
assert.equal(first.status, 200);
const firstBody = first.body as { listWindow: { siteTotal: number; selectAllSupported: boolean }; items: Array<{ title: string; status: string }> };
assert.equal(firstBody.listWindow.selectAllSupported, true);
assert.ok(firstBody.listWindow.siteTotal > 0);
assert.ok(firstBody.listWindow.siteTotal !== 100 || firstBody.items.length !== 100);
assert.equal(firstBody.items.some((item) => item.title === "Staff desk"), true);

for (const total of [0, 1, 99, 100, 101, 1500]) {
  const fixture = new FaqLocalFixture({ count: total, sites: "none" });
  const page = list(fixture, "?status=draft");
  const body = page.body as { listWindow: { siteTotal: number; visibleReturned: number }; items: unknown[] };
  const drafts = fixture.rows.filter((row) => row.status === "draft").length;
  assert.equal(body.listWindow.siteTotal, drafts, `total ${total}`);
  assert.equal(body.items.length, Math.min(100, drafts));
}

const many = new FaqLocalFixture({ count: 1500, sites: "single" });
const match = many.matchIds(new URL(`http://fixture.local/api/website-kompis/faq/match-ids?installId=${FIXTURE_SITE_A}`));
assert.equal(match.status, 200);
const matchBody = match.body as { ids: string[]; total: number };
assert.equal(matchBody.ids.length, matchBody.total);
assert.ok(matchBody.total > 100);
assert.equal(new Set(matchBody.ids).size, matchBody.ids.length);

const capped = new FaqLocalFixture({ count: 10001, sites: "none" });
const incomplete = capped.matchIds(new URL("http://fixture.local/api/website-kompis/faq/match-ids"));
assert.equal(incomplete.status, 409);
assert.equal((incomplete.body as { code: string }).code, "snapshot_incomplete");
assert.equal("ids" in incomplete.body, false);

const failedCount = new FaqLocalFixture({ count: 150, countFails: true });
const blocked = list(failedCount, "");
assert.equal((blocked.body as { listWindow: { selectAllSupported: boolean; siteTotal: number | null } }).listWindow.selectAllSupported, false);
assert.equal((blocked.body as { listWindow: { siteTotal: number | null } }).listWindow.siteTotal, null);
assert.equal(failedCount.matchIds(new URL("http://fixture.local/api/website-kompis/faq/match-ids")).status, 409);

const multi = new FaqLocalFixture({ count: 40, sites: "multi" });
const unselected = list(multi, "");
assert.equal((unselected.body as { siteContext: { requiresSiteSelection: boolean } }).siteContext.requiresSiteSelection, true);
const alpha = list(multi, `?installId=${FIXTURE_SITE_A}`);
const beta = list(multi, `?installId=${FIXTURE_SITE_B}`);
const alphaItems = (alpha.body as { items: Array<{ installId: string | null }> }).items;
assert.equal(alphaItems.some((item) => item.installId == null), false);
assert.equal(alphaItems.some((item) => item.installId === FIXTURE_SITE_B), false);
assert.ok((beta.body as { listWindow: { siteTotal: number } }).listWindow.siteTotal >= 0);
const single = new FaqLocalFixture({ count: 40, sites: "single" });
const withLegacy = list(single, `?installId=${FIXTURE_SITE_A}`);
assert.equal(
  (withLegacy.body as { items: Array<{ installId: string | null }> }).items.some((item) => item.installId == null),
  true,
);
assert.equal(list(single, "?installId=cccccccc-cccc-4ccc-8ccc-cccccccccccc").status, 400);

const viewer = new FaqLocalFixture({ count: 4, role: "viewer" });
const before = viewer.stats();
assert.equal(viewer.list(new URL("http://fixture.local/api/website-kompis/faq")).status, 403);
assert.equal(viewer.markPublicSafe({ confirm: true, installId: FIXTURE_SITE_A, itemIds: [viewer.rows[0]!.id] }).status, 403);
assert.equal(viewer.publish(viewer.rows[3]!.id).status, 403);
assert.deepEqual(viewer.stats(), before);

const review = new FaqLocalFixture({ count: 8 });
const safeDraft = review.rows.find((row) => row.title === "Synthetic question 7");
const sensitive = review.rows.find((row) => row.title === "Staff desk")!;
const published = review.rows.find((row) => row.status === "published")!;
assert.ok(safeDraft);
const marked = review.markPublicSafe({
  confirm: true,
  installId: FIXTURE_SITE_A,
  itemIds: [safeDraft!.id, sensitive.id, published.id],
});
assert.equal(marked.status, 200);
const markedBody = marked.body as { marked: string[]; manual: string[] };
assert.deepEqual(markedBody.marked, [safeDraft!.id]);
assert.deepEqual(markedBody.manual, [sensitive.id]);
assert.equal(safeDraft!.status, "draft");
assert.equal(safeDraft!.publicSafe, true);
assert.equal(sensitive.publicSafe, false);
assert.equal(published.status, "published");
assert.equal(review.markPublicSafe({ confirm: false, itemIds: [safeDraft!.id] }).status, 400);

const publishedNow = review.publish(safeDraft!.id);
assert.equal(publishedNow.status, 200);
assert.equal((publishedNow.body as { status: string }).status, "published");
assert.equal(review.publish(safeDraft!.id).status, 400);
assert.equal(review.publish(sensitive.id).status, 400);

const search = list(review, "?query=lighthouse");
assert.equal((search.body as { listWindow: { siteTotal: number } }).listWindow.siteTotal, 1);

function walk(dir: string, found: string[]) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next") continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, found);
    else if (/\.(ts|tsx)$/.test(name)) found.push(path);
  }
}

const roots = ["app", "components"].map((dir) => join(process.cwd(), dir));
const files: string[] = [];
for (const root of roots) walk(root, files);
for (const file of files) {
  assert.equal(readFileSync(file, "utf8").includes(AIPIFY_FAQ_LOCAL_FIXTURE_NOT_PRODUCTION), false, file);
}

console.log("local-fixture-api.test.ts: ok");
