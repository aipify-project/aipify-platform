"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  ALLOWED_STORAGE_CATEGORIES,
  DATA_ACCESS_LEVELS,
  PROHIBITED_STORAGE_CATEGORIES,
} from "@/lib/trust";

type GovernanceSummary = {
  audit_event_count?: number;
  tenants_with_audit_events?: number;
  default_access_level?: string;
  platform_responsibility?: string;
};

type TrustActionsSummary = {
  pending_approvals?: number;
  executed_today?: number;
  rejected_today?: number;
  emergency_tenants?: number;
  recent_activity?: Array<{
    id: string;
    event_type: string;
    performed_by: string | null;
    created_at: string;
  }>;
};

type Props = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    foundationTitle: string;
    foundationValue: string;
    auditEvents: string;
    tenantsWithAudits: string;
    defaultAccess: string;
    actionSummaryTitle: string;
    pending: string;
    executed: string;
    rejected: string;
    emergency: string;
    recentActivity: string;
    noActivity: string;
    immutableNote: string;
  };
};

export function TrustAuditPanel({ labels }: Props) {
  const [loading, setLoading] = useState(true);
  const [governance, setGovernance] = useState<GovernanceSummary | null>(null);
  const [actions, setActions] = useState<TrustActionsSummary | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const [governanceResult, actionsResult] = await Promise.all([
        supabase.rpc("get_platform_trust_governance"),
        supabase.rpc("get_platform_trust_actions_overview"),
      ]);

      if (!cancelled) {
        setGovernance((governanceResult.data as GovernanceSummary) ?? null);
        setActions((actionsResult.data as TrustActionsSummary) ?? null);
        setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p className="text-sm text-gray-500">{labels.loading}</p>;

  const foundationValue = labels.foundationValue
    .replace("{allowed}", String(ALLOWED_STORAGE_CATEGORIES.length))
    .replace("{prohibited}", String(PROHIBITED_STORAGE_CATEGORIES.length))
    .replace("{levels}", String(DATA_ACCESS_LEVELS.length))
    .replace("{audits}", String(governance?.audit_event_count ?? 0));

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="max-w-3xl text-sm text-gray-600">{labels.subtitle}</p>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.foundationTitle}</h2>
        <p className="mt-2 text-sm text-gray-700">{foundationValue}</p>
        <p className="mt-3 rounded-lg border border-sky-100 bg-sky-50 px-3 py-2 text-xs text-sky-900">
          {labels.immutableNote}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Stat label={labels.auditEvents} value={governance?.audit_event_count ?? 0} />
          <Stat label={labels.tenantsWithAudits} value={governance?.tenants_with_audit_events ?? 0} />
          <Stat label={labels.defaultAccess} value={governance?.default_access_level ?? "metadata"} />
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.actionSummaryTitle}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <Stat label={labels.pending} value={actions?.pending_approvals ?? 0} />
          <Stat label={labels.executed} value={actions?.executed_today ?? 0} />
          <Stat label={labels.rejected} value={actions?.rejected_today ?? 0} />
          <Stat label={labels.emergency} value={actions?.emergency_tenants ?? 0} />
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.recentActivity}</h3>
          {(actions?.recent_activity?.length ?? 0) === 0 ? (
            <p className="mt-2 text-sm text-gray-500">{labels.noActivity}</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {actions?.recent_activity?.slice(0, 8).map((event) => (
                <li
                  key={event.id}
                  className="rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-700"
                >
                  <span className="font-medium">{event.event_type}</span>
                  <span className="text-gray-500"> · {new Date(event.created_at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-sky-100 bg-sky-50/60 px-3 py-2">
      <p className="text-xs font-medium uppercase tracking-wide text-sky-700/80">{label}</p>
      <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}
