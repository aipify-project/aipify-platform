"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseAocDashboard, type AocDashboard } from "@/lib/aipify/aoc";

type AocDashboardPanelProps = {
  labels: Record<string, string>;
};

function severityClass(severity: string) {
  switch (severity) {
    case "critical":
      return "bg-red-100 text-red-800";
    case "warning":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function bandClass(band?: string) {
  switch (band) {
    case "excellent":
      return "text-emerald-700";
    case "healthy":
      return "text-teal-700";
    case "attention":
      return "text-amber-700";
    case "risk":
      return "text-orange-700";
    case "critical":
      return "text-red-700";
    default:
      return "text-gray-700";
  }
}

export function AocDashboardPanel({ labels }: AocDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<AocDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/aoc/dashboard");
    if (res.ok) setDashboard(parseAocDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateReview = async (type: string) => {
    setGenerating(type);
    await fetch("/api/aipify/aoc/reviews/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ review_type: type }),
    });
    setGenerating(null);
    await load();
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const components = dashboard.health_components ?? {};

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-6">
        <h2 className="text-sm font-semibold text-amber-900">{labels.operationalHealth}</h2>
        <p className="mt-2 text-4xl font-bold text-gray-900">
          {dashboard.overall_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className={`mt-1 text-sm font-medium capitalize ${bandClass(dashboard.health_band)}`}>
          {dashboard.health_band?.replace(/_/g, " ")}
        </p>
        <p className="mt-3 text-xs text-amber-800">{labels.humanOversight}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(components).map(([key, value]) => (
            <p key={key} className="text-sm capitalize text-gray-700">
              {key.replace(/_/g, " ")}: {value ?? "—"}
            </p>
          ))}
        </div>
      </section>

      <section>
        <div className="flex flex-wrap gap-2">
          {(["daily", "weekly", "executive"] as const).map((type) => (
            <button
              key={type}
              type="button"
              disabled={generating === type}
              onClick={() => void generateReview(type)}
              className="rounded-lg border border-amber-300 px-3 py-1.5 text-sm font-medium capitalize text-amber-900 hover:bg-amber-50 disabled:opacity-50"
            >
              {generating === type ? labels.generating : `${labels.generate} ${type}`}
            </button>
          ))}
        </div>
        {dashboard.reviews.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {dashboard.reviews.map((review) => (
              <li key={review.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
                <p className="font-medium capitalize">{review.review_type} {labels.review}</p>
                <p className="mt-1 text-gray-600">{review.summary}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.findingsSection}</h2>
        <ul className="mt-3 space-y-2">
          {dashboard.findings.map((finding) => (
            <li key={finding.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <Link href={`/app/operations/watchers/${finding.id}`} className="font-medium text-amber-900 hover:underline">
                    {finding.summary}
                  </Link>
                  <p className="mt-1 text-xs capitalize text-gray-500">{finding.watcher_type.replace(/_/g, " ")}</p>
                </div>
                <span className={`rounded px-2 py-0.5 text-xs capitalize ${severityClass(finding.severity)}`}>
                  {finding.severity}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.recommendationsSection}</h2>
        <ul className="mt-3 space-y-2">
          {dashboard.recommendations.map((rec) => (
            <li key={rec.id} className="rounded-lg border border-violet-200 bg-violet-50/40 px-4 py-3 text-sm">
              <p className="font-medium text-gray-900">{rec.title}</p>
              <p className="mt-1 text-gray-600">{rec.explanation}</p>
              <p className="mt-1 text-xs text-gray-500">
                {labels.risk}: {rec.risk_level} · {labels.confidence}: {rec.confidence_level}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.watchersSection}</h2>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {dashboard.watchers.map((w) => (
            <li key={w.type} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
              <span className="font-medium capitalize">{w.type}</span>
              <p className="text-xs text-gray-500">{w.purpose}</p>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-gray-500">{labels.safetyNote}</p>
    </div>
  );
}
