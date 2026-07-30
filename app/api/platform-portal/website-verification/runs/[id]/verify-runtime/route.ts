import { NextResponse } from "next/server";
import { verifyWebsiteStagingRuntime } from "@/lib/website-staging-verification/runtime";
import { mapWebsiteStagingRpcError } from "@/lib/website-staging-verification/errors";
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
    const runId = (id ?? "").trim();
    if (!UUID_REGEX.test(runId)) {
      return jsonError("Invalid run id.", 400, "invalid_run");
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

    const result = await verifyWebsiteStagingRuntime(supabase, runId);
    if (!result.ok) {
      const mapped = mapWebsiteStagingRpcError(result.rawMessage);
      return jsonError("Unable to verify runtime status.", mapped.status, mapped.code);
    }

    return NextResponse.json(result.value, { headers: NO_STORE });
  } catch {
    return jsonError("Unable to verify runtime status.", 500, "unknown");
  }
}
