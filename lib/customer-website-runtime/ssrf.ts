/**
 * SSRF guards for customer website HTTP read-back.
 * Blocks private/link-local/metadata IPs and off-host redirects.
 */

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "metadata.google.internal",
  "metadata",
]);

export function isBlockedHostname(hostname: string): boolean {
  const host = hostname.trim().toLowerCase().replace(/\.$/, "");
  if (!host) return true;
  if (BLOCKED_HOSTNAMES.has(host)) return true;
  if (host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) {
    return true;
  }
  return false;
}

export function isPrivateOrReservedIp(ip: string): boolean {
  const v = ip.trim().toLowerCase();
  if (!v) return true;

  if (v.includes(":")) {
    // IPv6
    if (v === "::1" || v === "::" || v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe80")) {
      return true;
    }
    return false;
  }

  const parts = v.split(".").map((p) => Number(p));
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
    return true;
  }
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  return false;
}

export type HostAllowResult =
  | { ok: true; hostname: string; resolvedIps: string[] }
  | { ok: false; reason: "invalid_host" | "hostname_blocked" | "private_ip_blocked" | "dns_failed" };

/** Resolve hostname and ensure all addresses are public. Expected host must match exactly. */
export async function assertPublicHostnameAllowed(
  hostname: string,
  expectedHostname: string,
): Promise<HostAllowResult> {
  const host = hostname.trim().toLowerCase().replace(/\.$/, "");
  const expected = expectedHostname.trim().toLowerCase().replace(/\.$/, "");
  if (!host || !expected || host !== expected) {
    return { ok: false, reason: "invalid_host" };
  }
  if (isBlockedHostname(host)) {
    return { ok: false, reason: "hostname_blocked" };
  }

  if (isIP(host)) {
    if (isPrivateOrReservedIp(host)) return { ok: false, reason: "private_ip_blocked" };
    return { ok: true, hostname: host, resolvedIps: [host] };
  }

  try {
    const records = await lookup(host, { all: true, verbatim: true });
    const ips = records.map((r) => r.address);
    if (ips.length === 0) return { ok: false, reason: "dns_failed" };
    if (ips.some(isPrivateOrReservedIp)) return { ok: false, reason: "private_ip_blocked" };
    return { ok: true, hostname: host, resolvedIps: ips };
  } catch {
    return { ok: false, reason: "dns_failed" };
  }
}

export function isSameHostRedirect(fromHost: string, locationHeader: string | null): boolean {
  if (!locationHeader) return false;
  try {
    const base = `https://${fromHost}`;
    const next = new URL(locationHeader, base);
    return next.hostname.toLowerCase() === fromHost.toLowerCase();
  } catch {
    return false;
  }
}
