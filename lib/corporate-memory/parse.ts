import type {
  ContributionItem,
  CorporateDocumentItem,
  CorporateMemoryCenter,
  KnowledgeArticleItem,
  MemoryItem,
  PlaybookItem,
  TemplateItem,
} from "./types";

function mapArr(arr: unknown) {
  return Array.isArray(arr) ? (arr as Record<string, unknown>[]) : [];
}

function parseArticle(row: Record<string, unknown>): KnowledgeArticleItem {
  return {
    id: String(row.id ?? ""),
    knowledge_id: typeof row.knowledge_id === "string" ? row.knowledge_id : null,
    title: String(row.title ?? ""),
    description: typeof row.description === "string" ? row.description : null,
    category: typeof row.category === "string" ? row.category : null,
    status: String(row.status ?? "draft"),
    version: row.version != null ? Number(row.version) : null,
    view_count: row.view_count != null ? Number(row.view_count) : null,
    business_pack_key: typeof row.business_pack_key === "string" ? row.business_pack_key : null,
    updated_at: typeof row.updated_at === "string" ? row.updated_at : null,
  };
}

function parseDoc(row: Record<string, unknown>): CorporateDocumentItem {
  return {
    id: String(row.id ?? ""),
    document_number: typeof row.document_number === "string" ? row.document_number : null,
    title: String(row.title ?? ""),
    category: String(row.category ?? ""),
    status: String(row.status ?? "draft"),
    file_type: typeof row.file_type === "string" ? row.file_type : null,
    version: row.version != null ? Number(row.version) : null,
    business_pack_key: typeof row.business_pack_key === "string" ? row.business_pack_key : null,
    updated_at: typeof row.updated_at === "string" ? row.updated_at : null,
  };
}

function parsePlaybook(row: Record<string, unknown>): PlaybookItem {
  return {
    id: String(row.id ?? ""),
    playbook_number: typeof row.playbook_number === "string" ? row.playbook_number : null,
    title: String(row.title ?? ""),
    playbook_type: String(row.playbook_type ?? "operations"),
    status: String(row.status ?? "draft"),
    version: row.version != null ? Number(row.version) : null,
    business_pack_key: typeof row.business_pack_key === "string" ? row.business_pack_key : null,
    updated_at: typeof row.updated_at === "string" ? row.updated_at : null,
  };
}

function parseMemory(row: Record<string, unknown>): MemoryItem {
  return {
    id: String(row.id ?? ""),
    memory_number: typeof row.memory_number === "string" ? row.memory_number : null,
    title: String(row.title ?? ""),
    memory_type: String(row.memory_type ?? ""),
    status: String(row.status ?? "draft"),
    updated_at: typeof row.updated_at === "string" ? row.updated_at : null,
  };
}

function parseContribution(row: Record<string, unknown>): ContributionItem {
  return {
    id: String(row.id ?? ""),
    contribution_number: typeof row.contribution_number === "string" ? row.contribution_number : null,
    title: String(row.title ?? ""),
    contribution_type: String(row.contribution_type ?? ""),
    status: String(row.status ?? "pending"),
    created_at: typeof row.created_at === "string" ? row.created_at : null,
  };
}

function parseTemplate(row: Record<string, unknown>): TemplateItem {
  return {
    id: String(row.id ?? ""),
    template_key: String(row.template_key ?? ""),
    name: String(row.name ?? ""),
    category: String(row.category ?? ""),
    file_type: typeof row.file_type === "string" ? row.file_type : null,
    business_pack_key: typeof row.business_pack_key === "string" ? row.business_pack_key : null,
  };
}

export function parseCorporateMemoryCenter(data: unknown): CorporateMemoryCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };

  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    philosophy: typeof row.philosophy === "string" ? row.philosophy : undefined,
    overview: row.overview as Record<string, unknown> | undefined,
    knowledge_articles: mapArr(row.knowledge_articles).map(parseArticle),
    documents: mapArr(row.documents).map(parseDoc),
    policies: mapArr(row.policies).map(parseDoc),
    procedures: mapArr(row.procedures).map(parseDoc),
    playbooks: mapArr(row.playbooks).map(parsePlaybook),
    templates: mapArr(row.templates).map(parseTemplate),
    corporate_memory: mapArr(row.corporate_memory).map(parseMemory),
    contributions: mapArr(row.contributions).map(parseContribution),
    pending_contributions: mapArr(row.pending_contributions).map(parseContribution),
    reports: row.reports as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? (row.audit_recent as Record<string, unknown>[]).map((a) => ({
          action: String(a.action ?? ""),
          summary: String(a.summary ?? ""),
          created_at: String(a.created_at ?? ""),
        }))
      : [],
    sections: Array.isArray(row.sections) ? (row.sections as string[]) : [],
    routes: row.routes as Record<string, string> | undefined,
  };
}
