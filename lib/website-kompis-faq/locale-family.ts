import type { WpkfContentType, WpkfStatus } from "@/lib/website-kompis-faq/constants";

/**
 * A language version belongs to a FAQ only through an explicit family id
 * plus the same tenant and the same website. Title, question, category,
 * and row order are not links.
 */
export type FaqLocaleMember = {
  id: string;
  translationGroupId?: string | null;
  installId: string | null;
  domain: string | null;
  locale: string;
  status: WpkfStatus;
};

export type LocaleVersionLookup<T extends FaqLocaleMember> =
  | { outcome: "found"; row: T }
  | { outcome: "missing"; sourceId: string; translationGroupId: string }
  | { outcome: "unlinked" }
  | { outcome: "ambiguous" }
  | { outcome: "not_found" };

export type EmptyLocaleVersion = {
  editorStatus: "new";
  itemId: null;
  installId: string | null;
  domain: string | null;
  locale: string;
  title: "";
  question: "";
  answer: "";
  category: "";
  contentType: WpkfContentType;
  publicSafe: false;
  priority: number;
  tags: [];
  sourceUrl: "";
  validFrom: null;
  validUntil: null;
  permanent: true;
  lastReviewedAt: null;
};

export type LocaleDraftSnapshot = {
  title: string;
  question?: string | null;
  answer: string;
  category?: string | null;
  contentType: WpkfContentType;
  publicSafe: boolean;
  priority: number;
  tags: string[];
  sourceUrl?: string | null;
  validFrom?: string | null;
  validUntil?: string | null;
  permanent: boolean;
};

function sameWebsite(left: FaqLocaleMember, right: FaqLocaleMember): boolean {
  if (left.installId || right.installId) return left.installId != null && left.installId === right.installId;
  return (left.domain ?? "").trim().toLowerCase() === (right.domain ?? "").trim().toLowerCase();
}

/** Lookup inside rows the caller has already limited to one tenant. */
export function lookupExplicitFaqLocale<T extends FaqLocaleMember>(
  authorizedRows: readonly T[],
  sourceId: string,
  locale: string,
): LocaleVersionLookup<T> {
  const source = authorizedRows.find((row) => row.id === sourceId);
  if (!source) return { outcome: "not_found" };
  if (!source.translationGroupId) return { outcome: "unlinked" };
  const requested = locale.trim().toLowerCase();
  const matches = authorizedRows.filter(
    (row) =>
      row.translationGroupId === source.translationGroupId &&
      sameWebsite(source, row) &&
      row.locale.trim().toLowerCase() === requested &&
      row.status !== "archived",
  );
  if (matches.length > 1) return { outcome: "ambiguous" };
  const found = matches[0];
  if (!found) return { outcome: "missing", sourceId: source.id, translationGroupId: source.translationGroupId };
  return { outcome: "found", row: found };
}

export function emptyLocaleVersion(
  source: { installId: string | null; domain: string | null; contentType: WpkfContentType; priority: number },
  locale: string,
): EmptyLocaleVersion {
  return {
    editorStatus: "new",
    itemId: null,
    installId: source.installId,
    domain: source.domain,
    locale,
    title: "",
    question: "",
    answer: "",
    category: "",
    contentType: source.contentType,
    publicSafe: false,
    priority: source.priority,
    tags: [],
    sourceUrl: "",
    validFrom: null,
    validUntil: null,
    permanent: true,
    lastReviewedAt: null,
  };
}

export function localeDraftIsDirty(current: LocaleDraftSnapshot, baseline: LocaleDraftSnapshot): boolean {
  return (
    current.title !== baseline.title ||
    (current.question ?? "") !== (baseline.question ?? "") ||
    current.answer !== baseline.answer ||
    (current.category ?? "") !== (baseline.category ?? "") ||
    current.contentType !== baseline.contentType ||
    current.publicSafe !== baseline.publicSafe ||
    current.priority !== baseline.priority ||
    current.tags.join("\n") !== baseline.tags.join("\n") ||
    (current.sourceUrl ?? "") !== (baseline.sourceUrl ?? "") ||
    current.permanent !== baseline.permanent ||
    (current.validFrom ?? "") !== (baseline.validFrom ?? "") ||
    (current.validUntil ?? "") !== (baseline.validUntil ?? "")
  );
}

export function acceptLocaleResponse(requestId: number, latestRequestId: number): boolean {
  return requestId === latestRequestId;
}

export type FaqLocaleLinkCandidate = {
  id: string;
  title: string;
  questionExcerpt: string;
  locale: string;
  status: WpkfStatus;
  domain: string | null;
  installId: string | null;
};

