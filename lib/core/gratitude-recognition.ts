/**
 * Gratitude & Recognition Engine helpers (Phase A.89).
 * Authoritative enforcement lives in Supabase RPCs.
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const GRATITUDE_MOMENT_TYPES = [
  "exceptional_support",
  "milestone",
  "customer_appreciation",
  "consistent_helper",
  "above_and_beyond",
] as const;
export type GratitudeMomentType = (typeof GRATITUDE_MOMENT_TYPES)[number];

export const RECOGNITION_TARGET_ROLES = ["colleague", "team", "customer", "self"] as const;
export type RecognitionTargetRole = (typeof RECOGNITION_TARGET_ROLES)[number];

export const GRATITUDE_MOMENT_STATUSES = ["pending", "acknowledged", "celebrated", "archived"] as const;
export type GratitudeMomentStatus = (typeof GRATITUDE_MOMENT_STATUSES)[number];

export const GRATITUDE_RECOGNITION_PERMISSION_KEYS = [
  "gratitude_recognition.view",
  "gratitude_recognition.manage",
  "gratitude_recognition.rose.send",
  "gratitude_recognition.export",
] as const;
export type GratitudeRecognitionPermissionKey = (typeof GRATITUDE_RECOGNITION_PERMISSION_KEYS)[number];

export const GRATITUDE_RECOGNITION_MODULE_KEY = "gratitude_recognition_engine" as const;

export async function getGratitudeRecognitionEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_gratitude_recognition_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getGratitudeRecognitionEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_gratitude_recognition_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createGratitudeRecognitionAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
