/**
 * Job 64 — Kompis Web questions/feedback/knowledge operations (APP presentation).
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  FEEDBACK_OPS_UNSUPPORTED_WITHOUT_MIGRATION,
  WEBSITE_KOMPIS_FEEDBACK_FIELD_MATRIX,
  buildFaqSuggestHref,
  FEEDBACK_REVIEW_PAGE_SIZE,
  OWNER_REVIEW_APPROVAL_SUPPORTED,
  filterFeedbackOpsRows,
  nextActionsForFeedbackRow,
  partitionFeedbackWorkspace,
  resolveFeedbackOpsStatus,
  selectKnowledgeGapCandidates,
  takeFeedbackPage,
  type FeedbackOpsRow,
} from "@/lib/website-kompis-feedback/operations-model";
import { buildWebsiteKompisFeedbackLabels } from "@/lib/website-kompis-feedback/labels";

const ROOT = process.cwd();

function read(rel: string) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

const sample: FeedbackOpsRow[] = [
  {
    id: "1",
    vote: "helpful",
    comment: null,
    questionPreview: "How do I reset?",
    answerPreview: "Use settings…",
    pagePathname: "/help",
    locale: "en",
    createdAt: "2026-01-02T10:00:00.000Z",
  },
  {
    id: "2",
    vote: "not_helpful",
    comment: "Wrong price",
    questionPreview: "What does it cost?",
    answerPreview: "Contact us…",
    pagePathname: "/pricing",
    locale: "no",
    createdAt: "2026-01-03T10:00:00.000Z",
  },
  {
    id: "3",
    vote: "not_helpful",
    comment: null,
    questionPreview: "Opening hours?",
    answerPreview: "See contact…",
    pagePathname: "/contact",
    locale: "no",
    createdAt: "2026-01-01T10:00:00.000Z",
  },
];

assert.equal(resolveFeedbackOpsStatus(sample[0]!).key, "helpful");
assert.equal(resolveFeedbackOpsStatus(sample[1]!).tone, "amber");

const filtered = filterFeedbackOpsRows(sample, {
  vote: "not_helpful",
  comment: "with_comment",
  query: "cost",
  locale: "no",
  page: "pricing",
});
assert.equal(filtered.length, 1);
assert.equal(filtered[0]!.id, "2");

const gaps = selectKnowledgeGapCandidates(sample);
assert.equal(gaps[0]!.id, "2");
assert.ok(gaps.every((g) => g.vote === "not_helpful"));

const workspace = partitionFeedbackWorkspace(sample);
assert.deepEqual(workspace.review.map((row) => row.id), ["2", "3"]);
assert.deepEqual(workspace.history.map((row) => row.id), ["1"]);
assert.equal(OWNER_REVIEW_APPROVAL_SUPPORTED, false);

const hundredHelpful = Array.from({ length: 100 }, (_, index) => ({
  id: `h-${index}`,
  vote: "helpful" as const,
  comment: index % 2 === 0 ? "thanks" : null,
  questionPreview: `Question ${index}`,
  answerPreview: `Answer ${index}`,
  pagePathname: "/help",
  locale: "en",
  createdAt: `2026-02-${String((index % 27) + 1).padStart(2, "0")}T10:00:00.000Z`,
}));
const helpfulOnly = partitionFeedbackWorkspace(hundredHelpful);
assert.equal(helpfulOnly.review.length, 0);
assert.equal(helpfulOnly.history.length, 100);
const firstPage = takeFeedbackPage(helpfulOnly.history, FEEDBACK_REVIEW_PAGE_SIZE);
assert.equal(firstPage.items.length, FEEDBACK_REVIEW_PAGE_SIZE);
assert.equal(firstPage.hasMore, true);

const dated = filterFeedbackOpsRows(sample, {
  vote: "all",
  comment: "all",
  query: "",
  locale: "",
  page: "",
  dateFrom: "2026-01-03",
  dateTo: "2026-01-03",
});
assert.deepEqual(dated.map((row) => row.id), ["2"]);

const href = buildFaqSuggestHref({
  questionPreview: "What does it cost?",
  locale: "no",
});
assert.match(href, /\/app\/website-kompis\/faq\?/);
assert.match(href, /suggestQuestion=/);
assert.match(href, /fromFeedback=1/);

const actions = nextActionsForFeedbackRow(sample[1]!);
assert.ok(actions.some((a) => a.key === "suggestFaqDraft" && a.href));

assert.ok(WEBSITE_KOMPIS_FEEDBACK_FIELD_MATRIX.some((f) => f.field === "visitor_key_hash" && !f.ownerVisible));
assert.ok(WEBSITE_KOMPIS_FEEDBACK_FIELD_MATRIX.some((f) => f.field === "sources" && !f.ownerVisible));
assert.ok(FEEDBACK_OPS_UNSUPPORTED_WITHOUT_MIGRATION.includes("full_answer_and_sources_detail_rpc"));

const labels = buildWebsiteKompisFeedbackLabels((key) => key);
assert.equal(labels.negativeNotAutoChange, "customerApp.websiteKompisFeedback.negativeNotAutoChange");
assert.equal(labels.actions.suggestFaqDraft, "customerApp.websiteKompisFeedback.actions.suggestFaqDraft");

// Locale parity for new keys
for (const loc of ["en", "no", "sv", "da", "pl", "uk"]) {
  const json = JSON.parse(read(`locales/${loc}/customer-app/core.json`)) as {
    websiteKompisFeedback: Record<string, unknown>;
  };
  assert.ok(json.websiteKompisFeedback.negativeNotAutoChange, loc);
  assert.ok((json.websiteKompisFeedback.actions as Record<string, string>).suggestFaqDraft, loc);
  assert.ok((json.websiteKompisFeedback.totals as Record<string, string>).needsReview, loc);
}

// Panel + FAQ suggest wiring
assert.match(read("components/app/website-kompis/WebsiteKompisFeedbackOverviewPanel.tsx"), /selectKnowledgeGapCandidates/);
assert.match(read("components/app/website-kompis/WebsiteKompisFeedbackOverviewPanel.tsx"), /role="tablist"/);
assert.match(read("components/app/website-kompis/WebsiteKompisFeedbackEditor.tsx"), /createPortal/);
assert.match(read("components/app/website-kompis/WebsiteKompisFeedbackEditor.tsx"), /Lagre FAQ-utkast|quality.saveDraft/);
assert.doesNotMatch(read("components/app/website-kompis/WebsiteKompisFeedbackOverviewPanel.tsx"), /Godkjenn svar/);
assert.doesNotMatch(
  read("components/app/website-kompis/WebsiteKompisFeedbackEditor.tsx"),
  /record_website_kompis_answer_feedback/,
);
assert.match(read("components/app/website-kompis/WebsiteKompisFaqAdminPanel.tsx"), /suggestQuestion/);
assert.match(read("app/app/website-kompis/page.tsx"), /getWebsiteKompisAnswerFeedbackOverview/);

// No automatic FAQ/Core mutation from feedback panel
assert.doesNotMatch(
  read("components/app/website-kompis/WebsiteKompisFeedbackOverviewPanel.tsx"),
  /fetch\("\/api\/website-kompis\/faq"/,
);

// Frozen Website Kompis hashes
const manifest = JSON.parse(
  read("docs/integrations/website-kompis-public-chain-frozen-manifest.json")
) as { protectedRuntimeFiles: Array<{ path: string; sha256: string }> };
for (const entry of manifest.protectedRuntimeFiles) {
  const actual = createHash("sha256").update(read(entry.path)).digest("hex");
  assert.equal(actual, entry.sha256, `frozen hash mismatch: ${entry.path}`);
}

const webNav = read("lib/app-portal/nav-config.ts");
assert.doesNotMatch(webNav, /KOMPIS_WEB_FLAT_NAV[\s\S]*?"\/app\/kompis"/);

console.log("operations-model-64.test.ts: all assertions passed");
