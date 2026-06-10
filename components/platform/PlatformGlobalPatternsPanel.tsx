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
              </div>
              <p className="mt-3 text-sm text-gray-700">
                <span className="font-semibold">{labels.suggestedAction}:</span>{" "}
                {pattern.suggested_action}
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div>
                  <dt>{labels.confidence}</dt>
                  <dd className="font-semibold text-gray-900">{pattern.confidence_score}%</dd>
                </div>
                <div>
                  <dt>{labels.detections}</dt>
                  <dd className="font-semibold text-gray-900">{pattern.detection_count}</dd>
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
