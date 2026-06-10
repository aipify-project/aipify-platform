"use client";

import { useCallback, useEffect, useState } from "react";

type GovernancePolicy = {
  policy_key: string;
  environment_type: string;
  learning_mode_default: string;
  adaptive_allowed: boolean;
  rollout_stage: string;
};

type RolloutStage = {
  stage: string;
  label: string;
};

type GovernanceBundle = {
  policies: GovernancePolicy[];
  rollout: RolloutStage[];
  safeguards: Record<string, boolean>;
};

type PlatformLearningGovernanceSectionProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    environment: string;
    defaultMode: string;
    adaptive: string;
    rollout: string;
    safeguards: string;
    yes: string;
    no: string;
  };
};

export default function PlatformLearningGovernanceSection({
  labels,
}: PlatformLearningGovernanceSectionProps) {
  const [loading, setLoading] = useState(true);
  const [bundle, setBundle] = useState<GovernanceBundle | null>(null);

  const load = useCallback(async () => {
    const supabase = (await import("@/lib/supabase/client")).createClient();
    const { data, error } = await supabase.rpc("get_platform_learning_governance");
    if (!error && data) {
      setBundle(data as GovernanceBundle);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!bundle) return null;

  return (
    <section className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{labels.title}</h2>
        <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {bundle.policies?.map((policy) => (
          <div key={policy.policy_key} className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="font-medium text-gray-900">{policy.policy_key}</p>
            <dl className="mt-2 space-y-1 text-xs text-gray-600">
              <div>
                <dt className="inline font-medium">{labels.environment}: </dt>
                <dd className="inline">{policy.environment_type}</dd>
              </div>
              <div>
                <dt className="inline font-medium">{labels.defaultMode}: </dt>
                <dd className="inline">{policy.learning_mode_default}</dd>
              </div>
              <div>
                <dt className="inline font-medium">{labels.adaptive}: </dt>
                <dd className="inline">
                  {policy.adaptive_allowed ? labels.yes : labels.no}
                </dd>
              </div>
              <div>
                <dt className="inline font-medium">{labels.rollout}: </dt>
                <dd className="inline">{policy.rollout_stage}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      {bundle.rollout?.length > 0 && (
        <ol className="flex flex-wrap gap-2 text-xs">
          {bundle.rollout.map((stage, index) => (
            <li key={stage.stage} className="flex items-center gap-2">
              <span className="rounded bg-indigo-100 px-2 py-1 text-indigo-900">
                {stage.label}
              </span>
              {index < bundle.rollout.length - 1 && (
                <span className="text-gray-400">→</span>
              )}
            </li>
          ))}
        </ol>
      )}

      {bundle.safeguards && (
        <p className="text-xs text-gray-500">
          {labels.safeguards}:{" "}
          {Object.entries(bundle.safeguards)
            .map(([key, value]) => `${key}=${value ? labels.yes : labels.no}`)
            .join(" · ")}
        </p>
      )}
    </section>
  );
}
