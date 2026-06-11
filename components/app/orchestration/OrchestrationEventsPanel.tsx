"use client";

import { useCallback, useEffect, useState } from "react";
import { parseOrchestrationEvents, type OrchestrationEvent } from "@/lib/aipify/orchestration";

type OrchestrationEventsPanelProps = {
  labels: Record<string, string>;
};

export function OrchestrationEventsPanel({ labels }: OrchestrationEventsPanelProps) {
  const [events, setEvents] = useState<OrchestrationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [moduleFilter, setModuleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (moduleFilter) params.set("module", moduleFilter);
    if (statusFilter) params.set("status", statusFilter);
    const res = await fetch(`/api/aipify/orchestration/events?${params}`);
    if (res.ok) {
      const data = await res.json();
      setEvents(parseOrchestrationEvents({ events: data.events }));
    }
    setLoading(false);
  }, [moduleFilter, statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input
          className="rounded border border-gray-200 px-3 py-1.5 text-sm"
          placeholder={labels.filterModule}
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
        />
        <select
          className="rounded border border-gray-200 px-3 py-1.5 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">{labels.allStatuses}</option>
          <option value="received">received</option>
          <option value="processed">processed</option>
          <option value="blocked">blocked</option>
          <option value="ignored">ignored</option>
        </select>
        <button type="button" onClick={() => void load()} className="rounded bg-indigo-600 px-3 py-1.5 text-sm text-white">
          {labels.refresh}
        </button>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.noEvents}</p>
      ) : (
        <ul className="space-y-2">
          {events.map((e) => (
            <li key={e.id} className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">{e.event_type}</span>
                <span className="capitalize text-gray-500">{e.status}</span>
              </div>
              <p className="mt-1 text-gray-600">
                {e.source_module} · {e.severity}
                {(e.duplicate_count ?? 1) > 1 ? ` · ×${e.duplicate_count}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
