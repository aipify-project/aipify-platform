"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type TrustActionsOverview = {
  pending_approvals: number;
  executed_today: number;
  rejected_today: number;
  emergency_tenants: number;
  highest_risk: Array<{
    id: string;
    action_name: string;
    risk_level: number;
    status: string;
    created_at: string;
  }>;
  recent_activity: Array<{
    id: string;
    event_type: string;
    performed_by: string | null;
    created_at: string;
  }>;
};

type PlatformTrustActionsPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    pending: string;
    executed: string;
    rejected: string;
    emergency: string;
    highestRisk: string;
    recentActivity: string;
    noActivity: string;
  };
};

const EMPTY: TrustActionsOverview = {
  pending_approvals: 0,
  executed_today: 0,
  rejected_today: 0,
  emergency_tenants: 0,
  highest_risk: [],
  recent_activity: [],
};

export default function PlatformTrustActionsPanel({ labels }: PlatformTrustActionsPanelProps) {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<TrustActionsOverview>(EMPTY);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_platform_trust_actions_overview");
      if (!cancelled) {
        setOverview(error || !data ? EMPTY : (data as TrustActionsOverview));
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
    <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{labels.title}</h2>
      <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs text-gray-500">{labels.pending}</p>
          <p className="text-2xl font-semibold text-gray-900">{overview.pending_approvals}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs text-gray-500">{labels.executed}</p>
          <p className="text-2xl font-semibold text-gray-900">{overview.executed_today}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs text-gray-500">{labels.rejected}</p>
          <p className="text-2xl font-semibold text-gray-900">{overview.rejected_today}</p>
        </div>
        <div className="rounded-lg border border-rose-100 bg-rose-50 p-4">
          <p className="text-xs text-rose-700">{labels.emergency}</p>
          <p className="text-2xl font-semibold text-rose-900">{overview.emergency_tenants}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{labels.highestRisk}</h3>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {overview.highest_risk.length === 0 ? (
              <li className="text-gray-500">{labels.noActivity}</li>
            ) : (
              overview.highest_risk.map((item) => (
                <li key={item.id}>
                  {item.action_name} · risk {item.risk_level} · {item.status}
                </li>
              ))
            )}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{labels.recentActivity}</h3>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {overview.recent_activity.length === 0 ? (
              <li className="text-gray-500">{labels.noActivity}</li>
            ) : (
              overview.recent_activity.map((item) => (
                <li key={item.id}>
                  {item.event_type}
                  {item.performed_by ? ` · ${item.performed_by}` : ""}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
