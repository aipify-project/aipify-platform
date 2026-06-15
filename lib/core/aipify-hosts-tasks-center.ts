/**
 * Aipify Hosts — Tasks Center (Phase Airbnb 18).
 * Authoritative enforcement lives in Supabase RPCs (_ahosttask_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getAipifyHostsTasksCenterDashboard(
  supabase: RpcClient,
  section = "active_tasks",
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_tasks_center_dashboard", { p_section: section });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsTasksCenterCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_tasks_center_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function createAipifyHostsTask(
  supabase: RpcClient,
  params: {
    title: string;
    description?: string;
    propertyId?: string | null;
    category?: string;
    priority?: string;
    assigneeRole?: string | null;
    assigneeName?: string | null;
    dueDate?: string | null;
    scheduledFor?: string | null;
    recurrence?: string | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_aipify_hosts_task", {
    p_title: params.title,
    p_description: params.description ?? null,
    p_property_id: params.propertyId ?? null,
    p_category: params.category ?? "cleaning",
    p_priority: params.priority ?? "medium",
    p_assignee_role: params.assigneeRole ?? null,
    p_assignee_name: params.assigneeName ?? null,
    p_due_date: params.dueDate ?? null,
    p_scheduled_for: params.scheduledFor ?? null,
    p_recurrence: params.recurrence ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updateAipifyHostsTaskStatus(
  supabase: RpcClient,
  taskId: string,
  status: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_aipify_hosts_task_status", {
    p_task_id: taskId,
    p_status: status,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function assignAipifyHostsTask(
  supabase: RpcClient,
  taskId: string,
  assigneeRole: string,
  assigneeName?: string | null,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("assign_aipify_hosts_task", {
    p_task_id: taskId,
    p_assignee_role: assigneeRole,
    p_assignee_name: assigneeName ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function initiateAipifyHostsPlaybook(
  supabase: RpcClient,
  playbookKey: string,
  propertyId?: string | null,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("initiate_aipify_hosts_playbook", {
    p_playbook_key: playbookKey,
    p_property_id: propertyId ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function createAipifyHostsTaskFromTemplate(
  supabase: RpcClient,
  templateKey: string,
  propertyId?: string | null,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_aipify_hosts_task_from_template", {
    p_template_key: templateKey,
    p_property_id: propertyId ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
