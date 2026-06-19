"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { parseUnifiedBillingCenter, type UnifiedBillingCenter } from "@/lib/unified-billing-engine";

type Props = {
  labels: {
    title: string;
    subtitle: string;
    principle: string;
    privacyNote: string;
    loading: string;
    empty: string;
    manageProfile: string;
    viewCheckout: string;
    viewUpgrade: string;
    sections: Record<string, string>;
    stats: Record<string, string>;
  };
  backHref?: string;
};

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

export function UnifiedBillingCenterPanel({ labels, backHref = "/app" }: Props) {
  const [center, setCenter] = useState<UnifiedBillingCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/unified-billing/center");
    if (res.ok) setCenter(parseUnifiedBillingCenter(await res.json()));
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
    return <p className="p-6 text-sm text-red-600">{center?.error ?? labels.empty}</p>;
  }

  const stats = center.stats ?? {};

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6">
      <div>
        {backHref ? (
          <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            ←
          </Link>
        ) : null}
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-gray-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-sm text-gray-800">
          {center.principle ?? labels.principle}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {center.can_manage_profiles ? (
            <Link
              href="/app/billing/profile"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              {labels.manageProfile}
            </Link>
          ) : null}
          <Link
            href="/app/checkout"
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
          >
            {labels.viewCheckout}
          </Link>
          <Link
            href="/app/billing/upgrade"
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
          >
            {labels.viewUpgrade}
          </Link>
        </div>
      </div>

      <section>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label={labels.stats.profiles} value={stats.profile_count ?? 0} />
          <StatCard label={labels.stats.activeSubscriptions} value={stats.active_subscriptions ?? 0} />
          <StatCard label={labels.stats.overdueInvoices} value={stats.overdue_invoices ?? 0} />
          <StatCard label={labels.stats.userCapacity} value={stats.available_user_capacity ?? 0} />
        </dl>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.sections.profiles}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {(center.profiles ?? []).map((p) => (
              <li key={p.profile_key} className="rounded-lg bg-gray-50 px-3 py-2">
                <span className="font-medium">{p.profile_label}</span>
                <span className="ml-2 text-gray-500">{p.customer_type}</span>
                {p.is_primary ? (
                  <span className="ml-2 rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">Primary</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.sections.subscriptions}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {(center.subscriptions ?? []).slice(0, 5).map((s, i) => (
              <li key={i} className="rounded-lg bg-gray-50 px-3 py-2">
                {String(s.plan_key ?? "—")} · {String(s.subscription_status ?? "—")}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.checkoutFlow}</h2>
        <ol className="mt-3 flex flex-wrap gap-2">
          {(center.checkout_flow ?? []).map((step) => (
            <li key={step} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800">
              {step.replace(/_/g, " ")}
            </li>
          ))}
        </ol>
      </section>

      <p className="text-xs text-gray-500">{center.privacy_note ?? labels.privacyNote}</p>
    </div>
  );
}
