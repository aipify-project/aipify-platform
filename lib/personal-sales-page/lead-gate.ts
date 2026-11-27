/**
 * Public interest registration is open.
 * Seller identity still comes only from the public page code resolved in Core.
 * The browser never supplies a seller id.
 */
export const PERSONAL_SALES_LEAD_GATE = "live" as const;

export function personalSalesLeadEnabled(): boolean {
  return true;
}

/** A lead request must not accept a seller id from the browser. */
export function rejectClientSellerIdentity(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const row = body as Record<string, unknown>;
  return "seller_id" in row || "partner_id" in row || "sellerId" in row || "partnerId" in row;
}
