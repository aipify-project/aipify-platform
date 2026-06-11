"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseDigitalTwinDashboard, type DigitalTwinDashboard } from "@/lib/aipify/digital-twin";

type DigitalTwinDashboardPanelProps = {
  labels: Record<string, string>;
};

function confidenceClass(level: string) {
  switch (level) {
    case "high":
      return "bg-emerald-100 text-emerald-800";
    case "low":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
}

export function DigitalTwinDashboardPanel({ labels }: DigitalTwinDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<DigitalTwinDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/digital-twin/dashboard");
    if (res.ok) setDashboard(parseDigitalTwinDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
        <h2 className="text-sm font-semibold text-slate-900">{labels.twinHealth}</h2>
        <p className="mt-2 text-4xl font-bold text-gray-900">
          {dashboard.twin_health_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <p className="text-sm text-gray-700">{labels.processCoverage}: {dashboard.process_coverage ?? 0}</p>
          <p className="text-sm text-gray-700">{labels.knowledgeOwners}: {dashboard.knowledge_owners ?? 0}</p>
          <p className="text-sm text-gray-700">{labels.lowConfidence}: {dashboard.low_confidence_count ?? 0}</p>
          <p className="text-sm text-gray-700">{labels.roles}: {dashboard.roles.length}</p>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.rolesSection}</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {dashboard.roles.map((role) => (
            <li key={role.role_key} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <p className="font-medium text-gray-900">{role.role_name}</p>
              <p className="mt-1 text-xs text-gray-500">{role.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.processesSection}</h2>
        <ul className="mt-3 space-y-2">
          {dashboard.processes.map((proc) => (
            <li key={proc.process_key} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <Link
                href={`/app/digital-twin/processes/${proc.process_key}`}
                className="font-medium text-slate-800 hover:underline"
              >
                {proc.process_name}
              </Link>
              <p className="mt-1 text-xs capitalize text-gray-500">
                {proc.category}
                {proc.deadline_hours ? ` · ${proc.deadline_hours}h deadline` : ""}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.knowledgeRouting}</h2>
        <ul className="mt-3 space-y-2">
          {dashboard.knowledge_routing.map((owner) => (
            <li key={owner.topic_key} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <span>{owner.topic}</span>
              <span className={`rounded px-2 py-0.5 text-xs capitalize ${confidenceClass(owner.confidence_level)}`}>
                {owner.confidence}% · {owner.confidence_level}
                {owner.requires_review ? ` · ${labels.reviewRecommended}` : ""}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.insightsSection}</h2>
        <ul className="mt-3 space-y-2">
          {dashboard.insights.map((insight) => (
            <li key={insight.id} className="rounded-lg border border-amber-200 bg-amber-50/50 px-4 py-3 text-sm">
              <p className="font-medium text-gray-900">{insight.summary}</p>
              <p className="mt-1 text-xs capitalize text-gray-500">
                {insight.insight_type.replace(/_/g, " ")} · {insight.confidence}% confidence
              </p>
            </li>
          ))}
        </ul>
      </section>

      {dashboard.integrations ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.integrations}</h2>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {Object.entries(dashboard.integrations).map(([key, value]) => (
              <li key={key}>
                <span className="capitalize">{key.replace(/_/g, " ")}</span>: {value}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="text-xs text-gray-500">{labels.safetyNote}</p>
    </div>
  );
}
