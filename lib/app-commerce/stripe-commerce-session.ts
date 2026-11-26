const STRIPE_API = "https://api.stripe.com/v1";

async function stripeRequest<T>(
  path: string,
  body: Record<string, string>,
  idempotencyKey?: string
): Promise<T> {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error("Stripe is not configured");

  const headers: Record<string, string> = {
    Authorization: `Bearer ${secret}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey.slice(0, 255);

  const params = new URLSearchParams(body);
  const res = await fetch(`${STRIPE_API}${path}`, {
    method: "POST",
    headers,
    body: params.toString(),
  });

  const data = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok) {
    throw new Error(data.error?.message ?? "Stripe request failed");
  }
  return data;
}

/**
 * Commerce-scoped Stripe Checkout session.
 * Does not inherit the legacy default trialDays=14 — trial comes from published offer policy.
 */
export async function createCommerceStripeCheckoutSession(options: {
  priceId: string;
  customerEmail?: string;
  stripeCustomerId?: string;
  successUrl: string;
  cancelUrl: string;
  trialDays: number;
  metadata: Record<string, string>;
  idempotencyKey: string;
}): Promise<{ url: string | null; sessionId: string }> {
  const body: Record<string, string> = {
    mode: "subscription",
    success_url: options.successUrl,
    cancel_url: options.cancelUrl,
    "line_items[0][price]": options.priceId,
    "line_items[0][quantity]": "1",
    payment_method_collection: "always",
  };

  if (options.trialDays > 0) {
    body["subscription_data[trial_period_days]"] = String(options.trialDays);
  }

  if (options.customerEmail) body.customer_email = options.customerEmail;
  if (options.stripeCustomerId?.startsWith("cus_")) body.customer = options.stripeCustomerId;

  for (const [key, value] of Object.entries(options.metadata)) {
    if (!value) continue;
    body[`metadata[${key}]`] = value.slice(0, 500);
    body[`subscription_data[metadata][${key}]`] = value.slice(0, 500);
  }

  const session = await stripeRequest<{ id: string; url: string | null }>(
    "/checkout/sessions",
    body,
    options.idempotencyKey
  );
  return { url: session.url, sessionId: session.id };
}
