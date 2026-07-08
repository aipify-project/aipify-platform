import type { SupabaseClient } from "@supabase/supabase-js";
import { parseAppOrganizationContext } from "./resolve-app-organization-context";
import type { Company, DashboardProfile, AppUser } from "./types";

function resolveCanonicalProfileCompanyName(
  homeCompanyName: string,
  orgContextRaw: unknown,
  orgContextError: { message: string } | null
): string {
  if (orgContextError) {
    return homeCompanyName;
  }

  const orgContext = parseAppOrganizationContext(orgContextRaw);
  if (!orgContext.authenticated || orgContext.state === "database_execution_error") {
    return homeCompanyName;
  }

  const fromContext =
    orgContext.workspace_name?.trim() || orgContext.licensed_to?.trim() || null;

  return fromContext ?? homeCompanyName;
}

export async function getDashboardProfile(
  supabase: SupabaseClient
): Promise<DashboardProfile | null> {
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) {
    return null;
  }

  let { data: appUser, error: userError } = await supabase
    .from("users")
    .select("id, auth_user_id, company_id, full_name, role, created_at")
    .eq("auth_user_id", authUser.id)
    .maybeSingle();

  if (!appUser && !userError) {
    await supabase.rpc("provision_tenant_for_auth_user");
    ({ data: appUser, error: userError } = await supabase
      .from("users")
      .select("id, auth_user_id, company_id, full_name, role, created_at")
      .eq("auth_user_id", authUser.id)
      .maybeSingle());
  }

  if (userError || !appUser) {
    return null;
  }

  const { data: orgContextRaw, error: orgContextError } = await supabase.rpc(
    "get_app_organization_context"
  );

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("id, name, slug, is_platform, created_at")
    .eq("id", appUser.company_id)
    .maybeSingle();

  if (companyError || !company) {
    return null;
  }

  const homeCompany = company as Company;
  const displayName = resolveCanonicalProfileCompanyName(
    homeCompany.name,
    orgContextRaw,
    orgContextError
  );

  return {
    user: appUser as AppUser,
    company: {
      ...homeCompany,
      // company.name is canonical workspace display; company.id remains home company until 3.2E.
      name: displayName,
    },
  };
}
