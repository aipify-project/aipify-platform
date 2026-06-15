import type { Translator } from "@/lib/i18n/translate";
import {
  ASSET_CATEGORIES,
  ASSET_STATUSES,
  CAMPAIGN_STATUSES,
  CAMPAIGN_TYPES,
  EMAIL_TEMPLATE_TYPES,
  MARKETING_LANGUAGES,
  PRESENTATION_TYPES,
  PROHIBITED_ACTIONS,
} from "./constants";
import type { GrowthPartnerMarketingLabels } from "./types";

export function buildGrowthPartnerMarketingLabels(
  t: Translator,
  namespace: string
): GrowthPartnerMarketingLabels {
  const mapKeys = <K extends string>(keys: readonly K[], suffix: string) =>
    Object.fromEntries(keys.map((k) => [k, t(`${namespace}.${suffix}.${k}`)])) as Record<K, string>;

  return {
    title: t(`${namespace}.title`),
    subtitle: t(`${namespace}.subtitle`),
    loading: t(`${namespace}.loading`),
    back: t(`${namespace}.back`),
    principle: t(`${namespace}.principle`),
    emptyState: t(`${namespace}.emptyState`),
    overview: {
      availableCampaigns: t(`${namespace}.overview.availableCampaigns`),
      marketingAssets: t(`${namespace}.overview.marketingAssets`),
      recentlyUpdated: t(`${namespace}.overview.recentlyUpdated`),
      campaignPerformance: t(`${namespace}.overview.campaignPerformance`),
      upcomingPromotions: t(`${namespace}.overview.upcomingPromotions`),
      localizedResources: t(`${namespace}.overview.localizedResources`),
    },
    sections: {
      overview: t(`${namespace}.sections.overview`),
      assetLibrary: t(`${namespace}.sections.assetLibrary`),
      campaigns: t(`${namespace}.sections.campaigns`),
      emailTemplates: t(`${namespace}.sections.emailTemplates`),
      presentations: t(`${namespace}.sections.presentations`),
      brandGuidelines: t(`${namespace}.sections.brandGuidelines`),
      prohibited: t(`${namespace}.sections.prohibited`),
      analytics: t(`${namespace}.sections.analytics`),
      audit: t(`${namespace}.sections.audit`),
      downloadCenter: t(`${namespace}.sections.downloadCenter`),
    },
    table: {
      name: t(`${namespace}.table.name`),
      category: t(`${namespace}.table.category`),
      language: t(`${namespace}.table.language`),
      version: t(`${namespace}.table.version`),
      status: t(`${namespace}.table.status`),
      downloads: t(`${namespace}.table.downloads`),
      objective: t(`${namespace}.table.objective`),
      audience: t(`${namespace}.table.audience`),
      dates: t(`${namespace}.table.dates`),
      assets: t(`${namespace}.table.assets`),
      subject: t(`${namespace}.table.subject`),
      slides: t(`${namespace}.table.slides`),
      actions: t(`${namespace}.table.actions`),
    },
    categories: mapKeys(ASSET_CATEGORIES, "categories"),
    assetStatuses: mapKeys(ASSET_STATUSES, "assetStatuses"),
    campaignTypes: mapKeys(CAMPAIGN_TYPES, "campaignTypes"),
    campaignStatuses: mapKeys(CAMPAIGN_STATUSES, "campaignStatuses"),
    emailTypes: mapKeys(EMAIL_TEMPLATE_TYPES, "emailTypes"),
    presentationTypes: mapKeys(PRESENTATION_TYPES, "presentationTypes"),
    languages: mapKeys(MARKETING_LANGUAGES, "languages"),
    prohibited: mapKeys(PROHIBITED_ACTIONS, "prohibited"),
    analytics: {
      mostDownloaded: t(`${namespace}.analytics.mostDownloaded`),
      mostUsedPresentations: t(`${namespace}.analytics.mostUsedPresentations`),
      topCampaigns: t(`${namespace}.analytics.topCampaigns`),
      engagementTrend: t(`${namespace}.analytics.engagementTrend`),
    },
    quickActions: {
      download: t(`${namespace}.quickActions.download`),
      publishCampaign: t(`${namespace}.quickActions.publishCampaign`),
      archiveCampaign: t(`${namespace}.quickActions.archiveCampaign`),
      archiveAsset: t(`${namespace}.quickActions.archiveAsset`),
      uploadAsset: t(`${namespace}.quickActions.uploadAsset`),
    },
    youDecide: t(`${namespace}.youDecide`),
  };
}
