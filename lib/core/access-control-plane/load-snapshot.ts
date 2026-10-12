import type { SupabaseClient } from "@supabase/supabase-js";
import { parseAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
import { parseCustomerLicenseCenter } from "@/lib/license/types";
import { createAccessCorrelationId } from "./correlation";
import { resolveAccessControlPlaneSnapshot } from "./resolve-snapshot";
import type {
  AccessControlPlaneSnapshot,
  AccessLicenseServiceStatus,
  AccessSubscriptionStatus,
} from "./types";

function mapLicenseStatus(raw: string | undefined): AccessLicenseServiceStatus {
  if (raw === "active" || raw === "grace_period" || raw === "paused") return raw;
  return "unknown";
}

function mapSubscriptionStatus(raw: string | null | undefined): AccessSubscriptionStatus {
  const s = (raw ?? "").toLowerCase();
  if (s === "active" || s === "lifetime") return "active";
  if (s === "trialing" || s === "trial") return "trialing";
  if (s === "past_due" || s === "overdue") return "past_due";
  if (s === "cancelled" || s === "canceled") return "cancelled";
  if (s === "expired") return "expired";
  return "unknown";
}

/**
 * Server loader — session RPCs only. Never trusts client tenant/product ids.
 */
export async function loadAccessControlPlaneSnapshot(
  supabase: SupabaseClient
): Promise<AccessControlPlaneSnapshot> {
  const correlationId = createAccessCorrelationId();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return resolveAccessControlPlaneSnapshot({
      correlationId,
      organizationId: null,
      customerId: null,
      userId: null,
      role: null,
      membershipValid: false,
      subscriptionStatus: "unknown",
      licenseServiceStatus: "unknown",
      activeModuleKeys: new Set(),
    });
  }

  try {
    const [{ data: contextData }, licenseResult] = await Promise.all([
      supabase.rpc("get_app_organization_context"),
      supabase.rpc("get_customer_license_center"),
    ]);

    const context = parseAppOrganizationContext(contextData);
    const membershipValid = context.state === "ready";
    const license = parseCustomerLicenseCenter(licenseResult.data);
    const licenseServiceStatus = mapLicenseStatus(license.license_status);
    const subscriptionStatus = mapSubscriptionStatus(
      typeof license.subscription?.status === "string"
        ? license.subscription.status
        : context.license_status
    );

    const activeModuleKeys = new Set<string>();
    const tenantId = context.customer_id ?? context.organization_id;
    if (tenantId) {
      try {
        const { data: wkEnabled, error: wkError } = await supabase.rpc(
          "is_tenant_module_enabled",
          {
            p_tenant_id: tenantId,
            p_module_key: "website_kompis",
          }
        );
        if (!wkError && wkEnabled === false) {
          activeModuleKeys.add("__website_kompis_denied__");
        } else if (!wkError && wkEnabled === true) {
          activeModuleKeys.add("website_kompis");
        }
      } catch {
        // Leave empty → Web fail-closed (module_status_unknown).
      }
    }

    return resolveAccessControlPlaneSnapshot({
      correlationId,
      organizationId: context.organization_id ?? context.company_id,
      customerId: context.customer_id,
      userId: user.id,
      role: context.organization_role ?? context.user_role,
      membershipValid,
      subscriptionStatus,
      licenseServiceStatus,
      activeModuleKeys,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 160) : "access_plane_load_failed";
    console.error("[access-control-plane]", correlationId, message);
    return resolveAccessControlPlaneSnapshot({
      correlationId,
      organizationId: null,
      customerId: null,
      userId: user.id,
      role: null,
      membershipValid: false,
      subscriptionStatus: "unknown",
      licenseServiceStatus: "unknown",
      activeModuleKeys: new Set(),
    });
  }
}
