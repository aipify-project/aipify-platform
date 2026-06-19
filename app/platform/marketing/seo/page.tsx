import { PlatformSeoDashboardPanel } from "@/components/platform/marketing/PlatformSeoDashboardPanel";
import { getSeoPerformanceSnapshot } from "@/lib/marketing/knowledge/seo-metrics";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformMarketingSeoPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const p = "platform.seoDashboard";

  const labels = {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    authorityRule: t(`${p}.authorityRule`),
    inventoryTitle: t(`${p}.inventoryTitle`),
    metricsTitle: t(`${p}.metricsTitle`),
    localesTitle: t(`${p}.localesTitle`),
    supportedLocales: t(`${p}.supportedLocales`),
    futureLocales: t(`${p}.futureLocales`),
    articles: t(`${p}.articles`),
    categories: t(`${p}.categories`),
    industries: t(`${p}.industries`),
    businessPacks: t(`${p}.businessPacks`),
  };

  const snapshot = getSeoPerformanceSnapshot({
    supportedLocales: 4,
    futureLocales: [t(`${p}.localeDe`), t(`${p}.localeEs`), t(`${p}.localeFr`), t(`${p}.localePl`)],
    metrics: {
      organicTraffic: { label: t(`${p}.metrics.organicTraffic.label`), note: t(`${p}.metrics.organicTraffic.note`) },
      pagePerformance: { label: t(`${p}.metrics.pagePerformance.label`), note: t(`${p}.metrics.pagePerformance.note`) },
      knowledgeViews: { label: t(`${p}.metrics.knowledgeViews.label`), note: t(`${p}.metrics.knowledgeViews.note`) },
      businessPackViews: { label: t(`${p}.metrics.businessPackViews.label`), note: t(`${p}.metrics.businessPackViews.note`) },
      demoConversions: { label: t(`${p}.metrics.demoConversions.label`), note: t(`${p}.metrics.demoConversions.note`) },
      growthPartnerConversions: {
        label: t(`${p}.metrics.growthPartnerConversions.label`),
        note: t(`${p}.metrics.growthPartnerConversions.note`),
      },
      searchRankings: { label: t(`${p}.metrics.searchRankings.label`), note: t(`${p}.metrics.searchRankings.note`) },
    },
  });

  return <PlatformSeoDashboardPanel labels={labels} snapshot={snapshot} />;
}
