"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseValueOpportunities, type ValueOpportunity } from "@/lib/aipify/value-engine";

type ValueEngineOpportunitiesPanelProps = {
  labels: Record<string, string>;
};

const PRIORITY_COLOR: Record<string, string> = {
  high: "bg-red-100 text-red-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-gray-100 text-gray-700",
};

export function ValueEngineOpportunitiesPanel({ labels }: ValueEngineOpportunitiesPanelProps) {
  const [opportunities, setOpportunities] = useState<ValueOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/value/opportunities");
    if (res.ok) {
      const data = await res.json();
      setOpportunities(parseValueOpportunities(data));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="space-y-4">
      <Link href="/app/value" className="text-sm text-emerald-600 hover:underline">{labels.back}</Link>
      {opportunities.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.noOpportunities}</p>
      ) : (
        <ul className="space-y-3">
          {opportunities.map((o, i) => (
            <li key={`${o.type}-${i}`} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900">{o.title}</p>
                  <p className="mt-1 text-sm text-gray-600">{o.summary}</p>
                  <p className="mt-2 text-xs text-gray-500">{labels.evidence}: {o.evidence}</p>
                </div>
                <span className={`rounded px-2 py-0.5 text-xs capitalize ${PRIORITY_COLOR[o.priority] ?? "bg-gray-100"}`}>
                  {o.priority}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
