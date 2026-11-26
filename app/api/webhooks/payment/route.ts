import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { timingSafeEqual } from "node:crypto";

const SUPPORTED_EVENTS = [
  "subscription_created",
  "subscription_updated",
  "payment_succeeded",
  "payment_failed",
  "subscription_cancelled",
  "trial_ended",
  "plan_upgraded",
  "plan_downgraded",
] as const;

function secretsEqual(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * Manual/internal payment webhook — fail-closed.
 * Requires AIPIFY_PAYMENT_WEBHOOK_SECRET and service_role Core access.
 * Does not accept unsigned JSON or cookie/anon clients.
 */
export async function POST(request: Request) {
  try {
    const expected = process.env.AIPIFY_PAYMENT_WEBHOOK_SECRET;
    const provided = request.headers.get("x-aipify-payment-webhook-secret") ?? "";
    if (!expected || !provided || !secretsEqual(provided, expected)) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const provider = (body.provider as string) ?? "manual";
    const eventType = body.event_type as string;
    const customerId = body.customer_id as string | undefined;
    const payload = (body.payload as Record<string, unknown>) ?? body;

    if (!eventType || !SUPPORTED_EVENTS.includes(eventType as (typeof SUPPORTED_EVENTS)[number])) {
      return NextResponse.json({ error: "Unsupported event_type" }, { status: 400 });
    }

    const supabase = createServiceRoleClient();
    const { data, error } = await supabase.rpc("handle_payment_webhook_event", {
      p_provider: provider,
      p_event_type: eventType,
      p_payload: payload,
      p_customer_id: customerId ?? null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}
