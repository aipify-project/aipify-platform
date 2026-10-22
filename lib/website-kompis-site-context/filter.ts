import type {
  WebsiteKompisFaqScopeAnnotation,
  WebsiteKompisOwnedSite,
  WebsiteKompisSiteContext,
  WebsiteKompisSiteContextState,
} from "./types";

export type FaqRowForSiteScope = {
  installId: string | null;
};

export function resolveWebsiteKompisSiteContextState(
  sites: WebsiteKompisOwnedSite[],
  requestedInstallId: string | null,
): Pick<
  WebsiteKompisSiteContext,
  "state" | "selectedInstallId" | "selectedDomain" | "selectionRejected"
> {
  if (sites.length === 0) {
    return {
      state: "no_sites",
      selectedInstallId: null,
      selectedDomain: null,
      selectionRejected: Boolean(requestedInstallId),
    };
  }

  if (sites.length === 1) {
    const only = sites[0]!;
    if (requestedInstallId && requestedInstallId !== only.installId) {
      return {
        state: "invalid_selection",
        selectedInstallId: null,
        selectedDomain: null,
        selectionRejected: true,
      };
    }
    return {
      state: "single_site",
      selectedInstallId: only.installId,
      selectedDomain: only.domain,
      selectionRejected: false,
    };
  }

  // multi_site
  if (!requestedInstallId) {
    return {
      state: "multi_site",
      selectedInstallId: null,
      selectedDomain: null,
      selectionRejected: false,
    };
  }

  const match = sites.find((site) => site.installId === requestedInstallId);
  if (!match) {
    return {
      state: "invalid_selection",
      selectedInstallId: null,
      selectedDomain: null,
      selectionRejected: true,
    };
  }

  return {
    state: "multi_site",
    selectedInstallId: match.installId,
    selectedDomain: match.domain,
    selectionRejected: false,
  };
}

export function annotateWebsiteKompisFaqScope(
  item: FaqRowForSiteScope,
  selectedInstallId: string | null,
): WebsiteKompisFaqScopeAnnotation {
  const isLegacyTenantGlobal = item.installId == null;
  const matchesSelectedSite =
    selectedInstallId != null && item.installId === selectedInstallId;
  return {
    scopeKind: isLegacyTenantGlobal ? "legacy_tenant_global" : "site_scoped",
    isLegacyTenantGlobal,
    matchesSelectedSite,
  };
}

/**
 * Fail-closed list filter for APP FAQ admin.
 * - no_sites: return the tenant list. There is no installation to split on.
 * - single_site: the selected installation, plus legacy NULL rows.
 *   One website cannot leak those rows into a second website.
 * - multi_site: only rows whose install_id equals the selected installation.
 *   Legacy NULL rows stay in storage and are hidden, not assigned and not deleted.
 * - multi without selection / invalid: empty.
 */
export function filterWebsiteKompisFaqItemsForSiteContext<T extends FaqRowForSiteScope>(
  items: readonly T[],
  context: Pick<WebsiteKompisSiteContext, "state" | "selectedInstallId">,
): T[] {
  const state: WebsiteKompisSiteContextState = context.state;

  if (state === "unauthenticated" || state === "invalid_selection") {
    return [];
  }

  if (state === "no_sites") {
    return [...items];
  }

  const selected = context.selectedInstallId;
  if (!selected) {
    return [];
  }

  if (state === "multi_site") {
    return items.filter((item) => item.installId === selected);
  }

  return items.filter((item) => item.installId == null || item.installId === selected);
}

export function findOwnedSite(
  sites: readonly WebsiteKompisOwnedSite[],
  installId: string | null | undefined,
): WebsiteKompisOwnedSite | null {
  if (!installId) return null;
  return sites.find((site) => site.installId === installId) ?? null;
}

/** New FAQ drafts must bind to a verified owned site when any site exists. */
export function requireInstallIdForFaqWrite(input: {
  sites: readonly WebsiteKompisOwnedSite[];
  requestedInstallId: string | null;
  isUpdate: boolean;
  existingInstallId: string | null;
}): { ok: true; installId: string | null; domain: string | null } | { ok: false; reason: string } {
  const { sites, requestedInstallId, isUpdate, existingInstallId } = input;

  if (sites.length === 0) {
    // Preserve legacy writes when no install binding exists yet.
    return { ok: true, installId: requestedInstallId, domain: null };
  }

  if (isUpdate && existingInstallId == null) {
    if (requestedInstallId) {
      return { ok: false, reason: "legacy_assignment_requires_confirmation" };
    }
    if (sites.length > 1) {
      return { ok: false, reason: "legacy_unassigned" };
    }
    return { ok: true, installId: null, domain: null };
  }

  const installId = requestedInstallId ?? (sites.length === 1 ? sites[0]!.installId : null);
  if (!installId) {
    return { ok: false, reason: "install_id_required" };
  }

  const owned = findOwnedSite(sites, installId);
  if (!owned) {
    return { ok: false, reason: "install_id_not_owned" };
  }

  return { ok: true, installId: owned.installId, domain: owned.domain };
}
