"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { EnterpriseInvoiceTable } from "@/components/shared/billing-experience";
import {
  parseEnterpriseInvoiceBillingCenter,
  type EnterpriseInvoice,
  type EnterpriseInvoiceAuditEntry,
  type EnterpriseInvoicingLabels,
} from "@/lib/enterprise-invoicing";
import type { BillingExperienceLabels } from "@/lib/billing-experience";
import { ENTERPRISE_PROCUREMENT_METHODS } from "@/lib/billing-experience/constants";

type EnterpriseInvoicesPanelProps = {
  labels: EnterpriseInvoicingLabels;
  billingLabels: BillingExperienceLabels;
  backHref: string;
};

export function EnterpriseInvoicesPanel({
  labels,
  billingLabels,
  backHref,
}: EnterpriseInvoicesPanelProps) {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<EnterpriseInvoice[]>([]);
  const [audit, setAudit] = useState<EnterpriseInvoiceAuditEntry[]>([]);
  const [canManage, setCanManage] = useState(false);
  const [canFinance, setCanFinance] = useState(false);
  const [overdueCount, setOverdueCount] = useState(0);
  const [actingId, setActingId] = useState<string | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<EnterpriseInvoice | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/enterprise-invoicing/center?scope=platform");
    if (res.ok) {
      const center = parseEnterpriseInvoiceBillingCenter(await res.json());
      if (center) {
        setInvoices(center.invoices);
        setAudit(center.recent_audit);
        setCanManage(center.can_manage);
        setCanFinance(center.can_finance);
        setOverdueCount(center.overdue_count);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function runAction(invoiceId: string, action: string, extra: Record<string, unknown> = {}) {
    setActingId(invoiceId);
    await fetch("/api/enterprise-invoicing/invoices/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoice_id: invoiceId, action, ...extra }),
    });
    setActingId(null);
    await load();
  }

  async function handleView(invoice: EnterpriseInvoice) {
    setViewingInvoice(invoice);
    await runAction(invoice.id, "mark_viewed");
  }

  async function handleDownloadPdf(invoice: EnterpriseInvoice) {
    setActingId(invoice.id);
    const res = await fetch(`/api/enterprise-invoicing/invoices/${invoice.id}/pdf`);
    setActingId(null);
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${invoice.invoice_number}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    }
  }

  if (loading) {
    return <p className="p-6 text-sm text-slate-600">{labels.loading}</p>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <Link href={backHref} className="text-sm text-slate-600 hover:underline">
          ← {labels.back}
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{labels.title}</h1>
        <p className="mt-2 text-slate-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {billingLabels.principle}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
          <h2 className="font-semibold text-emerald-900">{billingLabels.instantActivation.title}</h2>
          <p className="mt-2 text-sm text-emerald-800">{billingLabels.instantActivation.description}</p>
          <p className="mt-3 rounded-xl border border-emerald-100 bg-white/80 px-3 py-2 text-sm text-emerald-900">
            {billingLabels.instantActivation.message}
          </p>
          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-emerald-700">
            Stripe · Klarna · Vipps MobilePay
          </p>
        </section>
        <section className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">{billingLabels.enterpriseProcurement.title}</h2>
          <p className="mt-2 text-sm text-slate-600">{billingLabels.enterpriseProcurement.description}</p>
          <p className="mt-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            {billingLabels.enterpriseProcurement.message}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {ENTERPRISE_PROCUREMENT_METHODS.map((method) => (
              <li
                key={method}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
              >
                {billingLabels.enterpriseProcurement.methods[method]}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {overdueCount > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {labels.overdueBanner.replace("{count}", String(overdueCount))}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {labels.invoiceCenter?.title ?? labels.sections.invoices}
          </h2>
        </div>
        <EnterpriseInvoiceTable
          invoices={invoices}
          labels={labels}
          canManage={canManage}
          canFinance={canFinance}
          actingId={actingId}
          onAction={(id, action) => void runAction(id, action)}
          onView={(invoice) => void handleView(invoice)}
          onDownloadPdf={(invoice) => void handleDownloadPdf(invoice)}
        />
      </section>

      {viewingInvoice && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <span className="font-medium">{viewingInvoice.invoice_number}</span> — {viewingInvoice.description}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{labels.sections.audit}</h2>
        {audit.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">{labels.empty}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {audit.map((entry) => (
              <li key={entry.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                <span className="font-medium">{entry.event_type}</span> — {entry.summary}
                <span className="mt-1 block text-xs text-slate-500">{entry.created_at}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
