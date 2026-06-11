"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseQualityDashboard, type QualityDashboard } from "@/lib/aipify/quality";

type QualityDashboardPanelProps = {
  labels: Record<string, string>;
  severityLabels: Record<string, string>;
};

const SEVERITY_STYLES: Record<string, string> = {
  info: "bg-slate-100 text-slate-700",
  low: "bg-emerald-100 text-emerald-800",
  medium: "bg-amber-100 text-amber-900",
  high: "bg-orange-100 text-orange-900",
  critical: "bg-rose-100 text-rose-900",
};

export function QualityDashboardPanel({ labels, severityLabels }: QualityDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<QualityDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/quality/dashboard");
    if (res.ok) setDashboard(parseQualityDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function runScan() {
    setScanning(true);
    await fetch("/api/aipify/quality/scans/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scan_type: "full", tenant_slug: "unonight" }),
    });
    await refresh();
    setScanning(false);
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  if (!dashboard?.has_customer) {
    return <div className="p-6 text-sm text-gray-600">{labels.empty}</div>;
  }

  if (dashboard.upgrade_required) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 p-6">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <p className="text-sm text-gray-600">{labels.upgradeBody}</p>
        <Link href="/app/settings/billing" className="text-sm font-medium text-violet-700">
          {labels.upgradeCta}
        </Link>
      </div>
    );
  }

  const w = dashboard.widgets;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
          <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
          {dashboard.observation_mode ? (
            <p className="mt-3 rounded-lg border border-violet-100 bg-violet-50/60 px-3 py-2 text-sm text-violet-900">
              {labels.observationMode}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          disabled={scanning}
          onClick={() => void runScan()}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {labels.runScan}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <Link href="/app/quality/incidents" className="text-violet-700">{labels.incidents}</Link>
        <Link href="/app/quality/reports" className="text-violet-700">{labels.reports}</Link>
        <Link href="/app/quality/scans" className="text-violet-700">{labels.scans}</Link>
        <Link href="/app/settings/quality" className="text-violet-700">{labels.settings}</Link>
      </div>

      {w ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [labels.openIncidents, w.open_incidents],
            [labels.criticalIncidents, w.critical_incidents],
            [labels.brokenLinks, w.broken_links],
            [labels.failedWorkflows, w.failed_workflows],
            [labels.integrationHealth, w.integration_issues],
            [labels.knowledgeGaps, w.knowledge_gaps],
            [labels.recommendedActions, w.recommended_actions],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-xs text-gray-500">{label}</p>
              <p className="mt-2 text-2xl font-semibold">{value}</p>
            </div>
          ))}
        </div>
      ) : null}

      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-semibold">{labels.recentIncidents}</h2>
        <ul className="mt-3 space-y-2">
          {(dashboard.recent_incidents ?? []).map((inc) => (
            <li key={inc.id} className="flex items-start justify-between gap-3 rounded border border-gray-100 px-3 py-2 text-sm">
              <div>
                <p className="font-medium">{inc.title}</p>
                <p className="text-gray-600">{inc.observed_behavior}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs ${SEVERITY_STYLES[inc.severity] ?? SEVERITY_STYLES.medium}`}>
                {severityLabels[inc.severity] ?? inc.severity}
              </span>
            </li>
          ))}
          {(dashboard.recent_incidents ?? []).length === 0 ? (
            <li className="text-sm text-gray-500">{labels.noIncidents}</li>
          ) : null}
        </ul>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-semibold">{labels.recommendedActions}</h2>
        <ul className="mt-3 space-y-2">
          {(dashboard.recommended_actions ?? []).map((rec) => (
            <li key={rec.id} className="rounded border border-gray-100 px-3 py-2 text-sm text-gray-700">
              {rec.recommendation_text}
              {rec.requires_approval ? (
                <span className="ml-2 text-xs text-amber-700">({labels.approvalRequired})</span>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-gray-500">{dashboard.privacy_note}</p>
    </div>
  );
}
