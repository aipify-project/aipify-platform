import type { HostsWriteExecutionResult } from "@/lib/integration-intelligence/hosts/action-outcomes";

export const HOST_TASK_CREATE_RPC = "create_aipify_hosts_task" as const;
export const HOST_TASK_CANCEL_RPC = "update_aipify_hosts_task_status" as const;
export const HOST_TASK_READ_RPC = "get_aipify_hosts_tasks_center_dashboard" as const;
export const CLEANING_ASSIGN_RPC = "perform_aipify_hosts_cleaning_action" as const;
export const CLEANING_READ_RPC = "get_aipify_hosts_cleaning_center_dashboard" as const;
export const MAINTENANCE_CREATE_RPC = "perform_aipify_hosts_maintenance_action" as const;
export const MAINTENANCE_CLOSE_RPC = "perform_aipify_hosts_maintenance_action" as const;
export const MAINTENANCE_READ_RPC = "get_aipify_hosts_maintenance_center_dashboard" as const;

export const P1_07_PROBE_MARKER = "[p1-07-e2e-probe]" as const;

export type HostsWriteProviderRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>,
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function asArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

function taskExistsInDashboard(dashboard: Record<string, unknown>, taskId: string): boolean {
  for (const bucket of ["active_tasks", "scheduled_tasks", "completed_tasks"] as const) {
    if (asArray(dashboard[bucket]).some((row) => String(row.id ?? "") === taskId)) {
      return true;
    }
  }
  return false;
}

function workOrderExistsInDashboard(dashboard: Record<string, unknown>, workOrderId: string): boolean {
  return asArray(dashboard.work_orders).some((row) => String(row.id ?? "") === workOrderId);
}

function cleaningTaskAssigned(dashboard: Record<string, unknown>, taskId: string, cleanerId: string): boolean {
  const row = asArray(dashboard.cleaning_tasks).find((entry) => String(entry.id ?? "") === taskId);
  if (!row) return false;
  return String(row.cleaner_id ?? "") === cleanerId || String(row.assigned_cleaner ?? "").length > 0;
}

export async function lookupHostTaskForWrite(
  client: HostsWriteProviderRpcClient,
  taskId: string,
): Promise<{ found: boolean }> {
  const { data, error } = await client.rpc(HOST_TASK_READ_RPC, { p_section: "active_tasks" });
  if (error) return { found: false };
  const dashboard = asRecord(data);
  if (!dashboard) return { found: false };
  return { found: taskExistsInDashboard(dashboard, taskId) };
}

async function readCleaningDashboard(
  client: HostsWriteProviderRpcClient,
  section: string,
): Promise<Record<string, unknown> | null> {
  const { data, error } = await client.rpc(CLEANING_READ_RPC, { p_section: section });
  if (error) return null;
  return asRecord(data);
}

export async function lookupCleaningTaskForWrite(
  client: HostsWriteProviderRpcClient,
  taskId: string,
): Promise<{ found: boolean }> {
  for (const section of ["active_cleaning_tasks", "todays_cleaning", "upcoming_cleaning"] as const) {
    const dashboard = await readCleaningDashboard(client, section);
    if (!dashboard) continue;
    if (asArray(dashboard.cleaning_tasks).some((row) => String(row.id ?? "") === taskId)) {
      return { found: true };
    }
  }
  return { found: false };
}

export async function lookupMaintenanceWorkOrderForWrite(
  client: HostsWriteProviderRpcClient,
  workOrderId: string,
): Promise<{ found: boolean }> {
  const { data, error } = await client.rpc(MAINTENANCE_READ_RPC, { p_section: "open_work_orders" });
  if (error) return { found: false };
  const dashboard = asRecord(data);
  if (!dashboard) return { found: false };
  return { found: workOrderExistsInDashboard(dashboard, workOrderId) };
}

