import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  try {
    const providerKey = new URL(request.url).searchParams.get("provider_key");
    if (!providerKey) {
      return NextResponse.json({ error: "provider_key required" }, { status: 400, headers: NO_STORE });
    }
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_app_portal_installation_session", {
      p_provider_key: providerKey,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 403, headers: NO_STORE });
    }
    return NextResponse.json(data ?? { session: null }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Failed to load session" }, { status: 500, headers: NO_STORE });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const providerKey = typeof body?.provider_key === "string" ? body.provider_key.trim() : "";
    const contractVersion =
      typeof body?.contract_version === "string" ? body.contract_version.trim() : "";
    if (!providerKey || !contractVersion) {
      return NextResponse.json(
        { error: "provider_key and contract_version required" },
        { status: 400, headers: NO_STORE }
      );
    }

    // Never accept secret plaintext into session field_values from client.
    const fieldValues =
      body?.field_values && typeof body.field_values === "object" ? { ...body.field_values } : null;
    if (fieldValues) {
      for (const key of Object.keys(fieldValues)) {
        if (/secret|password|api[_-]?key|token/i.test(key)) {
          fieldValues[key] = { masked: true };
        }
      }
    }

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("upsert_app_portal_installation_session", {
      p_provider_key: providerKey,
      p_contract_version: contractVersion,
      p_support_mode: body?.support_mode ?? null,
      p_state: body?.state ?? null,
      p_current_step_key: body?.current_step_key ?? null,
      p_completed_step_keys: body?.completed_step_keys ?? null,
      p_field_values: fieldValues,
      p_paused: typeof body?.paused === "boolean" ? body.paused : null,
      p_last_test_status: body?.last_test_status ?? null,
      p_last_error_code: body?.last_error_code ?? null,
      p_reason: typeof body?.reason === "string" ? body.reason : "upsert",
      p_idempotency_key: typeof body?.idempotency_key === "string" ? body.idempotency_key : null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 403, headers: NO_STORE });
    }
    return NextResponse.json(data ?? {}, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Failed to update session" }, { status: 500, headers: NO_STORE });
  }
}
