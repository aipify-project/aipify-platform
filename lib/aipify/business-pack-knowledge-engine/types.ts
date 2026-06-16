export type KnowledgeCategory =
  | "overview"
  | "getting_started"
  | "features"
  | "best_practices"
  | "troubleshooting"
  | "release_notes"
  | "upgrade_guidance"
  | "advanced_topics";

export type PackLocale = "en" | "no" | "sv" | "da";

export type KnowledgeArticle = {
  id: string;
  article_slug: string;
  category: KnowledgeCategory | string;
  title: string;
  summary: string;
  body: string;
  keywords?: string[];
  context_surfaces?: string[];
  version: string;
  published_at: string;
  updated_at: string;
  view_count: number;
  helpful_count: number;
  not_helpful_count: number;
  helpfulness_percent: number | null;
};

export type StructureItem = {
  key: string;
  label: string;
  order: number;
};

export type BusinessPackKnowledgeCenter = {
  found: boolean;
  pack_key?: string;
  locale?: PackLocale;
  principle?: string;
  definition?: {
    pack_name: string;
    publication_status: string;
    supported_locales: string[];
    knowledge_structure: StructureItem[];
  };
  structure?: StructureItem[];
  mandatory_categories?: string[];
  articles?: KnowledgeArticle[];
  contextual_articles?: Array<Pick<KnowledgeArticle, "id" | "article_slug" | "category" | "title" | "summary"> & { context_surfaces?: string[] }>;
  analytics?: {
    total_articles: number;
    total_views: number;
    open_gaps: number;
  };
  governance_note?: string;
  knowledge_center_route?: string;
};

export type BusinessPackKnowledgeEngineDashboard = {
  has_access: boolean;
  is_platform_admin?: boolean;
  principle?: string;
  knowledge_structure?: StructureItem[];
  mandatory_categories?: string[];
  supported_locales?: string[];
  governance?: Record<string, string>;
  forbidden?: string[];
  summary?: Record<string, number>;
  definitions?: Array<Record<string, unknown>>;
  top_articles?: Array<Record<string, unknown>>;
  top_searches?: Array<{ query: string; count: number }>;
  recent_audit?: Array<Record<string, unknown>>;
  success_criteria?: string[];
};

export const KNOWLEDGE_CATEGORIES: KnowledgeCategory[] = [
  "overview",
  "getting_started",
  "features",
  "best_practices",
  "troubleshooting",
  "release_notes",
  "upgrade_guidance",
  "advanced_topics",
];

export const CONTEXT_SURFACES = ["licensing", "installation", "integrations", "features"] as const;
