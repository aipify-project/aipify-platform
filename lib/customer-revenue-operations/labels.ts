import type { Translator } from "@/lib/i18n/translate";
import type { CustomerRevenueOperationsLabels, CustomerRevenueOperationsTab } from "./types";
import { REVENUE_HEALTH_STATUSES, RISK_SEVERITIES } from "./constants";

const TAB_KEYS: CustomerRevenueOperationsTab[] = [
  "overview",
  "pipeline",
  "revenue",
  "forecasts",
  "renewals",
  "expansion",
  "partners",
  "business_packs",
  "companion",
  "executive",
  "reports",
];

export function buildCustomerRevenueOperationsLabels(t: Translator): CustomerRevenueOperationsLabels {
  const p = "revenueOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    accessDenied: t(`${p}.accessDenied`),
    tabs: Object.fromEntries(
      TAB_KEYS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as CustomerRevenueOperationsLabels["tabs"],
    overview: {
      monthlyRevenue: t(`${p}.overview.monthlyRevenue`),
      annualRevenue: t(`${p}.overview.annualRevenue`),
      recurringRevenue: t(`${p}.overview.recurringRevenue`),
      renewalRevenue: t(`${p}.overview.renewalRevenue`),
      expansionRevenue: t(`${p}.overview.expansionRevenue`),
      partnerRevenue: t(`${p}.overview.partnerRevenue`),
      forecastRevenue: t(`${p}.overview.forecastRevenue`),
      revenueHealthScore: t(`${p}.overview.revenueHealthScore`),
      pipelineOpen: t(`${p}.overview.pipelineOpen`),
      renewalsDue90d: t(`${p}.overview.renewalsDue90d`),
      expansionOpportunities: t(`${p}.overview.expansionOpportunities`),
      activeRisks: t(`${p}.overview.activeRisks`),
    },
    actions: {
      generateForecast: t(`${p}.actions.generateForecast`),
      createOpportunity: t(`${p}.actions.createOpportunity`),
      planRenewal: t(`${p}.actions.planRenewal`),
      identifyExpansion: t(`${p}.actions.identifyExpansion`),
      detectRisk: t(`${p}.actions.detectRisk`),
      openPipeline: t(`${p}.actions.openPipeline`),
      openRevenueGrowth: t(`${p}.actions.openRevenueGrowth`),
    },
    healthStatuses: Object.fromEntries(
      REVENUE_HEALTH_STATUSES.map((key) => [key, t(`${p}.healthStatuses.${key}`)])
    ) as CustomerRevenueOperationsLabels["healthStatuses"],
    riskSeverities: Object.fromEntries(
      RISK_SEVERITIES.map((key) => [key, t(`${p}.riskSeverities.${key}`)])
    ) as CustomerRevenueOperationsLabels["riskSeverities"],
    pipelinePage: {
      title: t(`${p}.pipelinePage.title`),
      subtitle: t(`${p}.pipelinePage.subtitle`),
    },
  };
}
