import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BusinessPackLandingPageContent from "@/components/marketing/BusinessPackLandingPageContent";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import {
  getPublicBusinessPackPage,
  getPublicKnowledgeArticle,
  getPublicKnowledgeHubLabels,
} from "@/lib/marketing/knowledge/load";
import { PUBLIC_BUSINESS_PACK_RELATED_ARTICLES } from "@/lib/marketing/knowledge/registry";
import { parseCtaBandLabels } from "@/lib/marketing/parse-marketing";
import { PUBLIC_BUSINESS_PACK_SLUGS, type PublicBusinessPackSlug } from "@/lib/marketing/knowledge/types";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PUBLIC_BUSINESS_PACK_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { marketing } = await getMarketingContext();
  const pack = getPublicBusinessPackPage(marketing, slug as PublicBusinessPackSlug);
  if (!pack) return {};
  return { title: pack.name, description: pack.metaDescription };
}

export default async function BusinessPackLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const { marketing } = await getMarketingContext();
  const pack = getPublicBusinessPackPage(marketing, slug as PublicBusinessPackSlug);
  if (!pack) notFound();

  const labels = getPublicKnowledgeHubLabels(marketing);
  const relatedSlugs = [...new Set([...pack.relatedArticles, ...PUBLIC_BUSINESS_PACK_RELATED_ARTICLES[pack.slug]])];

  const relatedArticleLinks = relatedSlugs
    .map((relatedSlug) => {
      const related = getPublicKnowledgeArticle(marketing, relatedSlug);
      return related ? { slug: related.slug, title: related.title } : null;
    })
    .filter((a): a is { slug: string; title: string } => a !== null);

  return (
    <BusinessPackLandingPageContent
      pack={pack}
      labels={labels}
      relatedArticleLinks={relatedArticleLinks}
      ctaBand={parseCtaBandLabels(marketing)}
    />
  );
}
