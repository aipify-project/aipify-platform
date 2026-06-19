import type { RpcClient } from "@/lib/core/rpc-client";

export async function getDocumentManagementCenter(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_document_management_center");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getKnowledgeManagementCenter(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_knowledge_management_center");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performDocumentManagementAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_document_management_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function searchGlobalKnowledgeDocuments(
  supabase: RpcClient,
  query: string,
  filters: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("search_global_knowledge_documents", {
    p_query: query,
    p_filters: filters,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function createBusinessPackDocument(
  supabase: RpcClient,
  params: {
    packKey: string;
    title: string;
    description?: string;
    category?: string;
    fileType?: string;
    domainId?: string;
    departmentId?: string;
    metadata?: Record<string, unknown>;
  },
) {
  const { data, error } = await supabase.rpc("create_business_pack_document", {
    p_pack_key: params.packKey,
    p_title: params.title,
    p_description: params.description ?? null,
    p_category: params.category ?? "operations",
    p_file_type: params.fileType ?? "pdf",
    p_domain_id: params.domainId ?? null,
    p_department_id: params.departmentId ?? null,
    p_metadata: params.metadata ?? {},
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionKnowledgeContext(supabase: RpcClient, query?: string) {
  const { data, error } = await supabase.rpc("get_companion_knowledge_context", {
    p_query: query ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export {
  buildDocumentManagementLabels,
  buildKnowledgeManagementLabels,
  documentStatusLabel,
} from "./labels";
export type { DocumentManagementLabels, KnowledgeManagementLabels } from "./labels";
