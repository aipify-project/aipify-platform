"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { parsePartnerTeamTimeCenter, type PartnerTeamTimeCenter } from "@/lib/time-attendance-engine/parse";
import type { Ta609PartnerSection } from "@/lib/time-attendance-engine/config";
import type { buildPartnerTeamTimeLabels } from "@/lib/time-attendance-engine/labels";

type Labels = ReturnType<typeof buildPartnerTeamTimeLabels>;

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function ItemCard({ title, summary, badge }: { title: string; summary?: string; badge?: string }) {
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
    </div>
  );
}

export function PartnerTeamTimePanel({
  labels,
  activeSection,
}: {
  labels: Labels;
  activeSection: Ta609PartnerSection;
}) {
  const [center, setCenter] = useState<PartnerTeamTimeCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/partners/team-time/center?section=${activeSection}`);
    if (res.ok) setCenter(parsePartnerTeamTimeCenter(await res.json()));
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

  return (
    <div className="space-y-6">
      {center.principle ? (
        <p className="rounded-2xl border border-violet-100 bg-violet-50/60 px-5 py-4 text-sm text-violet-950">
          {center.principle}
        </p>
      ) : null}

      <p className="text-xs text-zinc-500">{center.privacy_note ?? labels.privacyNote}</p>
      <p className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs text-emerald-900">
        {labels.attributionPreserved}
      </p>

      {activeSection === "overview" && (
        <section className="grid gap-4 sm:grid-cols-2">
          <StatCard label={labels.stats.teamSize} value={stats.team_size ?? 0} />
          <StatCard label={labels.stats.hoursThisWeek} value={stats.hours_this_week ?? 0} />
        </section>
      )}

      {(activeSection === "overview" || activeSection === "team") && (
        <section className="grid gap-3">
          {(center.team_members ?? []).map((m) => (
            <ItemCard
              key={String(m.member_key)}
              title={String(m.member_label)}
              summary={String(m.summary ?? "")}
              badge={`${String(m.hours_this_week)}h · ${String(m.attendance_status ?? "")}`}
            />
          ))}
        </section>
      )}

      {(activeSection === "overview" || activeSection === "time") && (
        <section className="grid gap-3">
          {(center.time_records ?? []).map((r) => (
            <ItemCard
              key={String(r.record_key)}
              title={`${String(r.member_label)} — ${String(r.hours)}h`}
              summary={String(r.summary ?? "")}
              badge={String(r.record_status ?? r.activity_label ?? "")}
            />
          ))}
        </section>
      )}

      {(activeSection === "overview" || activeSection === "leave") && (
        <section className="grid gap-3">
          {(center.leave_requests ?? []).length === 0 ? (
            <p className="text-sm text-zinc-500">{labels.noRecords}</p>
          ) : (
            (center.leave_requests ?? []).map((l) => (
              <ItemCard
                key={String(l.request_key)}
                title={String(l.member_label)}
                summary={String(l.summary ?? "")}
                badge={String(l.leave_type_label ?? l.request_status ?? "")}
              />
            ))
          )}
        </section>
      )}
    </div>
  );
}
