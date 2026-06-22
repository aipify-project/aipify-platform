import type {
  PublicBusinessPackSlug,
  PublicKnowledgeArticleMeta,
  PublicKnowledgeCategoryId,
  PublicKnowledgeIndustryId,
} from "./types";

function article(
  slug: string,
  categoryId: PublicKnowledgeCategoryId,
  opts: Partial<Omit<PublicKnowledgeArticleMeta, "slug" | "categoryId">> = {}
): PublicKnowledgeArticleMeta {
  return {
    slug,
    categoryId,
    searchIntents: opts.searchIntents ?? [],
    relatedArticles: opts.relatedArticles ?? [],
    relatedBusinessPacks: opts.relatedBusinessPacks ?? [],
    relatedFeatures: opts.relatedFeatures ?? [],
    relatedIntegrations: opts.relatedIntegrations ?? [],
    hubId: opts.hubId,
    industryId: opts.industryId,
  };
}

/** Locale-independent article graph — content lives in i18n `publicKnowledge.articles`. */
export const PUBLIC_KNOWLEDGE_ARTICLE_REGISTRY: PublicKnowledgeArticleMeta[] = [
  // Business Operating System hub
  article("what-is-a-business-operating-system", "business-operating-system", {
    hubId: "business-operating-system",
    searchIntents: ["Business Operating System", "Operational Intelligence"],
    relatedArticles: ["why-organizations-need-operational-visibility", "companion-vs-chatbot"],
    relatedFeatures: ["Companion", "Knowledge Center", "Governance"],
    relatedBusinessPacks: ["support", "warehouse"],
  }),
  article("why-organizations-need-operational-visibility", "business-operating-system", {
    hubId: "business-operating-system",
    searchIntents: ["Operational Visibility", "Executive Visibility"],
    relatedArticles: ["what-is-a-business-operating-system", "how-operational-knowledge-creates-competitive-advantage"],
    relatedFeatures: ["Executive Center", "Operations Center"],
  }),
  article("how-operational-knowledge-creates-competitive-advantage", "business-operating-system", {
    hubId: "business-operating-system",
    searchIntents: ["Knowledge Management", "Operational Intelligence"],
    relatedArticles: ["why-organizations-need-operational-visibility", "the-future-of-business-operations"],
    relatedFeatures: ["Knowledge Center", "Business DNA"],
  }),
  article("the-future-of-business-operations", "business-operating-system", {
    hubId: "business-operating-system",
    searchIntents: ["Business Operating System", "Governed Automation"],
    relatedArticles: ["what-is-a-business-operating-system", "human-centered-companion-design"],
    relatedFeatures: ["Governance", "Trust Center"],
  }),

  // Companion hub
  article("what-is-a-business-companion", "companion", {
    hubId: "companion",
    searchIntents: ["Companion Platform", "Enterprise Companion"],
    relatedArticles: ["companion-vs-chatbot", "how-companion-supports-organizations"],
    relatedFeatures: ["Companion", "Command Center"],
  }),
  article("companion-vs-chatbot", "companion", {
    hubId: "companion",
    searchIntents: ["Human-Centered AI", "Companion Platform"],
    relatedArticles: ["what-is-a-business-companion", "companion-vs-ai-assistant"],
    relatedFeatures: ["Companion", "Governance"],
  }),
  article("companion-vs-ai-assistant", "companion", {
    hubId: "companion",
    searchIntents: ["Enterprise Companion", "Human-Centered AI"],
    relatedArticles: ["companion-vs-chatbot", "human-centered-companion-design"],
    relatedFeatures: ["Companion", "Identity Engine"],
  }),
  article("how-companion-supports-organizations", "companion", {
    hubId: "companion",
    searchIntents: ["Executive Visibility", "Operational Intelligence"],
    relatedArticles: ["what-is-a-business-companion", "why-organizations-need-operational-visibility"],
    relatedFeatures: ["Companion", "Life OS", "Decision Support"],
  }),
  article("human-centered-companion-design", "companion", {
    hubId: "companion",
    searchIntents: ["Human-Centered AI", "Governed Automation"],
    relatedArticles: ["companion-vs-ai-assistant", "the-future-of-business-operations"],
    relatedFeatures: ["Companion", "Trust Center", "Approvals"],
  }),

  // Getting started & topical
  article("installing-aipify-web-app", "getting-started", {
    searchIntents: ["Install Aipify", "Aipify Web App"],
    relatedArticles: ["getting-started-with-aipify", "how-aipify-install-works"],
    relatedFeatures: ["Install Engine", "Command Center"],
  }),
  article("how-aipify-install-works", "getting-started", {
    searchIntents: ["Aipify Install", "Connect Aipify", "Installation Wizard"],
    relatedArticles: ["getting-started-with-aipify", "governance-and-human-approval"],
    relatedFeatures: ["Install Engine", "Trust Center"],
    relatedIntegrations: ["wordpress", "shopify", "woocommerce"],
  }),
  article("customer-feedback-and-product-improvement", "governance", {
    searchIntents: ["Customer Feedback", "Product Improvement", "Privacy"],
    relatedArticles: ["governance-and-human-approval", "getting-started-with-aipify"],
    relatedFeatures: ["Voice of the Customer", "Trust Center"],
  }),
  article("getting-started-with-aipify", "getting-started", {
    searchIntents: ["Business Operating System"],
    relatedArticles: ["what-is-a-business-operating-system", "what-is-a-business-companion"],
    relatedFeatures: ["Install Engine", "Knowledge Center"],
  }),
  article("governance-and-human-approval", "governance", {
    searchIntents: ["Governed Automation"],
    relatedArticles: ["human-centered-companion-design", "the-future-of-business-operations"],
    relatedFeatures: ["Trust & Action Engine", "Approvals"],
  }),
  article("enterprise-knowledge-management", "knowledge-center", {
    searchIntents: ["Knowledge Management"],
    relatedArticles: ["how-operational-knowledge-creates-competitive-advantage"],
    relatedFeatures: ["Knowledge Center", "Employee Knowledge"],
  }),

  // Industry overviews
  article("hospitality-operations-with-aipify", "operations", {
    industryId: "hospitality",
    searchIntents: ["Operational Visibility"],
    relatedArticles: ["what-is-a-business-operating-system"],
    relatedBusinessPacks: ["hosts"],
    relatedFeatures: ["Business Packs", "Companion"],
  }),
  article("property-management-operations-with-aipify", "operations", {
    industryId: "property-management",
    searchIntents: ["Operational Visibility"],
    relatedBusinessPacks: ["hosts"],
    relatedFeatures: ["Operations Center"],
  }),
  article("commerce-operations-with-aipify", "operations", {
    industryId: "commerce",
    searchIntents: ["Operational Intelligence"],
    relatedBusinessPacks: ["support", "warehouse"],
  }),
  article("support-operations-with-aipify", "operations", {
    industryId: "support-operations",
    searchIntents: ["Knowledge Management"],
    relatedBusinessPacks: ["support"],
    relatedFeatures: ["Aipify Support", "Business DNA"],
  }),
  article("warehouse-operations-with-aipify", "operations", {
    industryId: "warehouse-operations",
    searchIntents: ["Operational Visibility"],
    relatedBusinessPacks: ["warehouse"],
  }),
  article("professional-services-with-aipify", "operations", {
    industryId: "professional-services",
    searchIntents: ["Executive Visibility"],
    relatedBusinessPacks: ["finance", "support"],
  }),
];

