"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  HEALTH_LABEL_BADGES,
  ORCHESTRATION_TABS,
  SPECIALIST_STATUS_BADGES,
  parseCompanionOrchestrationOperationsCenter,
  type CompanionOrchestrationCenter,
  type CompanionOrchestrationLabels,
  type CompanionOrchestrationTab,
  type SpecialistRow,
} from "@/lib/customer-companion-orchestration-operations";

type Props = {
  labels: CompanionOrchestrationLabels;
  backHref: string;
  initialTab?: CompanionOrchestrationTab;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function SpecialistStatusBadge({
  status,
  labels,
}: {
  status?: string;
  labels: CompanionOrchestrationLabels;
}) {
  if (!status) return null;
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
        SPECIALIST_STATUS_BADGES[status] ?? SPECIALIST_STATUS_BADGES.active
      }`}
    >
      {labels.specialistStatuses[status] ?? status}
    </span>
  );
}

function SpecialistCard({ specialist, labels }: { specialist: SpecialistRow; labels: CompanionOrchestrationLabels }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium text-zinc-900">{specialist.specialist_name}</p>
          {specialist.description ? <p className="mt-1 text-sm text-zinc-600">{specialist.description}</p> : null}
        </div>
        <SpecialistStatusBadge status={specialist.specialist_status} labels={labels} />
      </div>
      <p className="mt-2 text-xs text-zinc-500">
        {specialist.specialist_type}
        {specialist.workload_pct != null ? ` · Workload ${specialist.workload_pct}%` : ""}
        {specialist.response_quality_score != null ? ` · Quality ${specialist.response_quality_score}` : ""}
        {specialist.usage_count != null ? ` · Usage ${specialist.usage_count}` : ""}
      </p>
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
              item.specialist_name ??
                item.assignment_title ??
                item.coordination_title ??
                item.approval_title ??
                item.session_title ??
                item.decision_title ??
                item.team_title ??
                item.share_key ??
                item.specialist_key ??
                i
            )}
          </p>
          {(item.summary ?? item.task_summary ?? item.request_summary ?? item.unified_response_summary ?? item.recommendation_summary) ? (
            <p className="mt-1 text-zinc-600">
              {String(
                item.summary ??
                  item.task_summary ??
                  item.request_summary ??
                  item.unified_response_summary ??
                  item.recommendation_summary
              )}
            </p>
          ) : null}
        </div>
      ))}
    </>
  );
}

export function CompanionOrchestrationOperationsPanel({
  labels,
  backHref,
  initialTab = "overview",
}: Props) {
  const [center, setCenter] = useState<CompanionOrchestrationCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<CompanionOrchestrationTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/companion-orchestration-operations");
    if (res.ok) setCenter(parseCompanionOrchestrationOperationsCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const runAction = useCallback(
    async (action_type: string, payload: Record<string, unknown> = {}) => {
      setBusy(true);
      try {
        const res = await fetch("/api/app/companion-orchestration-operations/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action_type, ...payload }),
        });
        if (res.ok) await load();
      } finally {
        setBusy(false);
      }
    },
    [load]
  );

  if (loading && !center) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) {
    return <p className="p-6 text-sm text-red-600">{labels.emptyState}</p>;
  }

  const overview = center.overview ?? {};
  const specialists = center.specialists ?? [];
  const assignments = center.assignments ?? [];
  const coordinationEvents = (center.coordination?.events as Record<string, unknown>[]) ?? [];
  const contextShares = (center.coordination?.context_shares as Record<string, unknown>[]) ?? [];
  const unifiedPrinciple = center.coordination?.unified_companion_principle as Record<string, unknown> | undefined;
  const workloads = center.workloads ?? [];
  const approvalItems = (center.approvals?.approvals as Record<string, unknown>[]) ?? [];
  const approvalFlow = (center.approvals?.approval_flow as string[]) ?? [];
  const teams = center.teams ?? [];
  const council = center.meeting_council ?? [];
  const decisions = center.decision_collaborations ?? [];
  const skillsIntegration = center.integrations?.skills_integration as Record<string, unknown> | undefined;
  const memoryIntegration = center.integrations?.memory_integration as Record<string, unknown> | undefined;
  const packSpecialists = (center.integrations?.business_pack_specialists as Record<string, unknown>[]) ?? [];
  const healthLabel = String(center.performance?.health_label ?? center.executive_dashboard?.health_label ?? "healthy");

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">
          {center.principle}
        </p>
        {center.philosophy ? <p className="mt-3 text-sm text-zinc-600">{center.philosophy}</p> : null}
        <p className="mt-3">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
              HEALTH_LABEL_BADGES[healthLabel] ?? HEALTH_LABEL_BADGES.healthy
            }`}
          >
            {healthLabel.replace(/_/g, " ")}
          </span>
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => void runAction("refresh_performance")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {labels.actions.refreshPerformance}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() =>
            void runAction("delegate_task", {
              assignment_title: "Executive Report Delegation",
              primary_specialist_key: "spec_executive",
              delegated_specialists: ["spec_revenue", "spec_risk", "spec_knowledge"],
            })
          }
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50"
        >
          {labels.actions.delegateTask}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() =>
            void runAction("create_collaboration", {
              coordination_title: "Multi-Specialist Coordination",
              request_summary: "Unified Aipify Companion response requested.",
              routing_chain: ["Compliance Companion", "Risk Companion", "Executive Companion"],
            })
          }
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50"
        >
          {labels.actions.createCollaboration}
        </button>
        <Link href="/app/companion/skills" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">
          {labels.actions.openSkills}
        </Link>
        <Link href="/app/companion/memory" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">
          {labels.actions.openMemory}
        </Link>
        <Link href="/app/approvals" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">
          {labels.actions.openApprovals}
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {ORCHESTRATION_TABS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OverviewCard label={labels.overview.registeredSpecialists} value={Number(overview.registered_specialists ?? 0)} />
          <OverviewCard label={labels.overview.activeSpecialists} value={Number(overview.active_specialists ?? 0)} />
          <OverviewCard label={labels.overview.busySpecialists} value={Number(overview.busy_specialists ?? 0)} />
          <OverviewCard label={labels.overview.reviewRequired} value={Number(overview.review_required ?? 0)} />
          <OverviewCard label={labels.overview.activeAssignments} value={Number(overview.active_assignments ?? 0)} />
          <OverviewCard label={labels.overview.coordinationEvents} value={Number(overview.coordination_events ?? 0)} />
          <OverviewCard label={labels.overview.pendingApprovals} value={Number(overview.pending_approvals ?? 0)} />
          <OverviewCard label={labels.overview.companionHealthScore} value={Number(overview.companion_health_score ?? 0)} />
        </dl>
      ) : null}

      {tab === "specialists" ? (
        <section className="grid gap-4 md:grid-cols-2">
          {specialists.map((s) => (
            <SpecialistCard key={s.specialist_key} specialist={s} labels={labels} />
          ))}
        </section>
      ) : null}

      {tab === "assignments" ? (
        <section className="space-y-3">
          <JsonList items={assignments} />
        </section>
      ) : null}

      {tab === "coordination" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{labels.sections.collaborationEvents}</h2>
            <div className="mt-4">
              <JsonList items={coordinationEvents} />
            </div>
          </section>
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{labels.sections.contextSharing}</h2>
            <div className="mt-4">
              <JsonList items={contextShares} />
            </div>
          </section>
          {unifiedPrinciple ? (
            <section className="col-span-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-zinc-900">{labels.sections.unifiedPrinciple}</h2>
              <p className="mt-2 text-sm text-zinc-600">
                User-facing: {String(unifiedPrinciple.user_facing_brand ?? "Aipify Companion")}
              </p>
            </section>
          ) : null}
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{labels.sections.teamStructures}</h2>
            <div className="mt-4">
              <JsonList items={teams} />
            </div>
          </section>
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{labels.sections.meetingCouncil}</h2>
            <div className="mt-4">
              <JsonList items={council} />
            </div>
          </section>
          <section className="col-span-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{labels.sections.decisionCollaborations}</h2>
            <div className="mt-4">
              <JsonList items={decisions} />
            </div>
          </section>
        </div>
      ) : null}

      {tab === "workloads" ? (
        <section className="space-y-3">
          {workloads.map((w, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 bg-white p-4 text-sm shadow-sm">
              <p className="font-medium text-zinc-900">{String(w.specialist_key)}</p>
              <p className="mt-1 text-zinc-500">
                Active: {String(w.assignments_active)} · Capacity: {String(w.capacity_pct)}% · Quality:{" "}
                {String(w.response_quality_score)} · Escalations: {String(w.escalation_count)}
              </p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "approvals" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-zinc-900">{labels.sections.approvalFlow}</h2>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-zinc-600">
            {approvalFlow.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <div className="mt-4">
            <JsonList items={approvalItems} />
          </div>
        </section>
      ) : null}

      {tab === "executive" ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(center.executive_dashboard ?? {}).map(([key, value]) => (
            <OverviewCard key={key} label={key.replace(/_/g, " ")} value={String(value)} />
          ))}
          <section className="col-span-full grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-zinc-900">{labels.sections.skillsIntegration}</h2>
              <p className="mt-2 text-sm text-zinc-600">
                Phase {String(skillsIntegration?.phase ?? "556")} · {String(skillsIntegration?.installed_skills_count ?? 0)} skills
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-zinc-900">{labels.sections.memoryIntegration}</h2>
              <p className="mt-2 text-sm text-zinc-600">
                Phase {String(memoryIntegration?.phase ?? "558")} · {String(memoryIntegration?.memory_items_count ?? 0)} memory items
              </p>
            </div>
            <div className="col-span-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-zinc-900">{labels.sections.businessPackSpecialists}</h2>
              <div className="mt-4">
                <JsonList items={packSpecialists} />
              </div>
            </div>
          </section>
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm text-sm text-zinc-600">
          <pre className="overflow-x-auto whitespace-pre-wrap">{JSON.stringify(center.reports ?? {}, null, 2)}</pre>
        </section>
      ) : null}

      {center.audit_recent?.length ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-zinc-900">{labels.sections.audit}</h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600">
            {center.audit_recent.map((entry, i) => (
              <li key={`${entry.event_type}-${i}`}>{entry.summary}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
