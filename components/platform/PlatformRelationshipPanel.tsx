"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Overview = {
  tenants_with_rsi: number;
  active_people: number;
  approved_notes: number;
  timeline_events: number;
  rsi_disabled_tenants: number;
  shared_spaces_pending: number;
  by_person_type: Record<string, number>;
  privacy_note?: string;
};

type PlatformRelationshipPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    tenants: string;
    people: string;
    notes: string;
    timeline: string;
    disabled: string;
    byType: string;
    privacyNote: string;
  };
};

const EMPTY: Overview = {
  tenants_with_rsi: 0,
  active_people: 0,
  approved_notes: 0,
  timeline_events: 0,
  rsi_disabled_tenants: 0,
  shared_spaces_pending: 0,
  by_person_type: {},
};

export default function PlatformRelationshipPanel({
  labels,
}: PlatformRelationshipPanelProps) {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<Overview>(EMPTY);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_platform_relationship_overview");
      if (!cancelled) {
        setOverview(error || !data ? EMPTY : (data as Overview));
        setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{labels.title}</h2>
      <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
      <p className="mt-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-900">
        {overview.privacy_note ?? labels.privacyNote}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <Stat label={labels.tenants} value={overview.tenants_with_rsi} />
        <Stat label={labels.people} value={overview.active_people} />
        <Stat label={labels.notes} value={overview.approved_notes} />
        <Stat label={labels.timeline} value={overview.timeline_events} />
      </div>
      <p className="mt-3 text-xs text-gray-500">
        {labels.disabled}: {overview.rsi_disabled_tenants}
      </p>
      {Object.keys(overview.by_person_type).length > 0 && (
        <p className="mt-2 text-xs text-gray-600">
          {labels.byType}:{" "}
          {Object.entries(overview.by_person_type)
            .map(([k, v]) => `${k} ${v}`)
            .join(" · ")}
        </p>
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
