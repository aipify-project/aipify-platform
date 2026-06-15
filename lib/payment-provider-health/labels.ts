import type { Translator } from "@/lib/i18n/translate";
import type { PaymentProviderHealthLabels } from "./types";
import { ALERT_SEVERITIES, HEALTH_PROVIDERS, HEALTH_STATUSES } from "./constants";

export function buildPaymentProviderHealthLabels(t: Translator): PaymentProviderHealthLabels {
  const p = "platform.paymentHealth";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    sections: {
      providers: t(`${p}.sections.providers`),
      alerts: t(`${p}.sections.alerts`),
      audit: t(`${p}.sections.audit`),
      autoChecks: t(`${p}.sections.autoChecks`),
    },
    provider: {
      status: t(`${p}.provider.status`),
      environment: t(`${p}.provider.environment`),
      apiConnection: t(`${p}.provider.apiConnection`),
      webhookStatus: t(`${p}.provider.webhookStatus`),
      lastTransaction: t(`${p}.provider.lastTransaction`),
      lastSync: t(`${p}.provider.lastSync`),
      failed24h: t(`${p}.provider.failed24h`),
      successRate: t(`${p}.provider.successRate`),
      nextCheck: t(`${p}.provider.nextCheck`),
      viewDetails: t(`${p}.provider.viewDetails`),
      retryCheck: t(`${p}.provider.retryCheck`),
      viewLogs: t(`${p}.provider.viewLogs`),
      testConnection: t(`${p}.provider.testConnection`),
    },
    healthStatuses: Object.fromEntries(
      HEALTH_STATUSES.map((status) => [status, t(`${p}.healthStatuses.${status}`)])
    ) as PaymentProviderHealthLabels["healthStatuses"],
    environments: {
      sandbox: t(`${p}.environments.sandbox`),
      production: t(`${p}.environments.production`),
    },
    apiStatuses: {
      connected: t(`${p}.apiStatuses.connected`),
      disconnected: t(`${p}.apiStatuses.disconnected`),
      degraded: t(`${p}.apiStatuses.degraded`),
    },
    severities: Object.fromEntries(
      ALERT_SEVERITIES.map((severity) => [severity, t(`${p}.severities.${severity}`)])
    ) as PaymentProviderHealthLabels["severities"],
    providers: Object.fromEntries(
      HEALTH_PROVIDERS.map((provider) => [provider, t(`${p}.providers.${provider}`)])
    ) as PaymentProviderHealthLabels["providers"],
    autoChecks: Object.fromEntries(
      HEALTH_PROVIDERS.map((provider) => [provider, t(`${p}.autoChecks.${provider}`)])
    ) as PaymentProviderHealthLabels["autoChecks"],
    audit: {
      event: t(`${p}.audit.event`),
      severity: t(`${p}.audit.severity`),
      resolution: t(`${p}.audit.resolution`),
      empty: t(`${p}.audit.empty`),
    },
    actions: {
      checking: t(`${p}.actions.checking`),
      checkComplete: t(`${p}.actions.checkComplete`),
    },
  };
}
