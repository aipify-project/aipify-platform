import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  UNONIGHT_DEFAULT_SCOPES,
  encryptIntegrationCredential,
  resolveUnonightApiBaseUrl,
} from "@/lib/unonight/connection";
import { UNONIGHT_PROVIDER_KEY } from "@/lib/unonight/connection/constants";

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
    const apiKey = body.api_key?.trim() ?? null;

    let storedSecret: string | null = apiKey;
    if (providerKey === UNONIGHT_PROVIDER_KEY && apiKey) {
      storedSecret = encryptIntegrationCredential(apiKey);
    }

    const accessSummary =
      providerKey === UNONIGHT_PROVIDER_KEY
        ? {
            provider: UNONIGHT_PROVIDER_KEY,
            base_url: resolveUnonightApiBaseUrl(body.base_url),
            connection_name: body.connection_name?.trim() || "Unonight read-only",
            requested_scopes: body.approved_scopes?.length
              ? body.approved_scopes
              : [...UNONIGHT_DEFAULT_SCOPES],
          }
        : {};

    const { data, error } = await supabase.rpc("save_app_portal_integration_connection", {
      p_provider_key: body.provider_key,
      p_setup_type: body.setup_type,
      p_permission_level: body.permission_level ?? "read_only",
      p_approved_scopes: body.approved_scopes ?? [],
      p_api_key: storedSecret,
      p_access_summary: accessSummary,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to save integration" }, { status: 500 });
  }
}
