import type { MarketingDictionary } from "@/lib/marketing/get-marketing-context";
import {
  getAllArticleSlugs,
  getArticleMeta,
  getArticlesByCategory,
  getArticlesByHub,
  getArticlesByIndustry,
  PUBLIC_KNOWLEDGE_INDUSTRY_ARTICLE_MAP,
} from "./registry";
import { getCategoryRegistryEntry } from "./category-registry";
import type {
  PublicBusinessPackPage,
  PublicBusinessPackSlug,
  PublicKnowledgeArticle,
  PublicKnowledgeArticleContent,
  PublicKnowledgeCategory,
  PublicKnowledgeCategoryDetail,
  PublicKnowledgeCategoryId,
  PublicKnowledgeCategoryPageLabels,
  PublicKnowledgeCategoryTopic,
  PublicKnowledgeHubLabels,
  PublicKnowledgeIndustry,
  PublicKnowledgeIndustryDetail,
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

function recordValues<T>(raw: Record<string, T> | undefined): T[] {
  if (!raw) return [];
  return Object.keys(raw)
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => raw[key]!);
}

function articleContent(
  marketing: MarketingDictionary,
  slug: string
): PublicKnowledgeArticleContent | null {
  const articles = (publicKnowledgeSection(marketing).articles ?? {}) as Record<
    string,
    Partial<PublicKnowledgeArticleContent> & {
      keyTakeaways?: Record<string, string>;
    }
  >;
  const raw = articles[slug];
  if (!raw?.title) return null;
  return {
    title: raw.title,
    metaDescription: raw.metaDescription ?? "",
    introduction: raw.introduction ?? "",
    sections: raw.sections ?? [],
    examples: raw.examples ?? [],
    keyTakeaways: recordValues(raw.keyTakeaways),
    readingTime: raw.readingTime ?? "",
    publishedDate: raw.publishedDate ?? "",
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
    readingTimeLabel: hub.readingTimeLabel ?? "Reading time",
    publishedLabel: hub.publishedLabel ?? "Published",
    keyTakeawaysTitle: hub.keyTakeawaysTitle ?? "Key takeaways",
    backToKnowledge: hub.backToKnowledge ?? "Back to Knowledge Center",
    exploreBusinessPack: hub.exploreBusinessPack ?? "Explore Business Pack",
    industryChallengesTitle: hub.industryChallengesTitle ?? "Common challenges",
    industryHowAipifyHelpsTitle: hub.industryHowAipifyHelpsTitle ?? "How Aipify helps",
    industryWorkflowsTitle: hub.industryWorkflowsTitle ?? "Operational workflows",
    industryRecommendedPacksTitle: hub.industryRecommendedPacksTitle ?? "Recommended Business Packs",
    industryGovernanceTitle: hub.industryGovernanceTitle ?? "Governance and control",
    industryOutcomesTitle: hub.industryOutcomesTitle ?? "Expected outcomes",
    industryRelatedArticlesTitle: hub.industryRelatedArticlesTitle ?? "Related articles",
    industryOrgTypesTitle: hub.industryOrgTypesTitle ?? "Organizations we guide",
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

type CategoryI18nBlock = {
  name?: string;
  description?: string;
  headline?: string;
  introduction?: string;
  topics?: Record<string, { title?: string; description?: string }>;
  seo?: { title?: string; description?: string };
  cta?: {
    primary?: string;
    secondary?: string;
    primaryHref?: string;
    secondaryHref?: string;
  };
};

function categoryI18nBlock(
  marketing: MarketingDictionary,
  categoryId: PublicKnowledgeCategoryId
): CategoryI18nBlock {
  const labels = (publicKnowledgeSection(marketing).categories ?? {}) as Record<string, CategoryI18nBlock>;
  return labels[categoryId] ?? {};
}

export function getPublicKnowledgeCategoryPageLabels(
  marketing: MarketingDictionary
): PublicKnowledgeCategoryPageLabels {
  const page = (publicKnowledgeSection(marketing).categoryPage ?? {}) as Partial<PublicKnowledgeCategoryPageLabels>;
  const hub = getPublicKnowledgeHubLabels(marketing);
  const types = (page.resourceTypes ?? {}) as Partial<PublicKnowledgeCategoryPageLabels["resourceTypes"]>;

  return {
    topicsTitle: page.topicsTitle ?? "What you will find here",
    featuredTitle: page.featuredTitle ?? "Featured resources",
    featuredSubtitle: page.featuredSubtitle ?? "",
    allResourcesTitle: page.allResourcesTitle ?? "All resources in this category",
    relatedTitle: page.relatedTitle ?? "Related categories",
    resourceCount: page.resourceCount ?? "{count} resources",
    readArticle: page.readArticle ?? hub.readArticle,
    viewCategory: page.viewCategory ?? hub.viewCategory,
    emptyArticles: page.emptyArticles ?? "No articles in this category yet.",
    searchPlaceholder: page.searchPlaceholder ?? "Search in this category…",
    searchAriaLabel: page.searchAriaLabel ?? "Search category resources",
    typeLabel: page.typeLabel ?? "Content type",
    sortLabel: page.sortLabel ?? "Sort",
    allTypes: page.allTypes ?? "All types",
    sortTitleAsc: page.sortTitleAsc ?? "Title A–Z",
    sortTitleDesc: page.sortTitleDesc ?? "Title Z–A",
    resultsCount: page.resultsCount ?? "{count} resources",
    openFilters: page.openFilters ?? "Filters",
    closeFilters: page.closeFilters ?? "Close filters",
    resourceTypes: {
      hub: types.hub ?? "Hub articles",
      industry: types.industry ?? "Industry guides",
      article: types.article ?? "General articles",
    },
  };
}

export function getPublicKnowledgeCategoryDetail(
  marketing: MarketingDictionary,
  categoryId: PublicKnowledgeCategoryId
): PublicKnowledgeCategoryDetail | null {
  const base = getPublicKnowledgeCategory(marketing, categoryId);
  const registry = getCategoryRegistryEntry(categoryId);
  if (!base || !registry) return null;

  const i18n = categoryI18nBlock(marketing, categoryId);
  const pageLabels = getPublicKnowledgeCategoryPageLabels(marketing);
  const articles = getPublicKnowledgeArticlesForCategory(marketing, categoryId);

  const topics: PublicKnowledgeCategoryTopic[] = registry.topicIds
    .map((topicId) => {
      const raw = i18n.topics?.[topicId];
      if (!raw?.title) return null;
      return {
        id: topicId,
        title: raw.title,
        description: raw.description ?? "",
      };
    })
    .filter((topic): topic is PublicKnowledgeCategoryTopic => topic !== null);

  const relatedCategories = registry.relatedCategoryIds
    .map((id) => getPublicKnowledgeCategory(marketing, id))
    .filter((category): category is PublicKnowledgeCategory => category !== null);

  return {
    ...base,
    headline: i18n.headline ?? base.description,
    introduction: i18n.introduction ?? base.description,
    topics,
    relatedCategories,
    featuredArticleSlugs: registry.featuredArticleSlugs,
    cta: {
      primary: i18n.cta?.primary ?? pageLabels.readArticle,
      secondary: i18n.cta?.secondary ?? "",
      primaryHref: i18n.cta?.primaryHref ?? registry.ctaPrimaryHref,
      secondaryHref: i18n.cta?.secondaryHref ?? registry.ctaSecondaryHref,
    },
    seo: {
      title: i18n.seo?.title ?? `${base.name} | Knowledge Center`,
      description: i18n.seo?.description ?? base.description,
    },
    resourceCount: articles.length,
    pageLabels,
  };
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

export function getPublicKnowledgeIndustryDetail(
  marketing: MarketingDictionary,
  industryId: PublicKnowledgeIndustryId
): PublicKnowledgeIndustryDetail | null {
  const details = (publicKnowledgeSection(marketing).industryDetails ?? {}) as Record<
    string,
    Partial<PublicKnowledgeIndustryDetail> & {
      orgTypes?: Record<string, string>;
      challenges?: Record<string, string>;
      recommendedPackSlugs?: string[];
      relatedArticleSlugs?: string[];
    }
  >;
  const raw = details[industryId];
  if (!raw?.headline) return null;

  return {
    metaDescription: raw.metaDescription ?? "",
    headline: raw.headline,
    intro: raw.intro ?? "",
    orgTypes: recordValues(raw.orgTypes as Record<string, string> | undefined),
    primaryCta: raw.primaryCta ?? "",
    secondaryCta: raw.secondaryCta ?? "",
    challengesTitle: raw.challengesTitle ?? "",
    challenges: recordValues(raw.challenges as Record<string, string> | undefined),
    howAipifyHelpsTitle: raw.howAipifyHelpsTitle ?? "",
    howAipifyHelps: raw.howAipifyHelps ?? [],
    workflowsTitle: raw.workflowsTitle ?? "",
    workflows: raw.workflows ?? [],
    recommendedPackSlugs: (raw.recommendedPackSlugs ?? []) as PublicBusinessPackSlug[],
    governanceTitle: raw.governanceTitle ?? "",
    governanceBody: raw.governanceBody ?? "",
    outcomesTitle: raw.outcomesTitle ?? "",
    outcomes: raw.outcomes ?? [],
    relatedArticleSlugs: raw.relatedArticleSlugs ?? [],
  };
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
