import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getDashboardProfile } from "@/lib/tenant/get-profile";
import { parseAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
import { buildAccountProfileView } from "./view-model";
import type { AccountProfileView } from "./types";

function avatarFromAuthMetadata(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return null;
  const url = (metadata as Record<string, unknown>).avatar_url;
  if (typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed.startsWith("/") && !trimmed.startsWith("https://")) return null;
  return trimmed;
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
  const role = (profile?.user.role ?? context.user_role ?? "").toLowerCase();
  const canOpenCompanySettings = role.includes("owner") || role.includes("admin");

  return buildAccountProfileView({
    user: profile?.user ?? null,
    loginEmail: user.email ?? null,
    phone: user.phone ?? null,
    updatedAt: user.updated_at ?? null,
    avatarUrl: avatarFromAuthMetadata(user.user_metadata),
    context,
    canOpenCompanySettings,
  });
}
