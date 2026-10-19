import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  appendFeedbackRows,
  feedbackReviewCloseCapability,
  parseFeedbackReviewPage,
  reviewQueueAfterClose,
} from "@/lib/website-kompis-feedback/review-close";
import {
  FEEDBACK_REVIEW_CLOSE_READY,
  partitionFeedbackWorkspace,
  type FeedbackOpsRow,
} from "@/lib/website-kompis-feedback/operations-model";

const root = process.cwd();

function sha(relativePath: string): string {
  return createHash("sha256").update(fs.readFileSync(path.join(root, relativePath))).digest("hex");
}

assert.equal(
  sha("docs/platform/NOT_APPLIED_website_kompis_feedback_review_close_read_v1.sql"),
  "9320042fd5728f3dc83546dc453a7c715ee10c6447bc8aa23ac3502b398c01af",
);
assert.equal(
  sha("docs/platform/NOT_APPLIED_website_kompis_feedback_review_close_v1.sql"),
  "dd88a06aa55155d4e50d8d31a07355e07b3806ad7423fdccd1a2838eab77ed54",
);
assert.equal(
  sha("docs/platform/NOT_APPLIED_website_kompis_feedback_review_approval_v1.sql"),
  "4520d7ae7238c3ac35533c74b4d51132060b828821feb999e25766f409c401d0",
);

const pageSql = fs.readFileSync(
  path.join(root, "docs/platform/NOT_APPLIED_website_kompis_feedback_review_close_page_v1.sql"),
  "utf8",
);
assert.equal(
  sha("docs/platform/NOT_APPLIED_website_kompis_feedback_review_close_page_v1.sql"),
  "05269740bf701f558b4b347ecb658775425cd9a97fabb09e298f1fac6482d1b6",
);
assert.match(pageSql, /^-- NOT APPLIED/);
assert.match(pageSql, /security definer/);
assert.match(pageSql, /set search_path = public/);
assert.match(pageSql, /_wpkf_auth_tenant_id\(\)/);
assert.match(pageSql, /_wpkf_auth_is_owner_admin\(\)/);
assert.match(pageSql, /p_confirmation is not true/);
assert.match(pageSql, /not eligible/);
assert.match(pageSql, /vote = 'not_helpful'/);
assert.match(pageSql, /p_before/);
assert.match(pageSql, /review_page_ready/);
assert.match(pageSql, /tenant_id = v_tenant/);
assert.doesNotMatch(pageSql, /p_tenant/);
assert.doesNotMatch(pageSql, /'reviewed_by'/);
assert.doesNotMatch(pageSql, /grant execute[\s\S]*to anon/);
assert.doesNotMatch(pageSql, /delete from public\.website_kompis_answer_feedback/i);
assert.ok(pageSql.indexOf("v_row.review_status = 'closed'") < pageSql.indexOf("insert into public.website_kompis_answer_feedback_review_audit"));

assert.equal(FEEDBACK_REVIEW_CLOSE_READY, false);
assert.equal(feedbackReviewCloseCapability({}), false);
assert.equal(feedbackReviewCloseCapability({ reviewCloseReady: true }), false);
assert.equal(feedbackReviewCloseCapability({ reviewPageReady: true }), false);
assert.equal(
  feedbackReviewCloseCapability({ reviewCloseReady: true, reviewPageReady: true }),
  true,
);

const hidden = parseFeedbackReviewPage({
  rows: [{ id: "a", vote: "not_helpful", review_status: "open", created_at: "2026-01-01T00:00:00.000Z" }],
  has_more: true,
});
assert.equal(hidden?.hasMore, false);
assert.equal(hidden?.next, null);

const visible = parseFeedbackReviewPage({
  rows: [{ id: "a", vote: "not_helpful", review_status: "open", created_at: "2026-01-02T00:00:00.000Z" }],
  has_more: true,
  next_before: "2026-01-02T00:00:00.000Z",
  next_before_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
});
assert.equal(visible?.hasMore, true);
assert.equal(visible?.rows[0]?.reviewStatus, "open");

const row = (id: string, vote: FeedbackOpsRow["vote"], reviewStatus?: "open" | "closed"): FeedbackOpsRow => ({
  id,
  vote,
  comment: null,
  questionPreview: "Question",
  answerPreview: "Answer",
  pagePathname: null,
  locale: "no",
  createdAt: "2026-01-02T10:00:00.000Z",
  reviewStatus,
});

const openRows = [row("a", "not_helpful", "open"), row("b", "not_helpful", "open"), row("faq", "helpful")];
const failed = reviewQueueAfterClose(openRows, "a", "failed");
assert.equal(partitionFeedbackWorkspace(failed).review.length, 2);
const once = reviewQueueAfterClose(openRows, "a", "closed");
assert.deepEqual(partitionFeedbackWorkspace(once).review.map((item) => item.id), ["b"]);
assert.ok(partitionFeedbackWorkspace(once).history.some((item) => item.id === "a"));
const twice = reviewQueueAfterClose(once, "a", "closed");
assert.equal(partitionFeedbackWorkspace(twice).review.length, 1);
assert.equal(appendFeedbackRows(once, once).length, once.length);

const loaded = 100;
const total = 150;
const reachableWithoutContract = feedbackReviewCloseCapability({}) || loaded >= total;
assert.equal(reachableWithoutContract, false);

const panel = fs.readFileSync(
  path.join(root, "components/app/website-kompis/WebsiteKompisFeedbackOverviewPanel.tsx"),
  "utf8",
);
assert.match(panel, /reviewCloseReady === true/);
assert.doesNotMatch(panel, /closeReady=\{FEEDBACK_REVIEW_CLOSE_READY\}/);
const editor = fs.readFileSync(
  path.join(root, "components/app/website-kompis/WebsiteKompisFeedbackEditor.tsx"),
  "utf8",
);
assert.match(editor, /resolveFeedbackDrawerClose/);
assert.doesNotMatch(editor, /FEEDBACK_REVIEW_CLOSE_READY = true/);

console.log("review-close-activation.test.ts: ok");
