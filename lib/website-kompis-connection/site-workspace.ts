/**
 * Selected-website workspace for Kompis Web connection.
 * Read model only: opening or switching a site does not create a domain,
 * license, or installation. Verification is taken from stored status, never
 * from a primary flag.
 */

import {
  buildWebsiteKompisScriptEmbedSnippet,
  normalizeWebsiteKompisEmbedDomain,
  normalizeWebsiteKompisEmbedInstallId,
  sanitizeWebsiteKompisEmbedLocale,
} from "@/lib/marketing/website-kompis-embed";
import { resolveWebsiteKompisSiteContextState } from "@/lib/website-kompis-site-context/filter";
import type {
  WebsiteKompisOwnedSite,
  WebsiteKompisSiteContextState,
} from "@/lib/website-kompis-site-context/types";

export type ConnectionWorkspaceSiteInput = {
  installId: string;
  domain: string;
  verificationStatus: string;
  domainStatus: string;
};

export type ConnectionWorkspaceSite = ConnectionWorkspaceSiteInput & {
  verified: boolean;
  normalizedDomain: string | null;
};

export type ConnectionWorkspaceState =
  | "no_sites"
  | "choose_site"
  | "selected"
  | "rejected";

export type ConnectionSnippetBlock =
  | "none"
  | "no_sites"
  | "choose_site"
  | "rejected"
  | "unverified"
  | "invalid_domain"
  | "duplicate_domain";

export type ConnectionSiteWorkspace = {
  state: ConnectionWorkspaceState;
  sites: ConnectionWorkspaceSite[];
  selected: ConnectionWorkspaceSite | null;
  snippet: string | null;
  snippetBlock: ConnectionSnippetBlock;
  duplicateDomains: string[];
  faqScope: {
    state: WebsiteKompisSiteContextState;
    selectedInstallId: string | null;
  };
};

export function connectionDomainIsVerified(input: {
  verificationStatus: string;
  domainStatus: string;
}): boolean {
  return input.verificationStatus === "verified" && input.domainStatus === "active";
}

function prepareSites(sites: readonly ConnectionWorkspaceSiteInput[]): ConnectionWorkspaceSite[] {
  const byInstall = new Map<string, ConnectionWorkspaceSite>();
  for (const site of sites) {
    const installId = normalizeWebsiteKompisEmbedInstallId(site.installId);
    const domain = site.domain?.trim() ?? "";
    if (!installId || !domain) continue;
    if (byInstall.has(installId)) continue;
    byInstall.set(installId, {
      installId,
      domain,
      verificationStatus: site.verificationStatus,
      domainStatus: site.domainStatus,
      verified: connectionDomainIsVerified(site),
      normalizedDomain: normalizeWebsiteKompisEmbedDomain(domain),
    });
  }
  return [...byInstall.values()].sort((a, b) => a.domain.localeCompare(b.domain));
}

function duplicateNormalizedDomains(sites: readonly ConnectionWorkspaceSite[]): string[] {
  const counts = new Map<string, number>();
  for (const site of sites) {
    if (!site.normalizedDomain) continue;
    counts.set(site.normalizedDomain, (counts.get(site.normalizedDomain) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([domain]) => domain)
    .sort();
}

function toOwned(sites: readonly ConnectionWorkspaceSite[]): WebsiteKompisOwnedSite[] {
  return sites.map((site) => ({
    installId: site.installId,
    domain: site.domain,
    verificationStatus: site.verificationStatus,
    domainStatus: site.domainStatus,
    isPrimaryCandidate: site.verified,
  }));
}

export function buildConnectionSiteWorkspace(input: {
  sites: readonly ConnectionWorkspaceSiteInput[];
  requestedInstallId?: string | null;
  locale?: string | null;
  coreOrigin?: string;
}): ConnectionSiteWorkspace {
  const sites = prepareSites(input.sites);
  const requested = normalizeWebsiteKompisEmbedInstallId(input.requestedInstallId ?? null);
  const resolved = resolveWebsiteKompisSiteContextState(toOwned(sites), requested);
  const duplicates = duplicateNormalizedDomains(sites);
  const faqScope = {
    state: resolved.state,
    selectedInstallId: resolved.selectedInstallId,
  };

  if (resolved.state === "no_sites") {
    return {
      state: "no_sites",
      sites,
      selected: null,
      snippet: null,
      snippetBlock: "no_sites",
      duplicateDomains: duplicates,
      faqScope,
    };
  }

  if (resolved.state === "invalid_selection") {
    return {
      state: "rejected",
      sites,
      selected: null,
      snippet: null,
      snippetBlock: "rejected",
      duplicateDomains: duplicates,
      faqScope,
    };
  }

  if (!resolved.selectedInstallId) {
    return {
      state: "choose_site",
      sites,
      selected: null,
      snippet: null,
      snippetBlock: "choose_site",
      duplicateDomains: duplicates,
      faqScope,
    };
  }

  const selected = sites.find((site) => site.installId === resolved.selectedInstallId) ?? null;
  if (!selected) {
    return {
      state: "rejected",
      sites,
      selected: null,
      snippet: null,
      snippetBlock: "rejected",
      duplicateDomains: duplicates,
      faqScope,
    };
  }

  let snippetBlock: ConnectionSnippetBlock = "none";
  if (!selected.verified) snippetBlock = "unverified";
  else if (!selected.normalizedDomain) snippetBlock = "invalid_domain";
  else if (duplicates.includes(selected.normalizedDomain)) snippetBlock = "duplicate_domain";

  const snippet =
    snippetBlock === "none"
      ? buildWebsiteKompisScriptEmbedSnippet({
          coreOrigin: input.coreOrigin,
          installId: selected.installId,
          domain: selected.normalizedDomain ?? selected.domain,
          locale: sanitizeWebsiteKompisEmbedLocale(input.locale),
        })
      : null;

  if (snippetBlock === "none" && !snippet) {
    snippetBlock = "invalid_domain";
  }

  return {
    state: "selected",
    sites,
    selected,
    snippet,
    snippetBlock,
    duplicateDomains: duplicates,
    faqScope,
  };
}

export function connectionDomainsForSelection<
  T extends { domain: string; hasInstallId: boolean },
>(domains: readonly T[], workspace: Pick<ConnectionSiteWorkspace, "state" | "selected">): T[] {
  if (workspace.state !== "selected" || !workspace.selected) {
    return [...domains];
  }
  const selectedHost = workspace.selected.normalizedDomain;
  if (!selectedHost) {
    return domains.filter((domain) => !domain.hasInstallId);
  }
  return domains.filter((domain) => {
    if (!domain.hasInstallId) return true;
    return normalizeWebsiteKompisEmbedDomain(domain.domain) === selectedHost;
  });
}
