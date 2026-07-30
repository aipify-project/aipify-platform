import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createPublicAnonSupabaseClient } from "../supabase/public-anon";
import type { WebsiteCmsContext, WebsiteCmsPublicResolvedVersion } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function emptyWebsiteCmsContext(): WebsiteCmsContext {
  return {
    available: false,
    organizationId: null,
    domain: null,
    installationId: null,
    acknowledgementOk: false,
    website: null,
    currentVersion: null,
    capabilities: {
      authoritativePageModel: false,
      draftCapability: false,
      previewCapability: false,
      publishCapability: false,
      rollbackCapability: false,
    },
  };
}

export async function resolveWebsiteCmsContext(supabase: SupabaseClient): Promise<WebsiteCmsContext> {
  const { data, error } = await supabase.rpc("get_customer_website_cms_context");
  if (error) return emptyWebsiteCmsContext();

  const payload = asRecord(data);
  if (payload.available !== true) return emptyWebsiteCmsContext();

  const website = asRecord(payload.website);
  const version = asRecord(payload.current_version);
  const capabilities = asRecord(payload.capabilities);
  const acknowledgement = asRecord(payload.acknowledgement);

  return {
    available: true,
    organizationId: typeof payload.organization_id === "string" ? payload.organization_id : null,
    domain: typeof payload.domain === "string" ? payload.domain : null,
    installationId: typeof payload.installation_id === "string" ? payload.installation_id : null,
    acknowledgementOk: acknowledgement.ok === true,
    website:
      website.id != null
        ? {
            id: String(website.id),
            status:
              (website.status as "provisioned" | "ready" | "attention" | "archived") ?? "provisioned",
            domainId: typeof website.domain_id === "string" ? website.domain_id : null,
            installationId: typeof website.installation_id === "string" ? website.installation_id : null,
            defaultLocale: typeof website.default_locale === "string" ? website.default_locale : "en",
            activeLocales: asStringArray(website.active_locales),
            currentVersionId:
              typeof website.current_version_id === "string" ? website.current_version_id : null,
            createdAt: typeof website.created_at === "string" ? website.created_at : null,
            updatedAt: typeof website.updated_at === "string" ? website.updated_at : null,
          }
        : null,
    currentVersion:
      version.id != null
        ? {
            id: String(version.id),
            versionNumber: Number(version.version_number ?? 0),
            status: (version.status as "candidate" | "published" | "superseded" | "failed") ?? "candidate",
            contentChecksum: typeof version.content_checksum === "string" ? version.content_checksum : "",
            manifestChecksum:
              typeof version.manifest_checksum === "string" ? version.manifest_checksum : "",
            changeSummary: typeof version.change_summary === "string" ? version.change_summary : null,
            previewVerifiedAt:
              typeof version.preview_verified_at === "string" ? version.preview_verified_at : null,
            createdAt: typeof version.created_at === "string" ? version.created_at : null,
          }
        : null,
    capabilities: {
      authoritativePageModel: capabilities.authoritative_page_model === true,
      draftCapability: capabilities.draft_capability === true,
      previewCapability: capabilities.preview_capability === true,
      publishCapability: capabilities.publish_capability === true,
      rollbackCapability: capabilities.rollback_capability === true,
    },
  };
}

/**
 * Public, anon-safe resolve used by the domain renderer (`/api/public/website/render`).
 * Never exposes install tokens or secrets — only the published manifest subset.
 */
export async function resolvePublicWebsiteActiveVersion(
  domain: string,
): Promise<WebsiteCmsPublicResolvedVersion> {
  const anon = createPublicAnonSupabaseClient();
  const { data, error } = await anon.rpc("get_public_website_active_version", { p_domain: domain });
  if (error) return { ok: false, reason: "resolve_failed" };

  const row = asRecord(data);
  if (row.ok !== true) {
    return { ok: false, reason: typeof row.reason === "string" ? row.reason : "not_found" };
  }

  const manifestRaw = asRecord(row.manifest);
  return {
    ok: true,
    domain: typeof row.domain === "string" ? row.domain : domain,
    websiteId: typeof row.website_id === "string" ? row.website_id : undefined,
    versionId: typeof row.version_id === "string" ? row.version_id : undefined,
    versionNumber: typeof row.version_number === "number" ? row.version_number : undefined,
    defaultLocale: typeof row.default_locale === "string" ? row.default_locale : undefined,
    activeLocales: asStringArray(row.active_locales),
    manifest: {
      pages: Array.isArray(manifestRaw.pages)
        ? manifestRaw.pages.map((page) => {
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
      extras: Array.isArray(manifestRaw.extras) ? manifestRaw.extras.map(asRecord) : [],
      locales: asStringArray(manifestRaw.locales),
      defaultLocale: typeof manifestRaw.default_locale === "string" ? manifestRaw.default_locale : "en",
      generatedAt: typeof manifestRaw.generated_at === "string" ? manifestRaw.generated_at : null,
    },
    contentChecksum: typeof row.content_checksum === "string" ? row.content_checksum : undefined,
    manifestChecksum: typeof row.manifest_checksum === "string" ? row.manifest_checksum : undefined,
    publishedAt: typeof row.published_at === "string" ? row.published_at : undefined,
  };
}

export async function ensureCustomerWebsite(
  supabase: SupabaseClient,
  internalReason: string,
): Promise<
  | { ok: true; websiteId: string; created: boolean }
  | { ok: false; errorCode: string; rawMessage: string }
> {
  const { data, error } = await supabase.rpc("ensure_customer_website", {
    p_internal_reason: internalReason,
  });
  if (error) {
    return { ok: false, errorCode: "ensure_website_failed", rawMessage: error.message };
  }
  const row = asRecord(data);
  return { ok: true, websiteId: String(row.id ?? ""), created: row.created === true };
}
