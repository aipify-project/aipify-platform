"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseQualityAssets, parseQualityIncidents, type QualityAsset, type QualityIncident } from "@/lib/aipify/quality";

type QualityImagesPanelProps = {
  labels: Record<string, string>;
  severityLabels: Record<string, string>;
};

function formatSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

export function QualityImagesPanel({ labels, severityLabels }: QualityImagesPanelProps) {
  const [images, setImages] = useState<QualityAsset[]>([]);
  const [issues, setIssues] = useState<QualityIncident[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [imgRes, issueRes] = await Promise.all([
      fetch("/api/aipify/quality/images/largest?limit=30"),
      fetch("/api/aipify/quality/images/issues"),
    ]);
    if (imgRes.ok) setImages(parseQualityAssets(await imgRes.json()));
    if (issueRes.ok) setIssues(parseQualityIncidents(await issueRes.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{labels.title}</h1>
          <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
        </div>
        <Link href="/app/quality" className="text-sm text-violet-700">{labels.back}</Link>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-semibold">{labels.largestImages}</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-xs text-gray-500">
                <th className="py-2 pr-4">{labels.url}</th>
                <th className="py-2 pr-4">{labels.page}</th>
                <th className="py-2 pr-4">{labels.size}</th>
                <th className="py-2 pr-4">{labels.format}</th>
                <th className="py-2">{labels.alt}</th>
              </tr>
            </thead>
            <tbody>
              {images.map((img) => (
                <tr key={img.id} className="border-b border-gray-100">
                  <td className="max-w-xs truncate py-2 pr-4 font-mono text-xs">{img.url}</td>
                  <td className="py-2 pr-4 text-gray-600">{img.page_url ?? "—"}</td>
                  <td className="py-2 pr-4">{formatSize(img.size_bytes)}</td>
                  <td className="py-2 pr-4 uppercase">{img.file_format ?? "—"}</td>
                  <td className="py-2">{img.has_alt_text ? labels.yes : labels.no}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {images.length === 0 ? <p className="mt-3 text-sm text-gray-500">{labels.noImages}</p> : null}
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-semibold">{labels.imageIssues}</h2>
        <ul className="mt-3 space-y-2">
          {issues.map((inc) => (
            <li key={inc.id} className="rounded border border-gray-100 px-3 py-2 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-medium">{inc.title}</p>
                <span className="text-xs text-gray-500">{severityLabels[inc.severity] ?? inc.severity}</span>
              </div>
              <p className="mt-1 text-gray-600">{inc.observed_behavior}</p>
              {inc.suggested_fix ? <p className="mt-1 text-xs text-violet-800">{inc.suggested_fix}</p> : null}
            </li>
          ))}
          {issues.length === 0 ? <li className="text-sm text-gray-500">{labels.noIssues}</li> : null}
        </ul>
      </section>
    </div>
  );
}
