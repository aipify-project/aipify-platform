"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  ACTION_STATUS_BADGES,
  BLOCKER_STATUS_BADGES,
  EXECUTION_OUTCOME_TABS,
  HEALTH_STATUS_BADGES,
  PRIORITY_BADGES,
  parseExecutionOutcomeCenter,
  type ExecutionOutcomeCenter,
  type ExecutionOutcomeLabels,
  type ExecutionOutcomeTab,
} from "@/lib/customer-execution-outcome-operations";

type Props = {
  labels: ExecutionOutcomeLabels;
  backHref: string;
  initialTab?: ExecutionOutcomeTab;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function ItemList({ items, labels }: { items: Record<string, unknown>[]; labels: ExecutionOutcomeLabels }) {
  if (!items.length) return <p className="text-sm text-zinc-500">—</p>;
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={String(
            item.initiative_key ?? item.action_key ?? item.accountability_key ?? item.dependency_key
              ?? item.blocker_key ?? item.outcome_key ?? item.meeting_key ?? item.pack_key ?? i
          )}
          className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm"
        >
          <p className="font-medium text-zinc-900">
            {String(
              item.initiative_title ?? item.action_title ?? item.responsible_owner
                ?? item.dependency_title ?? item.blocker_title ?? item.outcome_title
                ?? item.meeting_title ?? item.pack_title ?? item.title ?? i
            )}
          </p>
          {item.summary ? <p className="mt-1 text-zinc-600">{String(item.summary)}</p> : null}
          {item.recommendation ? <p className="mt-1 text-indigo-700">{String(item.recommendation)}</p> : null}
          {item.expected_outcome && item.actual_outcome ? (
            <p className="mt-1 text-zinc-500">Expected {String(item.expected_outcome)} → Actual {String(item.actual_outcome)} (Variance {String(item.variance)})</p>
          ) : null}
          {item.owner_name ? <p className="mt-1 text-zinc-500">{String(item.owner_name)}</p> : null}
          {item.deadline ? <p className="mt-1 text-zinc-500">Deadline: {String(item.deadline)}</p> : null}
          <div className="mt-2 flex flex-wrap gap-1">
            {item.health_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${HEALTH_STATUS_BADGES[String(item.health_status)] ?? HEALTH_STATUS_BADGES.healthy}`}>
                {labels.healthStatus[String(item.health_status) as keyof typeof labels.healthStatus] ?? String(item.health_status)}
              </span>
            ) : null}
            {item.action_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${ACTION_STATUS_BADGES[String(item.action_status)] ?? ACTION_STATUS_BADGES.pending}`}>
                {labels.actionStatus[String(item.action_status) as keyof typeof labels.actionStatus] ?? String(item.action_status)}
              </span>
            ) : null}
            {item.priority ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${PRIORITY_BADGES[String(item.priority)] ?? PRIORITY_BADGES.moderate}`}>
                {labels.priority[String(item.priority) as keyof typeof labels.priority] ?? String(item.priority)}
              </span>
            ) : null}
            {item.blocker_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${BLOCKER_STATUS_BADGES[String(item.blocker_status)] ?? BLOCKER_STATUS_BADGES.open}`}>
                {String(item.blocker_status)}
              </span>
            ) : null}
            {item.initiative_id ? (
              <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">{String(item.initiative_id)}</span>
            ) : null}
            {item.department ? (
              <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">{String(item.department)}</span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ExecutionOutcomePanel({ labels, backHref, initialTab = "overview" }: Props) {
  const [center, setCenter] = useState<ExecutionOutcomeCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<ExecutionOutcomeTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/execution-outcome-operations");
    if (res.ok) setCenter(parseExecutionOutcomeCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const runAction = useCallback(async (action_type: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch("/api/app/execution-outcome-operations/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action_type, ...payload }),
      });
      if (res.ok) await load();
    } finally { setBusy(false); }
  }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered /><span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) return <p className="p-6 text-sm text-red-600">{labels.emptyState}</p>;

  const overview = center.overview ?? {};
  const executive = center.executive_dashboard ?? {};
  const scorecard = center.execution_scorecard ?? {};
  const companion = center.companion ?? {};
  const advisorPrompts = (companion.execution_advisor_prompts as string[]) ?? [];
  const recommendations = center.recommendations ?? (executive.companion_recommendations as Record<string, unknown>[]) ?? [];
  const deadlineItems = [...(center.actions ?? [])].sort((a, b) => String(a.deadline ?? "").localeCompare(String(b.deadline ?? "")));

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← {labels.back}</Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">{center.principle}</p>
        {center.philosophy ? <p className="mt-3 text-sm text-zinc-600">{center.philosophy}</p> : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={busy} onClick={() => void runAction("refresh_execution")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {labels.actions.refreshExecution}
        </button>
        <button type="button" disabled={busy} onClick={() => void runAction("generate_execution_briefing")}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50">
          {labels.actions.generateExecutionBriefing}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {EXECUTION_OUTCOME_TABS.map((key) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}>
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <section className="space-y-8">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <OverviewCard label={labels.overview.totalInitiatives} value={Number(overview.total_initiatives ?? 0)} />
            <OverviewCard label={labels.overview.activeActions} value={Number(overview.active_actions ?? 0)} />
            <OverviewCard label={labels.overview.blockedActions} value={Number(overview.blocked_actions ?? 0)} />
            <OverviewCard label={labels.overview.overdueActions} value={Number(overview.overdue_actions ?? 0)} />
            <OverviewCard label={labels.overview.openBlockers} value={Number(overview.open_blockers ?? 0)} />
            <OverviewCard label={labels.overview.atRiskInitiatives} value={Number(overview.at_risk_initiatives ?? 0)} />
            <OverviewCard label={labels.overview.completionRate} value={`${Number(overview.completion_rate ?? 0)}%`} />
            <OverviewCard label={labels.overview.executionVelocity} value={Number(overview.execution_velocity ?? scorecard.execution_velocity ?? 0)} />
          </dl>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.blockerDetection}</h2>
            <div className="mt-4"><ItemList items={center.blockers ?? []} labels={labels} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.executionScorecard}</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <OverviewCard label="Completed" value={Number(scorecard.completed_actions ?? 0)} />
              <OverviewCard label="Overdue" value={Number(scorecard.overdue_actions ?? 0)} />
              <OverviewCard label="Blocked" value={Number(scorecard.blocked_actions ?? 0)} />
            </dl>
          </div>
        </section>
      ) : null}

      {tab === "initiatives" ? (
        <section className="space-y-6">
          <ItemList items={center.initiatives ?? []} labels={labels} />
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.businessPacks}</h2>
            <div className="mt-4"><ItemList items={center.business_packs ?? []} labels={labels} /></div>
          </div>
        </section>
      ) : null}

      {tab === "actions" ? (
        <section className="space-y-4">
          <ItemList items={center.actions ?? []} labels={labels} />
          {(center.actions ?? []).filter((a) => a.action_status === "in_progress" || a.action_status === "pending").map((action) => (
            <button key={String(action.action_key)} type="button" disabled={busy}
              onClick={() => void runAction("complete_action", { action_key: action.action_key })}
              className="mr-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
              {labels.actions.completeAction}
            </button>
          ))}
        </section>
      ) : null}

      {tab === "owners" ? (
        <section><ItemList items={center.accountability ?? []} labels={labels} /></section>
      ) : null}

      {tab === "deadlines" ? (
        <section><ItemList items={deadlineItems} labels={labels} /></section>
      ) : null}

      {tab === "dependencies" ? (
        <section><ItemList items={center.dependencies ?? []} labels={labels} /></section>
      ) : null}

      {tab === "outcomes" ? (
        <section><ItemList items={center.outcomes ?? []} labels={labels} /></section>
      ) : null}

      {tab === "reports" ? (
        <section className="space-y-6">
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.executiveDashboard}</h2>
            <div className="mt-4"><ItemList items={recommendations} labels={labels} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.meetingToExecution}</h2>
            <div className="mt-4"><ItemList items={center.meetings ?? []} labels={labels} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.companionAdvisor}</h2>
            <ul className="mt-3 space-y-1 text-sm text-zinc-700">
              {advisorPrompts.map((prompt) => <li key={prompt}>· {prompt}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.audit}</h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600">
              {(center.audit_recent ?? []).map((entry, i) => (
                <li key={i} className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2">
                  <span className="font-medium text-zinc-900">{entry.event_type}</span>
                  {entry.summary ? ` — ${entry.summary}` : ""}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}
