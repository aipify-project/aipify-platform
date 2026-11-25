/**
 * CSP registration outcome helpers — pure, client-safe, no I/O.
 *
 * `csp_register_partner_application` requires an authenticated session (`auth.uid()`), so the
 * public form must never claim success for an anonymous submit. These helpers:
 *  - build the existing partner sign-in URL (`/login?portal=partner&next=…`),
 *  - map Core RPC error codes to stable, i18n-friendly API codes,
 *  - classify the register API response for the form (created / existing / login required / …).
 *
 * No parallel auth system: the sign-in destination is the existing `/login` partner entry.
 */

/** Where the partner lands after signing in — the apply section of the public page. */
export const CSP_APPLY_NEXT_PATH = "/certified-sales-partner#apply";

/** Existing partner sign-in entry (`/login` → partner portal card), returning to the apply section. */
export function buildCspLoginUrl(nextPath: string = CSP_APPLY_NEXT_PATH): string {
  return `/login?portal=partner&next=${encodeURIComponent(nextPath)}`;
}

/** Existing account creation entry. It has no return-path support, so no `next` is attached. */
export const CSP_CREATE_ACCOUNT_URL = "/register";

const UNAUTHORIZED_CODES = new Set([
  "unauthorized",
  "unauthenticated",
  "not_authenticated",
  "not_authorized",
  "auth_required",
  "authentication_required",
  "login_required",
]);

const CONFIRMATION_SUFFIXES = ["_confirmation_required", "_acceptance_required", "_acknowledgement_required"];

function norm(code: unknown): string {
  return typeof code === "string" ? code.trim().toLowerCase() : "";
}

export function isCspUnauthorizedCode(code: unknown): boolean {
  return UNAUTHORIZED_CODES.has(norm(code));
}

export function isCspConfirmationCode(code: unknown): boolean {
  const c = norm(code);
  return c !== "" && CONFIRMATION_SUFFIXES.some((suffix) => c.endsWith(suffix));
}

export type CspRegistrationApiError = {
  status: number;
  /** Stable code for the UI. `login_required` and `confirmation_required` are bridge-level codes. */
  code: string;
};

/**
 * Maps an error code returned by Core (as data or as a message) to an HTTP status + UI code.
 * Returns `null` when the code is not an auth/confirmation/validation error the bridge understands.
 */
export function mapCspRegistrationRpcError(code: unknown): CspRegistrationApiError | null {
  const c = norm(code);
  if (!c) return null;
  if (isCspUnauthorizedCode(c)) return { status: 401, code: "login_required" };
  if (c === "forbidden") return { status: 403, code: "forbidden" };
  if (isCspConfirmationCode(c)) return { status: 400, code: c };
  if (/^[a-z0-9_]+_required$/.test(c) || c.endsWith("_must_be_two_letter_code")) return { status: 400, code: c };
  return null;
}

function rec(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

export type CspRegistrationApplication = {
  /** `true` = new application stored, `false` = application already existed, `null` = Core did not say. */
  created: boolean | null;
  partnerStatus: string | null;
  /** Partner profile id when Core returned it (for admin notify / support). */
  partnerId: string | null;
};

/** Reads `created` and the partner status from the Core RPC payload — only what Core returned. */
export function parseCspRegistrationApplication(data: unknown): CspRegistrationApplication {
  const root = rec(data);
  const partner = rec(root.partner);
  const rawStatus = root.status ?? root.partner_status ?? partner.status;
  const rawId = root.partner_id ?? root.id ?? partner.id ?? partner.partner_id;
  return {
    created: typeof root.created === "boolean" ? root.created : null,
    partnerStatus: typeof rawStatus === "string" && rawStatus.trim() ? rawStatus.trim() : null,
    partnerId: typeof rawId === "string" && rawId.trim() ? rawId.trim() : null,
  };
}

export type CspRegistrationUiOutcome =
  | { kind: "created"; partnerStatus: string | null }
  | { kind: "existing"; partnerStatus: string | null }
  | { kind: "login_required"; loginUrl: string }
  | { kind: "backend_closed" }
  | { kind: "invalid"; code: string; supportRef?: string }
  | { kind: "error"; code: string; supportRef?: string };

/** Opaque support reference from the API — accepted only in a strict, display-safe shape. */
export function parseCspSupportRef(body: unknown): string | undefined {
  const raw = rec(body).support_ref;
  return typeof raw === "string" && /^[A-Za-z0-9-]{4,40}$/.test(raw) ? raw : undefined;
}

function safeLoginUrl(body: Record<string, unknown>): string {
  const candidate = body.login_url;
  // Only same-site `/login…` paths — never an open redirect.
  if (typeof candidate === "string" && /^\/login(?:[?#]|$)/.test(candidate) && !candidate.includes("//")) {
    return candidate;
  }
  return buildCspLoginUrl();
}

/**
 * Classifies the `POST /api/certified-sales-partner/register` response for the public form.
 * A 2xx carrying an error code (e.g. Core answering `unauthorized` as data) is never success.
 */
export function classifyCspRegistrationResponse(status: number, body: unknown): CspRegistrationUiOutcome {
  const b = rec(body);
  const code = norm(b.code) || norm(b.error);
  const supportRef = parseCspSupportRef(b);

  if (status === 401 || isCspUnauthorizedCode(code)) {
    return { kind: "login_required", loginUrl: safeLoginUrl(b) };
  }
  if (status === 503 || b.backend_ready === false) return { kind: "backend_closed" };
  if (status === 400 || status === 422) return { kind: "invalid", code: code || "invalid", supportRef };
  if (status === 403) return { kind: "error", code: code || "forbidden", supportRef };

  if (status >= 200 && status < 300) {
    if (typeof b.error === "string" && b.error.trim()) {
      const mapped = mapCspRegistrationRpcError(b.error);
      if (mapped?.status === 400) return { kind: "invalid", code: mapped.code };
      return { kind: "error", code: mapped?.code ?? norm(b.error), supportRef };
    }
    const app = parseCspRegistrationApplication(body);
    if (app.created === false) return { kind: "existing", partnerStatus: app.partnerStatus };
    return { kind: "created", partnerStatus: app.partnerStatus };
  }
  return { kind: "error", code: code || `http_${status}`, supportRef };
}

/** Partner statuses the existing-application message distinguishes; everything else uses `other`. */
export const CSP_EXISTING_STATUS_KEYS = [
  "registered",
  "under_review",
  "needs_information",
  "approved",
  "rejected",
  "suspended",
] as const;

export type CspExistingStatusKey = (typeof CSP_EXISTING_STATUS_KEYS)[number] | "other";

export function resolveCspExistingStatusKey(status: string | null): CspExistingStatusKey {
  if (status === "active" || status === "certified" || status === "in_academy") return "approved";
  return (CSP_EXISTING_STATUS_KEYS as readonly string[]).includes(status ?? "")
    ? (status as CspExistingStatusKey)
    : "other";
}
