import type { Translator } from "@/lib/i18n/translate";

export function buildCommercialIntelligenceLabels(t: Translator) {
  const p = "customerApp.commercialIntelligence";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.empty`),
    refresh: t(`${p}.refresh`),
    mrr: t(`${p}.mrr`),
    arr: t(`${p}.arr`),
    nrr: t(`${p}.nrr`),
    healthScore: t(`${p}.healthScore`),
    companionRecommendations: t(`${p}.companionRecommendations`),
    noRecords: t(`${p}.noRecords`),
    openPipeline: t(`${p}.openPipeline`),
    sections: {
      overview: t(`${p}.sections.overview`),
      revenue: t(`${p}.sections.revenue`),
      customers: t(`${p}.sections.customers`),
      subscriptions: t(`${p}.sections.subscriptions`),
      businessPacks: t(`${p}.sections.businessPacks`),
      forecasts: t(`${p}.sections.forecasts`),
      growth: t(`${p}.sections.growth`),
      retention: t(`${p}.sections.retention`),
      reports: t(`${p}.sections.reports`),
    },
    healthBand: {
      strong_growth: t(`${p}.healthBand.strongGrowth`),
      stable: t(`${p}.healthBand.stable`),
      watch_closely: t(`${p}.healthBand.watchClosely`),
      revenue_risk: t(`${p}.healthBand.revenueRisk`),
    },
    stats: {
      openChurnSignals: t(`${p}.stats.openChurnSignals`),
      openExpansion: t(`${p}.stats.openExpansion`),
      registrySources: t(`${p}.stats.registrySources`),
      growthRate: t(`${p}.stats.growthRate`),
    },
  };
}

export function buildPlatformCommercialIntelligenceLabels(t: Translator) {
  const p = "platform.commercialIntelligence";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.emptyState`),
    back: t(`${p}.back`),
    records: t(`${p}.records`),
    sections: {
      overview: t(`${p}.sections.overview`),
      revenue: t(`${p}.sections.revenue`),
      customers: t(`${p}.sections.customers`),
      subscriptions: t(`${p}.sections.subscriptions`),
      businessPacks: t(`${p}.sections.businessPacks`),
      forecasts: t(`${p}.sections.forecasts`),
      growth: t(`${p}.sections.growth`),
      retention: t(`${p}.sections.retention`),
      reports: t(`${p}.sections.reports`),
    },
  };
}
