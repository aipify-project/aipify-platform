import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createStripePortalSession } from "@/lib/billing/stripe-client";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const customerId = body.stripe_customer_id as string | undefined;
    const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let stripeCustomerId = customerId;
    if (!stripeCustomerId) {
      const { data: trial } = await supabase.rpc("get_billing_trial_status");
      const trialData = trial as { stripe_customer_id?: string } | null;
      stripeCustomerId = trialData?.stripe_customer_id;
    }

    const portal = await createStripePortalSession({
      customerId: stripeCustomerId ?? "demo_cus",
      returnUrl: `${origin}/app/platform-install`,
    });

    if (portal.demoMode) {
      return NextResponse.json({
        portal_url: `${origin}/app/settings/billing`,
        demo_mode: true,
      });
    }

    return NextResponse.json({ portal_url: portal.url, demo_mode: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create portal session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
