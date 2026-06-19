import type { WebsiteIntelligenceLabels } from "./types";
import type { WebsiteIntelligenceSection } from "./constants";
import { WEBSITE_INTELLIGENCE_SECTIONS } from "./constants";

type Translator = (key: string) => string;

export function buildWebsiteIntelligenceLabels(t: Translator): WebsiteIntelligenceLabels {
  const p = "platform.websiteIntelligence";
  const sections = Object.fromEntries(
    WEBSITE_INTELLIGENCE_SECTIONS.map((id) => [id, t(`${p}.sections.${id}`)])
  ) as Record<WebsiteIntelligenceSection, string>;

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.empty`),
    privacyNote: t(`${p}.privacyNote`),
    optimizationRule: t(`${p}.optimizationRule`),
    growthLoopTitle: t(`${p}.growthLoopTitle`),
    periodLabel: t(`${p}.periodLabel`),
    sections,
    overview: {
      visitors: t(`${p}.overview.visitors`),
      pageViews: t(`${p}.overview.pageViews`),
      conversions: t(`${p}.overview.conversions`),
      demoRequests: t(`${p}.overview.demoRequests`),
      partnerApplications: t(`${p}.overview.partnerApplications`),
      organicGrowth: t(`${p}.overview.organicGrowth`),
      topPages: t(`${p}.overview.topPages`),
      advisorTitle: t(`${p}.overview.advisorTitle`),
    },
    traffic: {
      topPages: t(`${p}.traffic.topPages`),
      landingPages: t(`${p}.traffic.landingPages`),
      exitPages: t(`${p}.traffic.exitPages`),
      scrollDepth: t(`${p}.traffic.scrollDepth`),
    },
    conversions: {
      total: t(`${p}.conversions.total`),
      demos: t(`${p}.conversions.demos`),
      partners: t(`${p}.conversions.partners`),
    },
    funnels: {
      title: t(`${p}.funnels.title`),
      stage: t(`${p}.funnels.stage`),
      count: t(`${p}.funnels.count`),
      rate: t(`${p}.funnels.rate`),
    },
    ctas: {
      title: t(`${p}.ctas.title`),
      label: t(`${p}.ctas.label`),
      views: t(`${p}.ctas.views`),
      clicks: t(`${p}.ctas.clicks`),
      conversionRate: t(`${p}.ctas.conversionRate`),
      topPerformers: t(`${p}.ctas.topPerformers`),
    },
    content: {
      title: t(`${p}.content.title`),
      type: t(`${p}.content.type`),
      views: t(`${p}.content.views`),
      engagement: t(`${p}.content.engagement`),
      conversions: t(`${p}.content.conversions`),
      gaps: t(`${p}.content.gaps`),
    },
    partners: {
      applications: t(`${p}.partners.applications`),
      byCountry: t(`${p}.partners.byCountry`),
    },
    campaigns: {
      title: t(`${p}.campaigns.title`),
      source: t(`${p}.campaigns.source`),
      events: t(`${p}.campaigns.events`),
    },
    reports: {
      title: t(`${p}.reports.title`),
      available: t(`${p}.reports.available`),
    },
    advisor: {
      title: t(`${p}.advisor.title`),
      question: t(`${p}.advisor.question`),
      recommendation: t(`${p}.advisor.recommendation`),
      priority: t(`${p}.advisor.priority`),
    },
    heatmap: {
      title: t(`${p}.heatmap.title`),
      status: t(`${p}.heatmap.status`),
      privacyNote: t(`${p}.heatmap.privacyNote`),
    },
    demos: {
      title: t(`${p}.demos.title`),
      byIndustry: t(`${p}.demos.byIndustry`),
      byCountry: t(`${p}.demos.byCountry`),
      byPack: t(`${p}.demos.byPack`),
    },
    leadSources: {
      title: t(`${p}.leadSources.title`),
      source: t(`${p}.leadSources.source`),
      sessions: t(`${p}.leadSources.sessions`),
      conversions: t(`${p}.leadSources.conversions`),
    },
  };
}
