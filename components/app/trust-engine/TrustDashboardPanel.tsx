"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseTrustDashboard, type TrustDashboard } from "@/lib/aipify/trust-engine";

type TrustDashboardPanelProps = {
  labels: Record<string, string>;
};

function confidenceClass(level: string) {
  switch (level) {
    case "high":
      return "bg-emerald-100 text-emerald-800";
    case "low":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-violet-100 text-violet-800";
  }
}

export function TrustDashboardPanel({ labels }: TrustDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<TrustDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/trust/dashboard");
    if (res.ok) setDashboard(parseTrustDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold text-violet-900">{labels.trustScore}</h2>
        <p className="mt-2 text-4xl font-bold text-gray-900">
          {dashboard.trust_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <p className="text-sm text-gray-700">{labels.coverage}: {dashboard.coverage ?? 0}%</p>
          <p className="text-sm text-gray-700">{labels.viewRate}: {dashboard.view_rate ?? 0}%</p>
          <p className="text-sm text-gray-700">{labels.overrideRate}: {dashboard.override_rate ?? 0}%</p>
          <p className="text-sm text-gray-700">{labels.escalations}: {dashboard.escalations ?? 0}</p>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.recentExplanations}</h2>
        <ul className="mt-3 space-y-2">
          {dashboard.explanations.map((exp) => (
            <li key={exp.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <Link href={`/app/trust/explanations/${exp.id}`} className="font-medium text-violet-800 hover:underline">
                    {exp.summary}
                  </Link>
                  <p className="mt-1 text-xs capitalize text-gray-500">
                    {exp.decision_type.replace(/_/g, " ")} · {exp.source_module}
                  </p>
                </div>
                <span className={`rounded px-2 py-0.5 text-xs capitalize ${confidenceClass(exp.confidence_level)}`}>
                  {exp.confidence_level}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {dashboard.recent_feedback.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentFeedback}</h2>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {dashboard.recent_feedback.map((f, i) => (
              <li key={i} className="capitalize">{f.rating.replace(/_/g, " ")}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="text-xs text-gray-500">{labels.safetyNote}</p>
    </div>
  );
}
