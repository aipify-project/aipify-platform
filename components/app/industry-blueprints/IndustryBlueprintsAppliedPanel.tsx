"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseBlueprintInstalls, type BlueprintInstall } from "@/lib/aipify/industry-blueprints";

type IndustryBlueprintsAppliedPanelProps = {
  labels: Record<string, string>;
};

export function IndustryBlueprintsAppliedPanel({ labels }: IndustryBlueprintsAppliedPanelProps) {
  const [installs, setInstalls] = useState<BlueprintInstall[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/industry-blueprints/applied");
    if (res.ok) {
      const data = await res.json();
      setInstalls(parseBlueprintInstalls(data));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="space-y-4">
      <Link href="/app/industry-blueprints" className="text-sm text-teal-600 hover:underline">{labels.back}</Link>
      {installs.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.noApplied}</p>
      ) : (
        <ul className="space-y-3">
          {installs.map((install) => (
            <li key={install.id} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{install.blueprint?.title ?? labels.unknownBlueprint}</p>
                  <p className="text-sm text-gray-600">{install.install_summary}</p>
                  {install.applied_at ? (
                    <p className="mt-1 text-xs text-gray-500">{new Date(install.applied_at).toLocaleString()}</p>
                  ) : null}
                </div>
                <span className="rounded bg-teal-100 px-2 py-0.5 text-xs capitalize text-teal-800">{install.status}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
