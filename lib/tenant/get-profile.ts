import type { SupabaseClient } from "@supabase/supabase-js";
import type { Company, DashboardProfile, AppUser } from "./types";

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

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("id, name, slug, is_platform, created_at")
    .eq("id", appUser.company_id)
    .maybeSingle();

  if (companyError || !company) {
    return null;
  }

  return {
    user: appUser as AppUser,
    company: company as Company,
  };
}
