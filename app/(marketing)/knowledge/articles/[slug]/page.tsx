import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicKnowledgeArticlePageContent from "@/components/marketing/PublicKnowledgeArticlePageContent";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import {
  getPublicBusinessPackPage,
  getPublicKnowledgeArticle,
  getPublicKnowledgeCategory,
  getPublicKnowledgeHubLabels,
} from "@/lib/marketing/knowledge/load";
import { getAllArticleSlugs } from "@/lib/marketing/knowledge/registry";
import { getKnowledgePageRedesignLabels } from "@/lib/marketing/parse-knowledge-page";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { marketing } = await getMarketingContext();
  const article = getPublicKnowledgeArticle(marketing, slug);
  if (!article) return {};
  return { title: article.title, description: article.metaDescription };
}

export default async function KnowledgeArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const { marketing } = await getMarketingContext();
  const article = getPublicKnowledgeArticle(marketing, slug);
  if (!article) notFound();

  const labels = getPublicKnowledgeHubLabels(marketing);
  const redesign = getKnowledgePageRedesignLabels(marketing);
  const category = getPublicKnowledgeCategory(marketing, article.categoryId);

  const relatedArticleLinks = article.relatedArticles
    .map((relatedSlug) => {
      const related = getPublicKnowledgeArticle(marketing, relatedSlug);
      return related ? { slug: related.slug, title: related.title } : null;
    })
    .filter((a): a is { slug: string; title: string } => a !== null);

  const relatedBusinessPackLinks = article.relatedBusinessPacks.flatMap((packSlug) => {
    const pack = getPublicBusinessPackPage(marketing, packSlug);
    return pack ? [{ slug: pack.slug as string, name: pack.name }] : [];
  });

  return (
    <PublicKnowledgeArticlePageContent
      article={article}
      labels={labels}
      nested={redesign.nested}
      cta={redesign.cta}
      relatedArticleLinks={relatedArticleLinks}
      relatedBusinessPackLinks={relatedBusinessPackLinks}
      categoryName={category?.name ?? article.categoryId}
    />
  );
}
