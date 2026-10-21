import type { WebsiteKompisOwnedSite } from "./types";

export type LegacyAssignmentPlan =
  | { ok: true; installId: string; domain: string }
  | {
      ok: false;
      reason:
        | "confirmation_required"
        | "not_legacy"
        | "target_required"
        | "install_id_not_owned"
        | "site_not_verified";
    };

function siteIsVerified(site: WebsiteKompisOwnedSite): boolean {
  return site.verificationStatus === "verified" && site.domainStatus === "active";
}

/**
 * One explicit assignment of a stored NULL install_id row to one owned website.
 * Does not scan or update any other row.
 */
export function planLegacyFaqAssignment(input: {
  sites: readonly WebsiteKompisOwnedSite[];
  existingInstallId: string | null;
  targetInstallId: string | null;
  confirmed: boolean;
}): LegacyAssignmentPlan {
  if (input.existingInstallId != null) {
    return { ok: false, reason: "not_legacy" };
  }
  if (!input.confirmed) {
    return { ok: false, reason: "confirmation_required" };
  }
  if (!input.targetInstallId) {
    return { ok: false, reason: "target_required" };
  }
  const owned = input.sites.find((site) => site.installId === input.targetInstallId);
  if (!owned) {
    return { ok: false, reason: "install_id_not_owned" };
  }
  if (!siteIsVerified(owned)) {
    return { ok: false, reason: "site_not_verified" };
  }
  return { ok: true, installId: owned.installId, domain: owned.domain };
}
