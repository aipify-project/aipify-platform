import type { Metadata } from "next";
import KnowledgePageContent from "@/components/marketing/knowledge/KnowledgePageContent";
import { getArticleMeta } from "@/lib/marketing/knowledge/registry";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import {
  getAllPublicBusinessPackPages,
  getPublicKnowledgeArticleSummaries,
  getPublicKnowledgeCategories,
  getPublicKnowledgeIndustries,
} from "@/lib/marketing/knowledge/load";
import { getKnowledgePageRedesignLabels } from "@/lib/marketing/parse-knowledge-page";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const labels = getKnowledgePageRedesignLabels(marketing);
  return { title: labels.hero.title, description: labels.hero.subtitle };
}

export default async function KnowledgePage() {
  const { marketing } = await getMarketingContext();
  const labels = getKnowledgePageRedesignLabels(marketing);
  const articleSummaries = getPublicKnowledgeArticleSummaries(marketing).map((summary) => {
    const meta = getArticleMeta(summary.slug);
    return {
      ...summary,
      hubId: meta?.hubId,
      industryId: meta?.industryId,
    };
  });

  return (
    <KnowledgePageContent
      labels={labels}
      categories={getPublicKnowledgeCategories(marketing)}
      industries={getPublicKnowledgeIndustries(marketing)}
      businessPacks={getAllPublicBusinessPackPages(marketing).map((pack) => ({
        slug: pack.slug,
        name: pack.name,
        metaDescription: pack.metaDescription,
      }))}
      articleSummaries={articleSummaries}
    />
  );
}
