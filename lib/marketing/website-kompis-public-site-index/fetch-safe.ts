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
      xRobotsTag: string | null;
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
        | "network_error"
        | "noindex";
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

async function assertHostStillPublic(
  hostname: string,
  verifiedHost: string,
): Promise<{ ok: true } | { ok: false; detail: string }> {
  const hostGate = await assertPublicHostnameAllowed(hostname, verifiedHost);
  if (!hostGate.ok) {
    return { ok: false, detail: hostGate.reason };
  }
  return { ok: true };
}

/**
 * SSRF-hardened fetch for verified customer public hosts.
 * Re-validates DNS/public IP before every hop to reduce DNS-rebinding risk.
 * Same-host HTTPS redirects only; no cookies/auth; bounded body/time.
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

  let current = normalizePublicSiteIndexCanonicalUrl(decision.url);
  const maxRedirects = input.maxRedirects ?? 3;

  for (let hop = 0; hop <= maxRedirects; hop += 1) {
    const hopDecision = evaluatePublicSiteIndexUrl(current, input.verifiedHost);
    if (!hopDecision.ok) {
      return { ok: false, reason: "url_rejected", detail: hopDecision.reason };
    }

    // Re-resolve DNS on every hop (mitigate rebinding between hops).
    const dnsGate = await assertHostStillPublic(hopDecision.url.hostname, input.verifiedHost);
    if (!dnsGate.ok) {
      return { ok: false, reason: "ssrf_blocked", detail: dnsGate.detail };
    }

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
        credentials: "omit",
        cache: "no-store",
      });

      // Re-check DNS after response headers (before consuming body).
      const postDns = await assertHostStillPublic(hopDecision.url.hostname, input.verifiedHost);
      if (!postDns.ok) {
        return { ok: false, reason: "ssrf_blocked", detail: postDns.detail };
      }

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

      const xRobotsTag = response.headers.get("x-robots-tag");
      if (xRobotsTag && /\bnoindex\b/i.test(xRobotsTag)) {
        return { ok: false, reason: "noindex", detail: "x-robots-tag" };
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
        xRobotsTag,
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
