"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsQualityCenterActionResult,
  parseAipifyHostsQualityCenterDashboard,
  type HostsInspectionRow,
  type HostsQualityCenterDashboard,
  type HostsQualityCenterSectionKey,
  type HostsQualityReviewRow,
} from "@/lib/aipify/aipify-hosts-quality-center";

type Props = { labels: Record<string, string> };

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    scheduled: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    in_progress: "bg-sky-50 text-sky-800 ring-sky-200",
    awaiting_review: "bg-amber-50 text-amber-900 ring-amber-200",
    approved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    requires_action: "bg-red-50 text-red-800 ring-red-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-700 ring-gray-200";
}

function outcomeBadge(outcome: string): string {
  const map: Record<string, string> = {
    passed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    passed_with_notes: "bg-sky-50 text-sky-800 ring-sky-200",
    action_required: "bg-amber-50 text-amber-900 ring-amber-200",
    failed: "bg-red-50 text-red-800 ring-red-200",
  };
  return map[outcome] ?? "bg-gray-100 text-gray-700 ring-gray-200";
}

function labelFor(labels: Record<string, string>, prefix: string, key: string): string {
  return labels[`${prefix}_${key}`] ?? key.replace(/_/g, " ");
}

function EmptyBoard({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-8 text-center">
      <p className="text-sm font-medium text-gray-800">{title}</p>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function InspectionTable({
  rows,
  labels,
  busy,
  showActions,
  onStart,
  onReview,
  onOutcome,
  onCorrective,
  onPhoto,
}: {
  rows: HostsInspectionRow[];
  labels: Record<string, string>;
  busy: boolean;
  showActions?: boolean;
  onStart: (id: string) => void;
  onReview: (id: string) => void;
  onOutcome: (id: string, outcome: string) => void;
  onCorrective: (id: string, summary: string) => void;
  onPhoto: (id: string, category: string, label: string) => void;
}) {
  const [actionDraft, setActionDraft] = useState("");
  const [photoLabel, setPhotoLabel] = useState("");

  if (rows.length === 0) {
    return <EmptyBoard title={labels.emptyInspectionsTitle} message={labels.emptyInspectionsMessage} />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.inspectionType}</th>
            <th className="px-4 py-3">{labels.inspector}</th>
            <th className="px-4 py-3">{labels.scheduledDate}</th>
            <th className="px-4 py-3">{labels.completionDate}</th>
            <th className="px-4 py-3">{labels.status}</th>
            <th className="px-4 py-3">{labels.outcome}</th>
            {showActions && <th className="px-4 py-3">{labels.actions}</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="px-4 py-3 text-gray-700">{row.property}</td>
              <td className="px-4 py-3 text-gray-700">{labelFor(labels, "type", row.inspection_type)}</td>
              <td className="px-4 py-3 text-gray-700">{row.assigned_inspector}</td>
              <td className="px-4 py-3 text-gray-700">{row.scheduled_date ?? "—"}</td>
              <td className="px-4 py-3 text-gray-700">{row.completion_date ?? "—"}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.status)}`}>
                  {labelFor(labels, "status", row.status)}
                </span>
              </td>
              <td className="px-4 py-3">
                {row.outcome ? (
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${outcomeBadge(row.outcome)}`}>
                    {labelFor(labels, "outcome", row.outcome)}
                  </span>
                ) : (
                  "—"
                )}
              </td>
              {showActions && (
                <td className="px-4 py-3 min-w-[200px] space-y-2">
                  {row.status === "scheduled" && (
                    <button type="button" disabled={busy} onClick={() => onStart(row.id)} className="text-xs font-medium text-indigo-700 hover:text-indigo-900 disabled:opacity-60">
                      {labels.startInspection}
                    </button>
                  )}
                  {row.status === "in_progress" && (
                    <button type="button" disabled={busy} onClick={() => onReview(row.id)} className="text-xs font-medium text-sky-700 hover:text-sky-900 disabled:opacity-60">
                      {labels.submitForReview}
                    </button>
                  )}
                  {row.status === "awaiting_review" && (
                    <div className="flex flex-wrap gap-1">
                      {["passed", "passed_with_notes", "action_required", "failed"].map((o) => (
                        <button key={o} type="button" disabled={busy} onClick={() => onOutcome(row.id, o)} className="text-xs font-medium text-emerald-700 hover:text-emerald-900 disabled:opacity-60">
                          {labelFor(labels, "outcome", o)}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-1">
                    <input type="text" value={actionDraft} onChange={(e) => setActionDraft(e.target.value)} placeholder={labels.correctivePlaceholder} className="w-full rounded border border-gray-300 px-2 py-1 text-xs" />
                    <button type="button" disabled={busy || !actionDraft.trim()} onClick={() => { onCorrective(row.id, actionDraft); setActionDraft(""); }} className="shrink-0 text-xs font-medium text-teal-700 disabled:opacity-60">
                      {labels.addCorrective}
                    </button>
                  </div>
                  <div className="flex gap-1">
                    <input type="text" value={photoLabel} onChange={(e) => setPhotoLabel(e.target.value)} placeholder={labels.photoLabelPlaceholder} className="w-full rounded border border-gray-300 px-2 py-1 text-xs" />
                    <button type="button" disabled={busy || !photoLabel.trim()} onClick={() => { onPhoto(row.id, "interior_cleanliness", photoLabel); setPhotoLabel(""); }} className="shrink-0 text-xs font-medium text-gray-700 disabled:opacity-60">
                      {labels.addPhoto}
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReviewsGrid({ rows, labels }: { rows: HostsQualityReviewRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyReviewsTitle} message={labels.emptyReviewsMessage} />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {rows.map((r) => (
        <div key={r.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-semibold text-gray-900">{r.property}</h3>
            <span className="text-2xl font-bold text-teal-800">{r.property_score}%</span>
          </div>
          {r.inspector_notes && <p className="mt-2 text-sm text-gray-700">{r.inspector_notes}</p>}
          {r.recommended_actions && (
            <p className="mt-2 text-sm text-gray-600"><span className="font-medium">{labels.recommendedActions}:</span> {r.recommended_actions}</p>
          )}
          {r.improvement_opportunities && (
            <p className="mt-1 text-sm text-gray-600"><span className="font-medium">{labels.improvementOpportunities}:</span> {r.improvement_opportunities}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export function AipifyHostsQualityCenterDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HostsQualityCenterDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState<HostsQualityCenterSectionKey>("upcoming_inspections");
  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [scheduleType, setScheduleType] = useState("routine");
  const [scheduleProperty, setScheduleProperty] = useState("");
  const [scheduleInspector, setScheduleInspector] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const res = await fetch(`/api/aipify/aipify-hosts/quality-center/dashboard?section=${activeSection}`);
    if (res.ok) {
      setDashboard(parseAipifyHostsQualityCenterDashboard(await res.json()));
    } else {
      setError(true);
    }
    setLoading(false);
  }, [activeSection]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (body: Record<string, unknown>) => {
    setBusy(true);
    setActionMessage(null);
    const res = await fetch("/api/aipify/aipify-hosts/quality-center/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = parseAipifyHostsQualityCenterActionResult(await res.json());
    setBusy(false);
    if (result.success) {
      setActionMessage(labels.actionRecorded);
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

  const inspectionRows =
    activeSection === "upcoming_inspections"
      ? dashboard.upcoming_inspections
      : activeSection === "active_inspections"
        ? dashboard.active_inspections
        : activeSection === "completed_inspections"
          ? dashboard.completed_inspections
          : [];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-teal-100 bg-teal-50/40 p-6">
        <p className="text-sm font-medium text-teal-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-teal-900">{labels.governanceNote}</p>
        <Link href="/app/aipify-hosts" className="mt-4 inline-flex rounded-lg border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-900 hover:bg-teal-50">
          {labels.backToHosts}
        </Link>
      </section>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label={labels.upcomingCount} value={dashboard.stats.upcoming_count} />
        <MetricCard label={labels.activeCount} value={dashboard.stats.active_count} />
        <MetricCard label={labels.overdueCount} value={dashboard.stats.overdue_count} />
        <MetricCard label={labels.failedCount} value={dashboard.stats.failed_count} />
        <MetricCard label={labels.avgScore} value={`${dashboard.stats.avg_property_score}%`} />
      </dl>

      <section className="flex flex-wrap gap-2">
        {dashboard.sections.map((section) => (
          <button
            key={section.key}
            type="button"
            onClick={() => setActiveSection(section.key as HostsQualityCenterSectionKey)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeSection === section.key ? "bg-teal-700 text-white" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {labelFor(labels, "section", section.key)}
          </button>
        ))}
      </section>

      {actionMessage && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">{actionMessage}</p>
      )}

      {activeSection === "upcoming_inspections" && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
          <h3 className="font-semibold text-gray-900">{labels.scheduleInspection}</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <select value={scheduleType} onChange={(e) => setScheduleType(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              {dashboard.inspection_types.map((t) => (
                <option key={t} value={t}>{labelFor(labels, "type", t)}</option>
              ))}
            </select>
            <select value={scheduleProperty} onChange={(e) => setScheduleProperty(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">{labels.allProperties}</option>
              {dashboard.properties.map((p) => (
                <option key={p.id} value={p.id}>{p.display_name}</option>
              ))}
            </select>
            <input type="text" value={scheduleInspector} onChange={(e) => setScheduleInspector(e.target.value)} placeholder={labels.inspectorPlaceholder} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              void runAction({
                action: "schedule_inspection",
                inspection_type: scheduleType,
                property_id: scheduleProperty || undefined,
                assigned_inspector: scheduleInspector || undefined,
                scheduled_date: scheduleDate || undefined,
              })
            }
            className="inline-flex rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60"
          >
            {labels.scheduleInspection}
          </button>
        </div>
      )}

      {(activeSection === "upcoming_inspections" || activeSection === "active_inspections" || activeSection === "completed_inspections") && (
        <InspectionTable
          rows={inspectionRows}
          labels={labels}
          busy={busy}
          showActions={activeSection !== "completed_inspections"}
          onStart={(id) => void runAction({ action: "update_status", inspection_id: id, status: "in_progress" })}
          onReview={(id) => void runAction({ action: "update_status", inspection_id: id, status: "awaiting_review" })}
          onOutcome={(id, outcome) => void runAction({ action: "record_outcome", inspection_id: id, outcome })}
          onCorrective={(id, summary) => void runAction({ action: "corrective_action", inspection_id: id, action_summary: summary, create_task: true })}
          onPhoto={(id, category, label) => void runAction({ action: "add_photo_evidence", inspection_id: id, checklist_category: category, reference_label: label })}
        />
      )}

      {activeSection === "quality_reviews" && <ReviewsGrid rows={dashboard.quality_reviews} labels={labels} />}

      {activeSection === "standards_library" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dashboard.standards_library.map((s) => (
            <div key={s.key} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">{s.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{s.expectation}</p>
            </div>
          ))}
        </div>
      )}

      {dashboard.corrective_actions.length > 0 && activeSection !== "standards_library" && (
        <section>
          <h3 className="mb-3 text-lg font-semibold text-gray-900">{labels.correctiveActions}</h3>
          <ul className="space-y-2">
            {dashboard.corrective_actions.slice(0, 5).map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
                <span className="text-gray-900">{c.action_summary}</span>
                <span className="text-gray-500">{c.due_date ?? "—"} · {c.assigned_owner ?? "—"}</span>
                {!c.escalated && (
                  <button type="button" disabled={busy} onClick={() => void runAction({ action: "escalate", inspection_id: c.inspection_id, action_id: c.id })} className="text-xs font-medium text-red-700 disabled:opacity-60">
                    {labels.escalate}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {dashboard.timeline.length > 0 && (
        <section>
          <h3 className="mb-3 text-lg font-semibold text-gray-900">{labels.timeline}</h3>
          <ol className="space-y-2 border-l-2 border-teal-200 pl-4">
            {dashboard.timeline.map((t) => (
              <li key={t.id} className="text-sm">
                <span className="font-medium text-gray-900">{labelFor(labels, "timeline", t.timeline_type)}</span>
                <span className="text-gray-500"> · {t.created_at}</span>
                <p className="text-gray-600">{t.summary}</p>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
