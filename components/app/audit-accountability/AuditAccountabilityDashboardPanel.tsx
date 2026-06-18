"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseAuditAccountabilityDashboard,
  type AuditAccountabilityDashboard,
} from "@/lib/aipify/audit-accountability";

type AuditAccountabilityDashboardPanelProps = {
  labels: Record<string, string>;
};

function badgeClass(value?: string) {
  switch (value) {
    case "approved":
    case "user":
      return "bg-emerald-100 text-emerald-800";
    case "pending":
    case "ai":
      return "bg-violet-100 text-violet-800";
    case "rejected":
    case "failed_login":
      return "bg-rose-100 text-rose-800";
    case "system":
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function EventList({
  events,
  emptyLabel,
}: {
  events: AuditAccountabilityDashboard["recent_activity"];
  emptyLabel: string;
}) {
  if (events.length === 0) return <p className="text-xs text-gray-500">{emptyLabel}</p>;
  return (
    <ul className="space-y-2">
      {events.map((e) => (
        <li key={e.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium text-gray-900">{e.action_summary ?? e.action_type}</span>
            <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(e.actor_type)}`}>
              {e.actor_type}
            </span>
          </div>
          <p className="mt-1 text-xs capitalize text-gray-500">
            {e.action_type?.replace(/_/g, " ")}
            {e.ai_involved ? " · AI" : ""}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function AuditAccountabilityDashboardPanel({ labels }: AuditAccountabilityDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<AuditAccountabilityDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/audit-accountability/dashboard");
    if (res.ok) setDashboard(parseAuditAccountabilityDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleExport(format: string) {
    setExporting(true);
    await fetch("/api/audit/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ format, filters: {} }),
    });
    await load();
    setExporting(false);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/aipify-core" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.aipifyCore}
        </Link>
        <Link href="/app/identity-access" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.identityAccess}
        </Link>
        <Link href="/app/secure-ai-actions" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.secureAiActions}
        </Link>
      </div>

      <section className="rounded-xl border border-slate-300 bg-slate-50/80 p-6">
        <h2 className="text-sm font-semibold text-slate-900">{labels.accountabilityEngine}</h2>
        <p className="mt-2 text-sm text-slate-900">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-slate-600">{dashboard.safety_note}</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.totalEvents}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.total_events ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.aiEvents}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.ai_events ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.pendingApprovals}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.pending_approvals ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.retention}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {dashboard.retention_policy?.active_retention_months ?? 12}
            <span className="text-sm font-normal text-gray-500"> mo</span>
          </p>
        </div>
      </section>

      <section className="flex flex-wrap gap-2">
        {(dashboard.export_formats ?? ["csv", "xlsx", "pdf"]).map((f) => (
          <button
            key={f}
            type="button"
            disabled={exporting}
            onClick={() => void handleExport(f)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm uppercase disabled:opacity-50"
          >
            {labels.export} {f}
          </button>
        ))}
      </section>

      {dashboard.top_action_categories.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.topCategories}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {dashboard.top_action_categories.map((c) => (
              <span key={c.action_type} className="rounded-full bg-slate-100 px-3 py-1 text-xs capitalize text-slate-800">
                {c.action_type.replace(/_/g, " ")} · {c.count}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.recentActivity}</h2>
        <div className="mt-3">
          <EventList events={dashboard.recent_activity} emptyLabel={labels.noEvents} />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{labels.aiTimeline}</h2>
          <div className="mt-3">
            <EventList events={dashboard.ai_activity_timeline} emptyLabel={labels.noEvents} />
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{labels.securityEvents}</h2>
          <div className="mt-3">
            <EventList events={dashboard.security_events} emptyLabel={labels.noEvents} />
          </div>
        </div>
      </section>

      {dashboard.failed_actions.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.failedActions}</h2>
          <div className="mt-3">
            <EventList events={dashboard.failed_actions} emptyLabel={labels.noEvents} />
          </div>
        </section>
      ) : null}

      {dashboard.principles && dashboard.principles.length > 0 ? (
        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-semibold text-slate-900">{labels.principles}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-700">
            {dashboard.principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
