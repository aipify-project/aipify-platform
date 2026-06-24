import type { CompanionChatAttachmentSummary, CompanionChatMessage } from "../types";

export type CompanionQueueStatus =
  | "waiting"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export type CompanionQueueItem = {
  id: string;
  status: CompanionQueueStatus;
  question_text: string;
  queue_position: number;
  error_message?: string | null;
  error_code?: string | null;
  created_at?: string;
  started_at?: string | null;
  completed_at?: string | null;
};

export type CompanionServerMessage = {
  id: string;
  server_id?: string;
  role: "user" | "assistant";
  content: string;
  payload?: Record<string, unknown>;
  sequence_no?: number;
  timestamp?: number;
  feedback_type?: "helpful" | "not_helpful" | "org_confirm" | null;
};

export type CompanionChatState = {
  ok: boolean;
  conversation?: {
    id: string;
    title?: string | null;
    locale?: string | null;
    pathname?: string | null;
    unread_count?: number;
    updated_at?: string;
  } | null;
  messages: CompanionServerMessage[];
  queue: CompanionQueueItem[];
  error?: string;
};

export type EnqueueCompanionMessageInput = {
  conversationId: string;
  idempotencyKey: string;
  question: string;
  attachmentIds?: string[];
  activeArtifactId?: string | null;
  attachmentSummaries?: CompanionChatAttachmentSummary[];
  locale: string;
  pathname: string;
  platformActiveModules?: string[];
  title?: string;
  companionActive?: boolean;
};

export type EnqueueCompanionMessageResult = {
  ok: boolean;
  queue_id?: string;
  queue_position?: number;
  deduplicated?: boolean;
  worker_dispatch?: "scheduled" | "unavailable";
  error?: string;
};

export type CompanionAssistantPayload = Omit<
  CompanionChatMessage,
  "id" | "role" | "content" | "timestamp"
> & {
  kind: "assistant_reply";
};
