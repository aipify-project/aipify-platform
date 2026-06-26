import type { SupabaseClient } from "@supabase/supabase-js";
import type { CompanionChatMessage } from "../types";
import { mapServerMessagesToChat } from "./message-payload";
import type { CompanionServerMessage } from "./types";

export type LoadCompanionConversationMessagesResult =
  | { status: "loaded"; messages: CompanionChatMessage[] }
  | { status: "failed"; messages: [] };

export type LoadCompanionConversationMessagesDeps = {
  rpc?: (
    supabase: SupabaseClient,
    conversationId: string,
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
  mapMessages?: typeof mapServerMessagesToChat;
};

function normalizeCompanionConversationId(conversationId: string): string | null {
  const trimmed = conversationId.trim();
  if (!trimmed) {
    return null;
  }
  return trimmed;
}

function isCompanionServerMessage(value: unknown): value is CompanionServerMessage {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const row = value as Record<string, unknown>;
  return (
    typeof row.id === "string" &&
    typeof row.role === "string" &&
    typeof row.content === "string"
  );
}

function parseChatStateMessages(raw: unknown): CompanionServerMessage[] | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return null;
  }

  const record = raw as Record<string, unknown>;
  if (record.ok !== true) {
    return null;
  }

  if (!Array.isArray(record.messages)) {
    return null;
  }

  const messages: CompanionServerMessage[] = [];
  for (const entry of record.messages) {
    if (!isCompanionServerMessage(entry)) {
      return null;
    }
    messages.push(entry);
  }

  return messages;
}

export async function loadCompanionConversationMessages(
  supabase: SupabaseClient,
  conversationId: string,
  deps: LoadCompanionConversationMessagesDeps = {},
): Promise<LoadCompanionConversationMessagesResult> {
  const normalizedId = normalizeCompanionConversationId(conversationId);
  if (!normalizedId) {
    return { status: "failed", messages: [] };
  }

  const rpc =
    deps.rpc ??
    (async (client, id) =>
      client.rpc("get_companion_chat_state", { p_conversation_id: id }));

  const { data, error } = await rpc(supabase, normalizedId);
  if (error) {
    return { status: "failed", messages: [] };
  }

  const serverMessages = parseChatStateMessages(data);
  if (serverMessages === null) {
    return { status: "failed", messages: [] };
  }

  const mapMessages = deps.mapMessages ?? mapServerMessagesToChat;
  return {
    status: "loaded",
    messages: mapMessages(serverMessages),
  };
}
