"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseWorkforceSchedulingCenter,
  type WorkforceSchedulingCenter,
  type WorkforceSchedulingRecord,
} from "@/lib/workforce-scheduling-engine/parse";
import type { Wfs608PartnerSection } from "@/lib/workforce-scheduling-engine/config";
import { wfs608PartnerSectionToRpc } from "@/lib/workforce-scheduling-engine/config";
import type { buildPartnerWorkforceSchedulingLabels } from "@/lib/workforce-scheduling-engine/labels";

type Labels = ReturnType<typeof buildPartnerWorkforceSchedulingLabels>;

function RecordCard({ record }: { record: WorkforceSchedulingRecord }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-semibold text-zinc-900">{record.record_title ?? record.record_key}</p>
        {record.status_label ? (
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">{record.status_label}</span>
        ) : null}
      </div>
      {record.summary ? <p className="mt-2 text-sm text-zinc-600">{record.summary}</p> : null}
      {record.attribution_ref ? (
        <p className="mt-2 text-xs text-violet-700">Attribution: {record.attribution_ref}</p>
      ) : null}
    </div>
  );
}

function partnerRecords(center: WorkforceSchedulingCenter, section: Wfs608PartnerSection): WorkforceSchedulingRecord[] {
  if (center.rows && center.rows.length > 0) return center.rows;
  switch (section) {
    case "shifts":
      return center.shifts ?? [];
    case "coverage":
      return center.coverage ?? [];
    case "onCall":
      return center.on_call ?? [];
    default:
      return [...(center.shifts ?? []), ...(center.lead_coverage ?? [])];
  }
}

export function PartnerWorkforceSchedulingPanel({
  labels,
  activeSection,
}: {
  labels: Labels;
  activeSection: Wfs608PartnerSection;
}) {
  const [center, setCenter] = useState<WorkforceSchedulingCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/partners/workforce-scheduling/center?section=${wfs608PartnerSectionToRpc(activeSection)}`);
    if (res.ok) setCenter(parseWorkforceSchedulingCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, [activeSection]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[280px] items-center justify-center">
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

  const records = partnerRecords(center, activeSection);
  const stats = center.overview ?? {};

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

      <p className="text-sm text-zinc-600">{labels.attributionNote}</p>

      {activeSection === "overview" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs uppercase text-zinc-500">{key.replace(/_/g, " ")}</p>
              <p className="mt-1 text-xl font-semibold text-zinc-900">{String(value)}</p>
            </div>
          ))}
        </div>
      )}

      <section className="grid gap-3">
        {records.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-center">
            <p className="font-medium text-zinc-800">{labels.noRecords}</p>
          </div>
        ) : (
          records.map((record) => <RecordCard key={String(record.record_key)} record={record} />)
        )}
      </section>

      {(center.lead_coverage?.length ?? 0) > 0 && activeSection === "overview" && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">Lead coverage</h3>
          {(center.lead_coverage ?? []).map((record) => (
            <RecordCard key={String(record.record_key)} record={record} />
          ))}
        </section>
      )}
    </div>
  );
}
