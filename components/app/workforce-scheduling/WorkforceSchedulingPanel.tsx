"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseWorkforceSchedulingCenter,
  type WorkforceSchedulingCenter,
  type WorkforceSchedulingRecord,
} from "@/lib/workforce-scheduling-engine/parse";
import type { Wfs608Section } from "@/lib/workforce-scheduling-engine/config";
import { wfs608SectionToRpc } from "@/lib/workforce-scheduling-engine/config";
import type { buildWorkforceSchedulingLabels } from "@/lib/workforce-scheduling-engine/labels";

type Labels = ReturnType<typeof buildWorkforceSchedulingLabels>;

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function StatusBadge({ icon, label }: { icon?: string; label?: string }) {
  if (!label) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
      <span aria-hidden="true">{icon === "alert-triangle" ? "⚠" : icon === "check-circle" ? "✓" : icon === "users" ? "👥" : "○"}</span>
      <span>{label}</span>
    </span>
  );
}

function RecordCard({ record, labels }: { record: WorkforceSchedulingRecord; labels: Labels }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-semibold text-zinc-900">{record.record_title ?? record.record_key}</p>
        <StatusBadge icon={record.status_icon} label={record.status_label ?? record.record_status} />
      </div>
      {record.summary ? <p className="mt-2 text-sm text-zinc-600">{record.summary}</p> : null}
      {record.priority ? (
        <p className="mt-2 text-xs text-zinc-500">
          {labels.sections.overview}: {String(record.priority).replace(/_/g, " ")}
        </p>
      ) : null}
    </div>
  );
}

function sectionRecords(center: WorkforceSchedulingCenter, section: Wfs608Section): WorkforceSchedulingRecord[] {
  if (center.rows && center.rows.length > 0) return center.rows;
  switch (section) {
    case "shifts":
    case "schedule":
      return center.shifts ?? [];
    case "coverage":
      return center.coverage_gaps ?? [];
    case "onCall":
      return center.on_call ?? [];
    default:
      return center.rows ?? center.shifts ?? [];
  }
}

export function WorkforceSchedulingPanel({ labels, activeSection }: { labels: Labels; activeSection: Wfs608Section }) {
  const [center, setCenter] = useState<WorkforceSchedulingCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/workforce-scheduling/center?section=${wfs608SectionToRpc(activeSection)}`);
    if (res.ok) setCenter(parseWorkforceSchedulingCenter(await res.json()));
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

  const stats = center.overview ?? {};
  const records = sectionRecords(center, activeSection);

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
        <p className="rounded-2xl border border-violet-100 bg-violet-50/60 px-5 py-4 text-sm text-violet-950">{center.principle}</p>
      ) : null}

      {(activeSection === "overview" || activeSection === "schedule") && (
        <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label={labels.coverageGaps} value={Number(stats.coverage_gaps_count ?? 0)} />
            <StatCard label={labels.openShifts} value={Number(stats.open_shifts_count ?? 0)} />
            <StatCard label={labels.onCallRotations} value={Number(stats.on_call_active ?? 0)} />
            <StatCard label={labels.partiallyStaffed} value={Number(stats.partially_staffed_shifts ?? 0)} />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <StatCard label={labels.pendingRequests} value={Number(stats.pending_requests ?? 0)} />
            <StatCard label={labels.activeConflicts} value={Number(stats.active_conflicts ?? 0)} />
          </div>
          {stats.crisis_mode ? (
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{labels.crisisMode}</p>
          ) : null}
        </section>
      )}

      {activeSection === "overview" && (center.companion_recommendations?.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.companionRecommendations}</h3>
          {(center.companion_recommendations ?? []).map((rec, i) => (
            <div key={i} className="rounded-xl border border-violet-100 bg-white p-4 shadow-sm">
              <p className="font-semibold text-zinc-900">{String(rec.title ?? "")}</p>
              <p className="mt-1 text-sm text-zinc-600">{String(rec.reason ?? "")}</p>
              {rec.route ? (
                <Link href={String(rec.route)} className="mt-2 inline-block text-sm font-medium text-violet-700 hover:underline">
                  {labels.companionAdvisor} →
                </Link>
              ) : null}
            </div>
          ))}
        </section>
      )}

      {activeSection === "overview" && center.integrations && (
        <section className="space-y-2">
          <h3 className="font-semibold text-zinc-900">{labels.integrations}</h3>
          <p className="text-sm text-zinc-600">
            Phase 606 vacation mode · Phase 580 capacity · Phase 607 crisis schedules — integrated, not duplicated.
          </p>
        </section>
      )}

      {activeSection === "onCall" && (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
          <p className="text-sm text-indigo-950">{labels.sections.onCall} — activation, acknowledgement, and handover tracked with icon + text status.</p>
        </section>
      )}

      <section className="grid gap-3">
        {records.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-center">
            <p className="font-medium text-zinc-800">{labels.noRecords}</p>
            <p className="mt-2 text-sm text-zinc-600">{labels.empty}</p>
          </div>
        ) : (
          records.map((record) => <RecordCard key={String(record.record_key)} record={record} labels={labels} />)
        )}
      </section>

      {activeSection === "overview" && (center.audit_recent?.length ?? 0) > 0 && (
        <section className="space-y-2">
          <h3 className="font-semibold text-zinc-900">{labels.auditRecent}</h3>
          {(center.audit_recent ?? []).map((entry, i) => (
            <div key={i} className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
              <span className="font-medium">{String(entry.event_type ?? "")}</span>
              {entry.summary ? <span className="text-zinc-500"> — {String(entry.summary)}</span> : null}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
