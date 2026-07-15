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
import {
  classifyPrivilegedPlatformRequest,
  isPlatformPrivilegedPortalValue,
  isPlatformPrivilegedScopeValue,
  isPrivilegedPlatformApiPath,
  listPlatformPrivilegedInventory,
  type ClassifyPrivilegedPlatformRequestInput,
  type PlatformPrivilegedClassification,
} from "@/lib/auth/platform-privileged-request";
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

export class PlatformAuthGuardUnavailableError extends Error {
  constructor(message = "Platform auth guard unavailable") {
    super(message);
    this.name = "PlatformAuthGuardUnavailableError";
  }
}

export {
  classifyPrivilegedPlatformRequest,
  isPlatformPrivilegedPortalValue,
  isPlatformPrivilegedScopeValue,
  isPrivilegedPlatformApiPath,
  listPlatformPrivilegedInventory,
};
export type { ClassifyPrivilegedPlatformRequestInput, PlatformPrivilegedClassification };

export function authGuardUnavailableResponse(): NextResponse {
  return NextResponse.json({ error: "auth_guard_unavailable" }, { status: 503 });
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

  let status: TwoFactorStatus | null;
  try {
    status = await getTwoFactorStatusForSession(supabase);
  } catch {
    throw new PlatformAuthGuardUnavailableError();
  }

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

export async function evaluatePlatformAdminAal2IfApplicable(
  supabase: SupabaseClient,
): Promise<PlatformAccessEvaluation | null> {
  const profile = await getPlatformProfile(supabase);
  if (!profile) {
    return null;
  }
  return evaluatePlatformPrivilegedAccess(supabase);
}

function mapEvaluationToApiResponse(
  evaluation: Extract<PlatformAccessEvaluation, { allowed: false }>,
): NextResponse {
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

export async function guardPrivilegedPlatformApi(
  supabase: SupabaseClient,
): Promise<NextResponse | null> {
  let evaluation: PlatformAccessEvaluation;
  try {
    evaluation = await evaluatePlatformPrivilegedAccess(supabase);
  } catch (error) {
    if (error instanceof PlatformAuthGuardUnavailableError) {
      return authGuardUnavailableResponse();
    }
    throw error;
  }

  if (evaluation.allowed) {
    return null;
  }

  return mapEvaluationToApiResponse(evaluation);
}

export async function guardPlatformAdminAal2IfApplicable(
  supabase: SupabaseClient,
): Promise<NextResponse | null> {
  let evaluation: PlatformAccessEvaluation | null;
  try {
    evaluation = await evaluatePlatformAdminAal2IfApplicable(supabase);
  } catch (error) {
    if (error instanceof PlatformAuthGuardUnavailableError) {
      return authGuardUnavailableResponse();
    }
    throw error;
  }

  if (!evaluation) {
    return null;
  }

  if (evaluation.allowed) {
    return null;
  }

  return mapEvaluationToApiResponse(evaluation);
}

export async function guardPrivilegedPlatformApiByClassification(
  supabase: SupabaseClient,
  classification: PlatformPrivilegedClassification,
): Promise<NextResponse | null> {
  if (!classification.privileged) {
    return null;
  }

  if (classification.kind === "platform_admin_if") {
    return guardPlatformAdminAal2IfApplicable(supabase);
  }

  return guardPrivilegedPlatformApi(supabase);
}

export async function guardPrivilegedPlatformApiRequest(
  input: ClassifyPrivilegedPlatformRequestInput,
  supabase: SupabaseClient,
): Promise<NextResponse | null> {
  const classification = classifyPrivilegedPlatformRequest(input);
  return guardPrivilegedPlatformApiByClassification(supabase, classification);
}

export async function guardPrivilegedPlatformPortalSession(
  supabase: SupabaseClient,
  portal: string,
): Promise<NextResponse | null> {
  if (!isPlatformPrivilegedPortalValue(portal)) {
    return null;
  }
  return guardPrivilegedPlatformApi(supabase);
}

export async function guardPrivilegedPlatformScopeSession(
  supabase: SupabaseClient,
  scope: string,
): Promise<NextResponse | null> {
  if (!isPlatformPrivilegedScopeValue(scope)) {
    return null;
  }
  return guardPrivilegedPlatformApi(supabase);
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
