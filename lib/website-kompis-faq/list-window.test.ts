import assert from "node:assert/strict";
import {
  FAQ_GLOBAL_MATCH_SELECT_SUPPORTED,
  FAQ_LIST_PAGE_SIZE,
  buildFaqListWindow,
  planVisibleDraftPublish,
  pruneSelectionToVisible,
  selectionAfterVisiblePublish,
  summarizeVisiblePublish,
  visiblePublishBlock,
  visibleRowRange,
} from "@/lib/website-kompis-faq/list-window";

assert.equal(FAQ_GLOBAL_MATCH_SELECT_SUPPORTED, false);
assert.equal(FAQ_LIST_PAGE_SIZE, 100);

function pagesFor(total: number) {
  const pages = [];
  let offset = 0;
  const seen = new Set<string>();
  do {
    const tenantReturned = Math.min(FAQ_LIST_PAGE_SIZE, Math.max(0, total - offset));
    const window = buildFaqListWindow({
      offset,
      limit: FAQ_LIST_PAGE_SIZE,
      tenantReturned,
      visibleReturned: tenantReturned,
    });
    const range = visibleRowRange(window);
    if (tenantReturned > 0) {
      for (let index = range.from; index <= range.to; index += 1) {
        const key = String(index);
        assert.equal(seen.has(key), false, `duplicate row ${key} of ${total}`);
        seen.add(key);
      }
    }
    pages.push(window);
    if (!window.hasMore) break;
    offset += FAQ_LIST_PAGE_SIZE;
  } while (offset < total + FAQ_LIST_PAGE_SIZE);
  return { pages, seen };
}

for (const total of [0, 1, 99, 100, 101, 1500, 3500]) {
  const { pages, seen } = pagesFor(total);
  assert.equal(seen.size, total, `coverage ${total}`);
  const last = pages.at(-1)!;
  assert.equal(last.totalState, "exact_tenant");
  assert.equal(last.tenantTotal, total);
  if (total > FAQ_LIST_PAGE_SIZE) {
    assert.equal(pages[0]!.totalState, "at_least_tenant");
    assert.equal(pages[0]!.tenantTotal, null);
    assert.equal(pages[0]!.tenantMinimum, FAQ_LIST_PAGE_SIZE);
    assert.equal(pages[0]!.hasMore, true);
  }
  if (total === 100) {
    assert.equal(pages.length, 2);
    assert.equal(pages[1]!.tenantReturned, 0);
    assert.equal(pages[1]!.tenantTotal, 100);
  }
}

const filtered = buildFaqListWindow({
  offset: 0,
  limit: 100,
  tenantReturned: 100,
  visibleReturned: 37,
});
assert.equal(filtered.totalState, "at_least_tenant");
assert.equal(filtered.tenantTotal, null);
assert.equal(filtered.siteTotal, null);
assert.deepEqual(visibleRowRange(filtered), { from: 1, to: 37 });

const completeSite = buildFaqListWindow({
  offset: 0,
  limit: 100,
  tenantReturned: 40,
  visibleReturned: 12,
});
assert.equal(completeSite.tenantTotal, 40);
assert.equal(completeSite.siteTotal, 12);

const visible = ["a", "b", "c"];
assert.deepEqual(pruneSelectionToVisible(["b", "z", "a"], visible), ["b", "a"]);

const plan = planVisibleDraftPublish(
  [
    { id: "ready", status: "draft", publicSafe: true },
    { id: "unsafe", status: "draft", publicSafe: false },
    { id: "live", status: "published", publicSafe: true },
    { id: "other-page", status: "draft", publicSafe: true },
  ].filter((item) => item.id !== "other-page"),
  ["ready", "unsafe", "live", "other-page", "ready"],
);
assert.deepEqual(plan.readyIds, ["ready"]);
assert.deepEqual(
  plan.skipped.map((row) => row.reason),
  ["not_public_safe", "not_draft", "not_visible"],
);

const publishedPage = Array.from({ length: 100 }, (_, index) => ({
  id: `published-${index}`,
  status: "published",
  publicSafe: true,
}));
const publishedSelection = publishedPage.map((item) => item.id);
const publishedSummary = summarizeVisiblePublish(publishedPage, publishedSelection);
assert.equal(publishedSummary.selected, 100);
assert.equal(publishedSummary.ready, 0);
assert.equal(publishedSummary.published, 100);
assert.equal(visiblePublishBlock(publishedSummary), "already_published");
assert.deepEqual(planVisibleDraftPublish(publishedPage, publishedSelection).readyIds, []);

assert.equal(visiblePublishBlock(summarizeVisiblePublish([], [])), "none_selected");

const oneReady = summarizeVisiblePublish(
  [{ id: "only", status: "draft", publicSafe: true }],
  ["only"],
);
assert.equal(oneReady.ready, 1);
assert.equal(visiblePublishBlock(oneReady), "ready");

const mixed = summarizeVisiblePublish(
  [
    ...Array.from({ length: 99 }, (_, index) => ({
      id: `live-${index}`,
      status: "published",
      publicSafe: true,
    })),
    { id: "draft-ready", status: "draft", publicSafe: true },
  ],
  [
    ...Array.from({ length: 99 }, (_, index) => `live-${index}`),
    "draft-ready",
  ],
);
assert.equal(mixed.selected, 100);
assert.equal(mixed.ready, 1);
assert.equal(mixed.published, 99);
assert.equal(visiblePublishBlock(mixed), "ready");

const overPage = summarizeVisiblePublish(publishedPage, [...publishedSelection, "off-page"]);
assert.equal(overPage.selected, 101);
assert.equal(overPage.published, 100);
assert.equal(overPage.notVisible, 1);
assert.equal(visiblePublishBlock(overPage), "none_ready");

const blockedDraft = summarizeVisiblePublish(
  [
    { id: "unsafe", status: "draft", publicSafe: false },
    { id: "archived", status: "archived", publicSafe: true },
  ],
  ["unsafe", "archived"],
);
assert.equal(blockedDraft.draftNotReady, 1);
assert.equal(blockedDraft.archived, 1);
assert.equal(visiblePublishBlock(blockedDraft), "none_ready");

assert.deepEqual(selectionAfterVisiblePublish(["failed-1"]), ["failed-1"]);
assert.deepEqual(selectionAfterVisiblePublish([]), []);

console.log("list-window.test.ts: ok");
