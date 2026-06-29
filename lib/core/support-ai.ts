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
  ) => PromiseLike<{ data: unknown; error: { message: string } | null }>;
};

export const SUPPORT_INTAKE_LIMITS = {
  subjectMax: 500,
  messageMax: 8000,
  idempotencyKeyMax: 128,
} as const;

export const SUPPORT_CASE_CREATE_RPC = "create_organization_support_case" as const;
export const SUPPORT_INTAKE_IDEMPOTENCY_CONFLICT = "support_intake_idempotency_conflict" as const;

export type SupportCaseCreateRpcParams = {
  p_subject: string;
  p_customer_identifier: string | null;
  p_channel: SupportChannel;
  p_priority: SupportPriority;
  p_initial_message: string | null;
  p_idempotency_key: string | null;
};

export type ParsedSupportCaseCreateBody =
  | { ok: true; rpcParams: SupportCaseCreateRpcParams }
  | { ok: false; status: number; error: string };

function trimOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function buildSupportCaseCreateRpcParams(params: {
  subject: string;
  customer_identifier?: string;
  channel?: SupportChannel;
  priority?: SupportPriority;
  initial_message?: string;
  idempotency_key?: string;
}): SupportCaseCreateRpcParams {
  return {
    p_subject: params.subject,
    p_customer_identifier: params.customer_identifier ?? null,
    p_channel: params.channel ?? "admin_inbox",
    p_priority: params.priority ?? "medium",
    p_initial_message: params.initial_message ?? null,
    p_idempotency_key: params.idempotency_key ?? null,
  };
}

export function parseSupportCaseCreateBody(raw: unknown): ParsedSupportCaseCreateBody {
  if (raw == null || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, status: 400, error: "subject required" };
  }

  const body = raw as Record<string, unknown>;

  if ("organization_id" in body && body.organization_id != null && body.organization_id !== "") {
    return { ok: false, status: 400, error: "organization_id is not allowed" };
  }

  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  if (!subject) {
    return { ok: false, status: 400, error: "subject required" };
  }
  if (subject.length > SUPPORT_INTAKE_LIMITS.subjectMax) {
    return { ok: false, status: 400, error: "subject too long" };
  }

  const message = trimOrNull(body.message);
  if (message != null && message.length > SUPPORT_INTAKE_LIMITS.messageMax) {
    return { ok: false, status: 400, error: "message too long" };
  }

  const idempotencyKey = trimOrNull(body.idempotency_key);
  if (idempotencyKey != null && idempotencyKey.length > SUPPORT_INTAKE_LIMITS.idempotencyKeyMax) {
    return { ok: false, status: 400, error: "idempotency_key too long" };
  }
  if (idempotencyKey != null && message == null) {
    return { ok: false, status: 400, error: "message required when idempotency_key is set" };
  }

  const customerIdentifier = trimOrNull(body.customer_identifier);
  const channel =
    typeof body.channel === "string" && (SUPPORT_CHANNELS as readonly string[]).includes(body.channel)
      ? (body.channel as SupportChannel)
      : "admin_inbox";
  const priority =
    typeof body.priority === "string" && (SUPPORT_PRIORITIES as readonly string[]).includes(body.priority)
      ? (body.priority as SupportPriority)
      : "medium";

  return {
    ok: true,
    rpcParams: buildSupportCaseCreateRpcParams({
      subject,
      customer_identifier: customerIdentifier ?? undefined,
      channel,
      priority,
      initial_message: message ?? undefined,
      idempotency_key: idempotencyKey ?? undefined,
    }),
  };
}

export function mapSupportCaseCreateRpcError(message: string): { status: number; error: string } {
  if (message.includes(SUPPORT_INTAKE_IDEMPOTENCY_CONFLICT)) {
    return { status: 409, error: SUPPORT_INTAKE_IDEMPOTENCY_CONFLICT };
  }
  return { status: 403, error: message };
}

type SupportCaseCreateClient = SupportRpcClient & {
  auth: {
    getUser: () => Promise<{ data: { user: { id: string } | null } }>;
  };
};

export async function processSupportCaseCreateRequest(
  supabase: SupportCaseCreateClient,
  rawBody: unknown
): Promise<{ status: number; body: Record<string, unknown> }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { status: 401, body: { error: "Unauthorized" } };
  }

  const parsed = parseSupportCaseCreateBody(rawBody);
  if (!parsed.ok) {
    return { status: parsed.status, body: { error: parsed.error } };
  }

  const { data, error } = await supabase.rpc(SUPPORT_CASE_CREATE_RPC, parsed.rpcParams);
  if (error) {
    const mapped = mapSupportCaseCreateRpcError(error.message);
    return { status: mapped.status, body: { error: mapped.error } };
  }

  return { status: 200, body: (data as Record<string, unknown>) ?? {} };
}

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
    initial_message?: string;
    idempotency_key?: string;
  }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc(
    SUPPORT_CASE_CREATE_RPC,
    buildSupportCaseCreateRpcParams(params)
  );
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
