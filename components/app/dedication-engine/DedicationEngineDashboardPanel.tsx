"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseDedicationEngineDashboard,
  type BoundaryPhrases,
  type DedicationCommitment,
  type DedicationEngineDashboard,
  type DedicationPrinciple,
  type DedicationSignal,
  type SignalTypeInfo,
} from "@/lib/aipify/dedication-engine";

type Props = { labels: Record<string, string> };

function signalBadgeClass(signalType?: string) {
  switch (signalType) {
    case "solution_retry":
      return "bg-sky-100 text-sky-800";
    case "clarification_requested":
      return "bg-violet-100 text-violet-800";
    case "alternative_offered":
      return "bg-emerald-100 text-emerald-800";
    case "task_persistence":
      return "bg-amber-100 text-amber-800";
    case "progress_acknowledged":
      return "bg-teal-100 text-teal-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function commitmentBadgeClass(status?: string) {
  switch (status) {
    case "completed":
      return "bg-emerald-100 text-emerald-800";
    case "active":
      return "bg-sky-100 text-sky-800";
    case "paused":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function DedicationEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<DedicationEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [persistenceMessaging, setPersistenceMessaging] = useState(true);
  const [balanceWithSelfLove, setBalanceWithSelfLove] = useState(true);
  const [maxRetryExplorations, setMaxRetryExplorations] = useState(3);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/dedication-engine/dashboard");
    if (res.ok) {
      const parsed = parseDedicationEngineDashboard(await res.json());
      setDashboard(parsed);
      if (typeof parsed.settings?.persistence_messaging_enabled === "boolean") {
        setPersistenceMessaging(parsed.settings.persistence_messaging_enabled);
      }
      if (typeof parsed.settings?.balance_with_self_love === "boolean") {
        setBalanceWithSelfLove(parsed.settings.balance_with_self_love);
      }
      if (typeof parsed.settings?.max_retry_explorations === "number") {
        setMaxRetryExplorations(parsed.settings.max_retry_explorations);
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
    const res = await fetch("/api/aipify/dedication-engine/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        persistence_messaging_enabled: persistenceMessaging,
        balance_with_self_love: balanceWithSelfLove,
        max_retry_explorations: maxRetryExplorations,
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
    const res = await fetch("/api/aipify/dedication-engine/export", {
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
  const recentSignals = dashboard.recent_signals ?? [];
  const activeCommitments = dashboard.active_commitments ?? [];
  const principles = dashboard.dedication_principles ?? [];
  const examplePhrases = dashboard.example_phrases ?? [];
  const signalTypes = dashboard.signal_types ?? [];
  const boundaryPhrases = dashboard.boundary_phrases;
  const integrationLinks = dashboard.integration_links ?? {};

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
            <dt className="text-gray-500">{labels.commitmentCount}</dt>
            <dd>{String(summary.commitment_count ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.activeCommitments}</dt>
            <dd>{String(summary.active_commitment_count ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.maxRetryExplorations}</dt>
            <dd>{String(summary.max_retry_explorations ?? maxRetryExplorations)}</dd>
          </div>
        </dl>
      </section>

      {principles.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.dedicationPrinciples}</h3>
          <ul className="mt-3 space-y-3 text-sm">
            {(principles as DedicationPrinciple[]).map((p) => (
              <li key={p.key ?? p.label} className="rounded border border-teal-100 bg-teal-50/30 p-3">
                <div className="font-medium">{p.label}</div>
                {p.description ? <p className="mt-1 text-xs text-gray-600">{p.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {examplePhrases.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.examplePhrases}</h3>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-gray-700">
            {examplePhrases.map((phrase, i) => (
              <li key={i}>{phrase}</li>
            ))}
          </ul>
        </section>
      )}

      {signalTypes.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.signalTypes}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(signalTypes as SignalTypeInfo[]).map((st) => (
              <li key={st.key ?? st.label} className="rounded border border-gray-100 p-2">
                <span className="font-medium">{st.label}</span>
                {st.description ? <p className="mt-1 text-xs text-gray-600">{st.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {boundaryPhrases && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.boundaryPhrases}</h3>
          <div className="mt-3 grid gap-4 text-xs sm:grid-cols-2">
            <div>
              <h4 className="font-semibold text-red-700">{labels.avoidPhrases}</h4>
              <ul className="mt-2 list-inside list-disc text-gray-600">
                {((boundaryPhrases as BoundaryPhrases).avoid ?? []).map((p, i) => (
                  <li key={i}>{String(p)}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-emerald-700">{labels.preferPhrases}</h4>
              <ul className="mt-2 list-inside list-disc text-gray-600">
                {((boundaryPhrases as BoundaryPhrases).prefer ?? []).map((p, i) => (
                  <li key={i}>{String(p)}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {recentSignals.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.recentSignals}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(recentSignals as DedicationSignal[]).map((signal) => (
              <li key={signal.id} className="rounded border border-gray-100 p-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs capitalize ${signalBadgeClass(signal.signal_type)}`}
                >
                  {signal.signal_type?.replace(/_/g, " ")}
                </span>
                <p className="mt-1 text-xs text-gray-700">{signal.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {activeCommitments.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.activeCommitmentsTitle}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(activeCommitments as DedicationCommitment[]).map((commitment) => (
              <li key={commitment.id} className="rounded border border-gray-100 p-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium capitalize text-gray-700">
                    {commitment.commitment_type?.replace(/_/g, " ")}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs capitalize ${commitmentBadgeClass(commitment.status)}`}
                  >
                    {commitment.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-700">{commitment.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(dashboard.hard_work_balance_note ||
        dashboard.self_love_note ||
        dashboard.proactive_companion_note ||
        dashboard.trust_note) && (
        <section className="rounded-lg border border-gray-200 p-4 text-xs text-gray-600">
          {dashboard.hard_work_balance_note ? (
            <div>
              <h4 className="font-semibold text-gray-700">{labels.hardWorkBalanceNote}</h4>
              <p className="mt-1">{dashboard.hard_work_balance_note}</p>
            </div>
          ) : null}
          {dashboard.self_love_note ? (
            <div className="mt-3">
              <h4 className="font-semibold text-gray-700">{labels.selfLoveNote}</h4>
              <p className="mt-1">{dashboard.self_love_note}</p>
            </div>
          ) : null}
          {dashboard.proactive_companion_note ? (
            <div className="mt-3">
              <h4 className="font-semibold text-gray-700">{labels.proactiveCompanionNote}</h4>
              <p className="mt-1">{dashboard.proactive_companion_note}</p>
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
          <h3 className="text-sm font-semibold">{labels.dedicationSettings}</h3>
          <div className="mt-3 space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={persistenceMessaging}
                onChange={(e) => setPersistenceMessaging(e.target.checked)}
              />
              {labels.persistenceMessagingToggle}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={balanceWithSelfLove}
                onChange={(e) => setBalanceWithSelfLove(e.target.checked)}
              />
              {labels.balanceWithSelfLoveToggle}
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span>{labels.maxRetryExplorations}</span>
              <input
                type="number"
                min={1}
                max={10}
                value={maxRetryExplorations}
                onChange={(e) => setMaxRetryExplorations(Number(e.target.value))}
                className="w-24 rounded border border-gray-200 px-2 py-1 text-sm"
              />
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
