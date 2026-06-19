"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import {
  parseFinanceOperationsCenter,
  type FinanceExpense,
  type FinanceInvoice,
  type FinanceOperationsCenter,
  type FinanceOperationsLabels,
  type FinanceRevenue,
} from "@/lib/finance-operations";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";

type Tab =
  | "overview"
  | "revenue"
  | "expenses"
  | "invoices"
  | "subscriptions"
  | "approvals"
  | "forecasting"
  | "reports"
  | "integrations";

const INVOICE_STATUS_STYLE: Record<string, string> = {
  draft: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
  sent: "bg-aipify-accent-soft text-aipify-accent ring-aipify-accent-muted",
  overdue: "bg-amber-50 text-amber-900 ring-amber-200",
  paid: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  cancelled: "bg-gray-100 text-gray-600 ring-gray-200",
};

const EXPENSE_STATUS_STYLE: Record<string, string> = {
  draft: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
  submitted: "bg-sky-50 text-sky-900 ring-sky-200",
  approved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  rejected: "bg-red-50 text-red-900 ring-red-200",
  paid: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  cancelled: "bg-gray-100 text-gray-600 ring-gray-200",
};

function formatAmount(amount: number, currency: string) {
  return `${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${currency}`;
}

function ExpenseRow({
  expense,
  labels,
  busy,
  onSubmit,
  onApprove,
}: {
  expense: FinanceExpense;
  labels: FinanceOperationsLabels;
  busy: boolean;
  onSubmit: (id: string) => void;
  onApprove: (id: string) => void;
}) {
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs text-aipify-text-muted">{expense.expense_number ?? expense.id.slice(0, 8)}</p>
          <h3 className="font-semibold text-aipify-text">{expense.vendor_name || expense.category_key}</h3>
          <p className="text-aipify-text-secondary">
            {formatAmount(expense.amount, expense.currency)} · {expense.category_key.replace(/_/g, " ")}
          </p>
          {expense.department_name ? <p className="text-aipify-text-muted">{expense.department_name}</p> : null}
        </div>
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${EXPENSE_STATUS_STYLE[expense.status] ?? EXPENSE_STATUS_STYLE.draft}`}
        >
          {expense.status.replace(/_/g, " ")}
        </span>
      </div>
      {expense.status === "draft" ? (
        <button type="button" disabled={busy} onClick={() => onSubmit(expense.id)} className={`mt-3 ${AipifyShellClasses.secondaryButton}`}>
          {labels.submitExpense}
        </button>
      ) : null}
      {expense.approval_status.startsWith("pending") ? (
        <button type="button" disabled={busy} onClick={() => onApprove(expense.id)} className={`mt-3 ${AipifyShellClasses.primaryButton}`}>
          {labels.approveExpense}
        </button>
      ) : null}
    </div>
  );
}

function InvoiceRow({
  invoice,
  labels,
  busy,
  onSend,
  onPaid,
}: {
  invoice: FinanceInvoice;
  labels: FinanceOperationsLabels;
  busy: boolean;
  onSend: (id: string) => void;
  onPaid: (id: string) => void;
}) {
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs text-aipify-text-muted">{invoice.invoice_number ?? invoice.id.slice(0, 8)}</p>
          <h3 className="font-semibold text-aipify-text">{invoice.title}</h3>
          <p className="text-aipify-text-secondary">
            {invoice.customer_name} · {formatAmount(invoice.amount, invoice.currency)}
          </p>
          {invoice.due_date ? <p className="text-aipify-text-muted">Due {invoice.due_date}</p> : null}
        </div>
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${INVOICE_STATUS_STYLE[invoice.status] ?? INVOICE_STATUS_STYLE.draft}`}
        >
          {invoice.status.replace(/_/g, " ")}
        </span>
      </div>
      {invoice.status === "draft" ? (
        <button type="button" disabled={busy} onClick={() => onSend(invoice.id)} className={`mt-3 ${AipifyShellClasses.secondaryButton}`}>
          {labels.sendInvoice}
        </button>
      ) : null}
      {["sent", "overdue"].includes(invoice.status) ? (
        <button type="button" disabled={busy} onClick={() => onPaid(invoice.id)} className={`mt-3 ${AipifyShellClasses.primaryButton}`}>
          {labels.markPaid}
        </button>
      ) : null}
    </div>
  );
}

