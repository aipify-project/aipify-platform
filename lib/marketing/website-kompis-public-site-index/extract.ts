import { createHash } from "node:crypto";

const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const TOKEN_PATTERN =
  /\b(?:eyJ[A-Za-z0-9_-]{10,}|Bearer\s+[A-Za-z0-9._-]{10,}|session[_-]?id\s*[:=]\s*\S+|api[_-]?key\s*[:=]\s*\S+)\b/gi;

/**
 * Closed accordion answers are still public FAQ — not private/hidden-by-auth text.
 * Hub pages often ship 100–250 published FAQ records; 16×24k alone cannot keep
 * late Q→A pairs. Caps below bound FAQ harvest only (not unlimited page HTML).
 *
 * Persist contract (replace_tenant_public_site_index_document) must match these
 * FAQ ceilings — see WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_PERSIST_* and migration
 * 20261938100000_website_kompis_public_site_index_faq_storage_contract_v1.sql.
 * Ordinary non-FAQ pages still use ≤16 chunks / ≤24k visible body in extract.
 */
export const WEBSITE_KOMPIS_PUBLIC_FAQ_PAIR_MAX = 240;
/** FAQ-pair chunks may use a higher slot count than generic body chunking (16). */
export const WEBSITE_KOMPIS_PUBLIC_FAQ_CHUNK_MAX = 48;
export const WEBSITE_KOMPIS_PUBLIC_FAQ_BODY_MAX = 48_000;
/** Server persist body ceiling — must equal FAQ body max after job 39. */
export const WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_PERSIST_BODY_MAX =
  WEBSITE_KOMPIS_PUBLIC_FAQ_BODY_MAX;
/** Server persist chunk ceiling — must equal FAQ chunk max after job 39. */
export const WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_PERSIST_CHUNK_MAX =
  WEBSITE_KOMPIS_PUBLIC_FAQ_CHUNK_MAX;
const FAQ_QUESTION_MIN = 8;
const FAQ_QUESTION_MAX = 240;
const FAQ_ANSWER_MIN = 12;
const FAQ_ANSWER_MAX = 900;

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

export type PublicFaqPair = {
  question: string;
  answer: string;
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

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code) => {
      const n = Number(code);
      return Number.isFinite(n) ? String.fromCodePoint(n) : "";
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => {
      const n = Number.parseInt(hex, 16);
      return Number.isFinite(n) ? String.fromCodePoint(n) : "";
    });
}

/** Decode JSON string literals from page payloads (including `\\"` / `\\uXXXX`). */
export function decodeJsonStringLiteral(value: string): string {
  try {
    return JSON.parse(`"${value}"`) as string;
  } catch {
    return value
      .replace(/\\u([0-9a-f]{4})/gi, (_, hex) =>
        String.fromCharCode(Number.parseInt(hex, 16)),
      )
      .replace(/\\"/g, '"')
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\\\/g, "\\");
  }
}

