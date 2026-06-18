import type { Translator } from "@/lib/i18n/translate";

export function buildGrowthPartnerAttributionMarketingLabels(t: Translator) {
  const p = "customerApp.growthPartnerAttributionMarketing";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    refresh: t(`${p}.refresh`),
    accessDenied: t(`${p}.accessDenied`),
    templates: t(`${p}.templates`),
    campaignLinks: t(`${p}.campaignLinks`),
    copyTemplate: t(`${p}.copyTemplate`),
    copied: t(`${p}.copied`),
    partnerLinkCard: {
      title: t(`${p}.partnerLinkCard.title`),
      subtitle: t(`${p}.partnerLinkCard.subtitle`),
      copyLink: t(`${p}.partnerLinkCard.copyLink`),
      copied: t(`${p}.partnerLinkCard.copied`),
      downloadQr: t(`${p}.partnerLinkCard.downloadQr`),
      previewLanding: t(`${p}.partnerLinkCard.previewLanding`),
      shareEmail: t(`${p}.partnerLinkCard.shareEmail`),
      openMarketing: t(`${p}.partnerLinkCard.openMarketing`),
      partnerId: t(`${p}.partnerLinkCard.partnerId`),
    },
  };
}
