import type { Metadata } from "next";
import PublicKnowledgeHubPageContent from "@/components/marketing/PublicKnowledgeHubPageContent";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import {
  getAllPublicBusinessPackPages,
  getPublicKnowledgeArticleSummaries,
  getPublicKnowledgeCategories,
  getPublicKnowledgeHubLabels,
  getPublicKnowledgeIndustries,
  getSeoSearchIntentLabels,
} from "@/lib/marketing/knowledge/load";
import { parseCtaBandLabels, parseStringList } from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const labels = getPublicKnowledgeHubLabels(marketing);
  return { title: labels.title, description: labels.subtitle };
}

export default async function KnowledgePage() {
  const { marketing } = await getMarketingContext();
  const labels = getPublicKnowledgeHubLabels(marketing);
  const ctaBand = parseCtaBandLabels(marketing);

  return (
    <PublicKnowledgeHubPageContent
      labels={labels}
      categories={getPublicKnowledgeCategories(marketing)}
      industries={getPublicKnowledgeIndustries(marketing)}
      businessPacks={getAllPublicBusinessPackPages(marketing).map((p) => ({
        slug: p.slug,
        name: p.name,
        metaDescription: p.metaDescription,
      }))}
      articleSummaries={getPublicKnowledgeArticleSummaries(marketing)}
      searchIntents={getSeoSearchIntentLabels(marketing)}
      ctaBand={ctaBand}
      trustSignals={parseStringList(marketing, "trustSignalStrip", "signals")}
      differentiationThemes={parseStringList(marketing, "differentiationStrip", "themes")}
    />
  );
}
