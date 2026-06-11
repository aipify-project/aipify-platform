"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PilotDashboard } from "@/lib/aipify/pilot";

type TenantPilotStatusPanelProps = {
  tenantId: string;
  labels: Record<string, string>;
};

export function TenantPilotStatusPanel({ tenantId, labels }: TenantPilotStatusPanelProps) {
  const [dashboard, setDashboard] = useState<PilotDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/aipify/tenants/${tenantId}/pilot-status`);
      const data = await res.json();
      if (res.ok) setDashboard(data);
      setLoading(false);
    }
    void load();
  }, [tenantId]);

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard) return <div className="p-6 text-sm text-gray-600">{labels.empty}</div>;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
          <p className="mt-1 text-sm text-gray-600">
            {dashboard.profile?.name ?? tenantId} · {dashboard.profile?.pilot_status}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href={`/platform/customers/${tenantId}/modules`} className="text-violet-700">
            {labels.modules}
          </Link>
          <Link href={`/platform/customers/${tenantId}/integrations`} className="text-violet-700">
            {labels.integrations}
          </Link>
          <Link href={`/platform/customers/${tenantId}/discovery`} className="text-violet-700">
            {labels.discovery}
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [labels.completeness, `${dashboard.setup_completeness_score}%`],
          [labels.safeMode, dashboard.safe_mode ? labels.on : labels.off],
          [labels.supportMode, dashboard.support_ai_mode],
          [labels.knowledge, String(dashboard.knowledge_articles_count)],
          [labels.gaps, String(dashboard.open_knowledge_gaps)],
          [labels.workflows, String(dashboard.workflows_detected)],
          [labels.integrations, String(dashboard.integrations_connected)],
          [labels.pendingApprovals, String(dashboard.pending_approvals)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="mt-2 text-xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-violet-100 bg-violet-50/60 p-4">
        <h2 className="text-sm font-semibold text-violet-900">{labels.nextStep}</h2>
        <p className="mt-2 text-sm text-violet-800">{dashboard.next_recommended_step}</p>
      </div>
    </div>
  );
}
