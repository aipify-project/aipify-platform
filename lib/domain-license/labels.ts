import type { Translator } from "@/lib/i18n/translate";

const DOMAIN_PLATFORM_IDS = [
  "wordpress",
  "shopify",
  "woocommerce",
  "custom_website",
  "enterprise_integration",
  "future_platform",
] as const;

const DOMAIN_STATUS_IDS = ["pending", "active", "suspended", "removed"] as const;

function domainPlatformTranslationKey(platform: string): string {
  const camelCase: Record<string, string> = {
    custom_website: "customWebsite",
    enterprise_integration: "enterpriseIntegration",
    future_platform: "futurePlatform",
  };
  return camelCase[platform] ?? platform;
}

export function resolveDomainPlatformLabel(
  labels: DomainLicenseLabels,
  platform?: string | null
): string {
  if (!platform) return "";
  return labels.platformLabels[platform] ?? platform.replace(/_/g, " ");
}

export function resolveDomainStatusLabel(
  labels: DomainLicenseLabels,
  status?: string | null
): string {
  if (!status) return "";
  return labels.domainStatusLabels[status] ?? status.replace(/_/g, " ");
}

export function buildDomainLicenseLabels(t: Translator) {
  const p = "customerApp.domainLicense";
  const platformLabels = Object.fromEntries(
    DOMAIN_PLATFORM_IDS.map((platform) => [
      platform,
      t(`${p}.platforms.${domainPlatformTranslationKey(platform)}`),
    ])
  ) as Record<string, string>;
  const domainStatusLabels = Object.fromEntries(
    DOMAIN_STATUS_IDS.map((status) => [status, t(`${p}.domainStatuses.${status}`)])
  ) as Record<string, string>;

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
    pendingDomainsNone: t(`${p}.pendingDomainsNone`),
    licensesUsage: t(`${p}.licensesUsage`),
    expandDomainDetails: t(`${p}.expandDomainDetails`),
    collapseDomainDetails: t(`${p}.collapseDomainDetails`),
    platformLabels,
    domainStatusLabels,
    websiteKompis: buildWebsiteKompisDomainSettingsLabels(t),
  };
}

export function buildWebsiteKompisDomainSettingsLabels(t: Translator) {
  const p = "customerApp.domainLicense.websiteKompis";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    subtitleReady: t(`${p}.subtitleReady`),
    subtitleInactive: t(`${p}.subtitleInactive`),
    licenseAvailable: t(`${p}.licenseAvailable`),
    licenseRequired: t(`${p}.licenseRequired`),
    licenseNotIncluded: t(`${p}.licenseNotIncluded`),
    licenseInactive: t(`${p}.licenseInactive`),
    unableToVerifyLicense: t(`${p}.unableToVerifyLicense`),
    domainMustBeVerified: t(`${p}.domainMustBeVerified`),
    installMissing: t(`${p}.installMissing`),
    domainLabel: t(`${p}.domainLabel`),
    installIdLabel: t(`${p}.installIdLabel`),
    installPending: t(`${p}.installPending`),
    metadataUrlLabel: t(`${p}.metadataUrlLabel`),
    metadataPending: t(`${p}.metadataPending`),
    sourcePriority: t(`${p}.sourcePriority`),
    publicSiteIndexComingLater: t(`${p}.publicSiteIndexComingLater`),
    enabledLabel: t(`${p}.enabledLabel`),
    iconVariantLabel: t(`${p}.iconVariantLabel`),
    fallbackToneLabel: t(`${p}.fallbackToneLabel`),
    welcomeVariantLabel: t(`${p}.welcomeVariantLabel`),
    sourcesLabel: t(`${p}.sourcesLabel`),
    sourceFaq: t(`${p}.sourceFaq`),
    sourceCurrentPage: t(`${p}.sourceCurrentPage`),
    sourceAipifyPublic: t(`${p}.sourceAipifyPublic`),
    save: t(`${p}.save`),
    reset: t(`${p}.reset`),
    saved: t(`${p}.saved`),
    saving: t(`${p}.saving`),
    saveError: t(`${p}.saveError`),
    loadError: t(`${p}.loadError`),
    installSectionTitle: t(`${p}.installSectionTitle`),
    installSectionBody: t(`${p}.installSectionBody`),
    copySnippet: t(`${p}.copySnippet`),
    snippetCopied: t(`${p}.snippetCopied`),
    snippetPending: t(`${p}.snippetPending`),
    statusSummaryAvailable: t(`${p}.statusSummaryAvailable`),
    statusSummaryLocked: t(`${p}.statusSummaryLocked`),
    iconVariants: {
      "companion-purple-default": t(`${p}.iconVariants.companionPurpleDefault`),
      "companion-purple-dark": t(`${p}.iconVariants.companionPurpleDark`),
      "companion-purple-light": t(`${p}.iconVariants.companionPurpleLight`),
    },
    fallbackTones: {
      "professional-friendly": t(`${p}.fallbackTones.professionalFriendly`),
      "short-direct": t(`${p}.fallbackTones.shortDirect`),
    },
    welcomeVariants: {
      standard: t(`${p}.welcomeVariants.standard`),
      compact: t(`${p}.welcomeVariants.compact`),
    },
  };
}

export type WebsiteKompisDomainSettingsLabels = ReturnType<
  typeof buildWebsiteKompisDomainSettingsLabels
>;

export type DomainLicenseLabels = ReturnType<typeof buildDomainLicenseLabels>;
