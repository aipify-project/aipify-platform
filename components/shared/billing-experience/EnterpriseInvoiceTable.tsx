"use client";

import type { EnterpriseInvoice, EnterpriseInvoicingLabels } from "@/lib/enterprise-invoicing";
import { INVOICE_STATUS_BADGES, BILLING_METHOD_LABEL_KEYS } from "@/lib/billing-experience/constants";

type EnterpriseInvoiceTableProps = {
  invoices: EnterpriseInvoice[];
  labels: EnterpriseInvoicingLabels;
  canManage: boolean;
  canFinance: boolean;
  actingId: string | null;
  onAction: (invoiceId: string, action: string) => void;
  onView: (invoice: EnterpriseInvoice) => void;
  onDownloadPdf: (invoice: EnterpriseInvoice) => void;
};

function paymentMethodLabel(invoice: EnterpriseInvoice, labels: EnterpriseInvoicingLabels): string {
  const key = BILLING_METHOD_LABEL_KEYS[invoice.billing_method];
  if (key && labels.paymentMethods?.[key]) return labels.paymentMethods[key];
  return invoice.billing_method.replace(/_/g, " ");
}

function statusBadgeClass(status: string): string {
  return INVOICE_STATUS_BADGES[status] ?? "bg-slate-100 text-slate-700 ring-slate-200";
}

export function EnterpriseInvoiceTable({
  invoices,
  labels,
  canManage,
  canFinance,
  actingId,
  onAction,
  onView,
  onDownloadPdf,
}: EnterpriseInvoiceTableProps) {
  const displayStatuses = ["draft", "sent", "paid", "overdue", "cancelled"] as const;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            <th className="px-6 py-3 font-medium">{labels.fields.tenant}</th>
            <th className="px-6 py-3 font-medium">{labels.fields.invoiceNumber}</th>
            <th className="px-6 py-3 font-medium">{labels.fields.amount}</th>
            <th className="px-6 py-3 font-medium">{labels.fields.status}</th>
            <th className="px-6 py-3 font-medium">{labels.fields.dueDate}</th>
            <th className="px-6 py-3 font-medium">{labels.fields.paymentMethod}</th>
            <th className="px-6 py-3 font-medium">{labels.sections.actions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {invoices.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                {labels.invoiceCenter?.emptyStructure ?? labels.empty}
              </td>
            </tr>
          ) : (
            invoices.map((invoice) => (
              <tr key={invoice.id} className={invoice.is_overdue ? "bg-amber-50/50" : undefined}>
                <td className="px-6 py-3 font-medium text-slate-900">{invoice.tenant_name}</td>
                <td className="px-6 py-3 text-slate-700">{invoice.invoice_number}</td>
                <td className="px-6 py-3 text-slate-700">
                  {invoice.total_amount} {invoice.currency}
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusBadgeClass(invoice.status)}`}
                  >
                    {labels.statuses[invoice.status] ?? invoice.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-slate-600">{invoice.due_date ?? "—"}</td>
                <td className="px-6 py-3 text-slate-600">{paymentMethodLabel(invoice, labels)}</td>
                <td className="px-6 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={actingId === invoice.id}
                      className="rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
                      onClick={() => onView(invoice)}
                    >
                      {labels.actions.view ?? "View"}
                    </button>
                    <button
                      type="button"
                      disabled={actingId === invoice.id}
                      className="rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
                      onClick={() => onDownloadPdf(invoice)}
                    >
                      {labels.actions.downloadPdf}
                    </button>
                    {canManage && invoice.status === "draft" && (
                      <button
                        type="button"
                        disabled={actingId === invoice.id}
                        className="rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
                        onClick={() => onAction(invoice.id, "send")}
                      >
                        {labels.actions.send}
                      </button>
                    )}
                    {canManage && invoice.suggest_reminder && (
                      <button
                        type="button"
                        disabled={actingId === invoice.id}
                        className="rounded-md border border-amber-200 px-2 py-1 text-xs text-amber-800 hover:bg-amber-50"
                        onClick={() => onAction(invoice.id, "send_reminder")}
                      >
                        {labels.actions.sendReminder}
                      </button>
                    )}
                    {canFinance && !["paid", "credited", "cancelled"].includes(invoice.status) && (
                      <button
                        type="button"
                        disabled={actingId === invoice.id}
                        className="rounded-md border border-emerald-200 px-2 py-1 text-xs text-emerald-800 hover:bg-emerald-50"
                        onClick={() => onAction(invoice.id, "mark_paid")}
                      >
                        {labels.actions.markPaid}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {invoices.length === 0 && (
        <div className="flex flex-wrap gap-2 border-t border-slate-100 px-6 py-3">
          {displayStatuses.map((status) => (
            <span
              key={status}
              className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusBadgeClass(status)}`}
            >
              {labels.statuses[status]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
