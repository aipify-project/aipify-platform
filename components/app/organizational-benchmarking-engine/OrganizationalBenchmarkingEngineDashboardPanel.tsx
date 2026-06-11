"use client";

import { useCallback, useEffect, useState } from "react";
import {
  parseOrganizationalBenchmarkingEngineDashboard,
  type BenchmarkComparison,
  type BenchmarkProfile,
  type BenchmarkRecommendation,
  type OrganizationalBenchmarkingEngineDashboard,
} from "@/lib/aipify/organizational-benchmarking-engine";

type Props = { labels: Record<string, string> };

export function OrganizationalBenchmarkingEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<OrganizationalBenchmarkingEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [comparing, setComparing] = useState<string | null>(null);
  const [generatingRecs, setGeneratingRecs] = useState(false);
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-benchmarking-engine/dashboard");
    if (res.ok) setDashboard(parseOrganizationalBenchmarkingEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const runComparison = async (profile: BenchmarkProfile) => {
    if (!profile.id) return;
    setComparing(profile.id);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-benchmarking-engine/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile_id: profile.id }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.compareFailed);
    } else {
      await load();
    }
    setComparing(null);
  };

  const generateRecommendations = async () => {
    setGeneratingRecs(true);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-benchmarking-engine/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "recommendations" }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.recommendFailed);
    } else {
      await load();
    }
    setGeneratingRecs(false);
  };

  const exportReport = async () => {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/organizational-benchmarking-engine/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ report_type: "benchmark_summary" }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.exportFailed);
    } else {
      await load();
    }
    setExporting(false);
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const profiles = dashboard.profiles ?? [];
  const comparisons = dashboard.comparisons ?? [];
  const recommendations = dashboard.recommendations ?? [];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-sky-200 bg-sky-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        <p className="mt-2 text-xs text-sky-700">{labels.distinctionNote}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-sky-300 px-3 py-1 text-xs text-sky-800 disabled:opacity-50"
          disabled={generatingRecs}
          onClick={() => void generateRecommendations()}
        >
          {generatingRecs ? labels.generatingRecs : labels.generateRecommendations}
        </button>
        <button
          type="button"
          className="rounded border border-sky-300 px-3 py-1 text-xs text-sky-800 disabled:opacity-50"
          disabled={exporting}
          onClick={() => void exportReport()}
        >
          {exporting ? labels.exporting : labels.exportReport}
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-xs text-gray-500">{labels.summary}</p>
        <pre className="mt-2 overflow-auto text-xs text-gray-700">{JSON.stringify(summary, null, 2)}</pre>
      </div>

      {dashboard.executive_summary && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.executiveSummary}</h3>
          <pre className="mt-2 overflow-auto text-xs text-gray-700">
            {JSON.stringify(dashboard.executive_summary, null, 2)}
          </pre>
        </section>
      )}

      {dashboard.integration_summaries && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.integrationSummaries}</h3>
          <pre className="mt-2 overflow-auto text-xs text-gray-700">
            {JSON.stringify(dashboard.integration_summaries, null, 2)}
          </pre>
        </section>
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.profiles}</h3>
        {profiles.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noProfiles}</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {profiles.map((profile: BenchmarkProfile) => (
              <li key={profile.id} className="rounded-lg border border-gray-100 p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-900">{profile.benchmark_category}</p>
                    <p className="text-xs text-gray-500">
                      {profile.benchmark_source} · {profile.benchmark_period}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded border border-sky-300 px-2 py-1 text-xs text-sky-800 disabled:opacity-50"
                    disabled={comparing === profile.id}
                    onClick={() => void runComparison(profile)}
                  >
                    {comparing === profile.id ? labels.comparing : labels.runComparison}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.comparisons}</h3>
        {comparisons.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noComparisons}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {comparisons.slice(0, 12).map((cmp: BenchmarkComparison) => (
              <li key={cmp.id} className="rounded border border-gray-100 p-2 text-xs text-gray-700">
                <span className="font-medium">{cmp.metric_key}</span>
                {" · org "}
                {cmp.org_value}
                {" · benchmark "}
                {cmp.benchmark_value}
                {cmp.position_metadata?.position ? (
                  <span className="ml-2 text-sky-700">{String(cmp.position_metadata.position)}</span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.recommendations}</h3>
        {recommendations.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noRecommendations}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {recommendations.slice(0, 10).map((rec: BenchmarkRecommendation) => (
              <li key={rec.id} className="rounded border border-gray-100 p-2 text-xs text-gray-700">
                <span className="font-medium">{rec.status}</span>
                {" — "}
                {rec.recommendation}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
