import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  hasPublicCompanionVisitorContext,
  type PublicCompanionVisitorContext,
} from "@/lib/marketing/public-companion-tenant-faq";
import {
  evaluateWebsiteKompisLicensedAvailability,
  evaluateWebsiteKompisLicensedAvailabilityFromAppContext,
  WEBSITE_KOMPIS_CAPABILITY_KEY,
  type WebsiteKompisLicensedAvailability,
} from "@/lib/marketing/website-kompis-licensed-availability";
import type { AppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

type RpcClient = Pick<SupabaseClient, "rpc">;
type ServiceRoleClient = Pick<SupabaseClient, "rpc" | "from">;

async function resolveTenantIdForInstall(
  admin: ServiceRoleClient,
  installId: string,
): Promise<string | null> {
  const { data, error } = await admin
    .from("installations")
    .select("customer_id, company_id")
    .eq("id", installId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const record = data as { customer_id?: string | null; company_id?: string | null };
  if (typeof record.customer_id === "string" && record.customer_id.trim()) {
    return record.customer_id.trim();
  }

  if (typeof record.company_id === "string" && record.company_id.trim()) {
    const { data: customer, error: customerError } = await admin
      .from("customers")
      .select("id")
      .eq("company_id", record.company_id)
      .maybeSingle();

    if (customerError || !customer) {
      return null;
    }

    const customerRecord = customer as { id?: string | null };
    return typeof customerRecord.id === "string" ? customerRecord.id : null;
  }

  return null;
}

async function loadTenantEntitlementEnabled(
  admin: ServiceRoleClient,
  tenantId: string,
): Promise<boolean | null> {
  const { data, error } = await admin.rpc("is_tenant_module_enabled", {
    p_tenant_id: tenantId,
    p_module_key: WEBSITE_KOMPIS_CAPABILITY_KEY,
  });

  if (error) {
    return null;
  }

  return data === true;
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
  const entitlementEnabled = await loadWebsiteKompisEntitlementForAppTenant(
    input.supabase,
    input.context.customer_id,
  );

  return evaluateWebsiteKompisLicensedAvailabilityFromAppContext({
    context: input.context,
    entitlementEnabled,
    domainVerified: input.domainVerified,
    installTrusted: input.installTrusted,
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

  const tenantId = await resolveTenantIdForInstall(admin, visitorContext.installId!);
  if (!tenantId) {
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
    installTrusted: true,
    licenseResolvable: licenseServiceStatus != null,
  });
}
