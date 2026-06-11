"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Overview = {
  users_with_goals: number;
  active_goals: number;
  completed_goals: number;
  milestones_completed: number;
  by_category: Record<string, number>;
  privacy_note?: string;
};

type Props = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    users: string;
    active: string;
    completed: string;
    milestones: string;
    byCategory: string;
    privacyNote: string;
  };
};

const EMPTY: Overview = {
  users_with_goals: 0,
  active_goals: 0,
  completed_goals: 0,
  milestones_completed: 0,
  by_category: {},
};

export default function PlatformGoalsPanel({ labels }: Props) {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<Overview>(EMPTY);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_platform_goals_overview");
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
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <Stat label={labels.users} value={overview.users_with_goals} />
        <Stat label={labels.active} value={overview.active_goals} />
        <Stat label={labels.completed} value={overview.completed_goals} />
        <Stat label={labels.milestones} value={overview.milestones_completed} />
      </div>
      {Object.keys(overview.by_category).length > 0 && (
        <p className="mt-3 text-xs text-gray-600">
          {labels.byCategory}:{" "}
          {Object.entries(overview.by_category)
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
