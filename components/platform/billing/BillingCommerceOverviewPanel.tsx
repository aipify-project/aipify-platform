"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { BILLING_COMMERCE_NAV } from "@/lib/platform/billing-commerce-center/config";
import type { BillingCommerceCenterPayload } from "@/lib/platform/billing-commerce-center/types";

type BillingCommerceOverviewPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    principle: string;
    privacyNote: string;
    loading: string;
    empty: string;
    openModule: string;
    overview: string;
    modules: Record<string, string>;
    moduleDescriptions: Record<string, string>;
    relatedOperations: string;
    relatedLinks: Record<string, string>;
    overviewStats: Record<string, string>;
  };
};

function OverviewStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

export function BillingCommerceOverviewPanel({ labels }: BillingCommerceOverviewPanelProps) {
  const [center, setCenter] = useState<BillingCommerceCenterPayload | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/platform/billing/commerce-center?section=overview");
    if (res.ok) setCenter((await res.json()) as BillingCommerceCenterPayload);
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) {
    return <p className="text-sm text-red-600">{labels.empty}</p>;
  }

  const stats = center.stats ?? {};
  const moduleStats = new Map((center.modules ?? []).map((m) => [m.id, m.stat]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-gray-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-sm text-gray-800">
          {center.principle ?? labels.principle}
        </p>
      </div>

      <section>
        <h2 className="mb-4 font-semibold text-gray-900">{labels.overview}</h2>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OverviewStat label={labels.overviewStats.activeCustomers} value={Number(stats.active_customers ?? 0)} />
          <OverviewStat label={labels.overviewStats.overdueCustomers} value={Number(stats.overdue_customers ?? 0)} />
          <OverviewStat label={labels.overviewStats.openInvoices} value={Number(stats.open_invoices ?? 0)} />
          <OverviewStat label={labels.overviewStats.draftCheckouts} value={Number(stats.checkout_sessions ?? 0)} />
        </dl>
      </section>

      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BILLING_COMMERCE_NAV.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-sky-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-medium text-gray-900">{labels.modules[item.id]}</h3>
                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-800">
                  {moduleStats.get(item.section) ?? 0}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{labels.moduleDescriptions[item.id]}</p>
              <span className="mt-4 inline-block text-sm font-medium text-sky-700">
                {labels.openModule} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-semibold text-gray-900">{labels.relatedOperations}</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/platform/billing/payment-operations"
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
          >
            {labels.relatedLinks.paymentOperations}
          </Link>
          <Link
            href="/platform/billing/revenue-operations"
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
          >
            {labels.relatedLinks.revenueOperations}
          </Link>
          <Link
            href="/platform/billing/subscription-operations"
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
          >
            {labels.relatedLinks.subscriptionOperations}
          </Link>
        </div>
      </section>

      <p className="text-xs text-gray-500">{center.privacy_note ?? labels.privacyNote}</p>
    </div>
  );
}
