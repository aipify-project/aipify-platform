import { isPrivateWebsiteKompisPathnameNormalized } from "./private-paths";

export const WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_PAGES = 80;

/**
 * Absolute decoded-body cap for public HTML/XML fetches (2 MiB).
 * Rationale: modern marketing/Next.js pages commonly ship ~0.5–1.2 MiB HTML with
 * inline hydration scripts; 256 KiB rejected all sampled Production public pages.
 * Responses larger than this are rejected entirely (no partial index). Not unlimited.
 */
export const WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_BYTES = 2 * 1024 * 1024;

/** Per-request wall clock including DNS rechecks + body stream (bounded). */
export const WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_FETCH_TIMEOUT_MS = 15_000;

export type PublicSiteIndexUrlDecision =
  | { ok: true; url: URL; pathname: string }
  | {
      ok: false;
      reason:
        | "invalid_url"
        | "protocol_blocked"
        | "host_mismatch"
        | "private_path"
        | "credentials_present"
        | "fragment_only";
    };

/** Allow only https URLs on the exact verified host; reject private/member paths. */
export function evaluatePublicSiteIndexUrl(
  rawUrl: string,
  verifiedHost: string,
  baseUrl?: string,
): PublicSiteIndexUrlDecision {
  const host = verifiedHost.trim().toLowerCase().replace(/\.$/, "");
  if (!host) {
    return { ok: false, reason: "host_mismatch" };
  }

  let parsed: URL;
  try {
    parsed = baseUrl ? new URL(rawUrl, baseUrl) : new URL(rawUrl);
  } catch {
    return { ok: false, reason: "invalid_url" };
  }

  // Fail closed: indexed public pages must be HTTPS only (no http upgrade trust).
  if (parsed.protocol !== "https:") {
    return { ok: false, reason: "protocol_blocked" };
  }

  if (parsed.username || parsed.password) {
    return { ok: false, reason: "credentials_present" };
  }

  const urlHost = parsed.hostname.trim().toLowerCase().replace(/\.$/, "");
  if (urlHost !== host) {
    return { ok: false, reason: "host_mismatch" };
  }

  const pathname = parsed.pathname || "/";
  if (isPrivateWebsiteKompisPathnameNormalized(pathname)) {
    return { ok: false, reason: "private_path" };
  }

  // Drop query/hash for canonical indexing identity (keep path only).
  parsed.hash = "";
  parsed.search = "";

  return { ok: true, url: parsed, pathname };
}

export function normalizePublicSiteIndexCanonicalUrl(url: URL): string {
  const copy = new URL(url.toString());
  copy.hash = "";
  copy.search = "";
  copy.protocol = "https:";
  // Prefer no trailing slash except root
  if (copy.pathname.length > 1 && copy.pathname.endsWith("/")) {
    copy.pathname = copy.pathname.slice(0, -1);
  }
  return copy.toString();
}

/** Minimal robots.txt path disallow check (prefix matching). */
export function isPathDisallowedByRobots(
  pathname: string,
  disallowRules: string[],
): boolean {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  for (const rule of disallowRules) {
    const cleaned = rule.trim();
    if (!cleaned) continue;
    if (cleaned === "/") return true;
    if (path === cleaned || path.startsWith(cleaned.endsWith("/") ? cleaned : `${cleaned}`)) {
      // Avoid treating short prefixes too greedily when rule has no trailing slash
      if (cleaned.endsWith("/") || path === cleaned || path.startsWith(`${cleaned}/`)) {
        return true;
      }
    }
  }
  return false;
}

export function parseRobotsTxtDisallowPaths(robotsTxt: string, userAgent = "*"): string[] {
  const lines = robotsTxt.split(/\r?\n/);
  let active = false;
  const disallow: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const colon = trimmed.indexOf(":");
    if (colon <= 0) continue;
    const key = trimmed.slice(0, colon).trim().toLowerCase();
    const value = trimmed.slice(colon + 1).trim();

    if (key === "user-agent") {
      active = value === "*" || value.toLowerCase() === userAgent.toLowerCase();
      continue;
    }
    if (!active) continue;
    if (key === "disallow" && value) {
      disallow.push(value);
    }
  }

  return disallow;
}
