import type { SupabaseClient } from "@supabase/supabase-js";
import {
  UNONIGHT_PROVIDER_KEY,
  decryptIntegrationCredential,
  testUnonightReadOnlyConnection,
} from "@/lib/unonight/connection";

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

export async function runUnonightAppPortalConnectionTest(
  supabase: SupabaseClient,
  connectionId: string
): Promise<Record<string, unknown>> {
  const material = await loadAppPortalUnonightTestMaterial(supabase, connectionId);
  if (!material) {
    return { success: false, error: "Connection not found" };
  }
  if (material.provider_key !== UNONIGHT_PROVIDER_KEY) {
    return { success: false, error: "Unsupported provider for live test route" };
  }
  if (!material.encrypted_payload) {
    const recorded = await recordAppPortalIntegrationTestResult(supabase, connectionId, {
      success: false,
      error_code: "invalid_token",
      customer_message_key:
        "customerApp.portalStructure.integrations.unonightConnection.failures.invalidToken",
      technical_reason: "Missing vaulted credential",
    });
    return recorded ?? { success: false, status: "failed" };
  }

  let bearerToken: string;
  try {
    bearerToken = decryptIntegrationCredential(material.encrypted_payload);
  } catch {
    const recorded = await recordAppPortalIntegrationTestResult(supabase, connectionId, {
      success: false,
      error_code: "invalid_token",
      customer_message_key:
        "customerApp.portalStructure.integrations.unonightConnection.failures.invalidToken",
      technical_reason: "Credential decrypt failed",
    });
    return recorded ?? { success: false, status: "failed" };
  }

  const baseUrl =
    typeof material.access_summary.base_url === "string" ? material.access_summary.base_url : null;

  const result = await testUnonightReadOnlyConnection({
    bearerToken,
    baseUrl,
    requestedScopes: material.approved_scopes,
    expectedOrganizationId: material.expected_organization_id,
  });

  if (!result.ok) {
    const recorded = await recordAppPortalIntegrationTestResult(supabase, connectionId, {
      success: false,
      error_code: result.code,
      customer_message_key: result.messageKey,
      technical_reason: result.technicalReason,
    });
    return (
      recorded ?? {
        success: false,
        status: "failed",
        error_code: result.code,
        message_key: result.messageKey,
      }
    );
  }

  const recorded = await recordAppPortalIntegrationTestResult(supabase, connectionId, {
    success: true,
    verification: result.contract as unknown as Record<string, unknown>,
  });
  return (
    recorded ?? {
      success: true,
      status: "connected",
      verification: result.contract,
    }
  );
}
