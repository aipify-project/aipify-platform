const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function text(value: unknown): string | null {
  const result = value == null ? "" : String(value).trim();
  return result || null;
}

function bool(value: unknown): boolean {
  return value === true;
}

export function parseWorkspace(value: unknown) {
  const raw = record(value);
  if (!raw) return null;
  return {
    available: bool(raw.available),
    suspended: bool(raw.suspended),
    revoked: bool(raw.revoked),
    organization: record(raw.organization) ?? {},
    agreement: record(raw.agreement),
    parentLicense: record(raw.parent_license),
    websiteKompis: record(raw.website_kompis) ?? {},
    reasons: Array.isArray(raw.reasons) ? raw.reasons : [],
  };
}

export function parseCreateConversationInput(body: unknown):
  | { ok: true; title: string; locale: string }
  | { ok: false; code: string } {
  const raw = record(body) ?? {};
  const title = text(raw.title) ?? "Kompis";
  const locale = text(raw.locale) ?? "en";
  if (title.length > 120) return { ok: false, code: "invalid_title" };
  if (locale.length > 16) return { ok: false, code: "invalid_locale" };
  return { ok: true, title, locale };
}

export function parseCreateRunInput(body: unknown):
  | { ok: true; requestText: string; idempotencyKey: string }
  | { ok: false; code: string } {
  const raw = record(body) ?? {};
  const requestText = text(raw.requestText) ?? text(raw.request_text);
  const idempotencyKey = text(raw.idempotencyKey) ?? text(raw.idempotency_key);
  if (!requestText || requestText.length < 2 || requestText.length > 4000) {
    return { ok: false, code: "invalid_request" };
  }
  if (!idempotencyKey || !idempotencyKey.startsWith("kor-") || idempotencyKey.length > 128) {
    return { ok: false, code: "invalid_idempotency_key" };
  }
  return { ok: true, requestText, idempotencyKey };
}

export function parseApproveInput(body: unknown):
  | { ok: true; confirmation: boolean; reason: string }
  | { ok: false; code: string } {
  const raw = record(body) ?? {};
  const confirmation = bool(raw.confirmation);
  const reason = text(raw.reason) ?? "";
  if (!confirmation) return { ok: false, code: "confirmation_required" };
  if (reason.length > 500) return { ok: false, code: "invalid_reason" };
  return { ok: true, confirmation, reason };
}

export function isUuid(value: string): boolean {
  return UUID.test(value);
}

export function mapKompisOperatorRpcError(message: string | null | undefined): {
  status: number;
  code: string;
} {
  const raw = (message ?? "").toUpperCase();
  if (raw.includes("UNAUTHENTICATED")) return { status: 401, code: "unauthorized" };
  if (raw.includes("KOMPIS_UNAVAILABLE")) return { status: 403, code: "kompis_unavailable" };
  if (raw.includes("APPROVAL_ROLE_REQUIRED")) return { status: 403, code: "forbidden" };
  if (raw.includes("CONFIRMATION_REQUIRED")) return { status: 400, code: "confirmation_required" };
  if (raw.includes("REASON_REQUIRED")) return { status: 400, code: "reason_required" };
  if (raw.includes("INVALID_")) return { status: 400, code: "invalid_input" };
  if (raw.includes("NOT_FOUND")) return { status: 404, code: "not_found" };
  if (raw.includes("IDEMPOTENCY_CONFLICT")) return { status: 409, code: "idempotency_conflict" };
  if (raw.includes("CRITICAL_BLOCKED")) return { status: 422, code: "critical_blocked" };
  if (raw.includes("TOOL_NOT_ALLOWED")) return { status: 422, code: "tool_not_allowed" };
  if (raw.includes("APPROVAL_REQUIRED") || raw.includes("APPROVAL_NOT_PENDING")) {
    return { status: 409, code: "approval_state" };
  }
  if (raw.toLowerCase().includes("access denied") || raw.includes("MEMBERSHIP")) {
    return { status: 403, code: "forbidden" };
  }
  return { status: 500, code: "unknown" };
}
