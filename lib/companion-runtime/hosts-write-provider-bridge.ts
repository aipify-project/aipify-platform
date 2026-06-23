import type { SupabaseClient } from "@supabase/supabase-js";
import {
  cleanupHostsProbeTask,
  cleanupMaintenanceProbeWorkOrder,
  executeCleaningTaskAssignViaProvider,
  executeHostTaskCreateViaProvider,
  executeMaintenanceTaskCreateViaProvider,
  lookupCleaningTaskForWrite,
  lookupHostTaskForWrite,
  lookupMaintenanceWorkOrderForWrite,
  resolveCleaningAssignTargets,
  type HostsWriteProviderRpcClient,
} from "@/lib/integration-intelligence/providers/aipify-hosts/hosts-write-provider-adapter";

function toRpcClient(supabase: SupabaseClient): HostsWriteProviderRpcClient {
  return {
    rpc: async (fn, params) => {
      const result = await supabase.rpc(fn, params ?? {});
      return { data: result.data, error: result.error };
    },
  };
}

export function createHostsWriteProviderBridge(supabase: SupabaseClient) {
  const client = toRpcClient(supabase);

  return {
    lookupHostTask: (taskId: string) => lookupHostTaskForWrite(client, taskId),
    lookupCleaningTask: (taskId: string) => lookupCleaningTaskForWrite(client, taskId),
    lookupMaintenanceWorkOrder: (workOrderId: string) =>
      lookupMaintenanceWorkOrderForWrite(client, workOrderId),
    resolveCleaningAssignTargets: () => resolveCleaningAssignTargets(client),
    createHostTask: (title: string) =>
      executeHostTaskCreateViaProvider({ client, title }),
    assignCleaningTask: (input: { cleaning_task_id: string; cleaner_id: string }) =>
      executeCleaningTaskAssignViaProvider({
        client,
        cleaning_task_id: input.cleaning_task_id,
        cleaner_id: input.cleaner_id,
      }),
    createMaintenanceTask: (description: string) =>
      executeMaintenanceTaskCreateViaProvider({ client, description }),
    cleanupHostTask: (taskId: string) => cleanupHostsProbeTask(client, taskId),
    cleanupMaintenanceWorkOrder: (workOrderId: string) =>
      cleanupMaintenanceProbeWorkOrder(client, workOrderId),
  };
}
