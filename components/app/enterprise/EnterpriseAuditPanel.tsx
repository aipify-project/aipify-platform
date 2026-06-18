"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type EnterpriseAuditPanelProps = {
  labels: Record<string, string>;
};

type AuditExport = {
  id: string;
  export_type: string;
  status: string;
  created_at: string;
};

export function EnterpriseAuditPanel({ labels }: EnterpriseAuditPanelProps) {
  const [exports, setExports] = useState<AuditExport[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/enterprise/audit/exports");
    if (res.ok) {
      const data = await res.json();
      setExports(Array.isArray(data.exports) ? data.exports : []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function requestExport(type: string) {
    setRequesting(true);
    await fetch("/api/aipify/enterprise/audit/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ export_type: type }),
    });
    await load();
    setRequesting(false);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <Link href="/app/enterprise" className="text-sm text-indigo-700">{labels.back}</Link>
      </div>
      <p className="text-sm text-gray-600">{labels.subtitle}</p>

      <div className="flex flex-wrap gap-2">
        {["audit_logs", "agent_access", "approvals", "knowledge_access"].map((type) => (
          <button
            key={type}
            type="button"
            disabled={requesting}
            onClick={() => void requestExport(type)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-50"
          >
            {labels.request} {type.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {exports.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.noExports}</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {exports.map((e) => (
            <li key={e.id} className="rounded border border-gray-200 bg-white px-3 py-2">
              {e.export_type} · <span className="capitalize">{e.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
