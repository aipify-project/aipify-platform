import type { SupabaseClient } from "@supabase/supabase-js";
import {
  parseUnonightConnectionContractDetailed,
  unwrapUnonightConnectionPayload,
} from "@/lib/unonight/connection/contract-parser";
import {
  UNONIGHT_CONNECTION_TIMEOUT_MS,
  UNONIGHT_ORGANIZATION_SLUG,
  buildUnonightConnectionUrl,
  resolveUnonightApiBaseUrl,
} from "@/lib/unonight/connection/constants";
import { decryptIntegrationCredential } from "@/lib/unonight/connection/crypto";
import { loadAppPortalUnonightTestMaterial } from "@/lib/unonight/connection/run-test";
import { testUnonightReadOnlyConnection } from "@/lib/unonight/connection/test-connection";

export type IntegrationStatusFailureCode =
  | "integration_not_connected"
  | "integration_not_verified"
  | "credential_unavailable"
  | "endpoint_unreachable"
  | "provider_mismatch"
  | "organization_mismatch"
  | "permission_denied"
  | "response_invalid";

export type ConnectedIntegrationStatusMetadata = {
  provider: "unonight";
  status: "connected";
  verified: true;
  organization_name: string;
  organization_id: string;
  api_version: string;
  access_mode: "read_only";
  scopes: string[];
  supported_locales: string[];
  last_verified_at: string | null;
  last_used_at: string | null;
  base_url: string;
  source: "Verified Unonight integration";
  tool: "get_connected_integration_status";
  checked_at: string;
};

export type IntegrationStatusToolResult =
  | { ok: true; data: ConnectedIntegrationStatusMetadata; audit: IntegrationStatusAuditEvent }
  | {
      ok: false;
      code: IntegrationStatusFailureCode;
      audit: IntegrationStatusAuditEvent;
    };

export type IntegrationStatusAuditEvent = {
  tool: "get_connected_integration_status";
  provider: "unonight";
  ok: boolean;
  code?: IntegrationStatusFailureCode;
  connection_id?: string | null;
  checked_at: string;
};

type HubConnection = {
  id: string;
  provider_key: string;
  canonical_status?: string;
  status?: string;
  last_test_success_at?: string | null;
  last_verified_at?: string | null;
  access_summary?: Record<string, unknown>;
};

function isVerifiedConnection(connection: HubConnection): boolean {
  const canonical = String(connection.canonical_status ?? "").toLowerCase();
  if (canonical === "verified" || canonical === "active") return true;
  if (connection.last_test_success_at) return true;
  const status = String(connection.status ?? "").toLowerCase();
  return status === "connected" || status === "verified";
}

function extractSafeLiveExtras(payload: unknown): {
  last_used_at: string | null;
  supported_locales: string[];
} {
  const record = unwrapUnonightConnectionPayload(payload);
  if (!record) return { last_used_at: null, supported_locales: [] };

  const connection = record.connection;
  const organization = record.organization;
  const lastUsedAt =
    connection &&
    typeof connection === "object" &&
    connection !== null &&
    typeof (connection as Record<string, unknown>).last_used_at === "string"
      ? String((connection as Record<string, unknown>).last_used_at)
      : null;

  const localesRaw =
    organization &&
    typeof organization === "object" &&
    organization !== null &&
    Array.isArray((organization as Record<string, unknown>).supported_locales)
      ? ((organization as Record<string, unknown>).supported_locales as unknown[])
      : [];

  const supported_locales = localesRaw
    .filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0)
    .map((entry) => entry.trim());

  return { last_used_at: lastUsedAt, supported_locales };
}

