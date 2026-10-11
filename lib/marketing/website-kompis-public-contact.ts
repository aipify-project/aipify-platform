import {
  isAllowedWebsiteKompisHostNavigateHref,
  normalizeWebsiteKompisEmbedDomain,
} from "@/lib/marketing/website-kompis-embed";
import { isPrivateWebsiteKompisPathnameNormalized } from "@/lib/marketing/website-kompis-public-site-index/private-paths";

export type WebsiteKompisPublicContactCandidate = {
  title: string;
  content_type: string;
  category?: string | null;
  source_url: string | null;
  score?: number | null;
};

/** Index/page hits considered for contact — URL alone is not enough. */
export type WebsiteKompisPublicContactIndexCandidate = {
  title: string;
  pathname?: string | null;
  canonicalUrl?: string | null;
  excerpt?: string | null;
  score?: number | null;
  locale?: string | null;
};

export type WebsiteKompisPublicContactRejectReason =
  | "missing_domain"
  | "private_path"
  | "not_contact_relevant"
  | "excerpt_only_without_title_or_path"
  | "missing_href"
  | "host_or_protocol_rejected";

/** Strong contact/support path segments (not generic FAQ hubs alone). */
const CONTACT_PATH_RE =
  /(?:^|\/)(contact|contact-us|kontakt|kontakt-oss|ta-kontakt|support|support-center|help-center|kundeservice|kunde-?service|customer-?service|kundesenter|kundcenter|hjaelp|hjælp|hjelp|help)(?:\/|$)/i;

const CONTACT_TEXT_RE =
  /\b(contact(\s+us)?|kontakt(\s+oss)?|ta\s+kontakt|skriv\s+til\s+oss|support(\s+center)?|kundeservice|kunde\s*service|customer\s*service|kundesenter|hjälp|hjaelp|hjælp|hjelp|help\s*center|get\s+in\s+touch)\b/i;

/** Public contact-form cues in indexed excerpt/body snippets. */
const CONTACT_FORM_RE =
  /\b(contact\s*form|kontakt\s*skjema|kontaktskjema|send\s+(us|oss)\s+(a\s+)?(message|melding)|fill\s+(out|in)\s+.{0,24}(form|skjema)|contact\s+formular)\b/i;

function normalizeContactHref(raw: string, domain: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return isAllowedWebsiteKompisHostNavigateHref(trimmed, [domain]) ? trimmed : null;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:") return null;
    if (!isAllowedWebsiteKompisHostNavigateHref(parsed.toString(), [domain])) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export type WebsiteKompisPublicContactSource = "configured" | "discovered" | "none";

export type WebsiteKompisConfiguredSupportContactRejectReason =
  | "empty"
  | "invalid_url"
  | "scheme_rejected"
  | "credentials_rejected"
  | "host_rejected"
  | "private_path"
  | "too_long";

export type WebsiteKompisConfiguredSupportContactResult =
  | { ok: true; url: string | null }
  | { ok: false; reason: WebsiteKompisConfiguredSupportContactRejectReason };

const SUPPORT_CONTACT_URL_MAX_LENGTH = 500;

/**
 * Validate an APP-configured support/contact URL before save and before runtime use.
 * HTTPS + same verified host + public path. Empty/null clears the override.
 */
export function validateWebsiteKompisConfiguredSupportContactUrl(
  raw: unknown,
  domain: string,
): WebsiteKompisConfiguredSupportContactResult {
  if (raw == null) {
    return { ok: true, url: null };
  }
  if (typeof raw !== "string") {
    return { ok: false, reason: "invalid_url" };
  }
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: true, url: null };
  }
  if (trimmed.length > SUPPORT_CONTACT_URL_MAX_LENGTH) {
    return { ok: false, reason: "too_long" };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, reason: "invalid_url" };
  }

  if (parsed.protocol !== "https:") {
    return { ok: false, reason: "scheme_rejected" };
  }
  if (parsed.username || parsed.password) {
    return { ok: false, reason: "credentials_rejected" };
  }
  if (parsed.hash.toLowerCase().startsWith("#javascript:")) {
    return { ok: false, reason: "invalid_url" };
  }

  const normalizedDomain = normalizeWebsiteKompisEmbedDomain(domain);
  if (!normalizedDomain) {
    return { ok: false, reason: "host_rejected" };
  }
  if (!isAllowedWebsiteKompisHostNavigateHref(parsed.toString(), [normalizedDomain])) {
    return { ok: false, reason: "host_rejected" };
  }
  if (isPrivateWebsiteKompisPathnameNormalized(parsed.pathname)) {
    return { ok: false, reason: "private_path" };
  }

  // Deterministic normalization: drop hash; keep pathname/search as customer provided.
  parsed.hash = "";
  return { ok: true, url: parsed.toString() };
}

