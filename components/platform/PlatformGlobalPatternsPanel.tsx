"use client";

import { useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import { formatDateTime } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";
import { parseGlobalPatterns, type GlobalPattern } from "@/lib/platform/intelligence-engine";
import { getEnvironmentStyle } from "@/lib/platform/self-learning";

type PlatformGlobalPatternsPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    pulseLabel: string;
    category: string;
    confidence: string;
    detections: string;
    suggestedAction: string;
    sourceEnvironment: string;
    approvedAt: string;
    approvedBy: string;
    detectedAcross: string;
    potentialImpact: string;
    estimatedBenefit: string;
    supportReduction: string;
    failurePrevention: string;
    onboardingImprovement: string;
    privacyNote: string;
  };
};

export default function PlatformGlobalPatternsPanel({
  locale,
  labels,
}: PlatformGlobalPatternsPanelProps) {
  const [loading, setLoading] = useState(true);
  const [patterns, setPatterns] = useState<GlobalPattern[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_global_patterns");

      if (!cancelled) {
        setPatterns(error || !data ? [] : parseGlobalPatterns(data));
        setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
      </div>

      {patterns.length === 0 ? (
        <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {patterns.map((pattern) => (
            <article
              key={pattern.id}
              className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-6 shadow-sm"
            >
              <h2 className="text-base font-semibold text-gray-900">{pattern.pattern_title}</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-gray-700">
                  {labels.category}: {pattern.category}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${getEnvironmentStyle(pattern.source_environment)}`}
                >
                  {labels.sourceEnvironment}: {pattern.source_environment}
                </span>
                <span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-700 ring-1 ring-inset ring-violet-100">
                  {labels.confidence}: {pattern.confidence_score}%
                </span>
              </div>

              <p className="mt-3 text-sm text-gray-700">
                <span className="font-semibold">{labels.suggestedAction}:</span>{" "}
                {pattern.suggested_action}
              </p>

              {pattern.detected_across && pattern.detected_across.length > 0 ? (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.detectedAcross}
                  </p>
                  <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-gray-700">
                    {pattern.detected_across.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {pattern.potential_impact_items && pattern.potential_impact_items.length > 0 ? (
                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.potentialImpact}
                  </p>
                  <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-gray-700">
                    {pattern.potential_impact_items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {pattern.estimated_benefit && Object.keys(pattern.estimated_benefit).length > 0 ? (
                <div className="mt-3 rounded-xl border border-emerald-100 bg-white/70 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {labels.estimatedBenefit}
                  </p>
                  <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    {pattern.estimated_benefit.support_reduction_pct != null ? (
                      <div>
                        <dt className="text-gray-500">{labels.supportReduction}</dt>
                        <dd className="font-semibold text-gray-900">
                          {pattern.estimated_benefit.support_reduction_pct}%
                        </dd>
                      </div>
                    ) : null}
                    {pattern.estimated_benefit.failure_prevention_pct != null ? (
                      <div>
                        <dt className="text-gray-500">{labels.failurePrevention}</dt>
                        <dd className="font-semibold text-gray-900">
                          {pattern.estimated_benefit.failure_prevention_pct}%
                        </dd>
                      </div>
                    ) : null}
                    {pattern.estimated_benefit.onboarding_improvement_pct != null ? (
                      <div>
                        <dt className="text-gray-500">{labels.onboardingImprovement}</dt>
                        <dd className="font-semibold text-gray-900">
                          {pattern.estimated_benefit.onboarding_improvement_pct}%
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
              ) : null}

              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div>
                  <dt>{labels.detections}</dt>
                  <dd className="font-semibold text-gray-900">{pattern.detection_count}</dd>
                </div>
                <div>
                  <dt>{labels.approvedBy}</dt>
                  <dd className="font-semibold text-gray-900">{pattern.approved_by ?? "—"}</dd>
                </div>
              </dl>
              <p className="mt-2 text-xs text-gray-500">
                {labels.approvedAt}: {formatDateTime(pattern.approved_at, locale)}
              </p>
            </article>
          ))}
        </div>
      )}

      <p className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-xs text-blue-900">
        {labels.privacyNote}
      </p>
    </div>
  );
}
