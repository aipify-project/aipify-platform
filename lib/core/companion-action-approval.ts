/**
 * Companion Action Approval & Execution Framework — Phase 346.
 */

import type { RpcClient } from "./rpc-client";

export async function getCompanionActionCenter(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_companion_action_center");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function processCompanionActionRequest(
  supabase: RpcClient,
  payload: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("process_companion_action_request", {
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
