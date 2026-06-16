"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseEnterpriseTransformationChangeCenter,
  type EnterpriseTransformationChangeCenter,
  type EnterpriseTransformationChangeLabels,
  type ReadinessDimension,
  type ReadinessStatus,
  type TransformationCategoryKey,
  type TransformationChangeMode,
} from "@/lib/enterprise-transformation-change";

type Props = { labels: EnterpriseTransformationChangeLabels };

const MODES: TransformationChangeMode[] = [
  "dashboard", "categories", "readiness", "adoption", "resistance", "briefing",
  "stakeholders", "communication", "training", "milestones", "learning", "reflection",
];

const READY_STYLE: Record<ReadinessStatus, string> = {
  ready: "bg-emerald-100 text-emerald-900",
  mostly_ready: "bg-sky-100 text-sky-900",
  partially_ready: "bg-amber-100 text-amber-900",
  not_ready: "bg-orange-100 text-orange-900",
  critical_concerns: "bg-rose-100 text-rose-900",
};

export function TransformationChangeCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<EnterpriseTransformationChangeCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<TransformationChangeMode>("dashboard");
  const [recorded, setRecorded] = useState(false);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/executive/transformation-change-center");
    if (res.ok) setCenter(parseEnterpriseTransformationChangeCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function logEvent(eventType: string, description: string) {
    await fetch("/api/executive/transformation-change-center/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_type: eventType, description }),
    });
    setRecorded(true);
    setTimeout(() => setRecorded(false), 3000);
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  if (center?.upgrade_required) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 p-6">
        <h1 className="text-2xl font-bold text-gray-900">{labels.upgradeTitle}</h1>
        <p className="text-gray-600">{labels.upgradeBody}</p>
        <Link href="/app/license" className="text-sm text-indigo-600 hover:underline">{labels.upgradeCta}</Link>
      </div>
    );
  }

  const dash = center?.transformation_dashboard;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <Link href="/app/executive" className="text-sm text-indigo-600 hover:underline">← {labels.executiveLink}</Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">{labels.humanOversight}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link href="/app/executive/strategic-decision-cockpit" className="text-indigo-600 hover:underline">{labels.cockpitLink}</Link>
          <Link href="/app/executive/early-warning-center" className="text-indigo-600 hover:underline">{labels.earlyWarningLink}</Link>
          <Link href="/app/action-center" className="text-indigo-600 hover:underline">{labels.portfolioLink}</Link>
        </div>
        {recorded ? <p className="mt-2 text-sm text-emerald-700">{labels.recorded}</p> : null}
      </div>

      <div className="flex flex-wrap gap-1 rounded-xl border border-gray-200 p-0.5 text-sm">
        {MODES.map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)} className={`rounded-lg px-2.5 py-1.5 ${mode === m ? "bg-indigo-600 text-white" : "text-gray-600"}`}>
            {labels.tabs[m]}
          </button>
        ))}
      </div>

      {mode === "dashboard" && dash ? (
        <section className="rounded-2xl border border-teal-200 bg-teal-50/30 p-5">
          <h2 className="font-semibold text-teal-950">{labels.dashboard.title}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <Metric label={labels.dashboard.activePrograms} value={dash.active_programs} />
            <Metric label={labels.dashboard.adoptionProgress} value={dash.adoption_progress} suffix="%" />
            <Metric label={labels.dashboard.readiness} value={dash.change_readiness_score} />
            <Metric label={labels.dashboard.resistanceSignals} value={dash.resistance_signals_count} />
            <Metric label={labels.dashboard.milestonesAchieved} value={dash.milestones_achieved} />
            <div className="sm:col-span-2">
              <dt className="text-teal-800">{labels.dashboard.healthStatus}</dt>
              <dd className="text-lg font-semibold capitalize">{dash.health_status.replace(/_/g, " ")} ({dash.health_score})</dd>
            </div>
            <div>
              <dt className="text-teal-800">{labels.dashboard.sponsorship}</dt>
              <dd className="capitalize">{dash.executive_sponsorship_status.replace(/_/g, " ")}</dd>
            </div>
          </dl>
          {(dash.active_programs_list.length > 0) ? (
            <div className="mt-4">
              <h3 className="text-sm font-semibold">{labels.dashboard.programs}</h3>
              <ul className="mt-2 space-y-2 text-sm">
                {dash.active_programs_list.map((p) => (
                  <li key={p.id} className="rounded-lg bg-white/70 px-3 py-2">
                    {p.title} — {labels.categoryLabels[p.category as TransformationCategoryKey] ?? p.category} · {p.adoption_progress}%
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      {mode === "categories" ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="font-semibold">{labels.categories.title}</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-sm">
            {(center?.transformation_categories ?? []).map((c) => (
              <li key={c.key} className="flex justify-between rounded-lg bg-gray-50 px-3 py-2">
                <span>{labels.categoryLabels[c.key]}</span>
                <span className="font-semibold tabular-nums">{c.count}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {mode === "readiness" && center?.change_readiness ? (
        <ReadinessSection readiness={center.change_readiness} labels={labels} />
      ) : null}

      {mode === "adoption" && center?.adoption_intelligence ? (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5 text-sm">
          <h2 className="font-semibold text-emerald-950">{labels.adoption.title}</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div><dt className="font-medium">{labels.adoption.trainingParticipation}</dt><dd>{center.adoption_intelligence.training_participation}%</dd></div>
            <div><dt className="font-medium">{labels.adoption.processAdoption}</dt><dd>{center.adoption_intelligence.process_adoption_rate}%</dd></div>
            <div><dt className="font-medium">{labels.adoption.usagePattern}</dt><dd className="capitalize">{center.adoption_intelligence.usage_pattern}</dd></div>
            <div><dt className="font-medium">{labels.adoption.supportRequests}</dt><dd>{center.adoption_intelligence.support_requests}</dd></div>
            <div><dt className="font-medium">{labels.adoption.feedbackTrend}</dt><dd className="capitalize">{center.adoption_intelligence.feedback_trend}</dd></div>
          </dl>
          <p className="mt-3 text-xs text-gray-600">{labels.adoption.departmentNotes}</p>
          {(center.adoption_intelligence.department_differences.length > 0) ? (
            <div className="mt-3">
              <h3 className="font-medium">{labels.adoption.departmentDifferences}</h3>
              <ul className="mt-1 space-y-1">{center.adoption_intelligence.department_differences.map((d) => <li key={d.area}>{d.area}: {d.adoption}%</li>)}</ul>
            </div>
          ) : null}
        </section>
      ) : null}

      {mode === "resistance" ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/30 p-5">
          <h2 className="font-semibold text-amber-950">{labels.resistance.title}</h2>
          {(center?.resistance_monitoring?.length ?? 0) === 0 ? (
            <p className="mt-3 text-sm text-gray-600">{labels.resistance.empty}</p>
          ) : (
            <ul className="mt-4 space-y-3 text-sm">
              {center!.resistance_monitoring!.map((r) => (
                <li key={r.signal} className="rounded-lg bg-white/70 p-4">
                  <p className="font-medium">{labels.resistanceSignals[r.signal as keyof typeof labels.resistanceSignals] ?? r.signal.replace(/_/g, " ")}</p>
                  <p className="mt-1 text-xs text-amber-800">{labels.resistance.severity}: {r.severity}</p>
                  <p className="mt-2 text-gray-700">{labels.resistance.supportiveNote}: {r.supportive_note}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {mode === "briefing" && center?.executive_briefing ? (
        <section className="rounded-2xl border border-violet-200 bg-violet-50/30 p-5 text-sm space-y-3">
          <h2 className="font-semibold text-violet-950">{labels.briefing.title}</h2>
          <p><strong>{labels.briefing.status}</strong> {center.executive_briefing.current_status}</p>
          <div><p className="font-medium">{labels.briefing.achievements}</p><ul className="list-inside list-disc">{center.executive_briefing.achievements.map((a) => <li key={a}>{a}</li>)}</ul></div>
          <div><p className="font-medium">{labels.briefing.risks}</p><ul className="list-inside list-disc">{center.executive_briefing.emerging_risks.map((r) => <li key={r}>{r}</li>)}</ul></div>
          <p><strong>{labels.briefing.adoptionTrends}</strong> {center.executive_briefing.adoption_trends}</p>
          <div><p className="font-medium">{labels.briefing.interventions}</p><ul className="list-inside list-disc">{center.executive_briefing.recommended_interventions.map((i) => <li key={i}>{i}</li>)}</ul></div>
          <p><strong>{labels.briefing.confidence}</strong> {center.executive_briefing.confidence_score} ({center.executive_briefing.confidence_level})</p>
          <p className="text-xs text-violet-800">{center.executive_briefing.disclaimer}</p>
          <button type="button" onClick={() => void logEvent("transformation_briefing_generated", "Executive transformation briefing generated")} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white">{labels.generateBriefing}</button>
        </section>
      ) : null}

      {mode === "stakeholders" && center?.stakeholder_mapping ? (
        <StakeholderSection mapping={center.stakeholder_mapping} labels={labels} />
      ) : null}

      {mode === "communication" && center?.communication_intelligence ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 text-sm space-y-2">
          <h2 className="font-semibold">{labels.communication.title}</h2>
          <p><strong>{labels.communication.frequency}</strong> <span className="capitalize">{center.communication_intelligence.frequency}</span></p>
          <p><strong>{labels.communication.reach}</strong> {center.communication_intelligence.reach_indicator}%</p>
          <p><strong>{labels.communication.acknowledgement}</strong> {center.communication_intelligence.acknowledgement_rate}%</p>
          <p><strong>{labels.communication.understanding}</strong> {center.communication_intelligence.understanding_indicator}%</p>
          {(center.communication_intelligence.missed_audiences.length > 0) ? (
            <div><p className="font-medium">{labels.communication.missedAudiences}</p><ul className="list-inside list-disc">{center.communication_intelligence.missed_audiences.map((a) => <li key={a}>{a}</li>)}</ul></div>
          ) : null}
          <div><p className="font-medium">{labels.communication.recommendedActions}</p><ul className="list-inside list-disc">{center.communication_intelligence.recommended_actions.map((a) => <li key={a}>{a}</li>)}</ul></div>
        </section>
      ) : null}

      {mode === "training" && center?.training_enablement ? (
        <section className="rounded-2xl border border-sky-200 bg-sky-50/30 p-5 text-sm space-y-2">
          <h2 className="font-semibold text-sky-950">{labels.training.title}</h2>
          <p><strong>{labels.training.completionRate}</strong> {center.training_enablement.completion_rate}%</p>
          <p><strong>{labels.training.departmentReadiness}</strong> <ReadinessBadge status={center.training_enablement.department_readiness} statuses={labels.readiness.statuses} /></p>
          {(center.training_enablement.knowledge_gaps.length > 0) ? (
            <div><p className="font-medium">{labels.training.knowledgeGaps}</p><ul className="list-inside list-disc">{center.training_enablement.knowledge_gaps.map((g) => <li key={g}>{g}</li>)}</ul></div>
          ) : null}
          <div><p className="font-medium">{labels.training.followUp}</p><ul className="list-inside list-disc">{center.training_enablement.follow_up_recommendations.map((f) => <li key={f}>{f}</li>)}</ul></div>
          <div><p className="font-medium">{labels.training.learningPathways}</p><ul className="list-inside list-disc">{center.training_enablement.learning_pathways.map((p) => <li key={p}>{p}</li>)}</ul></div>
        </section>
      ) : null}

      {mode === "milestones" && center?.milestones ? (
        <MilestonesSection milestones={center.milestones} labels={labels} />
      ) : null}

      {mode === "learning" && center?.learning_insights ? (
        <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5 text-sm">
          <h2 className="font-semibold">{labels.learning.title}</h2>
          <ul className="mt-3 space-y-2">{Object.entries(center.learning_insights).map(([k, v]) => <li key={k}><span className="font-medium capitalize">{k.replace(/_/g, " ")}:</span> {v}</li>)}</ul>
        </section>
      ) : null}

      {mode === "reflection" ? (
        <section className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-5">
          <h2 className="font-semibold text-indigo-950">{labels.reflection.title}</h2>
          <ul className="mt-4 space-y-4 text-sm">
            {(center?.reflection_prompts ?? []).map((r) => (
              <li key={r.prompt} className="rounded-lg bg-white/70 p-4">
                <p className="font-medium">{r.prompt}</p>
                <p className="mt-1 text-gray-600">{labels.reflection.guidance}: {r.guidance}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-3 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.autoManage}</dt><dd className="mt-1 text-gray-600">{labels.faq.autoManageAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.respondResistance}</dt><dd className="mt-1 text-gray-600">{labels.faq.respondResistanceAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.readinessAssessments}</dt><dd className="mt-1 text-gray-600">{labels.faq.readinessAssessmentsAnswer}</dd></div>
        </dl>
        <p className="mt-4 text-sm font-medium text-indigo-800">{labels.principle}</p>
      </section>
    </div>
  );
}

function Metric({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (<div><dt className="text-teal-800">{label}</dt><dd className="text-2xl font-semibold tabular-nums">{value}{suffix}</dd></div>);
}

function ReadinessBadge({ status, statuses }: { status: ReadinessStatus; statuses: Record<ReadinessStatus, string> }) {
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${READY_STYLE[status]}`}>{statuses[status]}</span>;
}

function ReadinessRow({ label, dim, statuses }: { label: string; dim: ReadinessDimension; statuses: Record<ReadinessStatus, string> }) {
  return (
    <li className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm">
      <span>{label}</span>
      <div className="flex items-center gap-2"><span className="font-semibold">{dim.score}</span><ReadinessBadge status={dim.status} statuses={statuses} /></div>
    </li>
  );
}

function ReadinessSection({ readiness, labels }: { readiness: NonNullable<EnterpriseTransformationChangeCenter["change_readiness"]>; labels: EnterpriseTransformationChangeLabels }) {
  const items: Array<[string, ReadinessDimension]> = [
    [labels.readiness.leadershipAlignment, readiness.leadership_alignment],
    [labels.readiness.employeeUnderstanding, readiness.employee_understanding],
    [labels.readiness.communicationEffectiveness, readiness.communication_effectiveness],
    [labels.readiness.resourceAvailability, readiness.resource_availability],
    [labels.readiness.trainingReadiness, readiness.training_readiness],
    [labels.readiness.governanceReadiness, readiness.governance_readiness],
  ];
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5">
      <h2 className="font-semibold">{labels.readiness.title}</h2>
      <p className="mt-2 text-sm">{labels.readiness.overall}: {readiness.overall_score} — <ReadinessBadge status={readiness.overall_status} statuses={labels.readiness.statuses} /></p>
      <ul className="mt-4 space-y-2">{items.map(([l, d]) => <ReadinessRow key={l} label={l} dim={d} statuses={labels.readiness.statuses} />)}</ul>
    </section>
  );
}

function StakeholderSection({ mapping, labels }: { mapping: NonNullable<EnterpriseTransformationChangeCenter["stakeholder_mapping"]>; labels: EnterpriseTransformationChangeLabels }) {
  const groups: Array<[string, string[]]> = [
    [labels.stakeholders.executiveSponsors, mapping.executive_sponsors],
    [labels.stakeholders.transformationLeaders, mapping.transformation_leaders],
    [labels.stakeholders.departmentChampions, mapping.department_champions],
    [labels.stakeholders.subjectMatterExperts, mapping.subject_matter_experts],
    [labels.stakeholders.impactedTeams, mapping.impacted_teams],
    [labels.stakeholders.communicationOwners, mapping.communication_owners],
  ];
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 text-sm space-y-4">
      <h2 className="font-semibold">{labels.stakeholders.title}</h2>
      {groups.map(([title, items]) => (
        <div key={title}><p className="font-medium">{title}</p><ul className="mt-1 list-inside list-disc text-gray-700">{items.map((i) => <li key={i}>{i}</li>)}</ul></div>
      ))}
    </section>
  );
}

function MilestonesSection({ milestones, labels }: { milestones: NonNullable<EnterpriseTransformationChangeCenter["milestones"]>; labels: EnterpriseTransformationChangeLabels }) {
  const sections: Array<[string, Array<{ title: string; detail?: string }>]> = [
    [labels.milestones.planned, milestones.planned.map((m) => ({ title: m.title, detail: m.status }))],
    [labels.milestones.completed, milestones.completed.map((m) => ({ title: m.title, detail: m.completed_at }))],
    [labels.milestones.delayed, milestones.delayed.map((m) => ({ title: m.title, detail: m.reason }))],
    [labels.milestones.blocked, milestones.blocked.map((m) => ({ title: m.title, detail: m.reason }))],
    [labels.milestones.executiveReview, milestones.executive_review.map((m) => ({ title: m.title, detail: m.risk_level }))],
  ];
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 text-sm space-y-4">
      <h2 className="font-semibold">{labels.milestones.title}</h2>
      {sections.map(([title, items]) => (
        items.length > 0 ? (
          <div key={title}><p className="font-medium">{title}</p><ul className="mt-1 space-y-1">{items.map((m) => <li key={m.title} className="rounded bg-gray-50 px-2 py-1">{m.title}{m.detail ? ` — ${m.detail}` : ""}</li>)}</ul></div>
        ) : null
      ))}
    </section>
  );
}
