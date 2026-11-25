"use client";

import { useState, type FormEvent } from "react";

export type SellersActionLabels = {
  partnersTitle: string;
  settlementsTitle: string;
  productsTitle: string;
  partnerId: string;
  status: string;
  reason: string;
  submitPartner: string;
  settlementId: string;
  fromStatus: string;
  toStatus: string;
  rejectionReason: string;
  paidAt: string;
  paymentReference: string;
  submitSettlement: string;
  productKey: string;
  productTitle: string;
  currency: string;
  fixedCommission: string;
  published: string;
  submitProduct: string;
  success: string;
  failClosed: string;
  error: string;
};

type Section = "partners" | "settlements" | "products";

type Props = {
  section: Section;
  labels: SellersActionLabels;
};

export function CertifiedSellersActionPanel({ section, labels }: Props) {
  const [message, setMessage] = useState<{ kind: "ok" | "closed" | "error"; text: string } | null>(null);
  const [pending, setPending] = useState(false);

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
      if (res.status === 503 || data.backend_ready === false) {
        setMessage({ kind: "closed", text: labels.failClosed });
        return;
      }
      if (!res.ok) {
        setMessage({ kind: "error", text: data.error ?? labels.error });
        return;
      }
      setMessage({ kind: "ok", text: labels.success });
    } catch {
      setMessage({ kind: "error", text: labels.error });
    } finally {
      setPending(false);
    }
  }

  function onPartners(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    void post("/api/platform/sellers/partners", {
      partner_id: String(fd.get("partner_id") ?? ""),
      status: String(fd.get("status") ?? ""),
      reason: String(fd.get("reason") ?? ""),
    });
  }

  function onSettlements(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    void post("/api/platform/sellers/settlements", {
      settlement_id: String(fd.get("settlement_id") ?? ""),
      from_status: String(fd.get("from_status") ?? ""),
      to_status: String(fd.get("to_status") ?? ""),
      rejection_reason: String(fd.get("rejection_reason") ?? ""),
      paid_at: String(fd.get("paid_at") ?? ""),
      payment_reference: String(fd.get("payment_reference") ?? ""),
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
          <Field name="partner_id" label={labels.partnerId} required />
          <label className="text-sm">
            <span className="font-medium">{labels.status}</span>
            <select name="status" className="mt-1 w-full rounded-xl border px-3 py-2" required>
              <option value="under_review">under_review</option>
              <option value="needs_information">needs_information</option>
              <option value="approved">approved</option>
              <option value="rejected">rejected</option>
              <option value="suspended">suspended</option>
            </select>
          </label>
          <Field name="reason" label={labels.reason} />
          <Submit pending={pending} label={labels.submitPartner} />
        </form>
      ) : null}
      {section === "settlements" ? (
        <form className="mt-4 grid max-w-xl gap-3" onSubmit={onSettlements}>
          <Field name="settlement_id" label={labels.settlementId} required />
          <Field name="from_status" label={labels.fromStatus} placeholder="open" required />
          <Field name="to_status" label={labels.toStatus} placeholder="approved" required />
          <Field name="rejection_reason" label={labels.rejectionReason} />
          <Field name="paid_at" label={labels.paidAt} />
          <Field name="payment_reference" label={labels.paymentReference} />
          <Submit pending={pending} label={labels.submitSettlement} />
        </form>
      ) : null}
      {section === "products" ? (
        <form className="mt-4 grid max-w-xl gap-3" onSubmit={onProducts}>
          <Field name="product_key" label={labels.productKey} required />
          <Field name="title" label={labels.productTitle} required />
          <Field name="currency" label={labels.currency} placeholder="NOK" required maxLength={3} />
          <Field name="fixed_commission_amount" label={labels.fixedCommission} type="number" required />
          <label className="flex items-center gap-2 text-sm">
            <input name="published" type="checkbox" />
            <span>{labels.published}</span>
          </label>
          <Submit pending={pending} label={labels.submitProduct} />
        </form>
      ) : null}
      {message ? (
        <p className="mt-4 text-sm text-[color:var(--aipify-text-secondary)]" role="status">
          {message.text}
        </p>
      ) : null}
    </section>
  );
}

function Field({
  name,
  label,
  required,
  placeholder,
  type = "text",
  maxLength,
}: {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  maxLength?: number;
}) {
  return (
    <label className="text-sm">
      <span className="font-medium">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
      />
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
