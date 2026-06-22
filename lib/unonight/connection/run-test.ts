import type { SupabaseClient } from "@supabase/supabase-js";
import { isUnonightAipifyTokenFormat } from "@/lib/unonight-platform/constants";
import { UNONIGHT_ORGANIZATION_SLUG, UNONIGHT_PROVIDER_KEY } from "./constants";
import { decryptIntegrationCredential } from "./crypto";
import { buildUnonightConnectionDiagnostics } from "./diagnostics";
import type { UnonightConnectionDiagnostics } from "./types";
import { getUnonightFailureMessageKey } from "./failures";
import { testUnonightReadOnlyConnection } from "./test-connection";

type IntegrationTestMaterial = {
  provider_key: string;
  encrypted_payload: string | null;
  access_summary: Record<string, unknown>;
  approved_scopes: string[];
  expected_organization_id: string | null;
  company_id: string;
};

type RecordTestResultPayload = {
  success: boolean;
  error_code?: string | null;
  customer_message_key?: string | null;
  technical_reason?: string | null;
  verification?: Record<string, unknown> | null;
};

export type UnonightAppPortalTestResponse = {
  success: boolean;
  status?: string;
  error_code?: string;
  message_key?: string;
  technical_reason?: string;
  diagnostics?: UnonightConnectionDiagnostics;
  verification?: Record<string, unknown>;
  error?: string;
};

export async function loadAppPortalUnonightTestMaterial(
  supabase: SupabaseClient,
  connectionId: string
): Promise<IntegrationTestMaterial | null> {
  const { data, error } = await supabase.rpc("get_app_portal_integration_test_material", {
    p_connection_id: connectionId,
  });
  if (error || !data) return null;
  const row = data as Record<string, unknown>;
  return {
    provider_key: String(row.provider_key ?? ""),
    encrypted_payload: row.encrypted_payload ? String(row.encrypted_payload) : null,
    access_summary: (row.access_summary as Record<string, unknown>) ?? {},
    approved_scopes: Array.isArray(row.approved_scopes)
      ? row.approved_scopes.filter((scope): scope is string => typeof scope === "string")
      : [],
    expected_organization_id: row.expected_organization_id
      ? String(row.expected_organization_id)
      : null,
    company_id: String(row.company_id ?? ""),
  };
}

export async function recordAppPortalIntegrationTestResult(
  supabase: SupabaseClient,
  connectionId: string,
  payload: RecordTestResultPayload
): Promise<Record<string, unknown> | null> {
  const { data, error } = await supabase.rpc("record_app_portal_integration_test_result", {
    p_connection_id: connectionId,
    p_success: payload.success,
    p_error_code: payload.error_code ?? null,
    p_customer_message_key: payload.customer_message_key ?? null,
    p_technical_reason: payload.technical_reason ?? null,
    p_verification: payload.verification ?? null,
  });
  if (error) return null;
  return (data as Record<string, unknown>) ?? null;
}

function failureResponse(
  payload: Omit<UnonightAppPortalTestResponse, "success"> & { success: false }
): UnonightAppPortalTestResponse {
  return payload;
}

export async function runUnonightAppPortalConnectionTest(
  supabase: SupabaseClient,
  connectionId: string
): Promise<UnonightAppPortalTestResponse> {
  const material = await loadAppPortalUnonightTestMaterial(supabase, connectionId);
  if (!material) {
    return failureResponse({
      success: false,
      error: "Connection not found",
      error_code: "credential_unavailable",
      message_key: getUnonightFailureMessageKey("credential_unavailable"),
    });
  }
  if (material.provider_key !== UNONIGHT_PROVIDER_KEY) {
    return failureResponse({
      success: false,
      error: "Unsupported provider for live test route",
      error_code: "unsupported_response",
      message_key: getUnonightFailureMessageKey("unsupported_response"),
    });
  }

  const baseUrl =
    typeof material.access_summary.base_url === "string" ? material.access_summary.base_url : null;

  if (!material.encrypted_payload) {
    const diagnostics = buildUnonightConnectionDiagnostics({
      baseUrl,
      credentialFound: false,
      tokenPrefixValid: false,
      authorizationAttached: false,
      schemaMatched: false,
      safeResponseCode: "credential_unavailable",
    });
    const recorded = await recordAppPortalIntegrationTestResult(supabase, connectionId, {
      success: false,
      error_code: "credential_unavailable",
      customer_message_key: getUnonightFailureMessageKey("credential_unavailable"),
      technical_reason: "Missing vaulted credential",
    });
    return (
      (recorded as UnonightAppPortalTestResponse | null) ?? {
        success: false,
        status: "failed",
        error_code: "credential_unavailable",
        message_key: getUnonightFailureMessageKey("credential_unavailable"),
        diagnostics,
      }
    );
  }

  let bearerToken: string;
  try {
    bearerToken = decryptIntegrationCredential(material.encrypted_payload);
  } catch {
    const diagnostics = buildUnonightConnectionDiagnostics({
      baseUrl,
      credentialFound: true,
      tokenPrefixValid: false,
      authorizationAttached: false,
      schemaMatched: false,
      safeResponseCode: "decrypt_failed",
    });
    const recorded = await recordAppPortalIntegrationTestResult(supabase, connectionId, {
      success: false,
      error_code: "credential_unavailable",
      customer_message_key: getUnonightFailureMessageKey("credential_unavailable"),
      technical_reason: "Credential decrypt failed",
    });
    return (
      (recorded as UnonightAppPortalTestResponse | null) ?? {
        success: false,
        status: "failed",
        error_code: "credential_unavailable",
        message_key: getUnonightFailureMessageKey("credential_unavailable"),
        diagnostics,
      }
    );
  }

  const tokenPrefixValid = isUnonightAipifyTokenFormat(bearerToken);

  const result = await testUnonightReadOnlyConnection({
    bearerToken,
    baseUrl,
    requestedScopes: material.approved_scopes,
    expectedOrganizationId: material.expected_organization_id,
    expectedOrganizationSlug: UNONIGHT_ORGANIZATION_SLUG,
    credentialFound: true,
  });

  if (!result.ok) {
    const recorded = await recordAppPortalIntegrationTestResult(supabase, connectionId, {
      success: false,
      error_code: result.code,
      customer_message_key: result.messageKey,
      technical_reason: result.technicalReason,
    });
    return {
      ...((recorded as UnonightAppPortalTestResponse | null) ?? {
        success: false,
        status: "failed",
        error_code: result.code,
        message_key: result.messageKey,
        technical_reason: result.technicalReason,
      }),
      diagnostics: result.diagnostics,
    };
  }

  const recorded = await recordAppPortalIntegrationTestResult(supabase, connectionId, {
    success: true,
    verification: result.contract as unknown as Record<string, unknown>,
  });

  if (!recorded) {
    return failureResponse({
      success: false,
      status: "failed",
      error_code: "verification_record_failed",
      message_key: getUnonightFailureMessageKey("verification_record_failed"),
      technical_reason: "Verification record could not be saved",
      diagnostics: result.diagnostics,
      verification: result.contract as unknown as Record<string, unknown>,
    });
  }

  return {
    ...(recorded as UnonightAppPortalTestResponse),
    diagnostics: result.diagnostics,
    verification: result.contract as unknown as Record<string, unknown>,
  };
}
