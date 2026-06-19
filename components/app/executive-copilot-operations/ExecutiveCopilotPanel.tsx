"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  APPROVAL_STATUS_BADGES,
  CONFIDENCE_BADGES,
  DECISION_STATUS_BADGES,
  EXECUTION_STATUS_BADGES,
  EXECUTIVE_COPILOT_TABS,
  HEALTH_STATUS_BADGES,
  PRIORITY_BADGES,
  parseExecutiveCopilotCenter,
  type ExecutiveApproval,
  type ExecutiveCopilotCenter,
  type ExecutiveCopilotLabels,
  type ExecutiveCopilotTab,
} from "@/lib/customer-executive-copilot-operations";

type Props = {
  labels: ExecutiveCopilotLabels;
  backHref: string;
  initialTab?: ExecutiveCopilotTab;
  visibleTabs?: ExecutiveCopilotTab[];
  titleOverride?: string;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function JsonList({ items }: { items: Record<string, unknown>[] }) {
  if (!items.length) return <p className="text-sm text-zinc-500">—</p>;
  return (
    <>
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm">
          <p className="font-medium text-zinc-900">
            {String(
              item.briefing_title ?? item.decision_title ?? item.approval_title
                ?? item.recommendation_title ?? item.execution_title ?? item.report_title
                ?? item.scenario_title ?? item.monitor_title ?? item.prompt_text ?? item.title ?? i
            )}
          </p>
          {(item.summary ?? item.recommendation ?? item.financial_impact) ? (
            <p className="mt-1 text-zinc-600">{String(item.summary ?? item.recommendation ?? item.financial_impact)}</p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-1">
            {item.confidence_level ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${CONFIDENCE_BADGES[String(item.confidence_level)] ?? CONFIDENCE_BADGES.moderate}`}>
                {String(item.confidence_level)}
              </span>
            ) : null}
            {item.approval_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${APPROVAL_STATUS_BADGES[String(item.approval_status)] ?? APPROVAL_STATUS_BADGES.pending}`}>
                {String(item.approval_status)}
              </span>
            ) : null}
            {item.decision_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${DECISION_STATUS_BADGES[String(item.decision_status)] ?? DECISION_STATUS_BADGES.analysis}`}>
                {String(item.decision_status)}
              </span>
            ) : null}
            {item.execution_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${EXECUTION_STATUS_BADGES[String(item.execution_status)] ?? EXECUTION_STATUS_BADGES.queued}`}>
                {String(item.execution_status)}
              </span>
            ) : null}
            {item.health_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${HEALTH_STATUS_BADGES[String(item.health_status)] ?? HEALTH_STATUS_BADGES.healthy}`}>
                {String(item.health_status)}
              </span>
            ) : null}
            {item.priority ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${PRIORITY_BADGES[String(item.priority)] ?? PRIORITY_BADGES.moderate}`}>
                {String(item.priority)}
              </span>
            ) : null}
            {item.health_score != null ? (
              <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">{String(item.health_score)}</span>
            ) : null}
          </div>
        </div>
      ))}
    </>
  );
}

