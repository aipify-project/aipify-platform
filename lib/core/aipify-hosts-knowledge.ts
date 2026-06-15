/**
 * Aipify Hosts — Knowledge Center & Self-Service (Phase Airbnb 11).
 * Authoritative enforcement lives in Supabase RPCs (_ahostss_*).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getAipifyHostsKnowledgeDashboard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_knowledge_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsKnowledgeCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_knowledge_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function searchAipifyHostsKnowledge(
  supabase: RpcClient,
  query: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("search_aipify_hosts_knowledge", { p_query: query });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsKnowledgeArticle(
  supabase: RpcClient,
  slug: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_knowledge_article", { p_slug: slug });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function recordAipifyHostsKnowledgeView(
  supabase: RpcClient,
  slug: string,
  title: string,
  sectionKey?: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("record_aipify_hosts_knowledge_view", {
    p_slug: slug,
    p_title: title,
    p_section_key: sectionKey ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function markAipifyHostsKnowledgeHelpful(
  supabase: RpcClient,
  slug: string,
  helpful = true,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("mark_aipify_hosts_knowledge_helpful", {
    p_slug: slug,
    p_helpful: helpful,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
