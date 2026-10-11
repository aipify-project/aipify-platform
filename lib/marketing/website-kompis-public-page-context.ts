import {
  COMPANION_SUBMIT_PAGE_CONTEXT_MAX_META_DESCRIPTION_LENGTH,
  COMPANION_SUBMIT_PAGE_CONTEXT_MAX_PATHNAME_LENGTH,
  COMPANION_SUBMIT_PAGE_CONTEXT_MAX_TITLE_LENGTH,
  type CompanionSubmitPageContextSurface,
} from "@/lib/companion-runtime/companion-submit-page-context";
import {
  isProductOrPriceVisitorQuestion,
  isPurchaseProcessVisitorQuestion,
  textLooksLikePublishedPrice,
} from "@/lib/marketing/website-kompis-answer-relevance";

export const WEBSITE_KOMPIS_PUBLIC_PAGE_CONTEXT_SOURCE = "website-kompis-current-page" as const;

export const WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_HEADINGS = 12;
export const WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_HEADING_LENGTH = 140;
export const WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_TEXT_SNIPPETS = 8;
export const WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_TEXT_SNIPPET_LENGTH = 240;
export const WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_STRUCTURED_DATA_SUMMARIES = 6;
export const WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_STRUCTURED_DATA_SUMMARY_LENGTH = 200;
export const WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_CANONICAL_URL_LENGTH = 320;
export const WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_LOCALE_LENGTH = 16;
export const WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_CAPTURED_AT_LENGTH = 40;
export const WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_SERIALIZED_BYTES = 4096;

export type WebsiteKompisPublicPageHeading = {
  level: 1 | 2 | 3;
  text: string;
};

export type WebsiteKompisPublicPageContext = {
  pathname?: string;
  title?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  locale?: string;
  surface?: "public";
  headings?: WebsiteKompisPublicPageHeading[];
  textSnippets?: string[];
  structuredDataSummary?: string[];
  capturedAt?: string;
};

const ALLOWED_PAGE_CONTEXT_KEYS = new Set([
  "pathname",
  "title",
  "metaDescription",
  "canonicalUrl",
  "locale",
  "surface",
  "headings",
  "textSnippets",
  "structuredDataSummary",
  "capturedAt",
]);

const PRIVATE_PATHNAME_PREFIXES = [
  "/admin",
  "/member",
  "/members",
  "/profile",
  "/account",
  "/auth",
  "/onboarding",
  "/checkout",
  "/payment",
  "/messages",
  "/app/",
] as const;

const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const TOKEN_PATTERN =
  /\b(?:eyJ[A-Za-z0-9_-]{10,}|Bearer\s+[A-Za-z0-9._-]{10,}|session[_-]?id\s*[:=]\s*\S+|api[_-]?key\s*[:=]\s*\S+)\b/gi;

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, " ");
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function sanitizePlainText(value: string, maxLength: number): string {
  const cleaned = normalizeWhitespace(stripHtml(value))
    .replace(EMAIL_PATTERN, "")
    .replace(TOKEN_PATTERN, "")
    .trim();
  return cleaned.slice(0, maxLength);
}

