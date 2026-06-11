/**
 * Self-Support Engine helpers (Phase A.12).
 * Authoritative enforcement lives in Supabase RPCs (_sse_*).
 */

export const SELF_SUPPORT_CONFIDENCE_LEVELS = ["high", "medium", "low"] as const;
export type SelfSupportConfidenceLevel = (typeof SELF_SUPPORT_CONFIDENCE_LEVELS)[number];

export const SELF_SUPPORT_RESPONSE_MODES = ["automatic", "draft", "escalated"] as const;
export type SelfSupportResponseMode = (typeof SELF_SUPPORT_RESPONSE_MODES)[number];

export const SELF_SUPPORT_CHANNELS = [
  "support_widget",
  "dashboard",
  "knowledge_search",
  "email",
  "messaging",
  "voice",
] as const;
export type SelfSupportChannel = (typeof SELF_SUPPORT_CHANNELS)[number];

export const SELF_SUPPORT_CONVERSATION_STATUSES = ["active", "escalated", "resolved", "closed"] as const;
export type SelfSupportConversationStatus = (typeof SELF_SUPPORT_CONVERSATION_STATUSES)[number];

export const SELF_SUPPORT_FEEDBACK_RATINGS = ["helpful", "unhelpful"] as const;
export type SelfSupportFeedbackRating = (typeof SELF_SUPPORT_FEEDBACK_RATINGS)[number];

type SelfSupportRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export function shouldEscalateSelfSupport(confidence: number, threshold = 0.5): boolean {
  return confidence < threshold;
}

export function confidenceLevelFromScore(score: number): SelfSupportConfidenceLevel {
  if (score >= 0.8) return "high";
  if (score >= 0.5) return "medium";
  return "low";
}

export function isSensitiveSelfSupportTopic(text: string): boolean {
  return /billing|refund|legal|privacy|security breach|account suspension|chargeback|gdpr|password reset|account access|invoice/i.test(
    text
  );
}

export async function createSelfSupportConversation(
  supabase: SelfSupportRpcClient,
  params: { subject: string; channel?: SelfSupportChannel }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_self_support_conversation", {
    p_subject: params.subject,
    p_channel: params.channel ?? "dashboard",
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function askSelfSupport(
  supabase: SelfSupportRpcClient,
  conversationId: string,
  question: string,
  requestHuman = false
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("ask_self_support", {
    p_conversation_id: conversationId,
    p_question: question,
    p_request_human: requestHuman,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function searchSelfSupportKnowledge(
  supabase: SelfSupportRpcClient,
  query: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("search_self_support_knowledge", {
    p_query: query,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function escalateSelfSupportConversation(
  supabase: SelfSupportRpcClient,
  conversationId: string,
  reason?: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("escalate_self_support_conversation", {
    p_conversation_id: conversationId,
    p_reason: reason ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function closeSelfSupportConversation(
  supabase: SelfSupportRpcClient,
  conversationId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("close_self_support_conversation", {
    p_conversation_id: conversationId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function submitSelfSupportFeedback(
  supabase: SelfSupportRpcClient,
  params: {
    conversation_id: string;
    rating: SelfSupportFeedbackRating;
    message_id?: string;
    comment?: string;
    improvement_suggestion?: string;
  }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("submit_self_support_feedback", {
    p_conversation_id: params.conversation_id,
    p_rating: params.rating,
    p_message_id: params.message_id ?? null,
    p_comment: params.comment ?? null,
    p_improvement_suggestion: params.improvement_suggestion ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function detectSelfSupportKnowledgeGaps(
  supabase: SelfSupportRpcClient
): Promise<Record<string, unknown>[]> {
  const { data, error } = await supabase.rpc("detect_self_support_knowledge_gaps");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>[] | null) ?? [];
}

export async function getSelfSupportConversations(
  supabase: SelfSupportRpcClient
): Promise<Record<string, unknown>[]> {
  const { data, error } = await supabase.rpc("get_self_support_conversations");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>[] | null) ?? [];
}
