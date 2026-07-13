import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { sanitizeNextPath } from "@/lib/auth/safe-next-path";
import { getTwoFactorStatusForSession } from "@/lib/auth/two-factor/api";
import {
  buildMfaEnrollPath,
  buildMfaVerifyPath,
} from "@/lib/auth/two-factor/mfa-portal-routing";
import type { TwoFactorStatus } from "@/lib/auth/two-factor";
import { PLATFORM_ADMIN_ROUTE } from "@/lib/portals/routes";
import { getPlatformProfile } from "@/lib/tenant/get-platform-profile";
import { createClient } from "@/lib/supabase/server";

export type PlatformAccessDenyReason =
  | "unauthenticated"
  | "forbidden"
  | "needs_enrollment"
  | "needs_verification";

export type PlatformAccessEvaluation =
  | { allowed: true; status: TwoFactorStatus }
  | { allowed: false; reason: PlatformAccessDenyReason };

export function isPrivilegedPlatformApiPath(pathname: string): boolean {
  if (pathname.startsWith("/api/platform/")) return true;
  if (pathname.startsWith("/api/platform-")) return true;
  if (pathname.startsWith("/api/platform-admin/")) return true;
  if (pathname.startsWith("/api/aipify/platform-install/")) return true;
  if (pathname.startsWith("/api/aipify/platform-integrity/")) return true;
  return false;
}

export async function evaluatePlatformPrivilegedAccess(
  supabase: SupabaseClient,
): Promise<PlatformAccessEvaluation> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { allowed: false, reason: "unauthenticated" };
  }

  const profile = await getPlatformProfile(supabase);
  if (!profile) {
    return { allowed: false, reason: "forbidden" };
  }

  const status = await getTwoFactorStatusForSession(supabase);
  if (!status) {
    return { allowed: false, reason: "unauthenticated" };
  }

  if (status.needs_enrollment) {
    return { allowed: false, reason: "needs_enrollment" };
  }

  if (status.needs_verification || !status.session_verified) {
    return { allowed: false, reason: "needs_verification" };
  }

  return { allowed: true, status };
}

export async function requirePlatformServerAccess(
  nextPath: string = PLATFORM_ADMIN_ROUTE,
): Promise<TwoFactorStatus> {
  const supabase = await createClient();
  const evaluation = await evaluatePlatformPrivilegedAccess(supabase);
  const safeNext = sanitizeNextPath(nextPath) ?? PLATFORM_ADMIN_ROUTE;

  if (evaluation.allowed) {
    return evaluation.status;
  }

  switch (evaluation.reason) {
    case "unauthenticated":
      redirect(`/login?next=${encodeURIComponent(safeNext)}`);
    case "forbidden":
      redirect("/app/command-center");
    case "needs_enrollment":
      redirect(buildMfaEnrollPath(safeNext, "platform"));
    case "needs_verification":
      redirect(buildMfaVerifyPath(safeNext, "platform"));
  }
}

export async function guardPrivilegedPlatformApi(
  supabase: SupabaseClient,
): Promise<NextResponse | null> {
  const evaluation = await evaluatePlatformPrivilegedAccess(supabase);

  if (evaluation.allowed) {
    return null;
  }

  switch (evaluation.reason) {
    case "unauthenticated":
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    case "forbidden":
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    case "needs_enrollment":
    case "needs_verification":
      return NextResponse.json({ error: "mfa_required" }, { status: 403 });
  }
}
