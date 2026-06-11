"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseDataResidencyPolicies, type DataResidencyPolicy } from "@/lib/aipify/enterprise";

type EnterpriseDataResidencyPanelProps = {
  labels: Record<string, string>;
};

export function EnterpriseDataResidencyPanel({ labels }: EnterpriseDataResidencyPanelProps) {
  const [policies, setPolicies] = useState<DataResidencyPolicy[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/enterprise/data-residency");
    if (res.ok) {
      const data = await res.json();
      setPolicies(data.policies ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function updatePolicy(policyKey: string, patch: Record<string, unknown>) {
    await fetch("/api/aipify/enterprise/data-residency", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ policy_key: policyKey, patch }),
    });
    await load();
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <Link href="/app/enterprise" className="text-sm text-indigo-700">{labels.back}</Link>
      </div>
      <p className="text-sm text-gray-600">{labels.subtitle}</p>

      <ul className="space-y-3">
        {policies.map((p) => (
          <li key={p.policy_key} className="rounded-lg border border-gray-200 bg-white p-4 space-y-2">
            <div>
              <p className="font-medium">{p.data_category}</p>
              <p className="text-xs text-gray-500">{p.description}</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <label>
                {labels.storage}
                <select
                  defaultValue={p.storage_location}
                  onChange={(e) => void updatePolicy(p.policy_key, { storage_location: e.target.value })}
                  className="ml-2 rounded border border-gray-200 px-2 py-1 text-sm"
                >
                  <option value="cloud">Cloud</option>
                  <option value="local">Local</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  defaultChecked={p.cloud_sync_allowed}
                  onChange={(e) => void updatePolicy(p.policy_key, { cloud_sync_allowed: e.target.checked })}
                />
                {labels.cloudSyncAllowed}
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  defaultChecked={p.redaction_required}
                  onChange={(e) => void updatePolicy(p.policy_key, { redaction_required: e.target.checked })}
                />
                {labels.redactionRequired}
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
