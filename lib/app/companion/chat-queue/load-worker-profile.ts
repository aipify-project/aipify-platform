import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserRole } from "@/lib/tenant/types";
import type { Company, AppUser } from "@/lib/tenant/types";

export type WorkerExecutionProfile = {
  user: AppUser;
  company: Company;
  customerId: string;
};

export async function loadWorkerExecutionProfile(
  supabase: SupabaseClient,
  tenantId: string,
  userId: string,
): Promise<WorkerExecutionProfile | null> {
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .select("id, company_id")
    .eq("id", tenantId)
    .maybeSingle();

  if (customerError || !customer?.company_id) return null;

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, auth_user_id, company_id, full_name, role, created_at")
    .eq("id", userId)
    .maybeSingle();

  if (userError || !user || user.company_id !== customer.company_id) {
    return null;
  }

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("id, name, slug, is_platform, created_at")
    .eq("id", customer.company_id)
    .maybeSingle();

  if (companyError || !company) return null;

  return {
    user: user as AppUser,
    company: company as Company,
    customerId: customer.id,
  };
}

export function workerUserRole(profile: WorkerExecutionProfile): UserRole {
  return (profile.user.role ?? "staff") as UserRole;
}
