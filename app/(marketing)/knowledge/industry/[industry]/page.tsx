import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicKnowledgeIndustryPageContent from "@/components/marketing/PublicKnowledgeIndustryPageContent";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import {
  getPublicKnowledgeArticlesForIndustry,
  getPublicKnowledgeIndustry,
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
  const hub = getPublicKnowledgeIndustry(marketing, industry as PublicKnowledgeIndustryId);
  if (!hub) return {};
  return { title: hub.name, description: hub.description };
}

export default async function KnowledgeIndustryPage({ params }: PageProps) {
  const { industry: industryId } = await params;
  const { marketing } = await getMarketingContext();
  const industry = getPublicKnowledgeIndustry(marketing, industryId as PublicKnowledgeIndustryId);
  if (!industry) notFound();

  const articles = getPublicKnowledgeArticlesForIndustry(marketing, industry.id);
  const redesign = getKnowledgePageRedesignLabels(marketing);

  return (
    <PublicKnowledgeIndustryPageContent
      industry={industry}
      nested={redesign.nested}
      cta={redesign.cta}
      articles={articles.map((a) => ({ slug: a.slug, title: a.title, metaDescription: a.metaDescription }))}
    />
  );
}
