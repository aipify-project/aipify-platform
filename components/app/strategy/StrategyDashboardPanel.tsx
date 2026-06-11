"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseStrategicDashboard, type StrategicDashboard } from "@/lib/aipify/strategy";

type StrategyDashboardPanelProps = {
  labels: Record<string, string>;
};

function bandClass(band?: string) {
  switch (band) {
    case "highly_prepared":
      return "text-emerald-700";
    case "prepared":
      return "text-teal-700";
    case "improvement_recommended":
      return "text-amber-700";
    case "resilience_concerns":
      return "text-orange-700";
    case "critical_gap":
      return "text-red-700";
    default:
      return "text-gray-700";
  }
}

function confidenceClass(level?: string) {
  switch (level) {
    case "high":
      return "text-emerald-700";
    case "medium":
      return "text-amber-700";
    case "low":
      return "text-gray-600";
    default:
      return "text-gray-700";
  }
}

export function StrategyDashboardPanel({ labels }: StrategyDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<StrategicDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/strategy/dashboard");
    if (res.ok) setDashboard(parseStrategicDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/strategy/briefings/generate", { method: "POST" });
    await load();
  };

  const actOnRecommendation = async (id: string, action: "approve" | "dismiss") => {
    setActing(id);
    await fetch(`/api/aipify/strategy/recommendations/${id}/${action}`, { method: "POST" });
    setActing(null);
    await load();
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold text-violet-900">{labels.healthScore}</h2>
        <p className="mt-2 text-4xl font-bold text-gray-900">
          {dashboard.overall_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className={`mt-1 text-sm font-medium capitalize ${bandClass(dashboard.health_band)}`}>
          {dashboard.health_band?.replace(/_/g, " ")}
        </p>
        <p className="mt-3 text-xs text-violet-800">{labels.humanLeadership}</p>
        {dashboard.score_components ? (
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(dashboard.score_components).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-violet-100 bg-white px-3 py-2 text-xs">
                <span className="capitalize text-gray-500">{key.replace(/_/g, " ")}</span>
                <span className="ml-2 font-semibold text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section>
        <button
          type="button"
          onClick={() => void generateBriefing()}
          className="rounded-lg border border-violet-300 px-3 py-1.5 text-sm font-medium text-violet-900 hover:bg-violet-50"
        >
          {labels.generateBriefing}
        </button>
        {dashboard.briefings.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {dashboard.briefings.map((b) => (
              <li key={b.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
                {b.summary}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {dashboard.horizons && dashboard.horizons.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.horizonsSection}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {dashboard.horizons.map((h) => (
              <div key={h.horizon} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
                <p className="font-medium text-violet-900">{h.label}</p>
                <p className="mt-1 text-xs text-gray-600">{h.focus}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.opportunitiesSection}</h2>
        <ul className="mt-3 space-y-2">
          {dashboard.opportunities.map((opp) => (
            <li key={opp.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <Link href={`/app/strategy/opportunities/${opp.id}`} className="font-medium text-violet-900 hover:underline">
                {opp.title}
              </Link>
              <p className="mt-1 text-xs capitalize text-gray-500">
                {opp.category?.replace(/_/g, " ")} · {opp.horizon_label ?? opp.horizon}
              </p>
              <p className={`mt-1 text-xs font-medium capitalize ${confidenceClass(opp.confidence_level)}`}>
                {labels.confidence}: {opp.confidence_level}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.risksSection}</h2>
        <ul className="mt-3 space-y-2">
          {dashboard.risks.map((risk) => (
            <li key={risk.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <p className="font-medium">{risk.title}</p>
              <p className="mt-1 text-xs text-gray-600">{risk.description}</p>
              {risk.mitigation_suggestion ? (
                <p className="mt-2 text-xs text-violet-800">
                  {labels.mitigation}: {risk.mitigation_suggestion}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.recommendationsSection}</h2>
        <ul className="mt-3 space-y-2">
          {dashboard.recommendations.map((rec) => (
            <li key={rec.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <p className="font-medium">{rec.summary}</p>
              {rec.expected_benefits ? (
                <p className="mt-1 text-xs text-gray-600">
                  {labels.expectedBenefits}: {rec.expected_benefits}
                </p>
              ) : null}
              <p className={`mt-1 text-xs font-medium capitalize ${confidenceClass(rec.confidence_level)}`}>
                {labels.confidence}: {rec.confidence_level}
              </p>
              {rec.status === "pending" || rec.status === "reviewed" ? (
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    disabled={acting === rec.id}
                    onClick={() => void actOnRecommendation(rec.id, "approve")}
                    className="rounded border border-violet-400 px-2 py-0.5 text-xs font-medium text-violet-900 hover:bg-violet-50 disabled:opacity-50"
                  >
                    {labels.approve}
                  </button>
                  <button
                    type="button"
                    disabled={acting === rec.id}
                    onClick={() => void actOnRecommendation(rec.id, "dismiss")}
                    className="rounded border border-gray-300 px-2 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {labels.dismiss}
                  </button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-gray-500">{labels.safetyNote}</p>
    </div>
  );
}
