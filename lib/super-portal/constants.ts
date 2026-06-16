export const SUPER_PORTAL_LOCALES = ["en", "no", "sv", "da"] as const;

export type SuperPortalLocale = (typeof SUPER_PORTAL_LOCALES)[number];

export const PLATFORM_ADMIN_STATUSES = ["active", "suspended"] as const;

export type PlatformAdminStatus = (typeof PLATFORM_ADMIN_STATUSES)[number];

export const PLATFORM_ADMIN_ROLES = ["super_admin", "platform_support"] as const;

export type PlatformAdminRole = (typeof PLATFORM_ADMIN_ROLES)[number];

export const GLOBAL_PLATFORM_STATUSES = ["operational", "attention_required"] as const;

export type GlobalPlatformStatus = (typeof GLOBAL_PLATFORM_STATUSES)[number];

export const TREND_DIRECTIONS = ["up", "stable", "down"] as const;

export type TrendDirection = (typeof TREND_DIRECTIONS)[number];

export const STATUS_BADGES: Record<string, string> = {
  operational: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  attention_required: "bg-amber-50 text-amber-800 ring-amber-200",
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  suspended: "bg-rose-50 text-rose-800 ring-rose-200",
  up: "text-emerald-700",
  stable: "text-zinc-600",
  down: "text-rose-700",
};
