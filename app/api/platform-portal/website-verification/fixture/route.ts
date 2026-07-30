import { NextResponse } from "next/server";
import { createWebsiteStagingFixture } from "@/lib/website-staging-verification/fixture";
import { mapWebsiteStagingRpcError } from "@/lib/website-staging-verification/errors";
import {
  validateWebsiteStagingFixtureKey,
  validateWebsiteStagingIdempotencyKey,
  validateWebsiteStagingInternalReason,
  validateWebsiteStagingLocale,
} from "@/lib/website-staging-verification/schema";
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
    const fixtureKey = typeof body.fixtureKey === "string" ? body.fixtureKey : "";
    const locale = typeof body.locale === "string" ? body.locale : "en";
    const internalReason = typeof body.internalReason === "string" ? body.internalReason : "";
    const idempotencyKey = typeof body.idempotencyKey === "string" ? body.idempotencyKey : "";

    if (!UUID_REGEX.test(environmentId)) {
      return jsonError("Invalid environment id.", 400, "invalid_environment");
    }
    const fixtureKeyCheck = validateWebsiteStagingFixtureKey(fixtureKey);
    if (!fixtureKeyCheck.ok) {
      return jsonError(fixtureKeyCheck.detail, 400, fixtureKeyCheck.errorCode);
    }
    const localeCheck = validateWebsiteStagingLocale(locale);
    if (!localeCheck.ok) {
      return jsonError(localeCheck.detail, 400, localeCheck.errorCode);
    }
    const reasonCheck = validateWebsiteStagingInternalReason(internalReason);
    if (!reasonCheck.ok) {
      return jsonError(reasonCheck.detail, 400, reasonCheck.errorCode);
    }
    const keyCheck = validateWebsiteStagingIdempotencyKey(idempotencyKey);
    if (!keyCheck.ok) {
      return jsonError(keyCheck.detail, 400, keyCheck.errorCode);
    }

    const result = await createWebsiteStagingFixture(supabase, {
      environmentId,
      fixtureKey,
      locale,
      internalReason,
      confirmation: true,
      idempotencyKey,
    });

    if (!result.ok) {
      const mapped = mapWebsiteStagingRpcError(result.rawMessage);
      return jsonError("Unable to create the fixture.", mapped.status, mapped.code);
    }

    return NextResponse.json(result.value, { headers: NO_STORE });
  } catch {
    return jsonError("Unable to create the fixture.", 500, "unknown");
  }
}
