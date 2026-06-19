"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  EMPLOYEE_STATUS_BADGES,
  GOVERNANCE_SEVERITY_BADGES,
  PERFORMANCE_STATUS_BADGES,
  parseAiWorkforceCenter,
  type AiWorkforceCenter,
  type AiWorkforceLabels,
  type AiWorkforceTab,
  type DigitalEmployeeRow,
} from "@/lib/customer-workforce-operations";

type Props = {
  labels: AiWorkforceLabels;
  backHref: string;
  initialTab?: AiWorkforceTab;
  visibleTabs?: AiWorkforceTab[];
  titleOverride?: string;
  subtitleOverride?: string;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

const ALL_TABS: AiWorkforceTab[] = [
  "overview", "employees", "departments", "assignments", "performance",
  "training", "governance", "companion", "executive", "reports",
];

export function AiWorkforcePanel({
  labels, backHref, initialTab = "overview", visibleTabs, titleOverride, subtitleOverride,
}: Props) {
  const tabs = visibleTabs ?? ALL_TABS;
  const [center, setCenter] = useState<AiWorkforceCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<AiWorkforceTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/workforce-operations");
    if (res.ok) setCenter(parseAiWorkforceCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  const runAction = useCallback(async (action_type: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch("/api/app/workforce-operations/action", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action_type, payload }),
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
  const employees = center.digital_employee_registry ?? [];
  const departments = center.digital_departments ?? [];
  const assignments = center.assignment_engine ?? [];
  const skills = center.skills_framework ?? [];
  const training = center.training_engine ?? [];
  const performance = center.performance_engine ?? [];
  const teams = center.team_structures ?? [];
  const packRoles = center.business_pack_integration ?? [];
  const marketplace = center.marketplace_prepared ?? [];
  const governance = center.governance_center ?? [];
  const advisorPrompts = (center.companion_workforce_manager?.advisor_prompts as string[]) ?? [];
  const permissions = (center.permission_framework?.allowed_actions as string[]) ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← {labels.back}</Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{titleOverride ?? labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{subtitleOverride ?? labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">{center.principle}</p>
        {center.supervisor_rule ? (
          <p className="mt-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">{labels.supervisorRule}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/app/workforce/employees" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{labels.actions.openEmployees}</Link>
        <Link href="/app/workforce/training" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openTraining}</Link>
        <Link href="/app/companion-workforce-engine" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openLegacyWorkforce}</Link>
        <button type="button" disabled={busy} onClick={() => void runAction("create_digital_employee", { display_name: "New Digital Employee", role_title: "Assistant", employee_type: "custom" })} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium disabled:opacity-50">{labels.actions.createEmployee}</button>
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
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OverviewCard label={labels.overview.digitalEmployees} value={overview.digital_employees ?? 0} />
          <OverviewCard label={labels.overview.activeEmployees} value={overview.active_employees ?? 0} />
          <OverviewCard label={labels.overview.departments} value={overview.departments ?? 0} />
          <OverviewCard label={labels.overview.assignments} value={overview.assignments ?? 0} />
          <OverviewCard label={labels.overview.trainingInProgress} value={overview.training_in_progress ?? 0} />
          <OverviewCard label={labels.overview.governanceOpen} value={overview.governance_open ?? 0} />
          <OverviewCard label={labels.overview.avgPerformanceScore} value={overview.avg_performance_score ?? 0} />
          <OverviewCard label={labels.overview.hybridTeams} value={overview.hybrid_teams ?? 0} />
        </dl>
      ) : null}

      {tab === "employees" ? (
        <section className="space-y-4">
          {employees.map((e: DigitalEmployeeRow) => (
            <div key={e.id} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-zinc-900">{e.display_name}</p>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${EMPLOYEE_STATUS_BADGES[e.status ?? "active"] ?? EMPLOYEE_STATUS_BADGES.active}`}>
                  {labels.employeeStatuses[e.status ?? "active"] ?? e.status}
                </span>
              </div>
              <p className="text-xs text-zinc-500">{e.employee_id_label} · {e.role_title} · {e.employee_type} · Manager: {e.assigned_manager} · Owner: {e.owner_label}</p>
              <p className="mt-1 text-sm text-zinc-600">{e.activity_summary}</p>
            </div>
          ))}
          <button type="button" disabled={busy} onClick={() => void runAction("create_digital_employee", { display_name: "Support Assistant", employee_type: "support_specialist" })} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{labels.actions.createEmployee}</button>
        </section>
      ) : null}

      {tab === "departments" ? (
        <section className="space-y-3">
          {departments.map((d) => (
            <div key={String(d.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(d.department_name)} · {String(d.department_type)}</p>
              <p className="mt-1 text-zinc-600">{String(d.summary)}</p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "assignments" ? (
        <section className="space-y-4">
          {assignments.map((a) => (
            <div key={String(a.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(a.employee_label)} → {String(a.target_label)}</p>
              <p className="text-zinc-500">{String(a.assignment_type)} · {String(a.tasks_completed)}/{String(a.tasks_assigned)} tasks · {String(a.approvals_required)} approvals</p>
              <p className="mt-1 text-zinc-600">{String(a.summary)}</p>
            </div>
          ))}
          <button type="button" disabled={busy} onClick={() => void runAction("create_assignment", { employee_label: "Digital Employee", assignment_type: "task", target_label: "New Assignment" })} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm disabled:opacity-50">{labels.actions.createAssignment}</button>
        </section>
      ) : null}

      {tab === "performance" ? (
        <section className="space-y-4">
          {performance.map((p) => (
            <div key={String(p.employee_key)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-zinc-900">{String(p.employee_label)} · Score {String(p.digital_employee_score)}</p>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${PERFORMANCE_STATUS_BADGES[String(p.performance_status)] ?? PERFORMANCE_STATUS_BADGES.healthy}`}>
                  {labels.performanceStatuses[String(p.performance_status)] ?? String(p.performance_status)}
                </span>
              </div>
              <p className="text-zinc-500">Quality {String(p.response_quality_score)} · Approval {String(p.approval_success_pct)}% · Escalation {String(p.escalation_accuracy_pct)}%</p>
              <p className="mt-1 text-zinc-600">{String(p.summary)}</p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "training" ? (
        <section className="space-y-4">
          {training.map((t) => (
            <div key={String(t.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(t.employee_label)} · {String(t.source_label)}</p>
              <p className="text-zinc-500">{String(t.training_source)} · {String(t.progress_pct)}% · {String(t.status)}</p>
              <p className="mt-1 text-zinc-600">{String(t.summary)}</p>
            </div>
          ))}
          <button type="button" disabled={busy} onClick={() => void runAction("complete_training", { training_key: "tr_exec_brief" })} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm disabled:opacity-50">{labels.actions.completeTraining}</button>
        </section>
      ) : null}

      {tab === "governance" ? (
        <section className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
            <h2 className="font-semibold text-zinc-900">Permission Framework</h2>
            <p className="mt-2 text-zinc-600">Explicit permissions: {permissions.join(", ")}</p>
          </div>
          {governance.map((g) => (
            <div key={String(g.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-zinc-900">{String(g.summary)}</p>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${GOVERNANCE_SEVERITY_BADGES[String(g.severity)] ?? GOVERNANCE_SEVERITY_BADGES.information}`}>
                  {labels.governanceSeverities[String(g.severity)] ?? String(g.severity)}
                </span>
              </div>
              <p className="text-zinc-500">{String(g.event_type)} · {String(g.status)}</p>
            </div>
          ))}
          {skills.map((s) => (
            <div key={String(s.id)} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm">
              {String(s.skill_name)} — {String(s.permission_scope)} {String(s.governed) === "true" ? "(governed)" : ""}
            </div>
          ))}
        </section>
      ) : null}

      {tab === "companion" ? (
        <section className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <h2 className="font-semibold text-zinc-900">Companion Workforce Manager</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600">
              {advisorPrompts.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          {teams.map((t) => (
            <div key={String(t.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(t.team_name)} · {String(t.workload_model)}</p>
              <p className="text-zinc-600">{String(t.workload_balance_summary)}</p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "executive" ? (
        <section className="space-y-4">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(center.executive_dashboard ?? {}).map(([key, value]) => (
              <OverviewCard key={key} label={key.replace(/_/g, " ")} value={String(value)} />
            ))}
          </dl>
          {packRoles.map((b) => (
            <div key={String(b.id)} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm">
              {String(b.pack_label)} — {String(b.digital_role)} · {String(b.summary)}
            </div>
          ))}
          {marketplace.map((m) => (
            <div key={String(m.id)} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm">
              Marketplace: {String(m.role_name)} — {String(m.install_status)}
            </div>
          ))}
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-zinc-600">{JSON.stringify(center.reports ?? {}, null, 2)}</pre>
        </section>
      ) : null}

      {center.audit_recent?.length ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-zinc-900">Audit</h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600">
            {center.audit_recent.map((entry, i) => <li key={`${entry.event_type}-${i}`}>{entry.summary}</li>)}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
