import {
  WEBSITE_KOMPIS_PLAN_CATALOG,
  WEBSITE_KOMPIS_USAGE_METER_AVAILABLE,
} from "./catalog";
import type { WebsiteKompisPlanId } from "./types";

type TranslateFn = (key: string) => string;

export function buildWebsiteKompisPlanLabels(t: TranslateFn) {
  const p = "customerApp.websiteKompisPlans";
  const plans = Object.fromEntries(
    WEBSITE_KOMPIS_PLAN_CATALOG.map((plan) => [
      plan.id,
      {
        name: t(`${p}.plans.${plan.id}.name`),
        tagline: t(`${p}.plans.${plan.id}.tagline`),
        quotaLabel: t(`${p}.plans.${plan.id}.quotaLabel`),
        feature1: t(`${p}.plans.${plan.id}.feature1`),
        feature2: t(`${p}.plans.${plan.id}.feature2`),
        feature3: t(`${p}.plans.${plan.id}.feature3`),
      },
    ])
  ) as Record<
    WebsiteKompisPlanId,
    {
      name: string;
      tagline: string;
      quotaLabel: string;
      feature1: string;
      feature2: string;
      feature3: string;
    }
  >;

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    plannedBadge: t(`${p}.plannedBadge`),
    notActiveCheckout: t(`${p}.notActiveCheckout`),
    usageUnavailableTitle: t(`${p}.usageUnavailableTitle`),
    usageUnavailableBody: t(`${p}.usageUnavailableBody`),
    seePlans: t(`${p}.seePlans`),
    monthlyPrice: t(`${p}.monthlyPrice`),
    annualPrice: t(`${p}.annualPrice`),
    annualHint: t(`${p}.annualHint`),
    freePrice: t(`${p}.freePrice`),
    vatUnknown: t(`${p}.vatUnknown`),
    multiSiteNote: t(`${p}.multiSiteNote`),
    grandfatherNote: t(`${p}.grandfatherNote`),
    upgradeReadinessTitle: t(`${p}.upgradeReadinessTitle`),
    upgradeReadinessBody: t(`${p}.upgradeReadinessBody`),
    openSubscription: t(`${p}.openSubscription`),
    openInvoices: t(`${p}.openInvoices`),
    usageMeterAvailable: WEBSITE_KOMPIS_USAGE_METER_AVAILABLE,
    plans,
  };
}

export type WebsiteKompisPlanLabels = ReturnType<typeof buildWebsiteKompisPlanLabels>;

export function buildWebsiteKompisPlanPlatformLabels(t: TranslateFn) {
  const p = "platform.websiteKompisPlans";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    catalogSection: t(`${p}.catalogSection`),
    templatesSection: t(`${p}.templatesSection`),
    deliveryDraftOnly: t(`${p}.deliveryDraftOnly`),
    noCustomerSend: t(`${p}.noCustomerSend`),
    previewSubject: t(`${p}.previewSubject`),
    previewBody: t(`${p}.previewBody`),
    readinessSection: t(`${p}.readinessSection`),
    readinessLedger: t(`${p}.readinessLedger`),
    readinessStripe: t(`${p}.readinessStripe`),
    readinessMultisite: t(`${p}.readinessMultisite`),
    readinessEmail: t(`${p}.readinessEmail`),
    readinessInvoice: t(`${p}.readinessInvoice`),
    offerStatusPlanned: t(`${p}.offerStatusPlanned`),
    quotaLifetime: t(`${p}.quotaLifetime`),
    quotaMonthly: t(`${p}.quotaMonthly`),
    priceMonthly: t(`${p}.priceMonthly`),
    priceAnnual: t(`${p}.priceAnnual`),
    freePrice: t(`${p}.freePrice`),
    checkoutNotEnabled: t(`${p}.checkoutNotEnabled`),
    stripeTrialNote: t(`${p}.stripeTrialNote`),
    templates: {
      welcome_free: t(`${p}.templates.welcome_free`),
      quota_remaining_30: t(`${p}.templates.quota_remaining_30`),
      quota_remaining_10: t(`${p}.templates.quota_remaining_10`),
      quota_remaining_0: t(`${p}.templates.quota_remaining_0`),
      upgrade_confirmed: t(`${p}.templates.upgrade_confirmed`),
      invoice_paid: t(`${p}.templates.invoice_paid`),
      payment_failed: t(`${p}.templates.payment_failed`),
      payment_grace_3_days: t(`${p}.templates.payment_grace_3_days`),
      reactivated: t(`${p}.templates.reactivated`),
    },
  };
}

export type WebsiteKompisPlanPlatformLabels = ReturnType<
  typeof buildWebsiteKompisPlanPlatformLabels
>;
