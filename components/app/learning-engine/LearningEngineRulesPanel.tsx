"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseLearningRules, type LearningRule } from "@/lib/aipify/learning-engine";

type LearningEngineRulesPanelProps = {
  labels: Record<string, string>;
};

export function LearningEngineRulesPanel({ labels }: LearningEngineRulesPanelProps) {
  const [rules, setRules] = useState<LearningRule[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/learning-engine/rules");
    if (res.ok) {
      const data = await res.json();
      setRules(parseLearningRules({ rules: data.rules }));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <Link href="/app/learning" className="text-sm text-teal-700">{labels.back}</Link>
      </div>
      <p className="text-sm text-gray-600">{labels.subtitle}</p>
      {rules.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.empty}</p>
      ) : (
        <ul className="space-y-2">
          {rules.map((r) => (
            <li key={r.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <div className="flex justify-between gap-2">
                <span className="font-medium">{r.title}</span>
                <span className="text-xs text-teal-700">{r.is_active ? labels.active : labels.inactive}</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">{r.source_module} · {r.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
