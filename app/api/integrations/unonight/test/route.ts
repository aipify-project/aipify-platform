import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getUnonightFailureMessageKey,
  resolveUnonightApiBaseUrl,
  testUnonightReadOnlyConnection,
  UNONIGHT_DEFAULT_SCOPES,
} from "@/lib/unonight/connection";

/** Server-side live read-only connection test — never returns bearer token. */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      api_key?: string;
      base_url?: string | null;
      expected_organization_id?: string | null;
    };

    const apiKey = body.api_key?.trim();
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error_code: "invalid_token", message_key: getUnonightFailureMessageKey("invalid_token") },
        { status: 400 }
      );
    }

    const result = await testUnonightReadOnlyConnection({
      bearerToken: apiKey,
      baseUrl: resolveUnonightApiBaseUrl(body.base_url),
      requestedScopes: UNONIGHT_DEFAULT_SCOPES,
      expectedOrganizationId: body.expected_organization_id,
    });

    if (!result.ok) {
      return NextResponse.json(
        {
          success: false,
          error_code: result.code,
          message_key: result.messageKey,
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc("record_unonight_integration_verification", {
      p_verification: result.contract,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, verification: result.contract, ...(data as object) });
  } catch {
    return NextResponse.json({ error: "Failed to test Unonight connection" }, { status: 500 });
  }
}
