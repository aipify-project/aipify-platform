import type { SupabaseClient } from "@supabase/supabase-js";
import { parseAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
import { buildCustomerProfileView, type CustomerProfileView } from "./model";

/**
 * Feature owner: CUSTOMER APP
 * Reads the signed-in account and workspace context only.
 * Registration address, website, and photo stay unavailable until a separate read contract exists.
 */
export async function loadCustomerProfile(supabase: SupabaseClient): Promise<CustomerProfileView | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: appUser }, { data: orgRaw }] = await Promise.all([
    supabase
      .from("users")
      .select("full_name, role, created_at")
      .eq("auth_user_id", user.id)
      .maybeSingle(),
    supabase.rpc("get_app_organization_context"),
  ]);

  const org = parseAppOrganizationContext(orgRaw);
  const account = (appUser ?? {}) as {
    full_name?: string | null;
    role?: string | null;
    created_at?: string | null;
  };

  return buildCustomerProfileView({
    fullName: account.full_name,
    role: account.role ?? org.user_role ?? org.organization_role,
    email: user.email,
    phone: user.phone,
    workspaceName: org.workspace_name,
    planName: org.plan_name,
    licenseStatus: org.license_status,
    customerReference: org.customer_id,
    createdAt: account.created_at ?? user.created_at,
    updatedAt: user.updated_at,
  });
}
