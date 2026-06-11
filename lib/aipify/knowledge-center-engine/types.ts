export type KnowledgeCategory = {
  slug: string;
  name: string;
  description?: string | null;
};

export type KnowledgeArticleItem = {
  id: string;
  title: string;
  slug: string;
  language?: string;
  visibility?: string;
  status?: string;
  version?: number;
  view_count?: number;
  published_at?: string | null;
  updated_at?: string | null;
  review_due_at?: string | null;
  category_slug?: string | null;
};

export type KnowledgeFaqItem = {
  id: string;
  question: string;
  status?: string;
  visibility?: string;
};

export type KnowledgeCenterEngineCard = {
  has_organization: boolean;
  published_articles?: number;
  drafts_awaiting_review?: number;
  philosophy?: string;
};

export type KnowledgeCenterEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  safety_note?: string;
  principles?: string[];
  published_articles?: number;
  drafts_awaiting_review?: number;
  faq_count?: number;
  categories: KnowledgeCategory[];
  published_list: KnowledgeArticleItem[];
  awaiting_review: KnowledgeArticleItem[];
  outdated_alerts: KnowledgeArticleItem[];
  most_viewed: KnowledgeArticleItem[];
  needs_update: KnowledgeArticleItem[];
  recent_faqs: KnowledgeFaqItem[];
  import_formats?: string[];
};
