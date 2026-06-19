"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import {
  parsePeopleOperationsCenter,
  type AttendanceRecord,
  type DevelopmentRecord,
  type LeaveRequest,
  type PeopleEmployee,
  type PeopleGoal,
  type PeopleOperationsCenter,
  type PeopleOperationsLabels,
  type PerformanceReview,
  type Recognition,
  type WorkforcePlan,
} from "@/lib/people-operations";

type Tab =
  | "overview"
  | "workforce"
  | "attendance"
  | "leave"
  | "development"
  | "reviews"
  | "planning"
  | "goals"
  | "reports";

const STATUS_STYLE: Record<string, string> = {
  present: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  scheduled: "bg-sky-50 text-sky-900 ring-sky-200",
  absent: "bg-amber-50 text-amber-900 ring-amber-200",
  remote: "bg-violet-50 text-violet-900 ring-violet-200",
  completed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  pending: "bg-amber-50 text-amber-900 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  rejected: "bg-red-50 text-red-900 ring-red-200",
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  at_risk: "bg-amber-50 text-amber-900 ring-amber-200",
  achieved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  missed: "bg-red-50 text-red-900 ring-red-200",
  planned: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
  in_progress: "bg-sky-50 text-sky-900 ring-sky-200",
  draft: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
};

type Props = {
  labels: PeopleOperationsLabels;
  initialTab?: Tab;
};

