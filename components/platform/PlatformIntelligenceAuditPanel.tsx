"use client";

import { useEffect, useState } from "react";
import { formatDateTime } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";

type AuditEntry = {
  id: string;
  type: string;
  action: string;
  pattern_title: string;
  reviewer_email: string | null;
  notes: string | null;
  created_at: string;
};

type PlatformIntelligenceAuditPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    type: string;
    action: string;
    pattern: string;
    reviewer: string;
    notes: string;
    timestamp: string;
  };
};

export default function PlatformIntelligenceAuditPanel({
  locale,
  labels,
}: PlatformIntelligenceAuditPanelProps) {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<AuditEntry[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_intelligence_audit_log");

      if (!cancelled) {
        setEntries(error || !Array.isArray(data) ? [] : (data as AuditEntry[]));
        setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.empty}</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/80">
                <tr>
                  {[labels.timestamp, labels.type, labels.action, labels.pattern, labels.reviewer].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {entries.map((entry) => (
                  <tr key={`${entry.type}-${entry.id}`}>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDateTime(entry.created_at, locale)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{entry.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{entry.action}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {entry.pattern_title}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {entry.reviewer_email ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
