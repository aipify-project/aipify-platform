import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { existingPublishedFaqHref } from "@/lib/website-kompis-feedback/drawer-close";
import {
  FEEDBACK_REVIEW_CLOSE_READY,
  FEEDBACK_REVIEW_DISPOSITION_READY,
  resolveFeedbackOpsStatus,
  type FeedbackOpsRow,
} from "@/lib/website-kompis-feedback/operations-model";
import {
  buildFeedbackFaqWriteBody,
  feedbackFaqWriteAllowed,
  normalizeFeedbackFaqSourceUrl,
  presentDispositionFailure,
  presentReviewAfterFaqPublish,
  removalStatusWhileDispositionOff,
  selectFaqMatchForInstall,
  sourceUrlMatchesPersisted,
} from "@/lib/website-kompis-feedback/ui-truth";

const installA = "cccccccc-cccc-4ccc-8ccc-ccccccccccc1";
const installB = "dddddddd-dddd-4ddd-8ddd-ddddddddddd1";
const publishedId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1";
const draftId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1";

const items = [
  {
    id: publishedId,
    title: "Hours",
    locale: "no",
    status: "published",
    installId: installA,
    sourceUrl: "https://customer.example/hours",
  },
  {
    id: draftId,
    title: "Hours",
    locale: "en",
    status: "draft",
    installId: installA,
    sourceUrl: null,
  },
  {
    id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee1",
    title: "Hours",
    locale: "no",
    status: "published",
    installId: installB,
    sourceUrl: "https://other.example/hours",
  },
];

const sameSite = selectFaqMatchForInstall(items, {
  question: "Hours",
  locale: "NO",
  installId: installA,
});
assert.deepEqual(sameSite, { kind: "published", id: publishedId });
assert.equal(feedbackFaqWriteAllowed(sameSite, null), false);
assert.equal(
  existingPublishedFaqHref("/app/website-kompis/faq", publishedId, "Hours").includes(`edit=${publishedId}`),
  true,
);

const otherSite = selectFaqMatchForInstall(items, {
  question: "Hours",
  locale: "no",
  installId: installB,
});
assert.equal(otherSite.kind, "published");
assert.notEqual(otherSite.kind === "published" ? otherSite.id : "", publishedId);

const otherLanguage = selectFaqMatchForInstall(items, {
  question: "Hours",
  locale: "en",
  installId: installA,
});
assert.deepEqual(otherLanguage, { kind: "draft", id: draftId });
assert.equal(feedbackFaqWriteAllowed(otherLanguage, null), true);

assert.equal(feedbackFaqWriteAllowed("lookup_failed", null), false);
assert.equal(feedbackFaqWriteAllowed(sameSite, publishedId), true);

const blocked = presentReviewAfterFaqPublish({ dispositionReady: false });
assert.equal(blocked.faqPublishState, "published");
assert.equal(blocked.reviewDispositionState, "unavailable");
assert.equal(blocked.removeReviewCard, false);
assert.equal(blocked.closeDrawer, false);
assert.equal(blocked.notice, "faq_published_review_open");

const failedRpc = presentReviewAfterFaqPublish({
  dispositionReady: true,
  dispositionHttpStatus: 501,
  dispositionCode: "disposition_unavailable",
});
assert.equal(failedRpc.removeReviewCard, false);
assert.equal(failedRpc.closeDrawer, false);
assert.equal(failedRpc.notice, "faq_published_review_open");

const completed = presentReviewAfterFaqPublish({
  dispositionReady: true,
  dispositionHttpStatus: 200,
  reviewDisposition: "published",
});
assert.equal(completed.reviewDispositionState, "completed");
assert.equal(completed.removeReviewCard, true);
assert.equal(completed.closeDrawer, true);

