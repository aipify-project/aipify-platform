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
  periodLabel: string;
  period7d: string;
  period30d: string;
  period90d: string;
  period365d: string;
  periodAll: string;
  exportCsv: string;
  definitionsTitle: string;
  currencyPolicyTitle: string;
  previousPeriodNoteTitle: string;
  ga4Title: string;
  ga4Configured: string;
  ga4NotConfigured: string;
  ga4DataApiNote: string;
  modulesTitle: string;
  modulesEmpty: string;
  productsTitle: string;
  productsEmpty: string;
  salesPartnersTitle: string;
  journeyTitle: string;
  cards: {
    customersTotal: string;
    customerRegistrationsPeriod: string;
    activeAppCustomers: string;
    trialCustomers: string;
    cancelledCustomers: string;
    activeBusinesses: string;
    installationsTotal: string;
    activeGrowthPartners: string;
    activeSubscriptions: string;
    revenueMrr: string;
    revenueArr: string;
    outstandingInvoices: string;
    moduleUsage: string;
    academyPartners: string;
    certifiedPartners: string;
  };
  links: {
    metrics: string;
    customerJourneys: string;
    sellers: string;
  };
};

export type PlatformAnalyticsJourneyLabels = {
  title: string;
  subtitle: string;
  loading: string;
  errorTitle: string;
  errorBody: string;
  retry: string;
  privacyNote: string;
  incompleteDataNote: string;
  lastChecked: string;
  unavailable: string;
  partial: string;
  available: string;
  back: string;
  steps: Record<string, string>;
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
    periodLabel: t(`${p}.periodLabel`),
    period7d: t(`${p}.period7d`),
    period30d: t(`${p}.period30d`),
    period90d: t(`${p}.period90d`),
    period365d: t(`${p}.period365d`),
    periodAll: t(`${p}.periodAll`),
    exportCsv: t(`${p}.exportCsv`),
    definitionsTitle: t(`${p}.definitionsTitle`),
    currencyPolicyTitle: t(`${p}.currencyPolicyTitle`),
    previousPeriodNoteTitle: t(`${p}.previousPeriodNoteTitle`),
    ga4Title: t(`${p}.ga4Title`),
    ga4Configured: t(`${p}.ga4Configured`),
    ga4NotConfigured: t(`${p}.ga4NotConfigured`),
    ga4DataApiNote: t(`${p}.ga4DataApiNote`),
    modulesTitle: t(`${p}.modulesTitle`),
    modulesEmpty: t(`${p}.modulesEmpty`),
    productsTitle: t(`${p}.productsTitle`),
    productsEmpty: t(`${p}.productsEmpty`),
    salesPartnersTitle: t(`${p}.salesPartnersTitle`),
    journeyTitle: t(`${p}.journeyTitle`),
    cards: {
      customersTotal: t(`${p}.cards.customersTotal`),
      customerRegistrationsPeriod: t(`${p}.cards.customerRegistrationsPeriod`),
      activeAppCustomers: t(`${p}.cards.activeAppCustomers`),
      trialCustomers: t(`${p}.cards.trialCustomers`),
      cancelledCustomers: t(`${p}.cards.cancelledCustomers`),
      activeBusinesses: t(`${p}.cards.activeBusinesses`),
      installationsTotal: t(`${p}.cards.installationsTotal`),
      activeGrowthPartners: t(`${p}.cards.activeGrowthPartners`),
      activeSubscriptions: t(`${p}.cards.activeSubscriptions`),
      revenueMrr: t(`${p}.cards.revenueMrr`),
      revenueArr: t(`${p}.cards.revenueArr`),
      outstandingInvoices: t(`${p}.cards.outstandingInvoices`),
      moduleUsage: t(`${p}.cards.moduleUsage`),
      academyPartners: t(`${p}.cards.academyPartners`),
      certifiedPartners: t(`${p}.cards.certifiedPartners`),
    },
    links: {
      metrics: t(`${p}.links.metrics`),
      customerJourneys: t(`${p}.links.customerJourneys`),
      sellers: t(`${p}.links.sellers`),
    },
  };
}

export function buildPlatformAnalyticsJourneyLabels(t: Translator): PlatformAnalyticsJourneyLabels {
  const p = "platform.analytics.journey";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorBody: t(`${p}.errorBody`),
    retry: t(`${p}.retry`),
    privacyNote: t(`${p}.privacyNote`),
    incompleteDataNote: t(`${p}.incompleteDataNote`),
    lastChecked: t(`${p}.lastChecked`),
    unavailable: t(`${p}.unavailable`),
    partial: t(`${p}.partial`),
    available: t(`${p}.available`),
    back: t(`${p}.back`),
    steps: {
      visit: t(`${p}.steps.visit`),
      registration: t(`${p}.steps.registration`),
      company: t(`${p}.steps.company`),
      product_selected: t(`${p}.steps.productSelected`),
      installation_activated: t(`${p}.steps.installationActivated`),
      paid_subscription: t(`${p}.steps.paidSubscription`),
      trial: t(`${p}.steps.trial`),
    },
  };
}
