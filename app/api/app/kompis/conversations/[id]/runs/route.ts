import { NextResponse } from "next/server";
import {
  createKompisOperatorIdempotencyKey,
  planKompisOperatorRequest,
  planToRpcJson,
} from "@/lib/kompis-operator/planner";
import {
  isUuid,
  mapKompisOperatorRpcError,
  parseCreateRunInput,
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

    const body = await request.json().catch(() => null);
    const parsedBody = parseCreateRunInput(body);
    if (!parsedBody.ok) {
      return NextResponse.json({ error: "Invalid input.", code: parsedBody.code }, { status: 400, headers });
    }

    const plan = planKompisOperatorRequest(parsedBody.requestText);
    if (plan.riskClass === 3 || plan.unavailableReason === "critical_blocked") {
      return NextResponse.json(
        {
          blocked: true,
          riskClass: 3,
          plan,
          code: "critical_blocked",
        },
        { status: 422, headers },
      );
    }
    if (plan.steps.length === 0) {
      return NextResponse.json(
        {
          blocked: true,
          riskClass: plan.riskClass,
          plan,
          code: plan.unavailableReason ?? "unsupported_intent",
        },
        { status: 422, headers },
      );
    }

    const { data, error } = await supabase.rpc("create_app_kompis_operator_run", {
      p_conversation_id: id,
      p_request_text: parsedBody.requestText,
      p_plan: planToRpcJson(plan),
      p_idempotency_key: parsedBody.idempotencyKey || createKompisOperatorIdempotencyKey(),
    });
    if (error) {
      const mapped = mapKompisOperatorRpcError(error.message);
      return NextResponse.json(
        { error: "Unable to create run.", code: mapped.code },
        { status: mapped.status, headers },
      );
    }
    return NextResponse.json({ ...((data as object) ?? {}), plan }, { status: 201, headers });
  } catch {
    return NextResponse.json({ error: "Unable to create run.", code: "unknown" }, { status: 500, headers });
  }
}
