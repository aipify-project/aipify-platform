/**
 * CSP Core RPC caller — FAIL-CLOSED. Missing/unapplied backend is reported as
 * `ready: false`, never thrown and never faked as data.
 */
import { CSP_BACKEND_NOT_APPLIED_ERROR } from "./constants";

export type CspRpcClient = {
  rpc: (
    name: string,
    args?: Record<string, unknown>,
  ) => PromiseLike<{ data: unknown; error: { code?: string; message?: string; details?: string } | null }>;
};

export type CspRpcNotReadyReason =
  | "csp_backend_not_applied"
  | "rpc_missing"
  | "rpc_error"
  | "forbidden"
  /** Core answered: the caller is not authenticated. The backend itself is ready. */
  | "unauthorized"
  /** Core answered: the caller has no partner application yet. The backend itself is ready. */
  | "partner_not_found"
  /** Core answered: partner exists but portal status is not allowed (e.g. suspended). */
  | "partner_not_active";

const UNAUTHORIZED_RPC_CODES = ["unauthorized", "not_authenticated", "unauthenticated", "auth_required"];
const NO_PARTNER_RPC_CODES = ["partner_not_found", "no_partner", "not_registered", "no_application"];
const INACTIVE_PARTNER_RPC_CODES = ["partner_not_active", "partner_suspended", "partner_inactive"];

export type CspRpcResult<T = unknown> =
  | { ready: false; error: CspRpcNotReadyReason; detail?: string }
  | { ready: true; data: T };

function isMissingRpc(code?: string, message?: string): boolean {
  const m = (message ?? "").toLowerCase();
  return code === "PGRST202" || m.includes("does not exist") || m.includes("could not find the function");
}

export async function callCspRpc<T = unknown>(
  supabase: CspRpcClient,
  rpcName: string,
  args?: Record<string, unknown>,
): Promise<CspRpcResult<T>> {
  try {
    const { data, error } = await supabase.rpc(rpcName, args ?? {});
    if (error) {
      const message = error.message ?? "";
      if (message.includes(CSP_BACKEND_NOT_APPLIED_ERROR)) {
        return { ready: false, error: "csp_backend_not_applied", detail: message };
      }
      if (isMissingRpc(error.code, message)) {
        return { ready: false, error: "rpc_missing", detail: message || error.code };
      }
      if (UNAUTHORIZED_RPC_CODES.includes(message.trim().toLowerCase())) {
        return { ready: false, error: "unauthorized", detail: message };
      }
      return { ready: false, error: "rpc_error", detail: message || error.code };
    }
    if (data && typeof data === "object") {
      const payload = data as { error?: unknown; found?: unknown; ready?: unknown };
      if (payload.error === CSP_BACKEND_NOT_APPLIED_ERROR) {
        return { ready: false, error: "csp_backend_not_applied" };
      }
      // Core answered but the caller lacks permission — report that honestly instead of "not applied".
      if (payload.error === "forbidden") {
        return { ready: false, error: "forbidden" };
      }
      if (typeof payload.error === "string" && UNAUTHORIZED_RPC_CODES.includes(payload.error.toLowerCase())) {
        return { ready: false, error: "unauthorized" };
      }
      if (
        payload.found === false &&
        typeof payload.error === "string" &&
        NO_PARTNER_RPC_CODES.includes(payload.error.toLowerCase())
      ) {
        return { ready: false, error: "partner_not_found" };
      }
      if (
        payload.found === false &&
        typeof payload.error === "string" &&
        INACTIVE_PARTNER_RPC_CODES.includes(payload.error.toLowerCase())
      ) {
        return { ready: false, error: "partner_not_active" };
      }
      if (payload.found === false && typeof payload.error === "string" && payload.ready !== true) {
        // Known Core denial — never mislabel as "backend not applied".
        return { ready: false, error: "rpc_error", detail: payload.error };
      }
      if (payload.found === false && payload.ready !== true) {
        return { ready: false, error: "csp_backend_not_applied" };
      }
    }
    return { ready: true, data: data as T };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (message.includes(CSP_BACKEND_NOT_APPLIED_ERROR)) {
      return { ready: false, error: "csp_backend_not_applied", detail: message };
    }
    return { ready: false, error: isMissingRpc(undefined, message) ? "rpc_missing" : "rpc_error", detail: message };
  }
}

export function failClosedJson(
  result: Extract<CspRpcResult, { ready: false }>,
  status?: number,
): {
  status: number;
  body: {
    found: false;
    /** `false` only when the Core backend is genuinely not applied; `true` when Core answered. */
    backend_ready: boolean;
    error: CspRpcNotReadyReason;
    detail: string | null;
  };
} {
  // Core answered (backend applied) for auth/partner denials; missing RPCs stay fail-closed (503).
  const coreAnswered =
    result.error === "unauthorized" ||
    result.error === "partner_not_found" ||
    result.error === "partner_not_active" ||
    result.error === "forbidden";
  const defaultStatus =
    result.error === "unauthorized"
      ? 401
      : result.error === "partner_not_found"
        ? 404
        : result.error === "partner_not_active" || result.error === "forbidden"
          ? 403
          : 503;
  return {
    status: status ?? defaultStatus,
    body: {
      found: false,
      backend_ready: coreAnswered,
      error: result.error,
      detail: result.detail ?? null,
    },
  };
}
