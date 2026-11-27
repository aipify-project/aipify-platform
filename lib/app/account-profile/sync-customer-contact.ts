import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Keep Platform Customer 360 primary contact aligned with the APP person profile.
 * Platform list reads `customers.full_name` as primary_contact_name — APP saves `users.full_name`.
 * Sync writes only existing customer contact columns (no schema change).
 */

function isPrivilegedRole(role: string | null | undefined): boolean {
  const value = (role ?? "").toLowerCase();
  return value.includes("owner") || value.includes("admin");
}

export async function syncCustomerPrimaryContactFromAppUser(input: {
  admin: SupabaseClient;
  authUserId: string;
  fullName?: string;
  phone?: string;
}): Promise<{ synced: boolean; reason: string }> {
  const { data: userRow, error: userError } = await input.admin
    .from("users")
    .select("id, company_id, role")
    .eq("auth_user_id", input.authUserId)
    .maybeSingle();

  if (userError || !userRow) {
    return { synced: false, reason: "user_unavailable" };
  }

  if (!isPrivilegedRole(typeof userRow.role === "string" ? userRow.role : null)) {
    return { synced: false, reason: "role_not_privileged" };
  }

  const companyId =
    typeof userRow.company_id === "string" ? userRow.company_id.trim() : "";
  if (!companyId) {
    return { synced: false, reason: "company_missing" };
  }

  const patch: Record<string, unknown> = {};
  if (input.fullName !== undefined) {
    patch.full_name = input.fullName;
  }
  if (input.phone !== undefined) {
    patch.phone = input.phone.length > 0 ? input.phone : null;
  }
  if (Object.keys(patch).length === 0) {
    return { synced: false, reason: "nothing_to_sync" };
  }

  const { error: updateError } = await input.admin
    .from("customers")
    .update(patch)
    .eq("company_id", companyId);

  if (updateError) {
    return { synced: false, reason: "customer_update_failed" };
  }

  return { synced: true, reason: "ok" };
}
