import type { Translator } from "@/lib/i18n/translate";
import type { PaymentAnalyticsLabels } from "./types";
import {
  ANALYTICS_PROVIDERS,
  CHART_METRICS,
  CHART_RANGES,
  CUSTOMER_TYPES,
  EXPORT_FORMATS,
  FILTER_PRESETS,
} from "./constants";

const SEGMENT_KEYS = [
  "self_service",
  "smb",
  "growth_customers",
  "enterprise",
  "pilot_customers",
  "internal_testing",
] as const;

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
      executiveSnapshot: t(`${p}.sections.executiveSnapshot`),
      overview: t(`${p}.sections.overview`),
      providerBreakdown: t(`${p}.sections.providerBreakdown`),
      revenueOverTime: t(`${p}.sections.revenueOverTime`),
      providerDistribution: t(`${p}.sections.providerDistribution`),
      segments: t(`${p}.sections.segments`),
      topEnterprise: t(`${p}.sections.topEnterprise`),
      failedInsights: t(`${p}.sections.failedInsights`),
      filters: t(`${p}.sections.filters`),
      exports: t(`${p}.sections.exports`),
      executiveInsights: t(`${p}.sections.executiveInsights`),
      forecasting: t(`${p}.sections.forecasting`),
    },
    executive: {
      totalRevenue: t(`${p}.executive.totalRevenue`),
      recurringRevenue: t(`${p}.executive.recurringRevenue`),
      revenueGrowth: t(`${p}.executive.revenueGrowth`),
      averageTransactionValue: t(`${p}.executive.averageTransactionValue`),
      netRevenue: t(`${p}.executive.netRevenue`),
      paymentSuccessRate: t(`${p}.executive.paymentSuccessRate`),
      customerLifetimeValue: t(`${p}.executive.customerLifetimeValue`),
      clvFuture: t(`${p}.executive.clvFuture`),
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
      averageTransactionValue: t(`${p}.provider.averageTransactionValue`),
      revenueGrowth: t(`${p}.provider.revenueGrowth`),
      chargebackRate: t(`${p}.provider.chargebackRate`),
      lastHealthCheck: t(`${p}.provider.lastHealthCheck`),
      rankingTopPerformer: t(`${p}.provider.rankingTopPerformer`),
      rankingStable: t(`${p}.provider.rankingStable`),
      rankingNeedsReview: t(`${p}.provider.rankingNeedsReview`),
    },
    charts: {
      range7d: t(`${p}.charts.range7d`),
      range30d: t(`${p}.charts.range30d`),
      range12m: t(`${p}.charts.range12m`),
      metricRevenue: t(`${p}.charts.metricRevenue`),
      metricTransactions: t(`${p}.charts.metricTransactions`),
      metricRefunds: t(`${p}.charts.metricRefunds`),
      metricNetRevenue: t(`${p}.charts.metricNetRevenue`),
      metricSubscriptions: t(`${p}.charts.metricSubscriptions`),
      metricFailedPayments: t(`${p}.charts.metricFailedPayments`),
    },
    segments: Object.fromEntries(
      SEGMENT_KEYS.map((key) => [key, t(`${p}.segments.${key}`)])
    ),
    segmentMetrics: {
      revenue: t(`${p}.segmentMetrics.revenue`),
      growth: t(`${p}.segmentMetrics.growth`),
      customers: t(`${p}.segmentMetrics.customers`),
      averageSpend: t(`${p}.segmentMetrics.averageSpend`),
    },
    distribution: {
      concentrationWarning: t(`${p}.distribution.concentrationWarning`),
      enterpriseConcentrationWarning: t(`${p}.distribution.enterpriseConcentrationWarning`),
      diversifyRecommendation: t(`${p}.distribution.diversifyRecommendation`),
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
      arrEstimate: t(`${p}.table.arrEstimate`),
      contractValue: t(`${p}.table.contractValue`),
      renewalDate: t(`${p}.table.renewalDate`),
      healthScore: t(`${p}.table.healthScore`),
      customerOwner: t(`${p}.table.customerOwner`),
      expansionOpportunity: t(`${p}.table.expansionOpportunity`),
      severity: t(`${p}.table.severity`),
      amountAffected: t(`${p}.table.amountAffected`),
      assignedOwner: t(`${p}.table.assignedOwner`),
    },
    filters: {
      dateFrom: t(`${p}.filters.dateFrom`),
      dateTo: t(`${p}.filters.dateTo`),
      provider: t(`${p}.filters.provider`),
      customerType: t(`${p}.filters.customerType`),
      country: t(`${p}.filters.country`),
      currency: t(`${p}.filters.currency`),
      subscriptionPlan: t(`${p}.filters.subscriptionPlan`),
      growthPartner: t(`${p}.filters.growthPartner`),
      customerSegment: t(`${p}.filters.customerSegment`),
      allProviders: t(`${p}.filters.allProviders`),
      allTypes: t(`${p}.filters.allTypes`),
      allCountries: t(`${p}.filters.allCountries`),
      allCurrencies: t(`${p}.filters.allCurrencies`),
      allPlans: t(`${p}.filters.allPlans`),
      allPartners: t(`${p}.filters.allPartners`),
      allSegments: t(`${p}.filters.allSegments`),
      apply: t(`${p}.filters.apply`),
      presets: Object.fromEntries(
        FILTER_PRESETS.map((preset) => [preset, t(`${p}.filters.presets.${preset}`)])
      ),
    },
    exports: {
      csv: t(`${p}.exports.csv`),
      excel: t(`${p}.exports.excel`),
      pdf: t(`${p}.exports.pdf`),
      boardReport: t(`${p}.exports.boardReport`),
      executiveSummary: t(`${p}.exports.executiveSummary`),
      financeFiken: t(`${p}.exports.financeFiken`),
      auditorPackage: t(`${p}.exports.auditorPackage`),
      quarterlyRevenue: t(`${p}.exports.quarterlyRevenue`),
      exporting: t(`${p}.exports.exporting`),
    },
    insights: {
      title: t(`${p}.insights.title`),
      recommendedAction: t(`${p}.insights.recommendedAction`),
      empty: t(`${p}.insights.empty`),
    },
    forecasting: {
      title: t(`${p}.forecasting.title`),
      projectedRevenue: t(`${p}.forecasting.projectedRevenue`),
      projectedArr: t(`${p}.forecasting.projectedArr`),
      subscriptionGrowth: t(`${p}.forecasting.subscriptionGrowth`),
      predictedChurn: t(`${p}.forecasting.predictedChurn`),
      confidence: t(`${p}.forecasting.confidence`),
      futureNote: t(`${p}.forecasting.futureNote`),
    },
    expansion: {
      high: t(`${p}.expansion.high`),
      medium: t(`${p}.expansion.medium`),
      low: t(`${p}.expansion.low`),
    },
    severities: {
      low: t(`${p}.severities.low`),
      medium: t(`${p}.severities.medium`),
      critical: t(`${p}.severities.critical`),
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
    chartMetrics: Object.fromEntries(
      CHART_METRICS.map((metric) => [metric, t(`${p}.chartMetrics.${metric}`)])
    ) as PaymentAnalyticsLabels["chartMetrics"],
  };
}
