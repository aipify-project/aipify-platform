import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicKnowledgeCategoryPageContent from "@/components/marketing/PublicKnowledgeCategoryPageContent";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import {
  getPublicKnowledgeArticlesForCategory,
  getPublicKnowledgeCategoryDetail,
} from "@/lib/marketing/knowledge/load";
import { getKnowledgePageRedesignLabels } from "@/lib/marketing/parse-knowledge-page";
import { PUBLIC_KNOWLEDGE_CATEGORIES, type PublicKnowledgeCategoryId } from "@/lib/marketing/knowledge/types";

type PageProps = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return PUBLIC_KNOWLEDGE_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const { marketing } = await getMarketingContext();
  const detail = getPublicKnowledgeCategoryDetail(marketing, category as PublicKnowledgeCategoryId);
  if (!detail) return {};
  return {
    title: detail.seo.title,
    description: detail.seo.description,
  };
}

export default async function KnowledgeCategoryPage({ params }: PageProps) {
  const { category: categoryId } = await params;
  const { marketing } = await getMarketingContext();
  const category = getPublicKnowledgeCategoryDetail(marketing, categoryId as PublicKnowledgeCategoryId);
  if (!category) notFound();

  const articles = getPublicKnowledgeArticlesForCategory(marketing, category.id);
  const redesign = getKnowledgePageRedesignLabels(marketing);

  return (
    <PublicKnowledgeCategoryPageContent
      category={category}
      nested={redesign.nested}
      articles={articles.map((article) => ({
        slug: article.slug,
        title: article.title,
        metaDescription: article.metaDescription,
        categoryId: article.categoryId,
        hubId: article.hubId,
        industryId: article.industryId,
      }))}
    />
  );
}
