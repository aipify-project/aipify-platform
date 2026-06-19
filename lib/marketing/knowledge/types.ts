export const PUBLIC_KNOWLEDGE_CATEGORIES = [
  "getting-started",
  "companion",
  "knowledge-center",
  "trust-center",
  "governance",
  "business-packs",
  "growth-partners",
  "integrations",
  "enterprise",
  "security",
  "operations",
  "business-operating-system",
] as const;

export type PublicKnowledgeCategoryId = (typeof PUBLIC_KNOWLEDGE_CATEGORIES)[number];

export const PUBLIC_KNOWLEDGE_HUBS = ["business-operating-system", "companion"] as const;
export type PublicKnowledgeHubId = (typeof PUBLIC_KNOWLEDGE_HUBS)[number];

export const PUBLIC_KNOWLEDGE_INDUSTRIES = [
  "hospitality",
  "property-management",
  "commerce",
  "support-operations",
  "warehouse-operations",
  "professional-services",
] as const;

export type PublicKnowledgeIndustryId = (typeof PUBLIC_KNOWLEDGE_INDUSTRIES)[number];

export const PUBLIC_BUSINESS_PACK_SLUGS = ["hosts", "support", "warehouse", "finance"] as const;
export type PublicBusinessPackSlug = (typeof PUBLIC_BUSINESS_PACK_SLUGS)[number];

export const SEO_SEARCH_INTENTS = [
  "Business Operating System",
  "Operational Visibility",
  "Executive Visibility",
  "Knowledge Management",
  "Human-Centered AI",
  "Operational Intelligence",
  "Companion Platform",
  "Governed Automation",
  "Enterprise Companion",
] as const;

export type ArticleSection = { heading: string; body: string };
export type ArticleExample = { title: string; body: string };

export type PublicKnowledgeArticleMeta = {
  slug: string;
  categoryId: PublicKnowledgeCategoryId;
  hubId?: PublicKnowledgeHubId;
  industryId?: PublicKnowledgeIndustryId;
  searchIntents: string[];
  relatedArticles: string[];
  relatedBusinessPacks: PublicBusinessPackSlug[];
  relatedFeatures: string[];
  relatedIntegrations: string[];
};

export type PublicKnowledgeArticleContent = {
  title: string;
  metaDescription: string;
  introduction: string;
  sections: ArticleSection[];
  examples: ArticleExample[];
};

export type PublicKnowledgeArticle = PublicKnowledgeArticleMeta & PublicKnowledgeArticleContent;

export type PublicKnowledgeCategory = {
  id: PublicKnowledgeCategoryId;
  name: string;
  description: string;
};

export type PublicKnowledgeIndustry = {
  id: PublicKnowledgeIndustryId;
  name: string;
  description: string;
  overviewArticleSlug: string;
};

export type PublicBusinessPackPage = {
  slug: PublicBusinessPackSlug;
  name: string;
  metaDescription: string;
  headline: string;
  introduction: string;
  useCases: string[];
  capabilities: string[];
  faqs: Array<{ q: string; a: string }>;
  relatedArticles: string[];
  relatedIntegrations: string[];
};

export type PublicKnowledgeHubLabels = {
  title: string;
  subtitle: string;
  authorityNote: string;
  browseCategories: string;
  browseHubs: string;
  browseIndustries: string;
  browseBusinessPacks: string;
  searchIntentsTitle: string;
  articleCtaTitle: string;
  articleCtaPrimary: string;
  articleCtaSecondary: string;
  relatedArticles: string;
  relatedBusinessPacks: string;
  relatedFeatures: string;
  relatedIntegrations: string;
  relatedUseCases: string;
  examplesTitle: string;
  introductionLabel: string;
  faqTitle: string;
  readArticle: string;
  viewCategory: string;
  viewAllArticles: string;
  businessPackCta: string;
  localesNote: string;
};
