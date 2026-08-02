import type { BillingCenter } from "./types";
import { parseBillingCenter } from "./parse";
import {
  canonicalProductIdentityKey,
  dedupeLockedCapabilities,
  lockedCapabilityPriority,
  resolveCustomerFacingFeatureLabel,
  resolveTrustedCustomerFacingModulesCount,
  type PackagePresentationOptions,
  type LockedCapabilityCandidate,
} from "./package-presentation";

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
  /** Present only when a real renewal date exists and status is not lifetime. */
  renewalDate: string | null;
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
  /** Null when count is not a trusted customer-facing licensed-feature count. */
  modulesCount: number | null;
  usageItems: BillingUsageItem[];
  limits: BillingLimitMeter[];
  history: BillingHistoryItem[];
  lockedCapabilities: BillingLockedCapability[];
  nextStep: BillingNextStep;
  /** Renewal date for the active subscription — never presented as an invoice date. */
  renewalDate: string | null;
  periodMonth: string | null;
  /** Which sections have usable Production data (missing ≠ fatal). */
  sections: {
    package: boolean;
    usage: boolean;
    limits: boolean;
    history: boolean;
    locked: boolean;
  };
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
export function buildBillingViewModel(
  input: unknown,
  options: PackagePresentationOptions = {}
): BillingViewModel {
  const center: BillingCenter = parseBillingCenter(input);
  const limitsRaw = (center.tenant_limits ?? {}) as Record<string, unknown>;
  const usageRaw = (center.usage ?? {}) as Record<string, unknown>;
  const localizePackage = options.localizePackage;
  const localizeFeature = options.localizeFeature;

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
    const statusKey = typeof r.status === "string" ? r.status.toLowerCase() : "unknown";
    const next =
      typeof r.next_billing_date === "string" && r.next_billing_date.trim()
        ? r.next_billing_date.trim()
        : null;
    return {
      planName: customerSafeName(r.plan_name, "—"),
      statusKey,
      renewalDate: statusKey === "lifetime" ? null : next,
      updatedAt: typeof r.updated_at === "string" ? r.updated_at : null,
    };
  });

  const statusKey = history[0]?.statusKey ?? (center.current_package ? "active" : null);
  const renewalDate =
    statusKey === "lifetime"
      ? null
      : history.find((h) => h.renewalDate)?.renewalDate ?? null;

  const lockedCandidates: LockedCapabilityCandidate[] = [];

  (center.upgrade_recommendations ?? []).slice(0, 3).forEach((row, index) => {
    const r = row as Record<string, unknown>;
    const packageKey =
      typeof r.package_key === "string"
        ? r.package_key
        : typeof r.packageKey === "string"
          ? r.packageKey
          : null;
    const localized = packageKey ? localizePackage?.(packageKey) : null;
    const name = customerSafeName(
      localized?.name ?? r.title ?? r.package_name ?? r.recommendation,
      ""
    );
    if (!name) return;
    lockedCandidates.push({
      id: `rec-${packageKey ?? index}`,
      identityKey: canonicalProductIdentityKey({
        packageKey,
        kind: "recommendation",
        fallbackIndex: index,
      }),
      name,
      description: customerSafeDescription(
        localized?.description ?? r.reason ?? r.description ?? r.message
      ),
      kind: "recommendation",
      priority: lockedCapabilityPriority("recommendation"),
    });
  });

  (center.upgrade_options ?? []).slice(0, 6).forEach((row, index) => {
    const r = row as Record<string, unknown>;
    const packageKey =
      typeof r.package_key === "string"
        ? r.package_key
        : typeof r.packageKey === "string"
          ? r.packageKey
          : null;
    const localized = packageKey ? localizePackage?.(packageKey) : null;
    const name = customerSafeName(localized?.name ?? r.package_name, "");
    if (!name) return;
    lockedCandidates.push({
      id: `upgrade-${packageKey ?? index}`,
      identityKey: canonicalProductIdentityKey({
        packageKey,
        kind: "upgrade",
        fallbackIndex: index,
      }),
      name,
      description: customerSafeDescription(localized?.description ?? r.description),
      kind: "upgrade",
      priority: lockedCapabilityPriority("upgrade"),
    });
  });

  (center.addon_marketplace ?? []).slice(0, 4).forEach((row, index) => {
    const r = row as Record<string, unknown>;
    const addonKey =
      typeof r.addon_key === "string"
        ? r.addon_key
        : typeof r.package_key === "string"
          ? r.package_key
          : null;
    const localized = addonKey ? localizePackage?.(addonKey) : null;
    const name = customerSafeName(localized?.name ?? r.name ?? r.package_name, "");
    if (!name) return;
    lockedCandidates.push({
      id: `addon-${addonKey ?? index}`,
      identityKey: canonicalProductIdentityKey({
        packageKey: addonKey,
        addonKey,
        kind: "addon",
        fallbackIndex: index,
      }),
      name,
      description: customerSafeDescription(localized?.description ?? r.description),
      kind: "addon",
      priority: lockedCapabilityPriority("addon"),
    });
  });

  const lockedCapabilities = dedupeLockedCapabilities(lockedCandidates, 8);

  const firstRecommendation = lockedCapabilities.find((c) => c.kind === "recommendation");
  const firstRecommendationText =
    firstRecommendation?.description || firstRecommendation?.name || null;

  let nextStep: BillingNextStep = { kind: "none", recommendationText: null };
  if (lockedCapabilities.length > 0) {
    nextStep = {
      kind: "view_packages",
      recommendationText: firstRecommendationText,
    };
  } else if (usageItems.some((u) => u.value > 0)) {
    nextStep = { kind: "review_usage", recommendationText: null };
  }

  const packageKey = center.current_package?.package_key?.trim() || null;
  const localizedPackage = packageKey ? localizePackage?.(packageKey) : null;
  const packageName =
    localizedPackage?.name?.trim() ||
    center.current_package?.package_name?.trim() ||
    null;
  const packageDescription =
    localizedPackage?.description?.trim() ||
    customerSafeDescription(center.current_package?.description) ||
    null;

  const packageFeatures = (center.current_package?.features ?? [])
    .map((f) => resolveCustomerFacingFeatureLabel(String(f), localizeFeature))
    .filter((f): f is string => Boolean(f));

  const limits = [
    meter("users", limitsRaw.used_users, limitsRaw.max_users),
    meter("installations", limitsRaw.used_installations, limitsRaw.max_installations),
    meter("domains", limitsRaw.used_domains, limitsRaw.max_domains),
  ];

  return {
    hasCustomer: center.has_customer,
    packageName,
    packageKey,
    packageDescription,
    packageFeatures,
    statusKey,
    modulesCount: resolveTrustedCustomerFacingModulesCount(center.enabled_modules),
    usageItems,
    limits,
    history,
    lockedCapabilities,
    nextStep,
    renewalDate,
    periodMonth:
      typeof usageRaw.period_month === "string" ? usageRaw.period_month : null,
    sections: {
      package: Boolean(packageName),
      usage: usageItems.length > 0,
      limits: Object.keys(limitsRaw).length > 0,
      history: history.length > 0,
      locked: lockedCapabilities.length > 0,
    },
  };
}
