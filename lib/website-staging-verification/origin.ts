/**
 * Authoritative CSRF/origin gate for Website Staging Release Verification writes.
 * Missing Origin is denied for browser write requests (not treated as same-origin).
 */

export type WebsiteStagingOriginDecision =
  | { ok: true }
  | { ok: false; code: "origin_denied"; status: 403 };

function hostnameFromUrl(value: string): string | null {
  try {
    return new URL(value).host.toLowerCase();
  } catch {
    return null;
  }
}

export function isTrustedWebsiteStagingOrigin(origin: string | null, requestUrl: string): boolean {
  if (!origin) return false;
  const originHost = hostnameFromUrl(origin);
  const requestHost = hostnameFromUrl(requestUrl);
  if (!originHost || !requestHost) return false;

  if (originHost === requestHost) return true;
  if (originHost === "localhost:3000" || originHost === "localhost:3001" || originHost === "127.0.0.1:3000") {
    return requestHost.startsWith("localhost") || requestHost.startsWith("127.0.0.1");
  }
  // Authoritative Platform / APP hosts only.
  if (originHost === "app.aipify.ai" || originHost.endsWith(".aipify.ai")) {
    return requestHost === "app.aipify.ai" || requestHost.endsWith(".aipify.ai") || requestHost.endsWith(".vercel.app");
  }
  return false;
}

export function assertWebsiteStagingWriteOrigin(request: Request): WebsiteStagingOriginDecision {
  const origin = request.headers.get("origin");
  if (!isTrustedWebsiteStagingOrigin(origin, request.url)) {
    return { ok: false, code: "origin_denied", status: 403 };
  }
  return { ok: true };
}
