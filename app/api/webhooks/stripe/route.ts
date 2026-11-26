import { NextResponse } from "next/server";
import {
  authorizeStripeWebhook,
  mapStripeEventToPaymentEvent,
} from "@/lib/billing/stripe-client";
import { maybeApplyCspPaidPeriodFromAuthorizedStripeTest } from "@/lib/certified-sales-partner/stripe-test-webhook";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

/**
 * Stripe webhook — signature fail-closed (#365), then Core mutation via service_role only.
 * Never call payment mutation RPCs with the anon/authenticated PostgREST key.
 */
export async function POST(request: Request) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const authorized = authorizeStripeWebhook({
      payload,
      signature,
      secret: webhookSecret,
    });
    if (!authorized.ok) {
      return NextResponse.json({ error: authorized.error }, { status: authorized.status });
    }

    const event = JSON.parse(payload) as {
      id?: string;
      type: string;
      data: { object: Record<string, unknown> };
    };

    const mappedEvent = mapStripeEventToPaymentEvent(event.type);
    const supabase = createServiceRoleClient();

    if (mappedEvent) {
      const customerId =
        (event.data.object.metadata as Record<string, string> | undefined)?.customer_id ??
        (event.data.object.customer as string | undefined);

      await supabase.rpc("handle_payment_webhook_event", {
        p_provider: "stripe",
        p_event_type: mappedEvent,
        p_payload: event.data.object,
        p_customer_id: customerId ?? null,
      });
    }

    if (event.type === "checkout.session.completed" || event.type === "payment_method.attached") {
      const customer = event.data.object.customer as string | undefined;
      if (customer) {
        await supabase.rpc("register_trial_payment_method", {
          p_stripe_customer_id: customer,
        });
      }
    }

    // CSP commission: TEST bridge only, after signature gate, metadata-driven, never LIVE.
    const eventId = typeof event.id === "string" ? event.id : "";
    if (eventId) {
      await maybeApplyCspPaidPeriodFromAuthorizedStripeTest({
        eventId,
        eventType: event.type,
        object: event.data.object as {
          id?: string;
          amount_paid?: number;
          metadata?: Record<string, unknown> | null;
        },
      });
    }

    return NextResponse.json({ received: true, event_type: event.type });
  } catch {
    return NextResponse.json({ error: "Failed to process Stripe webhook" }, { status: 500 });
  }
}
