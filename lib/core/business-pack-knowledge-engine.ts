/**
 * Foundation 06 — Business Pack Knowledge Engine.
 */

import type { RpcClient } from "./rpc-client";

export async function getBusinessPackKnowledgeCenter(
  supabase: RpcClient,
  params: {
    packKey: string;
    locale?: string;
    search?: string | null;
    category?: string | null;
    contextSurface?: string | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_business_pack_knowledge_center", {
    p_pack_key: params.packKey,
    p_locale: params.locale ?? "en",
    p_search: params.search ?? null,
    p_category: params.category ?? null,
    p_context_surface: params.contextSurface ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getBusinessPackKnowledgeEngineDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_business_pack_knowledge_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getBusinessPackKnowledgeEngineCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_business_pack_knowledge_engine_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performBusinessPackKnowledgeAction(
  supabase: RpcClient,
  params: {
    actionType: string;
    packKey?: string | null;
    payload?: Record<string, unknown>;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("perform_business_pack_knowledge_action", {
    p_action_type: params.actionType,
    p_pack_key: params.packKey ?? null,
    p_payload: params.payload ?? {},
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
