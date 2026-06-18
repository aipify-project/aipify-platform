"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useEffect, useState } from "react";
import { parseQualityScans, type QualityScanRun } from "@/lib/aipify/quality";

type QualityScansPanelProps = {
  labels: Record<string, string>;
};

export function QualityScansPanel({ labels }: QualityScansPanelProps) {
  const [scans, setScans] = useState<QualityScanRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/aipify/quality/scans");
      if (res.ok) setScans(parseQualityScans(await res.json()));
      setLoading(false);
    }
    void load();
  }, []);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <Link href="/app/quality" className="text-sm text-violet-700">{labels.back}</Link>
      </div>
      <div className="space-y-3">
        {scans.map((scan) => (
          <div key={scan.id} className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
            <div className="flex justify-between font-medium">
              <span>{scan.scan_type}</span>
              <span className="text-gray-500">{scan.status}</span>
            </div>
            {scan.summary ? <p className="mt-2 text-gray-600">{scan.summary}</p> : null}
            <p className="mt-1 text-xs text-gray-500">
              {scan.checks_passed} passed · {scan.checks_failed} failed · {scan.incidents_created} incidents
            </p>
          </div>
        ))}
        {scans.length === 0 ? <p className="text-sm text-gray-500">{labels.empty}</p> : null}
      </div>
    </div>
  );
}
