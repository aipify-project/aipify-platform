"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCompanionMarketplaceDashboard,
  type AbosSuccessCriterion,
  type BlueprintObjective,
  type CatalogItem,
  type CompanionAdaptationExample,
  type CompanionDirectoryEntry,
  type CompanionMarketplaceDashboard,
  type IntegrationLink,
} from "@/lib/aipify/companion-marketplace";

type CompanionMarketplaceDashboardPanelProps = {
  labels: Record<string, string>;
};

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-violet-100 bg-violet-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {objective.emoji ? `${objective.emoji} ` : ""}
        {objective.label}
      </span>
      {objective.description ? <p className="mt-1 text-xs text-violet-900">{objective.description}</p> : null}
    </div>
  );
}

function SuccessCriterionRow({
  criterion,
  metLabel,
  pendingLabel,
}: {
  criterion: AbosSuccessCriterion;
  metLabel: string;
  pendingLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-2 rounded border border-gray-100 px-3 py-2 text-sm">
      <span className="text-gray-800">{criterion.label}</span>
      <span className={criterion.met ? "text-xs text-green-700" : "text-xs text-amber-700"}>
        {criterion.met ? metLabel : pendingLabel}
      </span>
      {criterion.note ? <p className="w-full text-xs text-gray-500">{criterion.note}</p> : null}
    </div>
  );
}

