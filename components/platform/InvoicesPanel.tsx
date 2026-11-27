"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AipifyBillingDocumentHeader, AipifyEmptyState } from "@/components/branding";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  formatEconomyDate,
  formatEconomyMoney,
  moneyText,
  presentCustomerNumber,
  presentKidDisplay,
} from "@/lib/platform/economy-display";
import {
  calendarDateInTimeZone,
  classifyPlatformInvoice,
} from "@/lib/platform-portal/customer-invoice-status";
import { PlatformLayoutClasses } from "@/lib/design";
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
    customerNumber: string;
    paymentReference: string;
    kidNotApplicable: string;
    kidNotApplicablePaidOnline: string;
    kidMissingReview: string;
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
    unavailable: string;
    mustVerify: string;
    notRegistered: string;
    backToCustomer: string;
    filteredEmpty: string;
  };
  timeZone: string;
  customerId: string | null;
  bucket: "overdue" | "paid" | null;
  returnTo: string | null;
};

function providerMap(data: unknown): Record<string, string> {
  const map: Record<string, string> = {};
  if (!Array.isArray(data)) return map;
  for (const row of data) {
    if (!row || typeof row !== "object") continue;
    const record = row as { customer_id?: string; provider?: string };
    if (record.customer_id && record.provider) map[record.customer_id] = record.provider;
  }
  return map;
}

export default function InvoicesPanel({
  locale,
  labels,
  timeZone,
  customerId,
  bucket,
  returnTo,
}: InvoicesPanelProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Record<string, CustomerRecord>>({});
  const [providers, setProviders] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const [invoiceRes, customerRes, profileRes] = await Promise.all([
        supabase.rpc("list_platform_invoices"),
        supabase.rpc("list_platform_customer_records"),
        supabase.rpc("list_platform_payment_profiles"),
      ]);

      if (!cancelled) {
        setLoadError(Boolean(invoiceRes.error));
        setInvoices(invoiceRes.error || !invoiceRes.data ? [] : (invoiceRes.data as Invoice[]));
        const customerMap: Record<string, CustomerRecord> = {};
        if (customerRes.data) {
          for (const row of customerRes.data as CustomerRecord[]) {
            customerMap[row.id] = row;
          }
        }
        setCustomers(customerMap);
        setProviders(providerMap(profileRes.data));
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
      const [invoiceRes, customerRes, profileRes] = await Promise.all([
        supabase.rpc("list_platform_invoices"),
        supabase.rpc("list_platform_customer_records"),
        supabase.rpc("list_platform_payment_profiles"),
      ]);

      setLoadError(Boolean(invoiceRes.error));
      setInvoices(invoiceRes.error || !invoiceRes.data ? [] : (invoiceRes.data as Invoice[]));
      const customerMap: Record<string, CustomerRecord> = {};
      if (customerRes.data) {
        for (const row of customerRes.data as CustomerRecord[]) {
          customerMap[row.id] = row;
        }
      }
      setCustomers(customerMap);
      setProviders(providerMap(profileRes.data));
    } finally {
      setActingId(null);
    }
  }

  const today = calendarDateInTimeZone(new Date(), timeZone);
  const scoped = customerId
    ? invoices.filter((invoice) => invoice.customer_id === customerId)
    : invoices;
  let classificationFailed = false;
  const bucketRows = scoped.filter((invoice) => {
    const classified = classifyPlatformInvoice(
      {
        id: invoice.id,
        invoiceNumber: invoice.invoice_number,
        status: invoice.status,
        amount: invoice.amount,
        currency: invoice.currency,
        dueDate: invoice.due_date,
        issuedAt: invoice.issued_at,
        paidAt: invoice.paid_at,
      },
      today,
    );
    if (!classified.ok) {
      classificationFailed = true;
      return false;
    }
    return classified.presentation === bucket;
  });
  const filtered = {
    invalid: Boolean(bucket) && classificationFailed,
    rows: bucket ? bucketRows : scoped,
  };

  return (
    <div className={PlatformLayoutClasses.pageWidth}>
      <AipifyBillingDocumentHeader
        title={labels.title}
        subtitle={labels.subtitle}
        pulseLabel={labels.pulseLabel}
      />

      {returnTo ? (
        <p className="mb-4">
          <Link href={returnTo} className="text-sm font-medium text-violet-700 hover:text-violet-800">
            {labels.backToCustomer}
          </Link>
        </p>
      ) : null}

      {loading ? (
        <div className="flex min-h-[24vh] items-center justify-center">
          <AipifyLoader centered />
          <span className="sr-only">{labels.loading}</span>
        </div>
      ) : loadError ? (
        <p className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-700">
          {labels.unavailable}
        </p>
      ) : invoices.length === 0 ? (
        <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
      ) : filtered.invalid ? (
        <p className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-700">
          {labels.unavailable}
        </p>
      ) : filtered.rows.length === 0 ? (
        <AipifyEmptyState message={labels.filteredEmpty} pulseLabel={labels.pulseLabel} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-normal text-gray-500">
                    {labels.invoiceNumber}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-normal text-gray-500">
                    {labels.customer}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-normal text-gray-500">
                    {labels.customerNumber}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-normal text-gray-500">
                    {labels.amount}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-normal text-gray-500">
                    {labels.status}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-normal text-gray-500">
                    {labels.kid}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-normal text-gray-500">
                    {labels.paymentReference}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-normal text-gray-500">
                    {labels.dueDate}
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold tracking-normal text-gray-500">
                    {labels.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.rows.map((invoice) => {
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
                            href={`/platform/customers/${customer.id}?tab=subscription`}
                            className="text-sm font-semibold text-violet-600 hover:text-violet-700"
                          >
                            {customer.display_name}
                          </Link>
                        ) : (
                          <span className="text-sm text-gray-500">{labels.unavailable}</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-mono text-sm text-gray-700">
                        {presentCustomerNumber(customer?.customer_number, labels.unavailable)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {moneyText(
                          formatEconomyMoney({
                            amount: invoice.amount,
                            currency: invoice.currency,
                            locale,
                            scale: "major",
                          }),
                          labels.unavailable,
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge
                          status={invoice.status}
                          label={labels.statusLabels[invoice.status] ?? invoice.status}
                        />
                      </td>
                      <td
                        className="px-6 py-4 text-sm text-gray-600"
                        title={
                          presentKidDisplay({
                            kid: invoice.kid_number,
                            provider: providers[invoice.customer_id],
                            invoiceStatus: invoice.status,
                            phrases: labels,
                          }).storedPlaceholder ?? undefined
                        }
                      >
                        {
                          presentKidDisplay({
                            kid: invoice.kid_number,
                            provider: providers[invoice.customer_id],
                            invoiceStatus: invoice.status,
                            phrases: labels,
                          }).text
                        }
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-gray-600">
                        {invoice.provider_payment_id?.trim() || labels.unavailable}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatEconomyDate(invoice.due_date, locale) ?? labels.notRegistered}
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
