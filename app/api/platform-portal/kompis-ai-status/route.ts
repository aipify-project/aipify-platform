import { NextResponse } from "next/server";
import {
  buildKompisAiReadiness,
  getKompisAiRuntimeStatus,
  KOMPIS_AI_SYSTEM_PROMPT_VERSION,
} from "@/lib/kompis-operator/ai-runtime";
import { KOMPIS_AI_AUTHORITATIVE_ENV } from "@/lib/kompis-operator/readiness";
import { resolveKompisPlannerProfile } from "@/lib/kompis-operator/model-profiles";
import { getPlatformProfile } from "@/lib/tenant/get-platform-profile";
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
    const profile = await getPlatformProfile(supabase);
    if (!profile) {
      return NextResponse.json({ error: "Forbidden", code: "forbidden" }, { status: 403, headers });
    }

    const { data, error } = await supabase.rpc("get_platform_kompis_ai_status");
    if (error) {
      return NextResponse.json(
        { error: "Unable to load Kompis AI status.", code: "unknown" },
        { status: 500, headers },
      );
    }
    const state = asRecord(data);
    const runtime = getKompisAiRuntimeStatus(state);
    const readiness = buildKompisAiReadiness(state);
    const model = resolveKompisPlannerProfile();

    return NextResponse.json(
      {
        readiness,
        runtime,
        providerFamily: "openai_compatible",
        modelProfile: model.id,
        systemPromptVersion: KOMPIS_AI_SYSTEM_PROMPT_VERSION,
        plannerVersion: "planner_v2",
        authoritativeEnvName: KOMPIS_AI_AUTHORITATIVE_ENV,
        usage24h: asRecord(state.usage_24h),
        activeOrganizations24h:
          typeof state.active_organizations_24h === "number" ? state.active_organizations_24h : 0,
        circuitOpen: readiness.circuitOpen,
        cooldownUntil: readiness.cooldownUntil,
        lastHealthAt: readiness.lastHealthAt,
        lastSuccessAt: readiness.lastSuccessAt,
        lastLatencyMs: readiness.lastLatencyMs,
        lastSafeErrorCode: readiness.lastSafeErrorCode,
        fallbackAvailable: true,
      },
      { headers },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to load Kompis AI status.", code: "unknown" },
      { status: 500, headers },
    );
  }
}
