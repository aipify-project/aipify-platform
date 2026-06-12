"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseHopeEngineDashboard,
  type HopeContextInfo,
  type HopeEngineDashboard,
  type HopeExamplePhrase,
  type HopeReflection,
  type HopeSignal,
} from "@/lib/aipify/hope-engine";

type Props = { labels: Record<string, string> };

function contextBadgeClass(contextType?: string) {
  switch (contextType) {
    case "change":
      return "bg-sky-100 text-sky-800";
    case "setback":
      return "bg-amber-100 text-amber-800";
    case "demanding_project":
      return "bg-violet-100 text-violet-800";
    case "failed_attempt":
      return "bg-rose-100 text-rose-800";
    case "uncertainty":
      return "bg-stone-100 text-stone-700";
    case "invisible_progress":
      return "bg-emerald-100 text-emerald-800";
    case "personal_challenge":
      return "bg-indigo-100 text-indigo-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function ReflectionRow({
  reflection,
  labels,
  onAcknowledge,
  onDismiss,
  busy,
  canAcknowledge,
}: {
  reflection: HopeReflection;
  labels: Record<string, string>;
  onAcknowledge: (id: string) => void;
  onDismiss: (id: string) => void;
  busy: boolean;
  canAcknowledge: boolean;
}) {
  if (!reflection.id) return null;
  return (
    <li className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm">
      <p className="font-medium text-gray-900">{reflection.prompt}</p>
      {reflection.balanced_message ? (
        <p className="mt-1 text-xs italic text-teal-700">{reflection.balanced_message}</p>
      ) : null}
      {canAcknowledge ? (
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onAcknowledge(reflection.id!)}
            className="rounded border border-teal-200 px-2 py-1 text-xs text-teal-800 disabled:opacity-50"
          >
            {labels.acknowledge}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onDismiss(reflection.id!)}
            className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-700 disabled:opacity-50"
          >
            {labels.dismiss}
          </button>
        </div>
      ) : null}
    </li>
  );
}

