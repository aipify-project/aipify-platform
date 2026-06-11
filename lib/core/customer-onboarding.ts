/**
 * Customer Onboarding Engine helpers (Phase A.10).
 * Authoritative enforcement lives in Supabase RPCs (_cob_*).
 */

export const ONBOARDING_STEPS = [
  "welcome",
  "organization_profile",
  "team_setup",
  "module_activation",
  "knowledge_center",
  "integrations",
  "support_ai",
  "secure_ai_actions",
  "admin_assistant",
  "go_live",
] as const;
export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export const ONBOARDING_CHECKLIST_KEYS = [
  "complete_organization_profile",
  "invite_team_member",
  "activate_core_module",
  "publish_first_article",
  "connect_first_integration",
  "configure_support_channels",
  "review_ai_action_policies",
  "complete_security_review",
  "explore_operations_dashboard",
  "acknowledge_getting_started",
] as const;
export type OnboardingChecklistKey = (typeof ONBOARDING_CHECKLIST_KEYS)[number];

type OnboardingRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export function isOnboardingComplete(completionPercentage?: number, completedAt?: string | null): boolean {
  return Boolean(completedAt) || (completionPercentage ?? 0) >= 100;
}

export function canManageOnboarding(role: string): boolean {
  return role === "owner" || role === "administrator";
}

export async function advanceOnboardingStep(
  supabase: OnboardingRpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("advance_onboarding_step");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function completeChecklistItem(
  supabase: OnboardingRpcClient,
  checklistKey: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("complete_checklist_item", {
    p_checklist_key: checklistKey,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getOnboardingRecommendations(
  supabase: OnboardingRpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_onboarding_recommendations");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function completeOnboarding(
  supabase: OnboardingRpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("complete_onboarding");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createOnboardingAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
