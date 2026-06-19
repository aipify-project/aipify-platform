import type { RpcClient } from "@/lib/core/rpc-client";

export async function getTaskManagementCenter(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_task_management_center");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performTaskManagementAction(
  supabase: RpcClient,
  actionType: string,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase.rpc("perform_task_management_action", {
    p_action_type: actionType,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function createBusinessPackTask(
  supabase: RpcClient,
  params: {
    packKey: string;
    title: string;
    description?: string;
    priority?: string;
    dueDate?: string;
    assignedUserId?: string;
    domainId?: string;
    departmentId?: string;
    metadata?: Record<string, unknown>;
  },
) {
  const { data, error } = await supabase.rpc("create_business_pack_task", {
    p_pack_key: params.packKey,
    p_title: params.title,
    p_description: params.description ?? null,
    p_priority: params.priority ?? "normal",
    p_due_date: params.dueDate ?? null,
    p_assigned_user_id: params.assignedUserId ?? null,
    p_domain_id: params.domainId ?? null,
    p_department_id: params.departmentId ?? null,
    p_metadata: params.metadata ?? {},
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getCompanionTaskContext(supabase: RpcClient) {
  const { data, error } = await supabase.rpc("get_companion_task_context");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export * from "./types";
export * from "./parse";
export { buildTaskManagementLabels, statusLabel, priorityLabel } from "./labels";
export type { TaskManagementLabels } from "./labels";
