import { normalizePublicHostname } from "./robots-alias-redirect";
import {
  evaluatePublicSiteIndexUrl,
  type PublicSiteIndexUrlDecision,
} from "./url-policy";

/**
 * Hosts a seed URL may use. The primary host is always included.
 * Extra hosts must already be the server-resolved verified alias set
 * (verified, active, same installation). A challenge refusal is not a host.
 */
export function trustedSeedHosts(input: {
  primaryHost: string;
  verifiedAliasHosts?: readonly string[] | null;
}): string[] {
  const hosts = new Set<string>();
  const primary = normalizePublicHostname(input.primaryHost);
  if (primary) hosts.add(primary);
  for (const alias of input.verifiedAliasHosts ?? []) {
    const host = normalizePublicHostname(alias);
    if (host) hosts.add(host);
  }
  return [...hosts];
}

/**
 * Accept a seed only on one already trusted host. The canonical host stays
 * that seed host. A robots redirect to another trusted host does not admit
 * a URL that was not itself a seed on that host.
 */
export function evaluateSeedUrlOnTrustedHosts(
  rawUrl: string,
  trustedHosts: readonly string[],
): PublicSiteIndexUrlDecision {
  const hosts = trustedHosts
    .map((host) => normalizePublicHostname(host))
    .filter((host): host is string => Boolean(host));
  if (hosts.length === 0) {
    return { ok: false, reason: "host_mismatch" };
  }

  let urlHost: string | null = null;
  try {
    urlHost = normalizePublicHostname(new URL(rawUrl).hostname);
  } catch {
    urlHost = null;
  }

  if (urlHost && hosts.includes(urlHost)) {
    return evaluatePublicSiteIndexUrl(rawUrl, urlHost);
  }
  return evaluatePublicSiteIndexUrl(rawUrl, hosts[0]);
}
