"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseAccessPolicies, type AccessPolicy } from "@/lib/aipify/security-compliance";

type SecurityPoliciesPanelProps = {
  labels: Record<string, string>;
};

export function SecurityPoliciesPanel({ labels }: SecurityPoliciesPanelProps) {
  const [policies, setPolicies] = useState<AccessPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [evalResult, setEvalResult] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/security/policies");
    if (res.ok) {
      const data = await res.json();
      setPolicies(data.policies ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function testPolicy() {
    const res = await fetch("/api/aipify/policy/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action_key: "external_reply",
        resource_type: "support",
        data_classification: "confidential",
        external_use: true,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setEvalResult(`${data.decision}: ${data.reason}`);
    }
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <Link href="/app/security" className="text-sm text-rose-700">{labels.back}</Link>
      </div>
      <p className="text-sm text-gray-600">{labels.subtitle}</p>
      <button type="button" onClick={() => void testPolicy()} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.testPolicy}</button>
      {evalResult ? <p className="text-sm text-gray-700">{evalResult}</p> : null}

      <ul className="space-y-2 text-sm">
        {policies.map((p) => (
          <li key={p.policy_key} className="rounded border border-gray-200 bg-white px-3 py-2">
            <span className="font-medium">{p.policy_key}</span> — {p.action_key} on {p.resource_type}
            {p.requires_approval ? <span className="ml-2 text-amber-700">{labels.requiresApproval}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
