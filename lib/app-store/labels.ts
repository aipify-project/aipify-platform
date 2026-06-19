import type { Translator } from "@/lib/i18n/translate";

export function buildAppStoreLabels(t: Translator) {
  const p = "customerApp.appStore";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    governanceNote: t(`${p}.governanceNote`),
    myLicenses: t(`${p}.myLicenses`),
    installed: t(`${p}.installed`),
    marketplace: t(`${p}.marketplace`),
    recommended: t(`${p}.recommended`),
    popular: t(`${p}.popular`),
    recentlyAdded: t(`${p}.recentlyAdded`),
    viewDetails: t(`${p}.viewDetails`),
    install: t(`${p}.install`),
    upgrade: t(`${p}.upgrade`),
    remove: t(`${p}.remove`),
    contactSales: t(`${p}.contactSales`),
    openWorkspace: t(`${p}.openWorkspace`),
    manageAccess: t(`${p}.manageAccess`),
    version: t(`${p}.version`),
    startingPrice: t(`${p}.startingPrice`),
    includedModules: t(`${p}.includedModules`),
    licenseRequirements: t(`${p}.licenseRequirements`),
    category: t(`${p}.category`),
    status: t(`${p}.status`),
    emptyTitle: t(`${p}.emptyTitle`),
    emptyDescription: t(`${p}.emptyDescription`),
    browseMarketplace: t(`${p}.browseMarketplace`),
    licensesLink: t(`${p}.licensesLink`),
    back: t(`${p}.back`),
    overview: t(`${p}.overview`),
    benefits: t(`${p}.benefits`),
    whoIsItFor: t(`${p}.whoIsItFor`),
    permissionsAdded: t(`${p}.permissionsAdded`),
    pricing: t(`${p}.pricing`),
    faq: t(`${p}.faq`),
    versionHistory: t(`${p}.versionHistory`),
    selectSeats: t(`${p}.selectSeats`),
    selectDomain: t(`${p}.selectDomain`),
    selectDomainRequired: t(`${p}.selectDomainRequired`),
    installOn: t(`${p}.installOn`),
    reviewCost: t(`${p}.reviewCost`),
    confirmPayment: t(`${p}.confirmPayment`),
    activate: t(`${p}.activate`),
    installComplete: t(`${p}.installComplete`),
    installCompleteHint: t(`${p}.installCompleteHint`),
    removeWarning: t(`${p}.removeWarning`),
    confirmRemove: t(`${p}.confirmRemove`),
    cancel: t(`${p}.cancel`),
    monthlyCost: t(`${p}.monthlyCost`),
    enterpriseContact: t(`${p}.enterpriseContact`),
    notFound: t(`${p}.notFound`),
  };
}

export type AppStoreLabels = ReturnType<typeof buildAppStoreLabels>;

export function buildLicenseDashboardLabels(t: Translator) {
  const p = "customerApp.licenseDashboard";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    currentPlan: t(`${p}.currentPlan`),
    businessPacks: t(`${p}.businessPacks`),
    userLicenses: t(`${p}.userLicenses`),
    consumption: t(`${p}.consumption`),
    renewalDate: t(`${p}.renewalDate`),
    status: t(`${p}.status`),
    upgrade: t(`${p}.upgrade`),
    renew: t(`${p}.renew`),
    purchaseSeats: t(`${p}.purchaseSeats`),
    activeLicenses: t(`${p}.activeLicenses`),
    totalSeats: t(`${p}.totalSeats`),
    employees: t(`${p}.employees`),
    browseStore: t(`${p}.browseStore`),
    manageAccess: t(`${p}.manageAccess`),
    emptyTitle: t(`${p}.emptyTitle`),
    emptyDescription: t(`${p}.emptyDescription`),
    back: t(`${p}.back`),
  };
}

export type LicenseDashboardLabels = ReturnType<typeof buildLicenseDashboardLabels>;

export function buildPlatformAppStoreRevenueLabels(t: Translator) {
  const p = "platform.appStoreRevenue";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    privacyNote: t(`${p}.privacyNote`),
    principle: t(`${p}.principle`),
    refresh: t(`${p}.refresh`),
    publishedPacks: t(`${p}.publishedPacks`),
    totalInstalls: t(`${p}.totalInstalls`),
    activeLicenses: t(`${p}.activeLicenses`),
    cancelledLicenses: t(`${p}.cancelledLicenses`),
    renewalsDue: t(`${p}.renewalsDue`),
    mostInstalled: t(`${p}.mostInstalled`),
    revenuePerPack: t(`${p}.revenuePerPack`),
    growth: t(`${p}.growth`),
    installs30d: t(`${p}.installs30d`),
    removals30d: t(`${p}.removals30d`),
    back: t(`${p}.back`),
  };
}
