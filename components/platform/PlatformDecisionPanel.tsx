"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Overview = {
  dse_profiles: number;
  pending_recommendations: number;
  accepted_guidance: number;
  by_domain: Record<string, number>;
  by_confidence: Record<string, number>;
  privacy_note?: string;
};

type Props = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    profiles: string;
    pending: string;
    accepted: string;
    byDomain: string;
    byConfidence: string;
    privacyNote: string;
  };
};

const EMPTY: Overview = {
  dse_profiles: 0,
  pending_recommendations: 0,
  accepted_guidance: 0,
  by_domain: {},
  by_confidence: {},
};

export default function PlatformDecisionPanel({ labels }: Props) {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<Overview>(EMPTY);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_platform_decisions_overview");
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
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Stat label={labels.profiles} value={overview.dse_profiles} />
        <Stat label={labels.pending} value={overview.pending_recommendations} />
        <Stat label={labels.accepted} value={overview.accepted_guidance} />
      </div>
      {Object.keys(overview.by_domain).length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase text-gray-500">{labels.byDomain}</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {Object.entries(overview.by_domain).map(([k, v]) => (
              <li key={k} className="rounded-lg bg-gray-50 px-3 py-1">
                {k}: {v}
              </li>
            ))}
          </ul>
        </div>
      )}
      {Object.keys(overview.by_confidence).length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase text-gray-500">{labels.byConfidence}</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {Object.entries(overview.by_confidence).map(([k, v]) => (
              <li key={k} className="rounded-lg bg-gray-50 px-3 py-1">
                {k}: {v}
              </li>
            ))}
          </ul>
        </div>
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
