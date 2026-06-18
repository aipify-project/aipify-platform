import { cookies } from "next/headers";
import { GROWTH_PARTNER_ATTRIBUTION_COOKIE, parseAttributionCookie } from "@/lib/growth-partner-attribution";
import { createClient } from "@/lib/supabase/server";

export async function getGrowthPartnerAttributionFromCookies() {
  const cookieStore = await cookies();
  return parseAttributionCookie(cookieStore.get(GROWTH_PARTNER_ATTRIBUTION_COOKIE)?.value);
}

export async function applyGrowthPartnerAttributionForOrganization(organizationId: string) {
  const attribution = await getGrowthPartnerAttributionFromCookies();
  if (!attribution?.partnerPublicId) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("apply_growth_partner_attribution_to_organization", {
    p_organization_id: organizationId,
    p_partner_public_id: attribution.partnerPublicId,
    p_partner_slug: attribution.partnerSlug,
    p_session_key: attribution.sessionKey,
  });

  if (error) return { ok: false, error: error.message };
  return data;
}
