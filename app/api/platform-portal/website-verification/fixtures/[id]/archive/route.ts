import { NextResponse } from "next/server";
import { archiveWebsiteStagingFixture } from "@/lib/website-staging-verification/fixture";
import { mapWebsiteStagingRpcError } from "@/lib/website-staging-verification/errors";
import { validateWebsiteStagingInternalReason } from "@/lib/website-staging-verification/schema";
import { getPlatformProfile } from "@/lib/tenant/get-platform-profile";
import { assertWebsiteStagingWriteOrigin } from "@/lib/website-staging-verification/origin";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" } as const;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function jsonError(message: string, status: number, code: string) {
  return NextResponse.json({ error: message, code }, { status, headers: NO_STORE });
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const originGate = assertWebsiteStagingWriteOrigin(request);
    if (!originGate.ok) {
      return jsonError("Invalid origin.", originGate.status, originGate.code);
    }

    const { id } = await context.params;
    const fixtureId = (id ?? "").trim();
    if (!UUID_REGEX.test(fixtureId)) {
      return jsonError("Invalid fixture id.", 400, "invalid_fixture");
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
    const internalReason = typeof body.internalReason === "string" ? body.internalReason : "";

    const reasonCheck = validateWebsiteStagingInternalReason(internalReason);
    if (!reasonCheck.ok) {
      return jsonError(reasonCheck.detail, 400, reasonCheck.errorCode);
    }

    const result = await archiveWebsiteStagingFixture(supabase, {
      fixtureId,
      confirmation: true,
      internalReason,
    });

    if (!result.ok) {
      const mapped = mapWebsiteStagingRpcError(result.rawMessage);
      return jsonError("Unable to archive the fixture.", mapped.status, mapped.code);
    }

    return NextResponse.json(result.value, { headers: NO_STORE });
  } catch {
    return jsonError("Unable to archive the fixture.", 500, "unknown");
  }
}