export async function resolveCleaningAssignTargets(client: HostsWriteProviderRpcClient): Promise<{
  cleaning_task_id: string | null;
  cleaner_id: string | null;
  failure_reason: string | null;
}> {
  let cleaners: Record<string, unknown>[] = [];
  let cleaningTaskId: string | null = null;

  for (const section of ["todays_cleaning", "upcoming_cleaning", "active_cleaning_tasks"] as const) {
    const dashboard = await readCleaningDashboard(client, section);
    if (!dashboard) continue;

    if (cleaners.length === 0) {
      cleaners = asArray(dashboard.cleaners);
    }

    const tasks = asArray(dashboard.cleaning_tasks);
    const task =
      tasks.find(
        (row) =>
          !row.cleaner_id &&
          !["completed", "cancelled"].includes(String(row.cleaning_status ?? "")),
      ) ??
      tasks.find(
        (row) => !["completed", "cancelled"].includes(String(row.cleaning_status ?? "")),
      ) ??
      null;

    if (task?.id) {
      cleaningTaskId = String(task.id);
      break;
    }
  }

  const cleaner = cleaners.find((row) => row.cleaner_status === "active") ?? cleaners[0] ?? null;
  const cleanerId = cleaner?.id ? String(cleaner.id) : null;

  if (!cleaningTaskId || !cleanerId) {
    return {
      cleaning_task_id: cleaningTaskId,
      cleaner_id: cleanerId,
      failure_reason: "cleaning_assign_targets_unavailable",
    };
  }

  return { cleaning_task_id: cleaningTaskId, cleaner_id: cleanerId, failure_reason: null };
}

export async function createHostsProbeTask(
  client: HostsWriteProviderRpcClient,
  title: string,
): Promise<{ task_id: string | null; failure_reason: string | null }> {
  const { data, error } = await client.rpc(HOST_TASK_CREATE_RPC, {
    p_title: title,
    p_description: P1_07_PROBE_MARKER,
    p_property_id: null,
    p_category: "cleaning",
    p_priority: "low",
    p_assignee_role: null,
    p_assignee_name: null,
    p_due_date: null,
    p_scheduled_for: null,
    p_recurrence: null,
  });

  if (error) {
    return { task_id: null, failure_reason: error.message };
  }

  const record = asRecord(data);
  const taskId = record?.task_id ? String(record.task_id) : null;
  if (!taskId) {
    return { task_id: null, failure_reason: "create_task_missing_id" };
  }

  const lookup = await lookupHostTaskForWrite(client, taskId);
  if (!lookup.found) {
    return { task_id: null, failure_reason: "create_task_reread_missing" };
  }

  return { task_id: taskId, failure_reason: null };
}

export async function executeHostTaskCreateViaProvider(input: {
  client: HostsWriteProviderRpcClient;
  title: string;
}): Promise<HostsWriteExecutionResult & { entity_id?: string | null }> {
  const created = await createHostsProbeTask(input.client, input.title);
  if (!created.task_id) {
    return {
      executed: false,
      failure_reason: created.failure_reason,
      verified_after_reread: false,
      entity_id: null,
    };
  }

  return {
    executed: true,
    failure_reason: null,
    verified_after_reread: true,
    entity_id: created.task_id,
  };
}