export function isWebsiteKompisContactRelevantText(value: string): boolean {
  return CONTACT_TEXT_RE.test(value) || CONTACT_PATH_RE.test(value) || CONTACT_FORM_RE.test(value);
}

export function isWebsiteKompisContactRelevantPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return CONTACT_PATH_RE.test(pathname);
}

export function isWebsiteKompisContactFormEvidence(value: string): boolean {
  return CONTACT_FORM_RE.test(value);
}

/** Deterministic priority: path contact > title contact > form excerpt. Lower is better. */
export function websiteKompisContactCandidateTier(input: {
  pathname?: string | null;
  title?: string | null;
  excerpt?: string | null;
  url?: string | null;
}): number {
  const path = (input.pathname ?? "").trim();
  const title = (input.title ?? "").trim();
  const excerpt = (input.excerpt ?? "").trim();
  const url = (input.url ?? "").trim();
  if (isWebsiteKompisContactRelevantPath(path) || isWebsiteKompisContactRelevantPath(url)) {
    return 0;
  }
  if (CONTACT_TEXT_RE.test(title)) {
    return 1;
  }
  if (CONTACT_FORM_RE.test(`${title} ${excerpt}`)) {
    return 2;
  }
  if (CONTACT_TEXT_RE.test(`${path} ${url}`)) {
    return 3;
  }
  return 9;
}

/**
 * Pick a safe same-host contact URL from structured FAQ candidates.
 * A source_url alone is not enough — row must be contact-typed or contact-relevant.
 */
export function pickWebsiteKompisPublicContactHref(
  rows: WebsiteKompisPublicContactCandidate[],
  domain: string,
): string | null {
  const normalizedDomain = normalizeWebsiteKompisEmbedDomain(domain);
  if (!normalizedDomain) return null;

  const ranked = [...rows].sort((a, b) => {
    const aContact = a.content_type === "contact" ? 0 : 1;
    const bContact = b.content_type === "contact" ? 0 : 1;
    if (aContact !== bContact) return aContact - bContact;
    return (b.score ?? 0) - (a.score ?? 0);
  });

  for (const row of ranked) {
    if (!row.source_url) continue;
    if (row.content_type !== "contact") {
      const haystack = `${row.title} ${row.category ?? ""} ${row.source_url}`.toLowerCase();
      if (!isWebsiteKompisContactRelevantText(haystack)) {
        continue;
      }
    }
    try {
      const asPath = row.source_url.startsWith("/")
        ? row.source_url
        : new URL(row.source_url).pathname;
      if (isPrivateWebsiteKompisPathnameNormalized(asPath)) continue;
    } catch {
      /* normalizeContactHref will reject */
    }
    const href = normalizeContactHref(row.source_url, normalizedDomain);
    if (href) return href;
  }
  return null;
}

export type WebsiteKompisPublicContactIndexPickResult = {
  href: string | null;
  selected?: {
    title: string;
    pathname: string;
    canonicalUrl: string;
    tier: number;
    score: number;
  };
  rejected: Array<{
    title: string;
    pathname: string;
    reason: WebsiteKompisPublicContactRejectReason;
  }>;
};

