"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { isHostsModuleIncluded } from "@/lib/aipify/aipify-hosts";
import {
  parseAipifyHostsExpansionIntelligenceDashboard,
  type AipifyHostsExpansionIntelligenceDashboard,
  type HostsExpansionModule,
  type HostsExpansionOpportunity,
} from "@/lib/aipify/aipify-hosts-expansion-intelligence";

type Props = {
  labels: Record<string, string>;
};

function opportunityTypeLabel(type: HostsExpansionOpportunity["type"], labels: Record<string, string>): string {
  if (type === "market") return labels.typeMarket;
  if (type === "property") return labels.typeProperty;
  if (type === "optimization") return labels.typeOptimization;
  return type;
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
  module: HostsExpansionModule;
  enabled: boolean;
  enabledLabel: string;
  scaffoldLabel: string;
}) {
  return (
    <article
      className={`rounded-xl border p-4 ${enabled ? "border-indigo-100 bg-indigo-50/40" : "border-gray-100 bg-gray-50/60"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900">{module.label}</h3>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${enabled ? "bg-indigo-100 text-indigo-800" : "bg-gray-200 text-gray-600"}`}
        >
          {enabled ? enabledLabel : scaffoldLabel}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600">{module.description}</p>
    </article>
  );
}

export function AipifyHostsExpansionIntelligenceDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<AipifyHostsExpansionIntelligenceDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const res = await fetch("/api/aipify/aipify-hosts/expansion-intelligence/dashboard");
    if (res.ok) {
      setDashboard(parseAipifyHostsExpansionIntelligenceDashboard(await res.json()));
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

  const snap = dashboard.growth_snapshot;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6">
        <p className="text-sm font-medium text-indigo-900">{dashboard.positioning}</p>
        <p className="mt-2 text-sm text-indigo-800">{dashboard.vision}</p>
        <p className="mt-3 text-xs text-indigo-800">{dashboard.governance.principle}</p>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.growthSnapshot}</h2>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <MetricCard label={labels.expansionReadiness} value={snap.expansion_readiness_score} />
          <MetricCard label={labels.opportunityScore} value={snap.opportunity_score} />
          <MetricCard label={labels.portfolioQuality} value={snap.portfolio_quality_index} />
          <MetricCard label={labels.marketsWatchlist} value={snap.markets_on_watchlist} />
          <MetricCard label={labels.underperforming} value={snap.underperforming_properties} />
        </dl>
      </section>

      {dashboard.opportunities.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.opportunities}</h2>
          <ul className="space-y-3">
            {dashboard.opportunities.map((opportunity) => (
              <li key={opportunity.key} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900">{opportunity.label}</p>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-800 ring-1 ring-indigo-200">
                      {opportunityTypeLabel(opportunity.type, labels)}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">{opportunity.score}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.executiveQuestions}</h2>
        <ul className="space-y-2">
          {dashboard.executive_questions.map((question) => (
            <li key={question} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-2 text-sm text-gray-700">
              {question}
            </li>
          ))}
        </ul>
      </section>

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

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900">{labels.playbooks}</h3>
          <ul className="mt-4 space-y-4">
            {dashboard.playbooks.map((playbook) => (
              <li key={playbook.key}>
                <p className="text-sm font-medium text-gray-900">{playbook.label}</p>
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  {playbook.steps.map((step) => (
                    <li key={step}>· {step}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900">{labels.simulationExamples}</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            {dashboard.simulation_examples.map((example) => (
              <li key={example}>· {example}</li>
            ))}
          </ul>
        </article>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.knowledgeCategories}</h2>
        <div className="flex flex-wrap gap-2">
          {dashboard.knowledge_categories.map((category) => (
            <span
              key={category}
              className="rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 ring-1 ring-gray-200"
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
          className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800 hover:bg-indigo-100"
        >
          {labels.exploreKnowledge}
        </Link>
      </div>
    </div>
  );
}
