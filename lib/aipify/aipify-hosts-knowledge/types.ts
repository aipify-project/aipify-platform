export type HostsKnowledgeArticleSummary = {
  slug: string;
  title: string;
  excerpt: string;
  category_name: string | null;
  section_key?: string | null;
  viewed_at?: string;
};

export type HostsKnowledgeArticle = {
  slug: string;
  title: string;
  body: string;
  category_slug: string | null;
  category_name: string | null;
  tags: string[];
};

export type HostsKnowledgeSection = {
  key: string;
  label: string;
  articles: HostsKnowledgeArticleSummary[];
};

export type HostsKnowledgeVersion = {
  version_number: number;
  title: string;
  change_summary: string | null;
  created_at: string;
};

export type HostsKnowledgeDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  positioning: string;
  modules: Array<{ key: string; label: string; description: string }>;
  sections: HostsKnowledgeSection[];
  popular_articles: HostsKnowledgeArticleSummary[];
  suggested_articles: HostsKnowledgeArticleSummary[];
  recent_articles: HostsKnowledgeArticleSummary[];
  features: string[];
};

export type AipifyHostsKnowledgeArticleDetail = {
  found: boolean;
  slug?: string;
  article?: HostsKnowledgeArticle;
  related_articles?: HostsKnowledgeArticleSummary[];
  recommended_reading?: HostsKnowledgeArticleSummary[];
  versions?: HostsKnowledgeVersion[];
  user_marked_helpful?: boolean;
};

export type HostsKnowledgeSearchResult = {
  query: string;
  results: HostsKnowledgeArticleSummary[];
};
