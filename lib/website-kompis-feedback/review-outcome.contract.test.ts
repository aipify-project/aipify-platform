import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { FEEDBACK_REVIEW_DISPOSITION_READY } from "@/lib/website-kompis-feedback/operations-model";
import {
  canLinkPublishedFaq,
  canMarkRetrievalUnresolved,
  canRejectOrDuplicate,
  draftSaveClosesReview,
  explicitBulkIds,
  followUpStaysOpen,
  queueAfterDisposition,
  reviewDispositionIsLive,
  type ReviewCaseScope,
  type ReviewFaqCandidate,
} from "@/lib/website-kompis-feedback/review-outcome";

const root = process.cwd();
const tenant = "11111111-1111-4111-8111-111111111111";
const otherTenant = "22222222-2222-4222-8222-222222222222";
const install = "33333333-3333-4333-8333-333333333333";
const otherInstall = "44444444-4444-4444-8444-444444444444";

const openCase: ReviewCaseScope = {
  tenantId: tenant,
  installId: install,
  locale: "no",
  vote: "not_helpful",
  disposition: "open",
};

const publishedFaq: ReviewFaqCandidate = {
  tenantId: tenant,
  installId: install,
  locale: "no",
  status: "published",
  publicSafe: true,
  surface: "public_faq",
};

assert.equal(FEEDBACK_REVIEW_DISPOSITION_READY, true);
assert.equal(reviewDispositionIsLive(), true);
assert.equal(draftSaveClosesReview(), false);

assert.equal(canLinkPublishedFaq(openCase, publishedFaq).ok, true);
assert.equal(
  canLinkPublishedFaq(openCase, { ...publishedFaq, status: "draft" }).ok,
  false,
);

function rejectedReason(
  decision: { ok: true } | { ok: false; reason: string },
): string {
  assert.equal(decision.ok, false);
  if (decision.ok) return "";
  return decision.reason;
}

assert.equal(
  rejectedReason(canLinkPublishedFaq(openCase, { ...publishedFaq, tenantId: otherTenant })),
  "tenant",
);
assert.equal(
  rejectedReason(canLinkPublishedFaq(openCase, { ...publishedFaq, installId: otherInstall })),
  "install",
);
assert.equal(
  rejectedReason(canLinkPublishedFaq(openCase, { ...publishedFaq, locale: "en" })),
  "locale",
);
assert.equal(
  rejectedReason(canLinkPublishedFaq(openCase, { ...publishedFaq, surface: "private_knowledge" })),
  "private",
);
assert.equal(
  rejectedReason(canLinkPublishedFaq(openCase, { ...publishedFaq, publicSafe: false })),
  "not_published",
);

const retrieval = canMarkRetrievalUnresolved(openCase, publishedFaq, "Søket fant ikke den publiserte FAQ-en");
assert.equal(retrieval.ok, true);
assert.equal(followUpStaysOpen("retrieval_unresolved"), true);
assert.equal(queueAfterDisposition("retrieval_unresolved"), "history");
assert.equal(rejectedReason(canMarkRetrievalUnresolved(openCase, publishedFaq, "no")), "reason");

assert.equal(canRejectOrDuplicate(openCase, "Spam uten spørsmål").ok, true);
assert.equal(canRejectOrDuplicate(openCase, "Duplikat av en lukket sak").ok, true);
assert.equal(
  rejectedReason(canRejectOrDuplicate({ ...openCase, vote: "helpful" }, "Spam uten spørsmål")),
  "not_open",
);
assert.equal(queueAfterDisposition("rejected"), "history");
assert.equal(queueAfterDisposition("duplicate"), "history");
assert.equal(queueAfterDisposition("open"), "review");
assert.equal(queueAfterDisposition("published"), "history");

const ids = Array.from({ length: 25 }, (_, index) =>
  `55555555-5555-4555-8555-${String(index + 1).padStart(12, "0")}`,
);
assert.equal(explicitBulkIds(ids).ok, true);
assert.equal(explicitBulkIds([...ids, "55555555-5555-4555-8555-000000000099"]).ok, false);
assert.equal(explicitBulkIds([]).ok, false);

const sqlPath = path.join(root, "docs/platform/NOT_APPLIED_website_kompis_feedback_review_disposition_v3.sql");
const sql = fs.readFileSync(sqlPath, "utf8");
assert.match(sql, /^-- NOT APPLIED/);
assert.match(sql, /review_disposition already exists/);
assert.match(sql, /faq locale mismatch/);
assert.match(sql, /public_safe is distinct from true/);
assert.match(sql, /follow_up_status', 'open'/);
assert.match(sql, /bulk_dispose_website_kompis_feedback_reviews/);
assert.match(sql, /v_count > 25/);
assert.match(sql, /p_disposition is distinct from 'rejected' and p_disposition is distinct from 'duplicate'/);
assert.doesNotMatch(sql, /delete from public\.website_kompis_answer_feedback/i);
assert.doesNotMatch(sql, /insert into public\.tenant_public_companion_faq_items/i);
assert.doesNotMatch(sql, /grant execute[\s\S]*to anon/i);
assert.equal(
  fs.existsSync(path.join(root, "supabase/migrations", path.basename(sqlPath))),
  false,
);

const operations = fs.readFileSync(
  path.join(root, "lib/website-kompis-feedback/operations-model.ts"),
  "utf8",
);
assert.match(operations, /FEEDBACK_REVIEW_DISPOSITION_READY = true/);
assert.match(operations, /FEEDBACK_REVIEW_CLOSE_READY = false/);

const editor = fs.readFileSync(
  path.join(root, "components/app/website-kompis/WebsiteKompisFeedbackEditor.tsx"),
  "utf8",
);
assert.doesNotMatch(editor, /FEEDBACK_REVIEW_DISPOSITION_READY = true/);

console.log("review-outcome.contract.test.ts: ok");
