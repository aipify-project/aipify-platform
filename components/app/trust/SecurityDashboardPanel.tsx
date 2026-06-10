"use client";

import { useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import { formatDate } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";

type SecurityDashboardPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    connectedSystems: string;
    noSystems: string;
    permissionScopes: string;
    registeredDomains: string;
    noDomains: string;
    recentActions: string;
    noActions: string;
    tokenHealth: string;
    principles: string;
    dataOwnership: string;
    areas: {
      systems: string;
      scopes: string;
      actions: string;
      approvals: string;
      ownership: string;
      tokens: string;
      recommendations: string;
    };
    pulseLabel: string;
  };
};

export default function SecurityDashboardPanel({
  locale,
  labels,
}: SecurityDashboardPanelProps) {
  const [overview, setOverview] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_customer_security_overview");
      if (!error && data) {
        setOverview(data as Record<string, unknown>);
      }
      setLoading(false);
    }
    void load();
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  const systems = (overview?.connected_systems as Record<string, unknown>[]) ?? [];
  const domains = (overview?.registered_domains as string[]) ?? [];
  const actions = (overview?.recent_actions as Record<string, unknown>[]) ?? [];
  const principles = (overview?.principles as string[]) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{labels.title}</h2>
        <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {Object.values(labels.areas).map((area) => (
          <li
            key={area}
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
          >
            {area}
          </li>
        ))}
      </ul>

      <section className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
        <h3 className="text-sm font-semibold text-indigo-900">{labels.dataOwnership}</h3>
        <ul className="mt-2 space-y-1 text-sm text-indigo-800">
          {principles.map((principle) => (
            <li key={principle}>• {principle}</li>
          ))}
        </ul>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.connectedSystems}</h3>
          {systems.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">{labels.noSystems}</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              {systems.map((system) => (
                <li key={String(system.key)}>
                  {String(system.key)} — {String(system.permission)} ({String(system.status)})
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.registeredDomains}</h3>
          {domains.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">{labels.noDomains}</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              {domains.map((domain) => (
                <li key={domain}>{domain}</li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-gray-500">
            {labels.permissionScopes}: {String(overview?.permission_scope ?? "metadata")}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {labels.tokenHealth}: {String(overview?.token_health ?? "—")}
          </p>
        </section>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-gray-900">{labels.recentActions}</h3>
        {actions.length === 0 ? (
          <AipifyEmptyState message={labels.noActions} pulseLabel={labels.pulseLabel} />
        ) : (
          <ul className="mt-2 space-y-2 text-sm text-gray-600">
            {actions.map((action) => (
              <li key={String(action.id)}>
                <span className="font-medium">{String(action.action)}</span>
                {" · "}
                {String(action.outcome)}
                {" · "}
                {formatDate(String(action.created_at), locale)}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
