/**
 * CSP backend feature gate — FAIL-CLOSED.
 *
 * Returns true only when:
 *  - env `AIPIFY_CSP_BACKEND_READY` is exactly "true", OR
 *  - an injected probe resolves a known read-only RPC with `found !== false`
 *    and without the `csp_backend_not_applied` error.
 * Any failure, absence, or ambiguity returns false.
 */
import {
  CSP_BACKEND_NOT_APPLIED_ERROR,
  CSP_BACKEND_PROBE_RPC,
  CSP_BACKEND_READY_ENV,
} from "./constants";

export type CspBackendProbe = (rpcName: string) => Promise<unknown>;

export type CspBackendGateOptions = {
  env?: Record<string, string | undefined>;
  /** Optional server-side RPC caller; omitted → env-only evaluation. */
  probe?: CspBackendProbe;
};

export function isCspBackendEnvOpen(env: Record<string, string | undefined> = process.env): boolean {
  return env[CSP_BACKEND_READY_ENV] === "true";
}

export function isCspProbeResultReady(result: unknown): boolean {
  if (!result || typeof result !== "object") return false;
  const r = result as {
    found?: unknown;
    error?: unknown;
    ready?: unknown;
    backend_ready?: unknown;
  };
  if (r.error) return false;
  if (r.found === false) return false;
  if (r.error === CSP_BACKEND_NOT_APPLIED_ERROR) return false;
  return r.ready === true || r.backend_ready === true || r.found === true;
}

export async function isCertifiedSalesPartnerBackendReady(
  options: CspBackendGateOptions = {},
): Promise<boolean> {
  try {
    if (isCspBackendEnvOpen(options.env ?? process.env)) return true;
    if (!options.probe) return false;
    return isCspProbeResultReady(await options.probe(CSP_BACKEND_PROBE_RPC));
  } catch {
    return false;
  }
}

export { CSP_BACKEND_NOT_APPLIED_ERROR };
