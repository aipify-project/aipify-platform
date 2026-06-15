"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { isHostsModuleIncluded } from "@/lib/aipify/aipify-hosts";
import {
  parseAipifyHostsTrustComplianceDashboard,
  type AipifyHostsTrustComplianceDashboard,
  type HostsRegulatoryAlert,
  type HostsTrustModule,
} from "@/lib/aipify/aipify-hosts-trust-compliance";

type Props = {
  labels: Record<string, string>;
};

function statusLabel(status: HostsRegulatoryAlert["status"], labels: Record<string, string>): string {
  if (status === "compliant") return labels.compliant;
  if (status === "action_overdue") return labels.actionOverdue;
  return labels.attentionRequiredStatus;
}

function statusStyle(status: HostsRegulatoryAlert["status"]): string {
  if (status === "compliant") return "bg-emerald-50 text-emerald-800 ring-emerald-200";
  if (status === "action_overdue") return "bg-red-50 text-red-800 ring-red-200";
  return "bg-amber-50 text-amber-800 ring-amber-200";
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function ModuleCard({
  module,
  enabled,
  enabledLabel,
  scaffoldLabel,
}: {
  module: HostsTrustModule;
  enabled: boolean;
  enabledLabel: string;
  scaffoldLabel: string;
}) {
  return (
    <article
      className={`rounded-xl border p-4 ${enabled ? "border-teal-100 bg-teal-50/40" : "border-gray-100 bg-gray-50/60"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900">{module.label}</h3>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${enabled ? "bg-teal-100 text-teal-800" : "bg-gray-200 text-gray-600"}`}
        >
          {enabled ? enabledLabel : scaffoldLabel}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600">{module.description}</p>
    </article>
  );
}

export function AipifyHostsTrustComplianceDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<AipifyHostsTrustComplianceDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const res = await fetch("/api/aipify/aipify-hosts/trust-compliance/dashboard");
    if (res.ok) {
      setDashboard(parseAipifyHostsTrustComplianceDashboard(await res.json()));
    } else {
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return <AipifyLoader label={labels.loading} centered fullPage />;
  }

  if (error || !dashboard) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  const snap = dashboard.trust_snapshot;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-teal-100 bg-teal-50/40 p-6">
        <p className="text-sm font-medium text-teal-900">{dashboard.positioning}</p>
        <p className="mt-2 text-sm text-teal-800">{dashboard.vision}</p>
        <p className="mt-3 text-xs text-teal-800">{dashboard.governance.principle}</p>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.trustSnapshot}</h2>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label={labels.trustScore} value={snap.trust_score} />
          <MetricCard label={labels.complianceReady} value={`${snap.compliance_ready_pct}%`} />
          <MetricCard label={labels.safetyCompletion} value={`${snap.safety_completion_pct}%`} />
          <MetricCard label={labels.attentionRequired} value={snap.attention_required} />
        </dl>
      </section>

      {dashboard.regulatory_alerts.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.regulatoryAlerts}</h2>
          <ul className="space-y-3">
            {dashboard.regulatory_alerts.map((alert) => (
              <li key={alert.key} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900">{alert.label}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusStyle(alert.status)}`}>
                    {statusLabel(alert.status, labels)}
                  </span>
                </div>
                {alert.suggestion && (
                  <p className="mt-2 text-sm text-teal-800">
                    {labels.suggestedAction}: {alert.suggestion}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.executiveMetrics}</h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          {dashboard.executive_metrics.map((metric) => (
            <MetricCard key={metric.key} label={metric.label} value={metric.value} />
          ))}
        </dl>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.modules}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {dashboard.modules.map((module) => (
            <ModuleCard
              key={module.key}
              module={module}
              enabled={isHostsModuleIncluded(dashboard.package_key, module.key)}
              enabledLabel={labels.included}
              scaffoldLabel={labels.upgradeRequired}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.complianceAreas}</h2>
        <div className="flex flex-wrap gap-2">
          {dashboard.compliance_areas.map((area) => (
            <span
              key={area.key}
              className="rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 ring-1 ring-gray-200"
            >
              {area.label}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900">{labels.safetyAreas}</h3>
          <ul className="mt-3 space-y-1 text-sm text-gray-600">
            {dashboard.safety_areas.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900">{labels.ethicsPrinciples}</h3>
          <ul className="mt-3 space-y-1 text-sm text-gray-600">
            {dashboard.ethics_principles.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.houseRuleCategories}</h2>
        <div className="flex flex-wrap gap-2">
          {dashboard.house_rule_categories.map((category) => (
            <span
              key={category}
              className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5 text-sm text-gray-700"
            >
              {category}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.successMetrics}</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {dashboard.success_metrics.map((metric) => (
            <li key={metric.key} className="rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-700">
              {metric.label}
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/app/aipify-hosts"
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {labels.backToHosts}
        </Link>
        <Link
          href="/app/settings/employee-knowledge"
          className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-800 hover:bg-teal-100"
        >
          {labels.exploreKnowledge}
        </Link>
      </div>
    </div>
  );
}
