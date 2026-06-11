/**
 * Workflow Orchestration Engine helpers (Phase A.42).
 * Authoritative enforcement lives in Supabase RPCs.
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getWorkflowOrchestrationEngineDashboard(supabase: RpcClient): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_workflow_orchestration_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function createWorkflowFromTemplate(
  supabase: RpcClient,
  templateKey: string,
  workflowName?: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_workflow_from_template", {
    p_template_key: templateKey,
    p_workflow_name: workflowName ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createWorkflowOrchestrationEngineAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
