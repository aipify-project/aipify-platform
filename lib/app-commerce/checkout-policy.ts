/**
 * Production checkout stays closed. TEST checkout requires an explicit env gate
 * and must never open solely because a Stripe key exists.
 */

export type CommerceCheckoutGate = {
  checkoutEnabled: boolean;
  productionCheckoutClosed: true;
  environment: "production" | "preview" | "development" | "test" | "unknown";
  reasons: string[];
};

function resolveEnvironment(env: NodeJS.ProcessEnv = process.env): CommerceCheckoutGate["environment"] {
  const vercel = env.VERCEL_ENV;
  if (vercel === "production" || vercel === "preview" || vercel === "development") return vercel;
  if (env.NODE_ENV === "test") return "test";
  if (env.NODE_ENV === "production") return "production";
  if (env.NODE_ENV === "development") return "development";
  return "unknown";
}

/**
 * Hard gate for APP Commerce checkout.
 * - Production (Vercel or NODE_ENV): always closed.
 * - Elsewhere: only when AIPIFY_APP_COMMERCE_TEST_CHECKOUT=1.
 */
export function resolveAppCommerceCheckoutGate(
  env: NodeJS.ProcessEnv = process.env
): CommerceCheckoutGate {
  const environment = resolveEnvironment(env);
  const reasons: string[] = [];
  const explicitOpen = env.AIPIFY_APP_COMMERCE_TEST_CHECKOUT === "1";
  const forceClosed = env.AIPIFY_APP_COMMERCE_CHECKOUT_ENABLED === "0";

  if (environment === "production") {
    reasons.push("production_checkout_closed");
    return { checkoutEnabled: false, productionCheckoutClosed: true, environment, reasons };
  }

  if (forceClosed) {
    reasons.push("explicit_checkout_disabled");
    return { checkoutEnabled: false, productionCheckoutClosed: true, environment, reasons };
  }

  if (!explicitOpen) {
    reasons.push("test_checkout_flag_required");
    return { checkoutEnabled: false, productionCheckoutClosed: true, environment, reasons };
  }

  reasons.push("test_checkout_enabled");
  return { checkoutEnabled: true, productionCheckoutClosed: true, environment, reasons };
}

export function isAppCommerceCheckoutEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return resolveAppCommerceCheckoutGate(env).checkoutEnabled;
}

/** Stripe live keys must never open checkout through this path. */
export function isStripeSecretTestMode(secret: string | undefined): boolean {
  if (!secret) return false;
  return secret.startsWith("sk_test_");
}
