"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Overview = {
  aso_profiles: number;
  open_cases: number;
  auto_replied_total: number;
  escalated_total: number;
  knowledge_gaps_open: number;
  by_autonomy_level: Record<string, number>;
  privacy_note?: string;
};

type Props = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    profiles: string;
    openCases: string;
    autoReplied: string;
    escalated: string;
    gaps: string;
    privacyNote: string;
  };
};

const EMPTY: Overview = {
  aso_profiles: 0,
  open_cases: 0,
  auto_replied_total: 0,
  escalated_total: 0,
  knowledge_gaps_open: 0,
  by_autonomy_level: {},
};

export default function PlatformSupportOperationsPanel({ labels }: Props) {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<Overview>(EMPTY);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_platform_support_operations_overview");
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
      <p className="mt-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-800">
        {overview.privacy_note ?? labels.privacyNote}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-5">
        <Stat label={labels.profiles} value={overview.aso_profiles} />
        <Stat label={labels.openCases} value={overview.open_cases} />
        <Stat label={labels.autoReplied} value={overview.auto_replied_total} />
        <Stat label={labels.escalated} value={overview.escalated_total} />
        <Stat label={labels.gaps} value={overview.knowledge_gaps_open} />
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
