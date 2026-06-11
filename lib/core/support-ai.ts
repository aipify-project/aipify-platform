/**
 * Support AI helpers (Phase A.7).
 * Authoritative enforcement lives in Supabase RPCs (_sai_*).
 */

export const SUPPORT_CASE_STATUSES = [
  "new",
  "open",
  "waiting_for_customer",
  "waiting_for_internal",
  "resolved",
  "closed",
] as const;
export type SupportCaseStatus = (typeof SUPPORT_CASE_STATUSES)[number];

export const SUPPORT_PRIORITIES = ["low", "medium", "high", "urgent"] as const;
export type SupportPriority = (typeof SUPPORT_PRIORITIES)[number];

export const SUPPORT_RESPONSE_MODES = ["automatic", "draft", "manual"] as const;
export type SupportResponseMode = (typeof SUPPORT_RESPONSE_MODES)[number];

export const SUPPORT_CHANNELS = [
  "support_widget",
  "admin_inbox",
  "email_support",
  "live_chat",
  "social_media",
  "messaging",
] as const;
export type SupportChannel = (typeof SUPPORT_CHANNELS)[number];

export const SATISFACTION_RATINGS = ["positive", "neutral", "negative"] as const;
export type SatisfactionRating = (typeof SATISFACTION_RATINGS)[number];

type SupportRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export function shouldEscalate(confidence: number, threshold = 0.65): boolean {
  return confidence < threshold;
}

export function isHighRiskTopic(text: string): boolean {
  return /billing|refund|legal|privacy|security breach|account suspension|chargeback|gdpr|lawsuit/i.test(
    text
  );
}

export async function createSupportCase(
  supabase: SupportRpcClient,
  params: {
    subject: string;
    customer_identifier?: string;
    channel?: SupportChannel;
    priority?: SupportPriority;
  }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_organization_support_case", {
    p_subject: params.subject,
    p_customer_identifier: params.customer_identifier ?? null,
    p_channel: params.channel ?? "admin_inbox",
    p_priority: params.priority ?? "medium",
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function suggestSupportResponse(
  supabase: SupportRpcClient,
  caseId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("suggest_support_ai_response", {
    p_case_id: caseId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function approveSupportDraft(
  supabase: SupportRpcClient,
  responseId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("approve_support_ai_response", {
    p_response_id: responseId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function sendSupportReply(
  supabase: SupportRpcClient,
  responseId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("send_support_reply", {
    p_response_id: responseId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function escalateSupportCase(
  supabase: SupportRpcClient,
  caseId: string,
  reason?: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("escalate_support_case", {
    p_case_id: caseId,
    p_reason: reason ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function closeSupportCase(
  supabase: SupportRpcClient,
  caseId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("close_organization_support_case", {
    p_case_id: caseId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function submitSupportSatisfaction(
  supabase: SupportRpcClient,
  caseId: string,
  rating: SatisfactionRating,
  comment?: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("submit_support_satisfaction", {
    p_case_id: caseId,
    p_rating: rating,
    p_comment: comment ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getSupportMetrics(
  supabase: SupportRpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_support_ai_metrics");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function detectKnowledgeGaps(
  supabase: SupportRpcClient
): Promise<Record<string, unknown>[]> {
  const { data, error } = await supabase.rpc("detect_support_knowledge_gaps");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>[] | null) ?? [];
}
