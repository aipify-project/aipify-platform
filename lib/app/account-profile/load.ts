import "server-only";

import { readOfficialCustomerNumber } from "@/lib/platform-portal/official-customer-number";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { getDashboardProfile } from "@/lib/tenant/get-profile";
import { parseAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
import { resolveCustomerAvatarPointer } from "./avatar";
import { loadAccountCompanyProfile } from "./load-company-profile";
import { buildAccountProfileView } from "./view-model";
import type { AccountProfileView } from "./types";

function avatarFromAuthMetadata(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return null;
  return resolveCustomerAvatarPointer((metadata as Record<string, unknown>).avatar_url);
}

/**
 * Load APP Profile / Customer relationship for the signed-in user only.
 * Never accepts client-supplied tenant or customer ids.
 */
export async function loadAccountProfileView(): Promise<AccountProfileView | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [profile, orgResult] = await Promise.all([
    getDashboardProfile(supabase),
    supabase.rpc("get_app_organization_context"),
  ]);
  const context = parseAppOrganizationContext(orgResult.data);
  let officialCustomerNumber: string | null = null;
  let company = null;
  if (context.state === "ready" && context.customer_id) {
    try {
      const admin = createServiceRoleClient();
      const [{ data }, companyProfile] = await Promise.all([
        admin
          .from("customers")
          .select("customer_number")
          .eq("id", context.customer_id)
          .maybeSingle(),
        loadAccountCompanyProfile(admin, context.customer_id),
      ]);
      officialCustomerNumber = readOfficialCustomerNumber(data?.customer_number);
      company = companyProfile;
    } catch {
      officialCustomerNumber = null;
      company = null;
    }
  }
  const role = (profile?.user.role ?? context.user_role ?? "").toLowerCase();
  const canOpenCompanySettings = role.includes("owner") || role.includes("admin");

  const metadata =
    user.user_metadata && typeof user.user_metadata === "object" && !Array.isArray(user.user_metadata)
      ? (user.user_metadata as Record<string, unknown>)
      : {};
  const metadataPhone =
    typeof metadata.phone === "string" ? metadata.phone.trim() || null : null;
  const phone = (user.phone ?? "").trim() || metadataPhone;

  return buildAccountProfileView({
    user: profile?.user ?? null,
    loginEmail: user.email ?? null,
    phone,
    updatedAt: user.updated_at ?? null,
    avatarUrl: avatarFromAuthMetadata(user.user_metadata),
    context,
    company,
    canOpenCompanySettings,
    officialCustomerNumber,
  });
}
