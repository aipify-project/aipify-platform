import type { SupabaseClient } from "@supabase/supabase-js";
import { decryptIntegrationCredential } from "@/lib/unonight/connection/crypto";
import { UNONIGHT_ORGANIZATION_SLUG, UNONIGHT_PROVIDER_KEY } from "@/lib/unonight/connection/constants";
import { loadAppPortalUnonightTestMaterial } from "@/lib/unonight/connection/run-test";
import {
  UNONIGHT_PLATFORM_METADATA_SCOPE,
  parseUnonightPlatformSnapshotDetailed,
  testUnonightPlatformSnapshot,
} from "@/lib/unonight/platform-snapshot";
import type { UnonightPlatformSnapshotSuccess } from "@/lib/unonight/platform-snapshot";

export type PlatformSnapshotFailureCode =
  | "integration_not_connected"
  | "integration_not_verified"
  | "credential_unavailable"
  | "endpoint_unreachable"
  | "provider_mismatch"
  | "organization_mismatch"
  | "permission_denied"
  | "response_invalid"
  | "missing_platform_scope";

export type UnonightPlatformSnapshotMetadata = {
  provider: "unonight";
  status: UnonightPlatformSnapshotSuccess["status"];
  organization_name: string;
  organization_id: string;
  api_version: string;
  environment: string;
  platform_version: string;
  active_modules: string[];
  supported_locales: string[];
  base_url: string;
  checked_at: string;
  source: "Verified Unonight integration";
  tool: "get_unonight_platform_snapshot";
};

export type PlatformSnapshotToolResult =
  | { ok: true; data: UnonightPlatformSnapshotMetadata; audit: PlatformSnapshotAuditEvent }
  | { ok: false; code: PlatformSnapshotFailureCode; audit: PlatformSnapshotAuditEvent };

export type PlatformSnapshotAuditEvent = {
  tool: "get_unonight_platform_snapshot";
  provider: "unonight";
  ok: boolean;
  code?: PlatformSnapshotFailureCode;
  connection_id?: string | null;
  checked_at: string;
};

type HubConnection = {
  id: string;
  provider_key: string;
  canonical_status?: string;
  status?: string;
  last_test_success_at?: string | null;
  access_summary?: Record<string, unknown>;
};

function isVerifiedConnection(connection: HubConnection): boolean {
  const canonical = String(connection.canonical_status ?? "").toLowerCase();
  if (canonical === "verified" || canonical === "active") return true;
  if (connection.last_test_success_at) return true;
  const status = String(connection.status ?? "").toLowerCase();
  return status === "connected" || status === "verified";
}

function hasPlatformScope(scopes: string[]): boolean {
  return scopes.some((scope) => scope.toLowerCase() === UNONIGHT_PLATFORM_METADATA_SCOPE);
}

export async function getUnonightPlatformSnapshot(
  supabase: SupabaseClient,
  options: {
    providerKey: "unonight";
    refresh?: boolean;
  },
): Promise<PlatformSnapshotToolResult> {
  const checkedAt = new Date().toISOString();
  const baseAudit = {
    tool: "get_unonight_platform_snapshot" as const,
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
  const connection = (hub?.connections ?? []).find((entry) => entry.provider_key === options.providerKey);

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

  if (!hasPlatformScope(material.approved_scopes)) {
    return {
      ok: false,
      code: "missing_platform_scope",
      audit: {
        ...baseAudit,
        ok: false,
        code: "missing_platform_scope",
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

  const liveResult = await testUnonightPlatformSnapshot({
    bearerToken,
    baseUrl,
    requestedScopes: material.approved_scopes,
    expectedOrganizationSlug: UNONIGHT_ORGANIZATION_SLUG,
  });

  if (!liveResult.ok) {
    const code: PlatformSnapshotFailureCode =
      liveResult.code === "organization_mismatch"
        ? "organization_mismatch"
        : liveResult.code === "missing_required_scope"
          ? "missing_platform_scope"
          : liveResult.code === "invalid_token"
            ? "credential_unavailable"
            : liveResult.code === "endpoint_unreachable"
              ? "endpoint_unreachable"
              : "response_invalid";

    return {
      ok: false,
      code,
      audit: { ...baseAudit, ok: false, code, connection_id: connection.id },
    };
  }

  const snapshot = liveResult.snapshot;
  const metadata: UnonightPlatformSnapshotMetadata = {
    provider: UNONIGHT_PROVIDER_KEY,
    status: snapshot.status,
    organization_name: snapshot.organization.name,
    organization_id: snapshot.organization.id,
    api_version: snapshot.api_version,
    environment: snapshot.platform.environment,
    platform_version: snapshot.platform.version,
    active_modules: snapshot.platform.active_modules,
    supported_locales: snapshot.platform.supported_locales,
    base_url: snapshot.organization.base_url,
    checked_at: snapshot.checked_at,
    source: "Verified Unonight integration",
    tool: "get_unonight_platform_snapshot",
  };

  console.info("[companion-platform-snapshot]", {
    tool: metadata.tool,
    provider: metadata.provider,
    module_count: metadata.active_modules.length,
    checked_at: metadata.checked_at,
  });

  return {
    ok: true,
    data: metadata,
    audit: { ...baseAudit, ok: true, connection_id: connection.id },
  };
}

export { parseUnonightPlatformSnapshotDetailed };
