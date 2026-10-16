import { createClient } from "@/lib/supabase/server";
import { parseAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
import {
  WEBSITE_KOMPIS_MODULE_KEY,
  readWebsiteKompisLicenseQuota,
  type WebsiteKompisLicenseQuotaRead,
  type WebsiteKompisRpcResult,
} from "./license-quota-read";

async function rpcData<T>(
  call: PromiseLike<{ data: T | null; error: { message: string } | null }>,
): Promise<WebsiteKompisRpcResult<T>> {
  try {
    const { data, error } = await call;
    if (error || data === null || data === undefined) return { ok: false };
    return { ok: true, data };
  } catch {
    return { ok: false };
  }
}

/**
 * Server read for the signed-in workspace.
 * `customer_id` comes from `get_app_organization_context`, never from the client.
 * Reads only. A failed call stays unavailable and is not shown as zero usage.
 */
export async function loadWebsiteKompisLicenseQuotaRead(): Promise<WebsiteKompisLicenseQuotaRead> {
  try {
    const supabase = await createClient();
    return await readWebsiteKompisLicenseQuota({
      async readOrganizationContext() {
        const { data, error } = await supabase.rpc("get_app_organization_context");
        if (error) throw new Error("organization_context_unavailable");
        return parseAppOrganizationContext(data);
      },
      async isTenantModuleEnabled(customerId) {
        const result = await rpcData<boolean>(
          supabase.rpc("is_tenant_module_enabled", {
            p_tenant_id: customerId,
            p_module_key: WEBSITE_KOMPIS_MODULE_KEY,
          }),
        );
        if (result.ok && typeof result.data !== "boolean") return { ok: false };
        return result;
      },
      async getLicensePlan(customerId) {
        return rpcData(
          supabase.rpc("get_website_kompis_license_plan", {
            p_customer_id: customerId,
          }),
        );
      },
      async getAnswerQuota(customerId) {
        return rpcData(
          supabase.rpc("get_website_kompis_answer_quota", {
            p_customer_id: customerId,
          }),
        );
      },
    });
  } catch {
    return { kind: "unavailable" };
  }
}
