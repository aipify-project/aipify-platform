import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  PlatformAuthGuardUnavailableError,
  evaluatePlatformPrivilegedAccess,
  type PlatformAccessEvaluation,
} from "@/lib/auth/platform-server-access";
import { getPlatformProfile } from "@/lib/tenant/get-platform-profile";
import { createClient } from "@/lib/supabase/server";

import { NO_STORE_HEADERS } from "./dashboard-access-constants";

export {
  NO_STORE_HEADERS,
  SUPER_ADMIN_DASHBOARD_HREF,
} from "./dashboard-access-constants";

/**
 * Server-side gate for Super portal dashboard aggregates.
 * Matches Super UI: active super_admin + enabled 2FA + ≥1 recovery code + verified session.
 * Fail-closed for platform_support, customers, anonymous, and incomplete MFA.
 */
export type SuperPortalDashboardAccessDenyReason =
  | "unauthenticated"
  | "forbidden"
  | "mfa_required"
  | "recovery_required"
  | "auth_guard_unavailable";

export type SuperPortalDashboardAccessEvaluation =
  | { allowed: true }
  | { allowed: false; reason: SuperPortalDashboardAccessDenyReason };

export function meetsSuperPortalDashboardTwoFactorPolicy(
  status: Extract<PlatformAccessEvaluation, { allowed: true }>["status"],
): boolean {
  return status.enabled === true && (status.recovery_codes_remaining ?? 0) >= 1;
}

export async function evaluateSuperPortalDashboardAccess(
  supabase: SupabaseClient,
): Promise<SuperPortalDashboardAccessEvaluation> {
  let privileged: PlatformAccessEvaluation;
  try {
    privileged = await evaluatePlatformPrivilegedAccess(supabase);
  } catch (error) {
    if (error instanceof PlatformAuthGuardUnavailableError) {
      return { allowed: false, reason: "auth_guard_unavailable" };
    }
    throw error;
  }

  if (!privileged.allowed) {
    switch (privileged.reason) {
      case "unauthenticated":
        return { allowed: false, reason: "unauthenticated" };
      case "forbidden":
        return { allowed: false, reason: "forbidden" };
      case "needs_enrollment":
      case "needs_verification":
        return { allowed: false, reason: "mfa_required" };
    }
  }

  const profile = await getPlatformProfile(supabase);
  if (!profile || profile.role !== "super_admin") {
    return { allowed: false, reason: "forbidden" };
  }

  if (!meetsSuperPortalDashboardTwoFactorPolicy(privileged.status)) {
    return { allowed: false, reason: "recovery_required" };
  }

  return { allowed: true };
}

export function mapSuperPortalDashboardAccessToResponse(
  evaluation: Extract<SuperPortalDashboardAccessEvaluation, { allowed: false }>,
): NextResponse {
  switch (evaluation.reason) {
    case "unauthenticated":
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: NO_STORE_HEADERS },
      );
    case "forbidden":
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403, headers: NO_STORE_HEADERS },
      );
    case "mfa_required":
      return NextResponse.json(
        { error: "mfa_required" },
        { status: 403, headers: NO_STORE_HEADERS },
      );
    case "recovery_required":
      return NextResponse.json(
        { error: "recovery_required" },
        { status: 403, headers: NO_STORE_HEADERS },
      );
    case "auth_guard_unavailable":
      return NextResponse.json(
        { error: "auth_guard_unavailable" },
        { status: 503, headers: NO_STORE_HEADERS },
      );
  }
}

/** True when a JSON body contains Super dashboard aggregate keys (leak detector). */
export function responseBodyContainsSuperAggregates(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const row = body as Record<string, unknown>;
  const aggregateKeys = [
    "total_organizations",
    "total_active_users",
    "total_active_subscriptions",
    "platform_administrator_count",
    "open_critical_incidents",
    "growth_trends",
    "executive_alerts",
    "platform_uptime_pct",
  ] as const;
  return aggregateKeys.some((key) => key in row);
}

/** Server Component mount gate — boolean only; never returns aggregates. */
export async function canRenderPlatformSuperAdminInsight(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const evaluation = await evaluateSuperPortalDashboardAccess(supabase);
    return evaluation.allowed;
  } catch {
    return false;
  }
}
