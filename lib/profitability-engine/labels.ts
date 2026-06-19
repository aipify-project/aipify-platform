import type { Translator } from "@/lib/i18n/translate";

export function buildProfitabilityLabels(t: Translator) {
  const p = "customerApp.profitability";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    distinctionNote: t(`${p}.distinctionNote`),
    dataQualityWarning: t(`${p}.dataQualityWarning`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.empty`),
    refresh: t(`${p}.refresh`),
    noRecords: t(`${p}.noRecords`),
    companionRecommendations: t(`${p}.companionRecommendations`),
    companionProfitabilityAdvisor: t(`${p}.companionProfitabilityAdvisor`),
    integrations: t(`${p}.integrations`),
    serviceProfitabilityCards: t(`${p}.serviceProfitabilityCards`),
    verifiedRevenue: t(`${p}.verifiedRevenue`),
    estimatedLaborCost: t(`${p}.estimatedLaborCost`),
    estimatedConsumableCost: t(`${p}.estimatedConsumableCost`),
    dataQuality: t(`${p}.dataQuality`),
    marginPercent: t(`${p}.marginPercent`),
    sections: {
      overview: t(`${p}.sections.overview`),
      services: t(`${p}.sections.services`),
      pricing: t(`${p}.sections.pricing`),
      costs: t(`${p}.sections.costs`),
      margins: t(`${p}.sections.margins`),
      employees: t(`${p}.sections.employees`),
      locations: t(`${p}.sections.locations`),
      resources: t(`${p}.sections.resources`),
      products: t(`${p}.sections.products`),
      customers: t(`${p}.sections.customers`),
      forecasts: t(`${p}.sections.forecasts`),
      scenarios: t(`${p}.sections.scenarios`),
      recommendations: t(`${p}.sections.recommendations`),
      approvals: t(`${p}.sections.approvals`),
      policies: t(`${p}.sections.policies`),
      reports: t(`${p}.sections.reports`),
      allocations: t(`${p}.sections.allocations`),
      exceptions: t(`${p}.sections.exceptions`),
    },
    stats: {
      servicesTracked: t(`${p}.stats.servicesTracked`),
      marginResults: t(`${p}.stats.marginResults`),
      openExceptions: t(`${p}.stats.openExceptions`),
      pendingApprovals: t(`${p}.stats.pendingApprovals`),
      recalculationPending: t(`${p}.stats.recalculationPending`),
      priceRecommendations: t(`${p}.stats.priceRecommendations`),
    },
    allocationCenter: {
      title: t(`${p}.allocationCenter.title`),
      subtitle: t(`${p}.allocationCenter.subtitle`),
    },
    pricingCenter: {
      title: t(`${p}.pricingCenter.title`),
      subtitle: t(`${p}.pricingCenter.subtitle`),
    },
    scenarioLab: {
      title: t(`${p}.scenarioLab.title`),
      subtitle: t(`${p}.scenarioLab.subtitle`),
    },
    exceptionCenter: {
      title: t(`${p}.exceptionCenter.title`),
      subtitle: t(`${p}.exceptionCenter.subtitle`),
    },
    policyCenter: {
      title: t(`${p}.policyCenter.title`),
      subtitle: t(`${p}.policyCenter.subtitle`),
    },
    dataQualityLabels: {
      verified: t(`${p}.dataQualityLabels.verified`),
      estimated: t(`${p}.dataQualityLabels.estimated`),
      incomplete: t(`${p}.dataQualityLabels.incomplete`),
    },
  };
}
