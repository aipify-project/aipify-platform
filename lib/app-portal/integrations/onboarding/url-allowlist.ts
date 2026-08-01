const SECRET_QUERY_KEYS = new Set(["password", "secret", "token", "api_key", "access_token"]);
const REDIRECT_QUERY_KEYS = new Set(["redirect", "redirect_url", "redirect_uri", "return", "return_to", "return_url", "next", "continue", "url"]);

/** Public documentation destinations permitted in Core onboarding contracts. */
export const ALLOWLISTED_DOC_HOSTS = [
  "github.com", "docs.aipify.ai", "wordpress.org", "apps.shopify.com", "aipify.ai", "*.aipify.ai",
] as const;
/** Public connector packages permitted in Core onboarding contracts. */
export const ALLOWLISTED_PACKAGE_HOSTS = [
  "github.com", "wordpress.org", "apps.shopify.com", "registry.npmjs.org", "ghcr.io", "docker.io", "aipify.ai", "*.aipify.ai",
] as const;

function hostAllowed(host: string, allowedHosts: readonly string[]): boolean {
  const normalized = host.toLowerCase().replace(/\.$/, "");
  return allowedHosts.some((allowed) => {
    const candidate = allowed.toLowerCase().replace(/^\*\./, "").replace(/\.$/, "");
    return normalized === candidate || normalized.endsWith(`.${candidate}`);
  });
}

/**
 * Validates a public, HTTPS URL before Core presents it as a destination.
 * Query credential names are rejected to avoid inadvertently distributing secrets.
 */
export function validateHttpsAllowlistedUrl(
  value: unknown,
  allowedHosts: readonly string[]
): { ok: true; url: string } | { ok: false; code: "invalid_url" | "host_not_allowlisted" | "secret_query" | "open_redirect" } {
  if (typeof value !== "string" || !value.trim() || !Array.isArray(allowedHosts) || !allowedHosts.length) {
    return { ok: false, code: "invalid_url" };
  }
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.username || url.password || !hostAllowed(url.hostname, allowedHosts)) {
      return { ok: false, code: url.protocol === "https:" ? "host_not_allowlisted" : "invalid_url" };
    }
    for (const key of url.searchParams.keys()) {
      if (SECRET_QUERY_KEYS.has(key.toLowerCase())) return { ok: false, code: "secret_query" };
      if (REDIRECT_QUERY_KEYS.has(key.toLowerCase())) return { ok: false, code: "open_redirect" };
    }
    return { ok: true, url: url.toString() };
  } catch {
    return { ok: false, code: "invalid_url" };
  }
}
