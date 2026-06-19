"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { parseAbsenceCenter, type AbsenceCenter } from "@/lib/absence-coverage-engine/parse";
import type { Vac606Section } from "@/lib/absence-coverage-engine/config";
import { vac606SectionToRpc } from "@/lib/absence-coverage-engine/config";
import type { buildAbsenceCoverageLabels } from "@/lib/absence-coverage-engine/labels";

type Labels = ReturnType<typeof buildAbsenceCoverageLabels>;

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

function ItemGrid({
  title,
  items,
  titleKey,
  badgeKey,
  summaryKey,
}: {
  title: string;
  items: Record<string, unknown>[];
  titleKey: string;
  badgeKey?: string;
  summaryKey?: string;
}) {
  if (!items.length) {
    return (
      <section className="space-y-3">
        <h3 className="font-semibold text-zinc-900">{title}</h3>
        <p className="text-sm text-zinc-500">No records in this section yet.</p>
      </section>
    );
  }
  return (
    <section className="space-y-3">
      <h3 className="font-semibold text-zinc-900">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, idx) => {
          const keyField = Object.keys(item).find((k) => k.endsWith("_key"));
          return (
            <ItemCard
              key={keyField ? String(item[keyField]) : idx}
              title={String(item[titleKey] ?? "")}
              summary={summaryKey ? String(item[summaryKey] ?? "") : undefined}
              badge={badgeKey ? String(item[badgeKey] ?? "") : undefined}
            />
          );
        })}
      </div>
    </section>
  );
}

export function AbsenceCoveragePanel({
  labels,
  activeSection,
  apiBase = "/api/absence/center",
}: {
  labels: Labels;
  activeSection: Vac606Section;
  apiBase?: string;
}) {
  const [center, setCenter] = useState<AbsenceCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const rpcSection = vac606SectionToRpc(activeSection);
    const res = await fetch(`${apiBase}?section=${rpcSection}`);
    if (res.ok) setCenter(parseAbsenceCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, [activeSection, apiBase]);

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
      <PlatformEmptyState
        title={labels.empty}
        message={center?.error ?? labels.empty}
        primaryAction={{ label: labels.refresh, onClick: () => void load() }}
      />
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

      {(activeSection === "overview" || activeSection === "reports") && (
        <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white p-6 shadow-sm">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label={labels.stats.activeModes} value={stats.active_modes ?? 0} />
            <StatCard label={labels.stats.teamAway} value={stats.team_away ?? 0} />
            <StatCard label={labels.stats.readinessScore} value={stats.readiness_score ?? 0} />
            <StatCard label={labels.maxCoverageLevel} value={center.max_coverage_level ?? stats.max_coverage_level ?? "—"} />
          </div>
        </section>
      )}

      {activeSection === "overview" && (center.companion_recommendations?.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.companionRecommendations}</h3>
          {center.companion_recommendations!.map((rec, i) => (
            <ItemCard
              key={i}
              title={String(rec.check_title ?? "Insight")}
              summary={String(rec.recommendation ?? rec.summary ?? "")}
              badge={rec.readiness_score != null ? String(rec.readiness_score) : undefined}
            />
          ))}
        </section>
      )}

      {activeSection === "myVacationMode" && (
        <>
          <ItemGrid title={labels.sections.myVacationMode} items={center.employee_settings ?? []} titleKey="settings_key" summaryKey="summary" badgeKey="availability_level_key" />
          <ItemGrid title={labels.transparentNotice} items={center.active_modes ?? []} titleKey="mode_key" summaryKey="transparent_notice" badgeKey="mode_status" />
        </>
      )}

      {activeSection === "teamAvailability" && (
        <ItemGrid title={labels.sections.teamAvailability} items={center.team_availability ?? []} titleKey="member_label" summaryKey="summary" badgeKey="availability_level_key" />
      )}

      {activeSection === "coverage" && (
        <>
          <ItemGrid title={labels.sections.coverage} items={center.coverage_items ?? []} titleKey="coverage_title" summaryKey="summary" badgeKey="coverage_type" />
          <ItemGrid title="Task coverage" items={center.task_coverage ?? []} titleKey="task_title" summaryKey="summary" badgeKey="evaluation_status" />
          <ItemGrid title="Message coverage" items={center.message_coverage ?? []} titleKey="channel_title" summaryKey="summary" badgeKey="coverage_status" />
        </>
      )}

      {activeSection === "delegation" && (
        <ItemGrid title={labels.sections.delegation} items={center.delegations ?? []} titleKey="delegator_label" summaryKey="summary" badgeKey="delegation_status" />
      )}

      {activeSection === "aipifyResponses" && (
        <ItemGrid title={labels.sections.aipifyResponses} items={center.response_templates ?? []} titleKey="template_title" summaryKey="template_body" badgeKey="status_key" />
      )}

      {activeSection === "schedules" && (
        <ItemGrid title={labels.sections.schedules} items={center.schedules ?? []} titleKey="schedule_title" summaryKey="summary" badgeKey="schedule_type" />
      )}

      {activeSection === "policies" && (
        <ItemGrid title={labels.sections.policies} items={center.policies ?? []} titleKey="policy_title" summaryKey="summary" badgeKey="policy_type" />
      )}

      {activeSection === "returnSummary" && (
        <>
          <ItemGrid title={labels.sections.returnSummary} items={center.return_summaries ?? []} titleKey="summary_title" summaryKey="summary" badgeKey="status_key" />
          <ItemGrid title="Since last login" items={center.since_last_login_meta ?? []} titleKey="meta_title" summaryKey="summary" badgeKey="status_key" />
          <ItemGrid title="Return workflows" items={center.return_workflows ?? []} titleKey="workflow_title" summaryKey="summary" badgeKey="workflow_status" />
        </>
      )}

      {activeSection === "history" && (
        <ItemGrid title={labels.sections.history} items={center.history_events ?? []} titleKey="event_title" summaryKey="summary" badgeKey="event_type" />
      )}

      {activeSection === "reports" && (
        <ItemGrid title={labels.sections.reports} items={center.reports ?? []} titleKey="report_title" summaryKey="summary" badgeKey="metric_value" />
      )}

      {activeSection === "overview" && (center.lead_continuity?.length ?? 0) > 0 && (
        <ItemGrid title={labels.stats.leadContinuity} items={center.lead_continuity ?? []} titleKey="lead_title" summaryKey="summary" badgeKey="continuity_status" />
      )}
    </div>
  );
}
