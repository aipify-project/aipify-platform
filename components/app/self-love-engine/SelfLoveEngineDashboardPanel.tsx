"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseSelfLoveEngineDashboard,
  type SelfLoveApplicationArea,
  type SelfLoveCommunicationExample,
  type SelfLoveEngineDashboard,
  type SelfLoveRecommendation,
  type SelfLoveSuccessCriterion,
} from "@/lib/aipify/self-love-engine";

type Props = { labels: Record<string, string> };

function categoryBadgeClass(category?: string) {
  switch (category) {
    case "user_wellbeing":
      return "bg-emerald-100 text-emerald-800";
    case "team_health":
      return "bg-sky-100 text-sky-800";
    case "organization_health":
      return "bg-violet-100 text-violet-800";
    case "system_health":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function RecommendationRow({
  recommendation,
  labels,
  onAcknowledge,
  busy,
}: {
  recommendation: SelfLoveRecommendation;
  labels: Record<string, string>;
  onAcknowledge: (id: string) => void;
  busy: boolean;
}) {
  if (!recommendation.id) return null;
  const isPending = recommendation.status === "pending";
  return (
    <li className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-gray-900">{recommendation.title}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs capitalize ${categoryBadgeClass(recommendation.category)}`}
        >
          {(recommendation.category ?? "user_wellbeing").replace(/_/g, " ")}
        </span>
      </div>
      {recommendation.explanation ? (
        <p className="mt-1 text-xs text-gray-700">{recommendation.explanation}</p>
      ) : null}
      {recommendation.confidence ? (
        <p className="mt-1 text-xs text-gray-500">
          {labels.confidence}: {recommendation.confidence}
        </p>
      ) : null}
      {isPending ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => onAcknowledge(recommendation.id!)}
          className="mt-2 rounded border border-emerald-200 px-2 py-1 text-xs text-emerald-800 disabled:opacity-50"
        >
          {labels.acknowledge}
        </button>
      ) : (
        <span className="mt-2 inline-block text-xs capitalize text-gray-500">{recommendation.status}</span>
      )}
    </li>
  );
}

