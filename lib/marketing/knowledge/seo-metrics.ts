import { getAllArticleSlugs, PUBLIC_KNOWLEDGE_ARTICLE_REGISTRY } from "./registry";
import { PUBLIC_BUSINESS_PACK_SLUGS, PUBLIC_KNOWLEDGE_CATEGORIES, PUBLIC_KNOWLEDGE_INDUSTRIES } from "./types";

export type SeoPerformanceSnapshot = {
  publishedArticles: number;
  knowledgeCategories: number;
  industryHubs: number;
  businessPackPages: number;
  supportedLocales: number;
  futureLocales: string[];
  metrics: Array<{ key: string; label: string; value: string; note: string }>;
};

export function getSeoPerformanceSnapshot(labels: {
  metrics: Record<string, { label: string; note: string }>;
  futureLocales: string[];
  supportedLocales: number;
}): SeoPerformanceSnapshot {
  return {
    publishedArticles: getAllArticleSlugs().length,
    knowledgeCategories: PUBLIC_KNOWLEDGE_CATEGORIES.length,
    industryHubs: PUBLIC_KNOWLEDGE_INDUSTRIES.length,
    businessPackPages: PUBLIC_BUSINESS_PACK_SLUGS.length,
    supportedLocales: labels.supportedLocales,
    futureLocales: labels.futureLocales,
    metrics: [
      {
        key: "organicTraffic",
        label: labels.metrics.organicTraffic?.label ?? "Organic traffic",
        value: "—",
        note: labels.metrics.organicTraffic?.note ?? "",
      },
      {
        key: "pagePerformance",
        label: labels.metrics.pagePerformance?.label ?? "Page performance",
        value: "—",
        note: labels.metrics.pagePerformance?.note ?? "",
      },
      {
        key: "knowledgeViews",
        label: labels.metrics.knowledgeViews?.label ?? "Knowledge views",
        value: String(PUBLIC_KNOWLEDGE_ARTICLE_REGISTRY.length),
        note: labels.metrics.knowledgeViews?.note ?? "",
      },
      {
        key: "businessPackViews",
        label: labels.metrics.businessPackViews?.label ?? "Business Pack views",
        value: String(PUBLIC_BUSINESS_PACK_SLUGS.length),
        note: labels.metrics.businessPackViews?.note ?? "",
      },
      {
        key: "demoConversions",
        label: labels.metrics.demoConversions?.label ?? "Demo conversions",
        value: "—",
        note: labels.metrics.demoConversions?.note ?? "",
      },
      {
        key: "growthPartnerConversions",
        label: labels.metrics.growthPartnerConversions?.label ?? "Growth Partner conversions",
        value: "—",
        note: labels.metrics.growthPartnerConversions?.note ?? "",
      },
      {
        key: "searchRankings",
        label: labels.metrics.searchRankings?.label ?? "Search rankings",
        value: "—",
        note: labels.metrics.searchRankings?.note ?? "",
      },
    ],
  };
}
