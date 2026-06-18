"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseProcessDetail, type ProcessDetail } from "@/lib/aipify/digital-twin";

type ProcessDetailPanelProps = {
  processKey: string;
  labels: Record<string, string>;
};

export function ProcessDetailPanel({ processKey, labels }: ProcessDetailPanelProps) {
  const [detail, setDetail] = useState<ProcessDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/digital-twin/processes/${processKey}`);
    if (res.ok) setDetail(parseProcessDetail(await res.json()));
    setLoading(false);
  }, [processKey]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!detail) return <div className="text-sm text-gray-600">{labels.notFound}</div>;

  return (
    <div className="space-y-6">
      <Link href="/app/digital-twin" className="text-sm text-slate-700 hover:underline">
        ← {labels.back}
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{detail.process.process_name}</h1>
        <p className="mt-1 text-sm capitalize text-gray-500">{detail.process.category}</p>
      </div>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.steps}</h2>
        <ol className="mt-3 space-y-2">
          {detail.steps.map((step) => (
            <li key={step.step_order} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <span className="font-medium">{step.step_order}. {step.step_name}</span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.escalationPath}</h2>
        <ol className="mt-3 space-y-1 text-sm text-gray-700">
          {detail.escalation_path.map((step) => (
            <li key={step.path_order}>{step.path_order}. {step.role_key.replace(/_/g, " ")}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
