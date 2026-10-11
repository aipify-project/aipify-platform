import assert from "node:assert/strict";
import {
  buildWebsiteKompisCopyPlainText,
  evaluateWebsiteKompisReuseCandidate,
  helpfulVoteIsCanonicalTruth,
  isValidWebsiteKompisAnswerFeedbackVote,
  sanitizeWebsiteKompisFeedbackComment,
  websiteKompisAnswerReuseEnabled,
  websiteKompisFeedbackAffectsAnswerReadPath,
  WEBSITE_KOMPIS_ANSWER_FEEDBACK_MAX_COMMENT,
} from "@/lib/marketing/website-kompis-answer-feedback";

assert.equal(websiteKompisAnswerReuseEnabled(), false);
assert.equal(websiteKompisFeedbackAffectsAnswerReadPath(), false);
assert.equal(helpfulVoteIsCanonicalTruth(), false);

assert.equal(isValidWebsiteKompisAnswerFeedbackVote("helpful"), true);
assert.equal(isValidWebsiteKompisAnswerFeedbackVote("not_helpful"), true);
assert.equal(isValidWebsiteKompisAnswerFeedbackVote("meh"), false);
assert.equal(sanitizeWebsiteKompisFeedbackComment("  ok  "), "ok");
assert.equal(sanitizeWebsiteKompisFeedbackComment("   "), null);
const long = "x".repeat(WEBSITE_KOMPIS_ANSWER_FEEDBACK_MAX_COMMENT + 40);
assert.equal(
  sanitizeWebsiteKompisFeedbackComment(long)?.length,
  WEBSITE_KOMPIS_ANSWER_FEEDBACK_MAX_COMMENT,
);

const text = buildWebsiteKompisCopyPlainText({
  answerText: "Membership includes profiles.",
  sources: [
    { title: "Membership", href: "https://example.com/membership" },
    { title: "FAQ", href: null },
  ],
});
assert.match(text, /Membership includes profiles/);
assert.match(text, /Sources:/);
assert.match(text, /- Membership: https:\/\/example\.com\/membership/);
assert.match(text, /- FAQ/);
assert.equal(text.includes("<"), false);

const reuse = evaluateWebsiteKompisReuseCandidate({
  sameTenant: true,
  sameInstall: true,
  localeMatches: true,
  topicMatches: true,
  sourcesStillPublished: true,
  sourceVersionsMatch: true,
  sourcesFresh: true,
  reusePolicyEnabled: true,
});
assert.equal(reuse.allowed, false);
assert.ok(reuse.reasons.includes("helpful_vote_not_sufficient"));

const stale = evaluateWebsiteKompisReuseCandidate({
  sameTenant: true,
  sameInstall: true,
  localeMatches: true,
  topicMatches: true,
  sourcesStillPublished: true,
  sourceVersionsMatch: false,
  sourcesFresh: false,
  reusePolicyEnabled: true,
});
assert.equal(stale.allowed, false);
assert.ok(stale.reasons.includes("source_version_changed"));
assert.ok(stale.reasons.includes("source_stale"));

console.log("website-kompis-answer-feedback.test.ts: all assertions passed");
