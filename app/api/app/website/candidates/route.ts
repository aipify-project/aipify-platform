import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireReadyAppPortalContext } from "@/lib/tenant/app-portal-route-access";
import { assertKompisOperatorRateLimit } from "@/lib/kompis-operator/rate-limit";
import { mapKompisOperatorRpcError } from "@/lib/kompis-operator/parse";
import { createKompisOperatorIdempotencyKey } from "@/lib/kompis-operator/ids";
import { buildWebsiteCandidateFromDrafts } from "@/lib/website-cms/candidate";

const headers = { "Cache-Control": "no-store" };

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

/** POST { draftIds, locales, expectedDraftVersions?, internalReason, idempotencyKey? } */
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
    const draftIds = Array.isArray(body.draftIds) ? body.draftIds.filter((v): v is string => typeof v === "string") : [];
    const locales = Array.isArray(body.locales) ? body.locales.filter((v): v is string => typeof v === "string") : [];
    const internalReason =
      typeof body.internalReason === "string" && body.internalReason.trim() ? body.internalReason.trim() : "";
    if (!internalReason) {
      return NextResponse.json(
        { error: "An internal reason is required.", code: "invalid_internal_reason" },
        { status: 400, headers },
      );
    }
    const idempotencyKey =
      typeof body.idempotencyKey === "string" && body.idempotencyKey
        ? body.idempotencyKey
        : createKompisOperatorIdempotencyKey();

    const result = await buildWebsiteCandidateFromDrafts(supabase, {
      draftIds,
      locales,
      expectedDraftVersions:
        body.expectedDraftVersions && typeof body.expectedDraftVersions === "object"
          ? (body.expectedDraftVersions as Record<string, number>)
          : {},
      internalReason,
      idempotencyKey,
    });

    if (!result.ok) {
      const mapped = mapKompisOperatorRpcError(result.errorCode);
      return NextResponse.json(
        { error: "Website candidate could not be built.", code: result.errorCode },
        { status: mapped.status === 500 ? 400 : mapped.status, headers },
      );
    }

    return NextResponse.json({ candidate: result }, { headers });
  } catch {
    return NextResponse.json(
      { error: "Website candidate could not be built.", code: "unknown" },
      { status: 500, headers },
    );
  }
}
