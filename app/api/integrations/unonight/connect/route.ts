import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  encryptIntegrationCredential,
  getUnonightFailureMessageKey,
  resolveUnonightApiBaseUrl,
  testUnonightReadOnlyConnection,
  UNONIGHT_DEFAULT_SCOPES,
} from "@/lib/unonight/connection";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      configuration?: Record<string, unknown>;
      api_key?: string;
      base_url?: string | null;
      connection_name?: string | null;
      test_only?: boolean;
    };

    const apiKey = body.api_key?.trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: "Unonight read-only connection key required", message_key: getUnonightFailureMessageKey("invalid_token") },
        { status: 400 }
      );
    }

    const baseUrl = resolveUnonightApiBaseUrl(body.base_url);
    const configuration = {
      ...(body.configuration ?? {}),
      base_url: baseUrl,
      connection_name: body.connection_name?.trim() || "Unonight read-only",
      requested_scopes: [...UNONIGHT_DEFAULT_SCOPES],
      access_mode: "read_only",
      live_connection_required: true,
    };

    if (body.test_only) {
      const live = await testUnonightReadOnlyConnection({
        bearerToken: apiKey,
        baseUrl,
        requestedScopes: UNONIGHT_DEFAULT_SCOPES,
      });
      if (!live.ok) {
        return NextResponse.json(
          { success: false, error_code: live.code, message_key: live.messageKey },
          { status: 400 }
        );
      }
      return NextResponse.json({ success: true, verification: live.contract });
    }

    const live = await testUnonightReadOnlyConnection({
      bearerToken: apiKey,
      baseUrl,
      requestedScopes: UNONIGHT_DEFAULT_SCOPES,
    });

    if (!live.ok) {
      return NextResponse.json(
        { success: false, error_code: live.code, message_key: live.messageKey },
        { status: 400 }
      );
    }

    const encrypted = encryptIntegrationCredential(apiKey);
    const { data: connectData, error: connectError } = await supabase.rpc("connect_unonight_integration", {
      p_configuration: configuration,
      p_secret: encrypted,
      p_pre_encrypted: true,
    });
    if (connectError) return NextResponse.json({ error: connectError.message }, { status: 400 });

    const { data: verifyData, error: verifyError } = await supabase.rpc(
      "record_unonight_integration_verification",
      { p_verification: live.contract }
    );
    if (verifyError) return NextResponse.json({ error: verifyError.message }, { status: 400 });

    return NextResponse.json({
      ...(connectData as object),
      verification: live.contract,
      activation: verifyData,
    });
  } catch {
    return NextResponse.json({ error: "Failed to connect Unonight" }, { status: 500 });
  }
}
