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
      if (!/\b(contact|kontakt|support|kundeservice|hjälp|hjaelp)\b/.test(haystack)) {
        continue;
      }
    }
    const href = normalizeContactHref(row.source_url, normalizedDomain);
    if (href) return href;
  }
  return null;
}
