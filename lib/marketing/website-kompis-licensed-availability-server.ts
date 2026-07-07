import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  hasPublicCompanionVisitorContext,
  sanitizePublicCompanionDomain,
  sanitizePublicCompanionInstallId,
  type PublicCompanionVisitorContext,
} from "@/lib/marketing/public-companion-tenant-faq";
import {
  applyWebsiteKompisDomainInstallAvailabilityGates,
  evaluateWebsiteKompisLicensedAvailability,
  evaluateWebsiteKompisPublicInstallDomainTrust,
  WEBSITE_KOMPIS_CAPABILITY_KEY,
  type WebsiteKompisLicensedAvailability,
  type WebsiteKompisPublicInstallDomainTrustResult,
} from "@/lib/marketing/website-kompis-licensed-availability";
import type { AppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

type RpcClient = Pick<SupabaseClient, "rpc">;
type ServiceRoleClient = Pick<SupabaseClient, "rpc" | "from">;

const ACTIVE_INSTALL_STATUSES = ["ready", "installing", "active", "warning"] as const;
const TENANT_MODULE_ENABLED_STATUSES = new Set(["enabled", "trial", "beta"]);

type TenantModuleEntitlementRow = {
  licensed?: boolean | null;
  enabled?: boolean | null;
  status?: string | null;
};

type InstallationRecord = {
  id: string;
  customer_id?: string | null;
  company_id?: string | null;
  site_url?: string | null;
};

type CustomerDomainRecord = {
  customer_id: string;
  domain: string;
  installation_id?: string | null;
};

async function resolveTenantIdForInstallRecord(
  admin: ServiceRoleClient,
  install: InstallationRecord,
): Promise<string | null> {
  if (typeof install.customer_id === "string" && install.customer_id.trim()) {
    return install.customer_id.trim();
  }

  if (typeof install.company_id === "string" && install.company_id.trim()) {
    const { data: customer, error: customerError } = await admin
      .from("customers")
      .select("id")
      .eq("company_id", install.company_id)
      .maybeSingle();

    if (customerError || !customer) {
      return null;
    }

    const customerRecord = customer as { id?: string | null };
    return typeof customerRecord.id === "string" ? customerRecord.id : null;
  }

  return null;
}

async function loadActiveInstallation(
  admin: ServiceRoleClient,
  installId: string,
): Promise<InstallationRecord | null> {
  const { data, error } = await admin
    .from("installations")
    .select("id, customer_id, company_id, site_url")
    .eq("id", installId)
    .is("revoked_at", null)
    .in("status", [...ACTIVE_INSTALL_STATUSES])
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const record = data as InstallationRecord;
  return typeof record.id === "string" ? record : null;
}

async function loadVerifiedActiveCustomerDomain(
  admin: ServiceRoleClient,
  input: { tenantId: string; domain: string },
): Promise<CustomerDomainRecord | null> {
  const { data, error } = await admin
    .from("customer_domains")
    .select("customer_id, domain, installation_id")
    .eq("customer_id", input.tenantId)
    .eq("domain", input.domain)
    .eq("verification_status", "verified")
    .eq("status", "active")
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const record = data as CustomerDomainRecord;
  if (!record.customer_id || !record.domain) {
    return null;
  }

  return record;
}

async function resolveInstallIdForTenantDomain(
  admin: ServiceRoleClient,
  tenantId: string,
  domain: string,
  installationId: string | null,
): Promise<string | null> {
  if (installationId) {
    const install = await loadActiveInstallation(admin, installationId);
    if (!install) {
      return null;
    }
    const installTenantId = await resolveTenantIdForInstallRecord(admin, install);
    if (installTenantId !== tenantId) {
      return null;
    }
    return installationId;
  }

  const { data: installs, error } = await admin
    .from("installations")
    .select("id, site_url, customer_id, company_id")
    .eq("customer_id", tenantId)
    .is("revoked_at", null)
    .in("status", [...ACTIVE_INSTALL_STATUSES]);

  if (error || !Array.isArray(installs)) {
    return null;
  }

  const normalizedDomain = domain.trim().toLowerCase();
  for (const row of installs) {
    const record = row as InstallationRecord;
    if (!record.id || !record.site_url) continue;
    const siteDomain = sanitizePublicCompanionDomain(record.site_url);
    if (siteDomain === normalizedDomain) {
      return record.id;
    }
  }

  return null;
}

async function findVerifiedActiveDomainBindingForInstall(
  admin: ServiceRoleClient,
  tenantId: string,
  installId: string,
  siteDomain: string | null,
): Promise<CustomerDomainRecord | null> {
  const { data: boundDomains, error: boundError } = await admin
    .from("customer_domains")
    .select("customer_id, domain, installation_id")
    .eq("customer_id", tenantId)
    .eq("installation_id", installId)
    .eq("verification_status", "verified")
    .eq("status", "active");

  if (!boundError && Array.isArray(boundDomains) && boundDomains.length > 0) {
    const record = boundDomains[0] as CustomerDomainRecord;
    if (record.customer_id && record.domain) {
      return record;
    }
  }

  if (!siteDomain) {
    return null;
  }

  const bySiteDomain = await loadVerifiedActiveCustomerDomain(admin, {
    tenantId,
    domain: siteDomain,
  });

  if (!bySiteDomain) {
    return null;
  }

  if (
    bySiteDomain.installation_id != null &&
    bySiteDomain.installation_id !== installId
  ) {
    return null;
  }

  return bySiteDomain;
}

export async function resolveWebsiteKompisPublicInstallDomainTrust(input: {
  installId?: string | null;
  domain?: string | null;
}): Promise<WebsiteKompisPublicInstallDomainTrustResult> {
  const requestedInstallId = sanitizePublicCompanionInstallId(input.installId ?? null);
  const requestedDomain = sanitizePublicCompanionDomain(input.domain ?? null);

  if (!requestedInstallId && !requestedDomain) {
    return evaluateWebsiteKompisPublicInstallDomainTrust({
      requestedInstallId,
      requestedDomain,
      hasVerifiedActiveBinding: false,
    });
  }

  let admin: ServiceRoleClient;
  try {
    admin = createServiceRoleClient();
  } catch {
    return evaluateWebsiteKompisPublicInstallDomainTrust({
      requestedInstallId,
      requestedDomain,
      hasVerifiedActiveBinding: false,
    });
  }

  if (requestedInstallId && requestedDomain) {
    const install = await loadActiveInstallation(admin, requestedInstallId);
    if (!install) {
      return evaluateWebsiteKompisPublicInstallDomainTrust({
        requestedInstallId,
        requestedDomain,
        hasVerifiedActiveBinding: false,
      });
    }

    const tenantId = await resolveTenantIdForInstallRecord(admin, install);
    const domainRecord = tenantId
      ? await loadVerifiedActiveCustomerDomain(admin, {
          tenantId,
          domain: requestedDomain,
        })
      : null;

    const bindingMatchesInstall =
      domainRecord != null &&
      (domainRecord.installation_id == null ||
        domainRecord.installation_id === requestedInstallId);

    return evaluateWebsiteKompisPublicInstallDomainTrust({
      requestedInstallId,
      requestedDomain,
      tenantId,
      resolvedInstallId: bindingMatchesInstall ? requestedInstallId : null,
      resolvedDomain: bindingMatchesInstall ? requestedDomain : null,
      hasVerifiedActiveBinding: bindingMatchesInstall,
    });
  }

  if (requestedDomain) {
    const { data, error } = await admin
      .from("customer_domains")
      .select("customer_id, domain, installation_id")
      .eq("domain", requestedDomain)
      .eq("verification_status", "verified")
      .eq("status", "active")
      .maybeSingle();

    if (error || !data) {
      return evaluateWebsiteKompisPublicInstallDomainTrust({
        requestedInstallId,
        requestedDomain,
        hasVerifiedActiveBinding: false,
      });
    }

    const domainRecord = data as CustomerDomainRecord;
    const tenantId = domainRecord.customer_id;
    const resolvedInstallId = await resolveInstallIdForTenantDomain(
      admin,
      tenantId,
      requestedDomain,
      domainRecord.installation_id ?? null,
    );

    return evaluateWebsiteKompisPublicInstallDomainTrust({
      requestedInstallId,
      requestedDomain,
      tenantId,
      resolvedInstallId,
      resolvedDomain: requestedDomain,
      hasVerifiedActiveBinding: resolvedInstallId != null,
    });
  }

  const install = await loadActiveInstallation(admin, requestedInstallId!);
  if (!install) {
    return evaluateWebsiteKompisPublicInstallDomainTrust({
      requestedInstallId,
      requestedDomain,
      hasVerifiedActiveBinding: false,
    });
  }

  const tenantId = await resolveTenantIdForInstallRecord(admin, install);
  const siteDomain = sanitizePublicCompanionDomain(install.site_url ?? null);
  const domainRecord =
    tenantId != null
      ? await findVerifiedActiveDomainBindingForInstall(
          admin,
          tenantId,
          requestedInstallId!,
          siteDomain,
        )
      : null;

  return evaluateWebsiteKompisPublicInstallDomainTrust({
    requestedInstallId,
    requestedDomain,
    tenantId,
    resolvedInstallId: domainRecord ? requestedInstallId : null,
    resolvedDomain: domainRecord?.domain ?? null,
    hasVerifiedActiveBinding: domainRecord != null,
  });
}

function isWebsiteKompisTenantModuleEntitlementEnabled(
  row: TenantModuleEntitlementRow | null | undefined,
): boolean {
  if (!row) {
    return false;
  }

  if (row.licensed !== true || row.enabled !== true) {
    return false;
  }

  const status = typeof row.status === "string" ? row.status.trim() : "";
  return TENANT_MODULE_ENABLED_STATUSES.has(status);
}

async function loadTenantEntitlementEnabled(
  admin: ServiceRoleClient,
  tenantId: string,
): Promise<boolean | null> {
  try {
    const { data, error } = await admin
      .from("tenant_modules")
      .select("licensed, enabled, status")
      .eq("tenant_id", tenantId)
      .eq("module_key", WEBSITE_KOMPIS_CAPABILITY_KEY)
      .maybeSingle();

    if (error) {
      return null;
    }

    return isWebsiteKompisTenantModuleEntitlementEnabled(
      data as TenantModuleEntitlementRow | null,
    );
  } catch {
    return null;
  }
}

async function loadTenantLicenseServiceStatus(
  admin: ServiceRoleClient,
  tenantId: string,
): Promise<string | null> {
  const { data, error } = await admin.rpc("resolve_license_service_status", {
    p_customer_id: tenantId,
  });

  if (error || typeof data !== "string") {
    return null;
  }

  return data;
}

export async function loadWebsiteKompisEntitlementForAppTenant(
  supabase: RpcClient,
  tenantId: string | null | undefined,
): Promise<boolean | null> {
  if (!tenantId) {
    return null;
  }

  const { data, error } = await supabase.rpc("is_tenant_module_enabled", {
    p_tenant_id: tenantId,
    p_module_key: WEBSITE_KOMPIS_CAPABILITY_KEY,
  });

  if (error) {
    return null;
  }

  return data === true;
}

export async function resolveWebsiteKompisAppLicensedAvailability(input: {
  context: AppOrganizationContext;
  supabase: RpcClient;
  domainVerified?: boolean;
  installTrusted?: boolean;
}): Promise<WebsiteKompisLicensedAvailability> {
  if (!input.context.customer_id) {
    return {
      available: false,
      reason: "license_unknown",
      capabilityKey: WEBSITE_KOMPIS_CAPABILITY_KEY,
    };
  }

  const tenantAvailability = await resolveWebsiteKompisLicensedAvailabilityForPublicTenant(
    input.context.customer_id,
  );

  return applyWebsiteKompisDomainInstallAvailabilityGates(tenantAvailability, {
    domainVerified: input.domainVerified,
    installTrusted: input.installTrusted,
  });
}

export async function resolveWebsiteKompisLicensedAvailabilityForPublicTenant(
  tenantId: string,
): Promise<WebsiteKompisLicensedAvailability> {
  let admin: ServiceRoleClient;
  try {
    admin = createServiceRoleClient();
  } catch {
    return {
      available: false,
      reason: "license_unknown",
      capabilityKey: WEBSITE_KOMPIS_CAPABILITY_KEY,
    };
  }

  const [licenseServiceStatus, entitlementEnabled] = await Promise.all([
    loadTenantLicenseServiceStatus(admin, tenantId),
    loadTenantEntitlementEnabled(admin, tenantId),
  ]);

  return evaluateWebsiteKompisLicensedAvailability({
    licenseServiceStatus,
    entitlementEnabled,
    domainVerified: true,
    installTrusted: true,
    licenseResolvable: licenseServiceStatus != null,
  });
}

export async function resolveWebsiteKompisPublicLicensedAvailability(
  visitorContext: PublicCompanionVisitorContext,
): Promise<WebsiteKompisLicensedAvailability> {
  if (!hasPublicCompanionVisitorContext(visitorContext)) {
    return {
      available: false,
      reason: "install_missing",
      capabilityKey: WEBSITE_KOMPIS_CAPABILITY_KEY,
    };
  }

  const trust = await resolveWebsiteKompisPublicInstallDomainTrust({
    installId: visitorContext.installId,
    domain: visitorContext.domain,
  });

  if (!trust.trusted || !trust.tenantId) {
    return {
      available: false,
      reason: trust.reason,
      capabilityKey: WEBSITE_KOMPIS_CAPABILITY_KEY,
    };
  }

  return resolveWebsiteKompisLicensedAvailabilityForPublicTenant(trust.tenantId);
}
