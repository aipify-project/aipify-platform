import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { FEEDBACK_REVIEW_CLOSE_READY, FEEDBACK_REVIEW_DISPOSITION_READY } from "@/lib/website-kompis-feedback/operations-model";
import {
  buildPublishedDispositionCall,
  buildRejectDispositionCall,
  buildReviewQueueRpcArgs,
  cursorFromQueuePage,
  isHistoryFeedback,
  isOpenNegativeReview,
  mapReviewQueueItem,
  retryFaqId,
  shouldRemoveReviewCard,
} from "@/lib/website-kompis-feedback/disposition";
import { runFeedbackDisposition, loadOpenReviewQueue } from "@/lib/website-kompis-feedback/disposition-server";

const root = process.cwd();
const faqId = "55555555-5555-4555-8555-555555555551";
const feedbackId = "66666666-6666-4666-8666-666666666661";
const installId = "33333333-3333-4333-8333-333333333333";

assert.equal(FEEDBACK_REVIEW_CLOSE_READY, false);
assert.equal(FEEDBACK_REVIEW_DISPOSITION_READY, false);

const published = buildPublishedDispositionCall({
  feedbackId,
  faqItemId: faqId,
  feedbackInstallId: installId,
  faqInstallId: installId,
  publishStatus: "published",
});
assert.equal(published.ok, true);
if (published.ok) {
  assert.equal(published.rpc, "complete_website_kompis_feedback_review_as_published");
  assert.deepEqual(published.args, {
    p_feedback_id: feedbackId,
    p_faq_item_id: faqId,
    p_confirmation: true,
  });
}

assert.equal(
  buildPublishedDispositionCall({
    feedbackId,
    faqItemId: faqId,
    feedbackInstallId: installId,
    faqInstallId: "44444444-4444-4444-8444-444444444444",
    publishStatus: "published",
  }).ok,
  false,
);
assert.equal(
  buildPublishedDispositionCall({
    feedbackId,
    faqItemId: faqId,
    feedbackInstallId: "",
    faqInstallId: installId,
    publishStatus: "draft",
  }).ok,
  false,
);
assert.equal(retryFaqId(faqId), faqId);
assert.equal(retryFaqId("not-an-id"), null);

const rejected = buildRejectDispositionCall(feedbackId);
assert.equal(rejected.ok, true);
if (rejected.ok) {
  assert.equal(rejected.rpc, "reject_website_kompis_feedback_review");
  assert.equal(rejected.args.p_confirmation, true);
  assert.equal("p_faq_item_id" in rejected.args, false);
}

assert.equal(shouldRemoveReviewCard({ httpOk: true, reviewDisposition: "published", expected: "published" }), true);
assert.equal(shouldRemoveReviewCard({ httpOk: false, reviewDisposition: "published", expected: "published" }), false);
assert.equal(shouldRemoveReviewCard({ httpOk: true, reviewDisposition: "open", expected: "rejected" }), false);

const cursor = buildReviewQueueRpcArgs({
  limit: 500,
  queue: "review",
  before: "2026-01-01T00:00:00.000Z",
  beforeId: "77777777-7777-4777-8777-777777777772",
});
assert.equal(cursor.ok, true);
if (cursor.ok) {
  assert.equal(cursor.args.p_limit, 100);
  assert.equal(cursor.args.p_before_id, "77777777-7777-4777-8777-777777777772");
}
assert.equal(buildReviewQueueRpcArgs({ limit: 10, queue: "review", before: "2026-01-01T00:00:00.000Z" }).ok, false);

const fullPage = Array.from({ length: 100 }, (_, index) => ({
  id: index === 99 ? "77777777-7777-4777-8777-777777777772" : "77777777-7777-4777-8777-777777777771",
  createdAt: "2026-01-01T00:00:00.000Z",
}));

const helpful = mapReviewQueueItem({
  id: feedbackId,
  created_at: "2026-01-02T00:00:00.000Z",
  vote: "helpful",
  review_disposition: "open",
  comment: "thanks",
  question_preview: "Question",
  answer_preview: "Answer",
});
assert.equal(helpful?.vote, "helpful");
assert.equal(helpful ? isOpenNegativeReview(helpful) : true, false);
assert.equal(helpful ? isHistoryFeedback(helpful) : false, true);
const rejectedHistory = mapReviewQueueItem({
  id: feedbackId,
  created_at: "2026-01-02T00:00:00.000Z",
  vote: "not_helpful",
  review_disposition: "rejected",
  published_faq_item_id: null,
  question_preview: "Question",
  answer_preview: "Original answer",
});
assert.equal(rejectedHistory?.reviewDisposition, "rejected");
assert.equal(rejectedHistory ? isOpenNegativeReview(rejectedHistory) : true, false);
assert.equal(rejectedHistory?.publishedFaqItemId ?? null, null);
const next = cursorFromQueuePage(fullPage);
assert.equal(next?.before, "2026-01-01T00:00:00.000Z");
assert.equal(next?.beforeId, "77777777-7777-4777-8777-777777777772");
assert.equal(cursorFromQueuePage(fullPage.slice(0, 9)), null);

