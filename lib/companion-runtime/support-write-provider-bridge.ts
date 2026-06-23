import type { SupabaseClient } from "@supabase/supabase-js";
import {
  createSupportWriteProviderClient,
  executeSupportCaseAssignViaProvider,
  executeSupportCaseEscalateViaProvider,
  lookupSupportCaseForWrite,
  type SupportWriteProviderRpcClient,
} from "@/lib/integration-intelligence/providers/support-operations/support-write-provider-adapter";

function toRpcClient(supabase: SupabaseClient): SupportWriteProviderRpcClient {
  return createSupportWriteProviderClient({
    rpc: async (fn, params) => {
      const result = await supabase.rpc(fn, params ?? {});
      return { data: result.data, error: result.error };
    },
  });
}

export function createSupportWriteProviderBridge(supabase: SupabaseClient) {
  const client = toRpcClient(supabase);

  return {
    lookupCase: (caseId: string) => lookupSupportCaseForWrite(client, caseId),
    assignCase: (input: { case_id: string; assignee_user_id: string }) =>
      executeSupportCaseAssignViaProvider({
        client,
        case_id: input.case_id,
        assignee_user_id: input.assignee_user_id,
      }),
    escalateCase: (input: { case_id: string; escalation_reason: string }) =>
      executeSupportCaseEscalateViaProvider({
        client,
        case_id: input.case_id,
        escalation_reason: input.escalation_reason,
      }),
  };
}

export async function resolveSupportAssigneeUserId(
  supabase: SupabaseClient,
  authUserId: string,
): Promise<string | null> {
  const { data } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", authUserId)
    .limit(1)
    .maybeSingle();

  return typeof data?.id === "string" ? data.id : null;
}
