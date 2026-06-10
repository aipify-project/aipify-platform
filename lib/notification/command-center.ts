import type { PlanType } from "@/lib/platform/types";

/** Future Desktop Command Center sections (Phase 26). */
export const COMMAND_CENTER_SECTIONS = [
  "executive_feed",
  "recent_activity",
  "health_overview",
  "pending_approvals",
  "recommendations",
  "presence_timeline",
  "skill_status",
  "system_notifications",
  "quick_actions",
] as const;

export type CommandCenterSection = (typeof COMMAND_CENTER_SECTIONS)[number];

export const QUICK_ACTIONS = [
  "approve_recommendation",
  "review_support_escalation",
  "open_executive_summary",
  "view_installation_health",
  "dismiss_notification",
  "pause_notifications",
  "open_web_dashboard",
  "mark_as_reviewed",
] as const;

export type QuickActionId = (typeof QUICK_ACTIONS)[number];

export const COMMAND_CENTER_ROUTE = "/app/command-center";

export const COMMAND_CENTER_PRINCIPLE =
  "Aipify should quietly watch over the business. When something truly matters, Aipify should speak up.";

/** Plan packaging for Presence / Command Center (Phase 26 spec). */
export const PRESENCE_PACKAGE_BY_PLAN: Record<
  PlanType,
  {
    web: boolean;
    enhanced_presence: boolean;
    executive_feed: boolean;
    desktop_presence: boolean;
    command_center: boolean;
    advanced_notifications: boolean;
    actionable_approvals: boolean;
    mobile_presence: boolean;
    dedicated_policies: boolean;
  }
> = {
  starter: {
    web: true,
    enhanced_presence: false,
    executive_feed: false,
    desktop_presence: false,
    command_center: false,
    advanced_notifications: false,
    actionable_approvals: false,
    mobile_presence: false,
    dedicated_policies: false,
  },
  growth: {
    web: true,
    enhanced_presence: true,
    executive_feed: true,
    desktop_presence: false,
    command_center: false,
    advanced_notifications: false,
    actionable_approvals: false,
    mobile_presence: false,
    dedicated_policies: false,
  },
  business: {
    web: true,
    enhanced_presence: true,
    executive_feed: true,
    desktop_presence: true,
    command_center: true,
    advanced_notifications: true,
    actionable_approvals: true,
    mobile_presence: false,
    dedicated_policies: false,
  },
  enterprise: {
    web: true,
    enhanced_presence: true,
    executive_feed: true,
    desktop_presence: true,
    command_center: true,
    advanced_notifications: true,
    actionable_approvals: true,
    mobile_presence: true,
    dedicated_policies: true,
  },
};

export function planHasCommandCenter(plan: PlanType): boolean {
  return PRESENCE_PACKAGE_BY_PLAN[plan].command_center;
}
