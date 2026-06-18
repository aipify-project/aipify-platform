"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseDataGovernanceOverview, type DataGovernanceOverview } from "@/lib/aipify/security-compliance";

type ComplianceDataGovernancePanelProps = {
  labels: Record<string, string>;
};

export function ComplianceDataGovernancePanel({ labels }: ComplianceDataGovernancePanelProps) {
  const [overview, setOverview] = useState<DataGovernanceOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/compliance/data-governance");
    if (res.ok) setOverview(parseDataGovernanceOverview(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!overview?.has_customer) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <Link href="/app/compliance" className="text-sm text-indigo-700">{labels.back}</Link>
      </div>
      <p className="text-sm text-gray-600">{labels.subtitle}</p>

      <section>
        <h2 className="text-sm font-semibold">{labels.classifications}</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {overview.classifications.map((c) => (
            <li key={c.classification_key} className="rounded border border-gray-200 bg-white px-3 py-2">
              <span className="font-medium capitalize">{c.classification_key.replace(/_/g, " ")}</span>
              {c.description ? <span className="text-gray-500"> — {c.description}</span> : null}
              <p className="text-xs text-gray-500">
                {labels.cloudSync}: {c.cloud_sync_allowed ? labels.yes : labels.no} · {labels.redaction}: {c.requires_redaction ? labels.yes : labels.no}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold">{labels.retention}</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {overview.retention_policies.map((r) => (
            <li key={r.data_category} className="rounded border border-gray-200 bg-white px-3 py-2">
              {r.data_category}: {r.retention_days} {labels.days} → {r.action_on_expiry}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
