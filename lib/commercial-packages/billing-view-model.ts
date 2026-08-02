import type { BillingCenter } from "./types";
import { parseBillingCenter } from "./parse";

export type BillingLimitMeter = {
  key: "users" | "installations" | "domains";
  used: number;
  max: number | null;
  /** 0–100 when max is finite; null when unlimited. */
  percent: number | null;
};

export type BillingUsageItem = {
  key: string;
  value: number;
};

export type BillingHistoryItem = {
  planName: string;
  statusKey: string;
  nextBillingDate: string | null;
  updatedAt: string | null;
};

export type BillingLockedCapability = {
  id: string;
  name: string;
  description: string;
  kind: "upgrade" | "addon" | "recommendation";
};

export type BillingNextStep = {
  kind: "view_packages" | "review_usage" | "none";
  recommendationText: string | null;
};

export type BillingViewModel = {
  hasCustomer: boolean;
  packageName: string | null;
  packageKey: string | null;
  packageDescription: string | null;
  packageFeatures: string[];
  statusKey: string | null;
  modulesCount: number;
  usageItems: BillingUsageItem[];
  limits: BillingLimitMeter[];
  history: BillingHistoryItem[];
  lockedCapabilities: BillingLockedCapability[];
  nextStep: BillingNextStep;
  nextBillingDate: string | null;
  periodMonth: string | null;
};

function asNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return 0;
}

function asNullableMax(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === "string" && (value === "∞" || value.toLowerCase() === "unlimited")) {
    return null;
  }
  const n = asNumber(value);
  if (n <= 0) return null;
  return n;
}

function meter(
  key: BillingLimitMeter["key"],
  usedRaw: unknown,
  maxRaw: unknown
): BillingLimitMeter {
  const used = asNumber(usedRaw);
  const max = asNullableMax(maxRaw);
  const percent =
    max != null && max > 0 ? Math.min(100, Math.round((used / max) * 100)) : null;
  return { key, used, max, percent };
}

function customerSafeName(raw: unknown, fallback: string): string {
  const text = typeof raw === "string" ? raw.trim() : "";
  if (!text) return fallback;
  // Hide snake_case / dotted internal keys from customers
  if (/^[a-z0-9]+([._][a-z0-9]+)+$/.test(text)) return fallback;
  return text;
}

function customerSafeDescription(raw: unknown): string {
  const text = typeof raw === "string" ? raw.trim() : "";
  if (!text) return "";
  if (/^[a-z0-9]+([._][a-z0-9]+)+$/.test(text)) return "";
  return text;
}

/**
 * Build a customer-safe view model from the live billing API payload.
 * Never invents package, usage, invoice, or recommendation values.
 */
export function buildBillingViewModel(input: unknown): BillingViewModel {
  const center: BillingCenter = parseBillingCenter(input);
  const limitsRaw = (center.tenant_limits ?? {}) as Record<string, unknown>;
  const usageRaw = (center.usage ?? {}) as Record<string, unknown>;

  const usageKeys = [
    "support_cases_handled",
    "autonomous_resolutions",
    "knowledge_searches",
    "employee_interactions",
    "insight_reports_generated",
    "api_calls",
    "ai_usage_volume",
  ] as const;

  const usageItems: BillingUsageItem[] = usageKeys.map((key) => ({
    key,
    value: asNumber(usageRaw[key]),
  }));

  const history: BillingHistoryItem[] = (center.billing_history ?? []).map((row) => {
    const r = row as Record<string, unknown>;
    return {
      planName: customerSafeName(r.plan_name, "—"),
      statusKey: typeof r.status === "string" ? r.status.toLowerCase() : "unknown",
      nextBillingDate:
        typeof r.next_billing_date === "string" ? r.next_billing_date : null,
      updatedAt: typeof r.updated_at === "string" ? r.updated_at : null,
    };
  });

  const statusKey = history[0]?.statusKey ?? (center.current_package ? "active" : null);
  const nextBillingDate = history.find((h) => h.nextBillingDate)?.nextBillingDate ?? null;

  const lockedFromUpgrades: BillingLockedCapability[] = (center.upgrade_options ?? [])
    .slice(0, 6)
    .map((row, index) => {
      const r = row as Record<string, unknown>;
      return {
        id: `upgrade-${String(r.package_key ?? index)}`,
        name: customerSafeName(r.package_name, ""),
        description: customerSafeDescription(r.description),
        kind: "upgrade" as const,
      };
    })
    .filter((item) => item.name.length > 0);

  const lockedFromAddons: BillingLockedCapability[] = (center.addon_marketplace ?? [])
    .slice(0, 4)
    .map((row, index) => {
      const r = row as Record<string, unknown>;
      return {
        id: `addon-${String(r.addon_key ?? index)}`,
        name: customerSafeName(r.name ?? r.package_name, ""),
        description: customerSafeDescription(r.description),
        kind: "addon" as const,
      };
    })
    .filter((item) => item.name.length > 0);

  const lockedFromRecommendations: BillingLockedCapability[] = (
    center.upgrade_recommendations ?? []
  )
    .slice(0, 3)
    .map((row, index) => {
      const r = row as Record<string, unknown>;
      return {
        id: `rec-${index}`,
        name: customerSafeName(
          r.title ?? r.package_name ?? r.recommendation,
          ""
        ),
        description: customerSafeDescription(r.reason ?? r.description ?? r.message),
        kind: "recommendation" as const,
      };
    })
    .filter((item) => item.name.length > 0);

  const lockedCapabilities = [
    ...lockedFromRecommendations,
    ...lockedFromUpgrades,
    ...lockedFromAddons,
  ].slice(0, 8);

  const firstRecommendation = lockedFromRecommendations[0]?.description
    || lockedFromRecommendations[0]?.name
    || null;

  let nextStep: BillingNextStep = { kind: "none", recommendationText: null };
  if (lockedCapabilities.length > 0) {
    nextStep = {
      kind: "view_packages",
      recommendationText: firstRecommendation,
    };
  } else if (usageItems.some((u) => u.value > 0)) {
    nextStep = { kind: "review_usage", recommendationText: null };
  }

  const packageFeatures = (center.current_package?.features ?? [])
    .map((f) => customerSafeName(f, ""))
    .filter(Boolean);

  return {
    hasCustomer: center.has_customer,
    packageName: center.current_package?.package_name?.trim() || null,
    packageKey: center.current_package?.package_key?.trim() || null,
    packageDescription: customerSafeDescription(center.current_package?.description) || null,
    packageFeatures,
    statusKey,
    modulesCount: center.enabled_modules?.length ?? 0,
    usageItems,
    limits: [
      meter("users", limitsRaw.used_users, limitsRaw.max_users),
      meter("installations", limitsRaw.used_installations, limitsRaw.max_installations),
      meter("domains", limitsRaw.used_domains, limitsRaw.max_domains),
    ],
    history,
    lockedCapabilities,
    nextStep,
    nextBillingDate,
    periodMonth:
      typeof usageRaw.period_month === "string" ? usageRaw.period_month : null,
  };
}
