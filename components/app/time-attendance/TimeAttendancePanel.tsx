"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { parseTimeAttendanceCenter, type TimeAttendanceCenter } from "@/lib/time-attendance-engine/parse";
import { ta609SectionToRpc, type Ta609Section } from "@/lib/time-attendance-engine/config";
import type { buildTimeAttendanceLabels } from "@/lib/time-attendance-engine/labels";

type Labels = ReturnType<typeof buildTimeAttendanceLabels>;

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

function statusBadge(status: unknown): string | undefined {
  if (status && typeof status === "object" && "status_title" in (status as object)) {
    return String((status as Record<string, unknown>).status_title);
  }
  return undefined;
}

export function TimeAttendancePanel({ labels, activeSection }: { labels: Labels; activeSection: Ta609Section }) {
  const [center, setCenter] = useState<TimeAttendanceCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const section = ta609SectionToRpc(activeSection);
    const res = await fetch(`/api/time-attendance/center?section=${section}`);
    if (res.ok) setCenter(parseTimeAttendanceCenter(await res.json()));
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
        <button
          type="button"
          onClick={() => void load()}
          className="mt-4 rounded-lg border border-amber-300 px-4 py-2 text-sm font-medium hover:bg-amber-100"
        >
          {labels.refresh}
        </button>
      </div>
    );
  }

  const stats = center.stats ?? {};

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
        <p className="rounded-2xl border border-violet-100 bg-violet-50/60 px-5 py-4 text-sm text-violet-950">
          {center.principle}
        </p>
      ) : null}

      {center.distinction_note && activeSection === "overview" ? (
        <p className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs text-zinc-600">
          {center.distinction_note}
        </p>
      ) : null}

      {(activeSection === "overview" || activeSection === "reports") && (
        <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard label={labels.stats.hoursThisWeek} value={stats.hours_this_week ?? 0} />
            <StatCard label={labels.stats.pendingApprovals} value={stats.pending_approvals ?? 0} />
            <StatCard label={labels.stats.openCorrections} value={stats.open_corrections ?? 0} />
            <StatCard label={labels.stats.leavePending} value={stats.leave_pending ?? 0} />
            <StatCard label={labels.stats.payrollDrafts} value={stats.payroll_drafts ?? 0} />
          </div>
        </section>
      )}

      {activeSection === "overview" && (center.companion_recommendations?.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.companionRecommendations}</h3>
          {(center.companion_recommendations ?? []).map((rec, i) => (
            <ItemCard
              key={i}
              title={String(rec.observation ?? labels.companionTimeAdvisor)}
              summary={String(rec.recommendation ?? "")}
              extra={
                rec.href ? (
                  <Link href={String(rec.href)} className="mt-2 inline-block text-sm font-medium text-violet-700 hover:underline">
                    {labels.sections.approvals}
                  </Link>
                ) : null
              }
            />
          ))}
        </section>
      )}

      {(activeSection === "myTime" || activeSection === "teamTime") && (
        <section className="grid gap-3">
          {(center.time_records ?? []).length === 0 ? (
            <p className="text-sm text-zinc-500">{labels.noRecords}</p>
          ) : (
            (center.time_records ?? []).map((r) => (
              <ItemCard
                key={String(r.record_key)}
                title={`${String(r.employee_label)} — ${String(r.hours)}h`}
                summary={String(r.summary ?? "")}
                badge={statusBadge(r.status) ?? String(r.entry_method_key ?? "")}
                extra={
                  r.project_label ? (
                    <p className="mt-1 text-xs text-zinc-500">{String(r.project_label)}</p>
                  ) : null
                }
              />
            ))
          )}
        </section>
      )}

      {activeSection === "attendance" && (
        <section className="grid gap-3">
          {(center.attendance ?? []).map((a) => (
            <ItemCard
              key={String(a.attendance_key)}
              title={String(a.employee_label)}
              summary={String(a.summary ?? a.privacy_note ?? "")}
              badge={statusBadge(a.status) ?? String(a.confirmation_status ?? "")}
            />
          ))}
        </section>
      )}

      {(activeSection === "leave" || activeSection === "balances") && (
        <section className="space-y-4">
          {activeSection === "leave" &&
            (center.leave_requests ?? []).map((l) => (
              <ItemCard
                key={String(l.request_key)}
                title={`${String(l.employee_label)} — ${String(l.leave_type_key)}`}
                summary={String(l.summary ?? "")}
                badge={statusBadge(l.status) ?? String(l.request_status ?? "")}
                extra={
                  l.vacation_mode_offered ? (
                    <p className="mt-2 text-xs text-violet-700">{labels.integrations}</p>
                  ) : null
                }
              />
            ))}
          {activeSection === "balances" &&
            (center.leave_balances ?? []).map((b) => (
              <ItemCard
                key={String(b.balance_key)}
                title={`${String(b.employee_label)} — ${String(b.leave_type_key)}`}
                summary={`${String(b.available_hours)}h ${labels.noRecords ? "" : "available"}`}
                badge={`${String(b.used_hours)}h used`}
              />
            ))}
        </section>
      )}

      {activeSection === "timesheets" && (
        <section className="grid gap-3">
          {(center.timesheets ?? []).map((t) => (
            <ItemCard
              key={String(t.timesheet_key)}
              title={String(t.period_label)}
              summary={String(t.summary ?? "")}
              badge={statusBadge(t.status) ?? String(t.approval_stage ?? "")}
              extra={<p className="mt-1 text-xs text-zinc-500">{String(t.total_hours)}h total</p>}
            />
          ))}
        </section>
      )}

      {activeSection === "overtime" && (
        <section className="grid gap-3">
          {(center.overtime ?? []).map((o) => (
            <ItemCard
              key={String(o.overtime_key)}
              title={String(o.employee_label)}
              summary={String(o.summary ?? "")}
              badge={statusBadge(o.status) ?? String(o.overtime_hours)}
            />
          ))}
        </section>
      )}

      {activeSection === "corrections" && (
        <section className="grid gap-3">
          {(center.corrections ?? []).map((c) => (
            <ItemCard
              key={String(c.correction_key)}
              title={String(c.employee_label)}
              summary={String(c.summary ?? "")}
              badge={String(c.correction_type ?? c.correction_status ?? "")}
            />
          ))}
        </section>
      )}

      {activeSection === "approvals" && (
        <section className="grid gap-3">
          {(center.timesheets ?? [])
            .filter((t) => String(t.timesheet_status).includes("approval"))
            .map((t) => (
              <ItemCard
                key={String(t.timesheet_key)}
                title={String(t.period_label)}
                summary={String(t.summary ?? "")}
                badge={statusBadge(t.status)}
              />
            ))}
        </section>
      )}

      {activeSection === "payrollPreparation" && (
        <section className="grid gap-3">
          {(center.payroll_prep ?? []).map((p) => (
            <ItemCard
              key={String(p.prep_key)}
              title={String(p.prep_title)}
              summary={String(p.summary ?? "")}
              badge={String(p.connector_type ?? p.prep_status ?? "")}
              extra={<p className="mt-1 text-xs text-zinc-500">{String(p.total_hours)}h</p>}
            />
          ))}
        </section>
      )}

      {activeSection === "projects" && (
        <section className="grid gap-3 sm:grid-cols-2">
          {(center.projects ?? []).map((p) => (
            <ItemCard
              key={String(p.project_key)}
              title={String(p.project_title)}
              summary={String(p.summary ?? "")}
              badge={p.billable ? "billable" : "non-billable"}
            />
          ))}
        </section>
      )}

      {activeSection === "policies" && (
        <section className="space-y-4">
          {(center.policies ?? []).map((p) => (
            <ItemCard
              key={String(p.policy_key)}
              title={String(p.policy_title)}
              summary={String(p.summary ?? p.legal_warning ?? "")}
              badge={String(p.policy_type ?? "")}
            />
          ))}
        </section>
      )}

      {activeSection === "reports" && (
        <section className="space-y-4">
          {(center.analytics ?? []).map((a) => (
            <ItemCard
              key={String(a.metric_key)}
              title={String(a.metric_title)}
              summary={String(a.fairness_note ?? a.summary ?? "")}
              badge={`${String(a.metric_value)} ${String(a.metric_unit ?? "")}`}
            />
          ))}
          {(center.integrations ?? []).length > 0 && (
            <div>
              <h3 className="mb-2 font-semibold text-zinc-900">{labels.integrations}</h3>
              <div className="grid gap-2">
                {(center.integrations ?? []).map((i) => (
                  <Link
                    key={String(i.integration_key)}
                    href={String(i.cross_link_href || "#")}
                    className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm hover:border-violet-200"
                  >
                    <span className="font-medium">{String(i.integration_title)}</span>
                    <span className="mt-1 block text-xs text-zinc-500">{String(i.summary ?? "")}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
