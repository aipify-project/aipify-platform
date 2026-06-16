"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseSuperGlobalAuditCenter,
  type SuperGlobalAuditEntry,
  type SuperPortalLabels,
} from "@/lib/super-portal";

export function SuperPortalGlobalAuditPanel({
  labels,
}: {
  labels: SuperPortalLabels["globalAudit"];
}) {
  const [logs, setLogs] = useState<SuperGlobalAuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/super-portal/global-audit");
    if (res.ok) {
      const data = await res.json();
      setLogs(parseSuperGlobalAuditCenter(data));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <p className="p-6 text-sm text-zinc-500">{labels.loading}</p>;

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href="/super" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-zinc-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
      </div>

      {logs.length === 0 ? (
        <p className="text-sm text-zinc-500">{labels.empty}</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-zinc-100 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">{labels.user}</th>
                <th className="px-4 py-3">{labels.action}</th>
                <th className="px-4 py-3">{labels.timestamp}</th>
                <th className="px-4 py-3">{labels.previousValue}</th>
                <th className="px-4 py-3">{labels.newValue}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-4 py-3 text-zinc-900">{log.user_email}</td>
                  <td className="px-4 py-3 font-medium text-zinc-900">{log.action}</td>
                  <td className="px-4 py-3 text-zinc-500">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-zinc-600">
                    {JSON.stringify(log.previous_state)}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-zinc-600">
                    {JSON.stringify(log.new_state)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
