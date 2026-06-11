import type {
  SubscriptionPlanKey,
  SubscriptionPlanManagementCard,
  SubscriptionPlanManagementDashboard,
  SubscriptionStatus,
} from "./types";

export function parseSubscriptionPlanManagementCard(
  data: unknown
): SubscriptionPlanManagementCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    plan_key: typeof d.plan_key === "string" ? (d.plan_key as SubscriptionPlanKey) : undefined,
    status: typeof d.status === "string" ? (d.status as SubscriptionStatus) : undefined,
    trial_ends_at:
      typeof d.trial_ends_at === "string" || d.trial_ends_at === null
        ? (d.trial_ends_at as string | null)
        : undefined,
    module_count: Number(d.module_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
  };
}

export function parseSubscriptionPlanManagementDashboard(
  data: unknown
): SubscriptionPlanManagementDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    subscription:
      typeof d.subscription === "object" && d.subscription
        ? (d.subscription as SubscriptionPlanManagementDashboard["subscription"])
        : undefined,
    settings:
      typeof d.settings === "object" && d.settings
        ? (d.settings as SubscriptionPlanManagementDashboard["settings"])
        : undefined,
    available_plans: Array.isArray(d.available_plans)
      ? (d.available_plans as SubscriptionPlanManagementDashboard["available_plans"])
      : [],
    active_modules: Array.isArray(d.active_modules)
      ? (d.active_modules as SubscriptionPlanManagementDashboard["active_modules"])
      : [],
    upgrade_opportunities: Array.isArray(d.upgrade_opportunities)
      ? (d.upgrade_opportunities as SubscriptionPlanManagementDashboard["upgrade_opportunities"])
      : [],
    billing_scaffold:
      typeof d.billing_scaffold === "object" && d.billing_scaffold
        ? (d.billing_scaffold as SubscriptionPlanManagementDashboard["billing_scaffold"])
        : undefined,
  };
}
