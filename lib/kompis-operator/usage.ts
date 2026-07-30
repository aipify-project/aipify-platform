import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export async function recordKompisAiUsage(
  supabase: SupabaseClient,
  input: {
    organizationId?: string | null;
    actorId?: string | null;
    runId?: string | null;
    providerFamily?: string;
    modelProfile: string;
    plannerSource: "deterministic" | "ai" | "ai_fallback" | "health";
    inputUnits?: number | null;
    outputUnits?: number | null;
    totalUnits?: number | null;
    latencyMs?: number | null;
    result: "success" | "fallback" | "error" | "rate_limited" | "circuit_open";
    safeErrorCode?: string | null;
  },
): Promise<void> {
  await supabase.rpc("record_kompis_ai_usage_event", {
    p_organization_id: input.organizationId ?? null,
    p_actor_id: input.actorId ?? null,
    p_run_id: input.runId ?? null,
    p_provider_family: input.providerFamily ?? "openai_compatible",
    p_model_profile: input.modelProfile,
    p_planner_source: input.plannerSource,
    p_input_units: input.inputUnits ?? null,
    p_output_units: input.outputUnits ?? null,
    p_total_units: input.totalUnits ?? null,
    p_latency_ms: input.latencyMs ?? null,
    p_result: input.result,
    p_safe_error_code: input.safeErrorCode ?? null,
  });
}
