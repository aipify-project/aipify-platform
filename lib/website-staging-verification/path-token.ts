import "server-only";

import { createPublicAnonSupabaseClient } from "@/lib/supabase/public-anon";
import type { WebsiteCmsManifest } from "@/lib/website-cms/types";
import type { WebsiteStagingPublicResolvedToken } from "./types";

/**
 * Loose shape check for the opaque path token before it ever reaches the
 * database. Real tokens are `aipify_` + base64url from
 * `generate_installation_token()`. This never gates resolution on its own —
 * `resolve_website_staging_access_token` is the authoritative check.
 */
const TOKEN_PATTERN = /^aipify_[A-Za-z0-9_-]{16,96}$/;

export function isPlausibleWebsiteStagingToken(token: unknown): token is string {
  return typeof token === "string" && TOKEN_PATTERN.test(token);
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function mapManifest(raw: unknown): WebsiteCmsManifest {
  const manifest = asRecord(raw);
  return {
    pages: Array.isArray(manifest.pages)
      ? manifest.pages.map((page) => {
          const p = asRecord(page);
          return {
            pageId: String(p.page_id ?? p.id ?? ""),
            path: typeof p.path === "string" ? p.path : "/",
            locale: typeof p.locale === "string" ? p.locale : "en",
            revisionNumber: Number(p.revision_number ?? 0),
            title: typeof p.title === "string" ? p.title : "",
            content: asRecord(p.content),
            seo: asRecord(p.seo),
            contentChecksum: typeof p.content_checksum === "string" ? p.content_checksum : "",
          };
        })
      : [],
    extras: Array.isArray(manifest.extras) ? manifest.extras.map(asRecord) : [],
    locales: asStringArray(manifest.locales),
    defaultLocale: typeof manifest.default_locale === "string" ? manifest.default_locale : "en",
    generatedAt: typeof manifest.generated_at === "string" ? manifest.generated_at : null,
  };
}

/**
 * Public, anon-safe token resolve used by the staging path renderer
 * (`/website-staging/[token]/[[...path]]`). Never exposes install tokens,
 * organization identity, or any secret — only the published manifest
 * subset, always flagged `noindex`.
 */
export async function resolveWebsiteStagingAccessToken(token: string): Promise<WebsiteStagingPublicResolvedToken> {
  if (!isPlausibleWebsiteStagingToken(token)) {
    return { ok: false, reason: "invalid_or_expired" };
  }

  const anon = createPublicAnonSupabaseClient();
  const { data, error } = await anon.rpc("resolve_website_staging_access_token", { p_token: token });
  if (error) return { ok: false, reason: "resolve_failed" };

  const row = asRecord(data);
  if (row.ok !== true) {
    return { ok: false, reason: typeof row.reason === "string" ? row.reason : "invalid_or_expired" };
  }

  return {
    ok: true,
    environmentId: String(row.environment_id ?? ""),
    websiteId: String(row.website_id ?? ""),
    versionId: String(row.version_id ?? ""),
    versionNumber: Number(row.version_number ?? 0),
    defaultLocale: typeof row.default_locale === "string" ? row.default_locale : "en",
    activeLocales: asStringArray(row.active_locales),
    manifest: mapManifest(row.manifest),
    contentChecksum: typeof row.content_checksum === "string" ? row.content_checksum : "",
    manifestChecksum: typeof row.manifest_checksum === "string" ? row.manifest_checksum : "",
    publishedAt: typeof row.published_at === "string" ? row.published_at : null,
    noindex: true,
  };
}
