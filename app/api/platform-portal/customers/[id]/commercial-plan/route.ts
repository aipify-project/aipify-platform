import { NextResponse } from "next/server";
import {
  mapCommercialPlanRpcError,
  parsePlatformPortalCustomerCommercialPlanResult,
  parseSetCommercialPlanInput,
} from "@/lib/platform-portal/commercial-plan";
import { createClient } from "@/lib/supabase/server";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const NO_STORE = { "Cache-Control": "no-store" } as const;

function jsonError(message: string, status: number, code?: string) {
  return NextResponse.json(
    code ? { error: message, code } : { error: message },
    { status, headers: NO_STORE },
  );
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const customerId = (id ?? "").trim();
    if (!UUID_REGEX.test(customerId)) {
      return jsonError("Invalid customer id.", 400, "invalid_customer");
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return jsonError("Unauthorized", 401, "unauthorized");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid JSON body.", 400, "unknown");
    }

    const parsedInput = parseSetCommercialPlanInput(customerId, body);
    if (!parsedInput.ok) {
      return jsonError("Invalid commercial plan input.", 400, parsedInput.code);
    }

    const { value } = parsedInput;
    const { data, error } = await supabase.rpc("set_platform_portal_customer_commercial_plan", {
      p_customer_id: value.customerId,
      p_plan_id: value.planId,
      p_mode: value.mode,
      p_start_mode: value.startMode,
      p_trial_days: value.trialDays,
      p_internal_reason: value.internalReason,
      p_idempotency_key: value.idempotencyKey,
    });

    if (error) {
      const mapped = mapCommercialPlanRpcError(error.message);
      return jsonError("Unable to set commercial plan.", mapped.status, mapped.code);
    }

    const parsed = parsePlatformPortalCustomerCommercialPlanResult(data);
    if (!parsed) {
      return jsonError("Unable to set commercial plan.", 500, "unknown");
    }

    const status = parsed.idempotentReplay || !parsed.created ? 200 : 201;
    return NextResponse.json(parsed, { status, headers: NO_STORE });
  } catch {
    return jsonError("Unable to set commercial plan.", 500, "unknown");
  }
}
