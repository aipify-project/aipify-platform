import { NextResponse } from "next/server";
import {
  buildKompisAiReadiness,
  getKompisAiRuntimeStatus,
} from "@/lib/kompis-operator/ai-runtime";
import { requireReadyAppPortalContext } from "@/lib/tenant/app-portal-route-access";
import { createClient } from "@/lib/supabase/server";

const headers = { "Cache-Control": "no-store" };

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "unauthorized" }, { status: 401, headers });
    }
    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const { data } = await supabase.rpc("get_app_kompis_ai_provider_state");
    const state = asRecord(data);
    const runtime = getKompisAiRuntimeStatus(state);
    const readiness = buildKompisAiReadiness(state);

    return NextResponse.json(
      {
        runtime,
        readiness,
        // Never include secrets, prefixes, or raw provider payloads.
      },
      { headers },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to load provider status.", code: "unknown" },
      { status: 500, headers },
    );
  }
}
