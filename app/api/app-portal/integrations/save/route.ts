import { NextResponse } from "next/server";
import { revalidateAppPortalIntegrationSurfaces } from "@/lib/app-portal/integrations/invalidate";
import { createClient } from "@/lib/supabase/server";
import {
  UNONIGHT_DEFAULT_SCOPES,
  UNONIGHT_PROVIDER_KEY,
  encryptIntegrationCredential,
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

    let storedSecret: string | null = apiKey.length > 0 ? apiKey : null;
    if (providerKey === UNONIGHT_PROVIDER_KEY && storedSecret) {
      storedSecret = encryptIntegrationCredential(storedSecret);
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
          },
          { status: 400, headers: NO_STORE }
        );
      }
      return NextResponse.json({ error: "Failed to save integration" }, { status: 400, headers: NO_STORE });
    }

    revalidateAppPortalIntegrationSurfaces();
    return NextResponse.json(data, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Failed to save integration" }, { status: 500, headers: NO_STORE });
  }
}
