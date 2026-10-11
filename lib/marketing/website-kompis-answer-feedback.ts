/**
 * Website Kompis public answer feedback + copy helpers (Core).
 * Persistence RPCs are optional until migration is applied — UI must fail closed.
 */

export const WEBSITE_KOMPIS_ANSWER_FEEDBACK_VOTES = ["helpful", "not_helpful"] as const;
export type WebsiteKompisAnswerFeedbackVote =
  (typeof WEBSITE_KOMPIS_ANSWER_FEEDBACK_VOTES)[number];

export const WEBSITE_KOMPIS_ANSWER_FEEDBACK_MAX_COMMENT = 500;
export const WEBSITE_KOMPIS_ANSWER_FEEDBACK_MAX_QUESTION = 2000;
export const WEBSITE_KOMPIS_ANSWER_FEEDBACK_MAX_ANSWER = 4000;

export const CREATE_WEBSITE_KOMPIS_ANSWER_RECEIPT_RPC =
  "create_website_kompis_answer_receipt" as const;
export const RECORD_WEBSITE_KOMPIS_ANSWER_FEEDBACK_RPC =
  "record_website_kompis_answer_feedback" as const;
export const GET_WEBSITE_KOMPIS_ANSWER_FEEDBACK_OVERVIEW_RPC =
  "get_website_kompis_answer_feedback_overview" as const;

/** Reuse of voted answers stays OFF until source-control gates are applied separately. */
export function websiteKompisAnswerReuseEnabled(): boolean {
  return false;
}

export function websiteKompisFeedbackAffectsAnswerReadPath(): boolean {
  return false;
}

export function helpfulVoteIsCanonicalTruth(): boolean {
  return false;
}

export function isValidWebsiteKompisAnswerFeedbackVote(
  value: unknown,
): value is WebsiteKompisAnswerFeedbackVote {
  return (
    typeof value === "string" &&
    (WEBSITE_KOMPIS_ANSWER_FEEDBACK_VOTES as readonly string[]).includes(value)
  );
}

export function sanitizeWebsiteKompisFeedbackComment(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.replace(/\u0000/g, "").trim();
  if (!trimmed) return null;
  return trimmed.slice(0, WEBSITE_KOMPIS_ANSWER_FEEDBACK_MAX_COMMENT);
}

export function buildWebsiteKompisCopyPlainText(input: {
  answerText: string;
  sources?: Array<{ title: string; href?: string | null }>;
}): string {
  const lines = [input.answerText.trim()].filter(Boolean);
  const sources = (input.sources ?? []).filter(
    (source) => source.title.trim() || (source.href && source.href.trim()),
  );
  if (sources.length > 0) {
    lines.push("");
    lines.push("Sources:");
    for (const source of sources) {
      const title = source.title.trim() || "Source";
      const href = typeof source.href === "string" ? source.href.trim() : "";
      lines.push(href ? `- ${title}: ${href}` : `- ${title}`);
    }
  }
  return lines.join("\n").trim();
}

export async function copyWebsiteKompisAnswerText(text: string): Promise<
  | { ok: true }
  | { ok: false; reason: "empty" | "clipboard_unavailable" | "clipboard_failed" }
> {
  const payload = text.trim();
  if (!payload) return { ok: false, reason: "empty" };
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    return { ok: false, reason: "clipboard_unavailable" };
  }
  try {
    await navigator.clipboard.writeText(payload);
    return { ok: true };
  } catch {
    return { ok: false, reason: "clipboard_failed" };
  }
}

/** Optional fields attached to public ask responses for feedback binding. */
export type WebsiteKompisAskFeedbackFields = {
  answerId?: string | null;
  feedbackPersistenceReady?: boolean;
};

export type WebsiteKompisAnswerSourceSnapshot = {
  title: string;
  route: string;
};

export type WebsiteKompisAnswerReceiptInput = {
  installId: string;
  domain: string;
  locale: string;
  question: string;
  answerText: string;
  sources: WebsiteKompisAnswerSourceSnapshot[];
  sourceVersionRefs?: Array<{ kind: string; id: string; version?: string | null }>;
  pagePathname?: string | null;
};

export function clipWebsiteKompisFeedbackSnapshot(text: string, max: number): string {
  return text.replace(/\s+/g, " ").trim().slice(0, max);
}

/**
 * Candidate reuse gate — always false for V1; documents required checks for later.
 */
export function evaluateWebsiteKompisReuseCandidate(input: {
  sameTenant: boolean;
  sameInstall: boolean;
  localeMatches: boolean;
  topicMatches: boolean;
  sourcesStillPublished: boolean;
  sourceVersionsMatch: boolean;
  sourcesFresh: boolean;
  reusePolicyEnabled: boolean;
}): { allowed: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (!input.reusePolicyEnabled) reasons.push("reuse_policy_off");
  if (!input.sameTenant) reasons.push("tenant_mismatch");
  if (!input.sameInstall) reasons.push("install_mismatch");
  if (!input.localeMatches) reasons.push("locale_mismatch");
  if (!input.topicMatches) reasons.push("topic_mismatch");
  if (!input.sourcesStillPublished) reasons.push("source_unpublished");
  if (!input.sourceVersionsMatch) reasons.push("source_version_changed");
  if (!input.sourcesFresh) reasons.push("source_stale");
  // Explicit: one helpful vote never unlocks reuse.
  reasons.push("helpful_vote_not_sufficient");
  return { allowed: false, reasons };
}
