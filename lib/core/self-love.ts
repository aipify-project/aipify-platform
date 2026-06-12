/**
 * Self Love Engine helpers (Phase A.76).
 * Authoritative enforcement lives in Supabase RPCs.
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export const SELF_LOVE_CATEGORIES = [
  "user_wellbeing",
  "team_health",
  "organization_health",
  "system_health",
] as const;
export type SelfLoveCategory = (typeof SELF_LOVE_CATEGORIES)[number];

export const SELF_LOVE_REMINDER_FREQUENCIES = ["low", "normal", "high"] as const;
export type SelfLoveReminderFrequency = (typeof SELF_LOVE_REMINDER_FREQUENCIES)[number];

export const SELF_LOVE_TONES = ["warm", "balanced", "minimal"] as const;
export type SelfLoveTone = (typeof SELF_LOVE_TONES)[number];

export const SELF_LOVE_RECOMMENDATION_STATUSES = ["pending", "acknowledged", "dismissed"] as const;
export type SelfLoveRecommendationStatus = (typeof SELF_LOVE_RECOMMENDATION_STATUSES)[number];

export const SELF_LOVE_CONFIDENCE_LEVELS = ["low", "moderate", "high"] as const;
export type SelfLoveConfidenceLevel = (typeof SELF_LOVE_CONFIDENCE_LEVELS)[number];

export const SELF_LOVE_PERMISSION_KEYS = [
  "self_love.view",
  "self_love.manage",
  "self_love.preferences.manage",
  "self_love.export",
] as const;
export type SelfLovePermissionKey = (typeof SELF_LOVE_PERMISSION_KEYS)[number];

export async function getSelfLoveEngineDashboard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_self_love_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getSelfLoveEngineCard(
  supabase: RpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_self_love_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updateOrganizationSelfLoveSettings(
  supabase: RpcClient,
  payload: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_organization_self_love_settings", {
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updateUserSelfLovePreferences(
  supabase: RpcClient,
  payload: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_user_self_love_preferences", {
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function acknowledgeSelfLoveRecommendation(
  supabase: RpcClient,
  recommendationId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("acknowledge_self_love_recommendation", {
    p_recommendation_id: recommendationId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
