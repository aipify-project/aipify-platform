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

export type BlueprintSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
  [key: string]: unknown;
};

export type KnowledgeTypeItem = {
  key?: string;
  label?: string;
  description?: string;
  [key: string]: unknown;
};

export type VisibilityLevelItem = {
  blueprint?: string;
  engine?: string;
  description?: string;
  [key: string]: unknown;
};

export type KnowledgeEvolutionSettings = {
  gap_detection_enabled?: boolean;
  evolution_tracking_enabled?: boolean;
  self_love_integration_enabled?: boolean;
  review_cycle_days?: number;
  companion_guidance_priority?: boolean;
  [key: string]: unknown;
};

export type KnowledgeCenterEngineCard = {
  has_organization: boolean;
  published_articles?: number;
  drafts_awaiting_review?: number;
  faq_count?: number;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  implementation_blueprint?: string;
  [key: string]: unknown;
};

export type KnowledgeCenterEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  safety_note?: string;
  implementation_blueprint?: Record<string, unknown>;
  principles?: string[];
  kc_objectives?: string[];
  knowledge_types?: KnowledgeTypeItem[];
  article_structure?: string[];
  visibility_levels?: VisibilityLevelItem[];
  knowledge_evolution?: KnowledgeEvolutionSettings;
  companion_integration?: Record<string, unknown>;
  dogfooding?: Record<string, unknown>;
  success_criteria?: BlueprintSuccessCriterion[];
  blueprint_integration_links?: { label?: string; route?: string }[];
  organization?: Record<string, unknown>;
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
  [key: string]: unknown;
};
