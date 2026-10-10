import { createHash } from "node:crypto";

const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const TOKEN_PATTERN =
  /\b(?:eyJ[A-Za-z0-9_-]{10,}|Bearer\s+[A-Za-z0-9._-]{10,}|session[_-]?id\s*[:=]\s*\S+|api[_-]?key\s*[:=]\s*\S+)\b/gi;

export type ExtractedPublicPage = {
  title: string;
  metaDescription: string;
  locale: string | null;
  bodyText: string;
  excerpt: string;
  chunks: string[];
  contentHash: string;
  noindex: boolean;
};

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ");
}

function sanitizeText(value: string, maxLength: number): string {
  return value
    .replace(EMAIL_PATTERN, "")
    .replace(TOKEN_PATTERN, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function matchMeta(html: string, name: string): string {
  const re = new RegExp(
    `<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`,
    "i",
  );
  const alt = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`,
    "i",
  );
  const m = html.match(re) || html.match(alt);
  return m?.[1] ? sanitizeText(m[1], 600) : "";
}

function matchTitle(html: string): string {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m?.[1] ? sanitizeText(stripTags(m[1]), 300) : "";
}

function matchHtmlLang(html: string): string | null {
  const m = html.match(/<html[^>]+lang=["']([^"']+)["']/i);
  if (!m?.[1]) return null;
  const lang = m[1].trim().toLowerCase().slice(0, 16);
  return lang || null;
}

/** Split body into bounded passages for retrieval. */
export function chunkPublicSiteBodyText(bodyText: string, maxChunks = 16): string[] {
  const cleaned = sanitizeText(bodyText, 24_000);
  if (!cleaned) return [];

  const paragraphs = cleaned
    .split(/(?<=[.!?])\s+|\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length >= 40);

  const chunks: string[] = [];
  let buffer = "";

  for (const paragraph of paragraphs) {
    if ((buffer + " " + paragraph).trim().length <= 900) {
      buffer = (buffer + " " + paragraph).trim();
      continue;
    }
    if (buffer.length >= 40) {
      chunks.push(buffer.slice(0, 1800));
      if (chunks.length >= maxChunks) return chunks;
    }
    buffer = paragraph;
  }
  if (buffer.length >= 40 && chunks.length < maxChunks) {
    chunks.push(buffer.slice(0, 1800));
  }

  if (chunks.length === 0 && cleaned.length >= 40) {
    chunks.push(cleaned.slice(0, 1800));
  }

  return chunks;
}

export function pageDeclaresNoindex(html: string): boolean {
  const robots = `${matchMeta(html, "robots")} ${matchMeta(html, "googlebot")}`.toLowerCase();
  return /\bnoindex\b/.test(robots);
}

export function extractPublicPageFromHtml(html: string, preferredLocale?: string): ExtractedPublicPage {
  const title = matchTitle(html);
  const metaDescription = matchMeta(html, "description") || matchMeta(html, "og:description");
  const locale = preferredLocale?.trim().toLowerCase() || matchHtmlLang(html);
  const noindex = pageDeclaresNoindex(html);

  // Prefer main/article content when present
  const mainMatch =
    html.match(/<main[\s\S]*?<\/main>/i) ||
    html.match(/<article[\s\S]*?<\/article>/i) ||
    null;
  const bodySource = mainMatch?.[0] ?? html;
  const bodyText = sanitizeText(stripTags(bodySource), 24_000);
  const excerpt = (metaDescription || bodyText).slice(0, 420);
  const chunks = chunkPublicSiteBodyText(bodyText);
  const contentHash = createHash("sha256")
    .update(`${title}\n${metaDescription}\n${bodyText}`)
    .digest("hex");

  return {
    title,
    metaDescription,
    locale,
    bodyText,
    excerpt,
    chunks,
    contentHash,
    noindex,
  };
}

/** Reject pages that look like login walls, empty shells, or noindex. */
export function isIndexableExtractedPage(page: ExtractedPublicPage): boolean {
  if (page.noindex) return false;
  if (!page.title && !page.bodyText) return false;
  if (page.bodyText.length < 80 && page.metaDescription.length < 40) return false;
  const lowered = `${page.title} ${page.bodyText}`.toLowerCase();
  if (
    lowered.includes("logg inn") &&
    page.bodyText.length < 200 &&
    !page.metaDescription
  ) {
    return false;
  }
  // Prompt-injection markers are stored as evidence text only; still indexable
  // but retrieval must treat content as untrusted (handled at answer layer).
  return true;
}
