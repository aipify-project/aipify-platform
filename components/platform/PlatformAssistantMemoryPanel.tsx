"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Overview = {
  active_memories: number;
  tenants_with_memory: number;
  by_category: Record<string, number>;
  memory_disabled_tenants: number;
  privacy_note?: string;
};

type PlatformAssistantMemoryPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    active: string;
    tenants: string;
    disabled: string;
    byCategory: string;
    privacyNote: string;
  };
};

const EMPTY: Overview = {
  active_memories: 0,
  tenants_with_memory: 0,
  by_category: {},
  memory_disabled_tenants: 0,
  privacy_note: undefined,
};

export default function PlatformAssistantMemoryPanel({
  labels,
}: PlatformAssistantMemoryPanelProps) {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<Overview>(EMPTY);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_platform_assistant_memory_overview");
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

  if (loading) return <p className="mb-6 text-sm text-gray-500">{labels.loading}</p>;

  return (
    <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{labels.title}</h2>
      <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
      <p className="mt-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-900">
        {overview.privacy_note ?? labels.privacyNote}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-500">{labels.active}</p>
          <p className="text-2xl font-semibold">{overview.active_memories}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-500">{labels.tenants}</p>
          <p className="text-2xl font-semibold">{overview.tenants_with_memory}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-500">{labels.disabled}</p>
          <p className="text-2xl font-semibold">{overview.memory_disabled_tenants}</p>
        </div>
      </div>
      {Object.keys(overview.by_category).length > 0 && (
        <p className="mt-4 text-xs text-gray-600">
          {labels.byCategory}:{" "}
          {Object.entries(overview.by_category)
            .map(([k, v]) => `${k} ${v}`)
            .join(" · ")}
        </p>
      )}
    </section>
  );
}
