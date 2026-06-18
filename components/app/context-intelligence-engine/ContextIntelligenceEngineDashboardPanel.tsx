"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseContextIntelligenceEngineDashboard,
  type ContextDimensionSummary,
  type ContextIntelligenceEngineDashboard,
  type OrganizationContextGap,
} from "@/lib/aipify/context-intelligence-engine";

type Props = { labels: Record<string, string> };

function severityClass(value?: string) {
  switch (value) {
    case "critical":
      return "bg-rose-100 text-rose-900";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "medium":
      return "bg-amber-100 text-amber-800";
    case "low":
      return "bg-emerald-100 text-emerald-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function SignalSummary({ summary }: { summary?: Record<string, unknown> }) {
  if (!summary || Object.keys(summary).length === 0) return null;
  return (
    <dl className="mt-2 grid gap-1 text-xs text-gray-600">
      {Object.entries(summary).map(([key, value]) => (
        <div key={key} className="flex justify-between gap-2">
          <dt className="capitalize text-gray-500">{key.replace(/_/g, " ")}</dt>
          <dd className="font-medium text-gray-800">{String(value)}</dd>
        </div>
      ))}
    </dl>
  );
}

function DimensionCard({
  dimension,
  labels,
}: {
  dimension: ContextDimensionSummary;
  labels: Record<string, string>;
}) {
  return (
    <li className="rounded-lg border border-gray-100 bg-white px-3 py-3 text-sm">
      <span className="font-medium text-gray-900">{dimension.label ?? dimension.key}</span>
      {dimension.description ? (
        <p className="mt-1 text-xs text-gray-500">{dimension.description}</p>
      ) : null}
      <SignalSummary summary={dimension.signal_summary} />
      {!dimension.signal_summary ? (
        <p className="mt-1 text-xs text-gray-400">{labels.noSignals}</p>
      ) : null}
    </li>
  );
}

function GapRow({
  gap,
  labels,
  onResolve,
  busy,
}: {
  gap: OrganizationContextGap;
  labels: Record<string, string>;
  onResolve: (id: string) => void;
  busy: boolean;
}) {
  return (
    <li className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium capitalize text-gray-900">
          {gap.gap_type?.replace(/_/g, " ")}
        </span>
        <div className="flex gap-1">
          <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${severityClass(gap.severity)}`}>
            {gap.severity}
          </span>
          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs capitalize text-violet-800">
            {gap.dimension}
          </span>
        </div>
      </div>
      {gap.summary ? <p className="mt-1 text-xs text-gray-600">{gap.summary}</p> : null}
      {gap.status === "open" || gap.status === "acknowledged" ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => onResolve(gap.id)}
          className="mt-2 rounded border border-emerald-200 px-2 py-1 text-xs text-emerald-800 disabled:opacity-50"
        >
          {labels.resolveGap}
        </button>
      ) : null}
    </li>
  );
}

export function ContextIntelligenceEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<ContextIntelligenceEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/context-intelligence-engine/dashboard");
    if (res.ok) setDashboard(parseContextIntelligenceEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const resolveGap = async (gapId: string) => {
    setActionId(gapId);
    const res = await fetch("/api/aipify/context-intelligence-engine/gaps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gap_id: gapId, status: "resolved" }),
    });
    if (res.ok) await load();
    setActionId(null);
  };

  const exportSummary = async () => {
    setExporting(true);
    const res = await fetch("/api/aipify/context-intelligence-engine/export?format=json");
    if (res.ok) {
      const blob = new Blob([JSON.stringify(await res.json(), null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "context-intelligence-summary.json";
      a.click();
      URL.revokeObjectURL(url);
    }
    setExporting(false);
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const links = dashboard.integration_links ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {Object.entries(links).map(([key, link]) =>
          link.route ? (
            <Link
              key={key}
              href={link.route}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
            >
              {link.engine ?? key}
            </Link>
          ) : null
        )}
      </div>

      <section className="rounded-xl border border-sky-200 bg-sky-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        {dashboard.mission ? (
          <p className="mt-2 text-sm font-medium text-sky-900">{dashboard.mission}</p>
        ) : null}
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.abos_principle ? (
          <p className="mt-2 text-xs text-sky-800">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.privacy_note ? (
          <p className="mt-2 text-xs text-gray-500">{dashboard.privacy_note}</p>
        ) : null}
      </section>

      {dashboard.self_love_note ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
          {dashboard.self_love_note}
        </section>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.openGaps}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.open_gaps ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.dimensionsMonitored}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.dimensions_monitored ?? 8)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.proactiveLevel}</p>
          <p className="mt-1 text-lg font-semibold capitalize">{String(summary.proactive_level ?? "balanced")}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.gapDetection}</p>
          <p className="mt-1 text-lg font-semibold">
            {summary.gap_detection_enabled === false ? labels.disabled : labels.enabled}
          </p>
        </div>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.contextDimensions}</h3>
        {dashboard.context_dimensions.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.context_dimensions.map((dimension) => (
              <DimensionCard
                key={dimension.key ?? dimension.label}
                dimension={dimension}
                labels={labels}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900">{labels.contextGaps}</h3>
          <button
            type="button"
            disabled={exporting}
            onClick={() => void exportSummary()}
            className="rounded border border-gray-200 px-3 py-1 text-xs disabled:opacity-50"
          >
            {exporting ? labels.exporting : labels.exportSummary}
          </button>
        </div>
        {dashboard.context_gaps.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noGaps}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.context_gaps.map((gap) => (
              <GapRow
                key={gap.id}
                gap={gap}
                labels={labels}
                onResolve={resolveGap}
                busy={actionId === gap.id}
              />
            ))}
          </ul>
        )}
      </section>

      {dashboard.principles && dashboard.principles.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
            {dashboard.principles.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
