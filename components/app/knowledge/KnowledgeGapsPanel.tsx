"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseKnowledgeCenter, type KnowledgeGap } from "@/lib/aipify/knowledge";

type KnowledgeGapsPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    empty: string;
    createFromGap: string;
    dismiss: string;
  };
};

export function KnowledgeGapsPanel({ labels }: KnowledgeGapsPanelProps) {
  const [gaps, setGaps] = useState<KnowledgeGap[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/knowledge");
    if (res.ok) {
      const center = parseKnowledgeCenter(await res.json());
      setGaps(center.open_gaps);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading) return <p className="text-sm text-gray-500">{labels.loading}</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <Link href="/app/knowledge-center" className="text-sm text-indigo-600 hover:underline">{labels.back}</Link>
      <h1 className="text-2xl font-semibold">{labels.title}</h1>
      <p className="text-sm text-gray-600">{labels.subtitle}</p>
      {gaps.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.empty}</p>
      ) : (
        <div className="space-y-3">
          {gaps.map((gap) => (
            <div key={gap.id} className="rounded-xl border bg-white p-4 shadow-sm">
              <p className="font-medium">{gap.question}</p>
              <p className="mt-1 text-xs text-gray-500">Asked {gap.frequency_count} times</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
