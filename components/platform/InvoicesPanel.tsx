"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AipifyBillingDocumentHeader, AipifyEmptyState } from "@/components/branding";
import { formatDate } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";
import type { CustomerRecord, Invoice, InvoiceAction } from "@/lib/platform/types";
import StatusBadge from "./StatusBadge";

type InvoicesPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    invoiceNumber: string;
    customer: string;
    amount: string;
    status: string;
    dueDate: string;
    kid: string;
    actions: string;
    send: string;
    resend: string;
    markPaid: string;
    markOverdue: string;
    markFailed: string;
    downloadPdf: string;
    actionPending: string;
    actionDone: string;
    statusLabels: Record<string, string>;
    pulseLabel: string;
  };
};

export default function InvoicesPanel({ locale, labels }: InvoicesPanelProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Record<string, CustomerRecord>>({});
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const [invoiceRes, customerRes] = await Promise.all([
        supabase.rpc("list_platform_invoices"),
        supabase.rpc("list_platform_customer_records"),
      ]);

      if (!cancelled) {
        setInvoices(invoiceRes.data ? (invoiceRes.data as Invoice[]) : []);
        const customerMap: Record<string, CustomerRecord> = {};
        if (customerRes.data) {
          for (const row of customerRes.data as CustomerRecord[]) {
            customerMap[row.id] = row;
          }
        }
        setCustomers(customerMap);
        setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  async function runAction(invoiceId: string, action: InvoiceAction) {
    setActingId(invoiceId);
    try {
      await fetch(`/api/platform/invoices/${invoiceId}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const supabase = createClient();
      const [invoiceRes, customerRes] = await Promise.all([
        supabase.rpc("list_platform_invoices"),
        supabase.rpc("list_platform_customer_records"),
      ]);

      setInvoices(invoiceRes.data ? (invoiceRes.data as Invoice[]) : []);
      const customerMap: Record<string, CustomerRecord> = {};
      if (customerRes.data) {
        for (const row of customerRes.data as CustomerRecord[]) {
          customerMap[row.id] = row;
        }
      }
      setCustomers(customerMap);
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <AipifyBillingDocumentHeader
        title={labels.title}
        subtitle={labels.subtitle}
        pulseLabel={labels.pulseLabel}
      />

      {loading ? (
        <p className="text-sm text-gray-500">{labels.loading}</p>
      ) : invoices.length === 0 ? (
        <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.invoiceNumber}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.customer}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.amount}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.status}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.kid}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.dueDate}
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((invoice) => {
                  const customer = customers[invoice.customer_id];
                  const busy = actingId === invoice.id;

                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50/60">
                      <td className="whitespace-nowrap px-6 py-4 font-mono text-sm font-medium text-gray-900">
                        {invoice.invoice_number}
                      </td>
                      <td className="px-6 py-4">
                        {customer ? (
                          <Link
                            href={`/platform/customers/${customer.id}`}
                            className="text-sm font-semibold text-violet-600 hover:text-violet-700"
                          >
                            {customer.display_name}
                          </Link>
                        ) : (
                          <span className="text-sm text-gray-500">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {invoice.amount} {invoice.currency}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge
                          status={invoice.status}
                          label={labels.statusLabels[invoice.status] ?? invoice.status}
                        />
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-gray-600">
                        {invoice.kid_number ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(invoice.due_date, locale)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap justify-end gap-2">
                          {invoice.status === "draft" && (
                            <ActionButton
                              disabled={busy}
                              onClick={() => runAction(invoice.id, "send")}
                              label={labels.send}
                            />
                          )}
                          {(invoice.status === "sent" || invoice.status === "overdue") && (
                            <ActionButton
                              disabled={busy}
                              onClick={() => runAction(invoice.id, "resend")}
                              label={labels.resend}
                            />
                          )}
                          {invoice.status !== "paid" && invoice.status !== "cancelled" && (
                            <ActionButton
                              disabled={busy}
                              onClick={() => runAction(invoice.id, "mark_paid")}
                              label={labels.markPaid}
                            />
                          )}
                          {invoice.status === "sent" && (
                            <ActionButton
                              disabled={busy}
                              onClick={() => runAction(invoice.id, "mark_overdue")}
                              label={labels.markOverdue}
                            />
                          )}
                          {invoice.status !== "failed" &&
                            invoice.status !== "paid" &&
                            invoice.status !== "cancelled" && (
                              <ActionButton
                                disabled={busy}
                                onClick={() => runAction(invoice.id, "mark_failed")}
                                label={labels.markFailed}
                              />
                            )}
                          {invoice.pdf_url && (
                            <a
                              href={invoice.pdf_url}
                              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                            >
                              {labels.downloadPdf}
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
    >
      {label}
    </button>
  );
}
