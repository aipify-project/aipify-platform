"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseValueReports, type ValueReport } from "@/lib/aipify/value-engine";

type ValueEngineReportsPanelProps = {
  labels: Record<string, string>;
};

export function ValueEngineReportsPanel({ labels }: ValueEngineReportsPanelProps) {
  const [reports, setReports] = useState<ValueReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/value/reports");
    if (res.ok) {
      const data = await res.json();
      setReports(parseValueReports(data));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function generate(reportType: string) {
    setGenerating(true);
    await fetch("/api/aipify/value/reports/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ report_type: reportType }),
    });
    await load();
    setGenerating(false);
  }

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="space-y-4">
      <Link href="/app/value" className="text-sm text-emerald-600 hover:underline">{labels.back}</Link>

      <div className="flex flex-wrap gap-2">
        {(["weekly", "monthly", "quarterly", "annual"] as const).map((type) => (
          <button
            key={type}
            type="button"
            disabled={generating}
            onClick={() => void generate(type)}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
          >
            {labels[`generate_${type}`] ?? type}
          </button>
        ))}
      </div>

      {reports.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.noReports}</p>
      ) : (
        <ul className="space-y-3">
          {reports.map((r) => (
            <li key={r.id} className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="font-medium text-gray-900">{r.title}</p>
              <p className="mt-1 text-sm text-gray-600">{r.summary}</p>
              {r.generated_at ? (
                <p className="mt-1 text-xs text-gray-500">{new Date(r.generated_at).toLocaleString()}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
