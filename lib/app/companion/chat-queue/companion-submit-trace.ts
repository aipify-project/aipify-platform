export type CompanionSubmitStageTimings = {
  auth_ms: number;
  body_parse_ms: number;
  classification_ms: number;
  organization_context_ms: number;
  direct_turn_ms: number;
  direct_stages?: {
    upsert_conversation_ms: number;
    append_user_ms: number;
    build_answer_ms: number;
    append_assistant_ms: number;
    total_ms: number;
  };
  response_ms: number;
  total_ms: number;
};

export type CompanionSubmitTrace = {
  request_id: string;
  conversation_id: string;
  user_client_message_id: string | null;
  normalized_intent: string;
  execution: "direct" | "queued";
  route: string;
  submit_path: string;
  classification_ms: number;
  direct_reason?: string;
  queue_reason?: string;
  queue_inserted: boolean;
  duration_ms?: number;
  organization_id?: string | null;
  locale?: string;
  timezone?: string;
  stage_timings?: CompanionSubmitStageTimings;
};

export function createCompanionSubmitRequestId(): string {
  return `csr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function logCompanionSubmitTrace(trace: CompanionSubmitTrace): void {
  console.info("[companion-submit]", JSON.stringify(trace));
}
