export const KNOWLEDGE_VISIBILITIES = [
  "public",
  "authenticated",
  "admin_and_support",
  "internal",
] as const;
export type KnowledgeVisibility = (typeof KNOWLEDGE_VISIBILITIES)[number];

export const KNOWLEDGE_STATUSES = ["draft", "review", "published", "archived"] as const;
export type KnowledgeStatus = (typeof KNOWLEDGE_STATUSES)[number];

export const KNOWLEDGE_ARTICLE_TYPES = [
  "faq",
  "guide",
  "troubleshooting",
  "policy",
  "api_doc",
  "release_note",
  "onboarding",
  "internal_note",
] as const;
export type KnowledgeArticleType = (typeof KNOWLEDGE_ARTICLE_TYPES)[number];

export const KNOWLEDGE_GAP_STATUSES = [
  "open",
  "reviewing",
  "drafted",
  "article_created",
  "dismissed",
  "merged",
] as const;
export type KnowledgeGapStatus = (typeof KNOWLEDGE_GAP_STATUSES)[number];

export type KnowledgeSettings = {
  enabled: boolean;
  use_global_knowledge: boolean;
  allow_tenant_articles: boolean;
  allow_ai_gap_drafts: boolean;
  require_review_before_publish: boolean;
  default_language: string;
  fallback_language: string;
  minimum_answer_confidence: number;
  create_gap_below_confidence: number;
};

export type KnowledgeCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  visibility: KnowledgeVisibility;
};

export type KnowledgeArticle = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body: string;
  language: string;
  article_type: KnowledgeArticleType;
  status: KnowledgeStatus;
  visibility: KnowledgeVisibility;
  tags: string[];
  keywords: string[];
  category_id: string | null;
  category_slug: string | null;
  is_global: boolean;
  priority: number;
  source_path: string | null;
  published_at: string | null;
  updated_at: string;
};

export type KnowledgeGap = {
  id: string;
  question: string;
  language: string | null;
  source_type: string;
  frequency_count: number;
  confidence_score: number | null;
  suggested_title: string | null;
  suggested_answer_draft: string | null;
  status: KnowledgeGapStatus;
  related_article_id: string | null;
  created_at: string;
};

export type KnowledgeCenter = {
  has_customer: boolean;
  has_access: boolean;
  upgrade_required: boolean;
  enabled: boolean;
  privacy_note: string;
  metrics: {
    published_articles: number;
    draft_articles: number;
    review_articles: number;
    open_gaps: number;
    searches_24h: number;
  };
  recent_articles: KnowledgeArticle[];
  open_gaps: KnowledgeGap[];
  top_searches: Array<{ query: string; count: number }>;
};

export type KnowledgeSearchResult = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body: string;
  language: string;
  category_slug: string | null;
  score: number;
  is_global: boolean;
};

export type KnowledgeAnswer = {
  answer: string;
  confidence_score: number;
  articles_used: KnowledgeSearchResult[];
  created_gap_id: string | null;
  should_escalate: boolean;
  fallback_message: string | null;
  answered: boolean;
};

export type RetrieveKnowledgeAnswerInput = {
  tenantId?: string | null;
  userId?: string | null;
  query: string;
  language?: string;
  visibilityContext?: KnowledgeVisibility;
  sourceType?: string;
};
