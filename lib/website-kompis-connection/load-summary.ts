import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { parseDomainLicenseCenter } from "@/lib/domain-license";
import { readOrganizationDomainCenter, type OrganizationDomainReadClient } from "@/lib/domain-license/read-center";
import { resolveWebsiteKompisCustomerDomainBinding } from "@/lib/marketing/website-kompis-domain-settings-server";
import { filterOccupyingInstallId } from "@/lib/website-kompis-connection/occupying-installation-server";
import { loadWebsiteKompisEntitlementForAppTenant } from "@/lib/marketing/website-kompis-licensed-availability-server";
import { organizationMembershipCanManageDomains } from "@/lib/domain-license/membership-role";
import {
  parseAppOrganizationContext,
  type AppOrganizationContext,
} from "@/lib/tenant/resolve-app-organization-context";
import {
  buildConnectionStatusSummary,
  maskWebsiteKompisInstallId,
  type ConnectionDomainRow,
  type ConnectionStatusSummary,
} from "@/lib/website-kompis-connection/status-model";

export type WebsiteKompisConnectionLoadResult = {
  summary: ConnectionStatusSummary;
  accessDenied: boolean;
};

async function loadOrgContext(supabase: SupabaseClient): Promise<AppOrganizationContext> {
  const { data } = await supabase.rpc("get_app_organization_context");
  return parseAppOrganizationContext(data);
}

export async function loadWebsiteKompisConnectionSummary(
  supabase: SupabaseClient,
  options?: { admin?: OrganizationDomainReadClient },
): Promise<WebsiteKompisConnectionLoadResult> {
  const context = await loadOrgContext(supabase);
  const canManage = organizationMembershipCanManageDomains(context);

  if (!context.authenticated || context.state === "unauthenticated") {
    return {
      accessDenied: true,
      summary: buildConnectionStatusSummary({
        orgContextState: context.state,
        planName: null,
        licenseStatus: null,
        productEnabled: null,
        canManage: false,
        domainCenterLoaded: false,
        accessDenied: true,
        domains: [],
        pendingDomainCount: 0,
        correlationSeed: "unauth",
      }),
    };
  }

  const productEnabled = await loadWebsiteKompisEntitlementForAppTenant(
    supabase,
    context.customer_id,
  );

  let domainCenterLoaded = false;
  let accessDenied = false;
  let domains: ConnectionDomainRow[] = [];
  let pendingDomainCount = 0;

  try {
    const center = parseDomainLicenseCenter(await readOrganizationDomainCenter(supabase, options));
    domainCenterLoaded = true;
    if (center?.found === false) {
      domainCenterLoaded = true;
    }
    const active = center?.active_domains ?? [];
    pendingDomainCount = center?.pending_domains?.length ?? 0;

    const tenantId = context.customer_id;
    domains = await Promise.all(
      active.map(async (row) => {
        const domainName = row.domain?.trim() ?? "";
        let hasCustomerBinding = false;
        let bindingVerified = false;
        let hasInstallId = false;
        let installIdMasked: string | null = null;

        if (tenantId && domainName) {
          const binding = await resolveWebsiteKompisCustomerDomainBinding({
            tenantId,
            domainName,
          });
          if (binding) {
            hasCustomerBinding = true;
            bindingVerified =
              binding.verificationStatus === "verified" && binding.domainStatus === "active";
            const occupyingInstallId = await filterOccupyingInstallId(binding.installId);
            hasInstallId = Boolean(occupyingInstallId);
            installIdMasked = maskWebsiteKompisInstallId(occupyingInstallId);
          }
        }

        // Org-domain verified active is a weaker signal when customer_domains missing.
        if (!hasCustomerBinding) {
          bindingVerified =
            row.verification_status === "verified" && row.domain_status === "active";
        }

        return {
          domainId: row.id,
          domain: domainName,
          isPrimary: row.is_primary === true,
          domainStatus: row.domain_status ?? "unknown",
          verificationStatus: row.verification_status ?? "unknown",
          licenseStatus: row.license_status ?? "unknown",
          hasCustomerBinding,
          bindingVerified,
          hasInstallId,
          installIdMasked,
        };
      }),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/permission|admin|forbidden|not authorized/i.test(message)) {
      accessDenied = true;
    }
    domainCenterLoaded = false;
  }

  const summary = buildConnectionStatusSummary({
    orgContextState: context.state,
    planName: context.plan_name,
    licenseStatus: context.license_status,
    productEnabled,
    canManage,
    domainCenterLoaded,
    accessDenied,
    domains,
    pendingDomainCount,
    correlationSeed: context.customer_id?.slice(0, 8) ?? context.company_id?.slice(0, 8) ?? null,
  });

  return { summary, accessDenied };
}
