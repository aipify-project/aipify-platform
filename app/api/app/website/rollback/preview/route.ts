import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireReadyAppPortalContext } from "@/lib/tenant/app-portal-route-access";
import { assertKompisOperatorRateLimit } from "@/lib/kompis-operator/rate-limit";
import { mapKompisOperatorRpcError } from "@/lib/kompis-operator/parse";
import { createWebsiteVersionPreview } from "@/lib/website-cms/preview";

const headers = { "Cache-Control": "no-store" };

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

/**
 * POST { targetVersionId, locale? } — creates a noindex preview of a prior
 * version so an operator can review it before confirming a rollback.
 */
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
    const targetVersionId = typeof body.targetVersionId === "string" ? body.targetVersionId : "";
    if (!targetVersionId) {
      return NextResponse.json(
        { error: "A target version id is required.", code: "invalid_input" },
        { status: 400, headers },
      );
    }
    const locale = typeof body.locale === "string" && body.locale.trim() ? body.locale.trim() : "en";

    const result = await createWebsiteVersionPreview(supabase, targetVersionId, locale);
    if (!result.ok) {
      const mapped = mapKompisOperatorRpcError(result.errorCode);
      return NextResponse.json(
        { error: "Rollback preview could not be created.", code: result.errorCode },
        { status: mapped.status === 500 ? 404 : mapped.status, headers },
      );
    }
    return NextResponse.json({ preview: result }, { headers });
  } catch {
    return NextResponse.json(
      { error: "Rollback preview could not be created.", code: "unknown" },
      { status: 500, headers },
    );
  }
}
