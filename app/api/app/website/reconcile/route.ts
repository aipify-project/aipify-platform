import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireReadyAppPortalContext } from "@/lib/tenant/app-portal-route-access";
import { assertKompisOperatorRateLimit } from "@/lib/kompis-operator/rate-limit";
import { mapKompisOperatorRpcError } from "@/lib/kompis-operator/parse";
import { reconcileWebsitePublish } from "@/lib/website-cms/reconcile";

const headers = { "Cache-Control": "no-store" };

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

/** POST { operationId } — re-runs the live-domain checksum verification for a pending operation. */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "unauthorized" }, { status: 401, headers });
    }
    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const rate = await assertKompisOperatorRateLimit({
      supabase,
      userId: user.id,
      organizationId: access.context.organization_id ?? "unknown",
      kind: "write",
    });
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many requests.", code: "rate_limited", resetInSeconds: rate.resetInSeconds ?? 60 },
        { status: 429, headers },
      );
    }

    const body = record(await request.json().catch(() => null));
    const operationId = typeof body.operationId === "string" ? body.operationId : "";
    if (!operationId) {
      return NextResponse.json({ error: "An operation id is required.", code: "invalid_input" }, { status: 400, headers });
    }

    const result = await reconcileWebsitePublish(supabase, operationId);
    if (!result.ok) {
      const mapped = mapKompisOperatorRpcError(result.errorCode);
      return NextResponse.json(
        { error: "Reconciliation could not be completed.", code: result.errorCode },
        { status: mapped.status === 500 ? 404 : mapped.status, headers },
      );
    }
    return NextResponse.json({ reconcile: result }, { headers });
  } catch {
    return NextResponse.json(
      { error: "Reconciliation could not be completed.", code: "unknown" },
      { status: 500, headers },
    );
  }
}
