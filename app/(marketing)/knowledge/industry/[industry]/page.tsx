import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicKnowledgeIndustryPageContent from "@/components/marketing/PublicKnowledgeIndustryPageContent";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import {
  getPublicBusinessPackPage,
  getPublicKnowledgeArticle,
  getPublicKnowledgeHubLabels,
  getPublicKnowledgeIndustry,
  getPublicKnowledgeIndustryDetail,
} from "@/lib/marketing/knowledge/load";
import { getKnowledgePageRedesignLabels } from "@/lib/marketing/parse-knowledge-page";
import { PUBLIC_KNOWLEDGE_INDUSTRIES, type PublicKnowledgeIndustryId } from "@/lib/marketing/knowledge/types";

type PageProps = { params: Promise<{ industry: string }> };

export function generateStaticParams() {
  return PUBLIC_KNOWLEDGE_INDUSTRIES.map((industry) => ({ industry }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { industry } = await params;
  const { marketing } = await getMarketingContext();
  const detail = getPublicKnowledgeIndustryDetail(marketing, industry as PublicKnowledgeIndustryId);
  const hub = getPublicKnowledgeIndustry(marketing, industry as PublicKnowledgeIndustryId);
  if (!detail || !hub) return {};
  return {
    title: `${detail.headline} | ${hub.name}`,
    description: detail.metaDescription || hub.description,
  };
}

export default async function KnowledgeIndustryPage({ params }: PageProps) {
  const { industry: industryId } = await params;
  const { marketing } = await getMarketingContext();
  const industry = getPublicKnowledgeIndustry(marketing, industryId as PublicKnowledgeIndustryId);
  const detail = getPublicKnowledgeIndustryDetail(marketing, industryId as PublicKnowledgeIndustryId);
  if (!industry || !detail) notFound();

  const labels = getPublicKnowledgeHubLabels(marketing);
  const redesign = getKnowledgePageRedesignLabels(marketing);

  const relatedArticles = detail.relatedArticleSlugs
    .map((slug) => {
      const article = getPublicKnowledgeArticle(marketing, slug);
      return article
        ? { slug: article.slug, title: article.title, metaDescription: article.metaDescription }
        : null;
    })
    .filter((a): a is { slug: string; title: string; metaDescription: string } => a !== null);

  const recommendedPacks = detail.recommendedPackSlugs.flatMap((packSlug) => {
    const pack = getPublicBusinessPackPage(marketing, packSlug);
    return pack ? [{ slug: pack.slug, name: pack.name }] : [];
  });

  return (
    <PublicKnowledgeIndustryPageContent
      industry={industry}
      detail={detail}
      labels={labels}
      nested={redesign.nested}
      cta={redesign.cta}
      relatedArticles={relatedArticles}
      recommendedPacks={recommendedPacks}
    />
  );
}
