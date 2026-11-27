"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  listPublishedCspEmailTemplates,
  resolveCspEmailTemplate,
  type CspEmailPlaceholderValues,
  type CspEmailTemplateLocale,
  type CspEmailTemplateType,
} from "@/lib/certified-sales-partner/email-templates";
import { cspMarketingProductDescription } from "@/lib/certified-sales-partner/email-templates/product-copy";
import { publicEmailAvatarUrl, buildSalesReferralUrl } from "@/lib/certified-sales-partner/email-crm/signature";
import { LOCALE_LABELS } from "@/lib/i18n/config";
import { writeClipboard } from "./csp-sales-links-client";
import { AipifyAlert, AipifyCard, AipifyPageHeader } from "./design";
import { useCspPortal } from "./CspPortalSessionProvider";

export type CspEmailTemplatesPanelLabels = {
  title: string;
  intro: string;
  productLabel: string;
  templateTypeLabel: string;
  localeLabel: string;
  localeNote: string;
  localeUnavailable: string;
  recipientLabel: string;
  recipientHint: string;
  previewTitle: string;
  sendCta: string;
  sendLockedTitle: string;
  sendLockedBody: string;
  consentLabel: string;
  certRequired: string;
  noTemplates: string;
  previewSubject: string;
  inboxLink: string;
  previewReady: string;
  sendNotActivated: string;
  copySubject: string;
  copyBody: string;
  copyWithLink: string;
  copied: string;
  copyFailed: string;
  howSendingTitle: string;
  howSendingBody: string;
  linkUnavailable: string;
  types: Record<CspEmailTemplateType, string>;
  products: Record<string, string>;
};

const TYPES: CspEmailTemplateType[] = [
  "product_introduction",
  "follow_up",
  "meeting_request",
  "product_information",
];

const MARKETING_LOCALES: CspEmailTemplateLocale[] = ["en", "no", "sv", "da", "pl", "uk", "es"];

function certPassed(portal: ReturnType<typeof useCspPortal>, product: string): boolean {
  if (!portal) return false;
  return portal.overview.products.some(
    (p) => p.productKey === product && p.certificationStatus === "passed",
  );
}

/**
 * Seller Marketing → Email templates.
 * Preview always available for published+locale-complete templates.
 * Send stays fail-closed until transport + owner unlock + consent.
 */
