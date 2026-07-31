import { NextResponse } from "next/server";
import {
  isUuid,
  mapKompisOperatorRpcError,
  parseApproveInput,
} from "@/lib/kompis-operator/parse";
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
    const input = parseApproveInput(await request.json().catch(() => null));
    if (!input.ok) {
      return NextResponse.json({ error: "Invalid input.", code: input.code }, { status: 400, headers });
    }
    const { data, error } = await supabase.rpc("approve_app_kompis_operator_run", {
      p_run_id: id,
      p_confirmation: input.confirmation,
      p_reason: input.reason,
    });
    if (error) {
      const mapped = mapKompisOperatorRpcError(error.message);
      return NextResponse.json(
        { error: "Unable to approve run.", code: mapped.code },
        { status: mapped.status, headers },
      );
    }
    const payload = (data ?? {}) as Record<string, unknown>;
    if (payload.code === "core_approval_decision_required" || payload.decision_path === "approval_center") {
      return NextResponse.json(
        { ...payload, code: "core_approval_decision_required" },
        { status: 409, headers },
      );
    }
    return NextResponse.json(data, { headers });
  } catch {
    return NextResponse.json({ error: "Unable to approve run.", code: "unknown" }, { status: 500, headers });
  }
}
