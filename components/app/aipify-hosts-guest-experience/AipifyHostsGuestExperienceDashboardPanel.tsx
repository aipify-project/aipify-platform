"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsGuestExperienceActionResult,
  parseAipifyHostsGuestExperienceDashboard,
  type HostsGuestExperienceDashboard,
  type HostsGuestExperienceSectionKey,
  type HostsGuestFeedbackRow,
  type HostsImprovementOpportunityRow,
  type HostsRecoveryCaseRow,
  type HostsExperienceMetricsRow,
} from "@/lib/aipify/aipify-hosts-guest-experience";

type Props = { labels: Record<string, string> };

function labelFor(labels: Record<string, string>, prefix: string, key: string): string {
  return labels[`${prefix}_${key}`] ?? key.replace(/_/g, " ");
}

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    excellent: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    good: "bg-sky-50 text-sky-800 ring-sky-200",
    needs_improvement: "bg-amber-50 text-amber-900 ring-amber-200",
    critical: "bg-red-50 text-red-800 ring-red-200",
    open: "bg-orange-50 text-orange-900 ring-orange-200",
    in_progress: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    resolved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    closed: "bg-gray-100 text-gray-600 ring-gray-200",
    high: "bg-orange-50 text-orange-900 ring-orange-200",
    medium: "bg-amber-50 text-amber-800 ring-amber-200",
    low: "bg-gray-100 text-gray-600 ring-gray-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-700 ring-gray-200";
}

function EmptyBoard({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-8 text-center">
      <p className="text-sm font-medium text-gray-800">{title}</p>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
}

function MetricCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
      {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
    </div>
  );
}

