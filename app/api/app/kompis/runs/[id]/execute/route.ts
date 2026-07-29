import { NextResponse } from "next/server";
import { executeKompisOperatorPlan } from "@/lib/kompis-operator/executor";
import type { KompisOperatorPlan } from "@/lib/kompis-operator/planner";
import { isUuid, mapKompisOperatorRpcError } from "@/lib/kompis-operator/parse";
import { requireReadyAppPortalContext } from "@/lib/tenant/app-portal-route-access";
import { createClient } from "@/lib/supabase/server";

const headers = { "Cache-Control": "no-store" };

function planFromRun(run: Record<string, unknown>): KompisOperatorPlan | null {
  const plan = (run.plan ?? run.plan_json) as Record<string, unknown> | undefined;
  if (!plan || !Array.isArray(plan.steps)) return null;
  return {
    intent: String(plan.intent ?? ""),
    title: String(plan.title ?? ""),
    userSummary: String(plan.userSummary ?? ""),
    riskClass: Number(plan.riskClass ?? 0) as 0 | 1 | 2 | 3,
    requiresApproval: plan.requiresApproval === true,
    steps: plan.steps.map((step, index) => {
      const s = step as Record<string, unknown>;
      return {
        sequence: Number(s.sequence ?? index + 1),
        toolKey: String(s.toolKey) as KompisOperatorPlan["steps"][number]["toolKey"],
        toolVersion: String(s.toolVersion ?? "1"),
        purpose: String(s.purpose ?? ""),
        riskClass: Number(s.riskClass ?? 0) as 0 | 1 | 2 | 3,
        requiresApproval: s.requiresApproval === true,
      };
    }),
    unavailableReason: typeof plan.unavailableReason === "string" ? plan.unavailableReason : undefined,
  };
}

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

    const { data: run, error: runError } = await supabase.rpc("get_app_kompis_operator_run", {
      p_run_id: id,
    });
    if (runError) {
      const mapped = mapKompisOperatorRpcError(runError.message);
      return NextResponse.json(
        { error: "Unable to execute run.", code: mapped.code },
        { status: mapped.status, headers },
      );
    }
    const runRecord = (run ?? {}) as Record<string, unknown>;
    const plan = planFromRun(runRecord);
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan.", code: "invalid_plan" }, { status: 400, headers });
    }
    const idempotencyKey = String(runRecord.idempotency_key ?? "");
    const result = await executeKompisOperatorPlan({
      supabase,
      runId: id,
      idempotencyKey,
      plan,
    });
    return NextResponse.json(result, { headers });
  } catch {
    return NextResponse.json({ error: "Unable to execute run.", code: "unknown" }, { status: 500, headers });
  }
}