export const PUBLIC_KNOWLEDGE_INDUSTRY_PACK_MAP: Record<PublicKnowledgeIndustryId, PublicBusinessPackSlug[]> = {
  hospitality: ["hosts"],
  "property-management": ["hosts"],
  commerce: ["support", "warehouse"],
  "support-operations": ["support"],
  "warehouse-operations": ["warehouse"],
  "professional-services": ["finance", "support"],
};

export const PUBLIC_KNOWLEDGE_INDUSTRY_ARTICLE_MAP: Record<PublicKnowledgeIndustryId, string> = {
  hospitality: "hospitality-operations-with-aipify",
  "property-management": "property-management-operations-with-aipify",
  commerce: "commerce-operations-with-aipify",
  "support-operations": "support-operations-with-aipify",
  "warehouse-operations": "warehouse-operations-with-aipify",
  "professional-services": "professional-services-with-aipify",
};

export const PUBLIC_BUSINESS_PACK_RELATED_ARTICLES: Record<PublicBusinessPackSlug, string[]> = {
  hosts: ["hospitality-operations-with-aipify", "property-management-operations-with-aipify"],
  support: ["support-operations-with-aipify", "companion-vs-chatbot"],
  warehouse: ["warehouse-operations-with-aipify", "why-organizations-need-operational-visibility"],
  finance: ["professional-services-with-aipify", "how-operational-knowledge-creates-competitive-advantage"],
};

export function getArticleMeta(slug: string): PublicKnowledgeArticleMeta | undefined {
  return PUBLIC_KNOWLEDGE_ARTICLE_REGISTRY.find((a) => a.slug === slug);
}

export function getArticlesByCategory(categoryId: PublicKnowledgeCategoryId): PublicKnowledgeArticleMeta[] {
  return PUBLIC_KNOWLEDGE_ARTICLE_REGISTRY.filter((a) => a.categoryId === categoryId);
}

export function getArticlesByHub(hubId: PublicKnowledgeArticleMeta["hubId"]): PublicKnowledgeArticleMeta[] {
  return PUBLIC_KNOWLEDGE_ARTICLE_REGISTRY.filter((a) => a.hubId === hubId);
}

export function getArticlesByIndustry(industryId: PublicKnowledgeIndustryId): PublicKnowledgeArticleMeta[] {
  return PUBLIC_KNOWLEDGE_ARTICLE_REGISTRY.filter((a) => a.industryId === industryId);
}

export function getAllArticleSlugs(): string[] {
  return PUBLIC_KNOWLEDGE_ARTICLE_REGISTRY.map((a) => a.slug);
}
