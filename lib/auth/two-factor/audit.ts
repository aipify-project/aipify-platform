import type { SupabaseClient } from "@supabase/supabase-js";

export async function logTwoFactorAuditEvent(
  supabase: SupabaseClient,
  eventType:
    | "verification_failed"
    | "suspicious_attempt"
    | "enabled"
    | "disabled"
    | "recovery_codes_regenerated",
  summary: string,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  await supabase.rpc("log_two_factor_audit_event", {
    p_event_type: eventType,
    p_summary: summary,
    p_metadata: metadata,
    p_ip_hash: null,
  });
}
