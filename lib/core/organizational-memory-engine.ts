/**
 * Organizational Memory Engine helpers (Phase A.34).
 * Authoritative enforcement lives in Supabase RPCs (_ome_*).
 * Distinct from PAME personal memories and Learning Engine.
 */

import {
  MEMORY_RECORD_CATEGORIES,
  MEMORY_VISIBILITY_LEVELS,
  type MemoryRecordCategory,
  type MemoryVisibility,
} from "@/lib/aipify/organizational-memory-engine";

export {
  MEMORY_RECORD_CATEGORIES,
  MEMORY_VISIBILITY_LEVELS,
  type MemoryRecordCategory,
  type MemoryVisibility,
};

type MemoryRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export function canViewMemory(role: string): boolean {
  return ["owner", "administrator", "manager", "support_agent", "viewer"].includes(role);
}

export function canCreateMemory(role: string): boolean {
  return ["owner", "administrator", "manager", "support_agent"].includes(role);
}

export function canEditMemory(role: string): boolean {
  return role === "owner" || role === "administrator" || role === "manager";
}

export function canArchiveMemory(role: string): boolean {
  return role === "owner" || role === "administrator";
}

export function canReviewMemory(role: string): boolean {
  return role === "owner" || role === "administrator" || role === "manager";
}

export async function getOrganizationalMemoryEngineDashboard(
  supabase: MemoryRpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_organizational_memory_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function createOrganizationMemoryRecord(
  supabase: MemoryRpcClient,
  params: {
    category: MemoryRecordCategory;
    title: string;
    summary?: string;
    detailed_context?: Record<string, unknown>;
    source_reference?: string | null;
    visibility?: MemoryVisibility;
  }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_organization_memory_record", {
    p_category: params.category,
    p_title: params.title,
    p_summary: params.summary ?? "",
    p_detailed_context: params.detailed_context ?? {},
    p_source_reference: params.source_reference ?? null,
    p_visibility: params.visibility ?? "internal",
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performOrganizationMemoryAction(
  supabase: MemoryRpcClient,
  recordId: string,
  action: string,
  payload: Record<string, unknown> = {}
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("perform_organization_memory_action", {
    p_record_id: recordId,
    p_action: action,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function createOrganizationDecisionEntry(
  supabase: MemoryRpcClient,
  params: {
    decision_title: string;
    rationale?: string;
    alternatives?: string;
    expected_outcomes?: string;
    review_date?: string | null;
    memory_record_id?: string | null;
  }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_organization_decision_register_entry", {
    p_decision_title: params.decision_title,
    p_rationale: params.rationale ?? "",
    p_alternatives: params.alternatives ?? "",
    p_expected_outcomes: params.expected_outcomes ?? "",
    p_review_date: params.review_date ?? null,
    p_memory_record_id: params.memory_record_id ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function searchOrganizationMemoryRecords(
  supabase: MemoryRpcClient,
  query = "",
  category?: string | null,
  status = "active",
  limit = 20
): Promise<unknown[]> {
  const { data, error } = await supabase.rpc("search_organization_memory_records", {
    p_query: query,
    p_category: category ?? null,
    p_status: status,
    p_limit: limit,
  });
  if (error) throw new Error(error.message);
  return Array.isArray(data) ? data : [];
}

export async function listOrganizationMemoryDecisions(
  supabase: MemoryRpcClient,
  status?: string | null,
  limit = 20
): Promise<unknown[]> {
  const { data, error } = await supabase.rpc("list_organization_memory_decisions", {
    p_status: status ?? null,
    p_limit: limit,
  });
  if (error) throw new Error(error.message);
  return Array.isArray(data) ? data : [];
}

export function createOrganizationalMemoryAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