export function SelfLoveEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<SelfLoveEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [tone, setTone] = useState("warm");
  const [pauseSuggestions, setPauseSuggestions] = useState(true);
  const [reminderFrequency, setReminderFrequency] = useState("normal");
  const [dashboardInsights, setDashboardInsights] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/self-love-engine/dashboard");
    if (res.ok) {
      const parsed = parseSelfLoveEngineDashboard(await res.json());
      setDashboard(parsed);
      if (typeof parsed.user_preferences?.tone === "string") setTone(parsed.user_preferences.tone);
      if (typeof parsed.user_preferences?.pause_suggestions_enabled === "boolean") {
        setPauseSuggestions(parsed.user_preferences.pause_suggestions_enabled);
      }
      if (typeof parsed.org_settings?.reminder_frequency === "string") {
        setReminderFrequency(parsed.org_settings.reminder_frequency);
      }
      if (typeof parsed.org_settings?.dashboard_insights_enabled === "boolean") {
        setDashboardInsights(parsed.org_settings.dashboard_insights_enabled);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function acknowledgeRecommendation(id: string) {
    setBusyId(id);
    setActionError(null);
    const res = await fetch("/api/aipify/self-love-engine/dashboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recommendation_id: id }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
    setBusyId(null);
  }

  async function savePreferences() {
    setSavingPrefs(true);
    setActionError(null);
    const res = await fetch("/api/aipify/self-love-engine/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tone, pause_suggestions_enabled: pauseSuggestions }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.preferencesFailed);
    } else {
      await load();
    }
    setSavingPrefs(false);
  }

  async function saveOrgSettings() {
    setSavingSettings(true);
    setActionError(null);
    const res = await fetch("/api/aipify/self-love-engine/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reminder_frequency: reminderFrequency,
        dashboard_insights_enabled: dashboardInsights,
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

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const canManage = Boolean(dashboard.permissions?.can_manage);
  const summary = dashboard.summary ?? {};
  const systemHealth = dashboard.system_health_signals ?? {};
  const quality = (systemHealth.quality_guardian ?? {}) as Record<string, unknown>;
  const observability = (systemHealth.observability ?? {}) as Record<string, unknown>;

  return (
    <div className="space-y-6">
      {(dashboard.integration_links ?? {}) && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(dashboard.integration_links ?? {}).map(([key, route]) =>
            typeof route === "string" && route.startsWith("/") ? (
              <Link key={key} href={route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
                {labels[key as keyof typeof labels] ?? key.replace(/_/g, " ")}
              </Link>
            ) : null
          )}
        </div>
      )}

      <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
        <h2 className="text-sm font-semibold text-emerald-900">{labels.engineTitle}</h2>
        {dashboard.mission ? (
          <p className="mt-2 text-sm font-medium text-emerald-900">{dashboard.mission}</p>
        ) : null}
        <p className="mt-2 text-sm text-emerald-900">{dashboard.philosophy}</p>
        {dashboard.abos_principle ? (
          <p className="mt-2 text-xs text-emerald-800">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.vision ? <p className="mt-1 text-xs italic text-emerald-700">{dashboard.vision}</p> : null}
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.pendingRecommendations}</p>
          <p className="text-2xl font-semibold text-gray-900">{String(summary.pending_recommendations ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.acknowledgedCount}</p>
          <p className="text-2xl font-semibold text-gray-900">{String(summary.acknowledged_count ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.openQualityChecks}</p>
          <p className="text-2xl font-semibold text-gray-900">{String(quality.open_checks ?? 0)}</p>
        </div>
      </div>

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.applicationAreas}</h3>
        <ul className="mt-3 space-y-3">
          {dashboard.application_areas?.map((area: SelfLoveApplicationArea) => (
            <li key={area.key} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
              <p className="font-medium text-gray-900">{area.label}</p>
              {area.description ? <p className="mt-1 text-xs text-gray-600">{area.description}</p> : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.communicationExamples}</h3>
        <ul className="mt-3 space-y-2">
          {dashboard.communication_examples?.map((ex: SelfLoveCommunicationExample, i) => (
            <li key={i} className="text-sm text-gray-700">
              {ex.emoji ? <span className="mr-1">{ex.emoji}</span> : null}
              {ex.phrase}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.recommendations}</h3>
        {dashboard.recent_recommendations?.length ? (
          <ul className="mt-3 space-y-2">
            {dashboard.recent_recommendations.map((rec) => (
              <RecommendationRow
                key={rec.id}
                recommendation={rec}
                labels={labels}
                onAcknowledge={acknowledgeRecommendation}
                busy={busyId === rec.id}
              />
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-gray-600">{labels.noRecommendations}</p>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.systemHealth}</h3>
        <p className="mt-1 text-xs text-gray-500">{labels.systemHealthNote}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
            <p className="font-medium text-gray-900">{labels.qualityGuardian}</p>
            <p className="text-xs text-gray-600">
              {labels.openQualityChecks}: {String(quality.open_checks ?? 0)} · {labels.criticalChecks}:{" "}
              {String(quality.critical_checks ?? 0)}
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
            <p className="font-medium text-gray-900">{labels.observabilitySection ?? labels.observability}</p>
            <p className="text-xs text-gray-600">
              {labels.degradedComponents}: {String(observability.degraded_components ?? 0)} ·{" "}
              {labels.openIncidents}: {String(observability.open_incidents ?? 0)}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
        <ul className="mt-3 space-y-2">
          {dashboard.success_criteria?.map((c: SelfLoveSuccessCriterion) => (
            <li key={c.key} className="flex items-start gap-2 text-sm">
              <span className={c.met ? "text-emerald-600" : "text-gray-400"}>{c.met ? "✓" : "○"}</span>
              <div>
                <p className="text-gray-900">{c.label}</p>
                {c.note ? <p className="text-xs text-gray-500">{c.note}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.boundaries}</h3>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-700">
          {dashboard.boundaries?.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.preferences}</h3>
          <div className="mt-3 space-y-3">
            <label className="block text-sm">
              <span className="text-gray-700">{labels.tone}</span>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="mt-1 block w-full rounded border border-gray-200 px-2 py-1 text-sm"
              >
                <option value="warm">{labels.toneWarm}</option>
                <option value="balanced">{labels.toneBalanced}</option>
                <option value="minimal">{labels.toneMinimal}</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={pauseSuggestions}
                onChange={(e) => setPauseSuggestions(e.target.checked)}
              />
              {labels.pauseSuggestions}
            </label>
            <button
              type="button"
              disabled={savingPrefs}
              onClick={() => void savePreferences()}
              className="rounded bg-emerald-700 px-3 py-1.5 text-sm text-white disabled:opacity-50"
            >
              {savingPrefs ? labels.saving : labels.savePreferences}
            </button>
          </div>
        </section>

        {canManage ? (
          <section className="rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900">{labels.orgSettings}</h3>
            <div className="mt-3 space-y-3">
              <label className="block text-sm">
                <span className="text-gray-700">{labels.reminderFrequency}</span>
                <select
                  value={reminderFrequency}
                  onChange={(e) => setReminderFrequency(e.target.value)}
                  className="mt-1 block w-full rounded border border-gray-200 px-2 py-1 text-sm"
                >
                  <option value="low">{labels.frequencyLow}</option>
                  <option value="normal">{labels.frequencyNormal}</option>
                  <option value="high">{labels.frequencyHigh}</option>
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={dashboardInsights}
                  onChange={(e) => setDashboardInsights(e.target.checked)}
                />
                {labels.dashboardInsights}
              </label>
              <button
                type="button"
                disabled={savingSettings}
                onClick={() => void saveOrgSettings()}
                className="rounded bg-violet-700 px-3 py-1.5 text-sm text-white disabled:opacity-50"
              >
                {savingSettings ? labels.saving : labels.saveSettings}
              </button>
            </div>
          </section>
        ) : null}
      </div>

      {actionError ? <p className="text-sm text-rose-600">{actionError}</p> : null}
    </div>
  );
}
