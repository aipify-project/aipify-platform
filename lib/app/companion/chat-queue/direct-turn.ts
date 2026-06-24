import type { SupabaseClient } from "@supabase/supabase-js";
import {
  classifyCompanionSubmitPath,
  resolveDirectTurnRoute,
} from "@/lib/companion-runtime/companion-submit-path";
import { buildDirectDateTimeAnswer } from "@/lib/companion-runtime/direct-datetime-answer";
import { coerceToCustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import { executeCompanionTurnToPayload } from "./execute-turn";
import { executeDirectOrganizationOrFoundationTurn } from "./direct-organization-turn";

export const COMPANION_DIRECT_EXACT_SOURCE_TIMEOUT_MS = 5_000;

export type ExecuteDirectCompanionTurnInput = {
  conversationId: string;
  idempotencyKey: string;
  question: string;
  locale: string;
  pathname?: string | null;
  title?: string | null;
  timeZone?: string | null;
  platformActiveModules?: string[];
  attachmentIds?: string[];
  activeArtifactId?: string | null;
  attachmentSummaries?: unknown[];
  requestId?: string;
};

export type ExecuteDirectCompanionTurnResult =
  | {
      ok: true;
      execution: "direct";
      route: string;
      user_message_id?: string;
      assistant_message_id?: string;
      response_to_message_id?: string;
      deduplicated?: boolean;
      duration_ms: number;
      capability?: string;
    }
  | {
      ok: false;
      error: string;
      should_queue?: boolean;
      route?: string;
      duration_ms?: number;
    };

function parseClientMessageId(idempotencyKey: string): string {
  const parts = idempotencyKey.split(":");
  return parts[parts.length - 1] ?? idempotencyKey;
}

async function findAssistantForUserMessage(
  supabase: SupabaseClient,
  conversationId: string,
  userMessageId: string,
): Promise<{ id: string; response_to_message_id?: string } | null> {
  const { data, error } = await supabase.rpc("get_companion_chat_state", {
    p_conversation_id: conversationId,
  });
  if (error || !data || typeof data !== "object") return null;

  const payload = data as {
    messages?: Array<{
      id?: string;
      role?: string;
      sequence_no?: number;
      payload?: Record<string, unknown>;
    }>;
  };
  const messages = Array.isArray(payload.messages) ? payload.messages : [];
  const userMessage = messages.find((message) => message.id === userMessageId);
  if (!userMessage?.sequence_no) return null;

  const linked = messages.find(
    (message) =>
      message.role === "assistant" &&
      message.payload?.response_to_message_id === userMessageId,
  );
  if (linked?.id) {
    return {
      id: String(linked.id),
      response_to_message_id: userMessageId,
    };
  }

  const assistant = messages.find(
    (message) =>
      message.role === "assistant" &&
      typeof message.sequence_no === "number" &&
      message.sequence_no > userMessage.sequence_no!,
  );

  return assistant?.id ? { id: String(assistant.id), response_to_message_id: userMessageId } : null;
}

async function runTurnWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
): Promise<{ ok: true; value: T } | { ok: false; timedOut: true }> {
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
  try {
    const result = await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timeoutHandle = setTimeout(() => reject(new Error("turn_timeout")), timeoutMs);
      }),
    ]);
    return { ok: true, value: result };
  } catch {
    return { ok: false, timedOut: true };
  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle);
  }
}

