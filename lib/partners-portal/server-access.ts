import { cache } from "react";
import { NextResponse } from "next/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUserFromSession } from "@/lib/supabase/session-auth";
import {
  fetchCspPartnerStatusForAuthUser,
  isCspPartnerPortalStatusAllowed,
  isGrowthPortalAccessGranted,
  userHasCspPartnerAccess,
} from "@/lib/certified-sales-partner/partner-access";
import { resolvePartnersAvatarPointer } from "@/lib/partners-portal/avatar";

export type PartnersPortalServerAccess =
  | { kind: "unauthorized" }
  | { kind: "denied" }
  | {
      kind: "allowed";
      source: "growth" | "csp";
      userId: string;
      supabase: SupabaseClient;
      /** Same-origin avatar pointer only — never a remote URL. */
      avatarUrl: string | null;
    };

/**
 * Server-side seller-portal gate used by the partners layout and APIs.
 * Must match `/api/partners-portal/access` — never trust the browser alone.
 *
 * Growth RPC and CSP status lookup run in parallel after auth so CSP partners
 * are not blocked waiting for a negative growth result first.
 *
 * Wrapped in React `cache()` so layout + page in the same RSC request share one gate.
 */
export const resolvePartnersPortalServerAccess = cache(async (): Promise<PartnersPortalServerAccess> => {
  try {
    const supabase = await createClient();
    // Cookie session only — proxy owns refresh; avoid Auth network getUser on every gate.
    const user = await getAuthenticatedUserFromSession(supabase);
    if (!user) return { kind: "unauthorized" };

    const avatarUrl = resolvePartnersAvatarPointer(user.user_metadata?.avatar_url);

    const [growthResult, cspStatus] = await Promise.all([
      supabase.rpc("get_growth_portal_access"),
      fetchCspPartnerStatusForAuthUser(user.id),
    ]);

    if (!growthResult.error && isGrowthPortalAccessGranted(growthResult.data)) {
      return { kind: "allowed", source: "growth", userId: user.id, supabase, avatarUrl };
    }

    if (isCspPartnerPortalStatusAllowed(cspStatus)) {
      return { kind: "allowed", source: "csp", userId: user.id, supabase, avatarUrl };
    }
    // Known non-portal status (suspended / rejected / under_review / …) — deny without overview RPC.
    if (cspStatus !== null) {
      return { kind: "denied" };
    }

    // No profile row yet — fall back to overview RPC (rare path).
    if (await userHasCspPartnerAccess(supabase, user.id)) {
      return { kind: "allowed", source: "csp", userId: user.id, supabase, avatarUrl };
    }

    return { kind: "denied" };
  } catch {
    return { kind: "denied" };
  }
});

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

/** @deprecated Prefer `access.avatarUrl` from `resolvePartnersPortalServerAccess`. */
export async function loadPartnerAvatarFromUser(user: User | null): Promise<string | null> {
  return resolvePartnersAvatarPointer(user?.user_metadata?.avatar_url);
}
