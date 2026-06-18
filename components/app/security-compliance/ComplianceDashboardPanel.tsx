"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseComplianceDashboard, type ComplianceDashboard } from "@/lib/aipify/security-compliance";

type ComplianceDashboardPanelProps = {
  labels: Record<string, string>;
};

export function ComplianceDashboardPanel({ labels }: ComplianceDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<ComplianceDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/compliance/dashboard");
    if (res.ok) setDashboard(parseComplianceDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function generateReport() {
    setGenerating(true);
    await fetch("/api/aipify/compliance/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ report_type: "security_posture" }),
    });
    await load();
    setGenerating(false);
  }

  async function applyRetention() {
    await fetch("/api/aipify/compliance/retention/apply", { method: "POST" });
    await load();
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{labels.title}</h1>
          <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/app/compliance/privacy-requests" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.privacyRequests}</Link>
          <Link href="/app/compliance/data-governance" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.dataGovernance}</Link>
          <Link href="/app/compliance/reports" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.reports}</Link>
          <Link href="/app/security" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.security}</Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.privacyPending}</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.privacy_pending ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.retentionPolicies}</p>
          <p className="mt-1 text-2xl font-semibold">{dashboard.retention_policies_count ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.deploymentMode}</p>
          <p className="mt-1 text-lg font-semibold capitalize">{(dashboard.deployment_mode ?? "cloud_saas").replace(/_/g, " ")}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={generating} onClick={() => void generateReport()} className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm text-white disabled:opacity-50">{labels.generateReport}</button>
        <button type="button" onClick={() => void applyRetention()} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.applyRetention}</button>
      </div>

      <p className="text-xs text-gray-500">{labels.privacy}</p>
    </div>
  );
}
