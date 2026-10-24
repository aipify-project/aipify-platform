import { assertPublicHostnameAllowed } from "@/lib/customer-website-runtime/ssrf";
import { readResponseBodyCapped } from "./fetch-safe";
import {
  WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_FETCH_TIMEOUT_MS,
  WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_BYTES,
} from "./url-policy";

/** Follow at most this many robots.txt redirects, then fail closed. */
export const ROBOTS_REDIRECT_LIMIT = 3;

const ROBOTS_PATH = "/robots.txt";
const ACTIVE_DOMAIN_STATUSES = new Set(["active", "verified"]);

export type VerifiedRobotsHostRecord = {
  hostname: string;
  verificationStatus: string | null;
  status: string | null;
  installId: string | null;
};

export type RobotsUrlDecision =
  | { ok: true; url: string; host: string }
  | {
      ok: false;
      reason:
        | "invalid_url"
        | "protocol_blocked"
        | "credentials_present"
        | "robots_path_rejected"
        | "unverified_host"
        | "redirect_blocked";
    };

export type RobotsFetchResult =
  | {
      ok: true;
      body: string;
      finalUrl: string;
      finalHost: string;
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
        | "redirect_loop"
        | "http_error"
        | "body_too_large"
        | "body_unavailable"
        | "network_error"
        | "noindex"
        | "unverified_host";
      detail?: string;
      finalHost?: string;
    };

export function normalizePublicHostname(value: string): string | null {
  const host = value.trim().toLowerCase().replace(/\.$/, "");
  if (!host || host.length > 253) return null;
  if (
    host.includes("/") ||
    host.includes("@") ||
    host.includes(":") ||
    host.includes(" ") ||
    host.includes("..") ||
    host.startsWith(".") ||
    host.startsWith("-")
  ) {
    return null;
  }
  if (!/^[a-z0-9.-]+$/.test(host)) return null;
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal")
  ) {
    return null;
  }
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return null;
  return host;
}

/**
 * True only for a single leading www label against the same remaining hostname.
 * www.www.example.com is not the pair of www.example.com.
 */
export function isExactApexWwwPair(left: string, right: string): boolean {
  const a = normalizePublicHostname(left);
  const b = normalizePublicHostname(right);
  if (!a || !b || a === b) return false;
  const aWww = a.startsWith("www.");
  const bWww = b.startsWith("www.");
  if (aWww === bWww) return false;
  const apex = (aWww ? a.slice(4) : a).replace(/\.$/, "");
  const other = (bWww ? b.slice(4) : b).replace(/\.$/, "");
  if (!apex || !apex.includes(".") || apex.startsWith("www.") || apex !== other) {
    return false;
  }
  return true;
}

/**
 * Hosts the robots fetcher may land on. The primary host is already proven by
 * operator trust. Any other host must itself be verified, active, and bound to
 * the same installation, and must be that primary host's exact apex/www pair.
 */
export function selectVerifiedRobotsHosts(input: {
  primaryHost: string;
  installId: string;
  records: readonly VerifiedRobotsHostRecord[];
}): string[] {
  const primary = normalizePublicHostname(input.primaryHost);
  const installId = input.installId.trim().toLowerCase();
  const hosts = new Set<string>();
  if (primary && installId) hosts.add(primary);
  if (!primary || !installId) return [...hosts];

  for (const record of input.records) {
    const host = normalizePublicHostname(record.hostname);
    if (!host) continue;
    if ((record.verificationStatus ?? "").trim().toLowerCase() !== "verified") continue;
    if (!ACTIVE_DOMAIN_STATUSES.has((record.status ?? "").trim().toLowerCase())) continue;
    if ((record.installId ?? "").trim().toLowerCase() !== installId) continue;
    if (host !== primary && !isExactApexWwwPair(primary, host)) continue;
    hosts.add(host);
  }
  return [...hosts];
}

export function evaluateRobotsDocumentUrl(
  raw: string,
  allowedHosts: ReadonlySet<string>,
): RobotsUrlDecision {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return { ok: false, reason: "invalid_url" };
  }
  if (parsed.username || parsed.password) {
    return { ok: false, reason: "credentials_present" };
  }
  if (parsed.protocol !== "https:") {
    return { ok: false, reason: "protocol_blocked" };
  }
  if (parsed.search || parsed.hash) {
    return { ok: false, reason: "robots_path_rejected" };
  }
  const host = normalizePublicHostname(parsed.hostname);
  if (!host || !allowedHosts.has(host)) {
    return { ok: false, reason: "unverified_host" };
  }
  if (parsed.pathname !== ROBOTS_PATH) {
    return { ok: false, reason: "robots_path_rejected" };
  }
  return { ok: true, url: `https://${host}${ROBOTS_PATH}`, host };
}

