"use client";

import { useState, type FormEvent } from "react";
import { validateSettlementTransition } from "@/lib/certified-sales-partner/settlement-rules";
import type { CspSettlementStatus } from "@/lib/certified-sales-partner/constants";

export type SellersActionOption = { value: string; label: string };

export type SellersActionLabels = {
  partnersTitle: string;
  settlementsTitle: string;
  productsTitle: string;
  partnersHint: string;
  settlementsHint: string;
  partnerId: string;
  partnerIdHint: string;
  status: string;
  reason: string;
  reasonHint: string;
  /** Business labels for partner decisions; `value` is the Core status code sent to the API. */
  partnerStatusOptions: SellersActionOption[];
  submitPartner: string;
  settlementId: string;
  settlementIdHint: string;
  fromStatus: string;
  toStatus: string;
  /** Business labels for settlement steps; `value` is the Core status code sent to the API. */
  settlementStatusOptions: SellersActionOption[];
  rejectionReason: string;
  rejectionReasonHint: string;
  paidAt: string;
  paymentReference: string;
  paidEvidenceHint: string;
  submitSettlement: string;
  productKey: string;
  productTitle: string;
  currency: string;
  fixedCommission: string;
  published: string;
  submitProduct: string;
  productTabProduct: string;
  productTabPrice: string;
  productTabLanguage: string;
  productTabCommission: string;
  productTabPublish: string;
  priceNotPublished: string;
  priceNotCommission: string;
  languageNotStored: string;
  percentUnavailable: string;
  publishMeaning: string;
  success: string;
  failClosed: string;
  error: string;
  /** Translated messages for known API error codes; unknown codes fall back to `error`. */
  errors: Record<string, string>;
};

type Section = "partners" | "settlements" | "products";

type Props = {
  section: Section;
  labels: SellersActionLabels;
  /** Prefill from a directory row. Re-mount (via `key`) to apply a new selection. */
  initialPartnerId?: string;
  initialPartnerStatus?: string;
  initialSettlementId?: string;
  initialFromStatus?: string;
  initialToStatus?: string;
  /** Called after Core accepted the request so the surrounding list can reload. */
  onSuccess?: () => void;
};

export function CertifiedSellersActionPanel({
  section,
  labels,
  initialPartnerId,
  initialPartnerStatus,
  initialSettlementId,
  initialFromStatus,
  initialToStatus,
  onSuccess,
}: Props) {
  const [message, setMessage] = useState<{ kind: "ok" | "closed" | "error"; text: string } | null>(null);
  const [pending, setPending] = useState(false);

  /** Known codes map to translated copy; raw codes are never shown. */
  function errorText(code?: string): string {
    return (code && labels.errors[code]) || labels.error;
  }

  async function post(url: string, body: Record<string, unknown>) {
    setPending(true);
    setMessage(null);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        backend_ready?: boolean;
        message?: string;
      };
      if (res.status === 401 || res.status === 403) {
        setMessage({ kind: "error", text: errorText("forbidden") });
        return;
      }
      if (data.error === "forbidden") {
        setMessage({ kind: "error", text: errorText("forbidden") });
        return;
      }
      if (res.status === 503 || data.backend_ready === false) {
        setMessage({ kind: "closed", text: labels.failClosed });
        return;
      }
      if (!res.ok) {
        setMessage({ kind: "error", text: errorText(data.error) });
        return;
      }
      setMessage({ kind: "ok", text: labels.success });
      onSuccess?.();
    } catch {
      setMessage({ kind: "error", text: labels.error });
    } finally {
      setPending(false);
    }
  }

  function onPartners(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const reason = String(fd.get("reason") ?? "").trim();
    if (reason.length < 3) {
      setMessage({ kind: "error", text: errorText("reason_required") });
      return;
    }
    const status = String(fd.get("status") ?? "");
    void post("/api/platform/sellers/partners", {
      partner_id: String(fd.get("partner_id") ?? "").trim(),
      status,
      reason,
      // Action panel is an explicit operator form — require confirm for dual-identity approvals.
      ...(status === "approved" ? { confirm_active_app_customer: true } : {}),
    });
  }

  function onSettlements(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const from = String(fd.get("from_status") ?? "");
    const to = String(fd.get("to_status") ?? "");
    const rejectionReason = String(fd.get("rejection_reason") ?? "").trim();
    const paidAtRaw = String(fd.get("paid_at") ?? "").trim();
    const paymentReference = String(fd.get("payment_reference") ?? "").trim();
    // Early, friendly pre-check with the same pure rules the API enforces. The server re-validates
    // and supplies the admin identity, so "server" below is only a client-side placeholder.
    const check = validateSettlementTransition(from as CspSettlementStatus, to as CspSettlementStatus, {
      rejectionReason,
      paidAt: paidAtRaw,
      paymentReference,
      adminId: "server",
    });
    if (!check.ok) {
      setMessage({ kind: "error", text: errorText(check.error) });
      return;
    }
    void post("/api/platform/sellers/settlements", {
      settlement_id: String(fd.get("settlement_id") ?? "").trim(),
      from_status: from,
      to_status: to,
      rejection_reason: rejectionReason,
      paid_at: paidAtRaw ? new Date(paidAtRaw).toISOString() : "",
      payment_reference: paymentReference,
    });
  }

  function onProducts(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    void post("/api/platform/sellers/products", {
      product_key: String(fd.get("product_key") ?? ""),
      title: String(fd.get("title") ?? ""),
      currency: String(fd.get("currency") ?? "").toUpperCase(),
      fixed_commission_amount: Number(fd.get("fixed_commission_amount") ?? 0),
      published: fd.get("published") === "on",
    });
  }

  const title =
    section === "partners"
      ? labels.partnersTitle
      : section === "settlements"
        ? labels.settlementsTitle
        : labels.productsTitle;

  return (
    <section className="rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">{title}</h2>
      {section === "partners" ? (
        <form className="mt-4 grid max-w-xl gap-3" onSubmit={onPartners}>
          <p className="text-sm text-[color:var(--aipify-text-secondary)]">{labels.partnersHint}</p>
          <Field
            name="partner_id"
            label={labels.partnerId}
            hint={labels.partnerIdHint}
            required
            defaultValue={initialPartnerId}
          />
          <Select
            name="status"
            label={labels.status}
            options={labels.partnerStatusOptions}
            defaultValue={initialPartnerStatus}
          />
          <Field name="reason" label={labels.reason} hint={labels.reasonHint} required minLength={3} maxLength={500} />
          <Submit pending={pending} label={labels.submitPartner} />
        </form>
      ) : null}
      {section === "settlements" ? (
        <form className="mt-4 grid max-w-xl gap-3" onSubmit={onSettlements}>
          <p className="text-sm text-[color:var(--aipify-text-secondary)]">{labels.settlementsHint}</p>
          <Field
            name="settlement_id"
            label={labels.settlementId}
            hint={labels.settlementIdHint}
            required
            defaultValue={initialSettlementId}
          />
          <Select
            name="from_status"
            label={labels.fromStatus}
            options={labels.settlementStatusOptions}
            defaultValue={initialFromStatus}
          />
          <Select
            name="to_status"
            label={labels.toStatus}
            options={labels.settlementStatusOptions}
            defaultIndex={1}
            defaultValue={initialToStatus}
          />
          <Field name="rejection_reason" label={labels.rejectionReason} hint={labels.rejectionReasonHint} />
          <Field name="paid_at" label={labels.paidAt} type="datetime-local" hint={labels.paidEvidenceHint} />
          <Field name="payment_reference" label={labels.paymentReference} />
          <Submit pending={pending} label={labels.submitSettlement} />
        </form>
      ) : null}
      {section === "products" ? <ProductAdminForm labels={labels} pending={pending} onSubmit={onProducts} /> : null}
      {message ? (
        <p className="mt-4 text-sm text-[color:var(--aipify-text-secondary)]" role="status">
          {message.text}
        </p>
      ) : null}
    </section>
  );
}

