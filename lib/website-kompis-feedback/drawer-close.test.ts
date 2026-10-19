import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { existingPublishedFaqHref, resolveFeedbackDrawerClose } from "@/lib/website-kompis-feedback/drawer-close";
import {
  FEEDBACK_REVIEW_BADGE_CLASS,
  OWNER_REVIEW_APPROVAL_SUPPORTED,
} from "@/lib/website-kompis-feedback/operations-model";

assert.equal(resolveFeedbackDrawerClose({ dirty: false, confirmVisible: false }), "close");
assert.equal(resolveFeedbackDrawerClose({ dirty: true, confirmVisible: false }), "confirm");
assert.equal(resolveFeedbackDrawerClose({ dirty: true, confirmVisible: true }), "close");

const href = existingPublishedFaqHref(
  "/app/website-kompis/faq",
  "11111111-1111-4111-8111-111111111111",
  "Hva koster det?",
);
assert.match(href, /edit=11111111-1111-4111-8111-111111111111/);
assert.match(href, /query=Hva\+koster\+det%3F|query=Hva%20koster%20det%3F/);

assert.equal(OWNER_REVIEW_APPROVAL_SUPPORTED, false);
assert.match(FEEDBACK_REVIEW_BADGE_CLASS, /#FDECEC/);
assert.match(FEEDBACK_REVIEW_BADGE_CLASS, /#9F1239/);
assert.doesNotMatch(FEEDBACK_REVIEW_BADGE_CLASS, /#FFF4E5/);

const editor = fs.readFileSync(
  path.join(process.cwd(), "components/app/website-kompis/WebsiteKompisFeedbackEditor.tsx"),
  "utf8",
);
assert.match(editor, /resolveFeedbackDrawerClose/);
assert.match(editor, /existingPublishedFaqHref/);
assert.doesNotMatch(editor, /approve_website_kompis_answer_feedback/);
assert.doesNotMatch(editor, /Fjern fra gjennomgang/);
assert.match(editor, /data-feedback-drawer-confirm/);

const panel = fs.readFileSync(
  path.join(process.cwd(), "components/app/website-kompis/WebsiteKompisFeedbackOverviewPanel.tsx"),
  "utf8",
);
assert.match(panel, /FEEDBACK_REVIEW_BADGE_CLASS/);
assert.match(panel, /data-feedback-edit/);

console.log("drawer-close.test.ts: ok");
