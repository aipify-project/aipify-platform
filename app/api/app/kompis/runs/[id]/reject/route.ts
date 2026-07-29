import { NextResponse } from "next/server";
import { isUuid, mapKompisOperatorRpcError } from "@/lib/kompis-operator/parse";
import { requireReadyAppPortalContext } from "@/lib/tenant/app-portal-route-access";
import { createClient } from "@/lib/supabase/server";

const headers = { "Cache-Control": "no-store" };

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    if (!isUuid(id ?? "")) {
      return NextResponse.json({ error: "Invalid id.", code: "invalid_input" }, { status: 400, headers });
    }
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "unauthorized" }, { status: 401, headers });
    }
    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;
    const body = (await request.json().catch(() => null)) as { reason?: string } | null;
    const reason = typeof body?.reason === "string" ? body.reason.slice(0, 500) : "";
    const { data, error } = await supabase.rpc("reject_app_kompis_operator_run", {
      p_run_id: id,
      p_reason: reason,
    });
    if (error) {
      const mapped = mapKompisOperatorRpcError(error.message);
      return NextResponse.json(
        { error: "Unable to reject run.", code: mapped.code },
        { status: mapped.status, headers },
      );
    }
    return NextResponse.json(data, { headers });
  } catch {
    return NextResponse.json({ error: "Unable to reject run.", code: "unknown" }, { status: 500, headers });
  }
}
