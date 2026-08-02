"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseBillingCenter, type BillingCenter } from "@/lib/commercial-packages";

type BillingAdminPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    viewLicense: string;
    viewModules: string;
    viewCommercial: string;
    viewPackages: string;
        viewPaymentProviders: string;
        viewInvoiceDetails: string;
    empty: string;
    emptyHistory?: string;
    modulesCount: string;
    statusLabels?: Record<string, string>;
    sections: {
      package: string;
      modules: string;
      usage: string;
      limits: string;
      upgrades: string;
      addons: string;
      recommendations: string;
      history: string;
      suites: string;
      pricingPhilosophy: string;
    };
    usage: Record<string, string>;
    pricingPhilosophy: {
      principle: string;
      priceOn: string;
      avoid: string;
      planGuidance: string;
      positioning: string;
      abosPrinciple: string;
      guidanceNote: string;
      usdRange: string;
    };
  };
};

export function BillingAdminPanel({ labels }: BillingAdminPanelProps) {
  const [center, setCenter] = useState<BillingCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const res = await fetch("/api/commercial-packages/billing");
    if (res.ok) {
      setCenter(parseBillingCenter(await res.json()));
    } else {
      const payload = (await res.json()) as { error?: string };
      setLoadError(typeof payload.error === "string" ? payload.error : "Failed to load billing");
      setCenter(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  if (loadError) {
    return (
      <div className="mx-auto w-full max-w-[1560px] space-y-4">
        <Link href="/app/settings" className="text-sm text-indigo-600 hover:underline">
          ← {labels.back}
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{loadError}</p>
        <button
          type="button"
          onClick={() => void refresh()}
          className="rounded-lg bg-[#7C3AED] px-4 py-2 text-sm font-medium text-white hover:bg-[#6D28D9]"
        >
          Retry
        </button>
      </div>
    );
  }

  const usage = center?.usage ?? {};
  const limits = center?.tenant_limits ?? {};

  return (
    <div className="mx-auto w-full max-w-[1560px] space-y-6" data-kompis-layout-hint="overlay">
      <div>
        <Link href="/app/settings" className="text-sm text-indigo-600 hover:underline">
          ← {labels.back}
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center?.positioning && (
          <p className="mt-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-800">
            {center.positioning}
          </p>
        )}
        {center?.privacy_note && (
          <p className="mt-2 text-sm text-gray-500">{center.privacy_note}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <Link href="/app/license" className="text-indigo-600 hover:underline">
            {labels.viewLicense}
          </Link>
          <Link href="/app/settings/modules" className="text-indigo-600 hover:underline">
            {labels.viewModules}
          </Link>
          <Link href="/app/settings/billing/packages" className="text-indigo-600 hover:underline">
            {labels.viewPackages}
          </Link>
          <Link href="/app/settings/billing/payment-providers" className="text-indigo-600 hover:underline">
            {labels.viewPaymentProviders}
          </Link>
          <Link href="/app/settings/billing/invoice-details" className="text-indigo-600 hover:underline">
            {labels.viewInvoiceDetails}
          </Link>
          <Link href="/app/commercial" className="text-indigo-600 hover:underline">
            {labels.viewCommercial}
          </Link>
        </div>
      </div>

      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
        <h2 className="font-semibold text-indigo-900">{labels.sections.package}</h2>
        {center?.current_package ? (
          <div className="mt-3">
            <p className="text-xl font-bold">{center.current_package.package_name}</p>
            <p className="mt-1 text-sm text-gray-600">{center.current_package.description}</p>
            <ul className="mt-3 space-y-1 text-sm">
              {center.current_package.features.map((f) => (
                <li key={f}>· {f}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-2 text-sm text-gray-500">{labels.empty}</p>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.usage}</h2>
        <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          {Object.entries(labels.usage).map(([key, label]) => (
            <li key={key} className="rounded-lg bg-gray-50 px-3 py-2">
              {label}: {String(usage[key] ?? 0)}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
        <h2 className="font-semibold text-emerald-900">{labels.sections.limits}</h2>
        <ul className="mt-2 space-y-1 text-sm">
          <li>
            Users: {String(limits.used_users ?? 0)} / {String(limits.max_users ?? "∞")}
          </li>
          <li>
            Installations: {String(limits.used_installations ?? 0)} /{" "}
            {String(limits.max_installations ?? "∞")}
          </li>
          <li>
            Domains: {String(limits.used_domains ?? 0)} / {String(limits.max_domains ?? "∞")}
          </li>
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.modules}</h2>
        <p className="mt-1 text-sm text-gray-500">
          {labels.modulesCount.replace(
            "{count}",
            String(center?.enabled_modules?.length ?? 0),
          )}
        </p>
      </section>

      {/* Upgrade/addon marketplace recommendations stay available under packages — not as contract history. */}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.history}</h2>
        <ul className="mt-2 space-y-1 text-sm text-gray-600">
          {center?.billing_history?.length ? (
            center.billing_history.map((h, i) => (
              <li key={i}>
                {String(h.plan_name)} —{" "}
                {labels.statusLabels?.[String(h.status).toLowerCase()] ?? String(h.status)}
              </li>
            ))
          ) : (
            <li>{labels.emptyHistory ?? labels.empty}</li>
          )}
        </ul>
      </section>
    </div>
  );
}
