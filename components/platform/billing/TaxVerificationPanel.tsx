"use client";

import { AipifyLoader } from "@/components/ui/aipify-loader";
import { useCallback, useEffect, useState, type ReactNode } from "react";

type Props = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    legalReviewBanner: string;
    customerType: string;
    vatNumber: string;
    validationStatus: string;
    vatApplied: string;
    reverseCharge: string;
    invoiceHistory: string;
    validationLogs: string;
    taxNotes: string;
    auditLogs: string;
    empty: string;
    stats: Record<string, string>;
  };
};

export function TaxVerificationPanel({ labels }: Props) {
  const [center, setCenter] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/platform/billing/tax-verification");
    if (res.ok) setCenter(await res.json());
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered /><span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) return <p className="p-6 text-sm text-red-600">{labels.empty}</p>;

  const stats = (center.stats as Record<string, number>) ?? {};
  const sessions = (center.sessions as Record<string, unknown>[]) ?? [];
  const validations = (center.validations as Record<string, unknown>[]) ?? [];
  const invoices = (center.invoices as Record<string, unknown>[]) ?? [];
  const audit = (center.audit_recent as Record<string, unknown>[]) ?? [];

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">{labels.title}</h1>
        <p className="mt-2 text-zinc-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{labels.legalReviewBanner}</p>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(labels.stats).map(([key, label]) => (
          <div key={key} className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
            <dt className="text-xs uppercase text-zinc-500">{label}</dt>
            <dd className="mt-1 text-2xl font-semibold">{stats[key] ?? 0}</dd>
          </div>
        ))}
      </dl>

      <Section title={labels.customerType} items={sessions} render={(item) => (
        <p className="text-sm">{String(item.customer_type)} · {String(item.company_name || "—")} · {String(item.country)} · VAT {String(item.vat_rate)}% · {String(item.validation_status)}</p>
      )} />

      <Section title={labels.validationLogs} items={validations} render={(item) => (
        <p className="text-sm">{String(item.validation_source)} · {String(item.business_number)} · {String(item.validation_status)} · {String(item.registry_name || "—")}</p>
      )} />

      <Section title={labels.invoiceHistory} items={invoices} render={(item) => (
        <p className="text-sm">{String(item.invoice_reference)} · {String(item.customer_type)} · VAT {String(item.vat_rate)}% · {item.reverse_charge ? labels.reverseCharge : labels.vatApplied}</p>
      )} />

      <Section title={labels.auditLogs} items={audit} render={(item) => (
        <p className="text-sm">{String(item.event_type)} — {String(item.summary)}</p>
      )} />
    </div>
  );
}

function Section({ title, items, render }: { title: string; items: Record<string, unknown>[]; render: (item: Record<string, unknown>) => ReactNode }) {
  return (
    <section>
      <h2 className="font-semibold text-zinc-900">{title}</h2>
      <div className="mt-3 space-y-2">
        {items.length ? items.map((item, i) => (
          <div key={i} className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2">{render(item)}</div>
        )) : <p className="text-sm text-zinc-500">—</p>}
      </div>
    </section>
  );
}
