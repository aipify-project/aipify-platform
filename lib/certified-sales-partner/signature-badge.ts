/**
 * Certified Seller badge for system-generated partner signatures / locked email.
 * Partners cannot edit the badge; it is inserted only when certification is active.
 */

export const CSP_CERTIFIED_SELLER_BADGE_TEXT = "Certified Aipify Sales Partner" as const;

export type CspSignatureBadgeInput = {
  /** Product-specific certification must be passed and not revoked. */
  certificationActive: boolean;
  /** Partner must not be suspended/rejected/terminated. */
  partnerActive: boolean;
  /** Optional product label, e.g. "Buddy Web" / "Kompis Web". */
  productLabel?: string | null;
};

export type CspSignatureBadge = {
  show: boolean;
  text: string;
  html: string;
};

/** Builds the non-editable certification badge fragment for signatures. */
export function buildCertifiedSellerBadge(input: CspSignatureBadgeInput): CspSignatureBadge {
  const show = input.certificationActive === true && input.partnerActive === true;
  if (!show) {
    return { show: false, text: "", html: "" };
  }
  const product =
    typeof input.productLabel === "string" && input.productLabel.trim().length > 0
      ? ` – ${input.productLabel.trim()}`
      : "";
  const text = `${CSP_CERTIFIED_SELLER_BADGE_TEXT}${product}`;
  const html =
    `<span data-csp-certified-badge="1" style="display:inline-block;font-weight:600;color:#167A53;` +
    `border:1px solid #7253EA;border-radius:8px;padding:4px 10px;background:#F6F8FC">` +
    `${escapeAttr(text)}</span>`;
  return { show: true, text, html };
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Badge must disappear on suspension or certification revocation. */
export function shouldShowCertifiedBadge(input: CspSignatureBadgeInput): boolean {
  return buildCertifiedSellerBadge(input).show;
}
