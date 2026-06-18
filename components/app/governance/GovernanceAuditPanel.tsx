"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseGovernanceAuditEntry, type GovernanceAuditEntry } from "@/lib/aipify/governance";

type GovernanceAuditPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    empty: string;
  };
};

export function GovernanceAuditPanel({ labels }: GovernanceAuditPanelProps) {
  const [entries, setEntries] = useState<GovernanceAuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/governance/audit?limit=100");
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data.entries) ? data.entries : [];
      setEntries(list.map(parseGovernanceAuditEntry));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <Link href="/app/governance" className="text-sm text-indigo-600 hover:underline">{labels.back}</Link>
      <h1 className="text-2xl font-semibold">{labels.title}</h1>
      <p className="text-sm text-gray-600">{labels.subtitle}</p>
      {entries.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.empty}</p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div key={entry.id} className="rounded-xl border bg-white p-4 text-sm shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{entry.action}</span>
                {entry.action_category ? (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{entry.action_category}</span>
                ) : null}
                {entry.result ? (
                  <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">{entry.result}</span>
                ) : null}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {entry.actor_type} · {new Date(entry.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
