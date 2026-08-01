import type { CoreAppIntegrationProviderContractParseFailure } from "./types";

export type SafeAdminDestinationResult =
  | { ok: true; url: string; host: string; path: string }
  | { ok: false; code: Extract<CoreAppIntegrationProviderContractParseFailure, "invalid_admin_url" | "host_not_allowlisted" | "missing_admin_destination"> };

function normalizeHost(hostname: string): string {
  return hostname.trim().toLowerCase().replace(/\.$/, "");
}

function hostAllowed(hostname: string, allowlist: string[]): boolean {
  const host = normalizeHost(hostname);
  return allowlist.some((entry) => {
    const allowed = normalizeHost(entry);
    if (!allowed) return false;
    return host === allowed || host.endsWith(`.${allowed}`);
  });
}

/**
 * Validate provider admin destination — HTTPS, allowlisted host, safe path.
 * Fail-closed: never invent or fall back to a hardcoded provider URL.
 */
export function validateProviderAdminDestination(input: {
  adminIntegrationUrl?: string | null;
  adminBaseUrl?: string | null;
  adminIntegrationPath?: string | null;
  allowedAdminHosts: string[];
}): SafeAdminDestinationResult {
  const allowlist = (input.allowedAdminHosts ?? []).map(normalizeHost).filter(Boolean);
  if (allowlist.length === 0) {
    return { ok: false, code: "missing_admin_destination" };
  }

  let candidate = (input.adminIntegrationUrl ?? "").trim();
  if (!candidate) {
    const base = (input.adminBaseUrl ?? "").trim().replace(/\/+$/, "");
    const path = (input.adminIntegrationPath ?? "").trim();
    if (!base || !path) {
      return { ok: false, code: "missing_admin_destination" };
    }
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    candidate = `${base}${normalizedPath}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return { ok: false, code: "invalid_admin_url" };
  }

  if (parsed.protocol !== "https:") {
    return { ok: false, code: "invalid_admin_url" };
  }

  if (parsed.username || parsed.password) {
    return { ok: false, code: "invalid_admin_url" };
  }

  // Block open-redirect style query payloads that look like nested URLs.
  const nestedRedirect = ["redirect", "return", "return_to", "next", "callback"].some((key) => {
    const value = parsed.searchParams.get(key);
    if (!value) return false;
    return /^https?:\/\//i.test(value) || value.includes("//");
  });
  if (nestedRedirect) {
    return { ok: false, code: "invalid_admin_url" };
  }

  if (!hostAllowed(parsed.hostname, allowlist)) {
    return { ok: false, code: "host_not_allowlisted" };
  }

  const path = `${parsed.pathname}${parsed.search}${parsed.hash}` || "/";
  if (path.includes("://") || /[\u0000-\u001f]/.test(path)) {
    return { ok: false, code: "invalid_admin_url" };
  }

  return {
    ok: true,
    url: parsed.toString().replace(/\/+$/, "") === parsed.origin ? parsed.origin : parsed.toString(),
    host: normalizeHost(parsed.hostname),
    path,
  };
}

/**
 * Validate optional API base URL collected in the wizard (HTTPS + allowlist).
 */
export function validateProviderApiBaseUrl(input: {
  value: string | null | undefined;
  allowedHosts: string[];
}): { ok: true; value: string } | { ok: false; code: "empty" | "https_required" | "invalid_url" | "host_not_allowlisted" | "email_not_allowed" } {
  const trimmed = input.value?.trim() ?? "";
  if (!trimmed) return { ok: false, code: "empty" };
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { ok: false, code: "email_not_allowed" };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, code: "invalid_url" };
  }

  if (parsed.protocol !== "https:") {
    return { ok: false, code: "https_required" };
  }

  if (!hostAllowed(parsed.hostname, input.allowedHosts)) {
    return { ok: false, code: "host_not_allowlisted" };
  }

  return {
    ok: true,
    value: `${parsed.protocol}//${parsed.host}`.replace(/\/+$/, ""),
  };
}
