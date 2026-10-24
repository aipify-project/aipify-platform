import "server-only";

import { createClient } from "@/lib/supabase/server";
import { sanitizePublicCompanionDomain } from "@/lib/marketing/public-companion-tenant-faq";
import { parsePlatformPortalCustomerDomainsPayload } from "@/lib/platform-portal/domain-installation";
import { parsePlatformPortalWebsiteKompisStatus } from "@/lib/platform-portal/website-kompis-activation";
import { selectVerifiedRobotsHosts } from "./robots-alias-redirect";
import { selectInstallBoundCustomerDomains } from "./verified-domain-trust";
import { readInstallBoundCustomerDomainRows } from "./verified-domain-trust-read";

export type PublicSiteIndexOperatorTrust =
  | {
      ok: true;
      tenantId: string;
      installId: string;
      verifiedHost: string;
      verifiedAliasHosts: string[];
      websiteKompisEnabled: boolean;
    }
  | {
      ok: false;
      reason:
        | "unauthorized"
        | "invalid_customer"
        | "status_unavailable"
        | "install_missing"
        | "domain_unverified"
        | "entitlement_missing"
        | "host_mismatch";
    };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Resolve ingest trust from Platform Portal RPCs — never trust client tenantId/host alone.
 * Uses get_platform_portal_customer_website_kompis_status (platform-admin gated in Core).
 */
export async function resolvePublicSiteIndexOperatorTrust(input: {
  customerId: string;
  requestedHost?: string | null;
}): Promise<PublicSiteIndexOperatorTrust> {
  const customerId = input.customerId.trim();
  if (!UUID.test(customerId)) {
    return { ok: false, reason: "invalid_customer" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, reason: "unauthorized" };
  }

  const { data, error } = await supabase.rpc(
    "get_platform_portal_customer_website_kompis_status",
    { p_customer_id: customerId },
  );

  if (error || data == null) {
    return { ok: false, reason: "status_unavailable" };
  }

  const status = parsePlatformPortalWebsiteKompisStatus(data);
  if (!status) {
    return { ok: false, reason: "status_unavailable" };
  }

  const installId = status.installation.installId;
  const verifiedHost = sanitizePublicCompanionDomain(status.domain.hostname);
  const enabled =
    status.active === true ||
    status.existingActivation.entitlementEnabled === true;

  if (!installId || !UUID.test(installId)) {
    return { ok: false, reason: "install_missing" };
  }
  if (!verifiedHost || !status.domain.verified) {
    return { ok: false, reason: "domain_unverified" };
  }
  if (!enabled) {
    return { ok: false, reason: "entitlement_missing" };
  }

  const requested = sanitizePublicCompanionDomain(input.requestedHost ?? null);
  if (requested && requested !== verifiedHost) {
    return { ok: false, reason: "host_mismatch" };
  }

  const verifiedAliasHosts = await loadVerifiedAliasHosts({
    supabase,
    customerId: status.customerId,
    installId: installId.toLowerCase(),
    primaryHost: verifiedHost,
  });

  return {
    ok: true,
    tenantId: status.customerId,
    installId: installId.toLowerCase(),
    verifiedHost,
    verifiedAliasHosts,
    websiteKompisEnabled: true,
  };
}

async function loadVerifiedAliasHosts(input: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  customerId: string;
  installId: string;
  primaryHost: string;
}): Promise<string[]> {
  const organizationRecords = await loadOrganizationDomainRecords(input);
  let installBoundRecords: ReturnType<typeof selectInstallBoundCustomerDomains> = [];
  try {
    const rows = await readInstallBoundCustomerDomainRows({
      customerId: input.customerId,
      installId: input.installId,
    });
    installBoundRecords = selectInstallBoundCustomerDomains({
      customerId: input.customerId,
      installId: input.installId,
      rows,
    });
  } catch {
    installBoundRecords = [];
  }

  return selectVerifiedRobotsHosts({
    primaryHost: input.primaryHost,
    installId: input.installId,
    records: [...organizationRecords, ...installBoundRecords],
  });
}

async function loadOrganizationDomainRecords(input: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  customerId: string;
}): Promise<
  Array<{
    hostname: string;
    verificationStatus: string | null;
    status: string | null;
    installId: string | null;
  }>
> {
  const { data, error } = await input.supabase.rpc(
    "get_platform_portal_customer_domains",
    { p_customer_id: input.customerId },
  );
  if (error || data == null) return [];
  const parsed = parsePlatformPortalCustomerDomainsPayload(data);
  if (
    parsed.customerId &&
    parsed.customerId.toLowerCase() !== input.customerId.toLowerCase()
  ) {
    return [];
  }
  return parsed.domains.map((domain) => ({
    hostname: domain.hostname,
    verificationStatus: domain.verificationStatus,
    status: domain.status,
    installId: domain.installId,
  }));
}
