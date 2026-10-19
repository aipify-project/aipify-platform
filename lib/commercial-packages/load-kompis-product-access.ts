import { createClient } from "@/lib/supabase/server";
import { parseAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
import { KOMPIS_BEDRIFT_MODULE_KEY } from "@/lib/core/access-control-plane/tenant-module-lookup";
import { loadWebsiteKompisLicenseQuotaRead } from "@/lib/website-kompis-plans/load-license-quota-read";
import type { KompisProductAccessRead, WorkspaceLicenseRead } from "./portfolio-presentation";

export type SubscriptionProductReads = {
  license: WorkspaceLicenseRead;
  access: KompisProductAccessRead;
};

/**
 * Existing customer reads only. Organization id comes from Core, never from the client.
 */
export async function loadSubscriptionProductReads(): Promise<SubscriptionProductReads> {
  const license: WorkspaceLicenseRead = { planName: null, licenseStatus: null };
  const access: KompisProductAccessRead = {
    webKind: "unavailable",
    webPlan: null,
    bedrift: "unknown",
  };

  try {
    const supabase = await createClient();
    const [orgResult, web] = await Promise.all([
      supabase.rpc("get_app_organization_context"),
      loadWebsiteKompisLicenseQuotaRead(),
    ]);
    access.webKind = web.kind;
    access.webPlan = web.kind === "known_plan" ? web.plan : null;
    if (orgResult.error) return { license, access };
    const context = parseAppOrganizationContext(orgResult.data);
    license.planName = context.plan_name;
    license.licenseStatus = context.license_status;

    if (!context.customer_id) return { license, access };
    const moduleResult = await supabase.rpc("is_tenant_module_enabled", {
      p_tenant_id: context.customer_id,
      p_module_key: KOMPIS_BEDRIFT_MODULE_KEY,
    });
    if (moduleResult.error || typeof moduleResult.data !== "boolean") {
      access.bedrift = "unknown";
    } else {
      access.bedrift = moduleResult.data ? "licensed" : "not_licensed";
    }
  } catch {
    return { license, access };
  }

  return { license, access };
}
