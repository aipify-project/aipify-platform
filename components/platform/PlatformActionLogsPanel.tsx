"use client";

import { useEffect, useState } from "react";
import { formatDateTime } from "@/lib/i18n/format-date";
import {
  formatExecutionTime,
  parseActionExecutionLogs,
  type ActionExecutionLog,
} from "@/lib/platform/action-engine";
import { createClient } from "@/lib/supabase/client";

type PlatformActionLogsPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    action: string;
    event: string;
    actor: string;
    result: string;
    duration: string;
    environment: string;
    timestamp: string;
  };
};

export default function PlatformActionLogsPanel({
  locale,
  labels,
}: PlatformActionLogsPanelProps) {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<ActionExecutionLog[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("list_action_execution_logs");
      if (!cancelled) {
        setLogs(error || !data ? [] : parseActionExecutionLogs(data));
        setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p className="text-sm text-gray-500">{labels.loading}</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
      </div>
      {logs.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.empty}</p>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <article
              key={log.id}
              className="rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-900">{log.action_title}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {formatDateTime(log.created_at, locale)} · {labels.event}: {log.event_type}
                  </p>
                </div>
                {log.result && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
                    {log.result}
                  </span>
                )}
              </div>
              <dl className="mt-2 grid gap-1 text-xs text-gray-600 sm:grid-cols-2">
                <div>
                  <dt>{labels.actor}</dt>
                  <dd>{log.actor_email ?? log.executor_email ?? log.approver_email ?? "—"}</dd>
                </div>
                <div>
                  <dt>{labels.environment}</dt>
                  <dd>{log.environment_type ?? "—"}</dd>
                </div>
                {log.duration_ms != null && (
                  <div>
                    <dt>{labels.duration}</dt>
                    <dd>{formatExecutionTime(log.duration_ms)}</dd>
                  </div>
                )}
              </dl>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
