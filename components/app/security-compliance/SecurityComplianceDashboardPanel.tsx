"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseSecurityDashboard, type SecurityDashboard } from "@/lib/aipify/security-compliance";

type SecurityComplianceDashboardPanelProps = {
  labels: Record<string, string>;
};

export function SecurityComplianceDashboardPanel({ labels }: SecurityComplianceDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<SecurityDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/security/dashboard");
    if (res.ok) setDashboard(parseSecurityDashboard(await res.json()));
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

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: labels.openIncidents, value: dashboard.open_incidents ?? 0 },
          { label: labels.criticalIncidents, value: dashboard.critical_incidents ?? 0 },
          { label: labels.secretsExpiring, value: dashboard.secrets_expiring ?? 0 },
        ].map((c) => (
          <div key={c.label} className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-500">{c.label}</p>
            <p className="mt-1 text-2xl font-semibold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/app/security/incidents" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.incidents}</Link>
        <Link href="/app/security/secrets" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.secrets}</Link>
        <Link href="/app/security/policies" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.policies}</Link>
        <Link href="/app/compliance" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.compliance}</Link>
        <Link href="/app/compliance/data-governance" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.dataGovernance}</Link>
      </div>

      <section className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
        <h2 className="text-sm font-semibold">{labels.recentDecisions}</h2>
        {dashboard.recent_policy_decisions.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noDecisions}</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.recent_policy_decisions.map((d) => (
              <li key={d.id} className="rounded border border-white bg-white px-3 py-2">
                <span className="font-medium">{d.action_key}</span> · <span className="capitalize">{d.decision}</span>
                {d.reason ? <p className="text-xs text-gray-500">{d.reason}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-xs text-gray-500">{labels.principle}</p>
    </div>
  );
}
