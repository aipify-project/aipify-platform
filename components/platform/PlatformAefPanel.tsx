"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Overview = {
  aef_profiles: number;
  total_actions: number;
  pending_actions: number;
  executed_actions: number;
  blocked_actions: number;
  active_rules: number;
  privacy_note?: string;
};

type Props = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    profiles: string;
    total: string;
    pending: string;
    executed: string;
    blocked: string;
    rules: string;
    privacyNote: string;
  };
};

const EMPTY: Overview = {
  aef_profiles: 0,
  total_actions: 0,
  pending_actions: 0,
  executed_actions: 0,
  blocked_actions: 0,
  active_rules: 0,
};

export default function PlatformAefPanel({ labels }: Props) {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<Overview>(EMPTY);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_platform_aef_overview");
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
      <p className="mt-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-800">
        {overview.privacy_note ?? labels.privacyNote}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-6">
        <Stat label={labels.profiles} value={overview.aef_profiles} />
        <Stat label={labels.total} value={overview.total_actions} />
        <Stat label={labels.pending} value={overview.pending_actions} />
        <Stat label={labels.executed} value={overview.executed_actions} />
        <Stat label={labels.blocked} value={overview.blocked_actions} />
        <Stat label={labels.rules} value={overview.active_rules} />
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}
