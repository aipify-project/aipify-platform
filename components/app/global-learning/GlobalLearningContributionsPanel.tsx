"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseContributionExport, type GlobalLearningContribution } from "@/lib/aipify/global-learning";

type GlobalLearningContributionsPanelProps = {
  labels: Record<string, string>;
};

export function GlobalLearningContributionsPanel({ labels }: GlobalLearningContributionsPanelProps) {
  const [contributions, setContributions] = useState<GlobalLearningContribution[]>([]);
  const [participationMode, setParticipationMode] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/global-learning/export");
    if (res.ok) {
      const data = parseContributionExport(await res.json());
      setContributions(data.contributions);
      setParticipationMode(data.participation_mode ?? "");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="space-y-4">
      <Link href="/app/global-learning" className="text-sm text-violet-600 hover:underline">{labels.back}</Link>
      <p className="text-sm text-gray-600">
        {labels.mode}: <span className="capitalize">{participationMode.replace(/_/g, " ")}</span>
      </p>
      {contributions.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.noContributions}</p>
      ) : (
        <ul className="space-y-2">
          {contributions.map((c) => (
            <li key={`${c.category}-${c.learning_type}`} className="rounded-lg border border-gray-200 bg-white p-3 text-sm">
              <p className="font-medium capitalize">{c.category.replace(/_/g, " ")} · {c.learning_type.replace(/_/g, " ")}</p>
              <p className="text-gray-600">{c.signal_count} {labels.signals}</p>
              {c.last_signal_at ? (
                <p className="text-xs text-gray-500">{new Date(c.last_signal_at).toLocaleString()}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-gray-500">{labels.transparencyNote}</p>
    </div>
  );
}
