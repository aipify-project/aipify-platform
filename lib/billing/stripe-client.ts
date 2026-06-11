const STRIPE_API = "https://api.stripe.com/v1";

import { createHmac, timingSafeEqual } from "crypto";

function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

async function stripeRequest<T>(
  path: string,
  body: Record<string, string>
): Promise<T> {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error("Stripe is not configured");

  const params = new URLSearchParams(body);
  const res = await fetch(`${STRIPE_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok) {
    throw new Error(data.error?.message ?? "Stripe request failed");
  }
  return data;
}

export async function createStripeCheckoutSession(options: {
  customerEmail?: string;
  customerId?: string;
  priceId?: string;
  successUrl: string;
  cancelUrl: string;
  trialDays?: number;
}): Promise<{ url: string | null; sessionId: string; demoMode: boolean }> {
  const trialDays = options.trialDays ?? 14;
  const priceId = options.priceId ?? process.env.STRIPE_PRICE_ID_STARTER;

  if (!stripeConfigured() || !priceId) {
    return {
      url: null,
      sessionId: `demo_checkout_${Date.now()}`,
      demoMode: true,
    };
  }

  const body: Record<string, string> = {
    mode: "subscription",
    success_url: options.successUrl,
    cancel_url: options.cancelUrl,
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    "subscription_data[trial_period_days]": String(trialDays),
    "payment_method_collection": "always",
  };

  if (options.customerEmail) body.customer_email = options.customerEmail;
  if (options.customerId) body.customer = options.customerId;

  const session = await stripeRequest<{ id: string; url: string }>("/checkout/sessions", body);
  return { url: session.url, sessionId: session.id, demoMode: false };
}

export async function createStripePortalSession(options: {
  customerId: string;
  returnUrl: string;
}): Promise<{ url: string | null; demoMode: boolean }> {
  if (!stripeConfigured() || !options.customerId.startsWith("cus_")) {
    return { url: null, demoMode: true };
  }

  const session = await stripeRequest<{ url: string }>("/billing_portal/sessions", {
    customer: options.customerId,
    return_url: options.returnUrl,
  });

  return { url: session.url, demoMode: false };
}

export function verifyStripeWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const parts = Object.fromEntries(
    signature.split(",").map((part) => {
      const [key, value] = part.split("=");
      return [key, value];
    })
  ) as Record<string, string>;

  const timestamp = parts.t;
  const v1 = parts.v1;
  if (!timestamp || !v1) return false;

  const signed = `${timestamp}.${payload}`;
  const expected = createHmac("sha256", secret).update(signed, "utf8").digest("hex");
  return timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
}

export function mapStripeEventToPaymentEvent(eventType: string): string | null {
  switch (eventType) {
    case "checkout.session.completed":
      return "subscription_created";
    case "customer.subscription.created":
    case "customer.subscription.updated":
      return "subscription_updated";
    case "customer.subscription.deleted":
      return "subscription_cancelled";
    case "invoice.payment_succeeded":
      return "payment_succeeded";
    case "invoice.payment_failed":
      return "payment_failed";
    case "payment_method.attached":
      return "payment_succeeded";
    default:
      return null;
  }
}
