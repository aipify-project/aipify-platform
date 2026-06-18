import type { Locale } from "./config";
import type { CustomerAppSplitName } from "./customer-app-split-config";
import type { Dictionary } from "./translate";

type LocaleJsonLoader = (locale: Locale) => Promise<Dictionary>;

/** Per-file import loaders — separate webpack contexts to avoid bundling all locale JSON at once. */
const ROOT_LOADERS: Record<string, LocaleJsonLoader> = {
  common: async (locale) => (await import(`@/locales/${locale}/common.json`)).default,
  landing: async (locale) => (await import(`@/locales/${locale}/landing.json`)).default,
  dashboard: async (locale) => (await import(`@/locales/${locale}/dashboard.json`)).default,
  assistant: async (locale) => (await import(`@/locales/${locale}/assistant.json`)).default,
  auth: async (locale) => (await import(`@/locales/${locale}/auth.json`)).default,
  support: async (locale) => (await import(`@/locales/${locale}/support.json`)).default,
  settings: async (locale) => (await import(`@/locales/${locale}/settings.json`)).default,
  install: async (locale) => (await import(`@/locales/${locale}/install.json`)).default,
  platform: async (locale) => (await import(`@/locales/${locale}/platform.json`)).default,
  branding: async (locale) => (await import(`@/locales/${locale}/branding.json`)).default,
  presence: async (locale) => (await import(`@/locales/${locale}/presence.json`)).default,
  license: async (locale) => (await import(`@/locales/${locale}/license.json`)).default,
  hosts: async (locale) => (await import(`@/locales/${locale}/hosts.json`)).default,
  marketing: async (locale) => (await import(`@/locales/${locale}/marketing.json`)).default,
  superAdmin: async (locale) => (await import(`@/locales/${locale}/superAdmin.json`)).default,
  growthPartnerPortal: async (locale) =>
    (await import(`@/locales/${locale}/growthPartnerPortal.json`)).default,
  growthPortal: async (locale) => (await import(`@/locales/${locale}/growthPortal.json`)).default,
  partnersPortal: async (locale) => (await import(`@/locales/${locale}/partnersPortal.json`)).default,
  partnerPortal: async (locale) => (await import(`@/locales/${locale}/partnerPortal.json`)).default,
  partnerAcademy: async (locale) => (await import(`@/locales/${locale}/partnerAcademy.json`)).default,
  partnerCommissions: async (locale) =>
    (await import(`@/locales/${locale}/partnerCommissions.json`)).default,
  partnerSettlements: async (locale) =>
    (await import(`@/locales/${locale}/partnerSettlements.json`)).default,
  partnerCompliance: async (locale) =>
    (await import(`@/locales/${locale}/partnerCompliance.json`)).default,
  partnerMaterials: async (locale) =>
    (await import(`@/locales/${locale}/partnerMaterials.json`)).default,
  partnerOpportunities: async (locale) =>
    (await import(`@/locales/${locale}/partnerOpportunities.json`)).default,
  partnerCommunications: async (locale) =>
    (await import(`@/locales/${locale}/partnerCommunications.json`)).default,
  partnerAdvisor: async (locale) => (await import(`@/locales/${locale}/partnerAdvisor.json`)).default,
  companionMemoryContext: async (locale) =>
    (await import(`@/locales/${locale}/companionMemoryContext.json`)).default,
  companionWorkspaceIntelligence: async (locale) =>
    (await import(`@/locales/${locale}/companionWorkspaceIntelligence.json`)).default,
  companionDeviceEnvironment: async (locale) =>
    (await import(`@/locales/${locale}/companionDeviceEnvironment.json`)).default,
  companionActionApproval: async (locale) =>
    (await import(`@/locales/${locale}/companionActionApproval.json`)).default,
  desktopCompanion: async (locale) =>
    (await import(`@/locales/${locale}/desktopCompanion.json`)).default,
  commandBar: async (locale) => (await import(`@/locales/${locale}/commandBar.json`)).default,
};

const CUSTOMER_APP_SPLIT_LOADERS: Record<CustomerAppSplitName, LocaleJsonLoader> = {
  navigation: async (locale) =>
    (await import(`@/locales/${locale}/customer-app/navigation.json`)).default,
  companion: async (locale) =>
    (await import(`@/locales/${locale}/customer-app/companion.json`)).default,
  workforce: async (locale) =>
    (await import(`@/locales/${locale}/customer-app/workforce.json`)).default,
  warehouse: async (locale) =>
    (await import(`@/locales/${locale}/customer-app/warehouse.json`)).default,
  growthPartners: async (locale) =>
    (await import(`@/locales/${locale}/customer-app/growthPartners.json`)).default,
  marketplace: async (locale) =>
    (await import(`@/locales/${locale}/customer-app/marketplace.json`)).default,
  industryPacks: async (locale) =>
    (await import(`@/locales/${locale}/customer-app/industryPacks.json`)).default,
  digitalEmployees: async (locale) =>
    (await import(`@/locales/${locale}/customer-app/digitalEmployees.json`)).default,
  commandCenter: async (locale) =>
    (await import(`@/locales/${locale}/customer-app/commandCenter.json`)).default,
  settings: async (locale) =>
    (await import(`@/locales/${locale}/customer-app/settings.json`)).default,
  dashboard: async (locale) =>
    (await import(`@/locales/${locale}/customer-app/dashboard.json`)).default,
  core: async (locale) => (await import(`@/locales/${locale}/customer-app/core.json`)).default,
};

export async function loadRootNamespace(locale: Locale, name: string): Promise<Dictionary> {
  const loader = ROOT_LOADERS[name];
  if (!loader) {
    throw new Error(`Unknown locale namespace: ${name}`);
  }
  return loader(locale);
}

export async function loadCustomerAppSplit(
  locale: Locale,
  split: CustomerAppSplitName
): Promise<Dictionary> {
  return CUSTOMER_APP_SPLIT_LOADERS[split](locale);
}
