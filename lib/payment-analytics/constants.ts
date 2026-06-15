export const ANALYTICS_PROVIDERS = ["stripe", "vipps", "klarna", "dnb"] as const;

export type AnalyticsProviderKey = (typeof ANALYTICS_PROVIDERS)[number];

export const CUSTOMER_TYPES = ["self_service", "enterprise"] as const;

export type CustomerType = (typeof CUSTOMER_TYPES)[number];

export const CHART_RANGES = ["7d", "30d", "12m"] as const;

export type ChartRange = (typeof CHART_RANGES)[number];

export const EXPORT_FORMATS = ["csv", "xlsx", "pdf"] as const;

export type ExportFormat = (typeof EXPORT_FORMATS)[number];

export const ENTERPRISE_STATUS_BADGES: Record<string, string> = {
  current: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  attention: "bg-amber-50 text-amber-900 ring-amber-200",
};

export const CHART_BAR_CLASS = "bg-indigo-500 rounded-t-md min-h-[4px]";
