"use client";

import { useCallback, useEffect, useState } from "react";
import PlatformActionCard, {
  type PlatformActionCardLabels,
} from "@/components/platform/PlatformActionCard";
import {
  parseActionCenterDashboard,
  parsePlatformActions,
  type ActionCenterDashboard,
  type PlatformAction,
} from "@/lib/platform/action-engine";
import { createClient } from "@/lib/supabase/client";

type PlatformActionsListPanelProps = {
  locale: string;
  statusFilter: "pending" | "approved" | "executed" | "failed" | null;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    lifecycle: string;
    metrics: {
      pending: string;
      approved: string;
      executed: string;
      failed: string;
      hoursSaved: string;
      rollbacks: string;
    };
    card: PlatformActionCardLabels;
  };
  showDashboard?: boolean;
  showActions?: boolean;
};

export default function PlatformActionsListPanel({
  locale,
  statusFilter,
  labels,
  showDashboard = false,
  showActions = false,
}: PlatformActionsListPanelProps) {
  const [loading, setLoading] = useState(true);
  const [actions, setActions] = useState<PlatformAction[]>([]);
  const [dashboard, setDashboard] = useState<ActionCenterDashboard | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const actionsResult = await supabase.rpc("list_platform_actions", {
      p_status: statusFilter,
    });

    setActions(
      actionsResult.error || !actionsResult.data
        ? []
        : parsePlatformActions(actionsResult.data)
    );

    if (showDashboard) {
      const dashboardResult = await supabase.rpc("get_action_center_dashboard");
      setDashboard(
        dashboardResult.error || !dashboardResult.data
          ? null
          : parseActionCenterDashboard(dashboardResult.data)
      );
    }

    setLoading(false);
  }, [statusFilter, showDashboard]);

  useEffect(() => {
    void load();
  }, [load]);

  async function postAction(id: string, endpoint: string) {
    const response = await fetch(`/api/platform/actions/${id}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (response.ok) await load();
  }

  if (loading) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
      </div>

      {showDashboard && dashboard && (
        <>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label={labels.metrics.pending} value={String(dashboard.metrics.pending)} />
            <Metric label={labels.metrics.approved} value={String(dashboard.metrics.approved)} />
            <Metric label={labels.metrics.executed} value={String(dashboard.metrics.executed)} />
            <Metric label={labels.metrics.failed} value={String(dashboard.metrics.failed)} />
          </dl>
          <section className="rounded-2xl border border-violet-100 bg-violet-50/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
              {labels.lifecycle}
            </p>
            <p className="mt-2 text-sm font-medium text-gray-800">
              {dashboard.lifecycle.join(" → ")}
            </p>
            <p className="mt-2 text-xs text-gray-600">
              {labels.metrics.hoursSaved}: {dashboard.metrics.hours_saved.toFixed(1)}h ·{" "}
              {labels.metrics.rollbacks}: {dashboard.metrics.rollbacks}
            </p>
          </section>
        </>
      )}

      {actions.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.empty}</p>
      ) : (
        <div className="space-y-4">
          {actions.map((action) => (
            <PlatformActionCard
              key={action.id}
              action={action}
              locale={locale}
              labels={labels.card}
              showActions={showActions}
              onApprove={showActions ? (id) => postAction(id, "approve") : undefined}
              onReject={showActions ? (id) => postAction(id, "reject") : undefined}
              onExecute={showActions ? (id) => postAction(id, "execute") : undefined}
              onRollback={showActions ? (id) => postAction(id, "rollback") : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-bold text-gray-900">{value}</dd>
    </div>
  );
}
