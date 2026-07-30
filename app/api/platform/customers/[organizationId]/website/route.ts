import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { mapKompisOperatorRpcError } from "@/lib/kompis-operator/parse";

const headers = { "Cache-Control": "no-store" };

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

/** GET — read-only Website CMS status for one customer. Platform admin only (RPC-enforced). */
export async function GET(
  _request: Request,
  context: { params: Promise<{ organizationId: string }> },
) {
  try {
    const { organizationId } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "unauthorized" }, { status: 401, headers });
    }

    const { data, error } = await supabase.rpc("platform_get_customer_website_status", {
      p_organization_id: organizationId,
    });
    if (error) {
      const mapped = mapKompisOperatorRpcError(error.message);
      return NextResponse.json(
        { error: "Website status could not be loaded.", code: mapped.code },
        { status: mapped.status, headers },
      );
    }
    return NextResponse.json(data, { headers });
  } catch {
    return NextResponse.json(
      { error: "Website status could not be loaded.", code: "unknown" },
      { status: 500, headers },
    );
  }
}

/** POST { internalReason } — platform-triggered ensure (no content edit, no publish). Platform admin only. */
export async function POST(
  request: Request,
  context: { params: Promise<{ organizationId: string }> },
) {
  try {
    const { organizationId } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "unauthorized" }, { status: 401, headers });
    }

    const body = record(await request.json().catch(() => null));
    const internalReason =
      typeof body.internalReason === "string" && body.internalReason.trim() ? body.internalReason.trim() : "";
    if (!internalReason) {
      return NextResponse.json(
        { error: "An internal reason is required.", code: "invalid_internal_reason" },
        { status: 400, headers },
      );
    }

    const { data, error } = await supabase.rpc("platform_ensure_customer_website", {
      p_organization_id: organizationId,
      p_internal_reason: internalReason,
    });
    if (error) {
      const mapped = mapKompisOperatorRpcError(error.message);
      return NextResponse.json(
        { error: "Website could not be provisioned.", code: mapped.code },
        { status: mapped.status, headers },
      );
    }
    return NextResponse.json(data, { headers });
  } catch {
    return NextResponse.json(
      { error: "Website could not be provisioned.", code: "unknown" },
      { status: 500, headers },
    );
  }
}
