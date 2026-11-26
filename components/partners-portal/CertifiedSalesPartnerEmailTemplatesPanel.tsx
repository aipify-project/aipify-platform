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
import { LOCALE_LABELS } from "@/lib/i18n/config";
import { AipifyAlert, AipifyCard, AipifyPageHeader, AipifyTabs } from "./design";
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
}: {
  labels: CspEmailTemplatesPanelLabels;
  portalLocale: string;
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
    seller_display_name: portal?.overview.displayName || "Seller",
    seller_avatar_url: "",
    seller_company: "Aipify Sales Partner",
    seller_contact: "",
    product_name: labels.products[product] || product,
    product_description:
      product === "kompis_web"
        ? "Kompis Web answers visitor questions using content you approve."
        : "Kompis Bedrift supports internal knowledge with approved sources.",
    referral_url: activeLink?.code
      ? `https://aipify.ai/p/${activeLink.code}/${product}?channel=email&lang=${marketingLocale}`
      : "",
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
    if (!res.ok) {
      setNotice(body?.message || labels.sendLockedTitle);
      return;
    }
    setNotice(body?.message || body?.status || labels.sendLockedBody);
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

      <AipifyTabs
        ariaLabel={labels.templateTypeLabel}
        activeId={type}
        onChange={(id) => setType(id as CspEmailTemplateType)}
        items={TYPES.map((id) => ({ id, label: labels.types[id] }))}
      />

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

      {!template ? (
        <AipifyAlert tone="info" title={labels.noTemplates}>
          {labels.noTemplates}
        </AipifyAlert>
      ) : resolved && !resolved.ok && resolved.reason === "locale_unavailable" ? (
        <AipifyAlert tone="warning" title={labels.localeUnavailable}>
          {labels.localeUnavailable}
        </AipifyAlert>
      ) : resolved && resolved.ok ? (
        <AipifyCard>
          <h2 className="text-base font-semibold text-[#1E293B]">{labels.previewTitle}</h2>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
            {labels.previewSubject}
          </p>
          <p className="mt-1 text-sm font-medium text-[#1E293B]">{resolved.subject}</p>
          <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-[#F8F7FC] p-4 text-sm text-[#475569]">
            {resolved.textBody}
          </pre>
        </AipifyCard>
      ) : (
        <AipifyAlert tone="info">
          <Link href="/partners/referrals/links" className="font-semibold text-[#7C3AED]">
            {labels.certRequired}
          </Link>
        </AipifyAlert>
      )}

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
        <button
          type="button"
          disabled={!sellable || !resolved || !resolved.ok || !recipient.trim() || !consent}
          onClick={() => void onSend()}
          className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-[#7C3AED] px-4 text-sm font-semibold text-white disabled:opacity-40"
        >
          {labels.sendCta}
        </button>
        <div className="mt-4">
          <AipifyAlert tone="neutral" title={labels.sendLockedTitle}>
            {labels.sendLockedBody}
          </AipifyAlert>
        </div>
        {notice ? <p className="mt-3 text-sm text-[#64748B]">{notice}</p> : null}
      </AipifyCard>
    </div>
  );
}
