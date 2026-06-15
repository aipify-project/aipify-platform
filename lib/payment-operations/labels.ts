import type { Translator } from "@/lib/i18n/translate";
import type { PaymentOperationsLabels } from "./types";
import {
  ALERT_SEVERITIES,
  PAYMENT_OPS_PROVIDERS,
  REGIONAL_COVERAGE_KEYS,
} from "./constants";

const CAPABILITY_KEYS = [
  "card_payments",
  "global_subscriptions",
  "apple_pay",
  "google_pay",
  "international_customers",
  "nordic_payments",
  "mobile_checkout",
  "fast_authentication",
  "pay_now",
  "pay_later",
  "installments",
  "enterprise_invoicing",
  "bank_transfers",
  "payment_terms",
] as const;

export function buildPaymentOperationsLabels(t: Translator): PaymentOperationsLabels {
  const p = "platform.paymentOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    foundingPrinciple: t(`${p}.foundingPrinciple`),
    sections: {
      summary: t(`${p}.sections.summary`),
      providers: t(`${p}.sections.providers`),
      configuration: t(`${p}.sections.configuration`),
      settlements: t(`${p}.sections.settlements`),
      regionalCoverage: t(`${p}.sections.regionalCoverage`),
      alerts: t(`${p}.sections.alerts`),
      audit: t(`${p}.sections.audit`),
    },
    summary: {
      activeProviders: t(`${p}.summary.activeProviders`),
      countriesSupported: t(`${p}.summary.countriesSupported`),
      pendingSetups: t(`${p}.summary.pendingSetups`),
      enterpriseCustomers: t(`${p}.summary.enterpriseCustomers`),
      monthlyVolume: t(`${p}.summary.monthlyVolume`),
      failedEvents: t(`${p}.summary.failedEvents`),
    },
    provider: {
      status: t(`${p}.provider.status`),
      capabilities: t(`${p}.provider.capabilities`),
      regions: t(`${p}.provider.regions`),
      environment: t(`${p}.provider.environment`),
      apiStatus: t(`${p}.provider.apiStatus`),
      lastSync: t(`${p}.provider.lastSync`),
      apiKeyStatus: t(`${p}.provider.apiKeyStatus`),
      webhookStatus: t(`${p}.provider.webhookStatus`),
      settlementStatus: t(`${p}.provider.settlementStatus`),
      currencies: t(`${p}.provider.currencies`),
      countries: t(`${p}.provider.countries`),
      configure: t(`${p}.provider.configure`),
    },
    settlements: {
      today: t(`${p}.settlements.today`),
      pending: t(`${p}.settlements.pending`),
      failed: t(`${p}.settlements.failed`),
      estimatedPayout: t(`${p}.settlements.estimatedPayout`),
      empty: t(`${p}.settlements.empty`),
    },
    regional: Object.fromEntries(
      REGIONAL_COVERAGE_KEYS.map((key) => [key, t(`${p}.regional.${key}`)])
    ) as PaymentOperationsLabels["regional"],
    severities: Object.fromEntries(
      ALERT_SEVERITIES.map((severity) => [severity, t(`${p}.severities.${severity}`)])
    ) as PaymentOperationsLabels["severities"],
    statuses: {
      operational: t(`${p}.statuses.operational`),
      pending_setup: t(`${p}.statuses.pendingSetup`),
      requires_attention: t(`${p}.statuses.requiresAttention`),
      disabled: t(`${p}.statuses.disabled`),
      completed: t(`${p}.statuses.completed`),
      pending: t(`${p}.statuses.pending`),
      failed: t(`${p}.statuses.failed`),
      current: t(`${p}.statuses.current`),
      attention: t(`${p}.statuses.attention`),
    },
    apiStatuses: {
      connected: t(`${p}.apiStatuses.connected`),
      disconnected: t(`${p}.apiStatuses.disconnected`),
    },
    environments: {
      sandbox: t(`${p}.environments.sandbox`),
      production: t(`${p}.environments.production`),
    },
    capabilities: Object.fromEntries(
      CAPABILITY_KEYS.map((cap) => [cap, t(`${p}.capabilities.${cap}`)])
    ),
    providers: Object.fromEntries(
      PAYMENT_OPS_PROVIDERS.map((provider) => [provider, t(`${p}.providers.${provider}`)])
    ) as PaymentOperationsLabels["providers"],
    audit: {
      action: t(`${p}.audit.action`),
      before: t(`${p}.audit.before`),
      after: t(`${p}.audit.after`),
      empty: t(`${p}.audit.empty`),
    },
  };
}