export function evaluateRobotsRedirect(input: {
  currentUrl: string;
  location: string;
  allowedHosts: ReadonlySet<string>;
}): RobotsUrlDecision {
  let nextRaw: string;
  try {
    nextRaw = new URL(input.location, input.currentUrl).toString();
  } catch {
    return { ok: false, reason: "invalid_url" };
  }
  const current = evaluateRobotsDocumentUrl(input.currentUrl, input.allowedHosts);
  if (!current.ok) return current;
  const next = evaluateRobotsDocumentUrl(nextRaw, input.allowedHosts);
  if (!next.ok) return next;
  if (next.host !== current.host && !isExactApexWwwPair(current.host, next.host)) {
    return { ok: false, reason: "redirect_blocked" };
  }
  return next;
}

async function defaultDnsAssert(
  hostname: string,
): Promise<{ ok: true } | { ok: false; detail: string }> {
  const gate = await assertPublicHostnameAllowed(hostname, hostname);
  if (!gate.ok) return { ok: false, detail: gate.reason };
  return { ok: true };
}

export async function fetchRobotsTxtWithinVerifiedAliases(input: {
  verifiedHost: string;
  verifiedAliasHosts: readonly string[];
  fetchImpl?: typeof fetch;
  dnsAssert?: (hostname: string) => Promise<{ ok: true } | { ok: false; detail: string }>;
  maxRedirects?: number;
}): Promise<RobotsFetchResult> {
  const primary = normalizePublicHostname(input.verifiedHost);
  const allowed = new Set(
    input.verifiedAliasHosts
      .map((host) => normalizePublicHostname(host))
      .filter((host): host is string => Boolean(host)),
  );
  if (primary) allowed.add(primary);
  if (!primary || !allowed.has(primary)) {
    return { ok: false, reason: "unverified_host", detail: "primary_host_missing" };
  }

  const fetchImpl = input.fetchImpl ?? fetch;
  const dnsAssert = input.dnsAssert ?? defaultDnsAssert;
  const maxRedirects = input.maxRedirects ?? ROBOTS_REDIRECT_LIMIT;
  let current = `https://${primary}${ROBOTS_PATH}`;
  const seenTargets = new Set<string>();

  for (let hop = 0; hop <= maxRedirects; hop += 1) {
    const decision = evaluateRobotsDocumentUrl(current, allowed);
    if (!decision.ok) {
      return { ok: false, reason: "url_rejected", detail: decision.reason, finalHost: primary };
    }

    const dnsGate = await dnsAssert(decision.host);
    if (!dnsGate.ok) {
      return {
        ok: false,
        reason: "ssrf_blocked",
        detail: dnsGate.detail,
        finalHost: decision.host,
      };
    }

    const controller = new AbortController();
    const timer = setTimeout(
      () => controller.abort(),
      WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_FETCH_TIMEOUT_MS,
    );
    try {
      const response = await fetchImpl(decision.url, {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          Accept: "text/plain,*/*;q=0.8",
          "User-Agent": "AipifyPublicSiteIndex/1.0 (+https://aipify.ai)",
        },
        credentials: "omit",
        cache: "no-store",
      });

      const postDns = await dnsAssert(decision.host);
      if (!postDns.ok) {
        return {
          ok: false,
          reason: "ssrf_blocked",
          detail: postDns.detail,
          finalHost: decision.host,
        };
      }

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (!location) {
          return { ok: false, reason: "redirect_blocked", detail: "missing_location", finalHost: decision.host };
        }
        if (hop === maxRedirects) {
          return { ok: false, reason: "redirect_blocked", detail: "max_redirects", finalHost: decision.host };
        }
        const next = evaluateRobotsRedirect({
          currentUrl: decision.url,
          location,
          allowedHosts: allowed,
        });
        if (!next.ok) {
          return { ok: false, reason: next.reason === "unverified_host" ? "unverified_host" : "redirect_blocked", detail: next.reason, finalHost: decision.host };
        }
        if (seenTargets.has(next.url)) {
          return { ok: false, reason: "redirect_loop", detail: "repeated_target", finalHost: decision.host };
        }
        seenTargets.add(next.url);
        current = next.url;
        continue;
      }

      if (response.status !== 200) {
        return {
          ok: false,
          reason: "http_error",
          detail: String(response.status),
          finalHost: decision.host,
        };
      }

      const xRobotsTag = response.headers.get("x-robots-tag");
      if (xRobotsTag && /\bnoindex\b/i.test(xRobotsTag)) {
        try {
          await response.body?.cancel();
        } catch {
          // ignore
        }
        return { ok: false, reason: "noindex", detail: "x-robots-tag", finalHost: decision.host };
      }

      const bodyResult = await readResponseBodyCapped(
        response,
        WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_BYTES,
      );
      if (!bodyResult.ok) {
        return { ok: false, reason: bodyResult.reason, finalHost: decision.host };
      }

      return {
        ok: true,
        body: bodyResult.body,
        finalUrl: decision.url,
        finalHost: decision.host,
        contentType: (response.headers.get("content-type") || "").toLowerCase(),
        xRobotsTag,
      };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return { ok: false, reason: "timeout", finalHost: decision.host };
      }
      return { ok: false, reason: "network_error", finalHost: decision.host };
    } finally {
      clearTimeout(timer);
    }
  }

  return { ok: false, reason: "redirect_blocked", detail: "max_redirects", finalHost: primary };
}
