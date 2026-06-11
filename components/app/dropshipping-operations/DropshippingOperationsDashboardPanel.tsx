"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseDropshippingOperationsDashboard,
  type DropshippingOperationsDashboard,
} from "@/lib/aipify/dropshipping-operations";

type DropshippingOperationsDashboardPanelProps = {
  labels: Record<string, string>;
};

function badgeClass(value?: string) {
  switch (value) {
    case "excellent":
    case "trusted":
    case "improving":
    case "informational":
      return "bg-emerald-100 text-emerald-800";
    case "stable":
    case "moderate":
      return "bg-amber-100 text-amber-800";
    case "needs_attention":
    case "monitor_closely":
    case "important":
      return "bg-orange-100 text-orange-800";
    case "high_risk":
    case "escalation_recommended":
    case "worsening":
    case "critical":
    case "immediate_review":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function DropshippingOperationsDashboardPanel({ labels }: DropshippingOperationsDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<DropshippingOperationsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/dropshipping-operations/dashboard");
    if (res.ok) setDashboard(parseDropshippingOperationsDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/dropshipping-operations/briefings/generate", { method: "POST" });
    await load();
  };

  const escalateSupplier = async (supplierId: string, supplierName: string) => {
    setActing(`esc-${supplierId}`);
    await fetch("/api/dropshipping/escalations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        supplier_id: supplierId,
        issue_summary: `Escalation review requested for ${supplierName}`,
        alternative_supplier: "Evaluate Premium Active Goods as alternative",
      }),
    });
    setActing(null);
    await load();
  };

  const addWatchlist = async (productKey: string, productName: string) => {
    setActing(`watch-${productKey}`);
    await fetch("/api/dropshipping/watchlists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_key: productKey, product_name: productName }),
    });
    setActing(null);
    await load();
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/commerce-intelligence" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.commerceIntelligence}
        </Link>
        <Link href="/app/platform-install" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.platformInstall}
        </Link>
        <Link href="/app/knowledge-center" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.knowledgeCenter}
        </Link>
      </div>

      <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
        <h2 className="text-sm font-semibold text-slate-900">{labels.operationalHealth}</h2>
        <p className="mt-2 text-4xl font-bold text-slate-800">
          {dashboard.operational_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className="mt-1 text-sm font-medium capitalize text-slate-700">
          {dashboard.health_classification?.replace(/_/g, " ")} · {dashboard.active_products ?? 0}{" "}
          {labels.activeProducts} · {dashboard.delivery_risks ?? 0} {labels.deliveryRisks}
        </p>
        <p className="mt-2 text-sm text-slate-800">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-slate-700">{dashboard.safety_note}</p>
        <button
          type="button"
          onClick={() => void generateBriefing()}
          className="mt-4 rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          {labels.generateBriefing}
        </button>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: labels.suppliersMonitored, value: dashboard.suppliers_monitored ?? 0 },
          { label: labels.openAlerts, value: dashboard.open_alerts ?? 0 },
          { label: labels.deliveryRisks, value: dashboard.delivery_risks ?? 0 },
          { label: labels.openEscalations, value: dashboard.open_escalations ?? 0 },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">{m.label}</p>
            <p className="text-lg font-semibold text-gray-900">{m.value}</p>
          </div>
        ))}
      </section>

      {dashboard.risk_notifications.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.riskNotifications}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.risk_notifications.map((n) => (
              <li key={n.id} className="rounded-lg border border-rose-200 bg-rose-50/40 px-3 py-2 text-sm">
                <span className="font-medium text-rose-900">{n.title}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(n.priority)}`}>{n.priority}</span>
                <p className="mt-1 text-xs text-rose-800">{n.message}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.supplier_insights.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.supplierInsights}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.supplier_insights.map((s) => (
              <article key={s.id} className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-indigo-900">{s.supplier_name}</p>
                  <span className="text-sm font-bold text-indigo-700">{s.health_score}/100</span>
                </div>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(s.status_level)}`}>
                  {s.status_level?.replace(/_/g, " ")}
                </span>
                <p className="mt-2 text-xs text-indigo-800">{s.recommendation}</p>
                {s.status_level === "escalation_recommended" || s.status_level === "high_risk" ? (
                  <button
                    type="button"
                    disabled={acting === `esc-${s.supplier_id}`}
                    onClick={() => void escalateSupplier(s.supplier_id, s.supplier_name)}
                    className="mt-3 text-xs text-rose-700 underline hover:text-rose-900 disabled:opacity-50"
                  >
                    {labels.escalateSupplier}
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.delivery_risk_indicators.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.deliveryRiskIndicators}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.delivery_risk_indicators.map((r) => (
              <li key={r.id} className="rounded-lg border border-orange-100 bg-orange-50/40 px-3 py-2 text-sm">
                <span className="font-medium text-orange-900">{r.title}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(r.severity)}`}>{r.severity}</span>
                <p className="mt-1 text-xs text-orange-800">{r.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.opportunity_alerts.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.opportunityAlerts}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.opportunity_alerts.map((a) => (
              <li key={a.id} className="rounded-lg border border-emerald-100 bg-emerald-50/40 px-3 py-2 text-sm">
                <span className="font-medium text-emerald-900">{a.title}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(a.priority)}`}>{a.priority}</span>
                <p className="mt-1 text-xs text-emerald-800">{a.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.product_watchlists.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.productWatchlists}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.product_watchlists.map((w) => (
              <article key={w.id} className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="font-medium text-gray-900">{w.product_name}</p>
                <p className="mt-1 text-xs capitalize text-gray-500">{w.category}</p>
                <p className="mt-2 text-xs text-gray-600">{w.watch_reason}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.order_health_insights.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.orderHealthInsights}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.order_health_insights.map((o) => (
              <li key={o.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <div>
                  <span className="font-medium">{o.title}</span>
                  <p className="text-xs text-gray-600">{o.summary}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(o.trend_direction)}`}>{o.trend_direction}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.operations_recommendations.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recommendationsCenter}</h2>
          <div className="mt-3 space-y-2">
            {dashboard.operations_recommendations.map((r) => (
              <article key={r.id} className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-slate-900">{r.title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(r.priority)}`}>{r.priority}</span>
                </div>
                <p className="mt-1 text-xs text-slate-700">{r.summary}</p>
                <p className="mt-2 text-xs italic text-slate-600">{r.rationale}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.escalation_activity.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.escalationActivity}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.escalation_activity.map((e) => (
              <li key={e.id} className="rounded-lg border border-rose-100 bg-rose-50/30 px-3 py-2 text-sm">
                <span className="font-medium capitalize text-rose-900">{e.escalation_status?.replace(/_/g, " ")}</span>
                <p className="mt-1 text-xs text-rose-800">{e.issue_summary}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.briefings.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentBriefings}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.briefings.map((b) => (
              <li key={b.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">{b.summary}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
