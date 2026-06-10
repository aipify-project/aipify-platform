"use client";

import { useEffect, useState } from "react";
import {
  parseLearningGovernanceOverview,
  type LearningGovernanceOverview,
} from "@/lib/platform/learning-governance";
import { createClient } from "@/lib/supabase/client";

type PlatformLearningGovernancePanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    rollout: string;
    safeguards: string;
    pilot: string;
    totals: {
      activeMemories: string;
      disabledTenants: string;
      adaptiveTenants: string;
    };
  };
};

const EMPTY: LearningGovernanceOverview = {
  rollout_pipeline: [],
  safeguards: [],
  pilot: { tenant_slug: "unonight", active_memories: 0 },
  totals: { active_memories: 0, disabled_tenants: 0, adaptive_tenants: 0 },
};

export default function PlatformLearningGovernancePanel({
  labels,
}: PlatformLearningGovernancePanelProps) {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<LearningGovernanceOverview>(EMPTY);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_learning_governance_overview");
      if (!cancelled) {
        setOverview(error || !data ? EMPTY : parseLearningGovernanceOverview(data));
        setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="mb-6 text-sm text-gray-500">{labels.loading}</p>;
  }

  return (
    <section className="mb-8 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
      <h2 className="text-lg font-semibold text-gray-900">{labels.title}</h2>
      <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {labels.rollout}
          </h3>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {overview.rollout_pipeline.map((stage) => (
              <li key={stage.stage}>
                {stage.stage} · {stage.status}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {labels.safeguards}
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-gray-700">
            {overview.safeguards.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {labels.pilot}
          </h3>
          <p className="mt-2 text-sm text-gray-700">
            {overview.pilot.tenant_slug}: {overview.pilot.active_memories} active memories
          </p>
          <ul className="mt-3 space-y-1 text-sm text-gray-600">
            <li>
              {labels.totals.activeMemories}: {overview.totals.active_memories}
            </li>
            <li>
              {labels.totals.disabledTenants}: {overview.totals.disabled_tenants}
            </li>
            <li>
              {labels.totals.adaptiveTenants}: {overview.totals.adaptive_tenants}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
