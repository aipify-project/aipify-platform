"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseOrchestrationDashboard, type OrchestrationDashboard } from "@/lib/aipify/orchestration";

type OrchestrationDashboardPanelProps = {
  labels: Record<string, string>;
};

export function OrchestrationDashboardPanel({ labels }: OrchestrationDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<OrchestrationDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/orchestration/dashboard");
    if (res.ok) setDashboard(parseOrchestrationDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  return (
    <div className="space-y-6">
      {dashboard.emergency_stop_active ? (
        <div className="rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm text-rose-900">{labels.emergencyStopActive}</div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: labels.eventsToday, value: dashboard.events_today ?? 0 },
          { label: labels.activeFlows, value: dashboard.active_flows ?? 0 },
          { label: labels.blockedFlows, value: dashboard.blocked_flows ?? 0 },
          { label: labels.waitingApprovals, value: dashboard.waiting_approvals ?? 0 },
        ].map((c) => (
          <div key={c.label} className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-500">{c.label}</p>
            <p className="mt-1 text-2xl font-semibold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/app/orchestration/events" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.events}</Link>
        <Link href="/app/orchestration/flows" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.flows}</Link>
        <Link href="/app/orchestration/rules" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.rules}</Link>
        <Link href="/app/orchestration/settings" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.settings}</Link>
      </div>

      {dashboard.top_modules.length > 0 ? (
        <section className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
          <h2 className="text-sm font-semibold">{labels.topModules}</h2>
          <ul className="mt-3 flex flex-wrap gap-2 text-sm">
            {dashboard.top_modules.map((m) => (
              <li key={m.source_module} className="rounded border border-white bg-white px-3 py-1">
                {m.source_module} · {m.count}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
        <h2 className="text-sm font-semibold">{labels.recentEvents}</h2>
        {dashboard.recent_events.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noEvents}</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.recent_events.map((e) => (
              <li key={e.id} className="rounded border border-white bg-white px-3 py-2">
                <span className="font-medium">{e.event_type}</span> · {e.source_module} ·{" "}
                <span className="capitalize">{e.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-xs text-gray-500">{labels.principle}</p>
    </div>
  );
}