export function CertifiedSalesPartnerEmailTemplatesPanel({
  labels,
  portalLocale,
  companyName,
  contactEmail,
  avatarUrl,
}: {
  labels: CspEmailTemplatesPanelLabels;
  portalLocale: string;
  companyName: string;
  contactEmail: string;
  avatarUrl: string | null;
}) {
  const portal = useCspPortal();
  const [product, setProduct] = useState("kompis_web");
  const [type, setType] = useState<CspEmailTemplateType>("product_introduction");
  const [marketingLocale, setMarketingLocale] = useState<CspEmailTemplateLocale>(
    MARKETING_LOCALES.includes(portalLocale as CspEmailTemplateLocale)
      ? (portalLocale as CspEmailTemplateLocale)
      : "en",
  );
  const [recipient, setRecipient] = useState("");
  const [consent, setConsent] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const templates = useMemo(
    () => listPublishedCspEmailTemplates({ productKey: product, type }),
    [product, type],
  );
  const template = templates[0] ?? null;
  const sellable = product !== "aipify_voice" && certPassed(portal, product);
  const activeLink = portal?.links.find((l) => l.active && l.code) ?? null;

  const values: CspEmailPlaceholderValues = {
    seller_display_name: portal?.overview.displayName || "",
    seller_avatar_url: publicEmailAvatarUrl(avatarUrl),
    seller_company: companyName.trim(),
    seller_contact: contactEmail.trim(),
    product_name: labels.products[product] || product,
    product_description: cspMarketingProductDescription(product),
    referral_url: buildSalesReferralUrl({
      code: activeLink?.code,
      productKey: product,
      locale: marketingLocale,
    }),
    company_branding: "Aipify",
  };

  const resolved =
    template && values.referral_url
      ? resolveCspEmailTemplate({
          templateId: template.id,
          locale: marketingLocale,
          values,
        })
      : null;

  const localeCopy = template?.locales[marketingLocale] ?? null;

  function fillPreview(source: string) {
    return source.replace(/\{\{\s*([a-z0-9_]+)\s*\}\}/gi, (_match, key: string) => {
      if (key === "referral_url") return values.referral_url || labels.linkUnavailable;
      const value = values[key as keyof CspEmailPlaceholderValues];
      return typeof value === "string" ? value : "";
    });
  }

  async function copyValue(value: string) {
    const ok = await writeClipboard(value);
    setNotice(ok ? labels.copied : labels.copyFailed);
  }

  async function onSend() {
    setNotice(null);
    const res = await fetch("/api/certified-sales-partner/email/marketing-send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template_id: template?.id,
        product_key: product,
        marketing_locale: marketingLocale,
        recipient,
        consent_confirmed: consent,
        idempotency_key: `csp-mkt-${Date.now()}`,
      }),
    });
    const body = (await res.json().catch(() => null)) as {
      status?: string;
      gate_reason?: string;
      message?: string;
    } | null;
    if (!res.ok || body?.status !== "accepted_by_provider") {
      setNotice(labels.sendLockedTitle);
      return;
    }
    setNotice(null);
  }

  return (
    <div className="w-full space-y-5">
      <AipifyPageHeader title={labels.title} description={labels.intro} eyebrow="Aipify" />

      <AipifyCard padding="sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{labels.productLabel}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["kompis_web", "kompis_bedrift"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setProduct(key)}
              className={`inline-flex min-h-10 items-center rounded-xl px-3 text-sm font-semibold ${
                product === key
                  ? "bg-[#F3EDFF] text-[#7C3AED] ring-1 ring-[#D3C7FF]"
                  : "border border-[#E8E4F2] text-[#475569]"
              }`}
            >
              {labels.products[key]}
            </button>
          ))}
        </div>
        {!sellable ? <p className="mt-3 text-sm text-[#64748B]">{labels.certRequired}</p> : null}
      </AipifyCard>

      <AipifyCard padding="sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{labels.localeLabel}</p>
        <p className="mt-1 text-xs text-[#64748B]">{labels.localeNote}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {MARKETING_LOCALES.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setMarketingLocale(code)}
              className={`inline-flex min-h-10 items-center rounded-xl px-3 text-sm font-semibold ${
                marketingLocale === code
                  ? "bg-[#F3EDFF] text-[#7C3AED] ring-1 ring-[#D3C7FF]"
                  : "border border-[#E8E4F2] text-[#475569]"
              }`}
            >
              {LOCALE_LABELS[code] ?? code.toUpperCase()}
            </button>
          ))}
        </div>
      </AipifyCard>

      <div className="grid gap-4 lg:grid-cols-[minmax(220px,280px)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-[#E8E4F2] bg-white p-3" role="tablist" aria-label={labels.templateTypeLabel}>
          {TYPES.map((id) => {
            const published = listPublishedCspEmailTemplates({ productKey: product, type: id }).length > 0;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={type === id}
                disabled={!published}
                onClick={() => setType(id)}
                className={`mb-2 flex min-h-11 w-full items-center rounded-xl px-3 text-left text-sm font-semibold last:mb-0 disabled:opacity-40 ${
                  type === id ? "bg-[#7C3AED] text-white" : "bg-[#F6F4FB] text-[#1E293B]"
                }`}
              >
                {labels.types[id]}
              </button>
            );
          })}
        </div>
        {!template ? (
          <AipifyAlert tone="info" title={labels.noTemplates}>
            <Link href="/partners/marketing/assets" className="font-semibold text-[#7C3AED]">
              {labels.noTemplates}
            </Link>
          </AipifyAlert>
        ) : !localeCopy ? (
          <AipifyAlert tone="info" title={labels.localeUnavailable}>
            {labels.localeUnavailable}
          </AipifyAlert>
        ) : (
          <AipifyCard>
            <p className="text-sm font-medium text-[#5538D3]">{labels.previewReady}</p>
            <h2 className="mt-2 text-base font-semibold text-[#1E293B]">{labels.previewTitle}</h2>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{labels.previewSubject}</p>
            <p className="mt-1 text-sm font-medium text-[#1E293B]">{fillPreview(localeCopy.subject)}</p>
            <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-[#F8F7FC] p-4 text-sm text-[#475569]">{fillPreview(localeCopy.body)}</pre>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => void copyValue(fillPreview(localeCopy.subject))} className="inline-flex min-h-11 items-center rounded-xl border border-[#E8E4F2] px-3 text-sm font-semibold text-[#1E293B]">
                {labels.copySubject}
              </button>
              <button type="button" onClick={() => void copyValue(fillPreview(localeCopy.body))} className="inline-flex min-h-11 items-center rounded-xl border border-[#E8E4F2] px-3 text-sm font-semibold text-[#1E293B]">
                {labels.copyBody}
              </button>
              <button
                type="button"
                disabled={!values.referral_url}
                onClick={() => void copyValue(`${fillPreview(localeCopy.body)}\n\n${values.referral_url}`)}
                className="inline-flex min-h-11 items-center rounded-xl border border-[#E8E4F2] px-3 text-sm font-semibold text-[#1E293B] disabled:opacity-40"
              >
                {labels.copyWithLink}
              </button>
            </div>
          </AipifyCard>
        )}
      </div>

      <AipifyCard>
        <label className="block text-sm font-semibold text-[#1E293B]" htmlFor="csp-email-recipient">
          {labels.recipientLabel}
        </label>
        <p className="mt-1 text-xs text-[#64748B]">{labels.recipientHint}</p>
        <input
          id="csp-email-recipient"
          type="email"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="mt-2 w-full max-w-md rounded-xl border border-[#E8E4F2] px-3 py-2.5 text-sm"
          autoComplete="email"
        />
        <label className="mt-4 flex items-start gap-2 text-sm text-[#475569]">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1"
          />
          <span>{labels.consentLabel}</span>
        </label>
        <p className="mt-4 text-sm font-medium text-[#64748B]">
          {!sellable || !resolved || !resolved.ok ? labels.sendNotActivated : labels.previewReady}
        </p>
        <button
          type="button"
          disabled={!sellable || !resolved || !resolved.ok || !recipient.trim() || !consent}
          onClick={() => void onSend()}
          className="mt-3 inline-flex min-h-11 items-center rounded-xl border border-[#E8E4F2] px-4 text-sm font-semibold text-[#475569] disabled:opacity-40"
        >
          {labels.sendCta}
        </button>
        <details className="mt-4 rounded-xl bg-[#F6F4FB] p-4">
          <summary className="cursor-pointer text-sm font-semibold text-[#1E293B]">{labels.howSendingTitle}</summary>
          <p className="mt-2 text-sm leading-relaxed text-[#475569]">{labels.howSendingBody}</p>
          <p className="mt-2 text-sm leading-relaxed text-[#475569]">{labels.sendLockedBody}</p>
        </details>
        {notice ? <p className="mt-3 text-sm text-[#64748B]">{notice}</p> : null}
        <p className="mt-4">
          <Link href="/partners/marketing/email-inbox" className="text-sm font-semibold text-[#7C3AED]">
            {labels.inboxLink}
          </Link>
        </p>
      </AipifyCard>
    </div>
  );
}