function tokenize(value: string): string[] {
  const stopWords = new Set([
    "about",
    "after",
    "also",
    "and",
    "can",
    "den",
    "det",
    "does",
    "for",
    "from",
    "have",
    "how",
    "hva",
    "hvem",
    "hvor",
    "hvordan",
    "is",
    "med",
    "men",
    "not",
    "når",
    "og",
    "om",
    "or",
    "som",
    "the",
    "this",
    "til",
    "what",
    "when",
    "where",
    "who",
    "why",
    "with",
    "you",
    "your",
  ]);

  return normalizeWhitespace(value)
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .map((token) => token.trim())
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

export function isPrivateWebsiteKompisPathname(pathname: string | undefined): boolean {
  if (!pathname) return false;
  const normalized = pathname.trim().toLowerCase();
  if (!normalized.startsWith("/")) return true;
  return PRIVATE_PATHNAME_PREFIXES.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`),
  );
}

function sanitizeCanonicalUrl(value: string): string | undefined {
  const trimmed = value.trim().slice(0, WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_CANONICAL_URL_LENGTH);
  if (!trimmed) return undefined;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return undefined;
    }
    return parsed.toString();
  } catch {
    return undefined;
  }
}

function sanitizeHeadings(value: unknown): WebsiteKompisPublicPageHeading[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const headings: WebsiteKompisPublicPageHeading[] = [];
  for (const entry of value.slice(0, WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_HEADINGS)) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    const level = row.level;
    if (level !== 1 && level !== 2 && level !== 3) continue;
    const text = typeof row.text === "string" ? sanitizePlainText(row.text, WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_HEADING_LENGTH) : "";
    if (!text) continue;
    headings.push({ level, text });
  }

  return headings.length > 0 ? headings : undefined;
}

function sanitizeStringArray(
  value: unknown,
  maxItems: number,
  maxLength: number,
): string[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const items = value
    .map((entry) => (typeof entry === "string" ? sanitizePlainText(entry, maxLength) : ""))
    .filter(Boolean)
    .slice(0, maxItems);

  return items.length > 0 ? items : undefined;
}

function enforceSerializedBudget(pageContext: WebsiteKompisPublicPageContext): WebsiteKompisPublicPageContext {
  let serialized = JSON.stringify(pageContext);
  if (Buffer.byteLength(serialized, "utf8") <= WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_SERIALIZED_BYTES) {
    return pageContext;
  }

  const trimmed: WebsiteKompisPublicPageContext = { ...pageContext };
  if (trimmed.textSnippets) {
    trimmed.textSnippets = trimmed.textSnippets.slice(0, 4);
  }
  if (trimmed.headings) {
    trimmed.headings = trimmed.headings.slice(0, 6);
  }
  if (trimmed.structuredDataSummary) {
    trimmed.structuredDataSummary = trimmed.structuredDataSummary.slice(0, 3);
  }

  serialized = JSON.stringify(trimmed);
  if (Buffer.byteLength(serialized, "utf8") <= WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_SERIALIZED_BYTES) {
    return trimmed;
  }

  return {
    surface: "public",
    pathname: trimmed.pathname,
    title: trimmed.title,
    metaDescription: trimmed.metaDescription,
    locale: trimmed.locale,
  };
}

export function sanitizeWebsiteKompisPublicPageContext(
  value: unknown,
): WebsiteKompisPublicPageContext | undefined {
  if (value == null) return undefined;
  if (typeof value !== "object" || Array.isArray(value)) {
    throw new Error("pageContext must be an object");
  }

  const record = value as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (!ALLOWED_PAGE_CONTEXT_KEYS.has(key)) {
      throw new Error(`Forbidden pageContext field: ${key}`);
    }
  }

  const pathnameRaw =
    typeof record.pathname === "string"
      ? record.pathname.trim().slice(0, COMPANION_SUBMIT_PAGE_CONTEXT_MAX_PATHNAME_LENGTH)
      : "";
  if (pathnameRaw && !pathnameRaw.startsWith("/")) {
    throw new Error("pageContext.pathname must start with /");
  }

  const surfaceRaw = typeof record.surface === "string" ? record.surface.trim() : "";
  const surface: CompanionSubmitPageContextSurface | undefined =
    surfaceRaw === "public" ? "public" : surfaceRaw === "app" ? "app" : undefined;

  if (surface === "app") {
    return undefined;
  }

  if (pathnameRaw && isPrivateWebsiteKompisPathname(pathnameRaw)) {
    return undefined;
  }

  const title =
    typeof record.title === "string"
      ? sanitizePlainText(record.title, COMPANION_SUBMIT_PAGE_CONTEXT_MAX_TITLE_LENGTH)
      : "";
  const metaDescription =
    typeof record.metaDescription === "string"
      ? sanitizePlainText(record.metaDescription, COMPANION_SUBMIT_PAGE_CONTEXT_MAX_META_DESCRIPTION_LENGTH)
      : "";
  const canonicalUrl =
    typeof record.canonicalUrl === "string" ? sanitizeCanonicalUrl(record.canonicalUrl) : undefined;
  const locale =
    typeof record.locale === "string"
      ? sanitizePlainText(record.locale, WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_LOCALE_LENGTH)
      : "";
  const capturedAt =
    typeof record.capturedAt === "string"
      ? sanitizePlainText(record.capturedAt, WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_CAPTURED_AT_LENGTH)
      : "";
  const headings = sanitizeHeadings(record.headings);
  const textSnippets = sanitizeStringArray(
    record.textSnippets,
    WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_TEXT_SNIPPETS,
    WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_TEXT_SNIPPET_LENGTH,
  );
  const structuredDataSummary = sanitizeStringArray(
    record.structuredDataSummary,
    WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_STRUCTURED_DATA_SUMMARIES,
    WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_STRUCTURED_DATA_SUMMARY_LENGTH,
  );

  if (
    !pathnameRaw &&
    !title &&
    !metaDescription &&
    !canonicalUrl &&
    !locale &&
    !headings &&
    !textSnippets &&
    !structuredDataSummary
  ) {
    return undefined;
  }

  const pageContext: WebsiteKompisPublicPageContext = { surface: "public" };
  if (pathnameRaw) pageContext.pathname = pathnameRaw;
  if (title) pageContext.title = title;
  if (metaDescription) pageContext.metaDescription = metaDescription;
  if (canonicalUrl) pageContext.canonicalUrl = canonicalUrl;
  if (locale) pageContext.locale = locale;
  if (capturedAt) pageContext.capturedAt = capturedAt;
  if (headings) pageContext.headings = headings;
  if (textSnippets) pageContext.textSnippets = textSnippets;
  if (structuredDataSummary) pageContext.structuredDataSummary = structuredDataSummary;

  return enforceSerializedBudget(pageContext);
}

export function isWebsiteKompisExplicitCurrentPageQuestion(question: string): boolean {
  const normalized = question.trim().toLowerCase().replace(/[?!.]+$/, "").replace(/\s+/g, " ");

  return (
    /\b(denne siden|this page|denne artikelen|this article|på denne siden|on this page)\b/.test(
      normalized,
    ) ||
    /\b(forklar denne|oppsummer denne|explain this|summarize this|what is this page about|hva handler denne)\b/.test(
      normalized,
    ) ||
    /(?:^|\s)(hvilken side er jeg på|which page am i on|what page am i on)(?:\?|$|[\s,])/.test(
      ` ${normalized} `,
    )
  );
}

/** Visitor questions about the visible customer page — not Aipify/platform product questions. */
export function isCustomerWebsitePageIntentQuestion(question: string): boolean {
  if (isWebsiteKompisExplicitCurrentPageQuestion(question)) {
    return true;
  }

  const normalized = question.trim().toLowerCase().replace(/[?!.]+$/, "").replace(/\s+/g, " ");
  if (!normalized) return false;

  if (/\b(her|here|på denne nettsiden|on this site|this website|denne nettsiden)\b/.test(normalized)) {
    return true;
  }

  if (/\b(hva koster det|what does it cost|how much does (?:it|this) cost)\b/.test(normalized)) {
    return true;
  }

  const customerSiteTopic =
    /\b(åpningstid\w*|opening hours|kontakt|contact|medlemskap|membership|medlem|member|sikkerhet|safety|plan\w*|fordeler|benefits|tilbud|offer\w*|pris\w*|kost\w*|services|tjenester|produkt\w*|reise\w*|travel|kjøp|kjop|buy|gavekort|template|upgrade)\b/.test(
      normalized,
    );
  const customerSiteScope =
    /\b(her|dere|dykk|you|your|nettsted\w*|website|siden|page|virksomheten|business|company)\b/.test(
      normalized,
    );

  return customerSiteTopic && customerSiteScope;
}

export function scoreWebsiteKompisPublicPageContextMatch(
  question: string,
  pageContext: WebsiteKompisPublicPageContext,
): number {
  const questionTokens = new Set(tokenize(question));
  if (questionTokens.size === 0) return 0;

  let score = 0;

  const scoreText = (text: string | undefined, weight: number) => {
    if (!text) return;
    const matches = tokenize(text).filter((token) => questionTokens.has(token));
    score += matches.length * weight;
  };

  scoreText(pageContext.title, 3);
  scoreText(pageContext.metaDescription, 2);

  for (const heading of pageContext.headings ?? []) {
    scoreText(heading.text, heading.level === 1 ? 3 : 2);
  }

  for (const snippet of pageContext.textSnippets ?? []) {
    scoreText(snippet, 2);
  }

  for (const summary of pageContext.structuredDataSummary ?? []) {
    scoreText(summary, 1);
  }

  if (isWebsiteKompisExplicitCurrentPageQuestion(question)) {
    score += 4;
  }

  return score;
}

function scoreSegmentForQuestion(text: string, questionTokens: string[]): number {
  if (!text.trim() || questionTokens.length === 0) return 0;
  const lower = text.toLowerCase();
  let score = 0;
  for (const token of questionTokens) {
    if (lower.includes(token)) score += 2;
  }
  if (textLooksLikePublishedPrice(text)) score += 4;
  return score;
}

function pickAnswerSegments(
  pageContext: WebsiteKompisPublicPageContext,
  question: string,
): {
  directAnswer: string;
  explanation: string | null;
} {
  const questionTokens = tokenize(question);
  const priceOrProduct = isProductOrPriceVisitorQuestion(question);
  const purchaseProcess = isPurchaseProcessVisitorQuestion(question);

  const candidates: Array<{ text: string; score: number; kind: string }> = [];
  for (const snippet of pageContext.textSnippets ?? []) {
    const text = snippet.trim();
    if (!text) continue;
    candidates.push({
      text,
      score: scoreSegmentForQuestion(text, questionTokens) + 1,
      kind: "snippet",
    });
  }
  for (const summary of pageContext.structuredDataSummary ?? []) {
    const text = summary.trim();
    if (!text) continue;
    candidates.push({
      text,
      score: scoreSegmentForQuestion(text, questionTokens) + 2,
      kind: "structured",
    });
  }
  for (const heading of pageContext.headings ?? []) {
    const text = heading.text.trim();
    if (!text) continue;
    candidates.push({
      text,
      score: scoreSegmentForQuestion(text, questionTokens) + (heading.level === 1 ? 1 : 0),
      kind: "heading",
    });
  }

  const meta = pageContext.metaDescription?.trim() || "";
  if (meta) {
    const metaScore = scoreSegmentForQuestion(meta, questionTokens);
    // Meta bio alone must not win product/price questions without price or strong overlap.
    if (!(priceOrProduct || purchaseProcess) || metaScore >= 4 || textLooksLikePublishedPrice(meta)) {
      candidates.push({ text: meta, score: metaScore, kind: "meta" });
    }
  }

  candidates.sort((a, b) => b.score - a.score);

  if (priceOrProduct || purchaseProcess) {
    // Price alone (+4) + snippet bump (+1) is not enough — need product-token overlap.
    const priced = candidates.find((entry) => {
      if (!textLooksLikePublishedPrice(entry.text)) return false;
      const lower = entry.text.toLowerCase();
      const productTokens = questionTokens.filter(
        (token) =>
          !/^(pris|prisen|price|cost|koster|kostnad|kjøp|kjop|buy|purchase|produkt|product)$/i.test(
            token,
          ),
      );
      const topicHit = productTokens.some((token) => lower.includes(token));
      return topicHit && entry.score >= 6;
    });
    if (priced) {
      const explanation =
        candidates.find((entry) => entry.text !== priced.text && entry.score > 0)?.text ?? null;
      return { directAnswer: priced.text, explanation };
    }
    // No on-topic priced segment — honest gap path (do not return unrelated bio/price).
    return { directAnswer: "", explanation: null };
  }

  const best = candidates[0];
  if (!best || (questionTokens.length > 0 && best.score < 2 && !isWebsiteKompisExplicitCurrentPageQuestion(question))) {
    const fallback =
      pageContext.title?.trim() ||
      pageContext.headings?.find((heading) => heading.level === 1)?.text?.trim() ||
      "";
    return { directAnswer: fallback, explanation: null };
  }

  const explanation =
    candidates.find((entry) => entry.text !== best.text && entry.score > 0)?.text ?? null;
  return {
    directAnswer: best.text,
    explanation: explanation?.trim() || null,
  };
}

export function tryBuildWebsiteKompisCurrentPublicPageAnswer(input: {
  question: string;
  pageContext: WebsiteKompisPublicPageContext | undefined;
  locale: string;
}): {
  answer: {
    directAnswer: string;
    explanation: string | null;
    steps: string[];
  };
  sources: Array<{ title: string; route: string }>;
  confidence: { level: "high" | "medium"; score: number };
} | null {
  const pageContext = input.pageContext;
  if (!pageContext || pageContext.surface !== "public") {
    return null;
  }

  if (isPrivateWebsiteKompisPathname(pageContext.pathname)) {
    return null;
  }

  const score = scoreWebsiteKompisPublicPageContextMatch(input.question, pageContext);
  const explicitPage = isWebsiteKompisExplicitCurrentPageQuestion(input.question);
  const pageIntent = isCustomerWebsitePageIntentQuestion(input.question);
  const priceOrProduct =
    isProductOrPriceVisitorQuestion(input.question) ||
    isPurchaseProcessVisitorQuestion(input.question);
  // Price/product questions need real on-page overlap — never win on meta bio alone.
  const minScore = explicitPage ? 2 : priceOrProduct ? 4 : pageIntent ? 2 : 4;

  const { directAnswer, explanation } = pickAnswerSegments(pageContext, input.question);
  if (!directAnswer) {
    return null;
  }

  if (score < minScore) {
    return null;
  }

  if (priceOrProduct && !textLooksLikePublishedPrice(directAnswer) && score < 6) {
    return null;
  }

  const sourceTitle = pageContext.title?.trim() || "Current page";

  return {
    answer: {
      directAnswer,
      explanation,
      steps: [],
    },
    sources: [
      {
        title: sourceTitle,
        route: WEBSITE_KOMPIS_PUBLIC_PAGE_CONTEXT_SOURCE,
      },
    ],
    confidence: {
      level: score >= 6 || pageIntent ? "high" : "medium",
      score: Math.min(0.95, 0.55 + score * 0.05),
    },
  };
}

export function collectPublicPageContextCorpus(pageContext: WebsiteKompisPublicPageContext): string[] {
  const corpus: string[] = [];
  if (pageContext.title) corpus.push(pageContext.title);
  if (pageContext.metaDescription) corpus.push(pageContext.metaDescription);
  for (const heading of pageContext.headings ?? []) {
    corpus.push(heading.text);
  }
  for (const snippet of pageContext.textSnippets ?? []) {
    corpus.push(snippet);
  }
  for (const summary of pageContext.structuredDataSummary ?? []) {
    corpus.push(summary);
  }
  return corpus;
}

export type WebsiteKompisEmbedParentElement = {
  textContent?: string | null;
  tagName?: string;
  id?: string;
  className?: string | { baseVal?: string; toString(): string };
  hidden?: boolean;
  open?: boolean;
  style?: { display?: string; visibility?: string; opacity?: string };
  getAttribute?(name: string): string | null;
  closest?(selector: string): unknown | null;
  querySelector?(selector: string): WebsiteKompisEmbedParentElement | null;
  nextElementSibling?: WebsiteKompisEmbedParentElement | null;
  parentElement?: WebsiteKompisEmbedParentElement | null;
};

export type WebsiteKompisEmbedParentDocument = {
  title: string;
  querySelector(selector: string): WebsiteKompisEmbedParentElement | null;
  querySelectorAll(selector: string): Iterable<WebsiteKompisEmbedParentElement>;
  getElementById?(id: string): WebsiteKompisEmbedParentElement | null;
  body?: { textContent?: string | null } | null;
};

const EMBED_PARENT_SKIP_ANCESTOR_SELECTORS = "form, input, textarea, select, button, script, style, noscript";
const EMBED_PARENT_UNSAFE_CONTENT_SELECTORS = "form, input, textarea, select, script, style, noscript, [contenteditable='true']";
const EMBED_PARENT_CHROME_SELECTORS = "nav, footer, [role='navigation']";
// Prefer landmark scopes; also allow FAQ/accordion sections outside <main>.
const EMBED_PARENT_OPEN_DETAILS_SELECTOR =
  "main details[open], article details[open], [role='main'] details[open], [class*='faq'] details[open], [class*='Faq'] details[open], [class*='accordion'] details[open], section details[open]";
const EMBED_PARENT_EXPANDED_CONTROL_SELECTOR =
  "main [aria-expanded='true'], article [aria-expanded='true'], [role='main'] [aria-expanded='true'], [class*='faq'] [aria-expanded='true'], [class*='Faq'] [aria-expanded='true'], [class*='accordion'] [aria-expanded='true'], section [aria-expanded='true']";
const EMBED_PARENT_ANSWER_PANEL_SELECTOR =
  "main [class*='faq-answer'], main [class*='FaqAnswer'], article [class*='faq-answer'], article [class*='FaqAnswer'], [role='main'] [class*='faq-answer'], [class*='faq'] [class*='faq-answer'], [class*='Faq'] [class*='faq-answer'], [class*='faq'] [class*='FaqAnswer'], section [class*='faq-answer'], section [class*='FaqAnswer'], main [class*='accordion-panel'], article [class*='accordion-panel'], [role='main'] [class*='accordion-panel'], [class*='accordion'] [class*='accordion-panel'], section [class*='accordion-panel']";
const EMBED_PARENT_ANSWER_PANEL_CLASS_HINT =
  /faq[-_]?answer|accordion[-_]?(?:panel|content|body)|disclosure[-_]?(?:panel|content)|panel[-_]?body|answer[-_]?body/i;

function embedParentClassName(element: WebsiteKompisEmbedParentElement): string {
  const value = element.className;
  if (typeof value === "string") return value;
  if (value && typeof value.toString === "function") return value.toString();
  return element.getAttribute?.("class") ?? "";
}

function isInsideEmbedParentSkipZone(element: WebsiteKompisEmbedParentElement): boolean {
  if (!element.closest) return false;
  return Boolean(element.closest(EMBED_PARENT_SKIP_ANCESTOR_SELECTORS));
}

function isInsideEmbedParentUnsafeContent(element: WebsiteKompisEmbedParentElement): boolean {
  if (!element.closest) return false;
  return Boolean(element.closest(EMBED_PARENT_UNSAFE_CONTENT_SELECTORS));
}

function isInsideEmbedParentChrome(element: WebsiteKompisEmbedParentElement): boolean {
  if (!element.closest) return false;
  return Boolean(element.closest(EMBED_PARENT_CHROME_SELECTORS));
}

function isOpenDetailsElement(element: WebsiteKompisEmbedParentElement): boolean {
  const openAttr = element.getAttribute?.("open");
  return element.open === true || openAttr === "" || openAttr === "true" || openAttr != null;
}

function isEmbedParentElementVisiblyOpen(element: WebsiteKompisEmbedParentElement): boolean {
  if (element.hidden) return false;
  if (element.getAttribute?.("aria-hidden") === "true") return false;
  if (element.getAttribute?.("hidden") != null && element.getAttribute("hidden") !== "false") {
    return false;
  }
  if (element.closest?.("[hidden], [aria-hidden='true']")) return false;
  const detailsAncestor = element.closest?.("details") as WebsiteKompisEmbedParentElement | null | undefined;
  if (detailsAncestor && detailsAncestor !== element && !isOpenDetailsElement(detailsAncestor)) {
    return false;
  }
  if (
    element.style?.display === "none" ||
    element.style?.visibility === "hidden" ||
    element.style?.opacity === "0"
  ) {
    return false;
  }
  return true;
}

function resolveExpandedAnswerPanel(
  control: WebsiteKompisEmbedParentElement,
  documentLike: WebsiteKompisEmbedParentDocument,
): WebsiteKompisEmbedParentElement | null {
  const controlsId = control.getAttribute?.("aria-controls")?.trim();
  if (controlsId && documentLike.getElementById) {
    const byId = documentLike.getElementById(controlsId);
    if (byId) return byId;
  }

  let sibling = control.nextElementSibling ?? null;
  for (let step = 0; sibling && step < 4; step += 1) {
    const role = sibling.getAttribute?.("role");
    const className = embedParentClassName(sibling);
    const dataState = sibling.getAttribute?.("data-state");
    if (
      role === "region" ||
      EMBED_PARENT_ANSWER_PANEL_CLASS_HINT.test(className) ||
      dataState === "open"
    ) {
      return sibling;
    }
    sibling = sibling.nextElementSibling ?? null;
  }
  return null;
}

function detailsAnswerText(details: WebsiteKompisEmbedParentElement): string {
  const summary = details.querySelector?.("summary");
  const summaryText = summary?.textContent?.trim() ?? "";
  let full = details.textContent ?? "";
  if (summaryText) {
    const idx = full.indexOf(summaryText);
    if (idx >= 0) {
      full = `${full.slice(0, idx)} ${full.slice(idx + summaryText.length)}`;
    }
  }
  return full;
}

function findAssociatedDisclosureQuestion(
  panel: WebsiteKompisEmbedParentElement,
  documentLike: WebsiteKompisEmbedParentDocument,
): string {
  const panelId = typeof panel.id === "string" ? panel.id.trim() : panel.getAttribute?.("id")?.trim();
  if (panelId) {
    for (const control of documentLike.querySelectorAll(EMBED_PARENT_EXPANDED_CONTROL_SELECTOR)) {
      if (control.getAttribute?.("aria-controls")?.trim() === panelId) {
        return control.textContent ?? "";
      }
    }
  }
  const details = panel.closest?.("details") as WebsiteKompisEmbedParentElement | null | undefined;
  if (details) {
    const summary = details.querySelector?.("summary");
    if (summary?.textContent) return summary.textContent;
  }
  let sibling = panel.parentElement?.querySelector?.("button, summary, h2, h3, [aria-expanded]");
  if (sibling?.textContent) return sibling.textContent;
  return "";
}

function formatOpenPanelSnippet(questionRaw: string, answerRaw: string): string | null {
  const question = sanitizePlainText(questionRaw, WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_HEADING_LENGTH);
  const answer = sanitizePlainText(answerRaw, WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_TEXT_SNIPPET_LENGTH);
  if (!answer || answer.length < 12) return null;
  if (!question) return answer;
  const questionPrefix = question.slice(0, 48).toLowerCase();
  if (questionPrefix && answer.toLowerCase().includes(questionPrefix)) {
    return answer;
  }
  return sanitizePlainText(
    `${question}: ${answer}`,
    WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_TEXT_SNIPPET_LENGTH,
  );
}

function isInsideAlreadyCapturedOpenDisclosure(element: WebsiteKompisEmbedParentElement): boolean {
  if (!element.closest) return false;
  const openDetails = element.closest("details[open], details");
  if (openDetails) {
    const details = openDetails as WebsiteKompisEmbedParentElement;
    if (isOpenDetailsElement(details)) return true;
  }
  let node: WebsiteKompisEmbedParentElement | null | undefined = element;
  for (let depth = 0; node && depth < 8; depth += 1) {
    if (EMBED_PARENT_ANSWER_PANEL_CLASS_HINT.test(embedParentClassName(node))) {
      return isEmbedParentElementVisiblyOpen(node);
    }
    node = node.parentElement ?? null;
  }
  return false;
}

function collectOpenDisclosureTextSnippets(
  documentLike: WebsiteKompisEmbedParentDocument,
  snippets: string[],
  push: (raw: string, minLength: number) => void,
): void {
  for (const details of documentLike.querySelectorAll(EMBED_PARENT_OPEN_DETAILS_SELECTOR)) {
    if (snippets.length >= WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_TEXT_SNIPPETS) break;
    if (isInsideEmbedParentUnsafeContent(details) || isInsideEmbedParentChrome(details)) continue;
    if (!isOpenDetailsElement(details) || !isEmbedParentElementVisiblyOpen(details)) continue;
    const summary = details.querySelector?.("summary");
    const formatted = formatOpenPanelSnippet(summary?.textContent ?? "", detailsAnswerText(details));
    if (formatted) push(formatted, 12);
  }

  for (const control of documentLike.querySelectorAll(EMBED_PARENT_EXPANDED_CONTROL_SELECTOR)) {
    if (snippets.length >= WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_TEXT_SNIPPETS) break;
    if (isInsideEmbedParentUnsafeContent(control) || isInsideEmbedParentChrome(control)) continue;
    if (control.getAttribute?.("aria-expanded") !== "true") continue;
    const panel = resolveExpandedAnswerPanel(control, documentLike);
    if (!panel) continue;
    if (isInsideEmbedParentUnsafeContent(panel) || isInsideEmbedParentChrome(panel)) continue;
    if (!isEmbedParentElementVisiblyOpen(panel)) continue;
    // Skip panels already covered via open <details>.
    if (panel.closest?.("details[open], details") && isOpenDetailsElement(
      (panel.closest("details[open], details") as WebsiteKompisEmbedParentElement) ?? panel,
    )) {
      continue;
    }
    const formatted = formatOpenPanelSnippet(control.textContent ?? "", panel.textContent ?? "");
    if (formatted) push(formatted, 12);
  }

  for (const panel of documentLike.querySelectorAll(EMBED_PARENT_ANSWER_PANEL_SELECTOR)) {
    if (snippets.length >= WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_TEXT_SNIPPETS) break;
    if (isInsideEmbedParentUnsafeContent(panel) || isInsideEmbedParentChrome(panel)) continue;
    if (!isEmbedParentElementVisiblyOpen(panel)) continue;
    if (panel.closest?.("details") && !isOpenDetailsElement(
      (panel.closest("details") as WebsiteKompisEmbedParentElement) ?? panel,
    )) {
      continue;
    }
    const panelId = typeof panel.id === "string" ? panel.id.trim() : panel.getAttribute?.("id")?.trim();
    if (panelId) {
      let controlledByExpanded = false;
      let controlledByCollapsed = false;
      for (const control of documentLike.querySelectorAll(
        "main [aria-expanded], article [aria-expanded], [role='main'] [aria-expanded], [class*='faq'] [aria-expanded], [class*='Faq'] [aria-expanded], [class*='accordion'] [aria-expanded], section [aria-expanded]",
      )) {
        if (control.getAttribute?.("aria-controls")?.trim() !== panelId) continue;
        if (control.getAttribute?.("aria-expanded") === "true") controlledByExpanded = true;
        if (control.getAttribute?.("aria-expanded") === "false") controlledByCollapsed = true;
      }
      if (controlledByCollapsed && !controlledByExpanded) continue;
    }
    const question = findAssociatedDisclosureQuestion(panel, documentLike);
    const formatted = formatOpenPanelSnippet(question, panel.textContent ?? "");
    if (formatted) push(formatted, 12);
  }
}

function collectEmbedParentHeadings(
  documentLike: WebsiteKompisEmbedParentDocument,
): WebsiteKompisPublicPageHeading[] {
  const headings: WebsiteKompisPublicPageHeading[] = [];

  for (const element of documentLike.querySelectorAll("h1, h2")) {
    if (isInsideEmbedParentSkipZone(element)) continue;
    const tagName = typeof element.tagName === "string" ? element.tagName.toUpperCase() : "";
    const level = tagName === "H1" ? 1 : tagName === "H2" ? 2 : null;
    if (!level) continue;
    const text = sanitizePlainText(element.textContent ?? "", WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_HEADING_LENGTH);
    if (!text) continue;
    headings.push({ level, text });
    if (headings.length >= WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_HEADINGS) break;
  }

  return headings;
}

function collectEmbedParentTextSnippets(
  documentLike: WebsiteKompisEmbedParentDocument,
): string[] {
  const snippets: string[] = [];
  const push = (raw: string, minLength: number) => {
    const text = sanitizePlainText(raw, WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_TEXT_SNIPPET_LENGTH);
    if (!text || text.length < minLength) return;
    if (snippets.includes(text)) return;
    // Skip shorter duplicates already covered by an open-panel snippet.
    const lower = text.toLowerCase();
    if (snippets.some((existing) => existing.toLowerCase().includes(lower))) {
      return;
    }
    if (snippets.length >= WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_TEXT_SNIPPETS) return;
    snippets.push(text);
  };

  // Open FAQ/accordion panels first so early generic paragraphs cannot displace them.
  collectOpenDisclosureTextSnippets(documentLike, snippets, push);

  for (const element of documentLike.querySelectorAll(
    "main [class*='product'], main [class*='Product'], main [class*='offer'], main [data-product], main article, [role='main'] article, main li",
  )) {
    if (snippets.length >= WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_TEXT_SNIPPETS) break;
    if (isInsideEmbedParentSkipZone(element)) continue;
    const text = sanitizePlainText(
      element.textContent ?? "",
      WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_TEXT_SNIPPET_LENGTH,
    );
    if (!textLooksLikePublishedPrice(text)) continue;
    push(text, 16);
  }

  for (const element of documentLike.querySelectorAll("main p, article p, [role='main'] p, body > p")) {
    if (snippets.length >= WEBSITE_KOMPIS_PAGE_CONTEXT_MAX_TEXT_SNIPPETS) break;
    if (isInsideEmbedParentSkipZone(element)) continue;
    if (isInsideAlreadyCapturedOpenDisclosure(element)) continue;
    push(element.textContent ?? "", 24);
  }

  return snippets;
}

/** Safe current-page capture for parent-site embed loader (testable DOM shape). */
export function collectWebsiteKompisEmbedParentPageContext(input: {
  location: { pathname: string; href?: string };
  document: WebsiteKompisEmbedParentDocument;
  locale?: string;
}): WebsiteKompisPublicPageContext | undefined {
  const pathname = input.location.pathname?.trim().slice(0, COMPANION_SUBMIT_PAGE_CONTEXT_MAX_PATHNAME_LENGTH) ?? "";
  if (!pathname.startsWith("/") || isPrivateWebsiteKompisPathname(pathname)) {
    return undefined;
  }

  const title = sanitizePlainText(input.document.title ?? "", COMPANION_SUBMIT_PAGE_CONTEXT_MAX_TITLE_LENGTH);
  const metaDescription = sanitizePlainText(
    input.document.querySelector('meta[name="description"]')?.getAttribute?.("content") ?? "",
    COMPANION_SUBMIT_PAGE_CONTEXT_MAX_META_DESCRIPTION_LENGTH,
  );
  const canonicalUrl = sanitizeCanonicalUrl(
    input.document.querySelector('link[rel="canonical"]')?.getAttribute?.("href") ??
      input.location.href ??
      "",
  );
  const headings = collectEmbedParentHeadings(input.document);
  const textSnippets = collectEmbedParentTextSnippets(input.document);

  return sanitizeWebsiteKompisPublicPageContext({
    pathname,
    title: title || undefined,
    metaDescription: metaDescription || undefined,
    canonicalUrl,
    locale: input.locale,
    surface: "public",
    headings: headings.length > 0 ? headings : undefined,
    textSnippets: textSnippets.length > 0 ? textSnippets : undefined,
    capturedAt: new Date().toISOString(),
  });
}
