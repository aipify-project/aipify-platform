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
export const SUPPORT_UNDERSTAND_RPC = "understand_organization_support_case" as const;
export const SUPPORT_PRIORITIZE_ASSESS_RPC = "assess_organization_support_case_priority" as const;
export const SUPPORT_PRIORITIZE_MANUAL_RPC = "set_organization_support_case_priority_manual" as const;
export const SUPPORT_PRIORITIZE_CLEAR_RPC = "clear_organization_support_case_priority_override" as const;
export const SUPPORT_INTAKE_IDEMPOTENCY_CONFLICT = "support_intake_idempotency_conflict" as const;
export const SUPPORT_UNDERSTANDING_NO_INBOUND = "support_understanding_no_inbound" as const;
export const SUPPORT_PRIORITY_UNDERSTANDING_REQUIRED = "support_priority_understanding_required" as const;
export const SUPPORT_PRIORITY_UNDERSTANDING_STALE = "support_priority_understanding_stale" as const;
export const SUPPORT_PRIORITY_MANUAL_CLEAR_NOT_MANUAL = "support_priority_manual_clear_not_manual" as const;
export const SUPPORT_KNOWLEDGE_RETRIEVE_RPC = "retrieve_organization_support_case_knowledge" as const;
export const SUPPORT_KNOWLEDGE_UNDERSTANDING_REQUIRED = "support_knowledge_understanding_required" as const;
export const SUPPORT_KNOWLEDGE_UNDERSTANDING_STALE = "support_knowledge_understanding_stale" as const;

export const SUPPORT_KNOWLEDGE_STATUSES = ["complete", "needs_human_knowledge_review"] as const;
export type SupportKnowledgeStatus = (typeof SUPPORT_KNOWLEDGE_STATUSES)[number];

export const SUPPORT_PRIORITY_SOURCES = [
  "legacy",
  "default",
  "automatic",
  "manual",
  "escalation",
] as const;
export type SupportPrioritySource = (typeof SUPPORT_PRIORITY_SOURCES)[number];

export const SUPPORT_PRIORITIZE_ACTIONS = ["assess", "set_manual", "clear_manual"] as const;
export type SupportPrioritizeAction = (typeof SUPPORT_PRIORITIZE_ACTIONS)[number];

const SUPPORT_CASE_UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SUPPORT_CASE_NIL_UUID = "00000000-0000-0000-0000-000000000000";