function normalizeFaqKey(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function isSafePublicFaqPair(question: string, answer: string): boolean {
  const q = question.trim();
  const a = answer.trim();
  if (q.length < FAQ_QUESTION_MIN || q.length > FAQ_QUESTION_MAX) return false;
  if (a.length < FAQ_ANSWER_MIN || a.length > FAQ_ANSWER_MAX) return false;
  // One FAQ item — reject accordion title dumps ("Q1? + Q2? + Q3?").
  const questionMarks = (q.match(/\?/g) ?? []).length;
  if (questionMarks > 1) return false;
  if (/\+\s*(hva|hvordan|hvor|kan|må|hvilke|what|how|where|can)\b/i.test(q)) return false;
  if (!/\?/.test(q) && !/^(hva|hvordan|hvor|kan|må|hvilke|what|how|where|can|do)\b/i.test(q)) {
    return false;
  }
  if (
    new RegExp(EMAIL_PATTERN.source, "i").test(a) ||
    new RegExp(TOKEN_PATTERN.source, "i").test(a) ||
    new RegExp(TOKEN_PATTERN.source, "i").test(q)
  ) {
    return false;
  }
  if (looksLikeHydrationOrScriptBlob(a) || looksLikeHydrationOrScriptBlob(q)) return false;
  if (/\{[^{}\n]{1,80}\}/.test(a)) return false;
  if (/<script|javascript:|data:text\/html/i.test(`${q} ${a}`)) return false;
  return true;
}

function pushFaqPair(
  out: PublicFaqPair[],
  seen: Set<string>,
  questionRaw: string,
  answerRaw: string,
): void {
  const question = sanitizeText(decodeHtmlEntities(questionRaw), FAQ_QUESTION_MAX);
  const answer = sanitizeText(decodeHtmlEntities(answerRaw), FAQ_ANSWER_MAX);
  if (!isSafePublicFaqPair(question, answer)) return;
  const key = normalizeFaqKey(question);
  if (!key || seen.has(key)) return;
  seen.add(key);
  out.push({ question, answer });
}

/**
 * Collect public FAQ Q→A pairs from disclosure markup and published FAQ records.
 * Closed accordion / aria-expanded=false is still public content — extract it.
 * Does not keep raw script/hydration blobs; only validated question/answer strings.
 */
export function extractPublicFaqPairsFromHtml(html: string): PublicFaqPair[] {
  const out: PublicFaqPair[] = [];
  const seen = new Set<string>();

  // 1) Published FAQ records in page payloads (often script JSON). Highest signal
  // for closed accordions — harvest before noisy DOM title lists fill the budget.
  const jsonPairPatterns = [
    /"question"\s*:\s*"((?:\\.|[^"\\]){8,240})"\s*,\s*"answer"\s*:\s*"((?:\\.|[^"\\]){8,900})"/g,
    /\\"question\\"\s*:\s*\\"((?:\\\\.|[^"\\]){8,240})\\"\s*,\s*\\"answer\\"\s*:\s*\\"((?:\\\\.|[^"\\]){8,900})\\"/g,
  ];
  for (const pattern of jsonPairPatterns) {
    for (const match of html.matchAll(pattern)) {
      const question = decodeJsonStringLiteral(match[1] ?? "");
      const answer = decodeJsonStringLiteral(match[2] ?? "");
      pushFaqPair(out, seen, question, answer);
      if (out.length >= WEBSITE_KOMPIS_PUBLIC_FAQ_PAIR_MAX) return out;
    }
  }

  // 2) <details><summary>Question?</summary>Answer</details>
  for (const match of html.matchAll(
    /<details\b[^>]*>\s*<summary\b[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gi,
  )) {
    const question = stripNonContentMarkup(match[1] ?? "");
    const answer = stripNonContentMarkup(match[2] ?? "");
    pushFaqPair(out, seen, question, answer);
    if (out.length >= WEBSITE_KOMPIS_PUBLIC_FAQ_PAIR_MAX) return out;
  }

  // 3) Control label + sibling .faq-answer (open panels still in DOM).
  for (const match of html.matchAll(
    /<(button|h2|h3)\b([^>]*)>([\s\S]*?)<\/\1>\s*<div\b[^>]*class=["'][^"']*faq-answer[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi,
  )) {
    const question = stripNonContentMarkup(match[3] ?? "");
    const answer = stripNonContentMarkup(match[4] ?? "");
    pushFaqPair(out, seen, question, answer);
    if (out.length >= WEBSITE_KOMPIS_PUBLIC_FAQ_PAIR_MAX) return out;
  }

  // 4) aria-controls → id panel
  for (const match of html.matchAll(
    /<(button|a|h2|h3)\b([^>]*\baria-controls=["']([^"']+)["'][^>]*)>([\s\S]*?)<\/\1>/gi,
  )) {
    const panelId = match[3]?.trim();
    if (!panelId) continue;
    const question = stripNonContentMarkup(match[4] ?? "");
    const idRe = new RegExp(
      `<([a-z0-9-]+)\\b[^>]*\\bid=["']${panelId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*>([\\s\\S]*?)<\\/\\1>`,
      "i",
    );
    const panel = html.match(idRe);
    if (!panel?.[2]) continue;
    pushFaqPair(out, seen, question, stripNonContentMarkup(panel[2]));
    if (out.length >= WEBSITE_KOMPIS_PUBLIC_FAQ_PAIR_MAX) return out;
  }

  return out;
}

/**
 * Pack FAQ Q→A into bounded chunks without splitting a pair across chunks.
 * Multiple short pairs may share one ≤900-char chunk for hub coverage.
 */
export function chunkPublicFaqPairs(
  pairs: PublicFaqPair[],
  maxChunks = WEBSITE_KOMPIS_PUBLIC_FAQ_CHUNK_MAX,
): string[] {
  const chunks: string[] = [];
  let buffer = "";
  for (const pair of pairs) {
    const passage = sanitizeText(`${pair.question} ${pair.answer}`, 900);
    if (passage.length < 40) continue;
    if (!buffer) {
      buffer = passage;
      continue;
    }
    const merged = `${buffer}\n${passage}`;
    if (merged.length <= 900) {
      buffer = merged;
      continue;
    }
    chunks.push(buffer.slice(0, 1800));
    if (chunks.length >= maxChunks) return chunks;
    buffer = passage;
  }
  if (buffer.length >= 40 && chunks.length < maxChunks) {
    chunks.push(buffer.slice(0, 1800));
  }
  return chunks;
}

export function extractPublicPageFromHtml(html: string, preferredLocale?: string): ExtractedPublicPage {
  const title = matchTitle(html);
  const metaDescription = matchMeta(html, "description") || matchMeta(html, "og:description");
  const locale = resolveExtractedLocale(html, preferredLocale);
  const noindex = pageDeclaresNoindex(html);

  const bodySource = selectPublicContentRegion(html);
  const visibleBody = sanitizeText(stripNonContentMarkup(bodySource), 24_000);
  // FAQ pairs are harvested before script strip (closed accordion answers often
  // live only in published page FAQ JSON). Raw scripts are never kept as body.
  const faqPairs = extractPublicFaqPairsFromHtml(html);
  const faqChunks = chunkPublicFaqPairs(faqPairs);
  const faqBody = sanitizeText(
    faqPairs.map((pair) => `${pair.question} ${pair.answer}`).join("\n"),
    WEBSITE_KOMPIS_PUBLIC_FAQ_BODY_MAX,
  );
  // FAQ-first so late hub answers are not truncated away by chrome / title lists.
  const bodyText = faqBody
    ? sanitizeText(`${faqBody}\n${visibleBody}`, WEBSITE_KOMPIS_PUBLIC_FAQ_BODY_MAX)
    : visibleBody;

  const excerpt = (metaDescription || bodyText).slice(0, 420);
  // When published FAQ pairs exist, persist those Q→A chunks only. Merging the
  // closed-accordion title list (`+ Hva …`) into the same 48-slot budget lets
  // FTS rank question titles over answer prose (job 38/39). Visible titles remain
  // in body_text for document-level scoring; ordinary non-FAQ pages keep 16 body chunks.
  const chunks =
    faqChunks.length > 0
      ? faqChunks.slice(0, WEBSITE_KOMPIS_PUBLIC_FAQ_CHUNK_MAX)
      : chunkPublicSiteBodyText(visibleBody);
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
