import {
  assertPublicHostnameAllowed,
  isSameHostRedirect,
} from "@/lib/customer-website-runtime/ssrf";
import {
  WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_FETCH_TIMEOUT_MS,
  WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_BYTES,
  evaluatePublicSiteIndexUrl,
  normalizePublicSiteIndexCanonicalUrl,
} from "./url-policy";

export type SafePublicFetchResult =
  | {
      ok: true;
      finalUrl: string;
      status: number;
      body: string;
      contentType: string;
    }
  | {
      ok: false;
      reason:
        | "url_rejected"
        | "ssrf_blocked"
        | "timeout"
        | "redirect_blocked"
        | "http_error"
        | "body_too_large"
        | "network_error";
      detail?: string;
    };

async function readBodyCapped(response: Response, maxBytes: number): Promise<string | null> {
  const reader = response.body?.getReader();
  if (!reader) {
    const text = await response.text();
    if (text.length > maxBytes) return null;
    return text;
  }

  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > maxBytes) {
      try {
        await reader.cancel();
      } catch {
        // ignore
      }
      return null;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks.map((c) => Buffer.from(c))).toString("utf8");
}

/**
 * SSRF-safe fetch for verified customer public hosts.
 * Same-host redirects only; no cookies/auth; bounded body/time.
 */
export async function fetchVerifiedPublicSiteUrl(input: {
  url: string;
  verifiedHost: string;
  maxRedirects?: number;
}): Promise<SafePublicFetchResult> {
  const decision = evaluatePublicSiteIndexUrl(input.url, input.verifiedHost);
  if (!decision.ok) {
    return { ok: false, reason: "url_rejected", detail: decision.reason };
  }

  const hostGate = await assertPublicHostnameAllowed(
    decision.url.hostname,
    input.verifiedHost,
  );
  if (!hostGate.ok) {
    return { ok: false, reason: "ssrf_blocked", detail: hostGate.reason };
  }

  let current = normalizePublicSiteIndexCanonicalUrl(decision.url);
  const maxRedirects = input.maxRedirects ?? 3;

  for (let hop = 0; hop <= maxRedirects; hop += 1) {
    const controller = new AbortController();
    const timer = setTimeout(
      () => controller.abort(),
      WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_FETCH_TIMEOUT_MS,
    );

    try {
      const response = await fetch(current, {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "User-Agent": "AipifyPublicSiteIndex/1.0 (+https://aipify.ai)",
        },
        // Never forward cookies or credentials
        credentials: "omit",
        cache: "no-store",
      });

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (!location || !isSameHostRedirect(input.verifiedHost, location)) {
          return { ok: false, reason: "redirect_blocked" };
        }
        const nextDecision = evaluatePublicSiteIndexUrl(
          location,
          input.verifiedHost,
          current,
        );
        if (!nextDecision.ok) {
          return { ok: false, reason: "redirect_blocked", detail: nextDecision.reason };
        }
        current = normalizePublicSiteIndexCanonicalUrl(nextDecision.url);
        continue;
      }

      if (response.status !== 200) {
        return { ok: false, reason: "http_error", detail: String(response.status) };
      }

      const contentType = (response.headers.get("content-type") || "").toLowerCase();
      const body = await readBodyCapped(response, WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_BYTES);
      if (body == null) {
        return { ok: false, reason: "body_too_large" };
      }

      return {
        ok: true,
        finalUrl: current,
        status: response.status,
        body,
        contentType,
      };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return { ok: false, reason: "timeout" };
      }
      return { ok: false, reason: "network_error" };
    } finally {
      clearTimeout(timer);
    }
  }

  return { ok: false, reason: "redirect_blocked", detail: "max_redirects" };
}
