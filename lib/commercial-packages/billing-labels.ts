import type { Translator } from "@/lib/i18n/translate";

const NS = "customerApp.commercialPackages.billing";

export type BillingReferenceLabels = {
  title: string;
  subtitle: string;
  back: string;
  retry: string;
  loadError: string;
  empty: string;
  emptyHistory: string;
  emptyLocked: string;
  emptyPackage: string;
  unavailable: string;
  unlimited: string;
  usedOfMax: string;
  modulesCount: string;
  privacyNote: string;
  nextBillingDate: string;
  statusColumn: string;
  viewLicense: string;
  viewModules: string;
  viewPackages: string;
  viewPaymentProviders: string;
  viewInvoiceDetails: string;
  sections: {
    package: string;
    usage: string;
    limits: string;
    history: string;
    locked: string;
    nextStep: string;
    support: string;
  };
  statusLabels: Record<string, string>;
  limits: {
    users: string;
    installations: string;
    domains: string;
    used: string;
    included: string;
  };
  usage: Record<string, string>;
  locked: {
    upgradeReason: string;
    addonReason: string;
    recommendationReason: string;
    viewPackagesCta: string;
  };
  nextStep: {
    viewPackages: string;
    reviewUsage: string;
    none: string;
  };
  support: {
    body: string;
    invoiceDetails: string;
  };
  eyebrow: string;
};

export function buildBillingReferenceLabels(t: Translator): BillingReferenceLabels {
  return {
    title: t(`${NS}.title`),
    subtitle: t(`${NS}.subtitle`),
    back: t(`${NS}.back`),
    retry: t(`${NS}.retry`),
    loadError: t(`${NS}.loadError`),
    empty: t(`${NS}.empty`),
    emptyHistory: t(`${NS}.emptyHistory`),
    emptyLocked: t(`${NS}.emptyLocked`),
    emptyPackage: t(`${NS}.emptyPackage`),
    unavailable: t(`${NS}.unavailable`),
    unlimited: t(`${NS}.unlimited`),
    usedOfMax: t(`${NS}.usedOfMax`),
    modulesCount: t(`${NS}.modulesCount`),
    privacyNote: t(`${NS}.privacyNote`),
    nextBillingDate: t(`${NS}.nextBillingDate`),
    statusColumn: t(`${NS}.statusColumn`),
    viewLicense: t(`${NS}.viewLicense`),
    viewModules: t(`${NS}.viewModules`),
    viewPackages: t(`${NS}.viewPackages`),
    viewPaymentProviders: t(`${NS}.viewPaymentProviders`),
    viewInvoiceDetails: t(`${NS}.viewInvoiceDetails`),
    sections: {
      package: t(`${NS}.sections.package`),
      usage: t(`${NS}.sections.usage`),
      limits: t(`${NS}.sections.limits`),
      history: t(`${NS}.sections.history`),
      locked: t(`${NS}.sections.locked`),
      nextStep: t(`${NS}.sections.nextStep`),
      support: t(`${NS}.sections.support`),
    },
    statusLabels: {
      active: t(`${NS}.statusLabels.active`),
      trial: t(`${NS}.statusLabels.trial`),
      past_due: t(`${NS}.statusLabels.past_due`),
      cancelled: t(`${NS}.statusLabels.cancelled`),
      lifetime: t(`${NS}.statusLabels.lifetime`),
      unknown: t(`${NS}.statusLabels.unknown`),
    },
    limits: {
      users: t(`${NS}.limits.users`),
      installations: t(`${NS}.limits.installations`),
      domains: t(`${NS}.limits.domains`),
      used: t(`${NS}.limits.used`),
      included: t(`${NS}.limits.included`),
    },
    usage: {
      support_cases_handled: t(`${NS}.usage.supportCases`),
      autonomous_resolutions: t(`${NS}.usage.autonomous`),
      knowledge_searches: t(`${NS}.usage.knowledgeSearches`),
      employee_interactions: t(`${NS}.usage.employeeInteractions`),
      insight_reports_generated: t(`${NS}.usage.insightReports`),
      api_calls: t(`${NS}.usage.apiCalls`),
      ai_usage_volume: t(`${NS}.usage.aiUsage`),
    },
    locked: {
      upgradeReason: t(`${NS}.locked.upgradeReason`),
      addonReason: t(`${NS}.locked.addonReason`),
      recommendationReason: t(`${NS}.locked.recommendationReason`),
      viewPackagesCta: t(`${NS}.locked.viewPackagesCta`),
    },
    nextStep: {
      viewPackages: t(`${NS}.nextStep.viewPackages`),
      reviewUsage: t(`${NS}.nextStep.reviewUsage`),
      none: t(`${NS}.nextStep.none`),
    },
    support: {
      body: t(`${NS}.support.body`),
      invoiceDetails: t(`${NS}.support.invoiceDetails`),
    },
    eyebrow: t(`${NS}.eyebrow`),
  };
}
