import type { SupabaseClient } from "@supabase/supabase-js";

export type CompanionWorkerCompleteGuardResult =
  | {
      ok: true;
      user_message_id: string | null;
      user_client_message_id: string | null;
      conversation_id: string;
      tenant_id: string;
    }
  | { ok: false; reason: string };

type QueueGuardRow = {
  id: string;
  conversation_id: string;
  tenant_id: string;
  user_id: string;
  status: string;
  user_client_message_id: string | null;
  result_message_id: string | null;
  cancel_requested_at: string | null;
  dismissed_at: string | null;
  lease_owner: string | null;
  question_text: string;
};

export async function validateCompanionWorkerJobBeforeComplete(
  supabase: SupabaseClient,
  queueId: string,
  workerId: string,
): Promise<CompanionWorkerCompleteGuardResult> {
  const { data: row, error } = await supabase
    .from("companion_message_queue")
    .select(
      "id, conversation_id, tenant_id, user_id, status, user_client_message_id, result_message_id, cancel_requested_at, dismissed_at, lease_owner, question_text",
    )
    .eq("id", queueId)
    .maybeSingle();

  if (error || !row) {
    return { ok: false, reason: "queue_row_missing" };
  }

  const job = row as QueueGuardRow;

  if (job.status !== "processing") {
    return { ok: false, reason: `status_${job.status}` };
  }

  if (job.lease_owner && job.lease_owner !== workerId) {
    return { ok: false, reason: "lease_owner_mismatch" };
  }

  if (job.cancel_requested_at || job.dismissed_at) {
    return { ok: false, reason: "cancelled_or_dismissed" };
  }

  if (job.result_message_id) {
    return { ok: false, reason: "assistant_already_recorded" };
  }

  const { data: conv } = await supabase
    .from("companion_conversations")
    .select("id, deleted_at")
    .eq("id", job.conversation_id)
    .eq("tenant_id", job.tenant_id)
    .eq("user_id", job.user_id)
    .maybeSingle();

  if (!conv || conv.deleted_at) {
    return { ok: false, reason: "conversation_missing" };
  }

  let userMessageId: string | null = null;
  if (job.user_client_message_id) {
    const { data: userMsg } = await supabase
      .from("companion_chat_messages")
      .select("id, conversation_id, role, content, sequence_no")
      .eq("conversation_id", job.conversation_id)
      .eq("client_message_id", job.user_client_message_id)
      .maybeSingle();

    if (!userMsg || userMsg.role !== "user") {
      return { ok: false, reason: "user_message_missing" };
    }

    if (String(userMsg.content).trim() !== String(job.question_text).trim()) {
      return { ok: false, reason: "user_message_mismatch" };
    }

    userMessageId = String(userMsg.id);

    const { data: laterAssistant } = await supabase
      .from("companion_chat_messages")
      .select("id, payload, sequence_no")
      .eq("conversation_id", job.conversation_id)
      .eq("role", "assistant")
      .gt("sequence_no", userMsg.sequence_no)
      .order("sequence_no", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (laterAssistant?.id) {
      const payload =
        laterAssistant.payload && typeof laterAssistant.payload === "object"
          ? (laterAssistant.payload as Record<string, unknown>)
          : null;
      if (payload?.response_to_message_id === userMessageId) {
        return { ok: false, reason: "response_already_linked" };
      }
    }
  }

  return {
    ok: true,
    user_message_id: userMessageId,
    user_client_message_id: job.user_client_message_id,
    conversation_id: job.conversation_id,
    tenant_id: job.tenant_id,
  };
}
