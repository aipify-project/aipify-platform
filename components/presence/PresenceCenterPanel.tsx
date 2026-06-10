"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AipifyPulse } from "@/components/branding";
import { parseActionCenterDashboard, type ActionCenterDashboard } from "@/lib/platform/action-engine";
import { createClient } from "@/lib/supabase/client";
import {
  getBriefingSeverityStyle,
  getBriefingSeverityText,
} from "@/lib/presence/daily-briefing";
import {
  formatPresenceTime,
  getImpactBadgeStyle,
  getPresenceAnimationClass,
  getPresenceGlowClass,
  getPresenceMode,
  parsePresenceEventMetadata,
  type PresenceEvent,
  type PresenceRecommendation,
  type RecommendationImpactLevel,
} from "@/lib/presence/presence-engine";
import { usePresence, type PresenceLabels } from "./PresenceProvider";

export default function PresenceCenterPanel() {
  const { bundle, loading, open, setOpen, labels, updateSettings, locale, surface } = usePresence();
  const [saved, setSaved] = useState(false);
  const [approvalExpanded, setApprovalExpanded] = useState(true);
  const [actionDashboard, setActionDashboard] = useState<ActionCenterDashboard | null>(null);

  useEffect(() => {
    if (!open || surface !== "platform") return;
    let cancelled = false;
    async function loadActions() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_action_center_dashboard");
      if (!cancelled && !error && data) {
        setActionDashboard(parseActionCenterDashboard(data));
      }
    }
    void loadActions();
    return () => {
      cancelled = true;
    };
  }, [open, surface]);

  if (!open) return null;

  const isExecutive = bundle.settings.view_mode === "executive";
  const mode = getPresenceMode(bundle.state);
  const animationClass = getPresenceAnimationClass(bundle.state);
  const glowClass = getPresenceGlowClass(bundle.state);

  async function handleSettingChange(
    key: keyof typeof bundle.settings,
    value: boolean | string
  ) {
    await updateSettings({ [key]: value } as Partial<typeof bundle.settings>);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  const healthDeltaLabel =
    bundle.health_trend.delta_week > 0
      ? labels.health.deltaUp.replace("{delta}", String(Math.abs(bundle.health_trend.delta_week)))
      : bundle.health_trend.delta_week < 0
        ? labels.health.deltaDown.replace("{delta}", String(bundle.health_trend.delta_week))
        : labels.health.deltaFlat;

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
            <div className={`relative rounded-xl border border-violet-100 bg-white p-1.5 ${animationClass}`}>
              <span
                className={`pointer-events-none absolute inset-0.5 rounded-lg bg-gradient-to-br ${glowClass} blur-sm`}
                aria-hidden="true"
              />
              <AipifyPulse
                size="sm"
                variant="gradient"
                title={labels.centerTitle}
                aria-label={labels.centerTitle}
                className="relative"
              />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">{labels.centerTitle}</h2>
              <p className="text-xs text-gray-500">{labels.modes[mode]}</p>
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
              <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/60 to-white p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-violet-700">{labels.today}</p>
                <ul className="mt-3 space-y-1.5 text-sm text-gray-800">
                  <li>{labels.snapshot.environments.replace("{count}", String(bundle.snapshot.environments_monitored))}</li>
                  <li>{labels.snapshot.learning.replace("{count}", String(bundle.snapshot.learning_events_today))}</li>
                  <li>{labels.snapshot.healing.replace("{count}", String(bundle.snapshot.healing_completed_today))}</li>
                  {bundle.snapshot.recommendations_pending > 0 ? (
                    <li className="font-medium text-amber-800">
                      {labels.snapshot.pending.replace("{count}", String(bundle.snapshot.recommendations_pending))}
                    </li>
                  ) : null}
                </ul>
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {labels.health.title}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">{bundle.health_trend.score}%</p>
                    <p className={`mt-1 text-xs font-medium ${bundle.health_trend.delta_week >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {healthDeltaLabel}
                    </p>
                  </div>
                </div>
                {bundle.health_trend.contributors.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-gray-500">{labels.health.contributors}</p>
                    <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-gray-600">
                      {bundle.health_trend.contributors.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>

              {bundle.daily_briefing && bundle.settings.executive_summaries && (
                <section
                  className={`rounded-2xl border p-4 shadow-sm ${getBriefingSeverityStyle(bundle.daily_briefing.primary.severity)}`}
                >
                  <h3 className={`text-xs font-semibold uppercase tracking-wide ${getBriefingSeverityText(bundle.daily_briefing.primary.severity)}`}>
                    {labels.briefing.title}
                  </h3>
                  <p className={`mt-2 text-sm font-semibold ${getBriefingSeverityText(bundle.daily_briefing.primary.severity)}`}>
                    {bundle.daily_briefing.primary.title}
                  </p>
                  <p className={`mt-2 text-sm leading-relaxed ${getBriefingSeverityText(bundle.daily_briefing.primary.severity)} opacity-90`}>
                    {bundle.daily_briefing.primary.body}
                  </p>
                  {bundle.daily_briefing.secondary.length > 0 && (
                    <ul className="mt-3 space-y-1.5 border-t border-white/50 pt-3 text-xs opacity-85">
                      {bundle.daily_briefing.secondary.map((msg) => (
                        <li key={msg.message_key ?? msg.title} className={getBriefingSeverityText("info")}>
                          {msg.body}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-3 text-xs font-medium opacity-75">{bundle.daily_briefing.promise}</p>
                  <p className="mt-1 text-xs opacity-60">{bundle.daily_briefing.always_on}</p>
                </section>
              )}

              <section className="rounded-2xl border border-gray-100 bg-gray-50/80 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.modes.title}</p>
                <p className="mt-1 text-sm font-medium text-gray-900">{labels.states[bundle.state]}</p>
                <p className="mt-1 text-xs text-gray-600">{labels.stateMessages[bundle.state]}</p>
              </section>

              {actionDashboard && surface === "platform" && (
                <section className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                      {labels.sections.actions}
                    </h3>
                    <Link
                      href="/platform/actions"
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                    >
                      {labels.actions.openCenter}
                    </Link>
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-gray-800">
                    {actionDashboard.metrics.pending > 0 && (
                      <li>{labels.actions.pending.replace("{count}", String(actionDashboard.metrics.pending))}</li>
                    )}
                    {actionDashboard.metrics.executed > 0 && (
                      <li>{labels.actions.executed.replace("{count}", String(actionDashboard.metrics.executed))}</li>
                    )}
                    {actionDashboard.metrics.failed > 0 && (
                      <li>{labels.actions.failed.replace("{count}", String(actionDashboard.metrics.failed))}</li>
                    )}
                  </ul>
                </section>
              )}

              {bundle.approval_context && (
                <section className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4">
                  <button
                    type="button"
                    onClick={() => setApprovalExpanded((value) => !value)}
                    className="flex w-full items-center justify-between text-left"
                  >
                    <span className="text-sm font-semibold text-amber-900">{labels.approval.whyTitle}</span>
                    <span className="text-xs text-amber-700">{approvalExpanded ? "−" : "+"}</span>
                  </button>
                  {approvalExpanded && (
                    <div className="mt-3 space-y-3 text-sm text-amber-950/90">
                      <p>
                        {labels.approval.whyBody.replace(
                          "{risk}",
                          bundle.approval_context.risk_level
                        )}
                      </p>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                          {labels.approval.reasonsTitle}
                        </p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-5 text-xs">
                          {bundle.approval_context.reasons.map((reason) => (
                            <li key={reason}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </section>
              )}

              {!isExecutive && (
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
              )}

              {!isExecutive && (
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.sections.activities}
                  </h3>
                  <dl className="mt-3 grid grid-cols-2 gap-3">
                    <Metric label={labels.metrics.automationsRunning} value={String(bundle.metrics.automations_running)} />
                    <Metric label={labels.metrics.learningToday} value={String(bundle.metrics.learning_events_today)} />
                    <Metric label={labels.metrics.healingToday} value={String(bundle.metrics.healing_events_today)} />
                    <Metric label={labels.metrics.pendingApprovals} value={String(bundle.metrics.pending_approvals)} />
                  </dl>
                </section>
              )}

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {labels.sections.recommendations}
                </h3>
                {bundle.recommendations.length === 0 ? (
                  <p className="mt-2 text-sm text-gray-500">{labels.empty.recommendations}</p>
                ) : (
                  <ul className="mt-2 space-y-3">
                    {bundle.recommendations.map((rec) => (
                      <RecommendationCard key={rec.id} rec={rec} labels={labels} executive={isExecutive} />
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
                      <HistoryItem
                        key={event.id}
                        event={event}
                        locale={locale}
                        labels={labels}
                        executive={isExecutive}
                      />
                    ))}
                  </ul>
                )}
              </section>

              {bundle.executive_summary && bundle.settings.executive_summaries && (
                <section className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.sections.executiveSummary}
                  </h3>
                  <p className="mt-2 text-sm text-gray-700">{bundle.executive_summary}</p>
                </section>
              )}

              <section className="rounded-2xl border border-gray-200 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {labels.viewMode.title}
                </h3>
                <div className="mt-3 flex gap-2">
                  {(["executive", "operations"] as const).map((modeKey) => (
                    <button
                      key={modeKey}
                      type="button"
                      onClick={() => void handleSettingChange("view_mode", modeKey)}
                      className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                        bundle.settings.view_mode === modeKey
                          ? "bg-violet-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {labels.viewMode[modeKey]}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {isExecutive ? labels.viewMode.executiveHint : labels.viewMode.operationsHint}
                </p>
              </section>

              <section className="rounded-2xl border border-gray-200 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {labels.sections.settings}
                </h3>
                <div className="mt-3 space-y-3 text-sm">
                  <label className="flex items-center justify-between gap-3">
                    <span>{labels.settings.animationMode}</span>
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
                  <label className="flex items-center justify-between gap-3">
                    <span>{labels.settings.soundMode}</span>
                    <select
                      value={bundle.settings.sound_mode}
                      onChange={(e) => void handleSettingChange("sound_mode", e.target.value)}
                      className="rounded-lg border border-gray-200 px-2 py-1 text-xs"
                    >
                      {Object.entries(labels.settings.soundModes).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {labels.sections.notifications}
                </h4>
                <div className="mt-3 space-y-3 text-sm">
                  {(
                    [
                      ["presence_visible", labels.settings.presenceVisible],
                      ["executive_summaries", labels.settings.executiveSummaries],
                      ["self_healing_notifications", labels.settings.selfHealingNotifications],
                      ["approval_notifications", labels.settings.approvalNotifications],
                      ["learning_notifications", labels.settings.learningNotifications],
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

                <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {labels.briefing.categories}
                </h4>
                <div className="mt-3 space-y-3 text-sm">
                  {(
                    [
                      ["briefing_morning_enabled", labels.briefing.morning],
                      ["briefing_evening_enabled", labels.briefing.evening],
                      ["briefing_weekend_enabled", labels.briefing.weekend],
                      ["briefing_positive_enabled", labels.briefing.positiveCategory],
                      ["briefing_attention_enabled", labels.briefing.attention],
                      ["briefing_critical_enabled", labels.briefing.critical],
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
                <p className="mt-2 text-xs text-gray-500">{labels.briefing.criticalNote}</p>

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

function RecommendationCard({
  rec,
  labels,
  executive,
}: {
  rec: PresenceRecommendation;
  labels: PresenceLabels;
  executive: boolean;
}) {
  const impact = (rec.impact_level ?? "medium") as RecommendationImpactLevel;

  return (
    <li className="rounded-xl border border-gray-100 bg-gray-50/80 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-sm font-medium text-gray-900">{rec.message}</p>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${getImpactBadgeStyle(impact)}`}
        >
          {labels.impact[impact]}
        </span>
      </div>
      <dl className="mt-3 space-y-2 text-xs text-gray-600">
        {rec.what_happened && (
          <div>
            <dt className="font-semibold text-gray-700">{labels.recommendations.whatHappened}</dt>
            <dd className="mt-0.5">{rec.what_happened}</dd>
          </div>
        )}
        {rec.why_matters && (
          <div>
            <dt className="font-semibold text-gray-700">{labels.recommendations.whyMatters}</dt>
            <dd className="mt-0.5">{rec.why_matters}</dd>
          </div>
        )}
        {rec.suggested_action && (
          <div>
            <dt className="font-semibold text-gray-700">{labels.recommendations.suggestedAction}</dt>
            <dd className="mt-0.5">{rec.suggested_action}</dd>
          </div>
        )}
        {rec.if_ignored && (
          <div>
            <dt className="font-semibold text-gray-700">{labels.recommendations.ifIgnored}</dt>
            <dd className="mt-0.5">{rec.if_ignored}</dd>
          </div>
        )}
      </dl>
      {!executive && (
        <p className="mt-2 text-[10px] text-gray-400">{rec.confidence}% confidence</p>
      )}
    </li>
  );
}

