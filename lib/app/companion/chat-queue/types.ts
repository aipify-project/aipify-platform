import type { CompanionChatAttachmentSummary, CompanionChatMessage } from "../types";

export type CompanionQueueStatus =
  | "waiting"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"
  | "timed_out";

export type CompanionQueueItem = {
  id: string;
  status: CompanionQueueStatus;
  question_text: string;
  queue_position: number;
  error_message?: string | null;
  error_code?: string | null;
  route_type?: string | null;
  created_at?: string;
  started_at?: string | null;
  completed_at?: string | null;
  cancel_requested?: boolean;
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
  timezone?: string;
};

export type EnqueueCompanionMessageResult = {
  ok: boolean;
  execution?: "direct" | "queued";
  submit_path?: string;
  route?: string;
  queue_id?: string;
  queue_position?: number;
  deduplicated?: boolean;
  user_message_id?: string;
  assistant_message_id?: string;
  duration_ms?: number;
  worker_dispatch?: "scheduled" | "completed" | "unavailable" | string;
  error?: string;
};

/** Persisted pending booking write handoff — action_request_id pointer only (P1.12C2A). */
export type CompanionPendingBookingWriteHandoff = {
  action_request_id: string;
};

/** Persisted pending booking clarification draft (P1.12C3ZH). */
export type CompanionPendingBookingClarificationHandoff =
  import("@/lib/companion-runtime/booking-pending-action-pointer").PendingBookingClarificationWire;

export type CompanionAssistantPayload = Omit<
  CompanionChatMessage,
  | "id"
  | "role"
  | "content"
  | "timestamp"
  | "responseToMessageId"
  | "queueId"
  | "requestId"
  | "pendingBookingWrite"
  | "pendingBookingClarification"
> & {
  kind: "assistant_reply";
  response_to_message_id?: string | null;
  queue_id?: string | null;
  request_id?: string | null;
  execution?: string;
  route?: string;
  pending_booking_write?: CompanionPendingBookingWriteHandoff | null;
  pending_booking_clarification?: CompanionPendingBookingClarificationHandoff | null;
};
