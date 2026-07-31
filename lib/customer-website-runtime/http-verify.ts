import "server-only";

import { assertPublicHostnameAllowed, isSameHostRedirect } from "./ssrf";
import { RUNTIME_PROOF_HEADERS } from "./types";

const DEFAULT_TIMEOUT_MS = 8_000;
const MAX_BODY_BYTES = 256_000;
const MAX_REDIRECTS = 3;

export type HttpVerifyInput = {
  hostname: string;
  path: string;
  locale?: string;
  timeoutMs?: number;
};

export type HttpVerifyResult = {
  ok: boolean;
  status: "verified_markers" | "mismatch" | "blocked" | "failed";
  failureReason: string | null;
  httpStatus: number | null;
  requestedHost: string;
  requestedPath: string;
  redirectHops: number;
  observedVersionHeader: string | null;
  observedManifestChecksum: string | null;
  observedPageChecksum: string | null;
  observedInstallationHeader: string | null;
};

function normalizePath(path: string): string {
  if (!path || path === "/") return "/";
  const trimmed = path.startsWith("/") ? path : `/${path}`;
  return trimmed.length > 1 && trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
}

/**
 * Controlled HTTP GET against the customer's verified domain.
 * Does not persist body. Rejects 200 without proof headers.
 */
export async function performCustomerWebsiteRuntimeHttpCheck(
  input: HttpVerifyInput,
): Promise<HttpVerifyResult> {
  const hostname = input.hostname.trim().toLowerCase();
  const path = normalizePath(input.path);
  const locale = input.locale?.trim() || undefined;
  const hostGate = await assertPublicHostnameAllowed(hostname, hostname);
  if (!hostGate.ok) {
    return {
      ok: false,
      status: "blocked",
      failureReason: hostGate.reason === "private_ip_blocked" ? "private_ip_blocked" : "ssrf_blocked",
      httpStatus: null,
      requestedHost: hostname,
      requestedPath: path,
      redirectHops: 0,
      observedVersionHeader: null,
      observedManifestChecksum: null,
      observedPageChecksum: null,
      observedInstallationHeader: null,
    };
  }

  let url = new URL(`https://${hostname}${path === "/" ? "/" : path}`);
  if (locale) url.searchParams.set("locale", locale);

  let redirects = 0;
  const timeoutMs = input.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  while (redirects <= MAX_REDIRECTS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          Accept: "text/html,application/json;q=0.9,*/*;q=0.8",
          "User-Agent": "AipifyWebsiteRuntimeVerifier/1.0",
        },
      });

      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get("location");
        if (!isSameHostRedirect(hostname, location)) {
          return baseResult({
            ok: false,
            status: "blocked",
            failureReason: "redirect_host_blocked",
            httpStatus: response.status,
            hostname,
            path,
            redirects,
          });
        }
        url = new URL(location!, `https://${hostname}`);
        redirects += 1;
        continue;
      }

      // Drain with size limit — discard content (never store).
      const reader = response.body?.getReader();
      let total = 0;
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          total += value?.byteLength ?? 0;
          if (total > MAX_BODY_BYTES) {
            try {
              await reader.cancel();
            } catch {
              /* ignore */
            }
            return baseResult({
              ok: false,
              status: "blocked",
              failureReason: "body_limit",
              httpStatus: response.status,
              hostname,
              path,
              redirects,
            });
          }
        }
      }

      const version = response.headers.get(RUNTIME_PROOF_HEADERS.version);
      const manifest = response.headers.get(RUNTIME_PROOF_HEADERS.manifestChecksum);
      const page = response.headers.get(RUNTIME_PROOF_HEADERS.pageChecksum);
      const installation = response.headers.get(RUNTIME_PROOF_HEADERS.installation);

      if (response.status !== 200 || !version || !manifest || !page) {
        return {
          ok: false,
          status: "mismatch",
          failureReason: response.status !== 200 ? "http_status" : "missing_proof_headers",
          httpStatus: response.status,
          requestedHost: hostname,
          requestedPath: path,
          redirectHops: redirects,
          observedVersionHeader: version,
          observedManifestChecksum: manifest,
          observedPageChecksum: page,
          observedInstallationHeader: installation,
        };
      }

      return {
        ok: true,
        status: "verified_markers",
        failureReason: null,
        httpStatus: response.status,
        requestedHost: hostname,
        requestedPath: path,
        redirectHops: redirects,
        observedVersionHeader: version,
        observedManifestChecksum: manifest,
        observedPageChecksum: page,
        observedInstallationHeader: installation,
      };
    } catch (error) {
      const aborted = error instanceof Error && error.name === "AbortError";
      return baseResult({
        ok: false,
        status: aborted ? "blocked" : "failed",
        failureReason: aborted ? "timeout" : "network_error",
        httpStatus: null,
        hostname,
        path,
        redirects,
      });
    } finally {
      clearTimeout(timer);
    }
  }

  return baseResult({
    ok: false,
    status: "blocked",
    failureReason: "redirect_host_blocked",
    httpStatus: null,
    hostname,
    path,
    redirects,
  });
}

function baseResult(input: {
  ok: boolean;
  status: HttpVerifyResult["status"];
  failureReason: string;
  httpStatus: number | null;
  hostname: string;
  path: string;
  redirects: number;
}): HttpVerifyResult {
  return {
    ok: input.ok,
    status: input.status,
    failureReason: input.failureReason,
    httpStatus: input.httpStatus,
    requestedHost: input.hostname,
    requestedPath: input.path,
    redirectHops: input.redirects,
    observedVersionHeader: null,
    observedManifestChecksum: null,
    observedPageChecksum: null,
    observedInstallationHeader: null,
  };
}
