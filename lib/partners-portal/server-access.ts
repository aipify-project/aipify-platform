import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import {
  isGrowthPortalAccessGranted,
  userHasCspPartnerAccess,
} from "@/lib/certified-sales-partner/partner-access";

export type PartnersPortalServerAccess =
  | { kind: "unauthorized" }
  | { kind: "denied" }
  | { kind: "allowed"; source: "growth" | "csp"; userId: string; supabase: SupabaseClient };

/**
 * Server-side seller-portal gate used by the partners layout and APIs.
 * Must match `/api/partners-portal/access` — never trust the browser alone.
 */
export async function resolvePartnersPortalServerAccess(): Promise<PartnersPortalServerAccess> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { kind: "unauthorized" };

    const { data, error } = await supabase.rpc("get_growth_portal_access");
    if (!error && isGrowthPortalAccessGranted(data)) {
      return { kind: "allowed", source: "growth", userId: user.id, supabase };
    }

    if (await userHasCspPartnerAccess(supabase, user.id)) {
      return { kind: "allowed", source: "csp", userId: user.id, supabase };
    }

    return { kind: "denied" };
  } catch {
    return { kind: "denied" };
  }
}

/** API helper — returns 401/403 responses when seller-portal access is not granted. */
export async function requirePartnersPortalApiAccess(): Promise<
  | { ok: true; access: Extract<PartnersPortalServerAccess, { kind: "allowed" }> }
  | { ok: false; response: NextResponse }
> {
  const access = await resolvePartnersPortalServerAccess();
  if (access.kind === "unauthorized") {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (access.kind === "denied") {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true, access };
}