export function PeopleOperationsPanel({ labels, initialTab = "overview" }: Props) {
  const [center, setCenter] = useState<PeopleOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [busy, setBusy] = useState(false);
  const [goalTitle, setGoalTitle] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/people-operations");
    if (res.ok) setCenter(parsePeopleOperationsCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/people-operations/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
  }

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (!center?.found) {
    return <AipifyModuleAccessDenied message={labels.accessDenied} />;
  }

  const overview = center.overview ?? {};
  const reports = center.reports ?? {};
  const workforce = center.workforce ?? [];
  const attendance = center.attendance ?? [];
  const leaveRequests = center.leave_requests ?? [];
  const pendingLeave = center.pending_leave ?? [];
  const development = center.development ?? [];
  const reviews = center.performance_reviews ?? [];
  const goals = center.goals ?? [];
  const planning = center.workforce_planning ?? [];
  const recognitions = center.recognitions ?? [];
  const employeesRoute = center.routes?.employees ?? "/app/employees";

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: labels.overview },
    { id: "workforce", label: labels.workforce },
    { id: "attendance", label: labels.attendance },
    { id: "leave", label: labels.leave },
    { id: "development", label: labels.development },
    { id: "reviews", label: labels.reviews },
    { id: "planning", label: labels.planning },
    { id: "goals", label: labels.goals },
    { id: "reports", label: labels.reports },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-semibold text-aipify-text">{labels.title}</h1>
        <p className="mt-1 text-sm text-aipify-text-secondary">{labels.subtitle}</p>
        <p className="mt-2 text-xs text-aipify-text-muted">{center.principle ?? labels.principle}</p>
        <p className="mt-1 text-xs text-aipify-text-muted">{labels.mobileReady}</p>
      </header>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={
              tab === item.id
                ? `${AipifyShellClasses.primaryButton} text-sm`
                : `${AipifyShellClasses.secondaryButton} text-sm`
            }
          >
            {item.label}
          </button>
        ))}
      </nav>

      {tab === "overview" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              [labels.workforceSize, overview.workforce_size],
              [labels.presentToday, overview.present_today],
              [labels.onLeaveToday, overview.on_leave_today],
              [labels.pendingLeave, overview.pending_leave],
              [labels.upcomingReviews, overview.upcoming_reviews],
              [labels.activeGoals, overview.active_goals],
              [labels.trainingInProgress, overview.training_in_progress],
              [labels.openPositions, overview.open_positions],
            ] as [string, string | number][]
          ).map(([label, value]) => (
            <div key={String(label)} className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <p className="text-xs text-aipify-text-muted">{label}</p>
              <p className="mt-1 text-xl font-semibold text-aipify-text">{value ?? "—"}</p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "workforce" ? (
        <div className="space-y-4">
          <Link href={employeesRoute} className={AipifyShellClasses.secondaryButton}>
            {labels.viewEmployees}
          </Link>
          {workforce.length === 0 ? (
            <PlatformEmptyState title={labels.noWorkforce} message={labels.noWorkforceHint} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-aipify-border text-left text-aipify-text-muted">
                    <th className="py-2 pr-4">{labels.employee}</th>
                    <th className="py-2 pr-4">{labels.department}</th>
                    <th className="py-2 pr-4">{labels.manager}</th>
                    <th className="py-2 pr-4">{labels.role}</th>
                    <th className="py-2 pr-4">{labels.location}</th>
                    <th className="py-2">{labels.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {workforce.map((emp: PeopleEmployee) => (
                    <tr key={emp.id} className="border-b border-aipify-border/60">
                      <td className="py-3 pr-4">
                        <p className="font-medium text-aipify-text">{emp.full_name}</p>
                        <p className="text-xs text-aipify-text-muted">{emp.employee_number ?? emp.email}</p>
                      </td>
                      <td className="py-3 pr-4 text-aipify-text-secondary">{emp.department_name ?? "—"}</td>
                      <td className="py-3 pr-4 text-aipify-text-secondary">{emp.manager_name ?? "—"}</td>
                      <td className="py-3 pr-4 text-aipify-text-secondary">{emp.job_title ?? emp.org_role ?? "—"}</td>
                      <td className="py-3 pr-4 text-aipify-text-secondary">{emp.office_location ?? "—"}</td>
                      <td className="py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLE[emp.employee_status ?? "active"] ?? STATUS_STYLE.active}`}
                        >
                          {emp.employee_status?.replace(/_/g, " ") ?? "active"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}

      {tab === "attendance" ? (
        <div className="grid gap-3">
          {attendance.length === 0 ? (
            <PlatformEmptyState title={labels.noAttendance} message={labels.noWorkforceHint} />
          ) : (
            attendance.map((rec: AttendanceRecord) => (
              <div key={rec.id} className={`${AipifyShellClasses.surfaceCard} flex flex-wrap items-center justify-between gap-2 p-4 text-sm`}>
                <div>
                  <p className="font-semibold text-aipify-text">{rec.employee_name ?? "—"}</p>
                  <p className="text-aipify-text-secondary">
                    {rec.attendance_date ?? "—"} · {rec.work_hours ?? 0}h · {rec.location || "—"}
                  </p>
                </div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLE[rec.status] ?? STATUS_STYLE.present}`}
                >
                  {rec.status.replace(/_/g, " ")}
                </span>
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "leave" ? (
        <div className="space-y-4">
          {pendingLeave.length > 0 ? (
            <section>
              <h2 className="mb-2 text-sm font-semibold text-aipify-text">{labels.pendingLeave}</h2>
              <div className="grid gap-3">
                {pendingLeave.map((req: LeaveRequest) => (
                  <div key={req.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                    <p className="font-semibold text-aipify-text">{req.employee_name ?? "—"}</p>
                    <p className="text-aipify-text-secondary">
                      {req.leave_type.replace(/_/g, " ")} · {req.start_date} – {req.end_date}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button type="button" disabled={busy} onClick={() => void runAction("approve_leave", { leave_id: req.id })} className={AipifyShellClasses.primaryButton}>
                        {labels.approveLeave}
                      </button>
                      <button type="button" disabled={busy} onClick={() => void runAction("reject_leave", { leave_id: req.id })} className={AipifyShellClasses.secondaryButton}>
                        {labels.rejectLeave}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
          {leaveRequests.length === 0 ? (
            <PlatformEmptyState title={labels.noLeave} message={labels.noWorkforceHint} />
          ) : (
            leaveRequests.map((req: LeaveRequest) => (
              <div key={req.id} className={`${AipifyShellClasses.surfaceCard} flex flex-wrap items-center justify-between gap-2 p-4 text-sm`}>
                <div>
                  <p className="text-xs text-aipify-text-muted">{req.request_number}</p>
                  <p className="font-semibold text-aipify-text">{req.employee_name ?? "—"}</p>
                  <p className="text-aipify-text-secondary">
                    {req.leave_type.replace(/_/g, " ")} · {req.start_date} – {req.end_date}
                  </p>
                </div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLE[req.status] ?? STATUS_STYLE.pending}`}
                >
                  {req.status}
                </span>
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "development" ? (
        <div className="grid gap-3 md:grid-cols-2">
          {development.map((dev: DevelopmentRecord) => (
            <div key={dev.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="text-xs text-aipify-text-muted">{dev.development_type.replace(/_/g, " ")}</p>
              <h3 className="font-semibold text-aipify-text">{dev.title}</h3>
              <p className="text-aipify-text-secondary">{dev.employee_name ?? "—"}</p>
              {dev.business_pack_key ? <p className="text-aipify-text-muted">Pack: {dev.business_pack_key}</p> : null}
              {dev.expires_at ? <p className="text-aipify-text-muted">Expires: {dev.expires_at}</p> : null}
              <span
                className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLE[dev.status] ?? STATUS_STYLE.in_progress}`}
              >
                {dev.status.replace(/_/g, " ")}
              </span>
              {dev.status === "in_progress" ? (
                <button type="button" disabled={busy} onClick={() => void runAction("complete_development", { development_id: dev.id })} className={`mt-3 ${AipifyShellClasses.primaryButton}`}>
                  {labels.trainingCompleted}
                </button>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {tab === "reviews" ? (
        <div className="grid gap-3">
          {reviews.length === 0 ? (
            <PlatformEmptyState title={labels.noReviews} message={labels.noWorkforceHint} />
          ) : (
            reviews.map((rev: PerformanceReview) => (
              <div key={rev.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="text-xs text-aipify-text-muted">{rev.review_number}</p>
                <h3 className="font-semibold text-aipify-text">{rev.employee_name ?? "—"}</h3>
                <p className="text-aipify-text-secondary">
                  {rev.review_type.replace(/_/g, " ")} · {rev.review_period ?? "—"}
                  {rev.rating != null ? ` · ${rev.rating}` : ""}
                </p>
                <span
                  className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLE[rev.status] ?? STATUS_STYLE.draft}`}
                >
                  {rev.status.replace(/_/g, " ")}
                </span>
                {rev.status === "in_progress" ? (
                  <button type="button" disabled={busy} onClick={() => void runAction("complete_review", { review_id: rev.id, rating: 4 })} className={`mt-3 ${AipifyShellClasses.primaryButton}`}>
                    {labels.completeReview}
                  </button>
                ) : null}
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "planning" ? (
        <div className="grid gap-3 md:grid-cols-2">
          {planning.map((plan: WorkforcePlan) => (
            <div key={plan.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <h3 className="font-semibold text-aipify-text">{plan.department_name ?? labels.department}</h3>
              <p className="text-aipify-text-secondary">
                {labels.headcount}: {plan.headcount_current ?? 0} → {plan.headcount_target ?? 0}
              </p>
              <p className="text-aipify-text-secondary">
                {labels.openPositions}: {plan.open_positions ?? 0} · Capacity: {plan.capacity_score ?? 0}%
              </p>
              {plan.hiring_needs ? <p className="mt-2 text-aipify-text-muted">{plan.hiring_needs}</p> : null}
            </div>
          ))}
        </div>
      ) : null}

      {tab === "goals" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} placeholder={labels.goalTitle} className={AipifyShellClasses.input} />
            <button
              type="button"
              disabled={busy || !goalTitle.trim()}
              onClick={() =>
                void runAction("create_goal", { title: goalTitle.trim(), goal_scope: "organization", status: "active" }).then(() =>
                  setGoalTitle(""),
                )
              }
              className={AipifyShellClasses.primaryButton}
            >
              {labels.createGoal}
            </button>
          </div>
          {goals.length === 0 ? (
            <PlatformEmptyState title={labels.noGoals} message={labels.noWorkforceHint} />
          ) : (
            goals.map((goal: PeopleGoal) => (
              <div key={goal.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="text-xs text-aipify-text-muted">{goal.goal_number}</p>
                <h3 className="font-semibold text-aipify-text">{goal.title}</h3>
                <p className="text-aipify-text-secondary">
                  {goal.goal_scope.replace(/_/g, " ")} · {goal.employee_name ?? "Organization"}
                  {goal.target_date ? ` · ${goal.target_date}` : ""}
                </p>
                <p className="text-aipify-text-muted">Progress: {goal.progress_percent ?? 0}%</p>
                <span
                  className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLE[goal.status] ?? STATUS_STYLE.planned}`}
                >
                  {goal.status.replace(/_/g, " ")}
                </span>
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "reports" ? (
        <div className={`${AipifyShellClasses.surfaceCard} space-y-3 p-4 text-sm`}>
          <p>
            {labels.headcount}: {String(reports.headcount ?? 0)}
          </p>
          <p>
            {labels.leaveUsage}: {String(reports.leave_usage_month ?? 0)}
          </p>
          <p>
            {labels.reviewCompletion}: {String(reports.review_completion_rate ?? 0)}%
          </p>
          <p>
            {labels.goalAchievement}: {String(reports.goal_achievement_rate ?? 0)}%
          </p>
          <p>
            {labels.trainingCompleted}: {String(reports.training_completed ?? 0)}
          </p>
        </div>
      ) : null}

      {recognitions.length > 0 ? (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-aipify-text">{labels.recognition}</h2>
          <ul className={`${AipifyShellClasses.surfaceCard} divide-y divide-aipify-border text-sm`}>
            {recognitions.map((rec: Recognition) => (
              <li key={rec.id} className="px-4 py-2 text-aipify-text-secondary">
                {rec.employee_name} · {rec.title} · {rec.recognition_type.replace(/_/g, " ")}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.audit_recent && center.audit_recent.length > 0 ? (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-aipify-text">{labels.auditLog}</h2>
          <ul className={`${AipifyShellClasses.surfaceCard} divide-y divide-aipify-border text-sm`}>
            {center.audit_recent.map((entry, i) => (
              <li key={`${entry.action}-${i}`} className="px-4 py-2 text-aipify-text-secondary">
                {entry.summary}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
