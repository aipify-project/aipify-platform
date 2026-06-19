import type { MarketingDictionary } from "@/lib/marketing/get-marketing-context";
import {
  getAllArticleSlugs,
  getArticleMeta,
  getArticlesByCategory,
  getArticlesByHub,
  getArticlesByIndustry,
  PUBLIC_KNOWLEDGE_INDUSTRY_ARTICLE_MAP,
} from "./registry";
import type {
  PublicBusinessPackPage,
  PublicBusinessPackSlug,
  PublicKnowledgeArticle,
  PublicKnowledgeArticleContent,
  PublicKnowledgeCategory,
  PublicKnowledgeCategoryId,
  PublicKnowledgeHubLabels,
  PublicKnowledgeIndustry,
  PublicKnowledgeIndustryId,
} from "./types";
import {
  PUBLIC_BUSINESS_PACK_SLUGS,
  PUBLIC_KNOWLEDGE_CATEGORIES,
  PUBLIC_KNOWLEDGE_INDUSTRIES,
} from "./types";

function publicKnowledgeSection(marketing: MarketingDictionary): Record<string, unknown> {
  return (marketing.publicKnowledge ?? {}) as Record<string, unknown>;
}

function articleContent(
  marketing: MarketingDictionary,
  slug: string
): PublicKnowledgeArticleContent | null {
  const articles = (publicKnowledgeSection(marketing).articles ?? {}) as Record<
    string,
    PublicKnowledgeArticleContent
  >;
  const raw = articles[slug];
  if (!raw?.title) return null;
  return {
    title: raw.title,
    metaDescription: raw.metaDescription ?? "",
    introduction: raw.introduction ?? "",
    sections: raw.sections ?? [],
    examples: raw.examples ?? [],
  };
}

export function getPublicKnowledgeHubLabels(marketing: MarketingDictionary): PublicKnowledgeHubLabels {
  const hub = (publicKnowledgeSection(marketing).hub ?? {}) as Partial<PublicKnowledgeHubLabels>;
  return {
    title: hub.title ?? "Knowledge Center",
    subtitle: hub.subtitle ?? "",
    authorityNote: hub.authorityNote ?? "",
    browseCategories: hub.browseCategories ?? "Browse by category",
    browseHubs: hub.browseHubs ?? "Content hubs",
    browseIndustries: hub.browseIndustries ?? "Industry guides",
    browseBusinessPacks: hub.browseBusinessPacks ?? "Business Packs",
    searchIntentsTitle: hub.searchIntentsTitle ?? "Topics we help organizations understand",
    articleCtaTitle: hub.articleCtaTitle ?? "Ready to explore Aipify?",
    articleCtaPrimary: hub.articleCtaPrimary ?? "Book Demo",
    articleCtaSecondary: hub.articleCtaSecondary ?? "Get Started",
    relatedArticles: hub.relatedArticles ?? "Related articles",
    relatedBusinessPacks: hub.relatedBusinessPacks ?? "Related Business Packs",
    relatedFeatures: hub.relatedFeatures ?? "Related capabilities",
    relatedIntegrations: hub.relatedIntegrations ?? "Related integrations",
    relatedUseCases: hub.relatedUseCases ?? "Related use cases",
    examplesTitle: hub.examplesTitle ?? "Examples",
    introductionLabel: hub.introductionLabel ?? "Introduction",
    faqTitle: hub.faqTitle ?? "Frequently asked questions",
    readArticle: hub.readArticle ?? "Read article",
    viewCategory: hub.viewCategory ?? "View category",
    viewAllArticles: hub.viewAllArticles ?? "All articles",
    businessPackCta: hub.businessPackCta ?? "Explore this Business Pack",
    localesNote: hub.localesNote ?? "",
  };
}

export function getPublicKnowledgeCategories(marketing: MarketingDictionary): PublicKnowledgeCategory[] {
  const labels = (publicKnowledgeSection(marketing).categories ?? {}) as Record<
    string,
    { name?: string; description?: string }
  >;

  return PUBLIC_KNOWLEDGE_CATEGORIES.map((id) => ({
    id,
    name: labels[id]?.name ?? id,
    description: labels[id]?.description ?? "",
  }));
}

export function getPublicKnowledgeCategory(
  marketing: MarketingDictionary,
  categoryId: PublicKnowledgeCategoryId
): PublicKnowledgeCategory | null {
  return getPublicKnowledgeCategories(marketing).find((c) => c.id === categoryId) ?? null;
}

