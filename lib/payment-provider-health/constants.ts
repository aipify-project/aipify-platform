export const HEALTH_PROVIDERS = ["stripe", "vipps", "klarna", "dnb"] as const;

export type HealthProviderKey = (typeof HEALTH_PROVIDERS)[number];

export const HEALTH_STATUSES = ["operational", "warning", "offline"] as const;

export type HealthStatus = (typeof HEALTH_STATUSES)[number];

export const ALERT_SEVERITIES = ["info", "warning", "critical"] as const;

export type AlertSeverity = (typeof ALERT_SEVERITIES)[number];

export const AUTO_CHECK_INTERVALS: Record<HealthProviderKey, number> = {
  stripe: 5,
  vipps: 5,
  klarna: 5,
  dnb: 30,
};

export const HEALTH_STATUS_INDICATORS: Record<HealthStatus, { dot: string; badge: string }> = {
  operational: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  },
  warning: {
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-900 ring-amber-200",
  },
  offline: {
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-800 ring-red-200",
  },
};

export const ALERT_SEVERITY_BADGES: Record<AlertSeverity, string> = {
  info: "bg-blue-50 text-blue-800 ring-blue-200",
  warning: "bg-amber-50 text-amber-900 ring-amber-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};

export const API_CONNECTION_LABELS = {
  connected: "connected",
  disconnected: "disconnected",
  degraded: "degraded",
} as const;

export const RESOLUTION_STATUSES = ["open", "resolved", "acknowledged"] as const;
