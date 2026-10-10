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

/** Remove script/style/RSC/hydration shells before visible-text extraction. */
export function stripNonContentMarkup(html: string): string {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<template\b[\s\S]*?<\/template>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    // Next.js / RSC flight payloads sometimes appear as raw text nodes.
    .replace(/\bself\.__next_f\.push\([\s\S]*?\)\s*;?/gi, " ")
    .replace(/\$Sreact[\w.]*|\$RC\b|\$L\d+\b/g, " ")
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
  return m?.[1] ? sanitizeText(stripNonContentMarkup(m[1]), 300) : "";
}

function matchHtmlLang(html: string): string | null {
  const m = html.match(/<html[^>]+lang=["']([^"']+)["']/i);
  if (!m?.[1]) return null;
  const lang = m[1].trim().toLowerCase().slice(0, 16);
  return lang || null;
}

/**
 * Prefer document-declared language over operator localeHint so /en pages are
 * not mis-tagged when ingest uses a default hint like "no".
 */
export function resolveExtractedLocale(
  html: string,
  preferredLocale?: string,
): string | null {
  const htmlLang = matchHtmlLang(html);
  if (htmlLang) {
    // Normalize BCP47 primary subtag for indexing (en-US → en).
    return htmlLang.split("-")[0] || htmlLang;
  }
  const ogLocale = matchMeta(html, "og:locale");
  if (ogLocale) {
    return ogLocale.toLowerCase().replace("_", "-").split("-")[0] || null;
  }
  const hint = preferredLocale?.trim().toLowerCase();
  return hint || null;
}

/** Prefer main/article visible regions; strip chrome when falling back to body. */
export function selectPublicContentRegion(html: string): string {
  const main =
    html.match(/<main\b[\s\S]*?<\/main>/i)?.[0] ||
    html.match(/<article\b[\s\S]*?<\/article>/i)?.[0] ||
    html.match(/<[a-z0-9-]+\b[^>]*\brole=["']main["'][^>]*>[\s\S]*?<\/[a-z0-9-]+>/i)?.[0];
  if (main) return main;

  const body = html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? html;
  return body
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer\b[\s\S]*?<\/footer>/gi, " ")
    .replace(/<header\b[\s\S]*?<\/header>/gi, " ");
}

/** True when extracted text still looks like JS/JSON hydration, not public copy. */
export function looksLikeHydrationOrScriptBlob(text: string): boolean {
  const sample = text.slice(0, 4_000);
  if (/\bself\.__next_f\b/.test(sample)) return true;
  if ((sample.match(/\$Sreact/g) || []).length >= 1) return true;
  const punct = (sample.match(/[{}\[\]"]/g) || []).length;
  const ratio = punct / Math.max(sample.length, 1);
  if (ratio > 0.12 && /\{"/.test(sample)) return true;
  if (/function\s*\(|=>\s*\{|module\.exports/.test(sample) && sample.length > 200) {
    return true;
  }
  return false;
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
  const locale = resolveExtractedLocale(html, preferredLocale);
  const noindex = pageDeclaresNoindex(html);

  const bodySource = selectPublicContentRegion(html);
  const bodyText = sanitizeText(stripNonContentMarkup(bodySource), 24_000);
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

/** Reject pages that look like login walls, empty shells, hydration blobs, or noindex. */
export function isIndexableExtractedPage(page: ExtractedPublicPage): boolean {
  if (page.noindex) return false;
  if (!page.title && !page.bodyText) return false;
  if (page.bodyText.length < 80 && page.metaDescription.length < 40) return false;
  if (looksLikeHydrationOrScriptBlob(page.bodyText)) return false;
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
