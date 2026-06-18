"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parsePriorityFocusEngineDashboard,
  type FocusRecommendation,
  type PriorityFocusEngineDashboard,
  type PriorityFocusItem,
} from "@/lib/aipify/priority-focus-engine";

type Props = { labels: Record<string, string> };

function levelBadgeClass(level?: number) {
  switch (level) {
    case 1:
      return "bg-red-100 text-red-800";
    case 2:
      return "bg-orange-100 text-orange-800";
    case 3:
      return "bg-amber-100 text-amber-800";
    case 4:
      return "bg-emerald-100 text-emerald-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function levelLabel(level?: number, labels?: Record<string, string>) {
  switch (level) {
    case 1:
      return labels?.p1 ?? "P1";
    case 2:
      return labels?.p2 ?? "P2";
    case 3:
      return labels?.p3 ?? "P3";
    case 4:
      return labels?.p4 ?? "P4";
    default:
      return "—";
  }
}

function PriorityItemRow({ item }: { item: PriorityFocusItem }) {
  return (
    <li className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-gray-900">{item.title}</span>
        <span className={`rounded-full px-2 py-0.5 text-xs uppercase ${levelBadgeClass(item.priority_level)}`}>
          P{item.priority_level ?? 3}
        </span>
      </div>
      <p className="mt-1 text-xs capitalize text-gray-500">{(item.dimension ?? "operational").replace(/_/g, " ")}</p>
      {item.summary ? <p className="mt-1 text-xs text-gray-700">{item.summary}</p> : null}
      {item.due_hint ? <p className="mt-1 text-xs text-indigo-700">{item.due_hint}</p> : null}
    </li>
  );
}

function RecommendationRow({
  recommendation,
  labels,
  onResolve,
  onDismiss,
  busy,
  canResolve,
}: {
  recommendation: FocusRecommendation;
  labels: Record<string, string>;
  onResolve: (id: string) => void;
  onDismiss: (id: string) => void;
  busy: boolean;
  canResolve: boolean;
}) {
  if (!recommendation.id) return null;
  return (
    <li className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium capitalize text-gray-900">
          {(recommendation.recommendation_type ?? "focus_suggestion").replace(/_/g, " ")}
        </span>
        {recommendation.priority_level ? (
          <span
            className={`rounded-full px-2 py-0.5 text-xs uppercase ${levelBadgeClass(recommendation.priority_level)}`}
          >
            P{recommendation.priority_level}
          </span>
        ) : null}
      </div>
      {recommendation.summary ? <p className="mt-1 text-xs text-gray-700">{recommendation.summary}</p> : null}
      {canResolve ? (
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onResolve(recommendation.id!)}
            className="rounded border border-indigo-200 px-2 py-1 text-xs text-indigo-800 disabled:opacity-50"
          >
            {labels.resolve}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onDismiss(recommendation.id!)}
            className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-700 disabled:opacity-50"
          >
            {labels.dismiss}
          </button>
        </div>
      ) : null}
    </li>
  );
}