export type SupportCaseCreateRpcParams = {
  p_subject: string;
  p_customer_identifier: string | null;
  p_channel: SupportChannel;
  p_priority: SupportPriority;
  p_initial_message: string | null;
  p_idempotency_key: string | null;
  p_priority_explicit: boolean;
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
  priority_explicit?: boolean;
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
    p_priority_explicit: params.priority_explicit ?? false,
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
  const priorityExplicit = Object.prototype.hasOwnProperty.call(body, "priority");
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
      priority_explicit: priorityExplicit,
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

export function isValidSupportCaseId(caseId: string): boolean {
  const trimmed = caseId.trim();
  if (!trimmed || !SUPPORT_CASE_UUID_REGEX.test(trimmed)) return false;
  return trimmed.toLowerCase() !== SUPPORT_CASE_NIL_UUID;
}

export function mapSupportCaseUnderstandRpcError(message: string): { status: number; error: string } {
  if (message.includes(SUPPORT_UNDERSTANDING_NO_INBOUND)) {
    return { status: 409, error: SUPPORT_UNDERSTANDING_NO_INBOUND };
  }
  if (message.includes("Case not found")) {
    return { status: 404, error: "Case not found" };
  }
  return { status: 403, error: message };
}

export function mapSupportCaseKnowledgeRpcError(message: string): { status: number; error: string } {
  if (message.includes(SUPPORT_KNOWLEDGE_UNDERSTANDING_REQUIRED)) {
    return { status: 409, error: SUPPORT_KNOWLEDGE_UNDERSTANDING_REQUIRED };
  }
  if (message.includes(SUPPORT_KNOWLEDGE_UNDERSTANDING_STALE)) {
    return { status: 409, error: SUPPORT_KNOWLEDGE_UNDERSTANDING_STALE };
  }
  if (message.includes("Case not found")) {
    return { status: 404, error: "Case not found" };
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

export async function understandSupportCase(
  supabase: SupportRpcClient,
  caseId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc(SUPPORT_UNDERSTAND_RPC, {
    p_case_id: caseId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

type SupportCaseUnderstandClient = SupportRpcClient & {
  auth: {
    getUser: () => Promise<{ data: { user: { id: string } | null } }>;
  };
};

export async function processSupportCaseUnderstandRequest(
  supabase: SupportCaseUnderstandClient,
  caseId: string
): Promise<{ status: number; body: Record<string, unknown> }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { status: 401, body: { error: "Unauthorized" } };
  }

  if (!isValidSupportCaseId(caseId)) {
    return { status: 400, body: { error: "Invalid case id" } };
  }

  const { data, error } = await supabase.rpc(SUPPORT_UNDERSTAND_RPC, {
    p_case_id: caseId.trim(),
  });
  if (error) {
    const mapped = mapSupportCaseUnderstandRpcError(error.message);
    return { status: mapped.status, body: { error: mapped.error } };
  }

  return { status: 200, body: (data as Record<string, unknown>) ?? {} };
}

export function mapSupportCasePrioritizeRpcError(message: string): { status: number; error: string } {
  if (message.includes(SUPPORT_PRIORITY_UNDERSTANDING_REQUIRED)) {
    return { status: 409, error: SUPPORT_PRIORITY_UNDERSTANDING_REQUIRED };
  }
  if (message.includes(SUPPORT_PRIORITY_UNDERSTANDING_STALE)) {
    return { status: 409, error: SUPPORT_PRIORITY_UNDERSTANDING_STALE };
  }
  if (message.includes(SUPPORT_PRIORITY_MANUAL_CLEAR_NOT_MANUAL)) {
    return { status: 409, error: SUPPORT_PRIORITY_MANUAL_CLEAR_NOT_MANUAL };
  }
  if (message.includes("invalid_priority")) {
    return { status: 400, error: "invalid_priority" };
  }
  if (message.includes("Case not found")) {
    return { status: 404, error: "Case not found" };
  }
  return { status: 403, error: message };
}

export type ParsedSupportPrioritizeBody =
  | { ok: true; action: SupportPrioritizeAction; priority?: SupportPriority }
  | { ok: false; status: number; error: string };

export function parseSupportPrioritizeBody(raw: unknown): ParsedSupportPrioritizeBody {
  if (raw == null || raw === "" || (typeof raw === "object" && !Array.isArray(raw) && Object.keys(raw).length === 0)) {
    return { ok: true, action: "assess" };
  }

  if (typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, status: 400, error: "invalid action" };
  }

  const body = raw as Record<string, unknown>;
  const actionRaw = body.action;
  const action =
    actionRaw == null || actionRaw === ""
      ? "assess"
      : typeof actionRaw === "string" &&
          (SUPPORT_PRIORITIZE_ACTIONS as readonly string[]).includes(actionRaw)
        ? (actionRaw as SupportPrioritizeAction)
        : null;

  if (!action) {
    return { ok: false, status: 400, error: "invalid action" };
  }

  if (action === "assess") {
    return { ok: true, action };
  }

  if (action === "clear_manual") {
    return { ok: true, action };
  }

  const priority =
    typeof body.priority === "string" && (SUPPORT_PRIORITIES as readonly string[]).includes(body.priority)
      ? (body.priority as SupportPriority)
      : null;

  if (!priority) {
    return { ok: false, status: 400, error: "invalid priority" };
  }

  return { ok: true, action, priority };
}

export async function assessSupportCasePriority(
  supabase: SupportRpcClient,
  caseId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc(SUPPORT_PRIORITIZE_ASSESS_RPC, {
    p_case_id: caseId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function setSupportCasePriorityManual(
  supabase: SupportRpcClient,
  caseId: string,
  priority: SupportPriority
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc(SUPPORT_PRIORITIZE_MANUAL_RPC, {
    p_case_id: caseId,
    p_priority: priority,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function clearSupportCasePriorityOverride(
  supabase: SupportRpcClient,
  caseId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc(SUPPORT_PRIORITIZE_CLEAR_RPC, {
    p_case_id: caseId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

type SupportCasePrioritizeClient = SupportRpcClient & {
  auth: {
    getUser: () => Promise<{ data: { user: { id: string } | null } }>;
  };
};

export async function processSupportCasePrioritizeRequest(
  supabase: SupportCasePrioritizeClient,
  caseId: string,
  rawBody: unknown
): Promise<{ status: number; body: Record<string, unknown> }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { status: 401, body: { error: "Unauthorized" } };
  }

  if (!isValidSupportCaseId(caseId)) {
    return { status: 400, body: { error: "Invalid case id" } };
  }

  const parsed = parseSupportPrioritizeBody(rawBody);
  if (!parsed.ok) {
    return { status: parsed.status, body: { error: parsed.error } };
  }

  const trimmedCaseId = caseId.trim();

  try {
    if (parsed.action === "assess") {
      const { data, error } = await supabase.rpc(SUPPORT_PRIORITIZE_ASSESS_RPC, {
        p_case_id: trimmedCaseId,
      });
      if (error) {
        const mapped = mapSupportCasePrioritizeRpcError(error.message);
        return { status: mapped.status, body: { error: mapped.error } };
      }
      return { status: 200, body: (data as Record<string, unknown>) ?? {} };
    }

    if (parsed.action === "clear_manual") {
      const { data, error } = await supabase.rpc(SUPPORT_PRIORITIZE_CLEAR_RPC, {
        p_case_id: trimmedCaseId,
      });
      if (error) {
        const mapped = mapSupportCasePrioritizeRpcError(error.message);
        return { status: mapped.status, body: { error: mapped.error } };
      }
      return { status: 200, body: (data as Record<string, unknown>) ?? {} };
    }

    const { data, error } = await supabase.rpc(SUPPORT_PRIORITIZE_MANUAL_RPC, {
      p_case_id: trimmedCaseId,
      p_priority: parsed.priority,
    });
    if (error) {
      const mapped = mapSupportCasePrioritizeRpcError(error.message);
      return { status: mapped.status, body: { error: mapped.error } };
    }
    return { status: 200, body: (data as Record<string, unknown>) ?? {} };
  } catch {
    return { status: 500, body: { error: "Failed to prioritize support case" } };
  }
}

export async function retrieveSupportCaseKnowledge(
  supabase: SupportRpcClient,
  caseId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc(SUPPORT_KNOWLEDGE_RETRIEVE_RPC, {
    p_case_id: caseId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

type SupportCaseKnowledgeClient = SupportRpcClient & {
  auth: {
    getUser: () => Promise<{ data: { user: { id: string } | null } }>;
  };
};

export async function processSupportCaseKnowledgeRequest(
  supabase: SupportCaseKnowledgeClient,
  caseId: string
): Promise<{ status: number; body: Record<string, unknown> }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { status: 401, body: { error: "Unauthorized" } };
  }

  if (!isValidSupportCaseId(caseId)) {
    return { status: 400, body: { error: "Invalid case id" } };
  }

  const trimmedCaseId = caseId.trim();

  try {
    const { data, error } = await supabase.rpc(SUPPORT_KNOWLEDGE_RETRIEVE_RPC, {
      p_case_id: trimmedCaseId,
    });
    if (error) {
      const mapped = mapSupportCaseKnowledgeRpcError(error.message);
      return { status: mapped.status, body: { error: mapped.error } };
    }
    return { status: 200, body: (data as Record<string, unknown>) ?? {} };
  } catch {
    return { status: 500, body: { error: "Failed to retrieve support case knowledge" } };
  }
}

export async function createSupportCase(
  supabase: SupportRpcClient,
  params: {
    subject: string;
    customer_identifier?: string;
    channel?: SupportChannel;
    priority?: SupportPriority;
    priority_explicit?: boolean;
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
