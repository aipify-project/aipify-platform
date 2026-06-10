"use client";

import { useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import { formatSuccessScore } from "@/lib/skillos/success-score";
import type { PlatformSkillOSDashboard } from "@/lib/skillos/types";
import { createClient } from "@/lib/supabase/client";

type PlatformSkillOSPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    pulseLabel: string;
    principle: string;
    registry: {
      total: string;
      versions: string;
      installs: string;
    };
    status: { title: string };
    category: { title: string };
    pipeline: { title: string };
    codeRegistry: {
      title: string;
      stats: string;
    };
  };
  codeRegistryStats: string;
};

export function PlatformSkillOSPanel({
  labels,
  codeRegistryStats,
}: PlatformSkillOSPanelProps) {
  const [dashboard, setDashboard] = useState<PlatformSkillOSDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_platform_skillos_dashboard");
      if (!error && data) {
        setDashboard(data as PlatformSkillOSDashboard);
      }
      setLoading(false);
    }
    void load();
  }, []);

  if (loading) {
    return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;
  }

  if (!dashboard) {
    return (
      <div className="p-6">
        <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50/60 px-3 py-2 text-sm text-indigo-900">
          {dashboard.principle ?? labels.principle}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {labels.registry.total}
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {dashboard.skill_count}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {labels.registry.versions}
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {dashboard.version_count}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {labels.registry.installs}
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {dashboard.tenant_install_count}
          </p>
        </div>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-gray-900">{labels.codeRegistry.title}</h2>
        <p className="mt-2 text-sm text-gray-700">{codeRegistryStats}</p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-gray-900">{labels.status.title}</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {Object.entries(dashboard.by_status).map(([key, value]) => (
              <li key={key} className="flex justify-between">
                <span className="capitalize">{key}</span>
                <span className="font-medium">{value}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-gray-900">{labels.category.title}</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {Object.entries(dashboard.by_category).map(([key, value]) => (
              <li key={key} className="flex justify-between">
                <span>{key}</span>
                <span className="font-medium">{value}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-gray-900">{labels.pipeline.title}</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-gray-700">
          {dashboard.release_pipeline.map((stage) => (
            <li key={stage} className="capitalize">
              {stage.replace(/_/g, " ")}
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-gray-500">
          Success score range: {formatSuccessScore(0)} – {formatSuccessScore(100)}
        </p>
      </section>
    </div>
  );
}
