"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Overview = {
  tenants_with_life_os: number;
  active_checklists: number;
  memories_with_meta: number;
  reschedule_suggestions: number;
  by_priority: Record<string, number>;
  by_life_area: Record<string, number>;
  privacy_note?: string;
};

type PlatformLifeOsPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    tenants: string;
    checklists: string;
    memories: string;
    reschedule: string;
    byPriority: string;
    byLifeArea: string;
    privacyNote: string;
  };
};

const EMPTY: Overview = {
  tenants_with_life_os: 0,
  active_checklists: 0,
  memories_with_meta: 0,
  reschedule_suggestions: 0,
  by_priority: {},
  by_life_area: {},
};

export default function PlatformLifeOsPanel({ labels }: PlatformLifeOsPanelProps) {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<Overview>(EMPTY);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_platform_life_os_overview");
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
      <p className="mt-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-900">
        {overview.privacy_note ?? labels.privacyNote}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-500">{labels.tenants}</p>
          <p className="text-2xl font-semibold">{overview.tenants_with_life_os}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-500">{labels.checklists}</p>
          <p className="text-2xl font-semibold">{overview.active_checklists}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-500">{labels.memories}</p>
          <p className="text-2xl font-semibold">{overview.memories_with_meta}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-500">{labels.reschedule}</p>
          <p className="text-2xl font-semibold">{overview.reschedule_suggestions}</p>
        </div>
      </div>
      {(Object.keys(overview.by_priority).length > 0 ||
        Object.keys(overview.by_life_area).length > 0) && (
        <div className="mt-4 space-y-2 text-xs text-gray-600">
          {Object.keys(overview.by_priority).length > 0 && (
            <p>
              {labels.byPriority}:{" "}
              {Object.entries(overview.by_priority)
                .map(([k, v]) => `${k} ${v}`)
                .join(" · ")}
            </p>
          )}
          {Object.keys(overview.by_life_area).length > 0 && (
            <p>
              {labels.byLifeArea}:{" "}
              {Object.entries(overview.by_life_area)
                .map(([k, v]) => `${k} ${v}`)
                .join(" · ")}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
