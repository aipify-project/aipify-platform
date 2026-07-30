import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export const KOMPIS_CIRCUIT_FAILURE_THRESHOLD = 3;
export const KOMPIS_CIRCUIT_WINDOW_SECONDS = 300;
export const KOMPIS_CIRCUIT_COOLDOWN_SECONDS = 300;

const CIRCUIT_ELIGIBLE_ERRORS = new Set([
  "provider_timeout",
  "provider_rate_limited",
  "provider_output_invalid",
  "provider_http_5xx",
  "provider_network_failure",
  "provider_unavailable",
  "provider_http_error",
]);

export function isCircuitEligibleError(code: string | undefined): boolean {
  return Boolean(code && CIRCUIT_ELIGIBLE_ERRORS.has(code));
}

export async function recordKompisCircuitEvent(
  supabase: SupabaseClient,
  event: "failure" | "success" | "open" | "half_open_success" | "half_open_failure",
  safeErrorCode?: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("record_kompis_ai_circuit_event", {
    p_event: event,
    p_safe_error_code: safeErrorCode ?? null,
  });
  if (error) return {};
  return (data ?? {}) as Record<string, unknown>;
}

export function isCircuitOpenFromState(state: Record<string, unknown>): boolean {
  if (state.circuit_open === true) return true;
  const until = typeof state.cooldown_until === "string" ? Date.parse(state.cooldown_until) : NaN;
  return Number.isFinite(until) && until > Date.now();
}
