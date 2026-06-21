import type {
  PublicKnowledgeCategory,
  PublicKnowledgeCategoryId,
  PublicKnowledgeHubId,
  PublicKnowledgeIndustry,
  PublicKnowledgeIndustryId,
} from "@/lib/marketing/knowledge/types";

export type KnowledgeArticleSummary = {
  slug: string;
  title: string;
  metaDescription: string;
  categoryId: PublicKnowledgeCategoryId;
  hubId?: PublicKnowledgeHubId;
  industryId?: PublicKnowledgeIndustryId;
};

export type BusinessPackSummary = {
  slug: string;
  name: string;
  metaDescription: string;
};

export type KnowledgePageRedesignLabels = {
  hero: {
    breadcrumbHome: string;
    breadcrumbKnowledge: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    authorityNote: string;
  };
  search: {
    placeholder: string;
    ariaLabel: string;
    noResults: string;
    quickLinksTitle: string;
    quickLinks: Array<{ label: string; href: string }>;
  };
  featured: {
    title: string;
    subtitle: string;
    readArticle: string;
    featuredSlugs: string[];
  };
  hubs: {
    title: string;
    subtitle: string;
    exploreHub: string;
    items: Record<string, { title: string; description: string }>;
  };
  categories: {
    title: string;
    subtitle: string;
    exploreCategory: string;
  };
  industries: {
    title: string;
    subtitle: string;
    exploreIndustry: string;
  };
  businessPacks: {
    title: string;
    subtitle: string;
    explorePack: string;
  };
  filterBar: {
    categoryLabel: string;
    typeLabel: string;
    sortLabel: string;
    allCategories: string;
    allTypes: string;
    sortTitleAsc: string;
    sortTitleDesc: string;
    resultsCount: string;
    openFilters: string;
    closeFilters: string;
    types: {
      hub: string;
      industry: string;
      article: string;
    };
  };
  articleListing: {
    featured: string;
    gettingStarted: string;
    latest: string;
    all: string;
    readArticle: string;
    empty: string;
  };
  journey: {
    title: string;
    steps: Array<{ title: string; description: string }>;
  };
  trust: {
    title: string;
    subtitle: string;
    principles: Array<{ title: string; description: string }>;
  };
  cta: {
    title: string;
    subtitle: string;
    bookDemo: string;
    explorePacks: string;
    earlyAccess: string;
  };
  nested: {
    backToKnowledge: string;
    breadcrumbHome: string;
    breadcrumbKnowledge: string;
  };
  localesNote: string;
};

export type KnowledgePageContentProps = {
  labels: KnowledgePageRedesignLabels;
  categories: PublicKnowledgeCategory[];
  industries: PublicKnowledgeIndustry[];
  businessPacks: BusinessPackSummary[];
  articleSummaries: KnowledgeArticleSummary[];
};
