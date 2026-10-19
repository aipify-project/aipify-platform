import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { feedbackReviewCloseCapability, interpretFeedbackCloseResponse } from "@/lib/website-kompis-feedback/review-close";
import {
  FEEDBACK_REVIEW_CLOSE_READY,
  OWNER_REVIEW_APPROVAL_SUPPORTED,
  canOfferFeedbackReviewClose,
  partitionFeedbackWorkspace,
  resolveFeedbackOpsStatus,
  type FeedbackOpsRow,
} from "@/lib/website-kompis-feedback/operations-model";

const root = process.cwd();
const locked = fs.readFileSync(
  path.join(root, "docs/platform/NOT_APPLIED_website_kompis_feedback_review_close_v1.sql"),
);
assert.equal(
  createHash("sha256").update(locked).digest("hex"),
  "dd88a06aa55155d4e50d8d31a07355e07b3806ad7423fdccd1a2838eab77ed54",
);

const revisedBytes = fs.readFileSync(
  path.join(root, "docs/platform/NOT_APPLIED_website_kompis_feedback_review_close_read_v1.sql"),
);
assert.equal(
  createHash("sha256").update(revisedBytes).digest("hex"),
  "9320042fd5728f3dc83546dc453a7c715ee10c6447bc8aa23ac3502b398c01af",
);
const revised = revisedBytes.toString("utf8");
assert.match(revised, /^-- NOT APPLIED/);
assert.match(revised, /security definer/);
assert.match(revised, /set search_path = public/);
assert.match(revised, /_wpkf_auth_tenant_id\(\)/);
assert.match(revised, /_wpkf_auth_is_owner_admin\(\)/);
assert.match(revised, /p_confirmation is not true/);
assert.match(revised, /needs_review/);
assert.doesNotMatch(revised, /grant execute[\s\S]*to anon/);
assert.doesNotMatch(revised, /delete from public.website_kompis_answer_feedback/i);

assert.equal(FEEDBACK_REVIEW_CLOSE_READY, false);
assert.equal(feedbackReviewCloseCapability({ reviewCloseReady: true }), false);
assert.equal(feedbackReviewCloseCapability({ reviewCloseReady: true, reviewPageReady: true }), true);
assert.equal(OWNER_REVIEW_APPROVAL_SUPPORTED, false);
assert.equal(
  canOfferFeedbackReviewClose({ vote: "not_helpful", reviewStatus: "open" }, false),
  false,
);
assert.equal(
  canOfferFeedbackReviewClose({ vote: "not_helpful", reviewStatus: "open" }, true),
  true,
);
assert.equal(
  canOfferFeedbackReviewClose({ vote: "not_helpful", reviewStatus: "closed" }, true),
  false,
);
assert.equal(canOfferFeedbackReviewClose({ vote: "helpful" }, true), false);

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

const workspace = partitionFeedbackWorkspace([
  row("open", "not_helpful", "open"),
  row("done", "not_helpful", "closed"),
  row("helpful", "helpful"),
]);
assert.deepEqual(workspace.review.map((item) => item.id), ["open"]);
assert.deepEqual(workspace.history.map((item) => item.id).sort(), ["done", "helpful"]);
assert.equal(resolveFeedbackOpsStatus(row("open", "not_helpful", "open")).key, "needsReview");
assert.equal(resolveFeedbackOpsStatus(row("done", "not_helpful", "closed")).tone, "slate");

assert.equal(interpretFeedbackCloseResponse({ httpStatus: 200, reviewStatus: "closed" }), "closed");
assert.equal(interpretFeedbackCloseResponse({ httpStatus: 200, reviewStatus: "open" }), "failed");
assert.equal(interpretFeedbackCloseResponse({ httpStatus: 501 }), "unavailable");
assert.equal(interpretFeedbackCloseResponse({ httpStatus: 403 }), "forbidden");
assert.equal(interpretFeedbackCloseResponse({ httpStatus: 404 }), "missing");
assert.equal(interpretFeedbackCloseResponse({ httpStatus: 409 }), "failed");

const editor = fs.readFileSync(
  path.join(root, "components/app/website-kompis/WebsiteKompisFeedbackEditor.tsx"),
  "utf8",
);
assert.match(editor, /canOfferFeedbackReviewClose/);
assert.match(editor, /resolveFeedbackDrawerClose/);
assert.doesNotMatch(editor, /FEEDBACK_REVIEW_CLOSE_READY = true/);
const panel = fs.readFileSync(
  path.join(root, "components/app/website-kompis/WebsiteKompisFeedbackOverviewPanel.tsx"),
  "utf8",
);
assert.match(panel, /canOfferFeedbackReviewClose/);
assert.match(panel, /#FFF4E5/);
assert.doesNotMatch(panel, /closeReady=\{FEEDBACK_REVIEW_CLOSE_READY\}/);

console.log("review-close.test.ts: ok");
