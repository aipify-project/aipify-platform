import { NextResponse } from "next/server";
import {
  mapAppKompisDeliveryRpcError,
  parseDeliverAppKompisInput,
  parsePlatformPortalAppKompisReconcileResult,
} from "@/lib/platform-portal/app-kompis-delivery";
import { createClient } from "@/lib/supabase/server";

const headers = { "Cache-Control": "no-store" };
const fail = (error: string, status: number, code: string) =>
  NextResponse.json({ error, code }, { status, headers });

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return fail("Unauthorized", 401, "unauthorized");
    const input = parseDeliverAppKompisInput(id ?? "", await request.json().catch(() => null));
    if (!input.ok) return fail("Invalid reconciliation input.", 400, input.code);
    const { data, error } = await supabase.rpc(
      "reconcile_platform_customer_app_and_website_kompis",
      {
        p_customer_id: input.value.customerId,
        p_internal_reason: input.value.internalReason,
        p_confirmation: input.value.confirmation,
        p_idempotency_key: input.value.idempotencyKey,
      },
    );
    if (error) {
      const mapped = mapAppKompisDeliveryRpcError(error.message);
      return fail("Unable to reconcile APP and Website Kompis.", mapped.status, mapped.code);
    }
    const parsed = parsePlatformPortalAppKompisReconcileResult(data);
    if (!parsed) return fail("Unable to reconcile APP and Website Kompis.", 500, "unknown");
    const status =
      parsed.deliveryStatus === "awaiting_confirmation" ? 202 : parsed.created ? 201 : 200;
    return NextResponse.json(parsed, { status, headers });
  } catch {
    return fail("Unable to reconcile APP and Website Kompis.", 500, "unknown");
  }
}