export async function executeDirectCompanionTurn(
  supabase: SupabaseClient,
  input: ExecuteDirectCompanionTurnInput,
): Promise<ExecuteDirectCompanionTurnResult> {
  const started = Date.now();
  const question = input.question.trim();
  const localeActive = coerceToCustomerActiveLocale(input.locale);
  const clientMessageId = parseClientMessageId(input.idempotencyKey);
  const timeZone = input.timeZone?.trim() || "UTC";

  const { error: upsertError } = await supabase.rpc("upsert_companion_conversation", {
    p_conversation_id: input.conversationId,
    p_title: input.title ?? (question.slice(0, 120) || null),
    p_locale: input.locale ?? null,
    p_pathname: input.pathname ?? null,
  });

  if (upsertError) {
    return { ok: false, error: upsertError.message, duration_ms: Date.now() - started };
  }

  const { data: userAppend, error: userAppendError } = await supabase.rpc(
    "append_companion_chat_message",
    {
      p_conversation_id: input.conversationId,
      p_role: "user",
      p_content: question,
      p_payload: {
        attachments: input.attachmentSummaries ?? [],
        activeArtifactId: input.activeArtifactId ?? null,
        execution: "direct",
        request_id: input.requestId ?? null,
        client_message_id: clientMessageId,
      },
      p_client_message_id: clientMessageId,
    },
  );

  if (userAppendError) {
    return { ok: false, error: userAppendError.message, duration_ms: Date.now() - started };
  }

  const userPayload =
    userAppend && typeof userAppend === "object"
      ? (userAppend as Record<string, unknown>)
      : null;
  const userMessageId =
    typeof userPayload?.message_id === "string" ? userPayload.message_id : undefined;
  const userDeduplicated = userPayload?.deduplicated === true;

  if (userDeduplicated && userMessageId) {
    const existingAssistant = await findAssistantForUserMessage(
      supabase,
      input.conversationId,
      userMessageId,
    );
    if (existingAssistant) {
      return {
        ok: true,
        execution: "direct",
        route: "deduplicated",
        user_message_id: userMessageId,
        assistant_message_id: existingAssistant.id,
        response_to_message_id: userMessageId,
        deduplicated: true,
        duration_ms: Date.now() - started,
      };
    }
  }

  const directRoute = resolveDirectTurnRoute(question, localeActive);
  let assistantContent = "";
  let assistantPayload: Record<string, unknown> = {
    kind: "assistant_reply",
    execution: "direct",
    request_id: input.requestId ?? null,
    response_to_message_id: userMessageId ?? null,
  };
  let capability: string | undefined;

  if (directRoute === "datetime") {
    const datetimeAnswer = buildDirectDateTimeAnswer({
      query: question,
      locale: input.locale,
      timeZone,
    });
    if (!datetimeAnswer?.directAnswer) {
      return {
        ok: false,
        error: "datetime_unresolved",
        should_queue: true,
        route: "datetime",
        duration_ms: Date.now() - started,
      };
    }

    assistantContent = datetimeAnswer.directAnswer;
    assistantPayload = {
      kind: "assistant_reply",
      directAnswer: datetimeAnswer.directAnswer,
      execution: "direct",
      route: "datetime",
      request_id: input.requestId ?? null,
      response_to_message_id: userMessageId ?? null,
      sourceId: datetimeAnswer.sourceId,
      confidence: datetimeAnswer.confidence,
      question,
    };
    capability = datetimeAnswer.sourceId ?? "direct.datetime";
  } else if (directRoute === "lightweight") {
    const turnResult = await runTurnWithTimeout(
      executeCompanionTurnToPayload(supabase, {
        query: question,
        locale: input.locale,
        conversationId: input.conversationId,
        turnRoute: "lightweight",
      }),
      3_000,
    );

    if (!turnResult.ok) {
      return {
        ok: false,
        error: "turn_timeout",
        route: "lightweight",
        duration_ms: Date.now() - started,
      };
    }

    if (!turnResult.value.ok) {
      return {
        ok: false,
        error: turnResult.value.error,
        route: "lightweight",
        duration_ms: Date.now() - started,
      };
    }

    assistantContent = turnResult.value.assistantContent;
    assistantPayload = {
      ...(turnResult.value.assistantPayload as Record<string, unknown>),
      execution: "direct",
      route: "lightweight",
      request_id: input.requestId ?? null,
      response_to_message_id: userMessageId ?? null,
    };
    capability = "direct.lightweight";
  } else {
    const turnTimeoutMs =
      directRoute === "exact_source" ? COMPANION_DIRECT_EXACT_SOURCE_TIMEOUT_MS : 5_000;

    const turnResult = await runTurnWithTimeout(
      executeDirectOrganizationOrFoundationTurn(supabase, {
        query: question,
        locale: input.locale,
        conversationId: input.conversationId,
        route: directRoute,
      }),
      turnTimeoutMs,
    );

    if (!turnResult.ok) {
      return {
        ok: false,
        error: "turn_timeout",
        should_queue: directRoute === "exact_source" || directRoute === "foundation",
        route: directRoute,
        duration_ms: Date.now() - started,
      };
    }

    if (!turnResult.value.ok) {
      return {
        ok: false,
        error: turnResult.value.error,
        should_queue: turnResult.value.should_queue === true,
        route: turnResult.value.route,
        duration_ms: Date.now() - started,
      };
    }

    assistantContent = turnResult.value.assistantContent;
    assistantPayload = {
      ...turnResult.value.assistantPayload,
      execution: "direct",
      request_id: input.requestId ?? null,
      response_to_message_id: userMessageId ?? null,
    };
    capability = turnResult.value.capability;
  }

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

  if (assistantAppendError) {
    return {
      ok: false,
      error: assistantAppendError.message,
      duration_ms: Date.now() - started,
    };
  }

  const assistantPayloadResult =
    assistantAppend && typeof assistantAppend === "object"
      ? (assistantAppend as Record<string, unknown>)
      : null;

  return {
    ok: true,
    execution: "direct",
    route: String(directRoute),
    user_message_id: userMessageId,
    assistant_message_id:
      typeof assistantPayloadResult?.message_id === "string"
        ? assistantPayloadResult.message_id
        : undefined,
    response_to_message_id: userMessageId,
    capability,
    duration_ms: Date.now() - started,
  };
}

export function shouldExecuteDirectCompanionTurn(
  query: string,
  locale: string,
  options: { hasAttachments?: boolean; hasActiveArtifact?: boolean } = {},
): boolean {
  const path = classifyCompanionSubmitPath(query, coerceToCustomerActiveLocale(locale), options);
  return path === "direct" || path === "direct_exact_source_or_queue";
}

export function resolveDirectReason(
  query: string,
  locale: string,
  options: { hasAttachments?: boolean; hasActiveArtifact?: boolean } = {},
): string {
  const path = classifyCompanionSubmitPath(query, coerceToCustomerActiveLocale(locale), options);
  const route = resolveDirectTurnRoute(query, coerceToCustomerActiveLocale(locale), options);
  return `${path}:${route}`;
}
