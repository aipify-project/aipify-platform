import { NextResponse } from "next/server";
import { revalidateAppPortalIntegrationSurfaces } from "@/lib/app-portal/integrations/invalidate-server";
import { encryptIntegrationPortalCredential } from "@/lib/app-portal/integrations/credential-crypto";
import { createClient } from "@/lib/supabase/server";
import {
  UNONIGHT_DEFAULT_SCOPES,
  UNONIGHT_PROVIDER_KEY,
  getUnonightBaseUrlValidationMessageKey,
  validateUnonightBaseUrlInput,
} from "@/lib/unonight/connection";

const NO_STORE = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      provider_key?: string;
      setup_type?: string;
      permission_level?: string;
      approved_scopes?: string[];
      api_key?: string | null;
      base_url?: string | null;
      connection_name?: string | null;
    };

    const supabase = await createClient();
    const providerKey = body.provider_key ?? "";
    const apiKey = body.api_key?.trim() ?? "";

    let accessSummary: Record<string, unknown> = {};

    if (providerKey === UNONIGHT_PROVIDER_KEY) {
      const baseValidation = validateUnonightBaseUrlInput(body.base_url);
      if (!baseValidation.ok) {
        return NextResponse.json(
          {
            error: "invalid_base_url",
            error_code: baseValidation.code,
            message_key: getUnonightBaseUrlValidationMessageKey(baseValidation.code),
            stored: false,
          },
          { status: 400, headers: NO_STORE }
        );
      }

      accessSummary = {
        provider: UNONIGHT_PROVIDER_KEY,
        base_url: baseValidation.value,
        connection_name: body.connection_name?.trim() || "Unonight read-only",
        requested_scopes: body.approved_scopes?.length
          ? body.approved_scopes
          : [...UNONIGHT_DEFAULT_SCOPES],
      };
    }

    let storedSecret: string | null = null;
    let keyFingerprint: string | null = null;
    let envelopeVersion: number | null = null;

    if (apiKey.length > 0) {
      // Encrypt every manual secret server-side before Core persistence.
      // Never pass plaintext with p_pre_encrypted=true.
      const encrypted = encryptIntegrationPortalCredential(apiKey);
      storedSecret = encrypted.ciphertext;
      keyFingerprint = encrypted.keyFingerprint;
      envelopeVersion = encrypted.envelopeVersion;
      accessSummary = {
        ...accessSummary,
        encryption_key_fingerprint: keyFingerprint,
        envelope_version: envelopeVersion,
      };
    }

    const { data, error } = await supabase.rpc("save_app_portal_integration_connection", {
      p_provider_key: body.provider_key,
      p_setup_type: body.setup_type,
      p_permission_level: body.permission_level ?? "read_only",
      p_approved_scopes: body.approved_scopes ?? [],
      p_api_key: storedSecret,
      p_access_summary: accessSummary,
    });

    if (error) {
      const message = error.message.toLowerCase();
      if (message.includes("email") || message.includes("invalid unonight base url")) {
        return NextResponse.json(
          {
            error: "invalid_base_url",
            error_code: "email_not_allowed",
            message_key: getUnonightBaseUrlValidationMessageKey("email_not_allowed"),
            stored: false,
          },
          { status: 400, headers: NO_STORE }
        );
      }
      return NextResponse.json(
        { error: "Failed to save integration", stored: false },
        { status: 400, headers: NO_STORE }
      );
    }

    const row = (data ?? {}) as Record<string, unknown>;
    revalidateAppPortalIntegrationSurfaces();
    return NextResponse.json(
      {
        connection_id: row.connection_id ?? null,
        status: row.status ?? "pending",
        stored: storedSecret != null || row.masked_credential_hint != null,
        fingerprint: keyFingerprint,
        envelope_version: envelopeVersion,
        updated_at: row.updated_at ?? null,
        masked_credential_hint: row.masked_credential_hint ?? null,
      },
      { headers: NO_STORE }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to save integration", stored: false },
      { status: 500, headers: NO_STORE }
    );
  }
}
