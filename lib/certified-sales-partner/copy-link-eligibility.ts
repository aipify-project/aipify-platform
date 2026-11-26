/**
 * CSP "copy sales link" eligibility — pure, client-safe, no I/O.
 *
 * The UI uses this to decide whether a copy/share action is offered. It mirrors the server-side
 * gates in `POST /api/certified-sales-partner/links` (which remain authoritative and are
 * re-evaluated on every link creation) — it never replaces them.
 *
 * A link may be copied ONLY when ALL hold:
 *  1. the product is not a future product and has a public destination,
 *  2. the partner is approved (`approved` | `active` | `certified`),
 *  3. the product is published by Platform (Core lists it in the partner overview),
 *  4. the partner's certification for that product has passed,
 *  5. the agreement has not been reported as missing by Core.
 */
import { resolveCspProductDestination } from "./attribution-policy";
import { evaluateSalesLinkGates, type CspParsedOverview } from "./partner-overview";
import { CSP_CATALOG_PRODUCTS } from "./product-catalog-display";
import type { CspSalesLinkGate } from "./academy-quiz";

export const CSP_COPY_LINK_BLOCK_REASONS = [
  "future_product",
  "no_public_page",
  "partner_not_approved",
  "not_published",
  "not_certified",
  "agreement_missing",
] as const;
export type CspCopyLinkBlockReason = (typeof CSP_COPY_LINK_BLOCK_REASONS)[number];

export type CspCopyLinkEligibility = {
  allowed: boolean;
  /** First blocking reason in priority order; `null` when allowed. */
  reason: CspCopyLinkBlockReason | null;
  gates: CspSalesLinkGate;
};

export function evaluateCspCopyLinkEligibility(
  overview: CspParsedOverview,
  productKey: string,
): CspCopyLinkEligibility {
  const evaluation = evaluateSalesLinkGates(overview, productKey);
  const catalog = CSP_CATALOG_PRODUCTS.find((p) => p.key === productKey);

  let reason: CspCopyLinkBlockReason | null = null;
  if (catalog?.future === true || catalog?.sellable === false) reason = "future_product";
  else if (resolveCspProductDestination(productKey) === null) reason = "no_public_page";
  else if (!evaluation.gates.partnerApproved) reason = "partner_not_approved";
  else if (!evaluation.gates.productPublished) reason = "not_published";
  else if (!evaluation.gates.certificationPassed) reason = "not_certified";
  else if (!evaluation.gates.agreementAccepted) reason = "agreement_missing";

  return { allowed: reason === null && evaluation.allowed, reason, gates: evaluation.gates };
}