function ProductAdminForm({
  labels,
  pending,
  onSubmit,
}: {
  labels: SellersActionLabels;
  pending: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const [tab, setTab] = useState<"product" | "price" | "language" | "commission" | "publish">("product");
  const tabs = [
    ["product", labels.productTabProduct],
    ["price", labels.productTabPrice],
    ["language", labels.productTabLanguage],
    ["commission", labels.productTabCommission],
    ["publish", labels.productTabPublish],
  ] as const;
  return (
    <form className="mt-4 grid max-w-3xl gap-4" onSubmit={onSubmit}>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={labels.productsTitle}>
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`rounded-xl px-3 py-1.5 text-sm font-semibold ${
              tab === id
                ? "bg-[color:var(--aipify-companion-purple)] text-white"
                : "border border-[color:var(--aipify-border)] text-[color:var(--aipify-text-secondary)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div hidden={tab !== "product"} className="grid gap-3">
        <Field name="product_key" label={labels.productKey} />
        <Field name="title" label={labels.productTitle} />
      </div>
      <div hidden={tab !== "price"} className="grid gap-2 text-sm text-[color:var(--aipify-text-secondary)]">
        <p>{labels.priceNotPublished}</p>
        <p>{labels.priceNotCommission}</p>
      </div>
      <div hidden={tab !== "language"}>
        <p className="text-sm text-[color:var(--aipify-text-secondary)]">{labels.languageNotStored}</p>
      </div>
      <div hidden={tab !== "commission"} className="grid gap-3">
        <p className="text-sm text-[color:var(--aipify-text-secondary)]">{labels.percentUnavailable}</p>
        <Field name="currency" label={labels.currency} placeholder="NOK" maxLength={3} />
        <Field name="fixed_commission_amount" label={labels.fixedCommission} type="number" />
      </div>
      <div hidden={tab !== "publish"} className="grid gap-3">
        <p className="text-sm text-[color:var(--aipify-text-secondary)]">{labels.publishMeaning}</p>
        <label className="flex items-center gap-2 text-sm">
          <input name="published" type="checkbox" />
          <span>{labels.published}</span>
        </label>
      </div>
      <Submit pending={pending} label={labels.submitProduct} />
    </form>
  );
}

function Field({
  name,
  label,
  required,
  placeholder,
  type = "text",
  maxLength,
  minLength,
  hint,
  defaultValue,
}: {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  maxLength?: number;
  minLength?: number;
  hint?: string;
  defaultValue?: string;
}) {
  return (
    <label className="text-sm">
      <span className="font-medium">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        minLength={minLength}
        className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
      />
      {hint ? <span className="mt-1 block text-xs text-[color:var(--aipify-text-secondary)]">{hint}</span> : null}
    </label>
  );
}

function Select({
  name,
  label,
  options,
  defaultIndex = 0,
  defaultValue,
}: {
  name: string;
  label: string;
  options: SellersActionOption[];
  defaultIndex?: number;
  defaultValue?: string;
}) {
  const initial =
    defaultValue && options.some((o) => o.value === defaultValue) ? defaultValue : options[defaultIndex]?.value;
  return (
    <label className="text-sm">
      <span className="font-medium">{label}</span>
      <select
        name={name}
        defaultValue={initial}
        className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
        required
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Submit({ pending, label }: { pending: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex rounded-xl bg-[color:var(--aipify-companion-purple)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
    >
      {label}
    </button>
  );
}