function ApprovalCard({ item, labels, busy, onApprove, onDeny }: {
  item: ExecutiveApproval; labels: ExecutiveCopilotLabels; busy: boolean;
  onApprove: (key: string) => void; onDeny: (key: string) => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <JsonList items={[item as unknown as Record<string, unknown>]} />
      {item.approval_status === "pending" ? (
        <div className="mt-3 flex gap-2">
          <button type="button" disabled={busy} onClick={() => onApprove(item.approval_key)}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
            {labels.actions.approveItem}
          </button>
          <button type="button" disabled={busy} onClick={() => onDeny(item.approval_key)}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium disabled:opacity-50">
            {labels.actions.denyItem}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function ExecutiveCopilotPanel({ labels, backHref, initialTab = "overview", visibleTabs, titleOverride }: Props) {
  const tabs = visibleTabs ?? EXECUTIVE_COPILOT_TABS;
  const [center, setCenter] = useState<ExecutiveCopilotCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<ExecutiveCopilotTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/executive-copilot-operations");
    if (res.ok) setCenter(parseExecutiveCopilotCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  const runAction = useCallback(async (action_type: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch("/api/app/executive-copilot-operations/action", {
        method: "POST", headers: { "Content-Type": "application/json" },
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
  const advisorPrompts = (center.integrations?.executive_advisor_prompts as string[]) ?? [];
  const recommendations = (center.reports?.companion_recommendations as Record<string, unknown>[]) ?? [];
  const commands = center.natural_language_commands ?? [];
  const scenarios = center.scenarios ?? (center.strategy?.scenarios as Record<string, unknown>[]) ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← {labels.back}</Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{titleOverride ?? labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">{center.principle}</p>
        {center.philosophy ? <p className="mt-3 text-sm text-zinc-600">{center.philosophy}</p> : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={busy} onClick={() => void runAction("refresh_executive")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {labels.actions.refreshExecutive}
        </button>
        <Link href="/app/executive-copilot/decisions" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openDecisions}</Link>
        <Link href="/app/executive-copilot/board-reports" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openBoardReports}</Link>
        <Link href="/app/future-readiness" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openFutureReadiness}</Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((key) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}>
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard label={labels.overview.organizationHealth} value={Number(overview.organization_health ?? 0)} />
          <OverviewCard label={labels.overview.strategicHealth} value={Number(overview.strategic_health ?? 0)} />
          <OverviewCard label={labels.overview.revenueHealth} value={Number(overview.revenue_health ?? 0)} />
          <OverviewCard label={labels.overview.pendingDecisions} value={Number(overview.pending_decisions ?? 0)} />
          <OverviewCard label={labels.overview.pendingApprovals} value={Number(overview.pending_approvals ?? 0)} />
          <OverviewCard label={labels.overview.briefingsReady} value={Number(overview.briefings_ready ?? 0)} />
          <OverviewCard label={labels.overview.reportsReady} value={Number(overview.reports_ready ?? 0)} />
          <OverviewCard label={labels.overview.activeRecommendations} value={Number(overview.active_recommendations ?? 0)} />
          <OverviewCard label={labels.overview.executionInProgress} value={Number(overview.execution_in_progress ?? 0)} />
          <OverviewCard label={labels.overview.scenariosReady} value={Number(overview.scenarios_ready ?? 0)} />
        </dl>
      ) : null}

      {tab === "briefings" ? (
        <section className="space-y-3">
          <button type="button" disabled={busy} onClick={() => void runAction("generate_briefing", { briefing_title: "Executive Briefing" })}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            {labels.actions.generateBriefing}
          </button>
          <JsonList items={center.briefings ?? []} />
        </section>
      ) : null}

      {tab === "decisions" ? (
        <section className="space-y-3">
          <button type="button" disabled={busy} onClick={() => void runAction("create_decision_package", { decision_title: "New Decision" })}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            {labels.actions.createDecisionPackage}
          </button>
          <JsonList items={center.decisions ?? []} />
        </section>
      ) : null}

      {tab === "approvals" ? (
        <section className="space-y-3">
          {(center.approvals ?? []).map((item) => (
            <ApprovalCard key={item.approval_key} item={item} labels={labels} busy={busy}
              onApprove={(key) => void runAction("approve_executive_item", { approval_key: key })}
              onDeny={(key) => void runAction("deny_executive_item", { approval_key: key })} />
          ))}
        </section>
      ) : null}

      {tab === "recommendations" ? (
        <section><JsonList items={center.recommendations ?? []} /></section>
      ) : null}

      {tab === "execution" ? (
        <section><JsonList items={center.execution ?? []} /></section>
      ) : null}

      {tab === "reports" ? (
        <section className="space-y-3">
          <button type="button" disabled={busy} onClick={() => void runAction("generate_board_report", { report_title: "Board Report" })}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            {labels.actions.generateBoardReport}
          </button>
          <JsonList items={center.board_reports ?? []} />
          <JsonList items={recommendations} />
        </section>
      ) : null}

      {tab === "strategy" ? (
        <section className="space-y-6">
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.executiveMonitoring}</h2>
            <div className="mt-4"><JsonList items={center.monitoring ?? []} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.scenarioLab}</h2>
            <div className="mt-4 space-y-3">
              {scenarios.map((sc) => (
                <div key={String(sc.scenario_key)}>
                  <JsonList items={[sc]} />
                  {sc.scenario_status === "ready" ? (
                    <button type="button" disabled={busy}
                      onClick={() => void runAction("run_scenario", { scenario_key: sc.scenario_key })}
                      className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
                      {labels.actions.runScenario}
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {center.executive_dashboard ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(center.executive_dashboard).map(([key, value]) => (
            <OverviewCard key={key} label={key.replace(/_/g, " ")} value={String(value)} />
          ))}
        </section>
      ) : null}

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-zinc-900">{labels.sections.naturalLanguageCommands}</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-600">
          {commands.map((c) => (
            <li key={String(c.prompt_key)}>{String(c.prompt_text)}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-zinc-900">{labels.sections.companionAdvisor}</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-600">
          {advisorPrompts.map((p) => <li key={p}>{p}</li>)}
        </ul>
      </div>

      {(center.audit_recent ?? []).length ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-zinc-900">{labels.sections.audit}</h2>
          <ul className="mt-4 space-y-2 text-sm text-zinc-600">
            {(center.audit_recent ?? []).map((entry, i) => (
              <li key={i}>{entry.summary || entry.event_type}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