async function fetchLiveUnonightPayload(input: {
  bearerToken: string;
  baseUrl: string;
}): Promise<{ ok: true; payload: unknown } | { ok: false; code: IntegrationStatusFailureCode }> {
  const url = buildUnonightConnectionUrl(resolveUnonightApiBaseUrl(input.baseUrl));
  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${input.bearerToken.trim()}`,
        Accept: "application/json",
      },
      redirect: "manual",
      signal: AbortSignal.timeout(UNONIGHT_CONNECTION_TIMEOUT_MS),
    });
  } catch {
    return { ok: false, code: "endpoint_unreachable" };
  }

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    return { ok: false, code: "response_invalid" };
  }

  if (!response.ok) {
    return { ok: false, code: response.status >= 500 ? "endpoint_unreachable" : "response_invalid" };
  }

  return { ok: true, payload };
}

export async function getConnectedIntegrationStatus(
  supabase: SupabaseClient,
  options: {
    providerKey: "unonight";
    refresh?: boolean;
  },
): Promise<IntegrationStatusToolResult> {
  const checkedAt = new Date().toISOString();
  const baseAudit = {
    tool: "get_connected_integration_status" as const,
    provider: "unonight" as const,
    checked_at: checkedAt,
  };

  const { data: hubRaw, error: hubError } = await supabase.rpc("get_app_portal_integrations_hub");
  if (hubError) {
    return {
      ok: false,
      code: "permission_denied",
      audit: { ...baseAudit, ok: false, code: "permission_denied" },
    };
  }

  const hub = hubRaw as { connections?: HubConnection[] } | null;
  const connection = (hub?.connections ?? []).find(
    (entry) => entry.provider_key === options.providerKey,
  );

  if (!connection?.id) {
    return {
      ok: false,
      code: "integration_not_connected",
      audit: { ...baseAudit, ok: false, code: "integration_not_connected", connection_id: null },
    };
  }

  if (!isVerifiedConnection(connection)) {
    return {
      ok: false,
      code: "integration_not_verified",
      audit: {
        ...baseAudit,
        ok: false,
        code: "integration_not_verified",
        connection_id: connection.id,
      },
    };
  }

  let material: Awaited<ReturnType<typeof loadAppPortalUnonightTestMaterial>> = null;
  try {
    material = await loadAppPortalUnonightTestMaterial(supabase, connection.id);
  } catch {
    return {
      ok: false,
      code: "permission_denied",
      audit: { ...baseAudit, ok: false, code: "permission_denied", connection_id: connection.id },
    };
  }

  if (!material?.encrypted_payload) {
    return {
      ok: false,
      code: "credential_unavailable",
      audit: {
        ...baseAudit,
        ok: false,
        code: "credential_unavailable",
        connection_id: connection.id,
      },
    };
  }

  let bearerToken: string;
  try {
    bearerToken = decryptIntegrationCredential(material.encrypted_payload);
  } catch {
    return {
      ok: false,
      code: "credential_unavailable",
      audit: {
        ...baseAudit,
        ok: false,
        code: "credential_unavailable",
        connection_id: connection.id,
      },
    };
  }

  const baseUrl =
    typeof material.access_summary.base_url === "string"
      ? material.access_summary.base_url
      : typeof connection.access_summary?.base_url === "string"
        ? connection.access_summary.base_url
        : "https://www.unonight.com";

  const liveTest = await testUnonightReadOnlyConnection({
    bearerToken,
    baseUrl,
    requestedScopes: material.approved_scopes,
    expectedOrganizationId: material.expected_organization_id,
    expectedOrganizationSlug: UNONIGHT_ORGANIZATION_SLUG,
    credentialFound: true,
  });

  if (!liveTest.ok) {
    const code =
      liveTest.code === "organization_mismatch"
        ? "organization_mismatch"
        : liveTest.code === "invalid_token" || liveTest.code === "revoked_token"
          ? "credential_unavailable"
          : liveTest.code === "endpoint_unreachable"
            ? "endpoint_unreachable"
            : "response_invalid";

    return {
      ok: false,
      code,
      audit: { ...baseAudit, ok: false, code, connection_id: connection.id },
    };
  }

  const livePayload = await fetchLiveUnonightPayload({ bearerToken, baseUrl });
  const extras =
    livePayload.ok === true
      ? extractSafeLiveExtras(livePayload.payload)
      : { last_used_at: null, supported_locales: [] };

  const parsed =
    livePayload.ok === true
      ? parseUnonightConnectionContractDetailed(livePayload.payload)
      : null;

  if (parsed && !parsed.ok) {
    return {
      ok: false,
      code:
        parsed.code === "provider_mismatch"
          ? "provider_mismatch"
          : parsed.code === "malformed_organization"
            ? "organization_mismatch"
            : "response_invalid",
      audit: { ...baseAudit, ok: false, code: "response_invalid", connection_id: connection.id },
    };
  }

  const contract = liveTest.contract;
  const lastVerifiedAt =
    connection.last_verified_at ??
    connection.last_test_success_at ??
    liveTest.verifiedAt ??
    null;

  const metadata: ConnectedIntegrationStatusMetadata = {
    provider: "unonight",
    status: "connected",
    verified: true,
    organization_name: contract.organization_name,
    organization_id: contract.organization_id,
    api_version: contract.api_version,
    access_mode: "read_only",
    scopes: contract.scopes,
    supported_locales: extras.supported_locales,
    last_verified_at: lastVerifiedAt,
    last_used_at: extras.last_used_at,
    base_url: resolveUnonightApiBaseUrl(baseUrl),
    source: "Verified Unonight integration",
    tool: "get_connected_integration_status",
    checked_at: checkedAt,
  };

  console.info("[companion-integration-status]", {
    tool: metadata.tool,
    provider: metadata.provider,
    ok: true,
    connection_id: connection.id,
    checked_at: checkedAt,
  });

  return {
    ok: true,
    data: metadata,
    audit: { ...baseAudit, ok: true, connection_id: connection.id },
  };
}