assert.equal(
  presentDispositionFailure({
    httpOk: false,
    httpStatus: 501,
    code: "disposition_unavailable",
    expected: "published",
  }),
  "unavailable",
);
assert.equal(
  presentDispositionFailure({ httpOk: false, httpStatus: 403, code: "forbidden", expected: "rejected" }),
  "forbidden",
);
assert.equal(
  presentDispositionFailure({ httpOk: false, httpStatus: 409, code: "not_eligible", expected: "duplicate" }),
  "still_open",
);
assert.equal(
  presentDispositionFailure({
    httpOk: true,
    httpStatus: 200,
    reviewDisposition: "published",
    expected: "published",
  }),
  null,
);

const stillOpen = presentReviewAfterFaqPublish({
  dispositionReady: true,
  dispositionHttpStatus: 409,
  reviewDisposition: "open",
});
assert.equal(stillOpen.removeReviewCard, false);
assert.equal(stillOpen.reviewDispositionState, "still_open");

assert.equal(
  removalStatusWhileDispositionOff({
    dispositionReady: false,
    vote: "not_helpful",
    reviewDisposition: "open",
    reviewStatus: "open",
  }),
  "explain_unavailable",
);
assert.equal(
  removalStatusWhileDispositionOff({
    dispositionReady: true,
    vote: "not_helpful",
    reviewStatus: "open",
  }),
  "hidden",
);
assert.equal(
  removalStatusWhileDispositionOff({
    dispositionReady: false,
    vote: "helpful",
  }),
  "hidden",
);

const body = buildFeedbackFaqWriteBody({
  itemId: null,
  installId: installA,
  locale: "no",
  question: "Hours",
  answer: "Nine to five",
  category: "",
  publicSafe: true,
  sourceUrl: "  https://customer.example/hours  ",
  validFrom: null,
  validUntil: null,
});
assert.equal(body.sourceUrl, "https://customer.example/hours");
assert.equal(body.contentType, "faq");
assert.equal(normalizeFeedbackFaqSourceUrl("   "), null);
assert.equal(sourceUrlMatchesPersisted(body.sourceUrl, "https://customer.example/hours"), true);
assert.equal(sourceUrlMatchesPersisted(body.sourceUrl, null), false);
assert.equal(sourceUrlMatchesPersisted(null, null), true);

const helpful: FeedbackOpsRow = {
  id: "1",
  vote: "helpful",
  comment: "thanks",
  questionPreview: "Hours",
  answerPreview: "Nine",
  pagePathname: "/hours",
  locale: "no",
  createdAt: "2026-01-01T00:00:00.000Z",
};
assert.equal(resolveFeedbackOpsStatus(helpful).key, "awaitingControl");
assert.equal(resolveFeedbackOpsStatus(helpful).tone, "amber");
assert.notEqual(resolveFeedbackOpsStatus(helpful).tone, "emerald");

const negative: FeedbackOpsRow = { ...helpful, id: "2", vote: "not_helpful", comment: null };
assert.equal(resolveFeedbackOpsStatus(negative).key, "needsReview");

const publishedRow: FeedbackOpsRow = { ...helpful, reviewDisposition: "published" };
assert.equal(resolveFeedbackOpsStatus(publishedRow).key, "published");
assert.equal(resolveFeedbackOpsStatus(publishedRow).tone, "emerald");

assert.equal(FEEDBACK_REVIEW_DISPOSITION_READY, true);
assert.equal(FEEDBACK_REVIEW_CLOSE_READY, false);

const root = process.cwd();
const editor = fs.readFileSync(
  path.join(root, "components/app/website-kompis/WebsiteKompisFeedbackEditor.tsx"),
  "utf8",
);
const panel = fs.readFileSync(
  path.join(root, "components/app/website-kompis/WebsiteKompisFeedbackOverviewPanel.tsx"),
  "utf8",
);
const closeRoute = fs.readFileSync(
  path.join(root, "app/api/website-kompis/feedback/[id]/close/route.ts"),
  "utf8",
);
assert.equal(editor.includes("onPublished"), false);
assert.equal(panel.includes("setFilterParam(\"view\", \"published\")"), false);
assert.equal(/ready:\s*true/.test(closeRoute), false);
assert.equal(closeRoute.includes("process.env"), false);

console.log("ui-truth.test.ts: ok");
