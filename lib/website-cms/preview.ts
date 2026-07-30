import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { WebsiteCmsManifest } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asManifest(value: unknown): WebsiteCmsManifest {
  const manifest = asRecord(value);
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
    locales: Array.isArray(manifest.locales) ? manifest.locales.filter((l): l is string => typeof l === "string") : [],
    defaultLocale: typeof manifest.default_locale === "string" ? manifest.default_locale : "en",
    generatedAt: typeof manifest.generated_at === "string" ? manifest.generated_at : null,
  };
}

export type CreatePreviewResult =
  | {
      ok: true;
      previewId: string;
      versionId: string;
      locale: string;
      noindex: boolean;
      expiresAt: string;
    }
  | { ok: false; errorCode: string };

export async function createWebsiteVersionPreview(
  supabase: SupabaseClient,
  versionId: string,
  locale: string,
): Promise<CreatePreviewResult> {
  const { data, error } = await supabase.rpc("create_customer_website_version_preview", {
    p_version_id: versionId,
    p_locale: locale,
  });
  if (error) {
    return { ok: false, errorCode: /VERSION_NOT_FOUND/.test(error.message) ? "version_not_found" : "preview_create_failed" };
  }
  const row = asRecord(data);
  return {
    ok: true,
    previewId: String(row.id ?? ""),
    versionId: String(row.version_id ?? versionId),
    locale: typeof row.locale === "string" ? row.locale : locale,
    noindex: row.noindex !== false,
    expiresAt: typeof row.expires_at === "string" ? row.expires_at : new Date(Date.now() + 3600_000).toISOString(),
  };
}

export type MarkPreviewVerifiedResult =
  | { ok: true; previewVerifiedAt: string }
  | { ok: false; errorCode: string };

export async function markWebsitePreviewVerified(
  supabase: SupabaseClient,
  versionId: string,
): Promise<MarkPreviewVerifiedResult> {
  const { data, error } = await supabase.rpc("mark_customer_website_preview_verified", {
    p_version_id: versionId,
  });
  if (error) {
    const code = /PREVIEW_NOT_FOUND/.test(error.message)
      ? "preview_not_found"
      : /VERSION_NOT_CANDIDATE/.test(error.message)
        ? "version_not_candidate"
        : "preview_verify_failed";
    return { ok: false, errorCode: code };
  }
  const row = asRecord(data);
  return { ok: true, previewVerifiedAt: String(row.preview_verified_at ?? new Date().toISOString()) };
}

/** True while `expiresAt` is still in the future relative to `now`. */
export function isPreviewActive(expiresAt: string, now: Date = new Date()): boolean {
  const expiry = new Date(expiresAt).getTime();
  if (Number.isNaN(expiry)) return false;
  return expiry > now.getTime();
}

export type ResolvedWebsitePreview =
  | {
      ok: true;
      previewId: string;
      versionId: string;
      versionNumber: number;
      versionStatus: string;
      locale: string;
      noindex: boolean;
      expiresAt: string;
      expired: boolean;
      manifest: WebsiteCmsManifest;
    }
  | { ok: false; errorCode: string };

/**
 * Finds a preview by its own id. There is no dedicated "get preview by id" RPC
 * (V1 keeps the RPC surface to the two locked migrations), so this walks the
 * tenant's versions — capped at the RPC's own limit — and reads each version's
 * preview list until it finds a match. Fine for V1 scale (few versions/previews
 * per tenant); revisit with a direct lookup RPC if version counts grow large.
 */
export async function resolveWebsitePreviewById(
  supabase: SupabaseClient,
  previewId: string,
): Promise<ResolvedWebsitePreview> {
  const { data: listData, error: listError } = await supabase.rpc("get_customer_website_versions", {
    p_limit: 100,
  });
  if (listError) return { ok: false, errorCode: "preview_not_found" };

  const list = asRecord(listData);
  const versions = Array.isArray(list.versions) ? list.versions : [];

  for (const entry of versions) {
    const summary = asRecord(entry);
    const versionId = typeof summary.id === "string" ? summary.id : "";
    if (!versionId) continue;

    const { data: detailData, error: detailError } = await supabase.rpc(
      "get_customer_website_version_detail",
      { p_version_id: versionId },
    );
    if (detailError) continue;

    const detail = asRecord(detailData);
    const previews = Array.isArray(detail.previews) ? detail.previews : [];
    const match = previews.find((preview) => asRecord(preview).id === previewId);
    if (!match) continue;

    const previewRow = asRecord(match);
    return {
      ok: true,
      previewId,
      versionId,
      versionNumber: Number(detail.version_number ?? 0),
      versionStatus: typeof detail.status === "string" ? detail.status : "candidate",
      locale: typeof previewRow.locale === "string" ? previewRow.locale : "en",
      noindex: previewRow.noindex !== false,
      expiresAt: typeof previewRow.expires_at === "string" ? previewRow.expires_at : "",
      expired: previewRow.expired === true,
      manifest: asManifest(detail.manifest),
    };
  }

  return { ok: false, errorCode: "preview_not_found" };
}
