"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Overview = {
  profiles: number;
  active_profiles: number;
  approved_templates: number;
  approved_knowledge: number;
  email_drafts: number;
  avg_health_score: number;
  privacy_note?: string;
};

type Props = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    profiles: string;
    active: string;
    templates: string;
    knowledge: string;
    drafts: string;
    avgHealth: string;
    privacyNote: string;
  };
};

const EMPTY: Overview = {
  profiles: 0,
  active_profiles: 0,
  approved_templates: 0,
  approved_knowledge: 0,
  email_drafts: 0,
  avg_health_score: 0,
};

export default function PlatformBusinessDnaPanel({ labels }: Props) {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<Overview>(EMPTY);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_platform_business_dna_overview");
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
      <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label={labels.profiles} value={overview.profiles} />
        <Stat label={labels.active} value={overview.active_profiles} />
        <Stat label={labels.templates} value={overview.approved_templates} />
        <Stat label={labels.knowledge} value={overview.approved_knowledge} />
        <Stat label={labels.drafts} value={overview.email_drafts} />
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
