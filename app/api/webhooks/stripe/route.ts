import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  mapStripeEventToPaymentEvent,
  verifyStripeWebhookSignature,
} from "@/lib/billing/stripe-client";

export async function POST(request: Request) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      const valid = verifyStripeWebhookSignature(payload, signature, webhookSecret);
      if (!valid) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    const event = JSON.parse(payload) as {
      type: string;
      data: { object: Record<string, unknown> };
    };

    const mappedEvent = mapStripeEventToPaymentEvent(event.type);
    const supabase = await createClient();

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

    return NextResponse.json({ received: true, event_type: event.type });
  } catch {
    return NextResponse.json({ error: "Failed to process Stripe webhook" }, { status: 500 });
  }
}
