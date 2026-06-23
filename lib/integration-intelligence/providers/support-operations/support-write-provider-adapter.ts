import { mapSupportAiDashboardCases } from "@/lib/integration-intelligence/providers/support-operations/support-operations-contract";
import type { SupportWriteExecutionResult } from "@/lib/integration-intelligence/support/action-outcomes";
import type { SupportCaseSummary } from "@/lib/integration-intelligence/support/types";

export const SUPPORT_CASE_ASSIGN_RPC = "assign_support_case" as const;
export const SUPPORT_CASE_ESCALATE_RPC = "escalate_support_case" as const;
export const SUPPORT_CASE_CREATE_RPC = "create_organization_support_case" as const;
export const SUPPORT_CASE_READ_RPC = "get_support_ai_engine_dashboard" as const;

export type SupportWriteProviderRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>,
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export type SupportCaseWriteLookupResult = {
  found: boolean;
  case_summary: SupportCaseSummary | null;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function asArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

async function readDashboardRaw(
  client: SupportWriteProviderRpcClient,
): Promise<Record<string, unknown> | null> {
  const { data, error } = await client.rpc(SUPPORT_CASE_READ_RPC, {});
  if (error) return null;
  return asRecord(data);
}

function findRawCaseRow(
  dashboard: Record<string, unknown>,
  caseId: string,
): Record<string, unknown> | null {
  for (const bucket of ["open_cases", "unresolved_issues", "escalated_cases"] as const) {
    const match = asArray(dashboard[bucket]).find((row) => String(row.id ?? "") === caseId);
    if (match) return match;
  }
  return null;
}

export async function lookupSupportCaseForWrite(
  client: SupportWriteProviderRpcClient,
  caseId: string,
): Promise<SupportCaseWriteLookupResult> {
  const dashboard = await readDashboardRaw(client);
  if (!dashboard) {
    return { found: false, case_summary: null };
  }

  const cases = mapSupportAiDashboardCases(dashboard);
  const match = cases.find((entry) => entry.case_id === caseId);
  return {
    found: Boolean(match),
    case_summary: match ?? null,
  };
}

export async function createSupportProbeCase(
  client: SupportWriteProviderRpcClient,
  subject: string,
): Promise<{ case_id: string | null; failure_reason: string | null }> {
  const { data, error } = await client.rpc(SUPPORT_CASE_CREATE_RPC, {
    p_subject: subject,
    p_customer_identifier: null,
    p_channel: "admin_inbox",
    p_priority: "medium",
  });

  if (error) {
    return { case_id: null, failure_reason: error.message };
  }

  const record = asRecord(data);
  const caseId = record?.id ? String(record.id) : null;
  return { case_id: caseId, failure_reason: caseId ? null : "create_case_missing_id" };
}

function verifyAssignReread(input: {
  rpcResult: Record<string, unknown>;
  caseId: string;
  assigneeUserId: string;
  dashboard: Record<string, unknown>;
}): boolean {
  const assignedTo = String(input.rpcResult.assigned_to ?? "");
  if (assignedTo !== input.assigneeUserId) return false;
  return Boolean(findRawCaseRow(input.dashboard, input.caseId));
}

function verifyEscalateReread(input: {
  caseId: string;
  dashboard: Record<string, unknown>;
}): boolean {
  const row = findRawCaseRow(input.dashboard, input.caseId);
  if (!row) return false;
  const status = String(row.status ?? "");
  return status === "waiting_for_internal" || row.escalated_at != null;
}

export async function executeSupportCaseAssignViaProvider(input: {
  client: SupportWriteProviderRpcClient;
  case_id: string;
  assignee_user_id: string;
}): Promise<SupportWriteExecutionResult> {
  const lookup = await lookupSupportCaseForWrite(input.client, input.case_id);
  if (!lookup.found) {
    return { executed: false, failure_reason: "case_not_found", verified_after_reread: false };
  }

  const { data, error } = await input.client.rpc(SUPPORT_CASE_ASSIGN_RPC, {
    p_case_id: input.case_id,
    p_user_id: input.assignee_user_id,
  });

  if (error) {
    return { executed: false, failure_reason: error.message, verified_after_reread: false };
  }

  const rpcResult = asRecord(data);
  if (!rpcResult) {
    return { executed: false, failure_reason: "assign_rpc_empty", verified_after_reread: false };
  }

  const dashboard = await readDashboardRaw(input.client);
  if (!dashboard) {
    return { executed: false, failure_reason: "reread_failed", verified_after_reread: false };
  }

  const verified = verifyAssignReread({
    rpcResult,
    caseId: input.case_id,
    assigneeUserId: input.assignee_user_id,
    dashboard,
  });

  return {
    executed: verified,
    failure_reason: verified ? null : "assign_reread_mismatch",
    verified_after_reread: verified,
  };
}

export async function executeSupportCaseEscalateViaProvider(input: {
  client: SupportWriteProviderRpcClient;
  case_id: string;
  escalation_reason: string;
}): Promise<SupportWriteExecutionResult> {
  const lookup = await lookupSupportCaseForWrite(input.client, input.case_id);
  if (!lookup.found) {
    return { executed: false, failure_reason: "case_not_found", verified_after_reread: false };
  }

  const { data, error } = await input.client.rpc(SUPPORT_CASE_ESCALATE_RPC, {
    p_case_id: input.case_id,
    p_reason: input.escalation_reason,
  });

  if (error) {
    return { executed: false, failure_reason: error.message, verified_after_reread: false };
  }

  const rpcResult = asRecord(data);
  if (!rpcResult) {
    return { executed: false, failure_reason: "escalate_rpc_empty", verified_after_reread: false };
  }

  const dashboard = await readDashboardRaw(input.client);
  if (!dashboard) {
    return { executed: false, failure_reason: "reread_failed", verified_after_reread: false };
  }

  const verified = verifyEscalateReread({
    caseId: input.case_id,
    dashboard,
  });

  return {
    executed: verified,
    failure_reason: verified ? null : "escalate_reread_mismatch",
    verified_after_reread: verified,
  };
}

export function createSupportWriteProviderClient(
  supabase: SupportWriteProviderRpcClient,
): SupportWriteProviderRpcClient {
  return supabase;
}
