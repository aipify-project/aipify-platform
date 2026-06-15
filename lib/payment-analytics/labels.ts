import type { Translator } from "@/lib/i18n/translate";
import type { PaymentAnalyticsLabels } from "./types";
import {
  ANALYTICS_PROVIDERS,
  CHART_RANGES,
  CUSTOMER_TYPES,
  EXPORT_FORMATS,
} from "./constants";

export function buildPaymentAnalyticsLabels(t: Translator): PaymentAnalyticsLabels {
  const p = "platform.paymentAnalytics";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    sections: {
      overview: t(`${p}.sections.overview`),
      providerBreakdown: t(`${p}.sections.providerBreakdown`),
      revenueOverTime: t(`${p}.sections.revenueOverTime`),
      providerDistribution: t(`${p}.sections.providerDistribution`),
      segments: t(`${p}.sections.segments`),
      topEnterprise: t(`${p}.sections.topEnterprise`),
      failedInsights: t(`${p}.sections.failedInsights`),
      filters: t(`${p}.sections.filters`),
      exports: t(`${p}.sections.exports`),
    },
    overview: {
      revenueToday: t(`${p}.overview.revenueToday`),
      revenueMonth: t(`${p}.overview.revenueMonth`),
      activeSubscriptions: t(`${p}.overview.activeSubscriptions`),
      failedPayments: t(`${p}.overview.failedPayments`),
      arpc: t(`${p}.overview.arpc`),
      churnedSubscriptions: t(`${p}.overview.churnedSubscriptions`),
    },
    provider: {
      revenue30d: t(`${p}.provider.revenue30d`),
      transactions: t(`${p}.provider.transactions`),
      successRate: t(`${p}.provider.successRate`),
      refunds: t(`${p}.provider.refunds`),
      failedPayments: t(`${p}.provider.failedPayments`),
    },
    charts: {
      range7d: t(`${p}.charts.range7d`),
      range30d: t(`${p}.charts.range30d`),
      range12m: t(`${p}.charts.range12m`),
    },
    segments: {
      selfService: t(`${p}.segments.selfService`),
      enterprise: t(`${p}.segments.enterprise`),
    },
    table: {
      customer: t(`${p}.table.customer`),
      revenue: t(`${p}.table.revenue`),
      openInvoices: t(`${p}.table.openInvoices`),
      lastPayment: t(`${p}.table.lastPayment`),
      status: t(`${p}.table.status`),
      provider: t(`${p}.table.provider`),
      failureReason: t(`${p}.table.failureReason`),
      retryCount: t(`${p}.table.retryCount`),
      recommendedAction: t(`${p}.table.recommendedAction`),
    },
    filters: {
      dateFrom: t(`${p}.filters.dateFrom`),
      dateTo: t(`${p}.filters.dateTo`),
      provider: t(`${p}.filters.provider`),
      customerType: t(`${p}.filters.customerType`),
      country: t(`${p}.filters.country`),
      allProviders: t(`${p}.filters.allProviders`),
      allTypes: t(`${p}.filters.allTypes`),
      allCountries: t(`${p}.filters.allCountries`),
      apply: t(`${p}.filters.apply`),
    },
    exports: {
      csv: t(`${p}.exports.csv`),
      excel: t(`${p}.exports.excel`),
      pdf: t(`${p}.exports.pdf`),
      exporting: t(`${p}.exports.exporting`),
    },
    providers: Object.fromEntries(
      ANALYTICS_PROVIDERS.map((provider) => [provider, t(`${p}.providers.${provider}`)])
    ) as PaymentAnalyticsLabels["providers"],
    customerTypes: Object.fromEntries(
      CUSTOMER_TYPES.map((type) => [type, t(`${p}.customerTypes.${type}`)])
    ) as PaymentAnalyticsLabels["customerTypes"],
    enterpriseStatuses: {
      current: t(`${p}.enterpriseStatuses.current`),
      attention: t(`${p}.enterpriseStatuses.attention`),
    },
    chartRanges: Object.fromEntries(
      CHART_RANGES.map((range) => [range, t(`${p}.chartRanges.${range}`)])
    ) as PaymentAnalyticsLabels["chartRanges"],
    exportFormats: Object.fromEntries(
      EXPORT_FORMATS.map((format) => [format, t(`${p}.exportFormats.${format}`)])
    ) as PaymentAnalyticsLabels["exportFormats"],
  };
}
