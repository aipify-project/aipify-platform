"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCommercialModelDashboard,
  type CommercialModelDashboard,
  type AddonModule,
} from "@/lib/aipify/billing-commercial";

type CommercialModelDashboardPanelProps = {
  labels: Record<string, string>;
};

function statusClass(status?: string) {
  switch (status) {
    case "active":
      return "bg-emerald-100 text-emerald-800";
    case "trial":
      return "bg-blue-100 text-blue-800";
    case "available":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-amber-100 text-amber-800";
  }
}

export function CommercialModelDashboardPanel({ labels }: CommercialModelDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<CommercialModelDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/billing-commercial/dashboard");
    if (res.ok) setDashboard(parseCommercialModelDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/billing-commercial/briefings/generate", { method: "POST" });
    await load();
  };

  const activateAddon = async (addonKey: string) => {
    setActing(addonKey);
    await fetch("/api/aipify/billing-commercial/addons/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addon_key: addonKey }),
    });
    setActing(null);
    await load();
  };

  const completeRenewal = async (eventId: string) => {
    setActing(eventId);
    await fetch(`/api/aipify/billing-commercial/renewals/${eventId}/complete`, { method: "POST" });
    setActing(null);
    await load();
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/settings/billing" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.billingSettings}</Link>
        <Link href="/app/settings/modules" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.moduleSettings}</Link>
        <Link href="/app/license" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.licenseCenter}</Link>
      </div>

      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold text-teal-900">{labels.commercialHealth}</h2>
        <p className="mt-2 text-4xl font-bold text-teal-800">
          {dashboard.health_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className="mt-1 text-sm font-medium text-teal-700">
          {dashboard.customer_tier_label} · {dashboard.currency} {dashboard.mrr ?? 0} {labels.mrrLabel}
        </p>
        <p className="mt-2 text-sm text-teal-800">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-teal-700">{dashboard.safety_note}</p>
        <button
          type="button"
          onClick={() => void generateBriefing()}
          className="mt-4 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          {labels.generateBriefing}
        </button>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: labels.mrr, value: `${dashboard.currency} ${dashboard.mrr ?? 0}` },
          { label: labels.arr, value: `${dashboard.currency} ${dashboard.arr ?? 0}` },
          { label: labels.renewalLikelihood, value: `${dashboard.renewal_likelihood ?? 0}%` },
          { label: labels.expansionOpportunity, value: `${dashboard.expansion_opportunity ?? 0}%` },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">{m.label}</p>
            <p className="text-lg font-semibold text-gray-900">{m.value}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.packagingStrategy}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {dashboard.business_packs.map((p) => (
            <article key={p.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className="text-xs capitalize text-gray-500">{p.pack_layer?.replace(/_/g, " ")}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusClass(p.status)}`}>{p.status}</span>
              </div>
              <p className="mt-2 font-medium text-gray-900">{p.title}</p>
              <p className="mt-1 text-xs text-gray-600">{p.description}</p>
              {p.monthly_price ? <p className="mt-2 text-sm text-teal-700">{dashboard.currency} {p.monthly_price}/{labels.perMonth}</p> : null}
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.addonModules}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {dashboard.addon_modules.map((a: AddonModule) => (
            <article key={a.id} className="rounded-lg border border-violet-100 bg-violet-50 p-4">
              <p className="font-medium text-violet-900">{a.title}</p>
              <p className="mt-1 text-xs text-violet-800">{a.description}</p>
              {a.monthly_price ? <p className="mt-2 text-sm text-violet-700">{dashboard.currency} {a.monthly_price}/{labels.perMonth}</p> : null}
              {a.status === "available" ? (
                <button
                  type="button"
                  disabled={acting === a.addon_key}
                  onClick={() => activateAddon(a.addon_key)}
                  className="mt-3 rounded-md border border-violet-300 px-3 py-1.5 text-xs font-medium text-violet-800 hover:bg-violet-100 disabled:opacity-50"
                >
                  {labels.activateAddon}
                </button>
              ) : (
                <span className={`mt-3 inline-block rounded-full px-2 py-0.5 text-xs capitalize ${statusClass(a.status)}`}>{a.status}</span>
              )}
            </article>
          ))}
        </div>
      </section>

      {dashboard.enterprise_services.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.enterpriseServices}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.enterprise_services.map((s) => (
              <li key={s.id} className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm text-indigo-900">
                <span className="font-medium">{s.title}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs capitalize ${statusClass(s.status)}`}>{s.status}</span>
                <p className="mt-1 text-xs text-indigo-800">{s.description}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.usage_metrics ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.usageTracking}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {Object.entries(dashboard.usage_metrics).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm">
                <p className="text-xs capitalize text-gray-500">{key.replace(/_/g, " ")}</p>
                <p className="font-semibold text-gray-900">{String(value ?? 0)}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.invoices.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.invoices}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.invoices.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium text-gray-900">{i.invoice_number}</span>
                <span>{i.currency} {i.amount}</span>
                <span className="capitalize text-gray-500">{i.status}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.renewal_events.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.renewalManagement}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.renewal_events.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm">
                <div>
                  <p className="font-medium text-amber-900">{r.title}</p>
                  <p className="text-xs text-amber-800">{r.description}</p>
                </div>
                <button
                  type="button"
                  disabled={acting === r.id}
                  onClick={() => completeRenewal(r.id)}
                  className="rounded-md border border-amber-300 px-2 py-1 text-xs font-medium text-amber-800 hover:bg-amber-100 disabled:opacity-50"
                >
                  {labels.completeRenewal}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.partner_commissions.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.partnerBilling}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.partner_commissions.map((c) => (
              <li key={c.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-700">
                {c.partner_name} · {c.commission_type} · {c.currency} {c.amount} · {c.status}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {dashboard.trial_framework && dashboard.trial_framework.length > 0 ? (
          <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h2 className="text-sm font-semibold text-gray-900">{labels.trialFramework}</h2>
            <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
              {dashboard.trial_framework.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </section>
        ) : null}
        {dashboard.pricing_governance && dashboard.pricing_governance.length > 0 ? (
          <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h2 className="text-sm font-semibold text-gray-900">{labels.pricingGovernance}</h2>
            <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
              {dashboard.pricing_governance.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  );
}
