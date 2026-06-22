import {
  formatPublicPlanComparisonPrices,
  getPublicPlanCatalog,
  PUBLIC_PLAN_PRICES,
} from "@/lib/marketing/public-pricing";
import type { Locale } from "@/lib/i18n/config";
import type { CustomerSubscriptionContext } from "./types";

export type PricingBridgeLabels = {
  custom: string;
  perMonth: string;
  perMonthShort?: string;
  planStarter: string;
  planProfessional: string;
  planBusiness: string;
  planEnterprise: string;
};

const PLAN_LABEL_KEYS: Record<string, keyof PricingBridgeLabels> = {
  starter: "planStarter",
  professional: "planProfessional",
  business: "planBusiness",
  enterprise: "planEnterprise",
  growth: "planProfessional",
};

export function buildPublishedPricingSummary(
  locale: Locale | string,
  labels: PricingBridgeLabels,
): string {
  const formatted = formatPublicPlanComparisonPrices(locale, {
    custom: labels.custom,
    perMonth: labels.perMonth,
    perMonthShort: labels.perMonthShort,
  });

  const catalog = getPublicPlanCatalog();
  return catalog
    .map((entry) => {
      const labelKey = PLAN_LABEL_KEYS[entry.key] ?? PLAN_LABEL_KEYS[entry.corePlan];
      const planName = labels[labelKey] ?? entry.key;
      const price = formatted[entry.key];
      return `${planName}: ${price}`;
    })
    .join("\n");
}

export function getCanonicalPricingSource(): string {
  return "lib/marketing/public-pricing.ts";
}

export function getPublishedPlanPrices() {
  return PUBLIC_PLAN_PRICES;
}

export function enrichMySubscriptionAnswer(
  directAnswer: string,
  subscription: CustomerSubscriptionContext | null,
  unavailableLabel: string,
): { directAnswer: string; status?: string } {
  if (!subscription) {
    return {
      directAnswer: `${directAnswer}\n\n${unavailableLabel}`,
      status: unavailableLabel,
    };
  }

  return {
    directAnswer: directAnswer
      .replace("{planLabel}", subscription.planLabel)
      .replace("{planKey}", subscription.planKey)
      .replace("{status}", subscription.status),
    status: subscription.status,
  };
}

export function parseCustomerLicenseCenter(raw: unknown): CustomerSubscriptionContext | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const subscription = row.subscription as Record<string, unknown> | undefined;
  if (!subscription) return null;

  const planKey = String(subscription.plan_key ?? subscription.plan ?? "unknown");
  const planLabel = String(subscription.plan_name ?? subscription.plan_label ?? planKey);
  const status = String(subscription.status ?? subscription.license_service_status ?? "unknown");
  const renewalDate =
    typeof subscription.renewal_date === "string"
      ? subscription.renewal_date
      : typeof subscription.current_period_end === "string"
        ? subscription.current_period_end
        : undefined;

  return { planKey, planLabel, status, renewalDate };
}