export function HopeEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HopeEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [realisticEncouragementEnabled, setRealisticEncouragementEnabled] = useState(true);
  const [highlightProgress, setHighlightProgress] = useState(true);
  const [balanceWithSelfLove, setBalanceWithSelfLove] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/hope-engine/dashboard");
    if (res.ok) {
      const parsed = parseHopeEngineDashboard(await res.json());
      setDashboard(parsed);
      if (typeof parsed.settings?.realistic_encouragement_enabled === "boolean") {
        setRealisticEncouragementEnabled(parsed.settings.realistic_encouragement_enabled);
      }
      if (typeof parsed.settings?.highlight_progress === "boolean") {
        setHighlightProgress(parsed.settings.highlight_progress);
      }
      if (typeof parsed.settings?.balance_with_self_love === "boolean") {
        setBalanceWithSelfLove(parsed.settings.balance_with_self_love);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function reflectionAction(reflectionId: string, action: "acknowledge" | "dismiss") {
    setBusyId(reflectionId);
    setActionError(null);
    const res = await fetch("/api/aipify/hope-engine/reflections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reflection_id: reflectionId, action }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
    setBusyId(null);
  }

  async function saveSettings() {
    setSavingSettings(true);
    setActionError(null);
    const res = await fetch("/api/aipify/hope-engine/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        realistic_encouragement_enabled: realisticEncouragementEnabled,
        highlight_progress: highlightProgress,
        balance_with_self_love: balanceWithSelfLove,
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

  async function exportReport() {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/hope-engine/export", {
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

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const permissions = dashboard.permissions ?? {};
  const canManage = Boolean(permissions.can_manage);
  const canExport = Boolean(permissions.can_export);
  const canAcknowledgeReflections = Boolean(permissions.can_acknowledge_reflections);
  const recentSignals = dashboard.recent_signals ?? [];
  const pendingReflections = dashboard.pending_reflections ?? [];
  const whenHopeMatters = dashboard.when_hope_matters ?? [];
  const examplePhrases = dashboard.example_phrases ?? [];
  const communicationPrinciples = dashboard.communication_principles ?? [];
  const integrationLinks = dashboard.integration_links ?? {};
  const boundaryPhrases = dashboard.boundary_phrases ?? {};
  const avoidPhrases = Array.isArray(boundaryPhrases.avoid) ? boundaryPhrases.avoid : [];
  const preferPhrases = Array.isArray(boundaryPhrases.prefer) ? boundaryPhrases.prefer : [];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.mission ? <p className="mt-2 text-xs text-teal-800">{dashboard.mission}</p> : null}
        {dashboard.abos_principle ? (
          <p className="mt-1 text-xs font-medium text-teal-900">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.vision ? (
          <p className="mt-1 text-xs italic text-teal-700">{dashboard.vision}</p>
        ) : null}
        <p className="mt-2 text-xs text-teal-700">{dashboard.distinction_note ?? labels.distinctionNote}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
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
            <dt className="text-gray-500">{labels.pendingReflections}</dt>
            <dd>{String(summary.pending_reflections ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.realisticEncouragement}</dt>
            <dd>{summary.realistic_encouragement_enabled ? labels.yes : labels.no}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.highlightProgress}</dt>
            <dd>{summary.highlight_progress ? labels.yes : labels.no}</dd>
          </div>
        </dl>
      </section>

      {whenHopeMatters.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.whenHopeMatters}</h3>
          <ul className="mt-3 space-y-3 text-sm">
            {(whenHopeMatters as HopeContextInfo[]).map((ctx) => (
              <li key={ctx.key ?? ctx.label} className="rounded border border-teal-100 bg-teal-50/30 p-3">
                <div className="font-medium">{ctx.label}</div>
                {ctx.description ? <p className="mt-1 text-xs text-gray-600">{ctx.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {communicationPrinciples.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.communicationPrinciples}</h3>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-gray-700">
            {communicationPrinciples.map((principle, i) => (
              <li key={i}>{principle}</li>
            ))}
          </ul>
        </section>
      )}

      {examplePhrases.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.examplePhrases}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(examplePhrases as HopeExamplePhrase[]).map((ex) => (
              <li key={ex.phrase} className="rounded border border-gray-100 p-2">
                <p className="font-medium">{ex.phrase}</p>
                {ex.intent ? (
                  <p className="mt-1 text-xs capitalize text-gray-500">{ex.intent.replace(/_/g, " ")}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {recentSignals.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.recentSignals}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(recentSignals as HopeSignal[]).map((signal) => (
              <li key={signal.id} className="rounded border border-gray-100 p-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs capitalize ${contextBadgeClass(signal.context_type)}`}
                >
                  {signal.context_type?.replace(/_/g, " ")}
                </span>
                <p className="mt-1 text-xs text-gray-700">{signal.summary}</p>
                {signal.encouragement_note ? (
                  <p className="mt-1 text-xs italic text-teal-700">{signal.encouragement_note}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {pendingReflections.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.pendingReflectionsTitle}</h3>
          <ul className="mt-3 space-y-2">
            {(pendingReflections as HopeReflection[]).map((reflection) => (
              <ReflectionRow
                key={reflection.id}
                reflection={reflection}
                labels={labels}
                onAcknowledge={(id) => void reflectionAction(id, "acknowledge")}
                onDismiss={(id) => void reflectionAction(id, "dismiss")}
                busy={busyId === reflection.id}
                canAcknowledge={canAcknowledgeReflections}
              />
            ))}
          </ul>
        </section>
      )}

      {(dashboard.self_love_note || dashboard.dedication_note || dashboard.impact_note) && (
        <section className="rounded-lg border border-gray-200 p-4 text-xs text-gray-600">
          {dashboard.self_love_note ? (
            <div>
              <h4 className="font-semibold text-gray-700">{labels.selfLoveNote}</h4>
              <p className="mt-1">{dashboard.self_love_note}</p>
            </div>
          ) : null}
          {dashboard.dedication_note ? (
            <div className="mt-3">
              <h4 className="font-semibold text-gray-700">{labels.dedicationNote}</h4>
              <p className="mt-1">{dashboard.dedication_note}</p>
            </div>
          ) : null}
          {dashboard.impact_note ? (
            <div className="mt-3">
              <h4 className="font-semibold text-gray-700">{labels.impactNote}</h4>
              <p className="mt-1">{dashboard.impact_note}</p>
            </div>
          ) : null}
        </section>
      )}

      {(avoidPhrases.length > 0 || preferPhrases.length > 0) && (
        <section className="rounded-lg border border-amber-200 bg-amber-50/40 p-4">
          <h3 className="text-sm font-semibold">{labels.boundaryPhrases}</h3>
          {avoidPhrases.length > 0 ? (
            <div className="mt-2">
              <h4 className="text-xs font-semibold text-amber-900">{labels.avoidPhrases}</h4>
              <ul className="mt-1 list-inside list-disc text-xs text-amber-800">
                {avoidPhrases.map((item, i) => (
                  <li key={i}>{String(item)}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {preferPhrases.length > 0 ? (
            <div className="mt-3">
              <h4 className="text-xs font-semibold text-teal-900">{labels.preferPhrases}</h4>
              <ul className="mt-1 list-inside list-disc text-xs text-teal-800">
                {preferPhrases.map((item, i) => (
                  <li key={i}>{String(item)}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      )}

      {canManage ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.hopeSettings}</h3>
          <div className="mt-3 space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={realisticEncouragementEnabled}
                onChange={(e) => setRealisticEncouragementEnabled(e.target.checked)}
              />
              {labels.realisticEncouragementToggle}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={highlightProgress}
                onChange={(e) => setHighlightProgress(e.target.checked)}
              />
              {labels.highlightProgressToggle}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={balanceWithSelfLove}
                onChange={(e) => setBalanceWithSelfLove(e.target.checked)}
              />
              {labels.balanceSelfLoveToggle}
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
