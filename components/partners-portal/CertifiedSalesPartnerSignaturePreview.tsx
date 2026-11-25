"use client";

import {
  buildCertifiedSellerBadge,
  CSP_CERTIFIED_SELLER_BADGE_TEXT,
} from "@/lib/certified-sales-partner/signature-badge";

export type CspSignaturePreviewLabels = {
  title: string;
  intro: string;
  lockedNote: string;
  badgeActive: string;
  badgeInactive: string;
  copyHtml: string;
  copied: string;
};

/**
 * Read-only preview of the locked Certified Aipify Sales Partner signature badge.
 * Partners cannot edit badge HTML or certification claims.
 */
export function CertifiedSalesPartnerSignaturePreview({
  labels,
  certificationActive,
  partnerActive,
  partnerName,
  companyName,
  productLabel = "Kompis Web",
}: {
  labels: CspSignaturePreviewLabels;
  certificationActive: boolean;
  partnerActive: boolean;
  partnerName: string;
  companyName: string;
  productLabel?: string;
}) {
  const badge = buildCertifiedSellerBadge({
    certificationActive,
    partnerActive,
    productLabel,
  });

  return (
    <section
      className="rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-6 shadow-sm"
      aria-labelledby="csp-signature-preview-title"
    >
      <h2 id="csp-signature-preview-title" className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">
        {labels.title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[color:var(--aipify-text-secondary)]">{labels.intro}</p>
      <p className="mt-3 rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-canvas)] px-3 py-2 text-xs text-[color:var(--aipify-text-secondary)]">
        {labels.lockedNote}
      </p>

      <div className="mt-5 rounded-xl border border-[color:var(--aipify-border)] bg-white p-5 text-sm text-[color:var(--aipify-text-primary)]">
        <p className="font-semibold">{partnerName || "—"}</p>
        {badge.show ? (
          <p className="mt-1 font-semibold text-[#167A53]">{badge.text || CSP_CERTIFIED_SELLER_BADGE_TEXT}</p>
        ) : (
          <p className="mt-1 text-[color:var(--aipify-text-secondary)]">{labels.badgeInactive}</p>
        )}
        <p className="mt-2 text-[color:var(--aipify-text-secondary)]">{companyName || "—"}</p>
        {badge.show ? (
          <p className="mt-3 text-xs font-medium text-[color:var(--aipify-companion-purple)]">{labels.badgeActive}</p>
        ) : null}
      </div>
    </section>
  );
}
