import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireReadyAppPortalContext } from "@/lib/tenant/app-portal-route-access";
import { assertKompisOperatorRateLimit } from "@/lib/kompis-operator/rate-limit";
import { mapKompisOperatorRpcError } from "@/lib/kompis-operator/parse";
import { createWebsitePublishIdempotencyKey, publishWebsiteCandidate } from "@/lib/website-cms/publish";

const headers = { "Cache-Control": "no-store" };

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

/**
 * POST { candidateId, expectedCurrentVersionId?, internalReason, confirmation, idempotencyKey? }
 * Publishing requires explicit `confirmation: true`. The RPC verifies the
 * live domain against the manifest checksum inline before marking the
 * operation `active` — never a "fake" publish.
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
    const candidateId = typeof body.candidateId === "string" ? body.candidateId : "";
    if (!candidateId) {
      return NextResponse.json({ error: "A candidate id is required.", code: "invalid_input" }, { status: 400, headers });
    }
    if (body.confirmation !== true) {
      return NextResponse.json(
        { error: "Explicit confirmation is required to publish.", code: "confirmation_required" },
        { status: 400, headers },
      );
    }
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
        : createWebsitePublishIdempotencyKey();

    const result = await publishWebsiteCandidate(supabase, {
      candidateId,
      expectedCurrentVersionId:
        typeof body.expectedCurrentVersionId === "string" ? body.expectedCurrentVersionId : null,
      internalReason,
      confirmation: true,
      idempotencyKey,
    });

    if (!result.ok) {
      const mapped = mapKompisOperatorRpcError(result.errorCode);
      return NextResponse.json(
        { error: "Website publish could not be completed.", code: result.errorCode },
        { status: mapped.status === 500 ? 409 : mapped.status, headers },
      );
    }

    return NextResponse.json({ publish: result }, { headers });
  } catch {
    return NextResponse.json(
      { error: "Website publish could not be completed.", code: "unknown" },
      { status: 500, headers },
    );
  }
}
