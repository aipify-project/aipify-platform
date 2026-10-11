import {
  isAllowedWebsiteKompisHostNavigateHref,
  normalizeWebsiteKompisEmbedDomain,
} from "@/lib/marketing/website-kompis-embed";

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

const CONTACT_PATH_RE =
  /(?:^|\/)(contact|kontakt|support|kundeservice|kunde-?service|customer-?service|hjaelp|hjælp|hjelp|help)(?:\/|$)/i;

const CONTACT_TEXT_RE =
  /\b(contact|kontakt|support|kundeservice|kunde\s*service|customer\s*service|hjälp|hjaelp|hjælp|hjelp|help\s*center|get\s*in\s*touch)\b/i;

function normalizeContactHref(raw: string, domain: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return isAllowedWebsiteKompisHostNavigateHref(trimmed, [domain]) ? trimmed : null;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    if (!isAllowedWebsiteKompisHostNavigateHref(parsed.toString(), [domain])) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export function isWebsiteKompisContactRelevantText(value: string): boolean {
  return CONTACT_TEXT_RE.test(value) || CONTACT_PATH_RE.test(value);
}

export function isWebsiteKompisContactRelevantPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return CONTACT_PATH_RE.test(pathname);
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
    const href = normalizeContactHref(row.source_url, normalizedDomain);
    if (href) return href;
  }
  return null;
}

/**
 * Pick a safe same-host contact URL from public site-index hits.
 * Requires contact-relevant path and/or title — not a random high-scoring page.
 */
export function pickWebsiteKompisPublicContactHrefFromIndex(
  hits: WebsiteKompisPublicContactIndexCandidate[],
  domain: string,
): string | null {
  const normalizedDomain = normalizeWebsiteKompisEmbedDomain(domain);
  if (!normalizedDomain) return null;

  const ranked = [...hits].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  for (const hit of ranked) {
    const path = (hit.pathname ?? "").trim();
    const title = (hit.title ?? "").trim();
    const excerpt = (hit.excerpt ?? "").trim();
    const url = (hit.canonicalUrl ?? "").trim();

    const pathOk = isWebsiteKompisContactRelevantPath(path);
    const textOk = isWebsiteKompisContactRelevantText(`${title} ${path} ${excerpt} ${url}`);
    if (!pathOk && !textOk) continue;
    // Prefer path-shaped contact pages; allow title/support hits only with contact path or strong title.
    if (!pathOk && !CONTACT_TEXT_RE.test(title) && !CONTACT_TEXT_RE.test(path)) {
      continue;
    }

    const candidate = url || (path.startsWith("/") ? path : null);
    if (!candidate) continue;
    const href = normalizeContactHref(candidate, normalizedDomain);
    if (href) return href;
  }
  return null;
}
