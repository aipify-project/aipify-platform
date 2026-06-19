import type {
  DocumentApproval,
  DocumentManagementCenter,
  DocumentRecord,
  DocumentTemplate,
  GlobalSearchResult,
  KnowledgeManagementCenter,
} from "./types";

function parseDocument(raw: unknown): DocumentRecord | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.title !== "string") return null;
  return {
    id: o.id,
    document_number: typeof o.document_number === "string" ? o.document_number : null,
    title: o.title,
    description: typeof o.description === "string" ? o.description : "",
    category: typeof o.category === "string" ? o.category : "operations",
    status: (o.status as DocumentRecord["status"]) ?? "draft",
    file_type: typeof o.file_type === "string" ? o.file_type : "pdf",
    file_name: typeof o.file_name === "string" ? o.file_name : null,
    file_url: typeof o.file_url === "string" ? o.file_url : null,
    version: Number(o.version ?? 1),
    owner_user_id: typeof o.owner_user_id === "string" ? o.owner_user_id : null,
    department_id: typeof o.department_id === "string" ? o.department_id : null,
    domain_id: typeof o.domain_id === "string" ? o.domain_id : null,
    business_pack_key: typeof o.business_pack_key === "string" ? o.business_pack_key : null,
    tags: Array.isArray(o.tags) ? o.tags : [],
    created_at: typeof o.created_at === "string" ? o.created_at : "",
    updated_at: typeof o.updated_at === "string" ? o.updated_at : "",
    published_at: typeof o.published_at === "string" ? o.published_at : null,
  };
}

function parseDocuments(raw: unknown): DocumentRecord[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parseDocument).filter((d): d is DocumentRecord => d !== null);
}

export function parseDocumentManagementCenter(data: unknown): DocumentManagementCenter | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  const overview = o.overview as Record<string, unknown> | undefined;
  const usage = o.usage_reports as Record<string, unknown> | undefined;

  return {
    found: Boolean(o.found),
    principle: typeof o.principle === "string" ? o.principle : undefined,
    overview: overview
      ? {
          total: Number(overview.total ?? 0),
          published: Number(overview.published ?? 0),
          pending_review: Number(overview.pending_review ?? 0),
          requires_update: Number(overview.requires_update ?? 0),
        }
      : undefined,
    recent_documents: parseDocuments(o.recent_documents),
    shared_documents: parseDocuments(o.shared_documents),
    departments: Array.isArray(o.departments) ? (o.departments as DocumentManagementCenter["departments"]) : [],
    templates: Array.isArray(o.templates) ? (o.templates as DocumentTemplate[]) : [],
    policies: parseDocuments(o.policies),
    contracts: parseDocuments(o.contracts),
    reports_section: parseDocuments(o.reports_section),
    archives: parseDocuments(o.archives),
    pending_approvals: Array.isArray(o.pending_approvals) ? (o.pending_approvals as DocumentApproval[]) : [],
    usage_reports: usage
      ? {
          most_recent: Number(usage.most_recent ?? 0),
          by_category: Array.isArray(usage.by_category) ? (usage.by_category as { category: string; count: number }[]) : [],
          approval_pending: Number(usage.approval_pending ?? 0),
        }
      : undefined,
    knowledge_route: typeof o.knowledge_route === "string" ? o.knowledge_route : undefined,
    search_route: typeof o.search_route === "string" ? o.search_route : undefined,
  };
}

export function parseKnowledgeManagementCenter(data: unknown): KnowledgeManagementCenter | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  const overview = o.overview as Record<string, unknown> | undefined;

  return {
    found: Boolean(o.found),
    principle: typeof o.principle === "string" ? o.principle : undefined,
    philosophy: typeof o.philosophy === "string" ? o.philosophy : undefined,
    overview: overview
      ? {
          published_articles: Number(overview.published_articles ?? 0),
          drafts_awaiting_review: Number(overview.drafts_awaiting_review ?? 0),
          faq_count: Number(overview.faq_count ?? 0),
          knowledge_gaps: Number(overview.knowledge_gaps ?? 0),
        }
      : undefined,
    categories: Array.isArray(o.categories) ? (o.categories as KnowledgeManagementCenter["categories"]) : [],
    published_list: Array.isArray(o.published_list) ? o.published_list : [],
    awaiting_review: Array.isArray(o.awaiting_review) ? o.awaiting_review : [],
    outdated_alerts: Array.isArray(o.outdated_alerts) ? o.outdated_alerts : [],
    most_viewed: Array.isArray(o.most_viewed) ? o.most_viewed : [],
    articles_with_domain: Array.isArray(o.articles_with_domain) ? o.articles_with_domain : [],
    documents_route: typeof o.documents_route === "string" ? o.documents_route : undefined,
  };
}

export function parseGlobalSearchResult(data: unknown): GlobalSearchResult | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  return {
    found: Boolean(o.found),
    query: typeof o.query === "string" ? o.query : "",
    documents: parseDocuments(o.documents),
    knowledge_articles: Array.isArray(o.knowledge_articles) ? o.knowledge_articles : [],
    templates: Array.isArray(o.templates) ? (o.templates as GlobalSearchResult["templates"]) : [],
  };
}
