"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Overview = {
  tag_profiles: number;
  active_focus_sessions: number;
  protected_blocks: number;
  focus_enabled: number;
  privacy_note?: string;
};

type Props = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    profiles: string;
    activeFocus: string;
    blocks: string;
    enabled: string;
    privacyNote: string;
  };
};

const EMPTY: Overview = {
  tag_profiles: 0,
  active_focus_sessions: 0,
  protected_blocks: 0,
  focus_enabled: 0,
};

export default function PlatformAttentionPanel({ labels }: Props) {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<Overview>(EMPTY);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_platform_attention_overview");
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
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <Stat label={labels.profiles} value={overview.tag_profiles} />
        <Stat label={labels.activeFocus} value={overview.active_focus_sessions} />
        <Stat label={labels.blocks} value={overview.protected_blocks} />
        <Stat label={labels.enabled} value={overview.focus_enabled} />
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
