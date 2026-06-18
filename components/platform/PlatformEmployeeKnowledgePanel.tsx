"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Overview = {
  eke_profiles: number;
  approved_items: number;
  pending_items: number;
  open_gaps: number;
  onboarding_paths: number;
  avg_health_score: number;
  privacy_note?: string;
};

type Props = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    profiles: string;
    approved: string;
    pending: string;
    gaps: string;
    paths: string;
    avgHealth: string;
    privacyNote: string;
  };
};

const EMPTY: Overview = {
  eke_profiles: 0,
  approved_items: 0,
  pending_items: 0,
  open_gaps: 0,
  onboarding_paths: 0,
  avg_health_score: 0,
};

export default function PlatformEmployeeKnowledgePanel({ labels }: Props) {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<Overview>(EMPTY);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_platform_employee_knowledge_overview");
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
      <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label={labels.profiles} value={overview.eke_profiles} />
        <Stat label={labels.approved} value={overview.approved_items} />
        <Stat label={labels.pending} value={overview.pending_items} />
        <Stat label={labels.gaps} value={overview.open_gaps} />
        <Stat label={labels.paths} value={overview.onboarding_paths} />
        <Stat label={labels.avgHealth} value={overview.avg_health_score} />
      </div>
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
