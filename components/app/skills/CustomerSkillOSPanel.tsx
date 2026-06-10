"use client";

import { useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import { LEARNING_MODE_LABELS } from "@/lib/skillos/learning";
import { formatSuccessScore } from "@/lib/skillos/success-score";
import type { CustomerSkillWorkspace } from "@/lib/skillos/types";
import { createClient } from "@/lib/supabase/client";

type CustomerSkillOSPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    pulseLabel: string;
    principle: string;
    installed: { title: string; none: string };
    available: { title: string; none: string };
    columns: {
      name: string;
      category: string;
      status: string;
      learning: string;
      health: string;
      success: string;
    };
  };
};

export function CustomerSkillOSPanel({ labels }: CustomerSkillOSPanelProps) {
  const [workspace, setWorkspace] = useState<CustomerSkillWorkspace | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_customer_skill_workspace");
      if (!error && data) {
        setWorkspace(data as CustomerSkillWorkspace);
      }
      setLoading(false);
    }
    void load();
  }, []);

  if (loading) {
    return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;
  }

  if (!workspace) {
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
        <p className="mt-3 rounded-lg border border-violet-100 bg-violet-50/60 px-3 py-2 text-sm text-violet-900">
          {workspace.principle ?? labels.principle}
        </p>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-gray-900">{labels.installed.title}</h2>
        {workspace.installed_skills.length === 0 ? (
          <p className="mt-3 text-sm text-gray-600">{labels.installed.none}</p>
        ) : (
          <ul className="mt-4 divide-y divide-gray-100">
            {workspace.installed_skills.map((skill) => (
              <li key={skill.tenant_skill_id} className="py-3 text-sm text-gray-700">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-gray-900">{skill.name}</span>
                  <span className="text-xs uppercase tracking-wide text-gray-500">
                    {skill.category}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-600">
                  <span>
                    {labels.columns.status}: {skill.status}
                  </span>
                  <span>
                    {labels.columns.learning}:{" "}
                    {LEARNING_MODE_LABELS[
                      skill.learning_mode as keyof typeof LEARNING_MODE_LABELS
                    ] ?? skill.learning_mode}
                  </span>
                  <span>
                    {labels.columns.health}: {skill.health_score}
                  </span>
                  <span>
                    {labels.columns.success}: {formatSuccessScore(skill.success_score)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-gray-900">{labels.available.title}</h2>
        {workspace.available_skills.length === 0 ? (
          <p className="mt-3 text-sm text-gray-600">{labels.available.none}</p>
        ) : (
          <ul className="mt-4 divide-y divide-gray-100">
            {workspace.available_skills.map((skill) => (
              <li key={skill.key} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <span className="font-medium text-gray-900">{skill.name}</span>
                <span className="text-xs text-gray-500">
                  {skill.category} · {skill.minimum_plan}
                  {skill.requires_approval ? " · approval required" : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
