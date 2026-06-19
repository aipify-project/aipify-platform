"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseServicePaymentsCenter,
  servicePaymentsSectionToRpc,
  type ServicePaymentsCenter,
  type ServicePaymentsSection,
} from "@/lib/service-payments-engine";
import type { ServicePaymentsLabels } from "@/lib/service-payments-engine/labels";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function ItemCard({
  title,
  summary,
  statusLabel,
  meta,
}: {
  title: string;
  summary?: string;
  statusLabel?: string;
  meta?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="font-semibold text-zinc-900">{title}</p>
      {statusLabel ? <p className="mt-1 text-xs text-zinc-600">{statusLabel}</p> : null}
      {meta ? <p className="mt-1 text-xs text-zinc-500">{meta}</p> : null}
      {summary ? <p className="mt-2 text-sm text-zinc-600">{summary}</p> : null}
    </div>
  );
}

function rowTitle(item: Record<string, unknown>) {
  return String(item.record_title ?? item.customer_label ?? item.booking_key ?? "Record");
}

function rowMeta(item: Record<string, unknown>) {
  const parts: string[] = [];
  if (item.location_label) parts.push(String(item.location_label));
  if (item.provider_label) parts.push(String(item.provider_label));
  if (item.amount != null) parts.push(String(item.amount));
  return parts.join(" · ");
}

function pickRows(center: ServicePaymentsCenter, section: ServicePaymentsSection) {
  if (section === "overview") return [...(center.payments ?? []), ...(center.deposits ?? [])];
  if (center.records?.length) return center.records;
  if (section === "payments") return center.payments ?? [];
  if (section === "deposits") return center.deposits ?? [];
  return center.records ?? [];
}

export function ServicePaymentsPanel({
  labels,
  activeSection,
}: {
  labels: ServicePaymentsLabels;
  activeSection: ServicePaymentsSection;
}) {
  const [center, setCenter] = useState<ServicePaymentsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const rpcSection = servicePaymentsSectionToRpc(activeSection);
    const params = new URLSearchParams({ section: rpcSection });
    const res = await fetch(`/api/services/payments?${params.toString()}`);
    if (res.ok) setCenter(parseServicePaymentsCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, [activeSection]);

  useEffect(() => {
    void load();
  }, [load]);

  const rows = useMemo(() => {
    const base = pickRows(center ?? { found: false }, activeSection);
    if (!search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter((item) => rowTitle(item).toLowerCase().includes(q));
  }, [center, activeSection, search]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.empty}</p>
        {center?.error ? <p className="mt-2 text-sm">{center.error}</p> : null}
      </div>
    );
  }

  const stats = center.stats ?? {};
  const sectionTitle = labels.sections[activeSection] ?? labels.title;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{sectionTitle}</h2>
          {center.privacy_note ? (
            <p className="mt-1 text-xs text-zinc-500">{center.privacy_note}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          {labels.refresh}
        </button>
      </div>

      {center.principle ? (
        <p className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-indigo-950">
          {center.principle}
        </p>
      ) : null}

      {activeSection === "overview" ? (
        <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label={labels.stats.paymentsToday} value={stats.payments_today ?? 0} />
            <StatCard label={labels.stats.depositsReceived} value={stats.deposits_received ?? 0} />
            <StatCard label={labels.stats.outstandingBalances} value={stats.outstanding_balances ?? 0} />
            <StatCard label={labels.stats.failedPayments} value={stats.failed_payments ?? 0} />
            <StatCard label={labels.stats.refundsPending} value={stats.refunds_pending ?? 0} />
            <StatCard label={labels.stats.noShowsPending} value={stats.no_shows_pending ?? 0} />
            <StatCard label={labels.stats.reconciliationIssues} value={stats.reconciliation_issues ?? 0} />
          </div>
        </section>
      ) : null}

      {activeSection !== "overview" ? (
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={labels.noRecords}
          className="w-full max-w-md rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      ) : null}

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center">
          <p className="font-medium text-zinc-800">{labels.noRecords}</p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {rows.map((item) => {
            const key = String(item.record_key ?? rowTitle(item));
            return (
              <ItemCard
                key={key}
                title={rowTitle(item)}
                summary={typeof item.summary === "string" ? item.summary : undefined}
                statusLabel={
                  typeof item.status_label === "string"
                    ? item.status_label
                    : typeof item.payment_status === "string"
                      ? item.payment_status
                      : undefined
                }
                meta={rowMeta(item)}
              />
            );
          })}
        </div>
      )}

      <p className="text-xs text-zinc-500">{labels.checkout.verificationRequired}</p>
    </div>
  );
}
