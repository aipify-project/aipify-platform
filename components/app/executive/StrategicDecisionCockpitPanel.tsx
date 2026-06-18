"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseExecutiveBriefingDetail,
  parseExecutiveStrategicDecisionCockpit,
  type CockpitMode,
  type DecisionQueueItem,
  type ExecutiveBriefingDetail,
  type ExecutiveStrategicDecisionCockpit,
  type ExecutiveStrategicDecisionCockpitLabels,
  type HealthIndicator,
  type OrgHealthStatus,
} from "@/lib/executive-strategic-decision-cockpit";

type Props = { labels: ExecutiveStrategicDecisionCockpitLabels };

const MODES: CockpitMode[] = ["overview", "decisions", "health", "alerts", "opportunities", "meeting", "insights"];

const HEALTH_STYLE: Record<OrgHealthStatus, string> = {
  excellent: "bg-emerald-100 text-emerald-900",
  healthy: "bg-sky-100 text-sky-900",
  monitor_closely: "bg-amber-100 text-amber-900",
  needs_attention: "bg-orange-100 text-orange-900",
  critical: "bg-rose-100 text-rose-900",
};

export function StrategicDecisionCockpitPanel({ labels }: Props) {
  const [cockpit, setCockpit] = useState<ExecutiveStrategicDecisionCockpit | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<CockpitMode>("overview");
  const [briefing, setBriefing] = useState<ExecutiveBriefingDetail | null>(null);
  const [briefingId, setBriefingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/executive/strategic-decision-cockpit");
    if (res.ok) setCockpit(parseExecutiveStrategicDecisionCockpit(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function loadBriefing(id: string) {
    setBriefingId(id);
    const res = await fetch(`/api/executive/strategic-decision-cockpit/briefing/${id}`);
    if (res.ok) setBriefing(parseExecutiveBriefingDetail(await res.json()));
  }

  function clearBriefing() {
    setBriefingId(null);
    setBriefing(null);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  if (cockpit?.upgrade_required) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 p-6">
        <h1 className="text-2xl font-bold text-gray-900">{labels.upgradeTitle}</h1>
        <p className="text-gray-600">{labels.upgradeBody}</p>
        <Link href="/app/license" className="inline-block text-sm text-indigo-600 hover:underline">
          {labels.upgradeCta}
        </Link>
      </div>
    );
  }

  if (briefingId && briefing?.found && briefing.briefing) {
    const b = briefing.briefing;
    return (
      <div className="mx-auto max-w-4xl space-y-6 p-6">
        <button type="button" onClick={clearBriefing} className="text-sm font-medium text-indigo-600 hover:underline">
          ← {labels.briefing.back}
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{briefing.title ?? labels.briefing.title}</h1>
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">{labels.humanOversight}</p>
        <section className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-6 space-y-4">
          <BriefingRow label={labels.briefing.situation} value={b.situation} />
          <BriefingRow label={labels.briefing.context} value={b.context} />
          <BriefingRow label={labels.briefing.recommendation} value={b.recommendation} highlight />
          <BriefingRow label={labels.briefing.benefits} value={b.benefits} />
          <BriefingRow label={labels.briefing.risks} value={b.risks} />
          <div>
            <p className="text-sm font-medium text-indigo-900">{labels.briefing.alternatives}</p>
            <ul className="mt-1 list-inside list-disc text-sm text-gray-800">{b.alternatives.map((a) => <li key={a}>{a}</li>)}</ul>
          </div>
          <div>
            <p className="text-sm font-medium text-indigo-900">{labels.briefing.recommendedActions}</p>
            <ul className="mt-1 list-inside list-disc text-sm text-gray-800">{b.recommended_actions.map((a) => <li key={a}>{a}</li>)}</ul>
          </div>
          <p className="text-sm">
            {labels.briefing.confidence}: {b.confidence_score} — {labels.briefing.disclaimer}
          </p>
          <p className="text-sm font-medium">
            {labels.briefing.urgency}: {labels.briefing.urgencies[b.decision_urgency]}
          </p>
        </section>
        <div className="flex gap-4 text-sm">
          <Link href="/app/action-center" className="text-indigo-600 hover:underline">{labels.actionCenterLink}</Link>
          <Link href="/app/executive/early-warning-center" className="text-indigo-600 hover:underline">{labels.earlyWarningLink}</Link>
          <Link href="/app/executive/board-investor-intelligence" className="text-indigo-600 hover:underline">{labels.boardInvestorIntelligenceLink}</Link>
          <Link href="/app/executive/transformation-change-center" className="text-indigo-600 hover:underline">{labels.transformationChangeCenterLink}</Link>
        </div>
      </div>
    );
  }

  const ov = cockpit?.overview;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <Link href="/app/executive" className="text-sm text-indigo-600 hover:underline">
          ← {labels.executiveLink}
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">{labels.humanOversight}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link href="/app/action-center" className="text-indigo-600 hover:underline">{labels.actionCenterLink}</Link>
          <Link href="/app/executive/early-warning-center" className="text-indigo-600 hover:underline">{labels.earlyWarningLink}</Link>
          <Link href="/app/executive/board-investor-intelligence" className="text-indigo-600 hover:underline">{labels.boardInvestorIntelligenceLink}</Link>
          <Link href="/app/executive/transformation-change-center" className="text-indigo-600 hover:underline">{labels.transformationChangeCenterLink}</Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 rounded-xl border border-gray-200 p-0.5 text-sm">
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-lg px-3 py-1.5 ${mode === m ? "bg-indigo-600 text-white" : "text-gray-600"}`}
          >
            {labels.tabs[m]}
          </button>
        ))}
      </div>

      {mode === "overview" && ov ? (
        <section className="rounded-2xl border border-violet-200 bg-violet-50/40 p-5">
          <h2 className="font-semibold text-violet-950">{labels.overview.title}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <Metric label={labels.overview.onTrack} value={ov.initiatives_on_track} />
            <Metric label={labels.overview.atRisk} value={ov.initiatives_at_risk} />
            <Metric label={labels.overview.criticalDecisions} value={ov.critical_decisions_pending} />
            <Metric label={labels.overview.highImpactOpportunities} value={ov.high_impact_opportunities} />
            <Metric label={labels.overview.escalatedApprovals} value={ov.escalated_approvals} />
            <Metric label={labels.overview.actionQueue} value={ov.executive_action_queue_count} />
            <div className="sm:col-span-2">
              <dt className="text-violet-800">{labels.overview.orgHealth}</dt>
              <dd className="mt-1 flex items-center gap-2">
                <span className="text-2xl font-semibold tabular-nums">{ov.organization_health_score}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${HEALTH_STYLE[ov.organization_health_status]}`}>
                  {labels.health.statuses[ov.organization_health_status]}
                </span>
              </dd>
            </div>
          </dl>
        </section>
      ) : null}

      {mode === "decisions" && cockpit?.decision_queue ? (
        <DecisionQueueSection queue={cockpit.decision_queue} labels={labels} onBriefing={(id) => void loadBriefing(id)} />
      ) : null}

      {mode === "health" && cockpit?.organization_health ? (
        <HealthSection health={cockpit.organization_health} labels={labels} />
      ) : null}

      {mode === "alerts" ? (
        <section className="rounded-2xl border border-rose-200 bg-rose-50/30 p-5">
          <h2 className="font-semibold text-rose-950">{labels.alerts.title}</h2>
          {(cockpit?.executive_alerts?.length ?? 0) === 0 ? (
            <p className="mt-3 text-sm text-gray-500">{labels.alerts.empty}</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {cockpit!.executive_alerts!.map((alert) => (
                <li key={alert.id} className="flex items-center justify-between rounded-xl bg-white/70 px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{alert.title}</p>
                    <p className="text-gray-600">{alert.message}</p>
                  </div>
                  {alert.action_id ? (
                    <button type="button" onClick={() => void loadBriefing(alert.action_id!)} className="text-xs text-indigo-600 hover:underline">
                      {labels.alerts.viewAction}
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {mode === "opportunities" ? (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5">
          <h2 className="font-semibold text-emerald-950">{labels.opportunities.title}</h2>
          {(cockpit?.opportunities?.length ?? 0) === 0 ? (
            <p className="mt-3 text-sm text-gray-500">{labels.opportunities.empty}</p>
          ) : (
            <ul className="mt-3 grid gap-3 lg:grid-cols-2">
              {cockpit!.opportunities!.map((opp) => (
                <li key={opp.id} className="rounded-xl border border-emerald-100 bg-white p-4 text-sm">
                  <p className="font-medium text-gray-900">{opp.title}</p>
                  <p className="mt-1 text-xs text-emerald-800">{labels.opportunities.types[opp.type]}</p>
                  <dl className="mt-2 space-y-1 text-xs text-gray-600">
                    <div><dt className="inline font-medium">{labels.opportunities.expectedBenefit}: </dt><dd className="inline">{opp.expected_benefit}</dd></div>
                    <div><dt className="inline font-medium">{labels.opportunities.estimatedEffort}: </dt><dd className="inline capitalize">{opp.estimated_effort}</dd></div>
                    <div><dt className="inline font-medium">{labels.opportunities.confidence}: </dt><dd className="inline">{opp.confidence_score}</dd></div>
                  </dl>
                  <button type="button" onClick={() => void loadBriefing(opp.id)} className="mt-2 text-xs text-indigo-600 hover:underline">
                    {labels.decisions.viewBriefing}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {mode === "meeting" && cockpit?.meeting_mode ? (
        <MeetingSection meeting={cockpit.meeting_mode} labels={labels} onBriefing={(id) => void loadBriefing(id)} />
      ) : null}

      {mode === "insights" ? (
        <InsightsSection cockpit={cockpit} labels={labels} />
      ) : null}

      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="font-semibold text-gray-900">{labels.faq.title}</h2>
        <dl className="mt-3 space-y-3 text-sm">
          <div>
            <dt className="font-medium">{labels.faq.whatIsCockpit}</dt>
            <dd className="mt-1 text-gray-600">{labels.faq.whatIsCockpitAnswer}</dd>
          </div>
          <div>
            <dt className="font-medium">{labels.faq.canAipifyDecide}</dt>
            <dd className="mt-1 text-gray-600">{labels.faq.canAipifyDecideAnswer}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm font-medium text-indigo-800">{labels.principle}</p>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-violet-800">{label}</dt>
      <dd className="text-2xl font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

function BriefingRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={highlight ? "rounded-lg border border-indigo-300 bg-white px-3 py-2" : ""}>
      <p className="text-sm font-medium text-indigo-900">{label}</p>
      <p className="mt-1 text-sm text-gray-800">{value}</p>
    </div>
  );
}

function HealthRow({ label, indicator, statusLabels }: { label: string; indicator: HealthIndicator; statusLabels: Record<OrgHealthStatus, string> }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
      <span className="text-sm font-medium text-gray-800">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold tabular-nums">{indicator.score}</span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${HEALTH_STYLE[indicator.status]}`}>
          {statusLabels[indicator.status]}
        </span>
      </div>
    </div>
  );
}

function HealthSection({
  health,
  labels,
}: {
  health: NonNullable<ExecutiveStrategicDecisionCockpit["organization_health"]>;
  labels: ExecutiveStrategicDecisionCockpitLabels;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3">
      <h2 className="font-semibold text-gray-900">{labels.health.title}</h2>
      <HealthRow label={labels.health.operationalEfficiency} indicator={health.operational_efficiency} statusLabels={labels.health.statuses} />
      <HealthRow label={labels.health.employeeEngagement} indicator={health.employee_engagement} statusLabels={labels.health.statuses} />
      <HealthRow label={labels.health.customerSatisfaction} indicator={health.customer_satisfaction} statusLabels={labels.health.statuses} />
      <HealthRow label={labels.health.revenueMomentum} indicator={health.revenue_momentum} statusLabels={labels.health.statuses} />
      <HealthRow label={labels.health.riskExposure} indicator={health.risk_exposure} statusLabels={labels.health.statuses} />
      <HealthRow label={labels.health.complianceStatus} indicator={health.compliance_status} statusLabels={labels.health.statuses} />
      <HealthRow label={labels.health.strategicExecution} indicator={health.strategic_execution} statusLabels={labels.health.statuses} />
    </section>
  );
}

function DecisionQueueSection({
  queue,
  labels,
  onBriefing,
}: {
  queue: NonNullable<ExecutiveStrategicDecisionCockpit["decision_queue"]>;
  labels: ExecutiveStrategicDecisionCockpitLabels;
  onBriefing: (id: string) => void;
}) {
  const groups: Array<{ key: keyof typeof queue; title: string }> = [
    { key: "critical", title: labels.decisions.critical },
    { key: "high_priority", title: labels.decisions.highPriority },
    { key: "medium_priority", title: labels.decisions.mediumPriority },
    { key: "informational", title: labels.decisions.informational },
  ];

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">{labels.decisions.title}</h2>
      {groups.map(({ key, title }) => (
        <div key={key} className="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {queue[key].length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">{labels.decisions.empty}</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {queue[key].map((item) => (
                <DecisionCard key={item.id} item={item} labels={labels} onBriefing={onBriefing} />
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
}

function DecisionCard({
  item,
  labels,
  onBriefing,
}: {
  item: DecisionQueueItem;
  labels: ExecutiveStrategicDecisionCockpitLabels;
  onBriefing: (id: string) => void;
}) {
  return (
    <li className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-medium text-gray-900">{item.title}</p>
        <button type="button" onClick={() => onBriefing(item.id)} className="text-xs text-indigo-600 hover:underline">
          {labels.decisions.viewBriefing}
        </button>
      </div>
      <dl className="mt-2 grid gap-1 sm:grid-cols-2 text-xs text-gray-600">
        <div><dt className="inline font-medium">{labels.decisions.owner}: </dt><dd className="inline">{item.owner}</dd></div>
        <div><dt className="inline font-medium">{labels.decisions.riskLevel}: </dt><dd className="inline">{item.risk_level}</dd></div>
        <div className="sm:col-span-2"><dt className="inline font-medium">{labels.decisions.nextStep}: </dt><dd className="inline">{item.recommended_next_step}</dd></div>
      </dl>
    </li>
  );
}

function MeetingSection({
  meeting,
  labels,
  onBriefing,
}: {
  meeting: NonNullable<ExecutiveStrategicDecisionCockpit["meeting_mode"]>;
  labels: ExecutiveStrategicDecisionCockpitLabels;
  onBriefing: (id: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-5 space-y-4">
      <h2 className="font-semibold text-indigo-950">{labels.meeting.title}</h2>
      <MeetingList title={labels.meeting.topics} items={meeting.topics_for_discussion.map((t) => t.title)} />
      <MeetingList title={labels.meeting.agenda} items={meeting.suggested_agenda} />
      <div>
        <h3 className="text-sm font-semibold text-indigo-900">{labels.meeting.pendingApprovals}</h3>
        <ul className="mt-1 space-y-1">
          {meeting.pending_approvals.map((a) => (
            <li key={a.id}>
              <button type="button" onClick={() => onBriefing(a.id)} className="text-sm text-indigo-600 hover:underline">{a.title}</button>
            </li>
          ))}
        </ul>
      </div>
      <MeetingList title={labels.meeting.blocked} items={meeting.blocked_initiatives.map((b) => b.title)} />
      <MeetingList title={labels.meeting.achievements} items={meeting.recent_achievements.map((a) => a.title)} />
    </section>
  );
}

function MeetingList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold text-indigo-900">{title}</h3>
      <ul className="mt-1 list-inside list-disc text-sm text-gray-700">{items.map((i) => <li key={i}>{i}</li>)}</ul>
    </div>
  );
}

function InsightsSection({ cockpit, labels }: { cockpit: ExecutiveStrategicDecisionCockpit | null; labels: ExecutiveStrategicDecisionCockpitLabels }) {
  const co = cockpit?.cross_organizational;
  const li = cockpit?.learning_insights;
  return (
    <div className="space-y-4">
      {co ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="font-semibold text-gray-900">{labels.insights.title}</h2>
          <h3 className="mt-3 text-sm font-medium text-gray-700">{labels.insights.departments}</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {co.departments.map((d) => (
              <li key={d.department}>{d.department}: {d.active_count} active, {d.at_risk_count} at risk</li>
            ))}
          </ul>
          <h3 className="mt-4 text-sm font-medium text-gray-700">{labels.insights.emergingIssues}</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {co.emerging_issues.map((e) => <li key={e.title}>{e.title} — {e.issue}</li>)}
          </ul>
        </section>
      ) : null}
      {(cockpit?.decision_history?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="font-semibold text-gray-900">{labels.insights.decisionHistory}</h2>
          <ul className="mt-3 max-h-48 space-y-1 overflow-y-auto text-sm text-gray-600">
            {cockpit!.decision_history!.map((h) => (
              <li key={h.id}>{h.event_type} — {h.description}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {li ? (
        <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5">
          <h2 className="font-semibold text-violet-950">{labels.insights.learningTitle}</h2>
          <p className="mt-2 text-sm">{labels.insights.decisionAccuracy}: {li.decision_accuracy_estimate}%</p>
          <p className="mt-2 text-sm">{labels.insights.interventionEffectiveness}: {li.intervention_effectiveness}</p>
          <ul className="mt-2 list-inside list-disc text-sm">{li.success_patterns.map((s) => <li key={s}>{s}</li>)}</ul>
        </section>
      ) : null}
    </div>
  );
}
