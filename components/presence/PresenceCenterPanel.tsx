"use client";

import { useState } from "react";
import { AipifyPulse } from "@/components/branding";
import { formatPresenceTime } from "@/lib/presence/presence-engine";
import { usePresence } from "./PresenceProvider";

export default function PresenceCenterPanel() {
  const { bundle, loading, open, setOpen, labels, updateSettings } = usePresence();
  const [saved, setSaved] = useState(false);

  if (!open) return null;

  async function handleSettingChange(
    key: keyof typeof bundle.settings,
    value: boolean | string
  ) {
    await updateSettings({ [key]: value } as Partial<typeof bundle.settings>);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-40">
      <button
        type="button"
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-[1px]"
        aria-label={labels.close}
        onClick={() => setOpen(false)}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <AipifyPulse
              size="sm"
              variant="gradient"
              title={labels.centerTitle}
              aria-label={labels.centerTitle}
            />
            <div>
              <h2 className="text-base font-semibold text-gray-900">{labels.centerTitle}</h2>
              <p className="text-xs text-gray-500">
                {labels.states[bundle.state] ?? bundle.state}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            aria-label={labels.close}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <p className="text-sm text-gray-500">{labels.loading}</p>
          ) : (
            <div className="space-y-6">
              <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                  {labels.currentState}
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {labels.states[bundle.state]}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {labels.stateMessages[bundle.state]}
                </p>
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {labels.currentActivity}
                </p>
                <p className="mt-2 font-medium text-gray-900">{bundle.activity.title}</p>
                <dl className="mt-3 grid grid-cols-2 gap-3 text-xs text-gray-600">
                  <div>
                    <dt>{labels.status}</dt>
                    <dd className="font-semibold text-gray-800">{bundle.activity.status}</dd>
                  </div>
                  <div>
                    <dt>{labels.riskLevel}</dt>
                    <dd className="font-semibold text-gray-800">{bundle.activity.risk_level}</dd>
                  </div>
                  {bundle.activity.eta_seconds != null && (
                    <div className="col-span-2">
                      <dt>{labels.estimatedCompletion}</dt>
                      <dd className="font-semibold text-gray-800">
                        {bundle.activity.eta_seconds} {labels.seconds}
                      </dd>
                    </div>
                  )}
                </dl>
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {labels.sections.activities}
                </h3>
                <dl className="mt-3 grid grid-cols-2 gap-3">
                  <Metric label={labels.metrics.automationsRunning} value={String(bundle.metrics.automations_running)} />
                  <Metric label={labels.metrics.learningToday} value={String(bundle.metrics.learning_events_today)} />
                  <Metric label={labels.metrics.healingToday} value={String(bundle.metrics.healing_events_today)} />
                  <Metric label={labels.metrics.pendingApprovals} value={String(bundle.metrics.pending_approvals)} />
                  <Metric label={labels.metrics.systemHealth} value={`${bundle.metrics.system_health_score}%`} />
                </dl>
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {labels.sections.recommendations}
                </h3>
                {bundle.recommendations.length === 0 ? (
                  <p className="mt-2 text-sm text-gray-500">{labels.empty.recommendations}</p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {bundle.recommendations.map((rec) => (
                      <li key={rec.id} className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
                        {rec.message}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {labels.sections.history}
                </h3>
                {bundle.history.length === 0 ? (
                  <p className="mt-2 text-sm text-gray-500">{labels.empty.history}</p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {bundle.history.map((event) => (
                      <li key={event.id} className="flex gap-3 text-sm">
                        <span className="w-12 shrink-0 font-mono text-xs text-gray-400">
                          {formatPresenceTime(event.created_at, "en")}
                        </span>
                        <span className="text-gray-700">{event.title}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {bundle.executive_summary && (
                <section className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.sections.executiveSummary}
                  </h3>
                  <p className="mt-2 text-sm text-gray-700">{bundle.executive_summary}</p>
                </section>
              )}

              <section className="rounded-2xl border border-gray-200 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {labels.sections.settings}
                </h3>
                <div className="mt-3 space-y-3 text-sm">
                  <label className="flex items-center justify-between gap-3">
                    <span>{labels.settings.animationIntensity}</span>
                    <select
                      value={bundle.settings.animation_intensity}
                      onChange={(e) => void handleSettingChange("animation_intensity", e.target.value)}
                      className="rounded-lg border border-gray-200 px-2 py-1 text-xs"
                    >
                      {Object.entries(labels.settings.intensities).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  {(
                    [
                      ["presence_visible", labels.settings.presenceVisible],
                      ["executive_summaries", labels.settings.executiveSummaries],
                      ["self_healing_notifications", labels.settings.selfHealingNotifications],
                      ["approval_notifications", labels.settings.approvalNotifications],
                      ["sound_enabled", labels.settings.soundEnabled],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key} className="flex items-center justify-between gap-3">
                      <span>{label}</span>
                      <input
                        type="checkbox"
                        checked={bundle.settings[key]}
                        onChange={(e) => void handleSettingChange(key, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-violet-600"
                      />
                    </label>
                  ))}
                </div>
                {saved && (
                  <p className="mt-3 text-xs font-medium text-emerald-600">{labels.settings.saved}</p>
                )}
              </section>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3">
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="mt-1 text-lg font-bold text-gray-900">{value}</dd>
    </div>
  );
}
