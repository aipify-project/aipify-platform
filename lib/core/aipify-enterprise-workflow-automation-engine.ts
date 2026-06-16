/**
 * Enterprise Workflow Automation Engine helpers (Phase 231).
 * Authoritative enforcement lives in Supabase RPCs (_aewae_*).
 */

import type { RpcClient } from "./rpc-client";

export async function getAipifyEnterpriseWorkflowAutomationEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_workflow_automation_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyEnterpriseWorkflowAutomationEngineCard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_enterprise_workflow_automation_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createAipifyEnterpriseWorkflowAutomationEngineAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
