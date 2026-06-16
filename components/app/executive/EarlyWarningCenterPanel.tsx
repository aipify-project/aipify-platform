"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseOrganizationalEarlyWarningCenter,
  parseSignalBriefingDetail,
  type EarlyWarningMode,
  type OrganizationalEarlyWarningCenter,
  type OrganizationalEarlyWarningLabels,
  type SignalBriefingDetail,
  type WarningSeverity,
  type WarningSignal,
} from "@/lib/organizational-early-warning";

type Props = { labels: OrganizationalEarlyWarningLabels };

const MODES: EarlyWarningMode[] = ["dashboard", "warnings", "trends", "forecasts", "opportunities", "escalation", "queue", "learning"];

const SEVERITY_STYLE: Record<WarningSeverity, string> = {
  informational: "bg-slate-100 text-slate-800",
  monitor: "bg-sky-100 text-sky-900",
  elevated_concern: "bg-amber-100 text-amber-900",
  high_risk: "bg-orange-100 text-orange-900",
  critical_attention_required: "bg-rose-100 text-rose-900",
};

const FORECAST_LABELS: Record<number, keyof OrganizationalEarlyWarningLabels["forecasts"]> = {
  30: "days30",
  60: "days60",
  90: "days90",
  180: "days180",
};

export function EarlyWarningCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<OrganizationalEarlyWarningCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<EarlyWarningMode>("dashboard");
  const [briefing, setBriefing] = useState<SignalBriefingDetail | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/executive/early-warning");
    if (res.ok) setCenter(parseOrganizationalEarlyWarningCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function loadBriefing(id: string) {
    const res = await fetch(`/api/executive/early-warning/briefing/${id}`);
    if (res.ok) setBriefing(parseSignalBriefingDetail(await res.json()));
  }

  async function recordEvent(id: string, eventType: string, description: string) {
    setActingId(id);
    await fetch(`/api/executive/early-warning/event/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_type: eventType, description }),
    });
    setBriefing(null);
    await refresh();
    setActingId(null);
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  if (center?.upgrade_required) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 p-6">
        <h1 className="text-2xl font-bold text-gray-900">{labels.upgradeTitle}</h1>
        <p className="text-gray-600">{labels.upgradeBody}</p>
        <Link href="/app/license" className="inline-block text-sm text-indigo-600 hover:underline">{labels.upgradeCta}</Link>
      </div>
    );
  }

  if (briefing?.found && briefing.briefing) {
    const b = briefing.briefing;
    return (
      <div className="mx-auto max-w-4xl space-y-6 p-6">
        <button type="button" onClick={() => setBriefing(null)} className="text-sm font-medium text-indigo-600 hover:underline">
          ← {labels.briefing.back}
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{briefing.title ?? labels.briefing.title}</h1>
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">{labels.humanOversight}</p>
        <section className="rounded-2xl border border-amber-200 bg-amber-50/40 p-6 space-y-4 text-sm">
          <BriefRow label={labels.briefing.whatChanged} value={b.what_changed} />
          <BriefRow label={labels.briefing.whyImportant} value={b.why_important} />
          <BriefRow label={labels.briefing.whatNext} value={b.what_may_happen_next} />
          <div>
            <p className="font-medium text-amber-950">{labels.briefing.responseOptions}</p>
            <ul className="mt-1 list-inside list-disc">{b.response_options.map((o) => <li key={o}>{o}</li>)}</ul>
          </div>
          <p className="font-medium">{labels.briefing.urgency}: {labels.warnings.severities[b.urgency_level as WarningSeverity] ?? b.urgency_level}</p>
          <p className="text-xs text-amber-800">{labels.warnings.disclaimer}</p>
        </section>
        {briefing.signal_id ? (
          <div className="flex flex-wrap gap-2">
            <ActionButton disabled={actingId === briefing.signal_id} onClick={() => recordEvent(briefing.signal_id!, "signal_acknowledged", "Signal acknowledged")} label={labels.warnings.acknowledge} />
            <ActionButton disabled={actingId === briefing.signal_id} onClick={() => recordEvent(briefing.signal_id!, "signal_escalated", "Signal escalated to leadership")} label={labels.warnings.escalate} />
            <ActionButton disabled={actingId === briefing.signal_id} onClick={() => recordEvent(briefing.signal_id!, "signal_dismissed", "Signal dismissed with rationale")} label={labels.warnings.dismiss} />
          </div>
        ) : null}
      </div>
    );
  }

  const dash = center?.dashboard;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <Link href="/app/executive" className="text-sm text-indigo-600 hover:underline">← {labels.executiveLink}</Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">{labels.humanOversight}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link href="/app/executive/strategic-decision-cockpit" className="text-indigo-600 hover:underline">{labels.cockpitLink}</Link>
          <Link href="/app/executive/board-investor-intelligence" className="text-indigo-600 hover:underline">{labels.boardInvestorIntelligenceLink}</Link>
          <Link href="/app/executive/transformation-change-center" className="text-indigo-600 hover:underline">{labels.transformationChangeCenterLink}</Link>
          <Link href="/app/action-center" className="text-indigo-600 hover:underline">{labels.actionCenterLink}</Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 rounded-xl border border-gray-200 p-0.5 text-sm">
        {MODES.map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)} className={`rounded-lg px-3 py-1.5 ${mode === m ? "bg-indigo-600 text-white" : "text-gray-600"}`}>
            {labels.tabs[m]}
          </button>
        ))}
      </div>

      {mode === "dashboard" && dash ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/30 p-5">
          <h2 className="font-semibold text-amber-950">{labels.dashboard.title}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <Metric label={labels.dashboard.emergingRisks} value={dash.emerging_risks} />
            <Metric label={labels.dashboard.escalatingBottlenecks} value={dash.escalating_bottlenecks} />
            <Metric label={labels.dashboard.losingMomentum} value={dash.losing_momentum} />
            <Metric label={labels.dashboard.teamOverload} value={dash.team_overload_signals} />
            <Metric label={labels.dashboard.customerDeterioration} value={dash.customer_deterioration_signals} />
            <Metric label={labels.dashboard.complianceWarnings} value={dash.compliance_warnings} />
            <Metric label={labels.dashboard.revenueWarnings} value={dash.revenue_trend_warnings} />
          </dl>
        </section>
      ) : null}

      {mode === "warnings" ? (
        <WarningsSection warnings={center?.warnings ?? []} labels={labels} onBriefing={(id) => void loadBriefing(id)} onEvent={recordEvent} actingId={actingId} />
      ) : null}

      {mode === "trends" ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="font-semibold text-gray-900">{labels.trends.title}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {(center?.predictive_trends ?? []).map((t) => (
              <li key={t.trend} className="flex justify-between rounded-lg bg-gray-50 px-3 py-2">
                <span className="font-medium capitalize">{t.trend.replace(/_/g, " ")}</span>
                <span>{t.detected ? labels.trends.detected : labels.trends.notDetected} · {labels.trends.count}: {t.count}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {mode === "forecasts" && center?.forecasts ? (
        <section className="rounded-2xl border border-violet-200 bg-violet-50/30 p-5">
          <h2 className="font-semibold text-violet-950">{labels.forecasts.title}</h2>
          <p className="mt-2 text-sm text-violet-800">{center.forecasts.disclaimer}</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {center.forecasts.periods.map((p) => (
              <li key={p.days} className="rounded-xl border border-violet-100 bg-white p-4 text-sm">
                <p className="font-medium">{labels.forecasts[FORECAST_LABELS[p.days] ?? "days30"]}</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">{p.health_score_estimate}</p>
                <p className="text-xs text-gray-500 capitalize">{p.risk_level} risk</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-violet-700">{labels.forecasts.factors}: {center.forecasts.factors.join(", ")}</p>
        </section>
      ) : null}

      {mode === "opportunities" ? (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5">
          <h2 className="font-semibold text-emerald-950">{labels.opportunities.title}</h2>
          {(center?.opportunities?.length ?? 0) === 0 ? (
            <p className="mt-3 text-sm text-gray-500">{labels.opportunities.empty}</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {center!.opportunities!.map((o) => (
                <li key={o.id} className="rounded-lg bg-white/70 px-3 py-2">
                  <p className="font-medium">{o.title}</p>
                  <p className="text-emerald-800">{labels.opportunities.types[o.type] ?? o.type}</p>
                  <p className="text-gray-600">{o.description}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {mode === "escalation" ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="font-semibold text-gray-900">{labels.escalation.title}</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {(center?.escalation_rules ?? []).map((r) => (
              <li key={r.rule} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <p className="font-medium capitalize">{r.rule.replace(/_/g, " ")}</p>
                <p className="text-gray-600">{r.description}</p>
                <p className="mt-1 text-xs">{labels.escalation.threshold}: {r.threshold} · {labels.escalation.enabled}: {r.enabled ? "Yes" : "No"}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {mode === "queue" ? (
        <section className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-5">
          <h2 className="font-semibold text-indigo-950">{labels.queue.title}</h2>
          {(center?.attention_queue?.length ?? 0) === 0 ? (
            <p className="mt-3 text-sm text-gray-500">{labels.queue.empty}</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {center!.attention_queue!.map((q) => (
                <li key={q.id} className="flex items-center justify-between rounded-xl bg-white/70 px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">{q.title}</p>
                    <p className="text-xs text-gray-600">{labels.queue.reviewTimeline}: {q.review_timeline}</p>
                  </div>
                  <button type="button" onClick={() => void loadBriefing(q.id)} className="text-xs text-indigo-600 hover:underline">{labels.warnings.viewBriefing}</button>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {mode === "learning" && center?.learning_insights ? (
        <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5 text-sm">
          <h2 className="font-semibold text-violet-950">{labels.learning.title}</h2>
          <dl className="mt-3 space-y-2">
            <div><dt className="font-medium">{labels.learning.accuracy}</dt><dd>{center.learning_insights.accuracy_estimate}%</dd></div>
            <div><dt className="font-medium">{labels.learning.falsePositives}</dt><dd>{center.learning_insights.false_positive_rate_estimate}% estimated</dd></div>
            <div><dt className="font-medium">{labels.learning.responseEffectiveness}</dt><dd>{center.learning_insights.response_effectiveness}</dd></div>
            <div><dt className="font-medium">{labels.learning.forecastReliability}</dt><dd>{center.learning_insights.forecast_reliability}</dd></div>
          </dl>
        </section>
      ) : null}

      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="font-semibold text-gray-900">{labels.faq.title}</h2>
        <dl className="mt-3 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.canPredict}</dt><dd className="mt-1 text-gray-600">{labels.faq.canPredictAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.howRespond}</dt><dd className="mt-1 text-gray-600">{labels.faq.howRespondAnswer}</dd></div>
        </dl>
        <p className="mt-4 text-sm font-medium text-indigo-800">{labels.principle}</p>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-amber-800">{label}</dt>
      <dd className="text-2xl font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

function BriefRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-medium text-amber-950">{label}</p>
      <p className="mt-1 text-gray-800">{value}</p>
    </div>
  );
}

function ActionButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled: boolean }) {
  return (
    <button type="button" disabled={disabled} onClick={() => void onClick()} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs hover:bg-gray-50 disabled:opacity-50">
      {label}
    </button>
  );
}

function WarningsSection({
  warnings,
  labels,
  onBriefing,
  onEvent,
  actingId,
}: {
  warnings: WarningSignal[];
  labels: OrganizationalEarlyWarningLabels;
  onBriefing: (id: string) => void;
  onEvent: (id: string, type: string, desc: string) => Promise<void>;
  actingId: string | null;
}) {
  if (warnings.length === 0) return <p className="text-sm text-gray-500">{labels.warnings.empty}</p>;
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">{labels.warnings.title}</h2>
      {warnings.map((w) => (
        <article key={w.id} className="rounded-2xl border border-gray-200 bg-white p-5 text-sm">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-medium text-gray-900">{w.title}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-900">{labels.warnings.categories[w.category]}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${SEVERITY_STYLE[w.severity]}`}>{labels.warnings.severities[w.severity]}</span>
              </div>
            </div>
            <button type="button" onClick={() => onBriefing(w.id)} className="text-xs text-indigo-600 hover:underline">{labels.warnings.viewBriefing}</button>
          </div>
          <p className="mt-2 text-gray-600">{w.reasoning}</p>
          <p className="mt-1 text-xs text-gray-500">{labels.warnings.confidence}: {w.confidence_score} — {labels.warnings.disclaimer}</p>
          <div className="mt-3 flex gap-2">
            <ActionButton disabled={actingId === w.id} onClick={() => onEvent(w.id, "signal_acknowledged", "Acknowledged")} label={labels.warnings.acknowledge} />
            <ActionButton disabled={actingId === w.id} onClick={() => onEvent(w.id, "signal_escalated", "Escalated")} label={labels.warnings.escalate} />
          </div>
        </article>
      ))}
    </section>
  );
}