export type FaqLocaleLinkRefusal =
  | "not_found"
  | "unlinked"
  | "invalid_locale"
  | "same_row"
  | "website"
  | "archived"
  | "locale_mismatch"
  | "locale_taken"
  | "family_conflict";

export type FaqLocaleLinkPlan =
  | { ok: true; outcome: "ready" | "already_linked"; sourceId: string; candidateId: string; translationGroupId: string }
  | { ok: false; reason: FaqLocaleLinkRefusal };

const LINK_RESULT_LIMIT = 25;
const QUESTION_EXCERPT = 140;

function liveFamily<T extends FaqLocaleMember>(rows: readonly T[], anchor: FaqLocaleMember, groupId: string): T[] {
  return rows.filter(
    (row) =>
      row.translationGroupId === groupId &&
      sameWebsite(anchor, row) &&
      row.status !== "archived",
  );
}

/** Search stays inside the caller's tenant. Nothing here is selected. */
export function searchExplicitFaqLocaleCandidates<
  T extends FaqLocaleMember & { title: string; question?: string | null },
>(rows: readonly T[], sourceId: string, locale: string, query: string): FaqLocaleLinkCandidate[] | { outcome: "not_found" | "unlinked" } {
  const source = rows.find((row) => row.id === sourceId);
  if (!source) return { outcome: "not_found" };
  if (!source.translationGroupId) return { outcome: "unlinked" };
  const requested = locale.trim().toLowerCase();
  if (!requested) return [];
  const needle = query.trim().toLowerCase();
  return rows
    .filter((row) => {
      if (row.id === source.id || row.status === "archived") return false;
      if (!sameWebsite(source, row) || row.locale.trim().toLowerCase() !== requested) return false;
      if (!needle) return true;
      return `${row.title}\n${row.question ?? ""}`.toLowerCase().includes(needle);
    })
    .slice(0, LINK_RESULT_LIMIT)
    .map((row) => ({
      id: row.id,
      title: row.title,
      questionExcerpt: (row.question ?? "").trim().slice(0, QUESTION_EXCERPT),
      locale: row.locale.trim().toLowerCase(),
      status: row.status,
      domain: row.domain,
      installId: row.installId,
    }));
}

/**
 * A link may join a singleton row to the source family.
 * A family that already has another live language version is refused.
 * The plan does not change any row.
 */
export function planExplicitFaqLocaleLink<T extends FaqLocaleMember>(
  rows: readonly T[],
  sourceId: string,
  candidateId: string,
  locale: string,
): FaqLocaleLinkPlan {
  const requested = locale.trim().toLowerCase();
  if (!requested) return { ok: false, reason: "invalid_locale" };
  const source = rows.find((row) => row.id === sourceId);
  const candidate = rows.find((row) => row.id === candidateId);
  if (!source || !candidate) return { ok: false, reason: "not_found" };
  if (!source.translationGroupId) return { ok: false, reason: "unlinked" };
  if (candidate.id === source.id) return { ok: false, reason: "same_row" };
  if (candidate.status === "archived") return { ok: false, reason: "archived" };
  if (!sameWebsite(source, candidate)) return { ok: false, reason: "website" };
  if (candidate.locale.trim().toLowerCase() !== requested) return { ok: false, reason: "locale_mismatch" };

  const sourceFamily = liveFamily(rows, source, source.translationGroupId);
  if (sourceFamily.some((row) => row.id !== candidate.id && row.locale.trim().toLowerCase() === requested)) {
    return { ok: false, reason: "locale_taken" };
  }
  if (candidate.translationGroupId === source.translationGroupId) {
    return {
      ok: true,
      outcome: "already_linked",
      sourceId: source.id,
      candidateId: candidate.id,
      translationGroupId: source.translationGroupId,
    };
  }
  if (candidate.translationGroupId) {
    const otherMembers = liveFamily(rows, candidate, candidate.translationGroupId).filter((row) => row.id !== candidate.id);
    if (otherMembers.length > 0) return { ok: false, reason: "family_conflict" };
  }
  return {
    ok: true,
    outcome: "ready",
    sourceId: source.id,
    candidateId: candidate.id,
    translationGroupId: source.translationGroupId,
  };
}

/** Changes only the family id. Content, status, URL, and publication stay as they were. */
export function applyExplicitFaqLocaleLink<T extends FaqLocaleMember>(
  rows: readonly T[],
  sourceId: string,
  candidateId: string,
  locale: string,
): FaqLocaleLinkPlan {
  const plan = planExplicitFaqLocaleLink(rows, sourceId, candidateId, locale);
  if (!plan.ok || plan.outcome === "already_linked") return plan;
  const candidate = rows.find((row) => row.id === plan.candidateId);
  if (!candidate) return { ok: false, reason: "not_found" };
  candidate.translationGroupId = plan.translationGroupId;
  return plan;
}
