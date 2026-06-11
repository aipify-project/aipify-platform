import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createStripeCheckoutSession } from "@/lib/billing/stripe-client";
import { parsePlatformInstallActionResult } from "@/lib/aipify/platform-install";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const planKey = (body.plan_key as string) ?? "starter";
    const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const checkout = await createStripeCheckoutSession({
      customerEmail: user.email ?? undefined,
      successUrl: `${origin}/app/platform-install?checkout=success`,
      cancelUrl: `${origin}/app/platform-install?checkout=cancelled`,
      trialDays: 14,
      priceId: process.env[`STRIPE_PRICE_ID_${planKey.toUpperCase()}`] ?? process.env.STRIPE_PRICE_ID_STARTER,
    });

    if (checkout.demoMode) {
      const { data, error } = await supabase.rpc("register_trial_payment_method", {
        p_stripe_customer_id: `demo_cus_${Date.now()}`,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({
        ...parsePlatformInstallActionResult(data),
        demo_mode: true,
        billing_copy: "You will not be charged today. Your 14-day free trial starts after your payment method is registered.",
      });
    }

    return NextResponse.json({
      checkout_url: checkout.url,
      session_id: checkout.sessionId,
      demo_mode: false,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create checkout session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
