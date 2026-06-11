"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Overview = {
  profiles_count: number;
  onboarding_completed: number;
  pending_observations: number;
  by_mode: Record<string, number>;
  by_proactivity: Record<string, number>;
  privacy_note?: string;
};

type Props = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    profiles: string;
    onboarded: string;
    pending: string;
    byMode: string;
    privacyNote: string;
  };
};

const EMPTY: Overview = {
  profiles_count: 0,
  onboarding_completed: 0,
  pending_observations: 0,
  by_mode: {},
  by_proactivity: {},
};

export default function PlatformIdentityPanel({ labels }: Props) {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<Overview>(EMPTY);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_platform_identity_overview");
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
      <p className="mt-2 rounded-lg border border-violet-100 bg-violet-50 px-3 py-2 text-xs text-violet-900">
        {overview.privacy_note ?? labels.privacyNote}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Stat label={labels.profiles} value={overview.profiles_count} />
        <Stat label={labels.onboarded} value={overview.onboarding_completed} />
        <Stat label={labels.pending} value={overview.pending_observations} />
      </div>
      {Object.keys(overview.by_mode).length > 0 && (
        <p className="mt-3 text-xs text-gray-600">
          {labels.byMode}:{" "}
          {Object.entries(overview.by_mode)
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
