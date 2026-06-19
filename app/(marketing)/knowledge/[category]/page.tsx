import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicKnowledgeCategoryPageContent from "@/components/marketing/PublicKnowledgeCategoryPageContent";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import {
  getPublicKnowledgeArticlesForCategory,
  getPublicKnowledgeCategory,
  getPublicKnowledgeHubLabels,
} from "@/lib/marketing/knowledge/load";
import { parseCtaBandLabels } from "@/lib/marketing/parse-marketing";
import { PUBLIC_KNOWLEDGE_CATEGORIES, type PublicKnowledgeCategoryId } from "@/lib/marketing/knowledge/types";

type PageProps = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return PUBLIC_KNOWLEDGE_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const { marketing } = await getMarketingContext();
  const cat = getPublicKnowledgeCategory(marketing, category as PublicKnowledgeCategoryId);
  if (!cat) return {};
  return { title: cat.name, description: cat.description };
}

export default async function KnowledgeCategoryPage({ params }: PageProps) {
  const { category: categoryId } = await params;
  const { marketing } = await getMarketingContext();
  const category = getPublicKnowledgeCategory(marketing, categoryId as PublicKnowledgeCategoryId);
  if (!category) notFound();

  const articles = getPublicKnowledgeArticlesForCategory(marketing, category.id);
  const labels = getPublicKnowledgeHubLabels(marketing);

  return (
    <PublicKnowledgeCategoryPageContent
      category={category}
      labels={labels}
      articles={articles.map((a) => ({ slug: a.slug, title: a.title, metaDescription: a.metaDescription }))}
      ctaBand={parseCtaBandLabels(marketing)}
    />
  );
}
