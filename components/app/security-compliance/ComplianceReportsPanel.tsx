"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseComplianceReports, type ComplianceReport } from "@/lib/aipify/security-compliance";

type ComplianceReportsPanelProps = {
  labels: Record<string, string>;
};

export function ComplianceReportsPanel({ labels }: ComplianceReportsPanelProps) {
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/compliance/reports");
    if (res.ok) {
      const data = await res.json();
      setReports(data.reports ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function generate(type: string) {
    setGenerating(true);
    await fetch("/api/aipify/compliance/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ report_type: type }),
    });
    await load();
    setGenerating(false);
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <Link href="/app/compliance" className="text-sm text-indigo-700">{labels.back}</Link>
      </div>
      <p className="text-sm text-gray-600">{labels.subtitle}</p>

      <div className="flex flex-wrap gap-2">
        {["security_posture", "data_residency", "access_control", "privacy_request"].map((type) => (
          <button key={type} type="button" disabled={generating} onClick={() => void generate(type)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-50">
            {labels.generate} {type.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {reports.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.noReports}</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {reports.map((r) => (
            <li key={r.id} className="rounded border border-gray-200 bg-white px-3 py-2">
              <span className="font-medium">{r.title}</span> · {r.report_type} · {r.created_at}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