export function getPublicKnowledgeIndustries(marketing: MarketingDictionary): PublicKnowledgeIndustry[] {
  const labels = (publicKnowledgeSection(marketing).industries ?? {}) as Record<
    string,
    { name?: string; description?: string }
  >;

  return PUBLIC_KNOWLEDGE_INDUSTRIES.map((id) => ({
    id,
    name: labels[id]?.name ?? id,
    description: labels[id]?.description ?? "",
    overviewArticleSlug: PUBLIC_KNOWLEDGE_INDUSTRY_ARTICLE_MAP[id],
  }));
}

export function getPublicKnowledgeIndustry(
  marketing: MarketingDictionary,
  industryId: PublicKnowledgeIndustryId
): PublicKnowledgeIndustry | null {
  return getPublicKnowledgeIndustries(marketing).find((i) => i.id === industryId) ?? null;
}

export function getPublicKnowledgeArticle(
  marketing: MarketingDictionary,
  slug: string
): PublicKnowledgeArticle | null {
  const meta = getArticleMeta(slug);
  const content = articleContent(marketing, slug);
  if (!meta || !content) return null;
  return { ...meta, ...content };
}

export function getPublicKnowledgeArticlesForCategory(
  marketing: MarketingDictionary,
  categoryId: PublicKnowledgeCategoryId
): PublicKnowledgeArticle[] {
  return getArticlesByCategory(categoryId)
    .map((meta) => {
      const content = articleContent(marketing, meta.slug);
      return content ? { ...meta, ...content } : null;
    })
    .filter((a): a is PublicKnowledgeArticle => a !== null);
}

export function getPublicKnowledgeArticlesForHub(
  marketing: MarketingDictionary,
  hubId: NonNullable<PublicKnowledgeArticle["hubId"]>
): PublicKnowledgeArticle[] {
  return getArticlesByHub(hubId)
    .map((meta) => {
      const content = articleContent(marketing, meta.slug);
      return content ? { ...meta, ...content } : null;
    })
    .filter((a): a is PublicKnowledgeArticle => a !== null);
}

export function getPublicKnowledgeArticlesForIndustry(
  marketing: MarketingDictionary,
  industryId: PublicKnowledgeIndustryId
): PublicKnowledgeArticle[] {
  return getArticlesByIndustry(industryId)
    .map((meta) => {
      const content = articleContent(marketing, meta.slug);
      return content ? { ...meta, ...content } : null;
    })
    .filter((a): a is PublicKnowledgeArticle => a !== null);
}

export function getPublicKnowledgeArticleSummaries(marketing: MarketingDictionary): Array<{
  slug: string;
  title: string;
  metaDescription: string;
  categoryId: PublicKnowledgeCategoryId;
}> {
  return getAllArticleSlugs()
    .map((slug) => {
      const meta = getArticleMeta(slug);
      const content = articleContent(marketing, slug);
      if (!meta || !content) return null;
      return {
        slug,
        title: content.title,
        metaDescription: content.metaDescription,
        categoryId: meta.categoryId,
      };
    })
    .filter((a): a is NonNullable<typeof a> => a !== null);
}

export function getPublicBusinessPackPage(
  marketing: MarketingDictionary,
  slug: PublicBusinessPackSlug
): PublicBusinessPackPage | null {
  const packs = (publicKnowledgeSection(marketing).businessPacks ?? {}) as Record<
    string,
    Partial<PublicBusinessPackPage>
  >;
  const raw = packs[slug];
  if (!raw?.name) return null;
  return {
    slug,
    name: raw.name,
    metaDescription: raw.metaDescription ?? "",
    headline: raw.headline ?? raw.name,
    introduction: raw.introduction ?? "",
    useCases: raw.useCases ?? [],
    capabilities: raw.capabilities ?? [],
    faqs: raw.faqs ?? [],
    relatedArticles: raw.relatedArticles ?? [],
    relatedIntegrations: raw.relatedIntegrations ?? [],
  };
}

export function getAllPublicBusinessPackPages(marketing: MarketingDictionary): PublicBusinessPackPage[] {
  return PUBLIC_BUSINESS_PACK_SLUGS.map((slug) => getPublicBusinessPackPage(marketing, slug)).filter(
    (p): p is PublicBusinessPackPage => p !== null
  );
}

export function getPublicKnowledgeFaqs(
  marketing: MarketingDictionary,
  topic: string
): Array<{ q: string; a: string }> {
  const faqsRoot = (publicKnowledgeSection(marketing).faqs ?? {}) as Record<
    string,
    Record<string, { q?: string; a?: string }>
  >;
  return Object.values(faqsRoot[topic] ?? {})
    .filter((f) => f.q && f.a)
    .map((f) => ({ q: f.q!, a: f.a! }));
}

export function getSeoSearchIntentLabels(marketing: MarketingDictionary): string[] {
  const intents = (publicKnowledgeSection(marketing).searchIntents ?? {}) as {
    items?: Record<string, string>;
  };
  if (!intents.items) return [];
  return Object.values(intents.items);
}
