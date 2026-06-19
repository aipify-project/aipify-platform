import type { Translator } from "@/lib/i18n/translate";

export function buildDomainLicenseLabels(t: Translator) {
  const p = "customerApp.domainLicense";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    overview: t(`${p}.overview`),
    activeDomains: t(`${p}.activeDomains`),
    pendingDomains: t(`${p}.pendingDomains`),
    domainLicenses: t(`${p}.domainLicenses`),
    installedPacks: t(`${p}.installedPacks`),
    usage: t(`${p}.usage`),
    domainSettings: t(`${p}.domainSettings`),
    purchased: t(`${p}.purchased`),
    used: t(`${p}.used`),
    available: t(`${p}.available`),
    addDomain: t(`${p}.addDomain`),
    purchaseLicense: t(`${p}.purchaseLicense`),
    platform: t(`${p}.platform`),
    status: t(`${p}.status`),
    packs: t(`${p}.packs`),
    primary: t(`${p}.primary`),
    accessDenied: t(`${p}.accessDenied`),
    storeLink: t(`${p}.storeLink`),
    back: t(`${p}.back`),
    domainPlaceholder: t(`${p}.domainPlaceholder`),
    selectPlatform: t(`${p}.selectPlatform`),
    save: t(`${p}.save`),
  };
}

export type DomainLicenseLabels = ReturnType<typeof buildDomainLicenseLabels>;
