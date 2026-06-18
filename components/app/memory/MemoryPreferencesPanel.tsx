"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseMemoryProfiles, type MemoryProfile } from "@/lib/aipify/memory";

type MemoryPreferencesPanelProps = {
  labels: Record<string, string>;
};

export function MemoryPreferencesPanel({ labels }: MemoryPreferencesPanelProps) {
  const [profiles, setProfiles] = useState<MemoryProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/memory-engine/profiles?limit=100");
    if (res.ok) setProfiles(parseMemoryProfiles(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function remove(id: string) {
    await fetch(`/api/aipify/memory-engine/profiles/${id}`, { method: "DELETE" });
    await refresh();
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <Link href="/app/memory" className="text-sm text-amber-800">{labels.back}</Link>
      </div>
      <p className="text-sm text-gray-600">{labels.subtitle}</p>

      {profiles.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.empty}</p>
      ) : (
        <ul className="space-y-3">
          {profiles.map((p) => (
            <li key={p.id} className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
              <div className="flex justify-between gap-3">
                <div>
                  <span className="font-medium">{p.profile_key}</span>
                  <span className="ml-2 text-xs text-gray-500">{p.scope_level} · {p.source_module}</span>
                  {p.explanation ? <p className="mt-1 text-gray-600">{p.explanation}</p> : null}
                  <pre className="mt-2 overflow-x-auto rounded bg-gray-50 p-2 text-xs">
                    {JSON.stringify(p.profile_value, null, 2)}
                  </pre>
                </div>
                <button
                  type="button"
                  onClick={() => void remove(p.id)}
                  className="shrink-0 text-xs text-gray-500 hover:text-red-600"
                >
                  {labels.delete}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
