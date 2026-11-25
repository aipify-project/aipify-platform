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

export type CspRpcNotReadyReason = "csp_backend_not_applied" | "rpc_missing" | "rpc_error" | "forbidden";

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
  status = 503,
): {
  status: number;
  body: {
    found: false;
    backend_ready: false;
    error: CspRpcNotReadyReason;
    detail: string | null;
  };
} {
  return {
    status,
    body: {
      found: false,
      backend_ready: false,
      error: result.error,
      detail: result.detail ?? null,
    },
  };
}
