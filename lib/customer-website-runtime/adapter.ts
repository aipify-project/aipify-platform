/**
 * Framework-neutral customer runtime adapter helpers.
 * Homepage is disabled by default. Routes must be explicitly mounted.
 * On any failure, callers should fall back to the customer's own runtime.
 */

import { CUSTOMER_WEBSITE_RUNTIME_CONTRACT, RUNTIME_PROOF_HEADERS } from "./types";
import type { RuntimeContextResponse, RuntimePageResponse } from "./types";

export type AdapterConfig = {
  apiBaseUrl: string;
  installationToken: string;
  mountedPaths: string[];
  homepageEnabled?: boolean;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
};

export type AdapterResult<T> =
  | { ok: true; value: T }
  | { ok: false; reason: string; fallback: true };

function normalizePath(path: string): string {
  if (!path || path === "/") return "/";
  const trimmed = path.startsWith("/") ? path : `/${path}`;
  return trimmed.length > 1 && trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
}

export function isPathMounted(
  path: string,
  mountedPaths: readonly string[],
  homepageEnabled = false,
): boolean {
  const normalized = normalizePath(path);
  if (normalized === "/") return homepageEnabled === true;
  return mountedPaths.map(normalizePath).includes(normalized);
}

async function runtimeFetch(
  config: AdapterConfig,
  path: string,
): Promise<{ ok: true; json: unknown } | { ok: false; reason: string }> {
  const fetchImpl = config.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs ?? 5_000);
  try {
    const url = new URL(path, config.apiBaseUrl.replace(/\/$/, "") + "/");
    const response = await fetchImpl(url.toString(), {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "X-Aipify-Installation-Token": config.installationToken,
      },
      cache: "no-store",
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { reason?: string } | null;
      return { ok: false, reason: body?.reason ?? `http_${response.status}` };
    }
    return { ok: true, json: await response.json() };
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    return { ok: false, reason: aborted ? "timeout" : "network_failure" };
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchRuntimeContext(
  config: AdapterConfig,
): Promise<AdapterResult<RuntimeContextResponse>> {
  const result = await runtimeFetch(config, "/api/runtime/v1/website/context");
  if (!result.ok) return { ok: false, reason: result.reason, fallback: true };
  return { ok: true, value: result.json as RuntimeContextResponse };
}

export async function fetchRuntimePage(
  config: AdapterConfig,
  path: string,
  locale?: string,
): Promise<AdapterResult<RuntimePageResponse>> {
  if (!isPathMounted(path, config.mountedPaths, config.homepageEnabled === true)) {
    return { ok: false, reason: "route_not_mounted", fallback: true };
  }
  const qs = new URLSearchParams({ path: normalizePath(path) });
  if (locale) qs.set("locale", locale);
  const result = await runtimeFetch(config, `/api/runtime/v1/website/page?${qs.toString()}`);
  if (!result.ok) return { ok: false, reason: result.reason, fallback: true };
  const page = result.json as RuntimePageResponse;
  if (!page.ok) return { ok: false, reason: page.reason, fallback: true };
  return { ok: true, value: page };
}

/** Headers a customer runtime should emit so Aipify HTTP verifier can prove the render. */
export function buildRuntimeProofHeaders(input: {
  versionRef: string;
  manifestChecksum: string;
  pageChecksum: string;
  installationRef: string;
}): Record<string, string> {
  return {
    [RUNTIME_PROOF_HEADERS.version]: input.versionRef,
    [RUNTIME_PROOF_HEADERS.manifestChecksum]: input.manifestChecksum,
    [RUNTIME_PROOF_HEADERS.pageChecksum]: input.pageChecksum,
    [RUNTIME_PROOF_HEADERS.installation]: input.installationRef,
    "X-Aipify-Runtime-Contract": CUSTOMER_WEBSITE_RUNTIME_CONTRACT,
  };
}

export { CUSTOMER_WEBSITE_RUNTIME_CONTRACT, normalizePath };