function FeedbackTable({ rows, labels }: { rows: HostsGuestFeedbackRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyFeedbackTitle} message={labels.emptyFeedbackMessage} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.stayPeriod}</th>
            <th className="px-4 py-3">{labels.category}</th>
            <th className="px-4 py-3">{labels.rating}</th>
            <th className="px-4 py-3">{labels.comments}</th>
            <th className="px-4 py-3">{labels.submittedAt}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="px-4 py-3 font-medium text-gray-900">{row.property}</td>
              <td className="px-4 py-3 text-gray-600">{row.stay_period_start} – {row.stay_period_end}</td>
              <td className="px-4 py-3">{labelFor(labels, "metric", row.feedback_category)}</td>
              <td className="px-4 py-3 font-semibold">{row.rating}/5</td>
              <td className="px-4 py-3 text-gray-600 max-w-xs">{row.comments || "—"}</td>
              <td className="px-4 py-3 text-gray-500">{row.submitted_at.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecoveryTable({
  rows,
  labels,
  busy,
  onAction,
}: {
  rows: HostsRecoveryCaseRow[];
  labels: Record<string, string>;
  busy: boolean;
  onAction: (id: string, action: string, propertyId?: string | null) => void;
}) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyRecoveryTitle} message={labels.emptyRecoveryMessage} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.status}</th>
            <th className="px-4 py-3">{labels.assignedOwner}</th>
            <th className="px-4 py-3">{labels.dueDate}</th>
            <th className="px-4 py-3">{labels.resolutionNotes}</th>
            <th className="px-4 py-3">{labels.actions}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={`border-b border-gray-100 ${row.is_overdue ? "bg-red-50/40" : ""}`}>
              <td className="px-4 py-3 font-medium text-gray-900">{row.property}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.case_status)}`}>
                  {labelFor(labels, "recoveryStatus", row.case_status)}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-700">{row.assigned_owner}</td>
              <td className={`px-4 py-3 ${row.is_overdue ? "font-medium text-red-700" : "text-gray-700"}`}>{row.due_date || "—"}</td>
              <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{row.resolution_notes || "—"}</td>
              <td className="px-4 py-3 min-w-[200px]">
                {row.case_status !== "closed" && (
                  <div className="flex flex-wrap gap-2">
                    <button type="button" disabled={busy} onClick={() => onAction(row.id, "create_follow_up_task", row.property_id)} className="text-xs font-medium text-indigo-700 disabled:opacity-60">{labels.createTask}</button>
                    <button type="button" disabled={busy} onClick={() => onAction(row.id, "assign_owner", row.property_id)} className="text-xs font-medium text-violet-700 disabled:opacity-60">{labels.assignOwner}</button>
                    <button type="button" disabled={busy} onClick={() => onAction(row.id, "document_resolution", row.property_id)} className="text-xs font-medium text-teal-700 disabled:opacity-60">{labels.documentResolution}</button>
                    <button type="button" disabled={busy} onClick={() => onAction(row.id, "close_recovery_case", row.property_id)} className="text-xs font-medium text-gray-700 disabled:opacity-60">{labels.closeCase}</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OpportunitiesTable({ rows, labels }: { rows: HostsImprovementOpportunityRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyOpportunitiesTitle} message={labels.emptyOpportunitiesMessage} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.opportunityType}</th>
            <th className="px-4 py-3">{labels.category}</th>
            <th className="px-4 py-3">{labels.summary}</th>
            <th className="px-4 py-3">{labels.severity}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="px-4 py-3 font-medium text-gray-900">{row.property}</td>
              <td className="px-4 py-3">{labelFor(labels, "oppType", row.opportunity_type)}</td>
              <td className="px-4 py-3">{labelFor(labels, "metric", row.category)}</td>
              <td className="px-4 py-3 text-gray-700">{row.summary}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.severity)}`}>{row.severity}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PropertyMetricsTable({ rows, labels }: { rows: HostsExperienceMetricsRow[]; labels: Record<string, string> }) {
  const propertyRows = rows.filter((r) => r.property_id);
  if (propertyRows.length === 0) return <EmptyBoard title={labels.emptyMetricsTitle} message={labels.emptyMetricsMessage} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.satisfaction}</th>
            <th className="px-4 py-3">{labels.status}</th>
            <th className="px-4 py-3">{labels.trend}</th>
            <th className="px-4 py-3">{labels.returningGuests}</th>
          </tr>
        </thead>
        <tbody>
          {propertyRows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="px-4 py-3 font-medium text-gray-900">{row.property}</td>
              <td className="px-4 py-3 text-lg font-semibold">{row.overall_satisfaction}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.experience_status)}`}>
                  {labelFor(labels, "expStatus", row.experience_status)}
                </span>
              </td>
              <td className={`px-4 py-3 font-medium ${row.satisfaction_trend < 0 ? "text-red-700" : "text-emerald-700"}`}>
                {row.satisfaction_trend > 0 ? "+" : ""}{row.satisfaction_trend}
              </td>
              <td className="px-4 py-3 text-gray-700">{row.returning_guest_satisfaction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AipifyHostsGuestExperienceDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HostsGuestExperienceDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState<HostsGuestExperienceSectionKey>("experience_overview");
  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const res = await fetch(`/api/aipify/aipify-hosts/guest-experience/dashboard?section=${activeSection}`);
    if (res.ok) {
      setDashboard(parseAipifyHostsGuestExperienceDashboard(await res.json()));
    } else {
      setError(true);
    }
    setLoading(false);
  }, [activeSection]);

  useEffect(() => {
    void load();
  }, [load]);

  const runRecoveryAction = (recoveryId: string, actionType: string, propertyId?: string | null) => {
    void runAction({
      action_type: actionType,
      recovery_id: recoveryId,
      property_id: propertyId ?? undefined,
      assigned_owner: actionType === "assign_owner" ? "Guest Services Lead" : undefined,
      notes: actionType === "document_resolution" ? "Resolution documented from Guest Experience Center" : actionType === "close_recovery_case" ? "Case closed — guest satisfied" : undefined,
    });
  };

  const runAction = async (body: Record<string, unknown>) => {
    setBusy(true);
    setActionMessage(null);
    const res = await fetch("/api/aipify/aipify-hosts/guest-experience/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = parseAipifyHostsGuestExperienceActionResult(await res.json());
    setBusy(false);
    if (result.success) {
      setActionMessage(result.summary ?? labels.actionRecorded);
      await load();
    } else {
      setActionMessage(labels.actionFailed);
    }
  };

  if (loading && !dashboard) return <AipifyLoader label={labels.loading} centered fullPage />;

  if (error || !dashboard) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  const metricKeys = [
    "overall_satisfaction", "check_in_experience", "property_cleanliness",
    "communication_quality", "property_accuracy", "issue_resolution", "likelihood_to_return",
  ] as const;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-6">
        <p className="text-sm font-medium text-violet-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-violet-900">{labels.governanceNote}</p>
        <Link href="/app/aipify-hosts" className="mt-4 inline-flex rounded-lg border border-violet-200 bg-white px-4 py-2 text-sm font-medium text-violet-900 hover:bg-violet-50">
          {labels.backToHosts}
        </Link>
      </section>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label={labels.guestSatisfactionScore}
          value={dashboard.stats.guest_satisfaction_score}
          sub={labelFor(labels, "expStatus", dashboard.stats.portfolio_status)}
        />
        <MetricCard label={labels.openRecoveryCases} value={dashboard.stats.open_recovery_cases} sub={dashboard.stats.overdue_recovery_cases > 0 ? `${dashboard.stats.overdue_recovery_cases} ${labels.overdue}` : undefined} />
        <MetricCard label={labels.topImprovementAreas} value={dashboard.stats.active_improvement_areas} />
        <MetricCard label={labels.strongestProperties} value={dashboard.stats.excellent_properties} sub={`${dashboard.stats.critical_properties} ${labels.criticalCount}`} />
      </dl>

      {(activeSection === "experience_overview" || activeSection === "experience_trends") && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900">{labels.categoryPerformance}</h3>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            {metricKeys.map((key) => (
              <div key={key}>
                <dt className="text-gray-500">{labelFor(labels, "metric", key)}</dt>
                <dd className="text-lg font-semibold text-gray-900">{dashboard.category_performance[key] ?? "—"}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {activeSection === "experience_overview" && dashboard.top_improvement_areas.length > 0 && (
        <section className="rounded-xl border border-amber-100 bg-amber-50/40 p-5">
          <h3 className="font-semibold text-amber-950">{labels.topImprovementAreasList}</h3>
          <ul className="mt-2 space-y-1 text-sm text-amber-900">
            {dashboard.top_improvement_areas.map((a) => (
              <li key={a.category}>{labelFor(labels, "metric", a.category)} — {a.count} ({a.severity})</li>
            ))}
          </ul>
        </section>
      )}

      {activeSection === "experience_trends" && dashboard.monthly_trends.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900">{labels.monthlyTrends}</h3>
          <div className="mt-4 flex items-end gap-3 overflow-x-auto pb-2">
            {dashboard.monthly_trends.filter((t) => t.property === "Portfolio").map((pt) => (
              <div key={pt.month} className="flex min-w-[56px] flex-col items-center">
                <div className="w-10 rounded-t bg-violet-600" style={{ height: `${Math.max(8, pt.overall_satisfaction * 20)}px` }} title={`${pt.month}: ${pt.overall_satisfaction}`} />
                <span className="mt-1 text-[10px] text-gray-500">{pt.month.slice(0, 7)}</span>
                <span className="text-xs font-medium text-gray-800">{pt.overall_satisfaction}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase text-gray-500">
                <tr>
                  <th className="py-2 pr-4">{labels.property}</th>
                  <th className="py-2 pr-4">{labels.month}</th>
                  <th className="py-2 pr-4">{labels.satisfaction}</th>
                  <th className="py-2">{labels.returningGuests}</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.monthly_trends.map((t) => (
                  <tr key={`${t.property}-${t.month}`} className="border-t border-gray-100">
                    <td className="py-2 pr-4 font-medium">{t.property}</td>
                    <td className="py-2 pr-4 text-gray-600">{t.month.slice(0, 7)}</td>
                    <td className="py-2 pr-4">{t.overall_satisfaction}</td>
                    <td className="py-2">{t.returning_guest_satisfaction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="flex flex-wrap gap-2">
        {dashboard.sections.map((section) => (
          <button
            key={section.key}
            type="button"
            onClick={() => setActiveSection(section.key as HostsGuestExperienceSectionKey)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeSection === section.key ? "bg-violet-700 text-white" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {labelFor(labels, "section", section.key)}
          </button>
        ))}
      </section>

      {actionMessage && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">{actionMessage}</p>
      )}

      {activeSection === "guest_feedback" && <FeedbackTable rows={dashboard.guest_feedback} labels={labels} />}
      {activeSection === "service_recovery" && <RecoveryTable rows={dashboard.recovery_cases} labels={labels} busy={busy} onAction={runRecoveryAction} />}
      {activeSection === "improvement_opportunities" && <OpportunitiesTable rows={dashboard.improvement_opportunities} labels={labels} />}
      {(activeSection === "experience_overview" || activeSection === "experience_trends") && (
        <PropertyMetricsTable rows={dashboard.property_metrics} labels={labels} />
      )}

      {activeSection === "experience_overview" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="mb-3 font-semibold text-gray-900">{labels.recentFeedback}</h3>
            <FeedbackTable rows={dashboard.guest_feedback.slice(0, 4)} labels={labels} />
          </div>
          <div>
            <h3 className="mb-3 font-semibold text-gray-900">{labels.openRecoveryPreview}</h3>
            <RecoveryTable rows={dashboard.recovery_cases.filter((r) => r.case_status !== "closed").slice(0, 4)} labels={labels} busy={busy} onAction={runRecoveryAction} />
          </div>
        </div>
      )}
    </div>
  );
}
