import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { WebsiteStagingEnsureResult } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asStringOrNull(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

export type WebsiteStagingEnsureRpcResult =
  | { ok: true; value: WebsiteStagingEnsureResult }
  | { ok: false; errorCode: string; rawMessage: string };

function mapEnsureResult(raw: unknown): WebsiteStagingEnsureResult {
  const row = asRecord(raw);
  const website = asRecord(row.website);
  const accessToken = asRecord(row.access_token);

  return {
    environmentId: String(row.environment_id ?? ""),
    organizationId: String(row.organization_id ?? ""),
    websiteId: asStringOrNull(row.website_id),
    installationId: asStringOrNull(row.installation_id),
    domainId: asStringOrNull(row.domain_id),
    stagingHostKey: typeof row.staging_host_key === "string" ? row.staging_host_key : "",
    status: (row.status as WebsiteStagingEnsureResult["status"]) ?? "active",
    created: row.created === true,
    idempotentReplay: row.idempotent_replay === true,
    website:
      website.id != null
        ? {
            id: String(website.id),
            status: typeof website.status === "string" ? website.status : "provisioned",
            currentVersionId: asStringOrNull(website.current_version_id),
          }
        : null,
    accessToken:
      typeof accessToken.token === "string"
        ? { token: accessToken.token, expiresAt: String(accessToken.expires_at ?? "") }
        : null,
    accessTokenPresent: row.access_token_present === true,
  };
}

/**
 * Idempotently ensures the single internal staging environment exists.
 * Never creates an auth user, never sends email, never touches billing —
 * see `ensure_website_staging_environment` in
 * `20261935700000_platform_website_staging_verification_v2.sql`.
 */
export async function ensureWebsiteStagingEnvironment(
  supabase: SupabaseClient,
  input: { internalReason: string; confirmation: boolean; idempotencyKey: string },
): Promise<WebsiteStagingEnsureRpcResult> {
  const { data, error } = await supabase.rpc("ensure_website_staging_environment", {
    p_internal_reason: input.internalReason,
    p_confirmation: input.confirmation,
    p_idempotency_key: input.idempotencyKey,
  });
  if (error) {
    return { ok: false, errorCode: "ensure_environment_failed", rawMessage: error.message };
  }
  return { ok: true, value: mapEnsureResult(data) };
}
