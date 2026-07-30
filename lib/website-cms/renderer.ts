/**
 * Pure helpers for the public website renderer (`/api/public/website/render`
 * and the optional public renderer page). No Supabase access here — callers
 * fetch `get_public_website_active_version` and pass the manifest in.
 */

import type { WebsiteCmsManifest, WebsiteCmsManifestPage, WebsiteCmsPublicResolvedVersion } from "./types";

export function normalizeRenderPath(path: string | null | undefined): string {
  if (!path || path === "" || path === "/") return "/";
  const trimmed = path.startsWith("/") ? path : `/${path}`;
  return trimmed.length > 1 && trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
}

export function findManifestPage(
  manifest: WebsiteCmsManifest | null | undefined,
  path: string,
  locale: string,
): WebsiteCmsManifestPage | null {
  if (!manifest) return null;
  const normalized = normalizeRenderPath(path);
  const requestedLocale = locale || manifest.defaultLocale;
  const exact = manifest.pages.find(
    (page) => normalizeRenderPath(page.path) === normalized && page.locale === requestedLocale,
  );
  if (exact) return exact;
  return (
    manifest.pages.find(
      (page) => normalizeRenderPath(page.path) === normalized && page.locale === manifest.defaultLocale,
    ) ?? null
  );
}

export type RenderRobotsMode = "index" | "noindex";

/** Preview and unverified resolutions must never be indexable. */
export function resolveRenderRobotsMode(input: {
  isPreview: boolean;
  resolved: Pick<WebsiteCmsPublicResolvedVersion, "ok">;
}): RenderRobotsMode {
  if (input.isPreview) return "noindex";
  return input.resolved.ok ? "index" : "noindex";
}

export function robotsHeaderValue(mode: RenderRobotsMode): string {
  return mode === "noindex" ? "noindex, nofollow" : "index, follow";
}

export type PublicRenderResult =
  | {
      ok: true;
      page: WebsiteCmsManifestPage;
      locale: string;
      activeLocales: readonly string[];
      versionNumber: number;
      publishedAt: string | null;
    }
  | { ok: false; reason: string };

export function resolvePublicRenderResult(
  resolved: WebsiteCmsPublicResolvedVersion,
  path: string,
  requestedLocale: string | null,
): PublicRenderResult {
  if (!resolved.ok || !resolved.manifest) {
    return { ok: false, reason: resolved.reason ?? "not_found" };
  }
  const locale = requestedLocale && resolved.activeLocales?.includes(requestedLocale)
    ? requestedLocale
    : (resolved.defaultLocale ?? resolved.manifest.defaultLocale);
  const page = findManifestPage(resolved.manifest, path, locale);
  if (!page) {
    return { ok: false, reason: "page_not_found" };
  }
  return {
    ok: true,
    page,
    locale,
    activeLocales: resolved.activeLocales ?? resolved.manifest.locales,
    versionNumber: resolved.versionNumber ?? 0,
    publishedAt: resolved.publishedAt ?? null,
  };
}
