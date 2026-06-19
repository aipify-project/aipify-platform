"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseDigitalEmployeeCenter,
  filterTasksByStatus,
  type DigitalEmployeeCenter,
} from "@/lib/digital-employee-center-engine/parse";
import type { Dewf598Section } from "@/lib/digital-employee-center-engine/config";
import { dewf598SectionToRpc } from "@/lib/digital-employee-center-engine/config";
import type { buildDigitalEmployeeCenterLabels } from "@/lib/digital-employee-center-engine/labels";

type Labels = ReturnType<typeof buildDigitalEmployeeCenterLabels>;

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function ItemCard({
  title,
  summary,
  badge,
  extra,
}: {
  title: string;
  summary?: string;
  badge?: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-semibold text-zinc-900">{title}</p>
        {badge ? (
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium capitalize text-zinc-700">
            {badge.replace(/_/g, " ")}
          </span>
        ) : null}
      </div>
      {summary ? <p className="mt-2 text-sm text-zinc-600">{summary}</p> : null}
      {extra}
    </div>
  );
}

export function DigitalEmployeeCenterPanel({
  labels,
  activeSection,
}: {
  labels: Labels;
  activeSection: Dewf598Section;
}) {
  const [center, setCenter] = useState<DigitalEmployeeCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const rpcSection = dewf598SectionToRpc(activeSection);
    const res = await fetch(`/api/digital-employee-center/center?section=${rpcSection}`);
    if (res.ok) setCenter(parseDigitalEmployeeCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, [activeSection]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.empty}</p>
        {center?.error ? <p className="mt-2 text-sm">{center.error}</p> : null}
      </div>
    );
  }

  const stats = center.stats ?? {};
  const exec = center.executive_dashboard ?? {};
  const tasks = center.tasks ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{labels.sections[activeSection]}</h2>
          {center.privacy_note ? <p className="mt-1 text-xs text-zinc-500">{center.privacy_note}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          {labels.refresh}
        </button>
      </div>

      {center.principle ? (
        <p className="rounded-2xl border border-violet-100 bg-violet-50/70 px-5 py-4 text-sm text-violet-950">
          {center.principle}
        </p>
      ) : null}

      {(activeSection === "overview" || activeSection === "reports") && (
        <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-600">{labels.executiveDashboard}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label={labels.executive.digitalEmployees} value={exec.digital_employees ?? 0} />
            <StatCard label={labels.executive.taskVolume} value={exec.task_volume ?? 0} />
            <StatCard label={labels.executive.avgPerformance} value={exec.avg_performance ?? 0} />
            <StatCard label={labels.executive.openEscalations} value={exec.open_escalations ?? 0} />
            <StatCard label={labels.executive.pendingApprovals} value={exec.pending_approvals ?? 0} />
            <StatCard label={labels.executive.activeTeams} value={exec.active_teams ?? 0} />
          </div>
        </section>
      )}

      {activeSection === "overview" && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label={labels.stats.employees} value={stats.employees ?? 0} />
            <StatCard label={labels.stats.roles} value={stats.roles ?? 0} />
            <StatCard label={labels.stats.tasks} value={stats.tasks ?? 0} />
            <StatCard label={labels.stats.teams} value={stats.teams ?? 0} />
            <StatCard label={labels.stats.escalations} value={stats.escalations ?? 0} />
            <StatCard label={labels.stats.performanceMetrics} value={stats.performance_metrics ?? 0} />
          </section>
          {(center.companion_recommendations?.length ?? 0) > 0 && (
            <section className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.companionRecommendations}</h3>
              {(center.companion_recommendations ?? []).map((rec, i) => (
                <ItemCard
                  key={i}
                  title={String(rec.task_title ?? "Insight")}
                  summary={String(rec.recommendation ?? "")}
                />
              ))}
            </section>
          )}
        </>
      )}

      {activeSection === "employees" && (
        <section className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {(center.employees ?? []).map((e) => (
              <ItemCard
                key={String(e.employee_key)}
                title={String(e.employee_name)}
                summary={String(e.summary ?? "")}
                badge={`${String(e.employee_role ?? "")} · L${String(e.autonomy_level ?? 0)}`}
                extra={
                  <p className="mt-1 text-xs text-zinc-500">
                    {String(e.department ?? "")} · performance {String(e.performance_score ?? 0)}
                  </p>
                }
              />
            ))}
          </div>
          {(center.teams ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.digitalTeams}</h3>
              {(center.teams ?? []).map((t) => (
                <ItemCard
                  key={String(t.team_key)}
                  title={String(t.team_title)}
                  summary={String(t.summary ?? "")}
                  badge={`${String(t.member_count ?? 0)} members`}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {activeSection === "roles" && (
        <section className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900">{labels.roleSimulation}</h3>
            {(center.roles ?? []).map((r) => (
              <ItemCard
                key={String(r.role_key)}
                title={String(r.role_title)}
                summary={String(r.summary ?? "")}
                badge={String(r.role_type ?? "")}
              />
            ))}
          </div>
          {(center.responsibilities ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.responsibilityFramework}</h3>
              {(center.responsibilities ?? []).map((r) => (
                <ItemCard
                  key={String(r.responsibility_key)}
                  title={String(r.responsibility_title)}
                  summary={String(r.summary ?? "")}
                  badge={String(r.responsibility_type ?? "")}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {activeSection === "assignments" && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.taskEngine}</h3>
          {tasks.map((t) => (
            <ItemCard
              key={String(t.task_key)}
              title={String(t.task_title)}
              summary={String(t.summary ?? "")}
              badge={`${String(t.task_status ?? "")} · ${String(t.assigned_to ?? "")}`}
            />
          ))}
        </section>
      )}

      {activeSection === "performance" && (
        <section className="grid gap-3 sm:grid-cols-2">
          {(center.performance_metrics ?? []).map((m) => (
            <ItemCard
              key={String(m.metric_key)}
              title={String(m.metric_title)}
              summary={String(m.summary ?? "")}
              badge={String(m.metric_score ?? 0)}
            />
          ))}
        </section>
      )}

      {activeSection === "approvals" && (
        <section className="space-y-6">
          <div className="grid gap-3">
            {[...filterTasksByStatus(tasks, "pending"), ...filterTasksByStatus(tasks, "escalated")].map((t) => (
              <ItemCard
                key={String(t.task_key)}
                title={String(t.task_title)}
                summary={String(t.summary ?? "")}
                badge={String(t.task_status ?? "")}
              />
            ))}
          </div>
          {(center.escalations ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.escalationEngine}</h3>
              {(center.escalations ?? []).map((e) => (
                <ItemCard
                  key={String(e.escalation_key)}
                  title={String(e.escalation_title)}
                  summary={String(e.summary ?? "")}
                  badge={String(e.escalation_reason ?? "")}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {activeSection === "permissions" && (
        <section className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900">{labels.autonomyLevels}</h3>
            {(center.autonomy_levels ?? []).map((a) => (
              <ItemCard
                key={String(a.autonomy_key)}
                title={String(a.autonomy_title)}
                summary={String(a.summary ?? "")}
                badge={`Level ${String(a.autonomy_level ?? 0)}`}
              />
            ))}
          </div>
          {(center.responsibilities ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.responsibilityFramework}</h3>
              {(center.responsibilities ?? []).map((r) => (
                <ItemCard
                  key={String(r.responsibility_key)}
                  title={String(r.responsibility_title)}
                  summary={String(r.summary ?? "")}
                  badge={String(r.responsibility_type ?? "")}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {activeSection === "reports" && (
        <section className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900">{labels.workforceAdvisor}</h3>
            {Object.entries(center.reports ?? {}).map(([key, prompt]) => (
              <ItemCard key={key} title={String(prompt)} badge={key.replace(/_/g, " ")} />
            ))}
          </div>
          {(center.collaboration ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.humanDigitalCollaboration}</h3>
              {(center.collaboration ?? []).map((c) => (
                <ItemCard
                  key={String(c.collaboration_key)}
                  title={String(c.collaboration_title)}
                  summary={String(c.summary ?? "")}
                  badge={String(c.workflow_stage ?? "")}
                />
              ))}
            </div>
          )}
          {(center.business_packs ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.businessPackIntegration}</h3>
              {(center.business_packs ?? []).map((pack) => (
                <ItemCard
                  key={String(pack.pack_key)}
                  title={String(pack.pack_title)}
                  summary={String(pack.summary ?? "")}
                  badge={String(pack.deployed_role ?? "")}
                />
              ))}
            </div>
          )}
          {(center.audit_recent ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">Audit</h3>
              {(center.audit_recent ?? []).map((entry, i) => (
                <ItemCard
                  key={i}
                  title={String(entry.event_type ?? "")}
                  summary={String(entry.summary ?? "")}
                  extra={entry.created_at ? <p className="mt-1 text-xs text-zinc-500">{String(entry.created_at)}</p> : null}
                />
              ))}
            </div>
          )}
          {center.mobile_access && (
            <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4">
              <h3 className="font-semibold text-zinc-900">{labels.mobileAccess}</h3>
              <ul className="mt-2 flex flex-wrap gap-2 text-sm text-zinc-700">
                {Object.entries(center.mobile_access).map(([cap, enabled]) => (
                  <li key={cap} className="rounded-full bg-white px-3 py-1 ring-1 ring-violet-100">
                    {cap.replace(/_/g, " ")}: {enabled === true ? "✓" : "—"}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
