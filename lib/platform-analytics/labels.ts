import type { Translator } from "@/lib/i18n/translate";

export type PlatformAnalyticsOverviewLabels = {
  title: string;
  subtitle: string;
  loading: string;
  errorTitle: string;
  errorBody: string;
  retry: string;
  privacyNote: string;
  lastChecked: string;
  unavailable: string;
  ga4Title: string;
  ga4Configured: string;
  ga4NotConfigured: string;
  ga4DataApiNote: string;
  modulesTitle: string;
  modulesEmpty: string;
  cards: {
    customerRegistrations30d: string;
    activeAppCustomers: string;
    activeBusinesses: string;
    activeGrowthPartners: string;
    activeSubscriptions: string;
    revenueMrr: string;
    moduleUsage: string;
    academyPartners: string;
  };
  links: {
    metrics: string;
    customerJourneys: string;
    sellers: string;
  };
};

export function buildPlatformAnalyticsOverviewLabels(t: Translator): PlatformAnalyticsOverviewLabels {
  const p = "platform.analytics.overview";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorBody: t(`${p}.errorBody`),
    retry: t(`${p}.retry`),
    privacyNote: t(`${p}.privacyNote`),
    lastChecked: t(`${p}.lastChecked`),
    unavailable: t(`${p}.unavailable`),
    ga4Title: t(`${p}.ga4Title`),
    ga4Configured: t(`${p}.ga4Configured`),
    ga4NotConfigured: t(`${p}.ga4NotConfigured`),
    ga4DataApiNote: t(`${p}.ga4DataApiNote`),
    modulesTitle: t(`${p}.modulesTitle`),
    modulesEmpty: t(`${p}.modulesEmpty`),
    cards: {
      customerRegistrations30d: t(`${p}.cards.customerRegistrations30d`),
      activeAppCustomers: t(`${p}.cards.activeAppCustomers`),
      activeBusinesses: t(`${p}.cards.activeBusinesses`),
      activeGrowthPartners: t(`${p}.cards.activeGrowthPartners`),
      activeSubscriptions: t(`${p}.cards.activeSubscriptions`),
      revenueMrr: t(`${p}.cards.revenueMrr`),
      moduleUsage: t(`${p}.cards.moduleUsage`),
      academyPartners: t(`${p}.cards.academyPartners`),
    },
    links: {
      metrics: t(`${p}.links.metrics`),
      customerJourneys: t(`${p}.links.customerJourneys`),
      sellers: t(`${p}.links.sellers`),
    },
  };
}