export async function executeCleaningTaskAssignViaProvider(input: {
  client: HostsWriteProviderRpcClient;
  cleaning_task_id: string;
  cleaner_id: string;
}): Promise<HostsWriteExecutionResult> {
  const lookup = await lookupCleaningTaskForWrite(input.client, input.cleaning_task_id);
  if (!lookup.found) {
    return { executed: false, failure_reason: "cleaning_task_not_found", verified_after_reread: false };
  }

  const { data, error } = await input.client.rpc(CLEANING_ASSIGN_RPC, {
    p_action_type: "assign_cleaner",
    p_cleaning_task_id: input.cleaning_task_id,
    p_cleaner_id: input.cleaner_id,
    p_notes: null,
  });

  if (error) {
    return { executed: false, failure_reason: error.message, verified_after_reread: false };
  }

  const record = asRecord(data);
  if (record?.success !== true) {
    return { executed: false, failure_reason: "cleaning_assign_rpc_failed", verified_after_reread: false };
  }

  const { data: rereadData, error: rereadError } = await input.client.rpc(CLEANING_READ_RPC, {
    p_section: "active_cleaning_tasks",
  });
  if (rereadError) {
    const fallbackDashboard = await readCleaningDashboard(input.client, "todays_cleaning");
    if (!fallbackDashboard) {
      return { executed: false, failure_reason: "reread_failed", verified_after_reread: false };
    }
    const verified =
      cleaningTaskAssigned(fallbackDashboard, input.cleaning_task_id, input.cleaner_id);
    return {
      executed: verified,
      failure_reason: verified ? null : "cleaning_assign_reread_mismatch",
      verified_after_reread: verified,
    };
  }

  const dashboard = asRecord(rereadData);
  const verified =
    dashboard != null &&
    cleaningTaskAssigned(dashboard, input.cleaning_task_id, input.cleaner_id);

  if (!verified) {
    const fallbackDashboard = await readCleaningDashboard(input.client, "todays_cleaning");
    const fallbackVerified =
      fallbackDashboard != null &&
      cleaningTaskAssigned(fallbackDashboard, input.cleaning_task_id, input.cleaner_id);
    return {
      executed: fallbackVerified,
      failure_reason: fallbackVerified ? null : "cleaning_assign_reread_mismatch",
      verified_after_reread: fallbackVerified,
    };
  }

  return {
    executed: true,
    failure_reason: null,
    verified_after_reread: true,
  };
}

export async function executeMaintenanceTaskCreateViaProvider(input: {
  client: HostsWriteProviderRpcClient;
  description: string;
}): Promise<HostsWriteExecutionResult & { entity_id?: string | null }> {
  const notes = JSON.stringify({
    description: input.description,
    category: "general_repairs",
    priority: "low",
  });

  const { data, error } = await input.client.rpc(MAINTENANCE_CREATE_RPC, {
    p_action_type: "create_work_order",
    p_priority: "low",
    p_notes: notes,
  });

  if (error) {
    return {
      executed: false,
      failure_reason: error.message,
      verified_after_reread: false,
      entity_id: null,
    };
  }

  const record = asRecord(data);
  const workOrderId = record?.work_order_id ? String(record.work_order_id) : null;
  if (!workOrderId) {
    return {
      executed: false,
      failure_reason: "maintenance_create_missing_id",
      verified_after_reread: false,
      entity_id: null,
    };
  }

  const lookup = await lookupMaintenanceWorkOrderForWrite(input.client, workOrderId);
  return {
    executed: lookup.found,
    failure_reason: lookup.found ? null : "maintenance_reread_missing",
    verified_after_reread: lookup.found,
    entity_id: workOrderId,
  };
}

export async function cleanupHostsProbeTask(
  client: HostsWriteProviderRpcClient,
  taskId: string,
): Promise<{ cleaned: boolean; failure_reason: string | null }> {
  const { data, error } = await client.rpc(HOST_TASK_CANCEL_RPC, {
    p_task_id: taskId,
    p_status: "cancelled",
  });
  if (error) {
    return { cleaned: false, failure_reason: error.message };
  }
  const record = asRecord(data);
  return {
    cleaned: record?.success === true,
    failure_reason: record?.success === true ? null : "host_task_cleanup_failed",
  };
}

export async function cleanupMaintenanceProbeWorkOrder(
  client: HostsWriteProviderRpcClient,
  workOrderId: string,
): Promise<{ cleaned: boolean; failure_reason: string | null }> {
  const { data, error } = await client.rpc(MAINTENANCE_CLOSE_RPC, {
    p_action_type: "close_work_order",
    p_work_order_id: workOrderId,
    p_notes: P1_07_PROBE_MARKER,
  });
  if (error) {
    return { cleaned: false, failure_reason: error.message };
  }
  const record = asRecord(data);
  return {
    cleaned: record?.success === true,
    failure_reason: record?.success === true ? null : "maintenance_cleanup_failed",
  };
}
