"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { useCallback, useEffect, useState } from "react";
import { parseOrchestrationRules, type OrchestrationRule } from "@/lib/aipify/orchestration";

type OrchestrationRulesPanelProps = {
  labels: Record<string, string>;
};

export function OrchestrationRulesPanel({ labels }: OrchestrationRulesPanelProps) {
  const [rules, setRules] = useState<OrchestrationRule[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/orchestration/rules");
    if (res.ok) {
      const data = await res.json();
      setRules(parseOrchestrationRules({ rules: data.rules }));
    }
    setLoading(false);
  }, []);

  const toggle = async (rule: OrchestrationRule) => {
    const path = rule.enabled ? "disable" : "enable";
    await fetch(`/api/aipify/orchestration/rules/${rule.id}/${path}`, { method: "POST" });
    void load();
  };

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">{labels.rulesHint}</p>
      {rules.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.noRules}</p>
      ) : (
        <ul className="space-y-2">
          {rules.map((r) => (
            <li key={r.id} className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-medium">{r.name}</span>
                  {!r.tenant_id ? (
                    <span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{labels.global}</span>
                  ) : null}
                </div>
                <span className={r.enabled ? "text-green-600" : "text-gray-400"}>
                  {r.enabled ? labels.enabled : labels.disabled}
                </span>
              </div>
              <p className="mt-1 text-gray-600">{r.event_type} · {r.risk_level}</p>
              {r.description ? <p className="mt-1 text-xs text-gray-500">{r.description}</p> : null}
              {r.tenant_id ? (
                <button type="button" onClick={() => void toggle(r)} className="mt-2 text-xs text-indigo-600 hover:underline">
                  {r.enabled ? labels.disable : labels.enable}
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
