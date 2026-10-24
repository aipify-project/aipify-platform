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
