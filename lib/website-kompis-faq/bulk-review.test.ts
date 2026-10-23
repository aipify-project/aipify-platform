import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  authoritativeMatchAllowed,
  chunkFaqIds,
  faqLibraryWalk,
  faqLookupStop,
  planPublicSafeReview,
  selectionAfterPublicSafeReview,
} from "@/lib/website-kompis-faq/bulk-review";
import { faqCountContractMissing, faqCountSiteScope, parseFaqCountTotal } from "@/lib/website-kompis-faq/count-contract";
import { applyAuthoritativeFaqCount, buildFaqListWindow } from "@/lib/website-kompis-faq/list-window";

for (const total of [0, 1, 99, 100, 101, 1500, 3500]) {
  const pages = faqLibraryWalk(total, 100);
  const covered = pages.reduce((sum, page) => sum + page.returned, 0);
  assert.equal(covered, total, `walk ${total}`);
  assert.equal(pages.at(-1)?.hasMore, false);
  if (total > 100) assert.equal(pages[0]?.hasMore, true);
  if (total === 100) assert.equal(pages.length, 1);
  if (total === 101) assert.equal(pages.length, 2);
}

const drafts = [
  { id: "ready", status: "draft", publicSafe: false, title: "Hours", question: null, answer: "Open" },
  { id: "safe", status: "draft", publicSafe: true, title: "Map", question: null, answer: "Here" },
  { id: "private", status: "draft", publicSafe: false, title: "Staff", question: null, answer: "employee desk" },
  { id: "live", status: "published", publicSafe: true, title: "Live", question: null, answer: "Live" },
  { id: "old", status: "archived", publicSafe: false, title: "Old", question: null, answer: "Old" },
];
const plan = planPublicSafeReview(drafts, ["ready", "safe", "private", "live", "old", "missing", "ready"]);
assert.deepEqual(plan.readyIds, ["ready"]);
assert.deepEqual(plan.alreadySafeIds, ["safe"]);
assert.deepEqual(plan.manualIds, ["private"]);
assert.equal(plan.skipped.some((row) => row.id === "live" && row.reason === "not_draft"), true);
assert.equal(plan.skipped.some((row) => row.id === "old" && row.reason === "archived"), true);
assert.equal(plan.skipped.some((row) => row.id === "missing" && row.reason === "not_visible"), true);

assert.deepEqual(
  selectionAfterPublicSafeReview({
    selectedIds: ["ready", "private", "safe"],
    markedIds: ["ready"],
    alreadySafeIds: ["safe"],
  }),
  ["private"],
);

assert.equal(chunkFaqIds(Array.from({ length: 60 }, (_, index) => String(index))).length, 3);
assert.equal(chunkFaqIds(Array.from({ length: 60 }, (_, index) => String(index)))[2]?.length, 10);

assert.equal(authoritativeMatchAllowed({ countAvailable: false, reportedTotal: 10, collectedIds: 10 }), false);
assert.equal(authoritativeMatchAllowed({ countAvailable: true, reportedTotal: 3500, collectedIds: 3499 }), false);
assert.equal(authoritativeMatchAllowed({ countAvailable: true, reportedTotal: 3500, collectedIds: 3500 }), true);
assert.equal(
  faqLookupStop({ pageReturned: 500, pageSize: 500, pagesRead: 1, pageCap: 20, wanted: 25, foundWanted: 25 }),
  "complete",
);
assert.equal(
  faqLookupStop({ pageReturned: 500, pageSize: 500, pagesRead: 20, pageCap: 20, wanted: 1500, foundWanted: 400 }),
  "capped",
);
assert.equal(
  faqLookupStop({ pageReturned: 40, pageSize: 500, pagesRead: 2, pageCap: 20, wanted: 1500, foundWanted: 140 }),
  "complete",
);
assert.equal(authoritativeMatchAllowed({ countAvailable: true, reportedTotal: 1500, collectedIds: 400 }), false);

const window = buildFaqListWindow({ offset: 0, limit: 100, tenantReturned: 100, visibleReturned: 100 });
assert.equal(window.selectAllSupported, false);
assert.equal(window.countAvailable, false);
const counted = applyAuthoritativeFaqCount(window, 3500);
assert.equal(counted.selectAllSupported, true);
assert.equal(counted.siteTotal, 3500);
assert.equal(counted.totalState, "exact_filter");
assert.equal(applyAuthoritativeFaqCount(window, null).selectAllSupported, false);

assert.deepEqual(faqCountSiteScope("multi_site", "site-a"), { scope: "multi_site", installId: "site-a" });
assert.equal(faqCountSiteScope("multi_site", null), null);
assert.deepEqual(faqCountSiteScope("single_site", "site-a"), { scope: "single_site", installId: "site-a" });
assert.deepEqual(faqCountSiteScope("no_sites", null), { scope: "tenant", installId: null });
assert.equal(faqCountContractMissing({ code: "PGRST202", message: "missing" }), true);
assert.equal(faqCountContractMissing(null), false);
assert.equal(parseFaqCountTotal({ total: 1500 }), 1500);
assert.equal(parseFaqCountTotal({ total: -1 }), null);

const panel = readFileSync("components/app/website-kompis/WebsiteKompisFaqAdminPanel.tsx", "utf8");
assert.match(panel, /resetListScope\(\);\s*setSelectedInstallId/);
assert.match(panel, /status: statusFilter/);
assert.match(panel, /matchModeRef\.current \? null : pagePublishExplanation/);
assert.match(panel, /reviewBodySelection/);
assert.match(panel, /publishPendingBody/);
assert.match(panel, /labels\.listWindow\.reviewBusy/);
const dialog = readFileSync("components/app/website-kompis/WebsiteKompisFaqPublishDialog.tsx", "utf8");
assert.match(dialog, /acknowledgeRef\.current \?\? confirmRef\.current/);
assert.match(dialog, /busyLabel \?\? labels\.publishing/);
assert.match(panel, /selectedAcrossFilters/);
assert.match(panel, /matchModeRef\.current = false/);
const reviewRoute = readFileSync("app/api/website-kompis/faq/public-safe/route.ts", "utf8");
assert.match(reviewRoute, /p_status: lookup\.status/);
assert.doesNotMatch(reviewRoute, /p_status: null/);
const matchRoute = readFileSync("app/api/website-kompis/faq/match-ids/route.ts", "utf8");
assert.match(matchRoute, /snapshot_incomplete/);
assert.match(matchRoute, /authoritativeMatchAllowed/);

const sql = readFileSync("docs/platform/NOT_APPLIED_website_kompis_faq_list_count_v1.sql", "utf8");
assert.match(sql, /NOT APPLIED/);
assert.match(sql, /multi_site/);
assert.match(sql, /single_site/);
assert.doesNotMatch(sql, /delete from/i);
assert.equal(sql.includes("supabase/migrations"), false);

console.log("bulk-review.test.ts: ok");
