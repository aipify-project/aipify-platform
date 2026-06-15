export const ANNOUNCEMENT_CATEGORIES = [
  "system_update",
  "maintenance_notice",
  "feature_release",
  "security_notification",
  "billing_communication",
  "growth_partner_update",
  "internal_communication",
] as const;

export type AnnouncementCategory = (typeof ANNOUNCEMENT_CATEGORIES)[number];

export const TARGET_AUDIENCES = [
  "all_customers",
  "trial_customers",
  "enterprise_customers",
  "growth_partners",
  "super_admins",
  "platform_admins",
  "internal_teams",
] as const;

export type TargetAudience = (typeof TARGET_AUDIENCES)[number];

export const ANNOUNCEMENT_STATUSES = [
  "draft",
  "scheduled",
  "published",
  "expired",
  "cancelled",
  "archived",
] as const;

export type AnnouncementStatus = (typeof ANNOUNCEMENT_STATUSES)[number];

export const DELIVERY_CHANNELS = [
  "in_app",
  "email",
  "dashboard_banner",
  "notification_center",
] as const;

export type DeliveryChannel = (typeof DELIVERY_CHANNELS)[number];

export const STATUS_BADGES: Record<AnnouncementStatus, string> = {
  draft: "bg-gray-100 text-gray-800 ring-gray-200",
  scheduled: "bg-sky-50 text-sky-800 ring-sky-200",
  published: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  expired: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  cancelled: "bg-red-50 text-red-800 ring-red-200",
  archived: "bg-violet-50 text-violet-800 ring-violet-200",
};
