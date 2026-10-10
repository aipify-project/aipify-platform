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
      decodedBytes: number;
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
        | "body_unavailable"
        | "network_error"
        | "noindex";
      detail?: string;
    };

export type ReadBodyCappedResult =
  | { ok: true; body: string; decodedBytes: number }
  | { ok: false; reason: "body_too_large" | "body_unavailable" };

/**
 * Stream decoded Response.body with hard byte accounting.
 * Character length is never used as a size gate. Missing body → fail closed.
 * Content-Length is an early reject hint only when present and finite.
 */
export async function readResponseBodyCapped(
  response: Response,
  maxBytes: number,
): Promise<ReadBodyCappedResult> {
  if (!Number.isFinite(maxBytes) || maxBytes <= 0) {
    return { ok: false, reason: "body_unavailable" };
  }

  const contentLengthHeader = response.headers.get("content-length");
  if (contentLengthHeader != null && contentLengthHeader.trim() !== "") {
    const declared = Number(contentLengthHeader);
    if (Number.isFinite(declared) && declared > maxBytes) {
      try {
        await response.body?.cancel();
      } catch {
        // ignore
      }
      return { ok: false, reason: "body_too_large" };
    }
  }

  const reader = response.body?.getReader();
  if (!reader) {
    return { ok: false, reason: "body_unavailable" };
  }

  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value || value.byteLength === 0) continue;

      // Reject if this chunk alone would cross the cap (no partial accept).
      if (total + value.byteLength > maxBytes) {
        try {
          await reader.cancel();
        } catch {
          // ignore
        }
        return { ok: false, reason: "body_too_large" };
      }

      total += value.byteLength;
      chunks.push(value);
    }
  } catch {
    try {
      await reader.cancel();
    } catch {
      // ignore
    }
    return { ok: false, reason: "body_unavailable" };
  }

  if (total === 0) {
    return { ok: false, reason: "body_unavailable" };
  }

  const decoded = Buffer.concat(chunks.map((c) => Buffer.from(c))).toString("utf8");
  return { ok: true, body: decoded, decodedBytes: total };
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
  maxBytes?: number;
}): Promise<SafePublicFetchResult> {
  const decision = evaluatePublicSiteIndexUrl(input.url, input.verifiedHost);
  if (!decision.ok) {
    return { ok: false, reason: "url_rejected", detail: decision.reason };
  }

  let current = normalizePublicSiteIndexCanonicalUrl(decision.url);
  const maxRedirects = input.maxRedirects ?? 3;
  const maxBytes = input.maxBytes ?? WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_BYTES;

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
        try {
          await response.body?.cancel();
        } catch {
          // ignore
        }
        return { ok: false, reason: "noindex", detail: "x-robots-tag" };
      }

      const contentType = (response.headers.get("content-type") || "").toLowerCase();
      const bodyResult = await readResponseBodyCapped(response, maxBytes);
      if (!bodyResult.ok) {
        return { ok: false, reason: bodyResult.reason };
      }

      return {
        ok: true,
        finalUrl: current,
        status: response.status,
        body: bodyResult.body,
        contentType,
        xRobotsTag,
        decodedBytes: bodyResult.decodedBytes,
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
