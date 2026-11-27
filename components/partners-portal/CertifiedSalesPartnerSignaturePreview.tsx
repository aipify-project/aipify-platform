"use client";

import { useMemo, useState } from "react";
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
  copyText?: string;
  copyLink?: string;
  previewTab?: string;
  missingRequirements?: string;
  aipifySite?: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Professional seller signature — photo, Aipify branding, personal link.
 * Never claims certification without server-backed gates.
 */
export function CertifiedSalesPartnerSignaturePreview({
  labels,
  certificationActive,
  partnerActive,
  partnerName,
  companyName,
  productLabel = "Kompis Web",
  avatarUrl = null,
  salesLink = null,
}: {
  labels: CspSignaturePreviewLabels;
  certificationActive: boolean;
  partnerActive: boolean;
  partnerName: string;
  companyName: string;
  productLabel?: string;
  avatarUrl?: string | null;
  salesLink?: string | null;
}) {
  const [notice, setNotice] = useState<string | null>(null);
  const badge = buildCertifiedSellerBadge({
    certificationActive,
    partnerActive,
    productLabel,
  });
  const canOfferLiveSignature = badge.show && Boolean(salesLink);

  const plainText = useMemo(() => {
    const lines = [
      partnerName || "",
      badge.show ? badge.text || CSP_CERTIFIED_SELLER_BADGE_TEXT : "",
      companyName && companyName !== partnerName ? companyName : "",
      "aipify.ai",
      salesLink || "",
    ].filter(Boolean);
    return lines.join("\n");
  }, [badge.show, badge.text, companyName, partnerName, salesLink]);

  const html = useMemo(() => {
    if (!canOfferLiveSignature) return "";
    const photo = avatarUrl
      ? `<img src="${escapeHtml(avatarUrl)}" alt="" width="56" height="56" style="border-radius:12px;object-fit:cover;display:block;" />`
      : "";
    const logo =
      `<img src="https://aipify.ai/website-kompis/design-v1/brand/aipify-logo-dark.png" alt="Aipify" width="110" height="32" style="display:block;border:0;" />`;
    return (
      `<table role="presentation" cellpadding="0" cellspacing="0" style="font-family:Arial,Helvetica,sans-serif;color:#1E293B;font-size:14px;line-height:1.45;">` +
      `<tr>` +
      (photo ? `<td style="padding-right:14px;vertical-align:top;">${photo}</td>` : "") +
      `<td style="vertical-align:top;">` +
      `<div style="font-weight:700;font-size:15px;">${escapeHtml(partnerName || "")}</div>` +
      (badge.html ? `<div style="margin-top:6px;">${badge.html}</div>` : "") +
      (companyName && companyName !== partnerName
        ? `<div style="margin-top:6px;color:#64748B;">${escapeHtml(companyName)}</div>`
        : "") +
      `<div style="margin-top:10px;">${logo}</div>` +
      `<div style="margin-top:8px;"><a href="https://aipify.ai" style="color:#7C3AED;text-decoration:none;">aipify.ai</a></div>` +
      (salesLink
        ? `<div style="margin-top:6px;"><a href="${escapeHtml(salesLink)}" style="color:#7C3AED;text-decoration:none;">${escapeHtml(salesLink)}</a></div>`
        : "") +
      `</td></tr></table>`
    );
  }, [avatarUrl, badge.html, canOfferLiveSignature, companyName, partnerName, salesLink]);

  async function copy(value: string, okLabel: string) {
    try {
      await navigator.clipboard.writeText(value);
      setNotice(okLabel);
    } catch {
      setNotice(labels.lockedNote);
    }
  }

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

      {!canOfferLiveSignature ? (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950" role="status">
          {labels.missingRequirements ?? labels.badgeInactive}
        </p>
      ) : null}

      <div className="mt-5 rounded-xl border border-[color:var(--aipify-border)] bg-white p-5 text-sm text-[color:var(--aipify-text-primary)]">
        <div className="flex items-start gap-4">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- partner avatar pointer
            <img src={avatarUrl} alt="" className="h-14 w-14 rounded-xl object-cover" />
          ) : (
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[#F3EDFF] text-lg font-semibold text-[#7C3AED]">
              {(partnerName || "?").slice(0, 1).toUpperCase()}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{partnerName || "—"}</p>
            {badge.show ? (
              <p className="mt-1 font-semibold text-[#167A53]">{badge.text || CSP_CERTIFIED_SELLER_BADGE_TEXT}</p>
            ) : (
              <p className="mt-1 text-[color:var(--aipify-text-secondary)]">{labels.badgeInactive}</p>
            )}
            <p className="mt-2 text-[color:var(--aipify-text-secondary)]">{companyName || "—"}</p>
            {/* eslint-disable-next-line @next/next/no-img-element -- official brand mark */}
            <img
              src="/website-kompis/design-v1/brand/aipify-logo-dark.png"
              alt="Aipify"
              className="mt-3 h-8 w-auto"
            />
            <p className="mt-2 text-sm text-[#7C3AED]">{labels.aipifySite ?? "aipify.ai"}</p>
            {salesLink ? (
              <p className="mt-1 break-all text-xs text-[color:var(--aipify-text-secondary)]">{salesLink}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!canOfferLiveSignature}
          onClick={() => void copy(plainText, labels.copied)}
          className="inline-flex min-h-11 items-center rounded-xl border border-[color:var(--aipify-border-strong)] px-3 py-2 text-sm font-semibold disabled:opacity-50"
        >
          {labels.copyText ?? labels.copyHtml}
        </button>
        <button
          type="button"
          disabled={!canOfferLiveSignature || !html}
          onClick={() => void copy(html, labels.copied)}
          className="inline-flex min-h-11 items-center rounded-xl border border-[color:var(--aipify-border-strong)] px-3 py-2 text-sm font-semibold disabled:opacity-50"
        >
          {labels.copyHtml}
        </button>
        <button
          type="button"
          disabled={!salesLink || !canOfferLiveSignature}
          onClick={() => void copy(salesLink || "", labels.copied)}
          className="inline-flex min-h-11 items-center rounded-xl bg-[#7C3AED] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {labels.copyLink ?? labels.copyHtml}
        </button>
      </div>
      {notice ? (
        <p className="mt-3 text-sm text-[#167A53]" role="status">
          {notice}
        </p>
      ) : null}
    </section>
  );
}
