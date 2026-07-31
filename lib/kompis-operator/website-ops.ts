import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { discoverOperatorLocales } from "./locales";
import type { KompisWebsiteContext } from "./website-context";

export const WEBSITE_DRAFT_KINDS = [
  "website_page",
  "website_seo",
  "website_navigation",
  "website_translation",
  "website_section",
  "website_image_metadata",
] as const;

export type WebsiteDraftKind = (typeof WEBSITE_DRAFT_KINDS)[number];

export function isWebsiteDraftKind(value: string): value is WebsiteDraftKind {
  return (WEBSITE_DRAFT_KINDS as readonly string[]).includes(value);
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function sanitizePath(path: unknown): string | null {
  if (typeof path !== "string") return null;
  const trimmed = path.trim();
  if (!trimmed.startsWith("/")) return null;
  if (trimmed.includes("://") || trimmed.includes("..") || trimmed.includes("<")) return null;
  if (trimmed.length > 200) return null;
  return trimmed;
}

function containsForbiddenMarkup(text: string): boolean {
  return /<\s*script|javascript:|on\w+\s*=|<\s*iframe/i.test(text);
}

export async function listWebsiteDraftPages(supabase: SupabaseClient, limit = 50) {
  const { data, error } = await supabase.rpc("list_app_kompis_operator_drafts", {
    p_limit: Math.min(Math.max(limit, 1), 100),
  });
  if (error) return { ok: false as const, errorCode: "website_pages_read_failed", pages: [] as Record<string, unknown>[] };
  const drafts = asArray(asRecord(data).drafts)
    .map((item) => asRecord(item))
    .filter((row) => typeof row.draft_kind === "string" && String(row.draft_kind).startsWith("website_"))
    .map((row) => ({
      id: row.id ?? null,
      title: row.title ?? null,
      path: asRecord(row.body).path ?? null,
      locale: row.locale ?? null,
      status: row.status ?? "draft",
      draftKind: row.draft_kind ?? null,
      version: row.version ?? null,
      updatedAt: row.updated_at ?? null,
      published: false,
      source: "operator_draft",
    }));
  return {
    ok: true as const,
    pages: drafts,
    authoritativePageModel: false,
    inventoryNote: "operator_website_drafts_only",
  };
}

export function buildWebsiteSeoAudit(input: {
  context: KompisWebsiteContext;
  pages: Array<Record<string, unknown>>;
}) {
  /** Codes only — UI resolves localized copy. Never emit English detail as primary text. */
  const findings: Array<{
    code: string;
    severity: "info" | "warning" | "danger";
    pageId: string | null;
  }> = [];

  if (!input.context.acknowledgementOk) {
    findings.push({
      code: "runtime_acknowledgement_missing",
      severity: "warning",
      pageId: null,
    });
  }
  if (!input.context.primaryDomain) {
    findings.push({
      code: "primary_domain_missing",
      severity: "warning",
      pageId: null,
    });
  }
  findings.push({
    code: "crawl_unavailable",
    severity: "info",
    pageId: null,
  });

  for (const page of input.pages) {
    const body = asRecord(page.body ?? page);
    const pageId = typeof page.id === "string" ? page.id : null;
    const title = typeof page.title === "string" ? page.title : typeof body.title === "string" ? body.title : "";
    const metaDescription =
      typeof body.metaDescription === "string"
        ? body.metaDescription
        : typeof body.meta_description === "string"
          ? body.meta_description
          : "";
    const canonical =
      typeof body.canonicalUrl === "string"
        ? body.canonicalUrl
        : typeof body.canonical === "string"
          ? body.canonical
          : "";
    const altText = typeof body.altText === "string" ? body.altText : "";
    if (!title.trim()) {
      findings.push({
        code: "missing_title",
        severity: "warning",
        pageId,
      });
    }
    if (!metaDescription.trim()) {
      findings.push({
        code: "missing_meta_description",
        severity: "warning",
        pageId,
      });
    }
    if (!canonical.trim()) {
      findings.push({
        code: "missing_canonical",
        severity: "info",
        pageId,
      });
    }
    if (page.draftKind === "website_image_metadata" && !altText.trim()) {
      findings.push({
        code: "missing_alt_text",
        severity: "warning",
        pageId,
      });
    }
  }

  // Deduplicate by code + page before returning (presentation layer also dedupes with locale/revision).
  const seen = new Set<string>();
  const deduped = findings.filter((finding) => {
    const key = `${finding.code}|${finding.pageId ?? "global"}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    auditedAt: new Date().toISOString(),
    crawlAvailable: false,
    authoritativePageModel: false,
    findingCount: deduped.length,
    findings: deduped.slice(0, 100),
  };
}

export function buildWebsiteContentQualityAudit(pages: Array<Record<string, unknown>>) {
  const findings: Array<{ code: string; severity: "info" | "warning"; pageId: string | null }> = [];
  for (const page of pages) {
    const body = asRecord(page.body ?? page);
    const text =
      typeof body.text === "string"
        ? body.text
        : typeof body.content === "string"
          ? body.content
          : "";
    const pageId = typeof page.id === "string" ? page.id : null;
    if (!text.trim()) {
      findings.push({
        code: "empty_content",
        severity: "warning",
        pageId,
      });
    }
    if (/customerApp\.|platform\./.test(text)) {
      findings.push({
        code: "raw_translation_key",
        severity: "warning",
        pageId,
      });
    }
    if (containsForbiddenMarkup(text)) {
      findings.push({
        code: "forbidden_markup",
        severity: "warning",
        pageId,
      });
    }
  }
  const seen = new Set<string>();
  const deduped = findings.filter((finding) => {
    const key = `${finding.code}|${finding.pageId ?? "global"}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return {
    auditedAt: new Date().toISOString(),
    findingCount: deduped.length,
    findings: deduped.slice(0, 100),
  };
}

export function buildWebsiteLocaleCoverage(pages: Array<Record<string, unknown>>) {
  const activeLocales = discoverOperatorLocales();
  const counts: Record<string, number> = {};
  for (const locale of activeLocales) counts[locale] = 0;
  for (const page of pages) {
    const locale = typeof page.locale === "string" ? page.locale : "";
    if (locale in counts) counts[locale] += 1;
  }
  const missing = activeLocales.filter((locale) => (counts[locale] ?? 0) === 0);
  return {
    activeLocales,
    pagesPerLocale: counts,
    missingTranslations: missing,
    fallbackStatus: "central_english_fallback",
    defaultLocale: activeLocales.includes("en" as never) ? "en" : activeLocales[0] ?? "en",
    localeGaps: missing.length,
  };
}

export function buildWebsiteDraftPreview(draft: Record<string, unknown>) {
  const body = asRecord(draft.body);
  const before = asRecord(body.before ?? {});
  const after = {
    title: draft.title ?? null,
    path: body.path ?? null,
    locale: draft.locale ?? null,
    metaDescription: body.metaDescription ?? body.meta_description ?? null,
    canonicalUrl: body.canonicalUrl ?? body.canonical ?? null,
    text: typeof body.text === "string" ? body.text.slice(0, 2000) : null,
    navigation: body.navigation ?? null,
    altText: body.altText ?? null,
  };
  return {
    draftId: draft.id ?? null,
    revision: draft.version ?? null,
    locale: draft.locale ?? null,
    draftKind: draft.draft_kind ?? null,
    noindex: true,
    productionUnchanged: true,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    before,
    after,
    affectedPages: [body.path ?? draft.title ?? draft.id].filter(Boolean),
    affectedLocales: [draft.locale].filter(Boolean),
  };
}

export function validateWebsiteDraftInput(input: {
  kind: WebsiteDraftKind;
  title?: unknown;
  locale?: unknown;
  path?: unknown;
  text?: unknown;
  metaDescription?: unknown;
  canonicalUrl?: unknown;
  altText?: unknown;
  navigation?: unknown;
  activeLocales: readonly string[];
}): { ok: true; body: Record<string, unknown>; title: string; locale: string } | { ok: false; errorCode: string } {
  const locale = typeof input.locale === "string" ? input.locale.trim() : "";
  if (!locale || !input.activeLocales.includes(locale as never)) {
    return { ok: false, errorCode: "invalid_or_inactive_locale" };
  }
  const title =
    typeof input.title === "string" && input.title.trim()
      ? input.title.trim().slice(0, 200)
      : "Website draft";
  const text = typeof input.text === "string" ? input.text.slice(0, 4000) : "";
  if (containsForbiddenMarkup(text)) {
    return { ok: false, errorCode: "forbidden_markup" };
  }
  const path = sanitizePath(input.path);
  if ((input.kind === "website_page" || input.kind === "website_seo") && input.path != null && !path) {
    return { ok: false, errorCode: "invalid_path" };
  }
  if (input.kind === "website_navigation" && input.navigation != null) {
    if (!Array.isArray(input.navigation)) {
      return { ok: false, errorCode: "invalid_navigation" };
    }
  }
  return {
    ok: true,
    title,
    locale,
    body: {
      text,
      path,
      metaDescription:
        typeof input.metaDescription === "string" ? input.metaDescription.slice(0, 320) : null,
      canonicalUrl:
        typeof input.canonicalUrl === "string" ? input.canonicalUrl.slice(0, 500) : null,
      altText: typeof input.altText === "string" ? input.altText.slice(0, 240) : null,
      navigation: Array.isArray(input.navigation) ? input.navigation.slice(0, 40) : null,
      source: "kompis_operator_website_ops_v4",
      aiGenerated: true,
      published: false,
    },
  };
}
