"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parsePartnerSettlementDetail,
  parsePartnerSettlementsHistory,
  parsePartnerSettlementsOverview,
  settlementStatusLabel,
  type PartnerSettlementDetail,
  type PartnerSettlementsHistory,
  type PartnerSettlementsOverview,
} from "@/lib/partner-settlements";

type Props = {
  labels: Record<string, string>;
};

function formatMoney(value: number): string {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

export function PartnerSettlementsPanel({ labels }: Props) {
  const [overview, setOverview] = useState<PartnerSettlementsOverview | null>(null);
  const [detail, setDetail] = useState<PartnerSettlementDetail | null>(null);
  const [history, setHistory] = useState<PartnerSettlementsHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [approvalChecked, setApprovalChecked] = useState(false);

  const loadDetail = useCallback(async (settlementId: string) => {
    const res = await fetch(`/api/partner/settlements/${settlementId}`);
    if (res.ok) {
      setDetail(parsePartnerSettlementDetail(await res.json()));
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    setDenied(false);
    try {
      const [overviewRes, historyRes] = await Promise.all([
        fetch("/api/partner/settlements"),
        fetch("/api/partner/settlements/history"),
      ]);
      const overviewJson = overviewRes.ok ? await overviewRes.json() : null;
      if (!overviewJson?.has_access) {
        setDenied(true);
        setLoading(false);
        return;
      }
      const parsedOverview = parsePartnerSettlementsOverview(overviewJson);
      setOverview(parsedOverview);
      if (historyRes.ok) {
        setHistory(parsePartnerSettlementsHistory(await historyRes.json()));
      }
      if (parsedOverview?.current_settlement_id) {
        await loadDetail(parsedOverview.current_settlement_id);
      } else {
        setDetail(null);
      }
    } catch {
      setError(true);
    }
    setLoading(false);
  }, [loadDetail]);

  useEffect(() => {
    void load();
  }, [load]);

  const acceptAgreement = async () => {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/partner/settlements/agreement", { method: "POST" });
    if (res.ok) {
      setOverview(parsePartnerSettlementsOverview(await res.json()));
      setMessage(labels.agreementAccepted);
    } else {
      setMessage(labels.actionFailed);
    }
    setBusy(false);
  };

  const prepareSettlement = async () => {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/partner/settlements/prepare", { method: "POST" });
    const json = res.ok ? await res.json() : null;
    if (json?.has_access) {
      const parsed = parsePartnerSettlementDetail(json);
      setDetail(parsed);
      if (parsed?.has_payable_settlement) {
        setMessage(labels.prepared);
      }
      await load();
    } else if (json?.message) {
      setMessage(json.message as string);
    } else {
      setMessage(labels.actionFailed);
    }
    setBusy(false);
  };

  const approveSettlement = async () => {
    if (!detail?.settlement?.id || !approvalChecked) return;
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/partner/settlements/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        settlement_id: detail.settlement.id,
        approval_statement: overview?.approval_text ?? detail.approval_text,
      }),
    });
    if (res.ok) {
      setDetail(parsePartnerSettlementDetail(await res.json()));
      setMessage(labels.approved);
      await load();
    } else {
      const err = await res.json().catch(() => ({}));
      setMessage(typeof err.error === "string" ? err.error : labels.actionFailed);
    }
    setBusy(false);
  };

  if (loading && !overview) {
    return (
      <div className="space-y-3">
        <AipifyLoader centered />
        <p className="text-center text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (denied) {
    return (
      <PlatformEmptyState
        title={labels.accessDenied}
        message={labels.subtitle}
        primaryAction={{ label: labels.viewCommissions, href: "/partner/commissions" }}
      />
    );
  }

  if (error) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  const agreementAccepted = overview?.self_billing_agreement.accepted ?? false;
  const awaitingApproval =
    detail?.settlement?.settlement_status === "awaiting_partner_approval" ||
    detail?.settlement?.settlement_status === "draft";
  const canApprove =
    agreementAccepted &&
    awaitingApproval &&
    (detail?.settlement?.total_payable ?? 0) > 0 &&
    approvalChecked;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="max-w-3xl text-sm text-slate-600">{labels.subtitle}</p>
        {overview?.positioning ? (
          <p className="max-w-3xl text-sm text-slate-500">{overview.positioning}</p>
        ) : null}
      </header>

      {message ? (
        <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {message}
        </p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard label={labels.currentPeriod} value={overview?.current_period ?? "—"} />
        <MetricCard
          label={labels.pendingTotal}
          value={formatMoney(overview?.pending_total ?? 0)}
        />
        <MetricCard
          label={labels.settlementPeriod}
          value={
            detail?.settlement?.settlement_period ??
            (overview?.has_payable_settlement ? overview.current_period : "—")
          }
        />
      </section>

      {!agreementAccepted ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-lg font-semibold text-slate-900">{labels.selfBillingTitle}</h2>
          <p className="mt-2 text-sm text-slate-700">{labels.selfBillingDescription}</p>
          <button
            type="button"
            disabled={busy}
            onClick={() => void acceptAgreement()}
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {labels.acceptAgreement}
          </button>
        </section>
      ) : null}

      {!overview?.has_payable_settlement && !overview?.current_settlement_id ? (
        <PlatformEmptyState
          title={labels.noPayableTitle}
          message={overview?.no_payable_message ?? labels.noPayableMessage}
          primaryAction={{ label: labels.viewCommissions, href: "/partner/commissions" }}
        />
      ) : null}

      {overview?.has_payable_settlement && !overview.current_settlement_id ? (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">{labels.settlementDetailTitle}</p>
          <button
            type="button"
            disabled={busy || !agreementAccepted}
            onClick={() => void prepareSettlement()}
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {labels.prepareSettlement}
          </button>
          {!agreementAccepted ? (
            <p className="mt-2 text-sm text-amber-700">{labels.agreementRequired}</p>
          ) : null}
        </section>
      ) : null}

      {detail?.settlement ? (
        <section className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">{labels.settlementDetailTitle}</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {settlementStatusLabel(labels, detail.settlement.settlement_status)}
            </span>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-xs text-slate-500">{labels.commissionTotal}</dt>
              <dd className="font-medium">{formatMoney(detail.settlement.commission_total)}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">{labels.vatAmount}</dt>
              <dd className="font-medium">
                {formatMoney(detail.settlement.vat_amount)} ({detail.settlement.vat_rate_pct}%)
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">{labels.totalPayable}</dt>
              <dd className="font-semibold text-slate-900">
                {formatMoney(detail.settlement.total_payable)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">{labels.dueDate}</dt>
              <dd className="font-medium">{detail.settlement.due_date || "—"}</dd>
            </div>
          </dl>

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{labels.sellerTitle}</h3>
              <dl className="mt-2 space-y-1 text-sm text-slate-700">
                <div>
                  <dt className="inline text-slate-500">{labels.companyName}: </dt>
                  <dd className="inline">{detail.seller?.company_name || "—"}</dd>
                </div>
                <div>
                  <dt className="inline text-slate-500">{labels.organizationNumber}: </dt>
                  <dd className="inline">{detail.seller?.organization_number || "—"}</dd>
                </div>
                <div>
                  <dt className="inline text-slate-500">{labels.vatNumber}: </dt>
                  <dd className="inline">{detail.seller?.vat_number || "—"}</dd>
                </div>
                <div>
                  <dt className="inline text-slate-500">{labels.businessAddress}: </dt>
                  <dd className="inline">{detail.seller?.business_address || "—"}</dd>
                </div>
                <div>
                  <dt className="inline text-slate-500">{labels.bankAccount}: </dt>
                  <dd className="inline">{detail.seller?.bank_account_number || "—"}</dd>
                </div>
                <div>
                  <dt className="inline text-slate-500">{labels.contactEmail}: </dt>
                  <dd className="inline">{detail.seller?.contact_email || "—"}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{labels.buyerTitle}</h3>
              <dl className="mt-2 space-y-1 text-sm text-slate-700">
                <div>
                  <dt className="inline text-slate-500">{labels.companyName}: </dt>
                  <dd className="inline">{detail.buyer?.company_name || "Aipify Group AS"}</dd>
                </div>
                <div>
                  <dt className="inline text-slate-500">{labels.country}: </dt>
                  <dd className="inline">
                    {[detail.buyer?.city, detail.buyer?.country].filter(Boolean).join(", ") ||
                      "Bergen, Norway"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {(detail.items?.length ?? 0) > 0 ? (
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{labels.lineItemsTitle}</h3>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-3 py-2">{labels.saleReference}</th>
                      <th className="px-3 py-2">{labels.customer}</th>
                      <th className="px-3 py-2">{labels.package}</th>
                      <th className="px-3 py-2">{labels.commissionRate}</th>
                      <th className="px-3 py-2">{labels.commissionAmount}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.items?.map((item) => (
                      <tr key={item.sale_reference} className="border-b border-slate-100">
                        <td className="px-3 py-2">{item.sale_reference}</td>
                        <td className="px-3 py-2">{item.customer_name}</td>
                        <td className="px-3 py-2">{item.package_label}</td>
                        <td className="px-3 py-2">{item.commission_rate_pct}%</td>
                        <td className="px-3 py-2">{formatMoney(item.commission_amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {detail.invoice ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-medium text-emerald-900">
                {labels.invoiceNumber}: {detail.invoice.invoice_number}
              </p>
              <p className="text-sm text-emerald-800">
                {labels.invoiceDate}: {detail.invoice.invoice_date} ·{" "}
                {settlementStatusLabel(labels, detail.invoice.invoice_status)}
              </p>
            </div>
          ) : null}

          {awaitingApproval && agreementAccepted ? (
            <div className="space-y-3 border-t border-slate-200 pt-4">
              <label className="flex items-start gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={approvalChecked}
                  onChange={(e) => setApprovalChecked(e.target.checked)}
                  className="mt-1"
                />
                <span>{detail.approval_text || overview?.approval_text}</span>
              </label>
              <button
                type="button"
                disabled={busy || !canApprove}
                onClick={() => void approveSettlement()}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {labels.approveSettlement}
              </button>
            </div>
          ) : null}
        </section>
      ) : null}

      {(history?.settlements.length ?? 0) > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{labels.historyTitle}</h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">{labels.settlementPeriod}</th>
                  <th className="px-4 py-3">{labels.totalPayable}</th>
                  <th className="px-4 py-3">{labels.invoiceNumber}</th>
                  <th className="px-4 py-3">{labels.description}</th>
                </tr>
              </thead>
              <tbody>
                {history?.settlements.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100">
                    <td className="px-4 py-3">{row.settlement_period}</td>
                    <td className="px-4 py-3">{formatMoney(row.total_payable)}</td>
                    <td className="px-4 py-3">{row.invoice_number || "—"}</td>
                    <td className="px-4 py-3">
                      {settlementStatusLabel(labels, row.settlement_status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <p className="text-sm text-slate-500">
        <Link href="/partner/commissions" className="text-slate-900 underline">
          {labels.viewCommissions}
        </Link>
      </p>
    </div>
  );
}