function badgeClass(value?: string) {
  switch (value) {
    case "active":
    case "approved":
    case "low":
      return "bg-emerald-100 text-emerald-800";
    case "pilot":
    case "testing":
    case "moderate":
      return "bg-amber-100 text-amber-800";
    case "high":
    case "critical":
    case "under_review":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function CatalogCard({ item }: { item: CatalogItem }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium text-gray-900">{item.name}</span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(item.risk_classification)}`}>
          {item.risk_classification}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-500">{item.role_title}</p>
      {item.description ? <p className="mt-2 text-xs text-gray-600">{item.description}</p> : null}
    </div>
  );
}

function DirectoryRow({ entry }: { entry: CompanionDirectoryEntry }) {
  return (
    <div className="rounded-lg border border-gray-100 p-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium">{entry.companion_name}</span>
        <span className={`rounded px-2 py-0.5 text-xs ${badgeClass(entry.status)}`}>{entry.status}</span>
        <span className="text-xs text-gray-500">
          {entry.assigned_team} · L{entry.governance_level}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-600">
        {entry.employee_type} · {entry.usage_frequency}
        {entry.satisfaction_score != null ? ` · ${entry.satisfaction_score}` : ""}
      </p>
    </div>
  );
}

function AdaptationCard({ example }: { example: CompanionAdaptationExample }) {
  return (
    <div className="rounded-lg border border-violet-100 bg-violet-50/30 px-3 py-2 text-sm">
      <p className="font-medium">
        {example.emoji ? `${example.emoji} ` : ""}
        {example.prompt}
      </p>
      {example.consideration ? <p className="mt-1 text-xs text-violet-800">{example.consideration}</p> : null}
    </div>
  );
}

export function CompanionMarketplaceDashboardPanel({ labels }: CompanionMarketplaceDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<CompanionMarketplaceDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/companion-marketplace/dashboard");
    if (res.ok) setDashboard(parseCompanionMarketplaceDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const integrationLinks: IntegrationLink[] =
    dashboard.cmbp113_integration_links ?? dashboard.integration_links ?? [];
  const limitationItems = dashboard.companion_marketplace_limitation_principles?.must_avoid ?? [];
  const adaptationExamples = dashboard.companion_marketplace_companion_adaptation?.examples ?? [];
  const deploymentSteps = Array.isArray(dashboard.deployment_flow?.steps)
    ? (dashboard.deployment_flow.steps as Array<{ order?: number; label?: string; description?: string }>)
    : [];
  const governanceLayers = Array.isArray(dashboard.governance_layers?.layers)
    ? (dashboard.governance_layers.layers as Array<{ level?: number; label?: string; description?: string }>)
    : [];
  const healthMetrics = dashboard.health_snapshot ?? {};

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-violet-800">{labels.marketplaceScore}</p>
            <p className="text-3xl font-bold text-violet-900">{dashboard.marketplace_score ?? 0}</p>
            <p className="mt-1 text-sm text-violet-700">{dashboard.philosophy}</p>
            {dashboard.human_approval_required ? (
              <p className="mt-2 text-xs text-violet-600">{labels.humanApprovalRequired}</p>
            ) : null}
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-violet-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-violet-600">{labels.activeDeployments}</span>
            <p className="font-semibold">{dashboard.active_deployments_count ?? 0}</p>
          </div>
          <div className="rounded-lg border border-violet-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-violet-600">{labels.catalogItems}</span>
            <p className="font-semibold">{dashboard.catalog_items_count ?? 0}</p>
          </div>
          <div className="rounded-lg border border-violet-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-violet-600">{labels.userSatisfaction}</span>
            <p className="font-semibold">{dashboard.user_satisfaction ?? 0}</p>
          </div>
          <div className="rounded-lg border border-violet-100 bg-white/80 px-3 py-2 text-sm">
            <span className="text-violet-600">{labels.policyCompliance}</span>
            <p className="font-semibold">{dashboard.policy_compliance ?? 0}%</p>
          </div>
        </div>
      </div>

      {dashboard.catalog_by_category.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.marketplaceCategories}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.catalog_by_category.map((item) => (
              <CatalogCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.companion_directory.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.companionDirectory}</h2>
          <div className="space-y-2">
            {dashboard.companion_directory.map((entry) => (
              <DirectoryRow key={entry.id} entry={entry} />
            ))}
          </div>
        </section>
      ) : null}

      {deploymentSteps.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.deploymentFlow}</h2>
          <ol className="list-inside list-decimal space-y-2 text-sm text-gray-700">
            {deploymentSteps.map((step) => (
              <li key={step.order ?? step.label}>
                <span className="font-medium">{step.label}</span>
                {step.description ? <span className="text-gray-600"> — {step.description}</span> : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {governanceLayers.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.governanceLayers}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {governanceLayers.map((layer) => (
              <div key={layer.level} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <p className="font-medium">
                  L{layer.level}: {layer.label}
                </p>
                {layer.description ? <p className="mt-1 text-xs text-gray-600">{layer.description}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {Object.keys(healthMetrics).length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.healthMetrics}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: labels.recommendationQuality, value: healthMetrics.recommendation_quality },
              { label: labels.escalationFrequency, value: healthMetrics.escalation_frequency },
              { label: labels.responseAccuracy, value: healthMetrics.response_accuracy },
              { label: labels.adoptionRate, value: healthMetrics.adoption_rate },
              { label: labels.workflowEfficiency, value: healthMetrics.workflow_efficiency },
              { label: labels.knowledgeUtilization, value: healthMetrics.knowledge_utilization },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-gray-100 bg-white p-3 text-sm">
                <p className="font-medium text-gray-800">{item.label}</p>
                <p className="mt-1 text-lg font-semibold text-violet-900">{item.value ?? "—"}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.enterprise_center_enabled || dashboard.enterprise_center ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.enterpriseCenter}</h2>
          <p className="text-sm text-gray-600">{labels.enterpriseCenterNote}</p>
          <Link
            href="/app/settings/two-factor"
            className="inline-block rounded-lg border border-violet-200 px-3 py-2 text-sm font-medium text-violet-800 hover:bg-violet-50"
          >
            {labels.twoFactorLink}
          </Link>
        </section>
      ) : (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.enterpriseCenter}</h2>
          <p className="text-sm text-gray-600">{labels.enterpriseCenterNote}</p>
          <Link
            href="/app/settings/two-factor"
            className="inline-block rounded-lg border border-violet-200 px-3 py-2 text-sm font-medium text-violet-800 hover:bg-violet-50"
          >
            {labels.twoFactorLink}
          </Link>
        </section>
      )}

      {adaptationExamples.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.companionAdaptation}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {adaptationExamples.map((example) => (
              <AdaptationCard key={example.key ?? example.prompt} example={example} />
            ))}
          </div>
        </section>
      ) : null}

      {integrationLinks.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.crossLinks}</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {integrationLinks.map((link) =>
              link.route ? (
                <Link
                  key={link.key ?? link.route}
                  href={link.route}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:border-violet-300 hover:bg-violet-50/50"
                >
                  <span className="font-medium text-gray-900">{link.label}</span>
                  {link.note ? <p className="mt-1 text-xs text-gray-500">{link.note}</p> : null}
                </Link>
              ) : null,
            )}
          </div>
        </section>
      ) : null}

      {dashboard.companion_marketplace_objectives?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.blueprintObjectives}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.companion_marketplace_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {limitationItems.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.limitationPrinciples}</h2>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
            {limitationItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.companion_marketplace_success_criteria?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">{labels.successCriteria}</h2>
          <div className="space-y-2">
            {dashboard.companion_marketplace_success_criteria.map((criterion) => (
              <SuccessCriterionRow
                key={criterion.key ?? criterion.label}
                criterion={criterion}
                metLabel={labels.criterionMet}
                pendingLabel={labels.criterionPending}
              />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.companion_marketplace_vision ? (
        <p className="rounded-lg border border-violet-100 bg-violet-50/30 px-4 py-3 text-sm italic text-violet-900">
          {dashboard.companion_marketplace_vision}
        </p>
      ) : null}

      {dashboard.safety_note ? <p className="text-xs text-gray-500">{dashboard.safety_note}</p> : null}
    </div>
  );
}
