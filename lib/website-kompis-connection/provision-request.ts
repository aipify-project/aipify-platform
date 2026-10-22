import {
  WEBSITE_KOMPIS_SITE_PROVISION_LIVE,
  websiteKompisSiteProvisionDecision,
} from "./provision-gate";

const DOMAIN_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const KNOWN_PROVISION_ERRORS = new Set([
  "confirmation_required",
  "not_authenticated",
  "domain_not_available",
  "domain_not_verified",
  "domain_not_active",
  "domain_license_not_valid",
  "domain_license_capacity_unrecorded",
  "domain_license_capacity_exceeded",
  "website_kompis_not_entitled",
  "hostname_not_available",
  "company_not_recorded",
  "installation_not_usable",
  "installation_binding_failed",
  "Owner or admin role required",
]);

export type WebsiteKompisProvisionRpc = {
  rpc: (
    fn: "provision_website_kompis_site",
    args: { p_domain_id: string; p_confirmation: true },
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export type WebsiteKompisProvisionResult =
  | { ok: false; code: string; httpStatus: number }
  | { ok: true; installationId: string; domain: string; created: boolean; httpStatus: 200 };

export function websiteKompisSiteProvisionIsLive(): boolean {
  return WEBSITE_KOMPIS_SITE_PROVISION_LIVE;
}

export function interpretProvisionRpcResult(data: unknown): WebsiteKompisProvisionResult {
  if (!data || typeof data !== "object") {
    return { ok: false, code: "provision_failed", httpStatus: 502 };
  }
  const row = data as Record<string, unknown>;
  if (
    row.token_returned !== false
    || "installation_token" in row
    || "token" in row
    || "installation_token_hash" in row
  ) {
    return { ok: false, code: "provision_failed", httpStatus: 502 };
  }
  if (typeof row.installation_id !== "string" || typeof row.domain !== "string" || typeof row.created !== "boolean") {
    return { ok: false, code: "provision_failed", httpStatus: 502 };
  }
  return {
    ok: true,
    installationId: row.installation_id,
    domain: row.domain,
    created: row.created,
    httpStatus: 200,
  };
}

export function mapProvisionError(message: string): string {
  if (message === "Owner or admin role required") return "management_role_required";
  if (KNOWN_PROVISION_ERRORS.has(message)) return message;
  return "provision_failed";
}

/**
 * Calls provision_website_kompis_site only when the live gate is on.
 * The gate is off until the migration is in Production and a later approval enables it.
 * Customer and organization ids in the input are ignored. The database resolves the tenant.
 */
export async function requestWebsiteKompisSiteProvision(
  supabase: WebsiteKompisProvisionRpc,
  input: { domainId?: unknown; confirmation?: unknown },
): Promise<WebsiteKompisProvisionResult> {
  if (!websiteKompisSiteProvisionIsLive()) {
    return websiteKompisSiteProvisionDecision();
  }
  if (input.confirmation !== true) {
    return { ok: false, code: "confirmation_required", httpStatus: 409 };
  }
  if (typeof input.domainId !== "string" || !DOMAIN_ID.test(input.domainId)) {
    return { ok: false, code: "domain_not_available", httpStatus: 409 };
  }

  const { data, error } = await supabase.rpc("provision_website_kompis_site", {
    p_domain_id: input.domainId,
    p_confirmation: true,
  });
  if (error) {
    return { ok: false, code: mapProvisionError(error.message), httpStatus: 409 };
  }
  return interpretProvisionRpcResult(data);
}
