"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseMemoryPatterns, type MemoryPattern } from "@/lib/aipify/memory";

type MemoryPatternsPanelProps = {
  labels: Record<string, string>;
};

export function MemoryPatternsPanel({ labels }: MemoryPatternsPanelProps) {
  const [patterns, setPatterns] = useState<MemoryPattern[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/memory-engine/patterns");
    if (res.ok) setPatterns(parseMemoryPatterns(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <Link href="/app/memory" className="text-sm text-amber-800">{labels.back}</Link>
      </div>
      <p className="text-sm text-gray-600">{labels.subtitle}</p>

      {patterns.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.empty}</p>
      ) : (
        <ul className="space-y-3">
          {patterns.map((p) => (
            <li key={p.id} className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
              <div className="flex justify-between gap-2">
                <span className="font-medium">{p.title}</span>
                <span className="text-xs text-gray-500">
                  {p.frequency_count}x · {Math.round(p.confidence * 100)}%
                </span>
              </div>
              <p className="mt-1 text-gray-600">{p.description}</p>
              {p.explanation ? (
                <p className="mt-2 text-xs text-amber-800">{labels.explanation}: {p.explanation}</p>
              ) : null}
              <p className="mt-1 text-xs text-gray-400">{p.pattern_type} · {p.scope_level}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
