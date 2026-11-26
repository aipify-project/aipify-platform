"use client";

import { useMemo, useState } from "react";
import { Mail } from "lucide-react";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/config";
import {
  SALES_EMAIL_PRODUCT_KEYS,
  SALES_EMAIL_TEMPLATES,
  type SalesEmailProductKey,
  type SalesEmailTemplateType,
} from "@/lib/certified-sales-partner/sales-email/catalog";
import { salesEmailCopy } from "@/lib/certified-sales-partner/sales-email/ui-copy";
import { renderSalesEmail, SALES_EMAIL_DUMMY_CODE, SALES_EMAIL_DUMMY_SELLER, validateTemplateSource } from "@/lib/certified-sales-partner/sales-email/render";

export function SalesEmailTemplateAdmin({ locale }: { locale: Locale }) {
  const copy = salesEmailCopy(locale);
  const [product, setProduct] = useState<SalesEmailProductKey>("kompis_web");
  const [type, setType] = useState<SalesEmailTemplateType>("product_introduction");
  const [marketingLocale, setMarketingLocale] = useState<Locale>("no");
  const [status, setStatus] = useState<"published" | "unavailable" | "all">("all");
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [notice, setNotice] = useState<string | null>(null);
  const template = SALES_EMAIL_TEMPLATES.find((item) => item.productKey === product && item.type === type) ?? null;
  const row = template?.locales[marketingLocale];
  const [subject, setSubject] = useState(row?.subject ?? "");
  const [body, setBody] = useState(row?.body ?? "");
  const [cta, setCta] = useState(row?.cta ?? "");

  function load(nextProduct: SalesEmailProductKey, nextType: SalesEmailTemplateType, nextLocale: Locale) {
    const next = SALES_EMAIL_TEMPLATES.find((item) => item.productKey === nextProduct && item.type === nextType);
    const source = next?.locales[nextLocale];
    setSubject(source?.subject ?? "");
    setBody(source?.body ?? "");
    setCta(source?.cta ?? "");
  }

  const visible = useMemo(
    () =>
      SALES_EMAIL_TEMPLATES.filter((item) => {
        if (item.productKey !== product || item.type !== type) return false;
        if (status === "all") return true;
        return item.locales[marketingLocale].status === status;
      }),
    [product, type, status, marketingLocale],
  );

  const validation = validateTemplateSource({ subject, body, cta });
  const rendered =
    row?.status === "published" && validation.ok
      ? renderSalesEmail({
          locale: marketingLocale,
          productKey: product,
          source: { subject, preheader: body.slice(0, 140), body, cta },
          seller: SALES_EMAIL_DUMMY_SELLER,
          referralCode: SALES_EMAIL_DUMMY_CODE,
        })
      : null;

  async function save(action: "draft" | "publish") {
    const res = await fetch("/api/platform/sellers/sales-email/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, subject, body, cta }),
    });
    const payload = (await res.json().catch(() => null)) as { code?: string } | null;
    setNotice(payload?.code === "persistence_not_ready" ? copy.text("publishClosed") : copy.text("publishClosed"));
  }

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-6 sm:px-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-[#1E293B]">{copy.text("adminTitle")}</h1>
        <p className="max-w-3xl text-sm text-[#64748B]">{copy.text("publishClosed")}</p>
      </header>
      <div className="grid gap-3 rounded-2xl border border-[#E8E4F2] bg-white p-4 md:grid-cols-4">
        <label className="grid gap-1 text-sm font-medium">
          {copy.text("product")}
          <select className="rounded-xl border border-[#E8E4F2] px-3 py-2" value={product} onChange={(event) => { const value = event.target.value as SalesEmailProductKey; setProduct(value); load(value, type, marketingLocale); }}>
            {SALES_EMAIL_PRODUCT_KEYS.map((item) => (
              <option key={item} value={item}>{item === "kompis_web" ? "Kompis Web" : "Kompis Bedrift"}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium">
          {copy.text("template")}
          <select className="rounded-xl border border-[#E8E4F2] px-3 py-2" value={type} onChange={(event) => { const value = event.target.value as SalesEmailTemplateType; setType(value); load(product, value, marketingLocale); }}>
            {(["product_introduction", "follow_up", "meeting_request", "product_information"] as const).map((item) => (
              <option key={item} value={item}>{copy.type(item)}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium">
          {copy.text("language")}
          <select className="rounded-xl border border-[#E8E4F2] px-3 py-2" value={marketingLocale} onChange={(event) => { const value = event.target.value as Locale; setMarketingLocale(value); load(product, type, value); }}>
            {LOCALES.map((item) => <option key={item} value={item}>{LOCALE_LABELS[item]}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium">
          {copy.text("status")}
          <select className="rounded-xl border border-[#E8E4F2] px-3 py-2" value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
            <option value="all">{copy.text("filterAll")}</option>
            <option value="published">{copy.text("filterPublished")}</option>
            <option value="unavailable">{copy.text("filterUnavailable")}</option>
          </select>
        </label>
      </div>
      {visible.length === 0 || row?.status !== "published" ? (
        <p className="rounded-2xl border border-[#E8E4F2] bg-white p-4 text-sm text-[#475569]">{copy.text("unavailable")}</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <form className="grid gap-3 rounded-2xl border border-[#E8E4F2] bg-white p-4" onSubmit={(event) => event.preventDefault()}>
            <label className="grid gap-1 text-sm font-medium">
              {copy.text("subject")}
              <input className="rounded-xl border border-[#E8E4F2] px-3 py-2" value={subject} onChange={(event) => setSubject(event.target.value)} />
            </label>
            <label className="grid gap-1 text-sm font-medium">
              {copy.text("bodyLabel")}
              <textarea className="min-h-40 rounded-xl border border-[#E8E4F2] px-3 py-2" value={body} onChange={(event) => setBody(event.target.value)} />
            </label>
            <label className="grid gap-1 text-sm font-medium">
              {copy.text("cta")}
              <input className="rounded-xl border border-[#E8E4F2] px-3 py-2" value={cta} onChange={(event) => setCta(event.target.value)} />
            </label>
            {!validation.ok ? <p className="text-sm text-[#92400E]">{copy.text("unavailable")}</p> : null}
            <div className="flex gap-2">
              <button type="button" className="rounded-xl border border-[#E8E4F2] px-3 py-2 text-sm" onClick={() => void save("draft")}>{copy.text("draft")}</button>
              <button type="button" className="rounded-xl border border-[#E8E4F2] px-3 py-2 text-sm" onClick={() => void save("publish")}>{copy.text("publish")}</button>
            </div>
            {notice ? <p className="text-sm text-[#475569]">{notice}</p> : null}
          </form>
          <div className="rounded-2xl border border-[#E8E4F2] bg-white p-4">
            <div className="mb-3 flex gap-2">
              <button type="button" className="rounded-lg border border-[#E8E4F2] px-3 py-1.5 text-sm" onClick={() => setViewport("desktop")}>{copy.text("desktop")}</button>
              <button type="button" className="rounded-lg border border-[#E8E4F2] px-3 py-1.5 text-sm" onClick={() => setViewport("mobile")}>{copy.text("mobile")}</button>
            </div>
            <p className="mb-2 inline-flex items-center gap-1 text-sm text-[#475569]"><Mail className="h-4 w-4" aria-hidden />{copy.text("from")}: Aipify Group AS &lt;partners@aipify.ai&gt;</p>
            <div className={viewport === "mobile" ? "mx-auto max-w-[380px]" : "w-full"}>
              {rendered?.ok ? (
                <iframe title={copy.text("preview")} sandbox="" srcDoc={rendered.html} className="h-[560px] w-full rounded-xl border border-[#E8E4F2]" />
              ) : (
                <p className="text-sm text-[#64748B]">{copy.text("unavailable")}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