/**
 * Evaluate index hits with explicit accept/reject reasons (for tests + diagnostics).
 * HTTPS + same-host + public path + contact relevance required.
 */
export function evaluateWebsiteKompisPublicContactHrefFromIndex(
  hits: WebsiteKompisPublicContactIndexCandidate[],
  domain: string,
): WebsiteKompisPublicContactIndexPickResult {
  const normalizedDomain = normalizeWebsiteKompisEmbedDomain(domain);
  if (!normalizedDomain) {
    return { href: null, rejected: [] };
  }

  const rejected: WebsiteKompisPublicContactIndexPickResult["rejected"] = [];

  const ranked = [...hits].sort((a, b) => {
    const tierDelta =
      websiteKompisContactCandidateTier({
        pathname: a.pathname,
        title: a.title,
        excerpt: a.excerpt,
        url: a.canonicalUrl,
      }) -
      websiteKompisContactCandidateTier({
        pathname: b.pathname,
        title: b.title,
        excerpt: b.excerpt,
        url: b.canonicalUrl,
      });
    if (tierDelta !== 0) return tierDelta;
    return (b.score ?? 0) - (a.score ?? 0);
  });

  for (const hit of ranked) {
    const path = (hit.pathname ?? "").trim();
    const title = (hit.title ?? "").trim();
    const excerpt = (hit.excerpt ?? "").trim();
    const url = (hit.canonicalUrl ?? "").trim();
    const labelPath = path || url || "(none)";

    if (path && isPrivateWebsiteKompisPathnameNormalized(path)) {
      rejected.push({ title, pathname: labelPath, reason: "private_path" });
      continue;
    }
    if (url) {
      try {
        if (isPrivateWebsiteKompisPathnameNormalized(new URL(url).pathname)) {
          rejected.push({ title, pathname: labelPath, reason: "private_path" });
          continue;
        }
      } catch {
        /* host check below */
      }
    }

    const pathOk = isWebsiteKompisContactRelevantPath(path) || isWebsiteKompisContactRelevantPath(url);
    const titleOk = CONTACT_TEXT_RE.test(title);
    const formOk = CONTACT_FORM_RE.test(`${title} ${excerpt}`);
    const textOk = isWebsiteKompisContactRelevantText(`${title} ${path} ${excerpt} ${url}`);

    if (!pathOk && !textOk && !formOk) {
      rejected.push({ title, pathname: labelPath, reason: "not_contact_relevant" });
      continue;
    }
    // Excerpt/form alone is allowed; random high-score pages with only buried keywords in URL need title or path.
    if (!pathOk && !titleOk && !formOk) {
      rejected.push({
        title,
        pathname: labelPath,
        reason: "excerpt_only_without_title_or_path",
      });
      continue;
    }

    const candidate = url || (path.startsWith("/") ? path : null);
    if (!candidate) {
      rejected.push({ title, pathname: labelPath, reason: "missing_href" });
      continue;
    }
    const href = normalizeContactHref(candidate, normalizedDomain);
    if (!href) {
      rejected.push({ title, pathname: labelPath, reason: "host_or_protocol_rejected" });
      continue;
    }

    return {
      href,
      selected: {
        title,
        pathname: path,
        canonicalUrl: url || href,
        tier: websiteKompisContactCandidateTier({
          pathname: path,
          title,
          excerpt,
          url,
        }),
        score: hit.score ?? 0,
      },
      rejected,
    };
  }

  return { href: null, rejected };
}

/**
 * Pick a safe same-host contact URL from public site-index hits.
 * Path/title/form evidence required — not a random high-scoring page.
 * FAQ source_url is not required.
 */
export function pickWebsiteKompisPublicContactHrefFromIndex(
  hits: WebsiteKompisPublicContactIndexCandidate[],
  domain: string,
): string | null {
  return evaluateWebsiteKompisPublicContactHrefFromIndex(hits, domain).href;
}
