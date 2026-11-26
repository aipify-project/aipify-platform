const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function metaString(meta: Record<string, unknown> | null | undefined, keys: string[]): string | null {
  if (!meta) return null;
  for (const key of keys) {
    const value = meta[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

/**
 * Resolve Aipify customer UUID from a signed Stripe object.
 * Never treat Stripe cus_* identifiers as Postgres UUIDs.
 */
export function resolveAipifyCustomerIdFromStripeObject(
  object: Record<string, unknown>
): string | null {
  const meta = asRecord(object.metadata);
  const fromMeta = metaString(meta, [
    "aipify_customer_id",
    "customer_id",
    "aipify_customer_uuid",
  ]);
  if (fromMeta && UUID_RE.test(fromMeta)) return fromMeta;

  // Some subscription payloads nest metadata under subscription item — already covered above.
  return null;
}

export function extractPlanKeyFromStripeObject(object: Record<string, unknown>): string | null {
  const meta = asRecord(object.metadata);
  const plan = metaString(meta, ["plan_key", "product_key", "commerce_offer_id"]);
  return plan;
}

export function buildPaymentWebhookPayload(object: Record<string, unknown>): Record<string, unknown> {
  const planKey = extractPlanKeyFromStripeObject(object);
  return {
    ...object,
    ...(planKey ? { plan_key: planKey } : {}),
  };
}
