/**
 * Subscription & Plan Management helpers (Phase A.11).
 * Authoritative enforcement lives in Supabase RPCs (_spm_*).
 */

export const SUBSCRIPTION_PLAN_KEYS = [
  "starter",
  "business",
  "professional",
  "enterprise",
  "internal",
] as const;
export type SubscriptionPlanKey = (typeof SUBSCRIPTION_PLAN_KEYS)[number];

export const SUBSCRIPTION_STATUSES = [
  "trial",
  "active",
  "past_due",
  "cancelled",
  "expired",
  "internal",
] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export const BILLING_PROVIDERS = ["stripe", "paddle", "manual"] as const;
export type BillingProvider = (typeof BILLING_PROVIDERS)[number];

export const PLAN_RANK: Record<SubscriptionPlanKey, number> = {
  starter: 1,
  business: 2,
  professional: 3,
  enterprise: 4,
  internal: 5,
};

type SpmRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export function isUpgrade(fromPlan: SubscriptionPlanKey, toPlan: SubscriptionPlanKey): boolean {
  return PLAN_RANK[toPlan] > PLAN_RANK[fromPlan];
}

export function isDowngrade(fromPlan: SubscriptionPlanKey, toPlan: SubscriptionPlanKey): boolean {
  return PLAN_RANK[toPlan] < PLAN_RANK[fromPlan];
}

export function isSubscriptionActive(status?: SubscriptionStatus): boolean {
  return status === "active" || status === "trial" || status === "internal";
}

export function daysUntilTrialEnd(trialEndsAt?: string | null): number | null {
  if (!trialEndsAt) return null;
  const diff = new Date(trialEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export async function createOrganizationSubscription(
  supabase: SpmRpcClient,
  params: { plan_key?: SubscriptionPlanKey; billing_cycle?: "monthly" | "yearly" }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_organization_subscription", {
    p_plan_key: params.plan_key ?? "starter",
    p_billing_cycle: params.billing_cycle ?? "monthly",
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function startSubscriptionTrial(
  supabase: SpmRpcClient,
  trialDays?: number
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("start_organization_subscription_trial", {
    p_trial_days: trialDays ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function upgradeSubscription(
  supabase: SpmRpcClient,
  planKey: SubscriptionPlanKey
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("upgrade_organization_subscription", {
    p_plan_key: planKey,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function downgradeSubscription(
  supabase: SpmRpcClient,
  planKey: SubscriptionPlanKey,
  confirm = false
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("downgrade_organization_subscription", {
    p_plan_key: planKey,
    p_confirm: confirm,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function cancelSubscription(
  supabase: SpmRpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("cancel_organization_subscription");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function reactivateSubscription(
  supabase: SpmRpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("reactivate_organization_subscription");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getOrganizationPlanModules(
  supabase: SpmRpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_organization_plan_modules");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
