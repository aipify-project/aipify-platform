/**
 * Public interest registration is closed.
 * No Core function resolves a public seller code into a stored lead
 * without trusting a client-supplied seller id.
 */
export const PERSONAL_SALES_LEAD_GATE = "core_pending" as const;

export function personalSalesLeadEnabled(): false {
  return false;
}

/** A lead request must not accept a seller id from the browser. */
export function rejectClientSellerIdentity(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const row = body as Record<string, unknown>;
  return "seller_id" in row || "partner_id" in row || "sellerId" in row || "partnerId" in row;
}