export function PriorityFocusEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<PriorityFocusEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/priority-focus-engine/dashboard");
    if (res.ok) {
      setDashboard(parsePriorityFocusEngineDashboard(await res.json()));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function recommendationAction(recommendationId: string, action: "resolve" | "dismiss") {
    setBusyId(recommendationId);
    setActionError(null);
    const res = await fetch("/api/aipify/priority-focus-engine/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recommendation_id: recommendationId, action }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
    setBusyId(null);
  }

  async function exportSummary() {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/priority-focus-engine/export", {
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
  const byLevel = dashboard.active_items_by_level ?? {};
  const integrationLinks = dashboard.integration_links ?? {};
  const permissions = dashboard.permissions ?? {};
  const canResolve = Boolean(permissions.can_resolve_recommendations);
  const items = dashboard.active_items ?? [];
  const dimensions = dashboard.priority_dimensions ?? [];
  const levels = dashboard.priority_levels ?? [];
  const focusSupport = dashboard.focus_support ?? [];
  const companionExamples = dashboard.proactive_companion_examples ?? [];
  const executiveSummary = dashboard.executive_insights_summary ?? {};
  const recommendations = dashboard.focus_recommendations ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/assistant/attention" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.tagPersonalFocus}
        </Link>
        <Link href="/app/goals-okr-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.goalsOkr}
        </Link>
        <Link href="/app/proactive-companion-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.proactiveCompanion}
        </Link>
      </div>

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.mission ? <p className="mt-2 text-sm text-gray-700">{dashboard.mission}</p> : null}
        {dashboard.abos_principle ? (
          <p className="mt-2 text-xs text-indigo-800">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.self_love_note ? (
          <p className="mt-2 text-xs text-gray-600">{dashboard.self_love_note}</p>
        ) : null}
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-indigo-700">{dashboard.distinction_note}</p>
        ) : null}
      </section>

      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-4">
        {[1, 2, 3, 4].map((level) => (
          <div key={level} className="rounded-xl border border-gray-200 p-4">
            <p className="text-xs uppercase text-gray-500">{levelLabel(level, labels)}</p>
            <p className="mt-1 text-2xl font-semibold">{String(byLevel[`p${level}`] ?? 0)}</p>
            <p className="mt-1 text-xs text-gray-600">
              {levels.find((l) => l.level === level)?.label ?? ""}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 p-4">
          <p className="text-xs uppercase text-gray-500">{labels.activeItems}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.active_items ?? 0)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-4">
          <p className="text-xs uppercase text-gray-500">{labels.pendingRecommendations}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.pending_recommendations ?? 0)}</p>
        </div>
      </section>

      {typeof executiveSummary.summary === "string" ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.executiveInsights}</h3>
          <p className="mt-2 text-sm text-gray-700">{executiveSummary.summary}</p>
        </section>
      ) : null}

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold">{labels.priorityDimensions}</h3>
        <ul className="mt-3 space-y-2">
          {dimensions.map((dim) => (
            <li key={String(dim.key)} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
              <span className="font-medium">{dim.label}</span>
              {dim.description ? <p className="mt-1 text-xs text-gray-600">{dim.description}</p> : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold">{labels.priorityLevels}</h3>
        <ul className="mt-3 space-y-2">
          {levels.map((level) => (
            <li key={String(level.level)} className="text-sm text-gray-700">
              <span className={`mr-2 rounded-full px-2 py-0.5 text-xs ${levelBadgeClass(level.level)}`}>
                {level.code}
              </span>
              <span className="font-medium">{level.label}</span>
              {level.description ? <span className="text-gray-600"> — {level.description}</span> : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold">{labels.activeItemsList}</h3>
        {items.length === 0 ? (
          <p className="mt-2 text-sm text-gray-600">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {items.map((item) => (
              <PriorityItemRow key={item.id} item={item} />
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold">{labels.focusRecommendations}</h3>
        {recommendations.length === 0 ? (
          <p className="mt-2 text-sm text-gray-600">{labels.noRecommendations}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {recommendations.map((rec) => (
              <RecommendationRow
                key={rec.id}
                recommendation={rec}
                labels={labels}
                onResolve={(id) => void recommendationAction(id, "resolve")}
                onDismiss={(id) => void recommendationAction(id, "dismiss")}
                busy={busyId === rec.id}
                canResolve={canResolve}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold">{labels.focusSupport}</h3>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
          {focusSupport.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold">{labels.companionExamples}</h3>
        <ul className="mt-3 space-y-2">
          {companionExamples.map((ex, i) => (
            <li key={i} className="text-sm text-gray-700">
              {ex.example}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold">{labels.integrationLinks}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(integrationLinks).map(([key, href]) =>
            typeof href === "string" ? (
              <Link key={key} href={href} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm capitalize">
                {key.replace(/_/g, " ")}
              </Link>
            ) : null
          )}
        </div>
      </section>

      <button
        type="button"
        disabled={exporting}
        onClick={() => void exportSummary()}
        className="rounded-lg border border-gray-200 px-4 py-2 text-sm disabled:opacity-50"
      >
        {exporting ? labels.exporting : labels.exportSummary}
      </button>
    </div>
  );
}