function HistoryItem({
  event,
  locale,
  labels,
  executive,
}: {
  event: PresenceEvent;
  locale: string;
  labels: PresenceLabels;
  executive: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = parsePresenceEventMetadata(event);
  const hasDetails = Boolean(meta.trigger || meta.actions?.length || meta.outcome || event.detail);

  return (
    <li className="rounded-lg border border-gray-100 bg-white px-3 py-2">
      <div className="flex gap-3 text-sm">
        <span className="w-12 shrink-0 font-mono text-xs text-gray-400">
          {formatPresenceTime(event.created_at, locale)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-gray-800">{event.title}</p>
          {hasDetails && !executive && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="mt-1 text-xs font-semibold text-violet-600 hover:text-violet-800"
            >
              {expanded ? labels.history.hideDetails : labels.history.viewDetails}
            </button>
          )}
          {expanded && !executive && (
            <dl className="mt-2 space-y-1.5 text-xs text-gray-600">
              {meta.trigger && (
                <div>
                  <dt className="font-semibold text-gray-700">{labels.history.trigger}</dt>
                  <dd>{meta.trigger}</dd>
                </div>
              )}
              {meta.actions && meta.actions.length > 0 && (
                <div>
                  <dt className="font-semibold text-gray-700">{labels.history.actions}</dt>
                  <dd>
                    <ul className="mt-0.5 list-disc pl-4">
                      {meta.actions.map((action) => (
                        <li key={action}>{action}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
              {meta.outcome && (
                <div>
                  <dt className="font-semibold text-gray-700">{labels.history.outcome}</dt>
                  <dd>{meta.outcome}</dd>
                </div>
              )}
              {!meta.trigger && event.detail && (
                <div>
                  <dt className="font-semibold text-gray-700">{labels.history.outcome}</dt>
                  <dd>{event.detail}</dd>
                </div>
              )}
            </dl>
          )}
        </div>
      </div>
    </li>
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