function RevenueRow({ revenue }: { revenue: FinanceRevenue }) {
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <p className="text-xs text-aipify-text-muted">{revenue.revenue_number ?? revenue.id.slice(0, 8)}</p>
      <h3 className="font-semibold text-aipify-text">{revenue.title}</h3>
      <p className="text-aipify-text-secondary">
        {formatAmount(revenue.amount, revenue.currency)} · {revenue.source_type.replace(/_/g, " ")} ·{" "}
        {revenue.revenue_type.replace(/_/g, " ")}
      </p>
    </div>
  );
}

type Props = { labels: FinanceOperationsLabels };

export function FinanceOperationsPanel({ labels }: Props) {
  const [center, setCenter] = useState<FinanceOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");
  const [busy, setBusy] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [customerName, setCustomerName] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/finance-operations");
    if (res.ok) setCenter(parseFinanceOperationsCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/finance-operations/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
  }

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }
  if (!center?.found) {
    return (
      <AipifyModuleAccessDenied message={labels.accessDenied} />
    );
  }

  const overview = center.overview ?? {};
  const reports = center.reports ?? {};
  const health = String(overview.financial_health ?? "attention");

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: labels.overview },
    { key: "revenue", label: labels.revenue },
    { key: "expenses", label: labels.expenses },
    { key: "invoices", label: labels.invoices },
    { key: "subscriptions", label: labels.subscriptions },
    { key: "approvals", label: labels.approvals },
    { key: "forecasting", label: labels.forecasting },
    { key: "reports", label: labels.reports },
    { key: "integrations", label: labels.integrations },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-aipify-text">{labels.title}</h1>
        <p className="mt-2 text-aipify-text-secondary">{labels.subtitle}</p>
        {center.principle ? (
          <p className="mt-2 text-sm font-medium text-aipify-companion">{center.principle}</p>
        ) : null}
      </div>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {(
          [
            [labels.revenueThisMonth, overview.revenue_this_month],
            [labels.expensesThisMonth, overview.expenses_this_month],
            [labels.outstandingInvoices, overview.outstanding_invoices],
            [labels.pendingApprovals, overview.pending_approvals],
            [labels.financialHealth, health === "healthy" ? labels.healthy : labels.attention],
          ] as [string, unknown][]
        ).map(([label, value]) => (
          <div key={label} className={`${AipifyShellClasses.surfaceCard} p-4`}>
            <p className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">{label}</p>
            <p className="mt-1 text-xl font-semibold text-aipify-text">{String(value ?? "—")}</p>
          </div>
        ))}
      </div>

      {(tab === "overview") && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              [labels.revenueYtd, overview.revenue_ytd],
              [labels.expensesYtd, overview.expenses_ytd],
              [labels.cashFlowSnapshot, overview.cash_flow_snapshot],
              [labels.subscriptionCosts, overview.subscription_costs_monthly],
            ] as [string, unknown][]
          ).map(([label, value]) => (
            <div key={label} className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <p className="text-xs font-medium uppercase text-aipify-text-muted">{label}</p>
              <p className="mt-1 text-lg font-semibold text-aipify-text">{String(value ?? "—")}</p>
            </div>
          ))}
        </div>
      )}

      <div className="-mx-1 flex gap-1 overflow-x-auto border-b border-aipify-border pb-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium ${
              tab === t.key ? "bg-aipify-companion text-white shadow-sm" : "text-aipify-text-secondary hover:bg-aipify-surface-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {(tab === "expenses" || tab === "overview") && (
        <form
          className="flex flex-col gap-2 rounded-2xl border border-aipify-border bg-aipify-surface-muted p-4 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            void runAction("create_expense", { vendor_name: vendorName, amount: Number(amount) || 0, category_key: "operations" });
            setVendorName("");
            setAmount("");
          }}
        >
          <input
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            placeholder={labels.vendorName}
            className={`flex-1 ${AipifyShellClasses.input} px-3 py-2 text-sm`}
            required
          />
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            min="0"
            step="0.01"
            placeholder={labels.amount}
            className={`w-32 ${AipifyShellClasses.input} px-3 py-2 text-sm`}
            required
          />
          <button type="submit" disabled={busy} className={AipifyShellClasses.primaryButton}>
            {labels.createExpense}
          </button>
        </form>
      )}

      {(tab === "invoices" || tab === "overview") && (
        <form
          className="flex flex-col gap-2 rounded-2xl border border-aipify-border bg-aipify-surface-muted p-4 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            void runAction("create_invoice", { title, customer_name: customerName, amount: Number(amount) || 0 });
            setTitle("");
            setCustomerName("");
            setAmount("");
          }}
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={labels.titleLabel}
            className={`flex-1 ${AipifyShellClasses.input} px-3 py-2 text-sm`}
            required
          />
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder={labels.customerName}
            className={`flex-1 ${AipifyShellClasses.input} px-3 py-2 text-sm`}
          />
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            min="0"
            step="0.01"
            placeholder={labels.amount}
            className={`w-32 ${AipifyShellClasses.input} px-3 py-2 text-sm`}
            required
          />
          <button type="submit" disabled={busy} className={AipifyShellClasses.primaryButton}>
            {labels.createInvoice}
          </button>
        </form>
      )}

      {tab === "revenue" && (
        <form
          className="flex flex-col gap-2 rounded-2xl border border-aipify-border bg-aipify-surface-muted p-4 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            void runAction("create_revenue", { title, amount: Number(amount) || 0, category_key: "services" });
            setTitle("");
            setAmount("");
          }}
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={labels.titleLabel}
            className={`flex-1 ${AipifyShellClasses.input} px-3 py-2 text-sm`}
            required
          />
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            min="0"
            step="0.01"
            placeholder={labels.amount}
            className={`w-32 ${AipifyShellClasses.input} px-3 py-2 text-sm`}
            required
          />
          <button type="submit" disabled={busy} className={AipifyShellClasses.primaryButton}>
            {labels.createRevenue}
          </button>
        </form>
      )}

      {(tab === "expenses" || tab === "overview") && (
        <div className="grid gap-3 lg:grid-cols-2">
          {(center.expenses ?? []).length === 0 ? (
            <PlatformEmptyState title={labels.noExpenses} message={labels.noExpensesHint} primaryAction={{ label: labels.createExpense, onClick: () => setTab("expenses") }} />
          ) : (
            (center.expenses ?? [])
              .slice(0, tab === "overview" ? 3 : 100)
              .map((e) => (
                <ExpenseRow
                  key={e.id}
                  expense={e}
                  labels={labels}
                  busy={busy}
                  onSubmit={(id) => void runAction("submit_expense", { expense_id: id })}
                  onApprove={(id) => void runAction("approve_expense", { expense_id: id })}
                />
              ))
          )}
        </div>
      )}

      {(tab === "invoices" || tab === "overview") && (
        <div className="grid gap-3 lg:grid-cols-2">
          {(center.invoices ?? []).length === 0 && tab === "invoices" ? (
            <PlatformEmptyState title={labels.noInvoices} message={labels.noExpensesHint} />
          ) : (
            (center.invoices ?? [])
              .slice(0, tab === "overview" ? 3 : 100)
              .map((i) => (
                <InvoiceRow
                  key={i.id}
                  invoice={i}
                  labels={labels}
                  busy={busy}
                  onSend={(id) => void runAction("send_invoice", { invoice_id: id })}
                  onPaid={(id) => void runAction("mark_invoice_paid", { invoice_id: id })}
                />
              ))
          )}
        </div>
      )}

      {tab === "revenue" && (
        <div className="grid gap-3 lg:grid-cols-2">
          {(center.revenue ?? []).map((r) => (
            <RevenueRow key={r.id} revenue={r} />
          ))}
        </div>
      )}

      {tab === "subscriptions" && (
        <div className="space-y-2">
          {(center.subscriptions ?? []).map((s, i) => (
            <div key={i} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="font-medium text-aipify-text">
                {String(s.service_name ?? "")} · {String(s.vendor_name ?? "")}
              </p>
              <p className="text-aipify-text-secondary">
                {String(s.amount ?? "")} · {String(s.billing_cycle ?? "")} · renews {String(s.renewal_date ?? "—")}
              </p>
            </div>
          ))}
        </div>
      )}

      {tab === "approvals" && (
        <div className="space-y-2">
          {(center.approvals ?? []).map((a, i) => (
            <div key={i} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="font-medium text-aipify-text">{String(a.reference_label ?? "")}</p>
              <p className="text-aipify-text-secondary">
                {String(a.approval_type ?? "")} · {String(a.amount ?? "")} · {String(a.status ?? "")}
              </p>
              <button
                type="button"
                disabled={busy}
                onClick={() => void runAction("approve_request", { approval_id: a.id })}
                className={`mt-2 ${AipifyShellClasses.primaryButton}`}
              >
                {labels.approveExpense}
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "forecasting" && (
        <div className="space-y-2">
          {(center.forecasting ?? []).map((f, i) => (
            <div key={i} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="font-medium text-aipify-text">{String(f.title ?? "")}</p>
              <p className="text-aipify-text-secondary">
                {String(f.forecast_type ?? "")} · {String(f.period_label ?? "")} · projected {String(f.projected_amount ?? "")}
              </p>
            </div>
          ))}
        </div>
      )}

      {tab === "reports" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              ["Revenue growth %", reports.revenue_growth_percent],
              ["Expense trend", reports.expense_trend],
              ["Profit estimate", reports.profit_estimate],
            ] as [string, unknown][]
          ).map(([label, value]) => (
            <div key={label} className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <p className="text-xs font-medium uppercase text-aipify-text-muted">{label}</p>
              <p className="mt-1 text-xl font-semibold text-aipify-text">{String(value ?? "—")}</p>
            </div>
          ))}
          {(center.budgets ?? []).length > 0 && (
            <div className="col-span-full">
              <h3 className="mb-2 text-sm font-semibold text-aipify-text">{labels.budgets}</h3>
              <div className="grid gap-2 lg:grid-cols-2">
                {(center.budgets ?? []).map((b, i) => (
                  <div key={i} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                    <p className="font-medium text-aipify-text">{String(b.name ?? "")}</p>
                    <p className="text-aipify-text-secondary">
                      {String(b.utilization_percent ?? 0)}% used · limit {String(b.amount_limit ?? "")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "integrations" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(center.integrations ?? []).map((i, idx) => (
            <div key={idx} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="font-medium text-aipify-text">{String(i.name ?? "")}</p>
              <p className="text-aipify-text-muted capitalize">{String(i.status ?? "prepared")}</p>
              <p className="mt-1 text-xs text-aipify-text-secondary">Aipify organizes. Accounting systems account.</p>
            </div>
          ))}
        </div>
      )}

      {(center.audit_recent ?? []).length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-semibold text-aipify-text">{labels.auditLog}</h2>
          <div className="space-y-1">
            {(center.audit_recent ?? []).map((a, i) => (
              <p key={i} className="text-xs text-aipify-text-muted">
                {a.summary} · {a.created_at}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
