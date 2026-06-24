import type { SupabaseClient } from "@supabase/supabase-js";
import { buildDirectDateTimeAnswer } from "@/lib/companion-runtime/direct-datetime-answer";
import { resolveDirectDateTimeKind } from "@/lib/companion-runtime/direct-datetime-kind";

export type DirectDateTimeTurnStageTimings = {
  upsert_conversation_ms: number;
  append_user_ms: number;
  build_answer_ms: number;
  append_assistant_ms: number;
  total_ms: number;
};

export type ExecuteDirectDateTimeTurnInput = {
  conversationId: string;
  idempotencyKey: string;
  question: string;
  locale: string;
  timeZone: string;
  requestId?: string;
};

export type ExecuteDirectDateTimeTurnResult =
  | {
      ok: true;
      route: "datetime";
      user_message_id: string;
      assistant_message_id: string;
      response_to_message_id: string;
      deduplicated?: boolean;
      assistant_content: string;
      capability: string;
      stage_timings: DirectDateTimeTurnStageTimings;
    }
  | {
      ok: false;
      error: string;
      stage_timings: DirectDateTimeTurnStageTimings;
    };

function parseClientMessageId(idempotencyKey: string): string {
  const parts = idempotencyKey.split(":");
  return parts[parts.length - 1] ?? idempotencyKey;
}

async function findAssistantForUserMessage(
  supabase: SupabaseClient,
  conversationId: string,
  userMessageId: string,
): Promise<{ id: string } | null> {
  const { data, error } = await supabase.rpc("get_companion_chat_state", {
    p_conversation_id: conversationId,
  });
  if (error || !data || typeof data !== "object") return null;

  const payload = data as {
    messages?: Array<{
      id?: string;
      role?: string;
      payload?: Record<string, unknown>;
    }>;
  };
  const messages = Array.isArray(payload.messages) ? payload.messages : [];
  const linked = messages.find(
    (message) =>
      message.role === "assistant" &&
      message.payload?.response_to_message_id === userMessageId,
  );
  return linked?.id ? { id: String(linked.id) } : null;
}

export async function executeDirectDateTimeTurn(
  supabase: SupabaseClient,
  input: ExecuteDirectDateTimeTurnInput,
): Promise<ExecuteDirectDateTimeTurnResult> {
  const started = Date.now();
  const timings: DirectDateTimeTurnStageTimings = {
    upsert_conversation_ms: 0,
    append_user_ms: 0,
    build_answer_ms: 0,
    append_assistant_ms: 0,
    total_ms: 0,
  };

  const question = input.question.trim();
  const clientMessageId = parseClientMessageId(input.idempotencyKey);
  const timeZone = input.timeZone.trim() || "UTC";
  const kind = resolveDirectDateTimeKind(question);

  if (!kind) {
    timings.total_ms = Date.now() - started;
    return { ok: false, error: "datetime_unresolved", stage_timings: timings };
  }

  const upsertStarted = Date.now();
  const { error: upsertError } = await supabase.rpc("upsert_companion_conversation", {
    p_conversation_id: input.conversationId,
    p_title: null,
    p_locale: input.locale ?? null,
    p_pathname: null,
  });
  timings.upsert_conversation_ms = Date.now() - upsertStarted;

  if (upsertError) {
    timings.total_ms = Date.now() - started;
    return { ok: false, error: upsertError.message, stage_timings: timings };
  }

  const appendUserStarted = Date.now();
  const { data: userAppend, error: userAppendError } = await supabase.rpc(
    "append_companion_chat_message",
    {
      p_conversation_id: input.conversationId,
      p_role: "user",
      p_content: question,
      p_payload: {
        execution: "direct",
        route: "datetime",
        request_id: input.requestId ?? null,
        client_message_id: clientMessageId,
      },
      p_client_message_id: clientMessageId,
    },
  );
  timings.append_user_ms = Date.now() - appendUserStarted;

  if (userAppendError) {
    timings.total_ms = Date.now() - started;
    return { ok: false, error: userAppendError.message, stage_timings: timings };
  }

  const userPayload =
    userAppend && typeof userAppend === "object"
      ? (userAppend as Record<string, unknown>)
      : null;
  const userMessageId =
    typeof userPayload?.message_id === "string" ? userPayload.message_id : null;
  if (!userMessageId) {
    timings.total_ms = Date.now() - started;
    return { ok: false, error: "user_message_missing", stage_timings: timings };
  }

  if (userPayload?.deduplicated === true) {
    const existingAssistant = await findAssistantForUserMessage(
      supabase,
      input.conversationId,
      userMessageId,
    );
    if (existingAssistant) {
      timings.total_ms = Date.now() - started;
      return {
        ok: true,
        route: "datetime",
        user_message_id: userMessageId,
        assistant_message_id: existingAssistant.id,
        response_to_message_id: userMessageId,
        deduplicated: true,
        assistant_content: "",
        capability: `companion-direct-${kind}`,
        stage_timings: timings,
      };
    }
  }

  const buildStarted = Date.now();
  const datetimeAnswer = buildDirectDateTimeAnswer({
    query: question,
    locale: input.locale,
    timeZone,
  });
  timings.build_answer_ms = Date.now() - buildStarted;

  if (!datetimeAnswer?.directAnswer) {
    timings.total_ms = Date.now() - started;
    return { ok: false, error: "datetime_unresolved", stage_timings: timings };
  }

  const assistantContent = datetimeAnswer.directAnswer;
  const assistantPayload = {
    kind: "assistant_reply",
    directAnswer: assistantContent,
    execution: "direct",
    route: "datetime",
    request_id: input.requestId ?? null,
    response_to_message_id: userMessageId,
    sourceId: datetimeAnswer.sourceId,
    confidence: datetimeAnswer.confidence,
    question,
  };

  const appendAssistantStarted = Date.now();
  const { data: assistantAppend, error: assistantAppendError } = await supabase.rpc(
    "append_companion_chat_message",
    {
      p_conversation_id: input.conversationId,
      p_role: "assistant",
      p_content: assistantContent,
      p_payload: assistantPayload,
      p_client_message_id: `${clientMessageId}:assistant`,
    },
  );
  timings.append_assistant_ms = Date.now() - appendAssistantStarted;

  if (assistantAppendError) {
    timings.total_ms = Date.now() - started;
    return { ok: false, error: assistantAppendError.message, stage_timings: timings };
  }

  const assistantPayloadResult =
    assistantAppend && typeof assistantAppend === "object"
      ? (assistantAppend as Record<string, unknown>)
      : null;
  const assistantMessageId =
    typeof assistantPayloadResult?.message_id === "string"
      ? assistantPayloadResult.message_id
      : null;

  if (!assistantMessageId) {
    timings.total_ms = Date.now() - started;
    return { ok: false, error: "assistant_message_missing", stage_timings: timings };
  }

  timings.total_ms = Date.now() - started;

  return {
    ok: true,
    route: "datetime",
    user_message_id: userMessageId,
    assistant_message_id: assistantMessageId,
    response_to_message_id: userMessageId,
    assistant_content: assistantContent,
    capability: `companion-direct-${kind}`,
    stage_timings: timings,
  };
}
