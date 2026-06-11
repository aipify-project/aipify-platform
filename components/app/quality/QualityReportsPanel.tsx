"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { parseQualityReports, type QualityReport } from "@/lib/aipify/quality";

type QualityReportsPanelProps = {
  labels: Record<string, string>;
};

export function QualityReportsPanel({ labels }: QualityReportsPanelProps) {
  const [reports, setReports] = useState<QualityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  async function load() {
    const res = await fetch("/api/aipify/quality/reports");
    if (res.ok) setReports(parseQualityReports(await res.json()));
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function generateReport() {
    setGenerating(true);
    await fetch("/api/aipify/quality/reports/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ report_type: "admin_summary" }),
    });
    await load();
    setGenerating(false);
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={generating}
            onClick={() => void generateReport()}
            className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm text-white disabled:opacity-50"
          >
            {labels.generateReport}
          </button>
          <Link href="/app/quality" className="text-sm text-violet-700">{labels.back}</Link>
        </div>
      </div>
      <div className="space-y-4">
        {reports.map((report) => (
          <article key={report.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="font-medium">{report.title}</h2>
            <pre className="mt-3 whitespace-pre-wrap text-sm text-gray-700">{report.report_body}</pre>
          </article>
        ))}
        {reports.length === 0 ? <p className="text-sm text-gray-500">{labels.empty}</p> : null}
      </div>
    </div>
  );
}
