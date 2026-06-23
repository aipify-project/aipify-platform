import type {
  CompanionChatState,
  EnqueueCompanionMessageInput,
  EnqueueCompanionMessageResult,
} from "./types";

export async function fetchCompanionChatState(
  conversationId: string,
): Promise<CompanionChatState> {
  const params = new URLSearchParams({ conversation_id: conversationId });
  const res = await fetch(`/api/aipify/companion/chat/state?${params}`);
  if (!res.ok) {
    return { ok: false, messages: [], queue: [], error: "fetch_failed" };
  }
  return (await res.json()) as CompanionChatState;
}

export async function enqueueCompanionMessage(
  input: EnqueueCompanionMessageInput,
): Promise<EnqueueCompanionMessageResult> {
  const res = await fetch("/api/aipify/companion/chat/enqueue", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      conversation_id: input.conversationId,
      idempotency_key: input.idempotencyKey,
      question: input.question,
      attachment_ids: input.attachmentIds ?? [],
      active_artifact_id: input.activeArtifactId ?? null,
      attachment_summaries: input.attachmentSummaries ?? [],
      locale: input.locale,
      pathname: input.pathname,
      platform_active_modules: input.platformActiveModules?.join(",") ?? null,
      title: input.title,
      companion_active: input.companionActive ?? true,
    }),
  });

  if (!res.ok) {
    return { ok: false, error: "enqueue_failed" };
  }

  return (await res.json()) as EnqueueCompanionMessageResult;
}

export async function cancelCompanionQueueItem(
  queueId: string,
  conversationId: string,
): Promise<boolean> {
  const res = await fetch("/api/aipify/companion/chat/cancel", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ queue_id: queueId, conversation_id: conversationId }),
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { ok?: boolean };
  return data.ok === true;
}

export async function retryCompanionQueueItem(
  queueId: string,
  conversationId: string,
): Promise<boolean> {
  const res = await fetch("/api/aipify/companion/chat/retry", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ queue_id: queueId, conversation_id: conversationId }),
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { ok?: boolean };
  return data.ok === true;
}

export async function triggerCompanionQueueProcess(
  conversationId: string,
  companionActive = true,
): Promise<void> {
  await fetch("/api/aipify/companion/chat/process", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      conversation_id: conversationId,
      companion_active: companionActive,
    }),
  });
}

export async function markCompanionConversationRead(conversationId: string): Promise<void> {
  await fetch("/api/aipify/companion/chat/read", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ conversation_id: conversationId }),
  });
}

export async function deleteCompanionConversation(conversationId: string): Promise<boolean> {
  const res = await fetch("/api/aipify/companion/chat/delete", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ conversation_id: conversationId }),
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { ok?: boolean };
  return data.ok === true;
}

export async function archiveCompanionConversation(conversationId: string): Promise<boolean> {
  const res = await fetch("/api/aipify/companion/chat/archive", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ conversation_id: conversationId }),
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { ok?: boolean };
  return data.ok === true;
}

export async function listCompanionConversations(): Promise<
  Array<{
    id: string;
    title?: string | null;
    preview?: string | null;
    updated_at?: string;
    unread_count?: number;
  }>
> {
  const res = await fetch("/api/aipify/companion/chat/conversations");
  if (!res.ok) return [];
  const data = (await res.json()) as { ok?: boolean; conversations?: unknown[] };
  if (!data.ok || !Array.isArray(data.conversations)) return [];
  return data.conversations as Array<{
    id: string;
    title?: string | null;
    preview?: string | null;
    updated_at?: string;
    unread_count?: number;
  }>;
}

export function createClientMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createIdempotencyKey(conversationId: string, clientMessageId: string): string {
  return `${conversationId}:${clientMessageId}`;
}
