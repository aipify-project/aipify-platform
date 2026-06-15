"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsFinanceCenterActionResult,
  parseAipifyHostsFinanceCenterDashboard,
  type HostsFinanceCenterDashboard,
  type HostsFinanceCenterSectionKey,
} from "@/lib/aipify/aipify-hosts-finance-center";

type Props = { labels: Record<string, string> };

function formatAmount(n: number, currency = "NOK"): string {
  return new Intl.NumberFormat("nb-NO", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
}

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    pending: "bg-amber-50 text-amber-900 ring-amber-200",
    confirmed: "bg-sky-50 text-sky-800 ring-sky-200",
    paid: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    cancelled: "bg-red-50 text-red-800 ring-red-200",
    scheduled: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    processing: "bg-sky-50 text-sky-800 ring-sky-200",
    completed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    delayed: "bg-red-50 text-red-800 ring-red-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-700 ring-gray-200";
}

function labelFor(labels: Record<string, string>, prefix: string, key: string): string {
  return labels[`${prefix}_${key}`] ?? key.replace(/_/g, " ");
}

function EmptyBoard({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-8 text-center">
      <p className="text-sm font-medium text-gray-800">{title}</p>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

export function AipifyHostsFinanceCenterDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HostsFinanceCenterDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState<HostsFinanceCenterSectionKey>("overview");
  const [propertyFilter, setPropertyFilter] = useState("");
  const [revenueStatusFilter, setRevenueStatusFilter] = useState("");
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState("");
  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("cleaning");

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const params = new URLSearchParams({ section: activeSection, filter: "all_properties" });
    if (propertyFilter) params.set("property_id", propertyFilter);
    if (revenueStatusFilter) params.set("revenue_status", revenueStatusFilter);
    if (expenseCategoryFilter) params.set("expense_category", expenseCategoryFilter);
    const res = await fetch(`/api/aipify/aipify-hosts/finance-center/dashboard?${params.toString()}`);
    if (res.ok) {
      setDashboard(parseAipifyHostsFinanceCenterDashboard(await res.json()));
    } else {
      setError(true);
    }
    setLoading(false);
  }, [activeSection, propertyFilter, revenueStatusFilter, expenseCategoryFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (body: Record<string, unknown>) => {
    setBusy(true);
    setActionMessage(null);
    const res = await fetch("/api/aipify/aipify-hosts/finance-center/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = parseAipifyHostsFinanceCenterActionResult(await res.json());
    setBusy(false);
    if (result.success) {
      setActionMessage(result.message ?? labels.actionRecorded);
      setExpenseAmount("");
      await load();
    } else {
      setActionMessage(labels.actionFailed);
    }
  };

  if (loading && !dashboard) return <AipifyLoader label={labels.loading} centered fullPage />;

  if (error || !dashboard) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  const ov = dashboard.overview;
  const fc = dashboard.forecast;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6">
        <p className="text-sm font-medium text-emerald-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-emerald-900">{labels.governanceNote}</p>
        <Link href="/app/aipify-hosts" className="mt-4 inline-flex rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-50">
          {labels.backToHosts}
        </Link>
      </section>

      {dashboard.notifications.length > 0 && (
        <section className="space-y-2">
          {dashboard.notifications.filter((n) => n.active).map((n) => (
            <div key={n.key} className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">{n.message}</div>
          ))}
        </section>
      )}

      <section className="flex flex-wrap gap-2">
        {dashboard.properties.length > 0 && (
          <select value={propertyFilter} onChange={(e) => setPropertyFilter(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm">
            <option value="">{labels.allProperties}</option>
            {dashboard.properties.map((p) => (
              <option key={p.id} value={p.id}>{p.display_name}</option>
            ))}
          </select>
        )}
        {(activeSection === "revenue") && (
          <select value={revenueStatusFilter} onChange={(e) => setRevenueStatusFilter(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm">
            <option value="">{labels.allRevenueStatuses}</option>
            {dashboard.revenue_statuses.map((s) => (
              <option key={s} value={s}>{labelFor(labels, "revstatus", s)}</option>
            ))}
          </select>
        )}
        {(activeSection === "expenses") && (
          <select value={expenseCategoryFilter} onChange={(e) => setExpenseCategoryFilter(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm">
            <option value="">{labels.allExpenseCategories}</option>
            {dashboard.expense_categories.map((c) => (
              <option key={c} value={c}>{labelFor(labels, "expcat", c)}</option>
            ))}
          </select>
        )}
      </section>

      <nav className="flex gap-1 overflow-x-auto border-b border-gray-200 pb-px">
        {dashboard.sections.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setActiveSection(s.key as HostsFinanceCenterSectionKey)}
            className={`whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-medium ${
              activeSection === s.key ? "border border-b-0 border-gray-200 bg-white text-emerald-900" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {activeSection === "overview" && (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <MetricCard label={labels.revenueThisMonth} value={formatAmount(ov.revenue_this_month)} />
          <MetricCard label={labels.revenueYtd} value={formatAmount(ov.revenue_ytd)} />
          <MetricCard label={labels.upcomingPayouts} value={formatAmount(ov.upcoming_payouts)} />
          <MetricCard label={labels.outstandingExpenses} value={formatAmount(ov.outstanding_expenses)} />
          <MetricCard label={labels.netPerformance} value={formatAmount(ov.net_performance)} />
        </dl>
      )}

      {activeSection === "revenue" && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          {dashboard.revenue_entries.length === 0 ? (
            <EmptyBoard title={labels.emptyRevenueTitle} message={labels.emptyRevenueMessage} />
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">{labels.property}</th>
                  <th className="px-4 py-3">{labels.reservationRef}</th>
                  <th className="px-4 py-3">{labels.checkIn}</th>
                  <th className="px-4 py-3">{labels.checkOut}</th>
                  <th className="px-4 py-3">{labels.amount}</th>
                  <th className="px-4 py-3">{labels.status}</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.revenue_entries.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.property}</td>
                    <td className="px-4 py-3 text-gray-700">{r.reservation_ref}</td>
                    <td className="px-4 py-3 text-gray-700">{r.check_in_date ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-700">{r.check_out_date ?? "—"}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{formatAmount(r.amount)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(r.revenue_status)}`}>
                        {labelFor(labels, "revstatus", r.revenue_status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeSection === "payouts" && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          {dashboard.payouts.length === 0 ? (
            <EmptyBoard title={labels.emptyPayoutsTitle} message={labels.emptyPayoutsMessage} />
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">{labels.expectedDate}</th>
                  <th className="px-4 py-3">{labels.amount}</th>
                  <th className="px-4 py-3">{labels.source}</th>
                  <th className="px-4 py-3">{labels.status}</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.payouts.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100">
                    <td className="px-4 py-3 text-gray-700">{p.expected_date}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{formatAmount(p.amount)}</td>
                    <td className="px-4 py-3 text-gray-700">{p.source}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(p.payout_status)}`}>
                        {labelFor(labels, "paystatus", p.payout_status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeSection === "expenses" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-gray-900">{labels.recordExpense}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <select value={expenseCategory} onChange={(e) => setExpenseCategory(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                {dashboard.expense_categories.map((c) => (
                  <option key={c} value={c}>{labelFor(labels, "expcat", c)}</option>
                ))}
              </select>
              <input type="number" min="1" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} placeholder={labels.amountPlaceholder} className="rounded-lg border border-gray-300 px-3 py-2 text-sm w-32" />
              <button type="button" disabled={busy || !expenseAmount} onClick={() => void runAction({ action: "record_expense", category: expenseCategory, amount: Number(expenseAmount), property_id: propertyFilter || undefined })} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                {labels.saveExpense}
              </button>
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            {dashboard.expenses.length === 0 ? (
              <EmptyBoard title={labels.emptyExpensesTitle} message={labels.emptyExpensesMessage} />
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">{labels.category}</th>
                    <th className="px-4 py-3">{labels.property}</th>
                    <th className="px-4 py-3">{labels.amount}</th>
                    <th className="px-4 py-3">{labels.date}</th>
                    <th className="px-4 py-3">{labels.notes}</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.expenses.map((e) => (
                    <tr key={e.id} className="border-b border-gray-100">
                      <td className="px-4 py-3">{labelFor(labels, "expcat", e.category)}</td>
                      <td className="px-4 py-3 text-gray-700">{e.property}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{formatAmount(e.amount)}</td>
                      <td className="px-4 py-3 text-gray-700">{e.expense_date}</td>
                      <td className="px-4 py-3 text-gray-600">{e.notes ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeSection === "forecasts" && (
        <dl className="grid gap-4 sm:grid-cols-3">
          <MetricCard label={labels.expectedRevenue} value={formatAmount(fc.expected_revenue)} />
          <MetricCard label={labels.expectedExpenses} value={formatAmount(fc.expected_expenses)} />
          <MetricCard label={labels.estimatedNet} value={formatAmount(fc.estimated_net_position)} />
        </dl>
      )}

      {activeSection === "reports" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {dashboard.reports.map((report) => (
            <article key={report.key} className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="font-semibold text-gray-900">{report.label}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {dashboard.export_formats.map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    disabled={busy}
                    onClick={() => void runAction({ action: "export_report", report_key: report.key, format: fmt })}
                    className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-900 hover:bg-emerald-100 disabled:opacity-60"
                  >
                    {labelFor(labels, "export", fmt)}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}

      {actionMessage && (
        <p className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{actionMessage}</p>
      )}
    </div>
  );
}
