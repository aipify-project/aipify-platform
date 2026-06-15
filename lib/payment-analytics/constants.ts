export const ANALYTICS_PROVIDERS = ["stripe", "vipps", "klarna", "dnb"] as const;

export type AnalyticsProviderKey = (typeof ANALYTICS_PROVIDERS)[number];

export const CUSTOMER_TYPES = ["self_service", "enterprise"] as const;

export type CustomerType = (typeof CUSTOMER_TYPES)[number];

export const CHART_RANGES = ["7d", "30d", "12m"] as const;

export type ChartRange = (typeof CHART_RANGES)[number];

export const CHART_METRICS = [
  "revenue",
  "transactions",
  "refunds",
  "net_revenue",
  "subscriptions",
  "failed_payments",
] as const;

export type ChartMetric = (typeof CHART_METRICS)[number];

export const FILTER_PRESETS = [
  "today",
  "7d",
  "30d",
  "quarter",
  "ytd",
  "previous_year",
] as const;

export type FilterPreset = (typeof FILTER_PRESETS)[number];

export const EXPORT_FORMATS = [
  "csv",
  "xlsx",
  "pdf",
  "board_report",
  "executive_summary",
  "finance_fiken",
  "auditor_package",
  "quarterly_revenue",
] as const;

export type ExportFormat = (typeof EXPORT_FORMATS)[number];

export const ENTERPRISE_STATUS_BADGES: Record<string, string> = {
  current: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  attention: "bg-amber-50 text-amber-900 ring-amber-200",
};

export const CHART_BAR_CLASS = "bg-indigo-500 rounded-t-md min-h-[4px]";

export const TREND_STYLES = {
  up: "text-emerald-700",
  down: "text-red-700",
  flat: "text-gray-500",
} as const;

export const FAILURE_SEVERITY_BADGES: Record<string, string> = {
  low: "bg-blue-50 text-blue-800 ring-blue-200",
  medium: "bg-amber-50 text-amber-900 ring-amber-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};

export const PROVIDER_RANK_BADGES: Record<string, string> = {
  top_performer: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  stable: "bg-slate-50 text-slate-700 ring-slate-200",
  needs_review: "bg-amber-50 text-amber-900 ring-amber-200",
};

export const EXPANSION_BADGES: Record<string, string> = {
  high: "bg-violet-50 text-violet-800 ring-violet-200",
  medium: "bg-sky-50 text-sky-800 ring-sky-200",
  low: "bg-gray-50 text-gray-700 ring-gray-200",
};

export const DISTRIBUTION_WARNING_STYLES = {
  warning: "border-amber-200 bg-amber-50 text-amber-950",
  critical: "border-red-200 bg-red-50 text-red-950",
} as const;
