"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseWisdomInterventionDashboard,
  type InterventionAppliesItem,
  type InterventionBoundaries,
  type ResponseStyleExample,
  type SelfLoveRosePhrase,
  type SleepOnItExample,
  type WisdomInterventionDashboard,
  type WisdomInterventionSignal,
} from "@/lib/aipify/wisdom-intervention-protocol";

type Props = { labels: Record<string, string> };

function signalBadgeClass(signalType?: string) {
  switch (signalType) {
    case "caps":
      return "bg-amber-100 text-amber-800";
    case "aggression_pattern":
      return "bg-red-100 text-red-800";
    case "late_night":
      return "bg-indigo-100 text-indigo-800";
    case "high_risk_comm":
      return "bg-violet-100 text-violet-800";
    case "emotional_charge":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function actionBadgeClass(action?: string | null) {
  switch (action) {
    case "postponed":
      return "bg-sky-100 text-sky-800";
    case "revised":
      return "bg-emerald-100 text-emerald-800";
    case "proceeded":
      return "bg-stone-100 text-stone-700";
    case "dismissed":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-amber-100 text-amber-800";
  }
}

export function WisdomInterventionProtocolDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<WisdomInterventionDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [sleepOnItEnabled, setSleepOnItEnabled] = useState(true);
  const [lateNightNudgeEnabled, setLateNightNudgeEnabled] = useState(true);
  const [capsDetectionEnabled, setCapsDetectionEnabled] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/wisdom-intervention-protocol/dashboard");
    if (res.ok) {
      const parsed = parseWisdomInterventionDashboard(await res.json());
      setDashboard(parsed);
      if (typeof parsed.settings?.sleep_on_it_enabled === "boolean") {
        setSleepOnItEnabled(parsed.settings.sleep_on_it_enabled);
      }
      if (typeof parsed.settings?.late_night_nudge_enabled === "boolean") {
        setLateNightNudgeEnabled(parsed.settings.late_night_nudge_enabled);
      }
      if (typeof parsed.settings?.caps_aggression_detection_enabled === "boolean") {
        setCapsDetectionEnabled(parsed.settings.caps_aggression_detection_enabled);
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
    const res = await fetch("/api/aipify/wisdom-intervention-protocol/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sleep_on_it_enabled: sleepOnItEnabled,
        late_night_nudge_enabled: lateNightNudgeEnabled,
        caps_aggression_detection_enabled: capsDetectionEnabled,
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
    const res = await fetch("/api/aipify/wisdom-intervention-protocol/export", {
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
  const recentSummary = dashboard.recent_summary ?? {};
  const permissions = dashboard.permissions ?? {};
  const canManage = Boolean(permissions.can_manage);
  const canExport = Boolean(permissions.can_export);
  const whenIntervene = dashboard.when_to_intervene ?? [];
  const responseExamples = dashboard.response_style_examples ?? [];
  const sleepOnItExamples = dashboard.sleep_on_it_examples ?? [];
  const pauseExamples = dashboard.pause_communication_examples ?? [];
  const selfLoveRoses = dashboard.self_love_rose_phrases ?? [];
  const recentSignals = dashboard.recent_signals ?? [];
  const boundaries = dashboard.boundaries ?? {};
  const mayItems = Array.isArray(boundaries.may) ? boundaries.may : [];
  const mayNotItems = Array.isArray(boundaries.may_not) ? boundaries.may_not : [];
  const integrationLinks = dashboard.integration_links ?? {};
  const activePrompts = dashboard.active_prompts ?? [];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.mission ? <p className="mt-2 text-xs text-indigo-800">{dashboard.mission}</p> : null}
        {dashboard.abos_principle ? (
          <p className="mt-1 text-xs font-medium text-indigo-900">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.vision ? <p className="mt-1 text-xs italic text-indigo-700">{dashboard.vision}</p> : null}
        <p className="mt-2 text-xs text-indigo-700">{dashboard.distinction_note ?? labels.distinctionNote}</p>
        {dashboard.combined_protocol_note ? (
          <p className="mt-2 text-xs text-indigo-600">{dashboard.combined_protocol_note}</p>
        ) : null}
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <section className="rounded-xl border border-rose-200 bg-rose-50/40 p-6">
        <h2 className="text-sm font-semibold">{labels.pauseReflectionSection}</h2>
        {dashboard.pause_reflection_philosophy ? (
          <p className="mt-2 text-sm text-rose-900">{dashboard.pause_reflection_philosophy}</p>
        ) : null}
        {dashboard.pause_abos_principle ? (
          <p className="mt-1 text-xs font-medium text-rose-800">{dashboard.pause_abos_principle}</p>
        ) : null}
        {dashboard.human_moment_note ? (
          <div className="mt-3 rounded-lg border border-rose-100 bg-white/80 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-rose-800">
              {labels.humanMoment}
            </h3>
            <p className="mt-2 text-sm text-gray-800">{dashboard.human_moment_note}</p>
          </div>
        ) : null}
        {pauseExamples.length > 0 ? (
          <div className="mt-4">
            <h3 className="text-xs font-semibold text-rose-900">{labels.pauseCommunicationExamples}</h3>
            <ul className="mt-2 space-y-2">
              {pauseExamples.map((item: ResponseStyleExample, i) => (
                <li key={item.scenario ?? i} className="rounded-lg border border-rose-100 bg-white px-3 py-2 text-sm">
                  {item.example}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {selfLoveRoses.length > 0 ? (
          <div className="mt-4">
            <h3 className="text-xs font-semibold text-rose-900">{labels.selfLoveRosePhrases}</h3>
            <ul className="mt-2 space-y-2">
              {selfLoveRoses.map((item: SelfLoveRosePhrase, i) => (
                <li key={i} className="rounded-lg border border-rose-100 bg-white px-3 py-2 text-sm">
                  {item.rose ? "🌹 " : ""}
                  {item.phrase}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.signalCount}</p>
          <p className="text-2xl font-semibold">{String(summary.signal_count ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.signalsLast30Days}</p>
          <p className="text-2xl font-semibold">{String(recentSummary.signals_last_30_days ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.postponedOrRevised}</p>
          <p className="text-2xl font-semibold">{String(recentSummary.postponed_or_revised ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.activePromptCount}</p>
          <p className="text-2xl font-semibold">{String(summary.active_prompt_count ?? 0)}</p>
        </div>
      </section>

      {whenIntervene.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold">{labels.whenToIntervene}</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {whenIntervene.map((item: InterventionAppliesItem) => (
              <li key={item.key} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium">{item.label}</span>
                {item.description ? <p className="mt-1 text-xs text-gray-600">{item.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-2">
        {responseExamples.length > 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-semibold">{labels.responseStyleExamples}</h2>
            <ul className="mt-3 space-y-2">
              {responseExamples.map((item: ResponseStyleExample, i) => (
                <li key={item.scenario ?? i} className="text-sm italic text-gray-700">
                  {item.example}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {sleepOnItExamples.length > 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-semibold">{labels.sleepOnItExamples}</h2>
            <ul className="mt-3 space-y-2">
              {sleepOnItExamples.map((item: SleepOnItExample, i) => (
                <li key={item.theme ?? i} className="text-sm italic text-gray-700">
                  {item.example}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      {(mayItems.length > 0 || mayNotItems.length > 0) && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold">{labels.boundaries}</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {mayItems.length > 0 ? (
              <div>
                <h3 className="text-xs font-semibold text-emerald-800">{labels.mayDo}</h3>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-gray-700">
                  {mayItems.map((item, i) => (
                    <li key={i}>{String(item)}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {mayNotItems.length > 0 ? (
              <div>
                <h3 className="text-xs font-semibold text-red-800">{labels.mayNotDo}</h3>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-gray-700">
                  {mayNotItems.map((item, i) => (
                    <li key={i}>{String(item)}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          {dashboard.settings?.user_autonomy_note ? (
            <p className="mt-3 text-xs text-gray-600">{dashboard.settings.user_autonomy_note}</p>
          ) : null}
        </section>
      )}

      {recentSignals.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold">{labels.recentSignals}</h2>
          <ul className="mt-3 space-y-2">
            {recentSignals.map((signal: WisdomInterventionSignal) => (
              <li
                key={signal.id}
                className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-gray-100 px-3 py-2 text-sm"
              >
                <div>
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-xs ${signalBadgeClass(signal.signal_type)}`}
                  >
                    {signal.signal_type}
                  </span>
                  <p className="mt-1 text-gray-800">{signal.summary}</p>
                </div>
                {signal.user_action ? (
                  <span
                    className={`rounded px-2 py-0.5 text-xs ${actionBadgeClass(signal.user_action)}`}
                  >
                    {signal.user_action}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {activePrompts.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold">{labels.activePrompts}</h2>
          <ul className="mt-3 space-y-2">
            {activePrompts.map((prompt) => (
              <li key={prompt.id ?? prompt.prompt_key} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span className="text-xs font-medium text-gray-500">{prompt.prompt_key}</span>
                <p className="mt-1 text-gray-800">{prompt.message_template}</p>
                {prompt.sleep_on_it ? (
                  <span className="mt-1 inline-block text-xs text-indigo-600">{labels.sleepOnItBadge}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.self_love_note || dashboard.wisdom_engine_note ? (
        <section className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-xs text-gray-600">
          {dashboard.self_love_note ? <p>{dashboard.self_love_note}</p> : null}
          {dashboard.wisdom_engine_note ? <p className="mt-2">{dashboard.wisdom_engine_note}</p> : null}
          {dashboard.trust_note ? <p className="mt-2">{dashboard.trust_note}</p> : null}
        </section>
      ) : null}

      {canManage ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold">{labels.protocolSettings}</h2>
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={sleepOnItEnabled}
                onChange={(e) => setSleepOnItEnabled(e.target.checked)}
              />
              {labels.sleepOnItToggle}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={lateNightNudgeEnabled}
                onChange={(e) => setLateNightNudgeEnabled(e.target.checked)}
              />
              {labels.lateNightToggle}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={capsDetectionEnabled}
                onChange={(e) => setCapsDetectionEnabled(e.target.checked)}
              />
              {labels.capsDetectionToggle}
            </label>
          </div>
          <button
            type="button"
            disabled={savingSettings}
            onClick={() => void saveSettings()}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {savingSettings ? labels.saving : labels.saveSettings}
          </button>
        </section>
      ) : null}

      {Object.keys(integrationLinks).length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold">{labels.integrationLinks}</h2>
          <ul className="mt-3 flex flex-wrap gap-3 text-sm">
            {Object.entries(integrationLinks).map(([key, href]) =>
              typeof href === "string" ? (
                <li key={key}>
                  <Link href={href} className="text-indigo-600 hover:underline">
                    {key.replace(/_/g, " ")}
                  </Link>
                </li>
              ) : null
            )}
          </ul>
        </section>
      ) : null}

      {canExport ? (
        <div>
          <button
            type="button"
            disabled={exporting}
            onClick={() => void exportReport()}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-50"
          >
            {exporting ? labels.exporting : labels.exportReport}
          </button>
        </div>
      ) : null}
    </div>
  );
}