async function main() {
const blockedCalls: unknown[] = [];
const blocked = await runFeedbackDisposition(
  { rpc: async () => { blockedCalls.push(true); return { data: null, error: null }; } } as never,
  { feedbackId, action: "rejected" },
  false,
);
assert.equal(blocked.status, 501);
assert.equal(blockedCalls.length, 0);

const calls: { name: string; args: unknown }[] = [];
const readyClient = {
  rpc: async (name: string, args: unknown) => {
    calls.push({ name, args });
    if (name === "get_website_kompis_feedback_review_queue") {
      const beforeId = (args as { p_before_id?: string | null }).p_before_id;
      if (!beforeId) {
        return {
          data: {
            open_review_count: 101,
            published_count: 0,
            rejected_count: 0,
            items: fullPage.map((item) => ({
              id: item.id,
              created_at: item.createdAt,
              vote: "not_helpful",
              review_disposition: "open",
              install_id: installId,
              comment: "needs help",
              question_preview: "Question",
              answer_preview: "Answer",
              page_pathname: "/pricing",
              locale: "no",
            })),
          },
          error: null,
        };
      }
      return {
        data: {
          items: [{
            id: feedbackId,
            created_at: "2025-12-01T00:00:00.000Z",
            vote: "not_helpful",
            review_disposition: "open",
            install_id: installId,
            question_preview: "Older question",
            answer_preview: "Older answer",
          }],
        },
        error: null,
      };
    }
    return { data: { review_disposition: "rejected" }, error: null };
  },
};
const rejectResult = await runFeedbackDisposition(readyClient as never, { feedbackId, action: "rejected" }, true);
assert.equal(rejectResult.status, 200);
assert.equal(rejectResult.body.reviewDisposition, "rejected");
const forbidden = await runFeedbackDisposition(
  { rpc: async () => ({ data: null, error: { code: "P0001", message: "owner or admin required" } }) } as never,
  { feedbackId, action: "rejected" },
  true,
);
assert.equal(forbidden.status, 403);
const queue = await loadOpenReviewQueue(readyClient as never, true);
assert.equal(queue.ok, true);
if (queue.ok) assert.equal(queue.items.length, 101);

const editor = fs.readFileSync(path.join(root, "components/app/website-kompis/WebsiteKompisFeedbackEditor.tsx"), "utf8");
assert.match(editor, /publishedReviewStillOpen/);
assert.match(editor, /presentReviewAfterFaqPublish/);
assert.doesNotMatch(editor, /onPublished/);
assert.match(editor, /retryFaqId/);
assert.equal((editor.match(/\/api\/website-kompis\/feedback\/\$\{row\.id\}\/disposition/g) ?? []).length, 2);
assert.doesNotMatch(editor, /DELETE FROM/);
assert.doesNotMatch(editor, /FEEDBACK_REVIEW_DISPOSITION_READY = true/);
assert.doesNotMatch(editor, /FEEDBACK_REVIEW_CLOSE_READY = true/);

const sql = fs.readFileSync(
  path.join(root, "docs/platform/NOT_APPLIED_website_kompis_feedback_review_disposition_queue_v2.sql"),
  "utf8",
);
assert.match(sql, /^-- NOT APPLIED/);
assert.match(sql, /jsonb_agg\(\s*row_to_json\(q\)::jsonb\s*order by q\.created_at desc, q\.id desc\s*\)/);
assert.match(sql, /order by f\.created_at desc, f\.id desc/);
assert.doesNotMatch(sql, /create or replace function public\.get_website_kompis_answer_feedback_overview/i);
assert.match(sql, /question_preview/);
assert.match(sql, /left\(r\.question, 180\)/);
assert.match(sql, /r\.tenant_id = f\.tenant_id/);
assert.match(sql, /complete_website_kompis_feedback_review_as_published/);
assert.match(sql, /reject_website_kompis_feedback_review/);
assert.doesNotMatch(sql, /close_website_kompis_answer_feedback_review/);
assert.doesNotMatch(sql, /review_status/);
assert.doesNotMatch(sql, /delete from public\.website_kompis_answer_feedback/i);

console.log("disposition.test.ts: ok");
}

main();
