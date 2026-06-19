export type KnowledgeArticleItem = {
  id: string;
  knowledge_id?: string | null;
  title: string;
  description?: string | null;
  category?: string | null;
  status: string;
  version?: number | null;
  view_count?: number | null;
  business_pack_key?: string | null;
  updated_at?: string | null;
};

export type CorporateDocumentItem = {
  id: string;
  document_number?: string | null;
  title: string;
  category: string;
  status: string;
  file_type?: string | null;
  version?: number | null;
  business_pack_key?: string | null;
  updated_at?: string | null;
};

export type PlaybookItem = {
  id: string;
  playbook_number?: string | null;
  title: string;
  playbook_type: string;
  status: string;
  version?: number | null;
  business_pack_key?: string | null;
  updated_at?: string | null;
};

export type MemoryItem = {
  id: string;
  memory_number?: string | null;
  title: string;
  memory_type: string;
  status: string;
  updated_at?: string | null;
};

export type ContributionItem = {
  id: string;
  contribution_number?: string | null;
  title: string;
  contribution_type: string;
  status: string;
  created_at?: string | null;
};

export type TemplateItem = {
  id: string;
  template_key: string;
  name: string;
  category: string;
  file_type?: string | null;
  business_pack_key?: string | null;
};

export type CorporateMemoryCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  overview?: Record<string, unknown>;
  knowledge_articles?: KnowledgeArticleItem[];
  documents?: CorporateDocumentItem[];
  policies?: CorporateDocumentItem[];
  procedures?: CorporateDocumentItem[];
  playbooks?: PlaybookItem[];
  templates?: TemplateItem[];
  corporate_memory?: MemoryItem[];
  contributions?: ContributionItem[];
  pending_contributions?: ContributionItem[];
  reports?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; created_at: string }[];
  sections?: string[];
  routes?: Record<string, string>;
};
