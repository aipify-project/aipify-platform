"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseQualityIncidents, type QualityIncident } from "@/lib/aipify/quality";

type QualityMobilePanelProps = {
  labels: Record<string, string>;
  severityLabels: Record<string, string>;
};

export function QualityMobilePanel({ labels, severityLabels }: QualityMobilePanelProps) {
  const [incidents, setIncidents] = useState<QualityIncident[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/quality/mobile/incidents");
    if (res.ok) setIncidents(parseQualityIncidents(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{labels.title}</h1>
          <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
        </div>
        <Link href="/app/quality" className="text-sm text-violet-700">{labels.back}</Link>
      </div>

      <div className="space-y-3">
        {incidents.map((inc) => (
          <div key={inc.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h2 className="font-medium">{inc.title}</h2>
              <span className="text-xs text-gray-500">{severityLabels[inc.severity] ?? inc.severity}</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">{inc.observed_behavior}</p>
            {inc.suggested_fix ? (
              <p className="mt-2 text-sm text-violet-800">{labels.suggestedFix}: {inc.suggested_fix}</p>
            ) : null}
          </div>
        ))}
        {incidents.length === 0 ? <p className="text-sm text-gray-500">{labels.noIssues}</p> : null}
      </div>
    </div>
  );
}
