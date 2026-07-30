import { NextResponse } from "next/server";
import { startWebsiteReleaseVerificationRun } from "@/lib/website-staging-verification/runs";
import { mapWebsiteStagingRpcError } from "@/lib/website-staging-verification/errors";
import { validateWebsiteStagingIdempotencyKey, validateWebsiteStagingInternalReason } from "@/lib/website-staging-verification/schema";
import { getPlatformProfile } from "@/lib/tenant/get-platform-profile";
import { assertWebsiteStagingWriteOrigin } from "@/lib/website-staging-verification/origin";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" } as const;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function jsonError(message: string, status: number, code: string) {
  return NextResponse.json({ error: message, code }, { status, headers: NO_STORE });
}

export async function POST(request: Request) {
  try {
    const originGate = assertWebsiteStagingWriteOrigin(request);
    if (!originGate.ok) {
      return jsonError("Invalid origin.", originGate.status, originGate.code);
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return jsonError("Unauthorized", 401, "unauthorized");
    }

    const profile = await getPlatformProfile(supabase);
    if (!profile || profile.role !== "super_admin") {
      return jsonError("Forbidden", 403, "forbidden");
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const environmentId = typeof body.environmentId === "string" ? body.environmentId : "";
    const fixtureId = typeof body.fixtureId === "string" ? body.fixtureId : "";
    const internalReason = typeof body.internalReason === "string" ? body.internalReason : "";
    const idempotencyKey = typeof body.idempotencyKey === "string" ? body.idempotencyKey : "";

    if (!UUID_REGEX.test(environmentId)) {
      return jsonError("Invalid environment id.", 400, "invalid_environment");
    }
    if (!UUID_REGEX.test(fixtureId)) {
      return jsonError("Invalid fixture id.", 400, "invalid_fixture");
    }
    const reasonCheck = validateWebsiteStagingInternalReason(internalReason);
    if (!reasonCheck.ok) {
      return jsonError(reasonCheck.detail, 400, reasonCheck.errorCode);
    }
    const keyCheck = validateWebsiteStagingIdempotencyKey(idempotencyKey);
    if (!keyCheck.ok) {
      return jsonError(keyCheck.detail, 400, keyCheck.errorCode);
    }

    const result = await startWebsiteReleaseVerificationRun(supabase, {
      environmentId,
      fixtureId,
      internalReason,
      confirmation: true,
      idempotencyKey,
    });

    if (!result.ok) {
      const mapped = mapWebsiteStagingRpcError(result.rawMessage);
      return jsonError("Unable to start the verification run.", mapped.status, mapped.code);
    }

    return NextResponse.json(result.value, { headers: NO_STORE });
  } catch {
    return jsonError("Unable to start the verification run.", 500, "unknown");
  }
}
