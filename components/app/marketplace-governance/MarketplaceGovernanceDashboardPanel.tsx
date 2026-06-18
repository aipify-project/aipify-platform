"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { useCallback, useEffect, useState } from "react";
import {
  parseMarketplaceGovernanceDashboard,
  type MarketplaceGovernanceDashboard,
  type QualityIncident,
  type FraudAlert,
} from "@/lib/aipify/marketplace-governance";

type MarketplaceGovernanceDashboardPanelProps = {
  labels: Record<string, string>;
};

function severityClass(severity?: string) {
  switch (severity) {
    case "low":
      return "bg-blue-100 text-blue-800";
    case "medium":
      return "bg-amber-100 text-amber-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "critical":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function bandClass(band?: string) {
  switch (band) {
    case "trusted":
      return "text-emerald-700";
    case "healthy":
      return "text-teal-700";
    case "monitor":
      return "text-amber-700";
    case "concerns":
      return "text-orange-700";
    case "critical":
      return "text-red-700";
    default:
      return "text-gray-700";
  }
}

export function MarketplaceGovernanceDashboardPanel({ labels }: MarketplaceGovernanceDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<MarketplaceGovernanceDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/marketplace-governance/dashboard");
    if (res.ok) setDashboard(parseMarketplaceGovernanceDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/marketplace-governance/briefings/generate", { method: "POST" });
    await load();
  };

  const resolveIncident = async (id: string) => {
    setActing(id);
    await fetch(`/api/aipify/marketplace-governance/incidents/${id}/resolve`, { method: "POST" });
    setActing(null);
    await load();
  };

  const acknowledgeAlert = async (id: string) => {
    setActing(id);
    await fetch(`/api/aipify/marketplace-governance/fraud-alerts/${id}/acknowledge`, { method: "POST" });
    setActing(null);
    await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
        <h2 className="text-sm font-semibold text-emerald-900">{labels.governanceScore}</h2>
        <p className={`mt-2 text-4xl font-bold ${bandClass(dashboard.governance_band)}`}>
          {dashboard.governance_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className={`mt-1 text-sm font-medium ${bandClass(dashboard.governance_band)}`}>
          {dashboard.governance_band_label}
        </p>
        <p className="mt-2 text-sm text-emerald-800">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-emerald-700">{dashboard.safety_note}</p>
        {dashboard.automated_actions_enabled ? (
          <p className="mt-2 text-xs text-amber-800">{labels.automatedActionsEnabled}</p>
        ) : (
          <p className="mt-2 text-xs text-emerald-700">{labels.automatedActionsDisabled}</p>
        )}
        <button
          type="button"
          onClick={() => void generateBriefing()}
          className="mt-4 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          {labels.generateBriefing}
        </button>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: labels.refundRate, value: `${dashboard.refund_rate_pct ?? 0}%` },
          { label: labels.customerSatisfaction, value: dashboard.customer_satisfaction ?? 0 },
          { label: labels.incidentFrequency, value: dashboard.incident_frequency ?? 0 },
          { label: labels.fraudRisk, value: dashboard.fraud_risk_score ?? 0 },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">{m.label}</p>
            <p className="text-lg font-semibold text-gray-900">{m.value}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.governanceScores}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {dashboard.governance_scores.map((g) => (
            <article key={g.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className="text-xs capitalize text-gray-500">{g.entity_type}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${severityClass(g.risk_level)}`}>
                  {g.risk_level}
                </span>
              </div>
              <p className="mt-1 font-medium text-gray-900">{g.entity_name}</p>
              <p className={`mt-1 text-2xl font-bold ${bandClass(g.trust_band)}`}>{g.governance_score}/100</p>
              {g.recommendation ? <p className="mt-2 text-xs text-gray-600">{g.recommendation}</p> : null}
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.qualityIncidents}</h2>
        {dashboard.quality_incidents.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noIncidents}</p>
        ) : (
          <div className="mt-3 space-y-3">
            {dashboard.quality_incidents.map((i: QualityIncident) => (
              <article key={i.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${severityClass(i.severity)}`}>
                    {i.severity}
                  </span>
                  <span className="text-xs capitalize text-gray-500">{i.incident_type?.replace(/_/g, " ")}</span>
                </div>
                <p className="mt-2 font-medium text-gray-900">{i.title}</p>
                <p className="mt-1 text-sm text-gray-600">{i.description}</p>
                <button
                  type="button"
                  disabled={acting === i.id}
                  onClick={() => resolveIncident(i.id)}
                  className="mt-3 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  {labels.resolveIncident}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.fraudAlerts}</h2>
        {dashboard.fraud_alerts.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noAlerts}</p>
        ) : (
          <div className="mt-3 space-y-3">
            {dashboard.fraud_alerts.map((a: FraudAlert) => (
              <article key={a.id} className="rounded-lg border border-red-100 bg-red-50 p-4">
                <p className="font-medium text-red-900">{a.title}</p>
                <p className="mt-1 text-sm text-red-800">{a.description}</p>
                {a.status === "open" ? (
                  <button
                    type="button"
                    disabled={acting === a.id}
                    onClick={() => acknowledgeAlert(a.id)}
                    className="mt-3 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {labels.acknowledgeAlert}
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>

      {dashboard.supplier_scores.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.supplierIntelligence}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.supplier_scores.map((s, idx) => (
              <li key={idx} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <span className="font-medium text-gray-900">{s.supplier_name}</span>
                <span className="ml-2 text-xs capitalize text-gray-500">{s.supplier_type} · {s.status}</span>
                <span className="ml-2 text-xs text-emerald-700">{s.overall_score ?? 0}/100</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.recommendations.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recommendations}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.recommendations.map((r) => (
              <li key={r.id} className="rounded-lg border border-violet-100 bg-violet-50 px-3 py-2 text-sm">
                <p className="font-medium text-violet-900">{r.title}</p>
                <p className="mt-1 text-xs text-violet-800">{r.description}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.root_cause_reports.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.rootCauseAnalysis}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.root_cause_reports.map((r) => (
              <li key={r.id} className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm text-indigo-900">
                <p className="font-medium">{r.summary}</p>
                <p className="mt-1 text-xs text-indigo-800">{r.potential_cause}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.policy_rules.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.policyEngine}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.policy_rules.map((p) => (
              <li key={p.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-700">
                <span className="font-medium">{p.title}</span>
                <p className="mt-1 text-xs text-gray-500">{p.description}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {dashboard.pre_publish_controls && dashboard.pre_publish_controls.length > 0 ? (
          <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h2 className="text-sm font-semibold text-gray-900">{labels.prePublishControls}</h2>
            <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
              {dashboard.pre_publish_controls.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>
        ) : null}
        {dashboard.post_publish_monitoring && dashboard.post_publish_monitoring.length > 0 ? (
          <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h2 className="text-sm font-semibold text-gray-900">{labels.postPublishMonitoring}</h2>
            <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
              {dashboard.post_publish_monitoring.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  );
}
