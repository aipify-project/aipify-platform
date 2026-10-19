import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  canOfferRejectReview,
  interpretFaqWrite,
  interpretReviewDisposition,
  planFeedbackFaqWrite,
  reviewCloseIsBlocked,
  selectFaqMatchForSite,
} from "@/lib/website-kompis-feedback/publish-review";
import { normalizeFaqSourceUrl } from "@/lib/website-kompis-faq/source-url";

const siteA = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const siteB = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const faqId = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const draftId = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";

const published = {
  id: faqId,
  title: "Opening hours",
  locale: "no",
  status: "published",
  installId: siteA,
  sourceUrl: "https://example.com/hours",
};

assert.equal(normalizeFaqSourceUrl("  ").ok, true);
assert.equal(normalizeFaqSourceUrl("https://example.com/help").ok, true);
assert.equal(normalizeFaqSourceUrl("javascript:alert(1)").ok, false);
assert.equal(normalizeFaqSourceUrl("notaurl").ok, false);

const selected = selectFaqMatchForSite(
  [published, { ...published, id: draftId, status: "draft", installId: siteA }, { ...published, installId: siteB, id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee" }],
  { question: "Opening hours", locale: "NO", installId: siteA },
);
assert.equal(selected.kind, "published");
if (selected.kind === "published") {
  assert.equal(selected.id, faqId);
  assert.equal(selected.sourceUrl, "https://example.com/hours");
}
assert.equal(
  selectFaqMatchForSite([published], { question: "Opening hours", locale: "no", installId: siteB }).kind,
  "none",
);
assert.equal(
  selectFaqMatchForSite(
    Array.from({ length: 120 }, (_, index) => ({
      id: `00000000-0000-4000-8000-${String(index).padStart(12, "0")}`,
      title: `Other ${index}`,
      locale: "no",
      status: "published",
      installId: siteA,
    })).concat([published]),
    { question: "Opening hours", locale: "no", installId: siteA },
  ).kind,
  "published",
);

assert.deepEqual(planFeedbackFaqWrite({ existing: selected, saved: null }), {
  plan: "revise_published",
  itemId: faqId,
});
assert.deepEqual(
  interpretFaqWrite({
    plan: "revise_published",
    save: { ok: true, id: faqId, status: "published" },
    publish: null,
  }),
  { kind: "verified", id: faqId, mode: "revised" },
);
assert.equal(
  interpretFaqWrite({
    plan: "revise_published",
    save: { ok: true, id: faqId, status: "published" },
    publish: { ok: true, id: faqId, status: "published" },
  }).kind,
  "save_failed",
);

assert.deepEqual(
  interpretFaqWrite({
    plan: "publish_draft",
    save: { ok: true, id: draftId, status: "draft" },
    publish: { ok: true, id: draftId, status: "published" },
  }),
  { kind: "verified", id: draftId, mode: "published" },
);
assert.deepEqual(
  interpretFaqWrite({
    plan: "publish_draft",
    save: { ok: false },
    publish: null,
  }),
  { kind: "save_failed" },
);
assert.deepEqual(
  interpretFaqWrite({
    plan: "publish_draft",
    save: { ok: true, id: draftId, status: "draft" },
    publish: { ok: false },
  }),
  { kind: "publish_failed", id: draftId },
);

assert.equal(
  interpretReviewDisposition({ httpStatus: 501, code: "disposition_unavailable", expected: "published" }),
  "unavailable",
);
assert.equal(
  interpretReviewDisposition({ httpStatus: 200, reviewDisposition: "published", expected: "published" }),
  "completed",
);
assert.equal(
  interpretReviewDisposition({ httpStatus: 409, expected: "published" }),
  "still_open",
);
assert.equal(
  interpretReviewDisposition({ httpStatus: 501, expected: "rejected" }),
  "unavailable",
);
assert.equal(canOfferRejectReview({ vote: "helpful", reviewStatus: "open" }), false);
assert.equal(canOfferRejectReview({ vote: "not_helpful", reviewStatus: "closed" }), false);
assert.equal(canOfferRejectReview({ vote: "not_helpful", reviewDisposition: "open" }), true);
assert.equal(reviewCloseIsBlocked(false), true);
assert.equal(reviewCloseIsBlocked(true), false);

const root = process.cwd();
const editor = fs.readFileSync(
  path.join(root, "components/app/website-kompis/WebsiteKompisFeedbackEditor.tsx"),
  "utf8",
);
const closeRoute = fs.readFileSync(
  path.join(root, "app/api/website-kompis/feedback/[id]/close/route.ts"),
  "utf8",
);
assert.match(editor, /planFeedbackFaqWrite/);
assert.match(editor, /sourceUrl/);
assert.match(editor, /role="alert"/);
assert.match(editor, /completeReview/);
assert.doesNotMatch(editor, /onPublished\(/);
assert.doesNotMatch(editor, /DELETE FROM/);
assert.match(closeRoute, /reviewCloseIsBlocked\(FEEDBACK_REVIEW_CLOSE_READY\)/);
assert.match(closeRoute, /review_close_unavailable/);
const rpcAt = closeRoute.indexOf("close_website_kompis_answer_feedback_review");
const gateAt = closeRoute.indexOf("reviewCloseIsBlocked");
assert.ok(gateAt > -1 && rpcAt > gateAt);

console.log("publish-review.test.ts: ok");
