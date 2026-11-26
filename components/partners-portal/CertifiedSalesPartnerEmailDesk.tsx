"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, Monitor, Smartphone } from "lucide-react";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/config";
import {
  SALES_EMAIL_PRODUCT_KEYS,
  SALES_EMAIL_TEMPLATES,
  type SalesEmailProductKey,
  type SalesEmailTemplateType,
} from "@/lib/certified-sales-partner/sales-email/catalog";
import { salesEmailCopy } from "@/lib/certified-sales-partner/sales-email/ui-copy";
import type { SalesEmailSendBlock } from "@/lib/certified-sales-partner/sales-email/gates";
import { evaluateSalesLinkGates } from "@/lib/certified-sales-partner/partner-overview";
import { AipifyAlert, AipifyCard, AipifyPageHeader, AipifyStatusBadge } from "./design";
import { useCspPortal } from "./CspPortalSessionProvider";

type PreviewBody = {
  from: string | null;
  subject: string | null;
  html: string | null;
  referralUrl: string | null;
  seller: { displayName: string; company: string | null; contact: string | null };
  localeStatus: "published" | "unavailable";
  send: { ok: true } | { ok: false; code: SalesEmailSendBlock };
};

export function CertifiedSalesPartnerEmailDesk({ locale }: { locale: Locale }) {
  const copy = salesEmailCopy(locale);
  const portal = useCspPortal();
  const [product, setProduct] = useState<SalesEmailProductKey>("kompis_web");
  const [type, setType] = useState<SalesEmailTemplateType>("product_introduction");
  const [marketingLocale, setMarketingLocale] = useState<Locale>(locale);
  const [recipient, setRecipient] = useState("");
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [preview, setPreview] = useState<PreviewBody | null>(null);
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const template = useMemo(
    () => SALES_EMAIL_TEMPLATES.find((item) => item.productKey === product && item.type === type) ?? null,
    [product, type],
  );
  const published = template?.locales[marketingLocale].status === "published";

  useEffect(() => {
    if (!template) return;
    const handle = window.setTimeout(() => {
      const params = new URLSearchParams({
        template: template.id,
        locale: marketingLocale,
        recipient,
        idempotencyKey,
      });
      void fetch(`/api/certified-sales-partner/sales-email/preview?${params.toString()}`, { cache: "no-store" })
        .then(async (res) => {
          if (!res.ok) {
            setPreview(null);
            return;
          }
          setPreview((await res.json()) as PreviewBody);
        })
        .catch(() => setPreview(null));
    }, 250);
    return () => window.clearTimeout(handle);
  }, [template, marketingLocale, recipient, idempotencyKey]);

  const block = preview && !preview.send.ok ? preview.send.code : null;
  const sendDisabled = !published || !preview?.send.ok || !preview.html;

  async function onSend() {
    if (!template || sendDisabled) return;
    await fetch("/api/certified-sales-partner/sales-email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId: template.id, locale: marketingLocale, recipient, idempotencyKey }),
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <AipifyPageHeader eyebrow="Aipify" title={copy.text("title")} description={copy.text("intro")} />
      <AipifyAlert tone="warning" title={copy.text("leads")}>
        {copy.text("leadsBlocked")}
      </AipifyAlert>
      <AipifyCard className="grid gap-4 p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-1 text-sm font-medium text-[#1E293B]">
            {copy.text("product")}
            <select
              className="rounded-xl border border-[#E8E4F2] bg-white px-3 py-2"
              value={product}
              onChange={(event) => setProduct(event.target.value as SalesEmailProductKey)}
            >
              {SALES_EMAIL_PRODUCT_KEYS.map((key) => {
                const allowed = portal ? evaluateSalesLinkGates(portal.overview, key).allowed : false;
                return (
                  <option key={key} value={key}>
                    {key === "kompis_web" ? "Kompis Web" : "Kompis Bedrift"}
                    {allowed ? "" : " —"}
                  </option>
                );
              })}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium text-[#1E293B]">
            {copy.text("template")}
            <select
              className="rounded-xl border border-[#E8E4F2] bg-white px-3 py-2"
              value={type}
              onChange={(event) => setType(event.target.value as SalesEmailTemplateType)}
            >
              {(["product_introduction", "follow_up", "meeting_request", "product_information"] as const).map((item) => (
                <option key={item} value={item}>
                  {copy.type(item)}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium text-[#1E293B]">
            {copy.text("language")}
            <select
              className="rounded-xl border border-[#E8E4F2] bg-white px-3 py-2"
              value={marketingLocale}
              onChange={(event) => setMarketingLocale(event.target.value as Locale)}
            >
              {LOCALES.map((item) => (
                <option key={item} value={item}>
                  {LOCALE_LABELS[item]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="grid gap-1 text-sm font-medium text-[#1E293B]">
          {copy.text("recipient")}
          <input
            type="email"
            autoComplete="off"
            inputMode="email"
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
            className="rounded-xl border border-[#E8E4F2] bg-white px-3 py-2"
          />
        </label>
      </AipifyCard>

      {!published ? (
        <AipifyAlert tone="warning" title={copy.text("unavailable")}>
          {copy.text("unavailable")}
        </AipifyAlert>
      ) : (
        <AipifyCard className="grid gap-4 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-[#1E293B]">{copy.text("preview")}</h2>
            <div className="flex gap-2">
              <button type="button" className="inline-flex items-center gap-1 rounded-lg border border-[#E8E4F2] px-3 py-1.5 text-sm" onClick={() => setViewport("desktop")}>
                <Monitor className="h-4 w-4" aria-hidden />
                {copy.text("desktop")}
              </button>
              <button type="button" className="inline-flex items-center gap-1 rounded-lg border border-[#E8E4F2] px-3 py-1.5 text-sm" onClick={() => setViewport("mobile")}>
                <Smartphone className="h-4 w-4" aria-hidden />
                {copy.text("mobile")}
              </button>
            </div>
          </div>
          <p className="text-sm text-[#64748B]">
            {copy.text("from")}: {preview?.from ?? "Aipify Group AS <partners@aipify.ai>"}
          </p>
          {preview?.seller ? (
            <p className="text-sm text-[#475569]">
              {preview.seller.displayName}
              {preview.seller.company ? ` · ${preview.seller.company}` : ""}
              {preview.seller.contact ? ` · ${preview.seller.contact}` : ""}
            </p>
          ) : null}
          {preview?.referralUrl ? <p className="break-all text-sm text-[#5538D3]">{preview.referralUrl}</p> : null}
          <div className={viewport === "mobile" ? "mx-auto w-full max-w-[380px]" : "w-full"}>
            {preview?.html ? (
              <iframe title={copy.text("preview")} sandbox="" srcDoc={preview.html} className="h-[520px] w-full rounded-xl border border-[#E8E4F2] bg-white" />
            ) : (
              <p className="text-sm text-[#64748B]">{copy.text("preview")}</p>
            )}
          </div>
          <AipifyStatusBadge tone={block ? "warning" : "success"} icon={<Mail className="h-3.5 w-3.5" />} label={block ? copy.reason(block) : copy.text("providerNote")} />
          <p className="text-xs text-[#64748B]">{copy.text("providerNote")}</p>
          <button
            type="button"
            disabled={sendDisabled}
            onClick={() => void onSend()}
            className="inline-flex w-fit items-center rounded-xl bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#CBD5E1]"
          >
            {copy.text("send")}
          </button>
        </AipifyCard>
      )}
    </div>
  );
}
