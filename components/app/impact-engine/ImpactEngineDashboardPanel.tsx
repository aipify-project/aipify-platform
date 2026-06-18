"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseImpactEngineDashboard,
  type ImpactCelebrationExample,
  type ImpactDimensionInfo,
  type ImpactEngineDashboard,
  type ImpactReportingExample,
  type ImpactSignal,
} from "@/lib/aipify/impact-engine";

type Props = { labels: Record<string, string> };

function confidenceBadgeClass(confidence?: string) {
  switch (confidence) {
    case "high":
      return "bg-emerald-100 text-emerald-800";
    case "moderate":
      return "bg-sky-100 text-sky-800";
    case "low":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function dimensionBadgeClass(dimension?: string) {
  switch (dimension) {
    case "operational":
      return "bg-blue-100 text-blue-800";
    case "customer":
      return "bg-violet-100 text-violet-800";
    case "human":
      return "bg-rose-100 text-rose-800";
    case "knowledge":
      return "bg-amber-100 text-amber-800";
    case "strategic":
      return "bg-emerald-100 text-emerald-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function ImpactEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<ImpactEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [celebrateProgress, setCelebrateProgress] = useState(true);
  const [includeWellbeing, setIncludeWellbeing] = useState(true);
  const [reportingCadence, setReportingCadence] = useState("monthly");

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/impact-engine/dashboard");
    if (res.ok) {
      const parsed = parseImpactEngineDashboard(await res.json());
      setDashboard(parsed);
      if (typeof parsed.settings?.celebrate_progress === "boolean") {
        setCelebrateProgress(parsed.settings.celebrate_progress);
      }
      if (typeof parsed.settings?.include_wellbeing_metrics === "boolean") {
        setIncludeWellbeing(parsed.settings.include_wellbeing_metrics);
      }
      if (typeof parsed.settings?.reporting_cadence === "string") {
        setReportingCadence(parsed.settings.reporting_cadence);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveSettings() {
    setSavingSettings(true);
    setActionError(null);
    const res = await fetch("/api/aipify/impact-engine/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        celebrate_progress: celebrateProgress,
        include_wellbeing_metrics: includeWellbeing,
        reporting_cadence: reportingCadence,
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.settingsFailed);
    } else {
      await load();
    }
    setSavingSettings(false);
  }

  async function generateSummary() {
    setGenerating(true);
    setActionError(null);
    const res = await fetch("/api/aipify/impact-engine/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ period: reportingCadence }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.generateFailed);
    } else {
      await load();
    }
    setGenerating(false);
  }

  async function exportReport() {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/impact-engine/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.exportFailed);
    }
    setExporting(false);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const permissions = dashboard.permissions ?? {};
  const canManage = Boolean(permissions.can_manage);
  const canExport = Boolean(permissions.can_export);
  const canGenerate = Boolean(permissions.can_generate_reports);
  const recentSignals = dashboard.recent_signals ?? [];
  const integrationLinks = dashboard.integration_links ?? {};
  const dimensions = dashboard.impact_dimensions ?? [];
  const reportingExamples = dashboard.reporting_examples ?? [];
  const celebrationExamples = dashboard.celebration_examples ?? [];
  const latestReport = dashboard.latest_report;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.mission ? <p className="mt-2 text-xs text-teal-800">{dashboard.mission}</p> : null}
        {dashboard.abos_principle ? (
          <p className="mt-1 text-xs font-medium text-teal-900">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.vision ? <p className="mt-1 text-xs italic text-teal-700">{dashboard.vision}</p> : null}
        <p className="mt-2 text-xs text-teal-700">{dashboard.distinction_note ?? labels.distinctionNote}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        {canGenerate ? (
          <button
            type="button"
            className="rounded border border-teal-300 px-3 py-1 text-xs text-teal-800 disabled:opacity-50"
            disabled={generating}
            onClick={() => void generateSummary()}
          >
            {generating ? labels.generating : labels.generateSummary}
          </button>
        ) : null}
        {canExport ? (
          <button
            type="button"
            className="rounded border border-teal-300 px-3 py-1 text-xs text-teal-800 disabled:opacity-50"
            disabled={exporting}
            onClick={() => void exportReport()}
          >
            {exporting ? labels.exporting : labels.exportReport}
          </button>
        ) : null}
      </div>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.summary}</h3>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-gray-500">{labels.signalCount}</dt>
            <dd>{String(summary.signal_count ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.publishedReports}</dt>
            <dd>{String(summary.published_reports ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.positiveTrends}</dt>
            <dd>{String(summary.positive_trends ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.celebrateProgress}</dt>
            <dd>{summary.celebrate_progress ? labels.yes : labels.no}</dd>
          </div>
        </dl>
      </section>

      {dimensions.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.impactDimensions}</h3>
          <ul className="mt-3 space-y-3 text-sm">
            {(dimensions as ImpactDimensionInfo[]).map((dim) => (
              <li key={dim.key ?? dim.label} className="rounded border border-teal-100 bg-teal-50/30 p-3">
                <div className="font-medium">{dim.label}</div>
                {Array.isArray(dim.bullets) && dim.bullets.length > 0 ? (
                  <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
                    {dim.bullets.map((b, i) => (
                      <li key={i}>{String(b)}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {reportingExamples.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.reportingExamples}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(reportingExamples as ImpactReportingExample[]).map((ex) => (
              <li key={ex.key ?? ex.label} className="rounded border border-gray-100 p-2">
                <div className="font-medium">{ex.label}</div>
                {ex.example ? <p className="mt-1 text-xs text-gray-600">{ex.example}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {recentSignals.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.recentSignals}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(recentSignals as ImpactSignal[]).map((sig) => (
              <li key={sig.id} className="rounded border border-gray-100 p-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs capitalize ${dimensionBadgeClass(sig.dimension)}`}
                  >
                    {sig.dimension?.replace(/_/g, " ")}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs uppercase ${confidenceBadgeClass(sig.confidence)}`}
                  >
                    {sig.confidence}
                  </span>
                  {sig.trend_pct != null ? (
                    <span className="text-xs text-gray-500">
                      {sig.trend_pct > 0 ? "+" : ""}
                      {sig.trend_pct}%
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-gray-700">{sig.summary}</p>
                {sig.measurement_notes ? (
                  <p className="mt-1 text-xs text-gray-500 italic">{sig.measurement_notes}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {latestReport && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.latestReport}</h3>
          <p className="mt-2 text-sm">{latestReport.summary}</p>
          {latestReport.report_period ? (
            <p className="mt-1 text-xs text-gray-500">
              {labels.reportPeriod}: {latestReport.report_period}
            </p>
          ) : null}
          {Array.isArray(latestReport.highlights) && latestReport.highlights.length > 0 ? (
            <ul className="mt-3 space-y-1 text-xs text-gray-600">
              {latestReport.highlights.map((h, i) => {
                const item = h as Record<string, unknown>;
                return (
                  <li key={i}>
                    {String(item.dimension ?? "")}: {String(item.summary ?? "")}
                  </li>
                );
              })}
            </ul>
          ) : null}
          {Array.isArray(latestReport.limitations) && latestReport.limitations.length > 0 ? (
            <div className="mt-3">
              <h4 className="text-xs font-semibold text-gray-700">{labels.limitations}</h4>
              <ul className="mt-1 list-inside list-disc text-xs text-gray-500">
                {latestReport.limitations.map((l, i) => (
                  <li key={i}>{String(l)}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      )}

      {celebrationExamples.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.celebrationExamples}</h3>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {(celebrationExamples as ImpactCelebrationExample[]).map((ex) => (
              <li key={ex.context} className="rounded border border-teal-50 px-2 py-1 text-xs">
                {ex.bell_text}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(dashboard.self_love_note || dashboard.trust_note) && (
        <section className="rounded-lg border border-gray-200 p-4 text-xs text-gray-600">
          {dashboard.self_love_note ? (
            <div>
              <h4 className="font-semibold text-gray-700">{labels.selfLoveNote}</h4>
              <p className="mt-1">{dashboard.self_love_note}</p>
            </div>
          ) : null}
          {dashboard.trust_note ? (
            <div className="mt-3">
              <h4 className="font-semibold text-gray-700">{labels.trustNote}</h4>
              <p className="mt-1">{dashboard.trust_note}</p>
            </div>
          ) : null}
        </section>
      )}

      {canManage ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.impactSettings}</h3>
          <div className="mt-3 space-y-3">
            <label className="flex flex-col gap-1 text-sm">
              <span>{labels.reportingCadence}</span>
              <select
                value={reportingCadence}
                onChange={(e) => setReportingCadence(e.target.value)}
                className="rounded border border-gray-200 px-2 py-1 text-sm"
              >
                <option value="weekly">{labels.cadenceWeekly}</option>
                <option value="monthly">{labels.cadenceMonthly}</option>
                <option value="quarterly">{labels.cadenceQuarterly}</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={celebrateProgress}
                onChange={(e) => setCelebrateProgress(e.target.checked)}
              />
              {labels.celebrateProgressToggle}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={includeWellbeing}
                onChange={(e) => setIncludeWellbeing(e.target.checked)}
              />
              {labels.includeWellbeing}
            </label>
            <button
              type="button"
              disabled={savingSettings}
              onClick={() => void saveSettings()}
              className="rounded border border-teal-300 px-3 py-1 text-xs text-teal-800 disabled:opacity-50"
            >
              {savingSettings ? labels.saving : labels.saveSettings}
            </button>
          </div>
        </section>
      ) : null}

      {Object.keys(integrationLinks).length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrationLinks}</h3>
          <ul className="mt-2 flex flex-wrap gap-2 text-xs">
            {Object.entries(integrationLinks).map(([key, href]) =>
              typeof href === "string" ? (
                <li key={key}>
                  <Link href={href} className="text-teal-700 underline">
                    {key.replace(/_/g, " ")}
                  </Link>
                </li>
              ) : null
            )}
          </ul>
        </section>
      )}
    </div>
  );
}
