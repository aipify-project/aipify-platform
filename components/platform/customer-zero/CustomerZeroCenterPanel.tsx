"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { useCallback, useEffect, useState } from "react";
import {
  CUSTOMER_ZERO_CORE_PRINCIPLE,
  CUSTOMER_ZERO_PRINCIPLE,
  PILOT_LEVEL_NAMES,
  parseCustomerZeroCenter,
  type CustomerZeroCenter,
} from "@/lib/customer-zero";

type CustomerZeroCenterPanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  customerZeroPrinciple: string;
  readinessTitle: string;
  sourcesTitle: string;
  discoverSources: string;
  discovering: string;
  pilotLevelTitle: string;
  recommendationsTitle: string;
  noRecommendations: string;
  approve: string;
  reject: string;
  valueTitle: string;
  expansionTitle: string;
  auditTitle: string;
  noAudit: string;
  gateStatus: string;
  pilotLevels: Record<string, string>;
  readinessStates: Record<string, string>;
  privacyNote: string;
};

type CustomerZeroCenterPanelProps = {
  labels: CustomerZeroCenterPanelLabels;
};

export function CustomerZeroCenterPanel({ labels }: CustomerZeroCenterPanelProps) {
  const [center, setCenter] = useState<CustomerZeroCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [discovering, setDiscovering] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/platform/customer-zero/center");
    if (res.ok) setCenter(parseCustomerZeroCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function discoverSources() {
    setDiscovering(true);
    await fetch("/api/platform/customer-zero/discover", { method: "POST" });
    setDiscovering(false);
    await load();
  }

  async function setPilotLevel(level: number) {
    await fetch("/api/platform/customer-zero/pilot-level", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level }),
    });
    await load();
  }

  async function decideRecommendation(
    recommendationId: string,
    decision: "approved" | "rejected" | "corrected"
  ) {
    await fetch("/api/platform/customer-zero/recommendation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recommendation_id: recommendationId, decision }),
    });
    await load();
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-900">
          {labels.corePrinciple}: {CUSTOMER_ZERO_CORE_PRINCIPLE}
        </p>
        <p className="mt-2 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
          {labels.customerZeroPrinciple}: {CUSTOMER_ZERO_PRINCIPLE}
        </p>
        {center?.privacy_note && (
          <p className="mt-2 text-sm text-gray-500">{labels.privacyNote}</p>
        )}
      </div>

      {center?.readiness_message && (
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 text-sm text-emerald-950 whitespace-pre-line">
          {center.readiness_message}
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-900">{labels.pilotLevelTitle}</h2>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800">
            Level {center?.pilot_level} —{" "}
            {labels.pilotLevels[String(center?.pilot_level)] ??
              PILOT_LEVEL_NAMES[center?.pilot_level ?? 1]}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => void setPilotLevel(level)}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                center?.pilot_level === level
                  ? "bg-indigo-600 text-white"
                  : "border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              L{level} {labels.pilotLevels[String(level)] ?? PILOT_LEVEL_NAMES[level as 1 | 2 | 3 | 4]}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-gray-600">
          {labels.readinessStates[center?.readiness_state ?? "learning"] ?? center?.readiness_state}
        </p>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-900">{labels.sourcesTitle}</h2>
          <button
            type="button"
            onClick={() => void discoverSources()}
            disabled={discovering}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {discovering ? labels.discovering : labels.discoverSources}
          </button>
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {center?.learning_sources.map((source) => (
            <li key={source.source_key} className="rounded-xl border border-gray-100 p-4 text-sm">
              <div className="font-medium text-gray-900">{source.source_label}</div>
              <p className="mt-1 text-gray-600">
                {source.item_count} items · {source.indexed_count} indexed · {source.status}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.readinessTitle}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {center?.readiness.map((item) => (
            <div key={item.dimension_key} className="rounded-xl border border-gray-100 p-4">
              <p className="text-sm font-medium text-gray-900">{item.dimension_key.replace(/_/g, " ")}</p>
              <p className="mt-2 text-2xl font-semibold">{item.score}%</p>
              <p className="mt-1 text-xs text-gray-500">
                {labels.readinessStates[item.state] ?? item.state}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.recommendationsTitle}</h2>
        {center?.pending_recommendations.length ? (
          <ul className="mt-4 space-y-3">
            {center.pending_recommendations.map((rec) => (
              <li key={rec.id} className="rounded-xl border border-gray-100 p-4 text-sm">
                <div className="font-medium text-gray-900">{rec.title}</div>
                <p className="mt-1 text-gray-600">{rec.summary}</p>
                <p className="mt-1 text-xs text-gray-500">
                  Level {rec.pilot_level} · {rec.confidence} confidence
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => void decideRecommendation(rec.id, "approved")}
                    className="rounded-lg bg-emerald-600 px-3 py-1 text-xs text-white hover:bg-emerald-700"
                  >
                    {labels.approve}
                  </button>
                  <button
                    type="button"
                    onClick={() => void decideRecommendation(rec.id, "rejected")}
                    className="rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    {labels.reject}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-gray-500">{labels.noRecommendations}</p>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.valueTitle}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {center?.value_metrics.map((metric) => (
            <div key={metric.metric_key} className="rounded-xl border border-gray-100 p-4">
              <p className="text-xs text-gray-500">{metric.metric_key.replace(/_/g, " ")}</p>
              <p className="mt-2 text-xl font-semibold">{metric.metric_value}</p>
            </div>
          ))}
        </div>
      </section>

      {center?.expansion_gate && (
        <section className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5">
          <h2 className="text-base font-semibold text-amber-900">{labels.expansionTitle}</h2>
          <p className="mt-2 text-sm text-amber-950">
            {labels.gateStatus}: {center.expansion_gate.gate_status}
          </p>
          <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            {(
              [
                ["pilot_kpis_achieved", center.expansion_gate.pilot_kpis_achieved],
                ["stable_governance", center.expansion_gate.stable_governance],
                ["positive_admin_feedback", center.expansion_gate.positive_admin_feedback],
                ["demonstrated_time_savings", center.expansion_gate.demonstrated_time_savings],
                ["proven_operational_value", center.expansion_gate.proven_operational_value],
                ["acceptable_error_rates", center.expansion_gate.acceptable_error_rates],
              ] as const
            ).map(([key, met]) => (
              <li key={key} className="flex items-center gap-2">
                <span className={met ? "text-emerald-700" : "text-gray-500"}>
                  {met ? "✓" : "○"} {key.replace(/_/g, " ")}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.auditTitle}</h2>
        {center?.recent_audit.length ? (
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            {center.recent_audit.map((entry) => (
              <li key={entry.id} className="rounded-lg bg-gray-50 px-3 py-2">
                <span className="font-medium text-gray-800">{entry.event_type}</span>
                {entry.summary ? ` — ${entry.summary}` : ""}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-gray-500">{labels.noAudit}</p>
        )}
      </section>
    </div>
  );
}
