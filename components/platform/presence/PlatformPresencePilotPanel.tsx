"use client";

import { useEffect, useState } from "react";
import type { PresencePilotMetrics } from "@/lib/presence/notification-state";
import { createClient } from "@/lib/supabase/client";

type PlatformPresencePilotPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    metrics: {
      sent: string;
      actions: string;
      dismissRate: string;
      usefulness: string;
      feedEntries: string;
      engagement: string;
      approvalRate: string;
      feedQuality: string;
    };
    principle: string;
  };
};

export function PlatformPresencePilotPanel({ labels }: PlatformPresencePilotPanelProps) {
  const [metrics, setMetrics] = useState<PresencePilotMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_presence_pilot_metrics");
      if (!error && data?.has_pilot) {
        setMetrics(data as PresencePilotMetrics);
      }
      setLoading(false);
    }
    void load();
  }, []);

  if (loading) {
    return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;
  }

  if (!metrics) {
    return <div className="p-6 text-sm text-gray-600">{labels.empty}</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-lg border border-violet-100 bg-violet-50/60 px-3 py-2 text-sm text-violet-900">
          {labels.principle}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">{labels.metrics.sent}</p>
          <p className="mt-2 text-2xl font-semibold">{metrics.notifications_sent_7d}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">{labels.metrics.actions}</p>
          <p className="mt-2 text-2xl font-semibold">{metrics.actions_completed_7d}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">{labels.metrics.dismissRate}</p>
          <p className="mt-2 text-2xl font-semibold">{metrics.dismiss_rate_pct}%</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">{labels.metrics.usefulness}</p>
          <p className="mt-2 text-2xl font-semibold">{metrics.usefulness_score}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">{labels.metrics.feedEntries}</p>
          <p className="mt-2 text-2xl font-semibold">{metrics.executive_feed_entries ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">{labels.metrics.engagement}</p>
          <p className="mt-2 text-2xl font-semibold">{metrics.engagement_events_7d ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">{labels.metrics.approvalRate}</p>
          <p className="mt-2 text-2xl font-semibold">
            {metrics.approval_completion_rate_pct ?? 0}%
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">{labels.metrics.feedQuality}</p>
          <p className="mt-2 text-2xl font-semibold">{metrics.feed_quality_score ?? 0}</p>
        </div>
      </div>
    </div>
  );
}
