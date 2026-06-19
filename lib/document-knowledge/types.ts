export type DocumentStatus =
  | "draft"
  | "under_review"
  | "requires_update"
  | "published"
  | "restricted"
  | "archived";

export type DocumentRecord = {
  id: string;
  document_number: string | null;
  title: string;
  description: string;
  category: string;
  status: DocumentStatus;
  file_type: string;
  file_name: string | null;
  file_url: string | null;
  version: number;
  owner_user_id: string | null;
  department_id: string | null;
  domain_id: string | null;
  business_pack_key: string | null;
  tags: unknown[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export type DocumentTemplate = {
  id: string;
  template_key: string;
  name: string;
  description: string;
  category: string;
  file_type: string;
};

export type DocumentApproval = {
  approval_id: string;
  document_id: string;
  document_title: string;
  approval_status: string;
  created_at: string;
};

export type DocumentManagementCenter = {
  found: boolean;
  principle?: string;
  overview?: {
    total: number;
    published: number;
    pending_review: number;
    requires_update: number;
  };
  recent_documents?: DocumentRecord[];
  shared_documents?: DocumentRecord[];
  departments?: { department_id: string; department_name: string; document_count: number }[];
  templates?: DocumentTemplate[];
  policies?: DocumentRecord[];
  contracts?: DocumentRecord[];
  reports_section?: DocumentRecord[];
  archives?: DocumentRecord[];
  pending_approvals?: DocumentApproval[];
  usage_reports?: {
    most_recent: number;
    by_category: { category: string; count: number }[];
    approval_pending: number;
  };
  knowledge_route?: string;
  search_route?: string;
};

export type KnowledgeManagementCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  overview?: {
    published_articles: number;
    drafts_awaiting_review: number;
    faq_count: number;
    knowledge_gaps: number;
  };
  categories?: { slug: string; name: string; description?: string }[];
  published_list?: Record<string, unknown>[];
  awaiting_review?: Record<string, unknown>[];
  outdated_alerts?: Record<string, unknown>[];
  most_viewed?: Record<string, unknown>[];
  articles_with_domain?: Record<string, unknown>[];
  documents_route?: string;
};

export type GlobalSearchResult = {
  found: boolean;
  query: string;
  documents: DocumentRecord[];
  knowledge_articles: Record<string, unknown>[];
  templates: { id: string; name: string; template_key: string; category: string }[];
};
