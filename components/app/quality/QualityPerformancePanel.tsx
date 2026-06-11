"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseQualityPageSnapshots, type QualityPageSnapshot } from "@/lib/aipify/quality";

type QualityPerformancePanelProps = {
  labels: Record<string, string>;
};

function formatBytes(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

export function QualityPerformancePanel({ labels }: QualityPerformancePanelProps) {
  const [pages, setPages] = useState<QualityPageSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/quality/performance/pages?limit=50");
    if (res.ok) setPages(parseQualityPageSnapshots(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{labels.title}</h1>
          <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
        </div>
        <Link href="/app/quality" className="text-sm text-violet-700">{labels.back}</Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white p-4">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-xs text-gray-500">
              <th className="py-2 pr-4">{labels.page}</th>
              <th className="py-2 pr-4">{labels.viewport}</th>
              <th className="py-2 pr-4">{labels.weight}</th>
              <th className="py-2 pr-4">{labels.loadTime}</th>
              <th className="py-2 pr-4">{labels.requests}</th>
              <th className="py-2 pr-4">{labels.jsWeight}</th>
              <th className="py-2">{labels.layoutIssues}</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id} className="border-b border-gray-100">
                <td className="py-2 pr-4">{page.page_url}</td>
                <td className="py-2 pr-4">{page.viewport}</td>
                <td className="py-2 pr-4">{formatBytes(page.total_page_weight_bytes)}</td>
                <td className="py-2 pr-4">{page.load_time_ms ? `${page.load_time_ms} ms` : "—"}</td>
                <td className="py-2 pr-4">{page.request_count ?? "—"}</td>
                <td className="py-2 pr-4">{formatBytes(page.script_weight_bytes)}</td>
                <td className="py-2">{page.layout_issue_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {pages.length === 0 ? <p className="mt-3 text-sm text-gray-500">{labels.noPages}</p> : null}
      </div>
    </div>
  );
}
