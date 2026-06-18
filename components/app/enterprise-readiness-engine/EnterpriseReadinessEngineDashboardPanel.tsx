"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseEnterpriseReadinessEngineDashboard,
  type EnterpriseReadinessEngineDashboard,
} from "@/lib/aipify/enterprise-readiness-engine";

type Props = { labels: Record<string, string> };

function healthClass(status?: string) {
  switch (status) {
    case "excellent":
      return "bg-emerald-100 text-emerald-800";
    case "healthy":
      return "bg-sky-100 text-sky-800";
    case "at_risk":
      return "bg-amber-100 text-amber-800";
    case "critical":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function statusClass(status?: string) {
  switch (status) {
    case "active":
      return "bg-emerald-100 text-emerald-800";
    case "scaffold":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function EnterpriseReadinessEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<EnterpriseReadinessEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/enterprise-readiness-engine/dashboard");
    if (res.ok) setDashboard(parseEnterpriseReadinessEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function loadReport(type: string) {
    setReportLoading(type);
    await fetch(`/api/enterprise/reports/${type}`);
    setReportLoading(null);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const deployment = dashboard.deployment_readiness ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/governance-policy-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.governance}
        </Link>
        <Link
          href="/app/deployment-environment-management-engine"
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
        >
          {labels.deployments}
        </Link>
        <Link href="/app/enterprise" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.enterpriseDeployment}
        </Link>
        <Link href="/app/enterprise/framework" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.enterpriseFramework}
        </Link>
        <Link
          href="/app/enterprise-deployment-device-rollout-engine"
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
        >
          {labels.deviceRollout}
        </Link>
        <Link href="/app/executive-insights-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.executiveInsights}
        </Link>
        <Link href="/app/compliance-regulatory-readiness-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.compliance}
        </Link>
        <Link href="/app/human-oversight-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.humanOversight}
        </Link>
        <Link href="/app/self-love-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.selfLove}
        </Link>
        <Link href="/app/organization-workspace-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.organizationWorkspace}
        </Link>
        {(dashboard.enterprise_integration_links ?? []).map((link) =>
          link.route &&
          ![
            "/app/governance-policy-engine",
            "/app/enterprise",
            "/app/enterprise/framework",
            "/app/enterprise-deployment-device-rollout-engine",
            "/app/executive-insights-engine",
            "/app/compliance-regulatory-readiness-engine",
            "/app/human-oversight-engine",
            "/app/self-love-engine",
            "/app/organization-workspace-engine",
            "/app/deployment-environment-management-engine",
          ].includes(link.route) ? (
            <Link key={link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
              {link.label ?? link.route}
            </Link>
          ) : null
        )}
      </div>

      {dashboard.implementation_blueprint_phase37 ? (
        <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
          <h2 className="text-sm font-semibold text-violet-900">{labels.blueprintTitle}</h2>
          <p className="mt-1 text-xs uppercase tracking-wide text-violet-700">
            {dashboard.implementation_blueprint_phase37.title ?? labels.blueprintPhase37}
            {dashboard.implementation_blueprint_phase37.engine_phase
              ? ` · ${dashboard.implementation_blueprint_phase37.engine_phase}`
              : ""}
          </p>
          {dashboard.enterprise_deployment_governance_mission ? (
            <p className="mt-2 text-sm font-medium text-violet-900">
              {dashboard.enterprise_deployment_governance_mission}
            </p>
          ) : null}
          {dashboard.enterprise_deployment_governance_philosophy ? (
            <p className="mt-2 text-sm text-violet-900">{dashboard.enterprise_deployment_governance_philosophy}</p>
          ) : null}
          {dashboard.enterprise_abos_principle ? (
            <p className="mt-2 text-xs text-violet-800">{dashboard.enterprise_abos_principle}</p>
          ) : null}
          {dashboard.enterprise_distinction_note ? (
            <p className="mt-2 text-xs text-violet-700">{dashboard.enterprise_distinction_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.enterprise_summary ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.enterpriseSummary}</h3>
          <div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-3">
            <span>
              {labels.overall_score}: {dashboard.enterprise_summary.overall_readiness_score ?? 0}
            </span>
            <span>
              {labels.governanceScore}: {dashboard.enterprise_summary.governance_score ?? 0}
            </span>
            <span>
              {labels.delegated_admins}: {dashboard.enterprise_summary.delegated_admin_count ?? 0}
            </span>
            <span>
              {labels.approval_chains}: {dashboard.enterprise_summary.active_approval_chains ?? 0}
            </span>
            <span>
              {labels.pending_milestones}: {dashboard.enterprise_summary.pending_milestones ?? 0}
            </span>
            <span>
              {labels.ssoScaffold}: {dashboard.enterprise_summary.sso_scaffold_documented ? "✓" : "—"}
            </span>
          </div>
        </section>
      ) : null}

      {dashboard.enterprise_objectives && dashboard.enterprise_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.enterpriseObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.enterprise_objectives.map((objective) => (
              <article key={objective.key ?? objective.label} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <p className="font-medium text-gray-900">{objective.label}</p>
                {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.deployment_models?.models && dashboard.deployment_models.models.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.deploymentModels}</h3>
          {dashboard.deployment_models.principle ? (
            <p className="mt-2 text-xs text-gray-600">{dashboard.deployment_models.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {dashboard.deployment_models.models.map((model) => (
              <article key={model.key ?? model.label} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">{model.label}</p>
                  {model.status ? (
                    <span className={`rounded-full px-2 py-0.5 text-xs ${statusClass(model.status)}`}>
                      {model.status === "scaffold" ? labels.statusScaffold : labels.statusActive}
                    </span>
                  ) : null}
                </div>
                {model.description ? <p className="mt-1 text-xs text-gray-600">{model.description}</p> : null}
              </article>
            ))}
          </div>
          {dashboard.deployment_models.safety_note ? (
            <p className="mt-2 text-xs text-amber-700">{dashboard.deployment_models.safety_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.identity_access_management?.capabilities &&
      dashboard.identity_access_management.capabilities.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.iamCapabilities}</h3>
          {dashboard.identity_access_management.principle ? (
            <p className="mt-2 text-xs text-gray-600">{dashboard.identity_access_management.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2">
            {dashboard.identity_access_management.capabilities.map((cap) => (
              <li key={cap.key ?? cap.label} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium">{cap.label}</span>
                {cap.status ? (
                  <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${statusClass(cap.status)}`}>
                    {cap.status === "scaffold" ? labels.statusScaffold : labels.statusActive}
                  </span>
                ) : null}
                {cap.note ? <p className="mt-1 text-xs text-gray-500">{cap.note}</p> : null}
              </li>
            ))}
          </ul>
          {dashboard.identity_access_management.boundary ? (
            <p className="mt-2 text-xs text-amber-700">{dashboard.identity_access_management.boundary}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.multi_entity_support?.hierarchy && dashboard.multi_entity_support.hierarchy.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.multiEntitySupport}</h3>
          {dashboard.multi_entity_support.principle ? (
            <p className="mt-2 text-xs text-gray-600">{dashboard.multi_entity_support.principle}</p>
          ) : null}
          <ol className="mt-3 space-y-2">
            {dashboard.multi_entity_support.hierarchy.map((level) => (
              <li key={level.key ?? level.label} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span className="text-xs text-gray-500">
                  {labels.hierarchyLevel} {level.level}:{" "}
                </span>
                <span className="font-medium">{level.label}</span>
                {level.description ? <p className="mt-1 text-xs text-gray-500">{level.description}</p> : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {dashboard.governance_controls?.controls && dashboard.governance_controls.controls.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.governanceControls}</h3>
          {dashboard.governance_controls.principle ? (
            <p className="mt-2 text-xs text-gray-600">{dashboard.governance_controls.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2">
            {dashboard.governance_controls.controls.map((control) => (
              <li key={control.key ?? control.label} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium">{control.label}</span>
                {control.description ? <p className="mt-1 text-xs text-gray-500">{control.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.executive_capabilities?.capabilities &&
      dashboard.executive_capabilities.capabilities.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.executiveCapabilities}</h3>
          {dashboard.executive_capabilities.principle ? (
            <p className="mt-2 text-xs text-gray-600">{dashboard.executive_capabilities.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.executive_capabilities.capabilities.map((cap) => (
              <article key={cap.key ?? cap.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-sm font-medium text-gray-900">
                  {cap.emoji} {cap.label}
                </p>
                {cap.description ? <p className="mt-1 text-xs text-gray-600">{cap.description}</p> : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.enterprise_self_love_connection?.principle ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm">
          <h3 className="text-sm font-semibold text-rose-900">{labels.selfLoveConnection}</h3>
          <p className="mt-2 text-rose-800">{dashboard.enterprise_self_love_connection.principle}</p>
          {dashboard.enterprise_self_love_connection.connections &&
          dashboard.enterprise_self_love_connection.connections.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-rose-700">
              {dashboard.enterprise_self_love_connection.connections.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.enterprise_trust_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.trustConnection}</h3>
          <p className="mt-2 text-gray-700">{dashboard.enterprise_trust_connection.principle}</p>
          {dashboard.enterprise_trust_connection.users_should_understand &&
          dashboard.enterprise_trust_connection.users_should_understand.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-gray-600">
              {dashboard.enterprise_trust_connection.users_should_understand.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.enterprise_dogfooding?.principle ? (
        <section className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-4 text-sm text-emerald-900">
          <h3 className="text-sm font-semibold">{labels.dogfooding}</h3>
          <p className="mt-2">{dashboard.enterprise_dogfooding.principle}</p>
          {dashboard.enterprise_dogfooding.aipify_group?.role ? (
            <p className="mt-2 text-xs">
              <span className="font-medium">{labels.aipifyGroup}:</span> {dashboard.enterprise_dogfooding.aipify_group.role}
            </p>
          ) : null}
          {dashboard.enterprise_dogfooding.unonight?.role ? (
            <p className="mt-1 text-xs">
              <span className="font-medium">{labels.unonight}:</span> {dashboard.enterprise_dogfooding.unonight.role}
            </p>
          ) : null}
        </section>
      ) : null}

      {Array.isArray(dashboard.enterprise_success_criteria) && dashboard.enterprise_success_criteria.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.enterprise_success_criteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              return (
                <li key={item.key ?? label} className="flex items-start gap-2">
                  <span className={met ? "text-emerald-600" : "text-gray-400"}>{met ? "✓" : "○"}</span>
                  <span>
                    {label}
                    {item.note ? <span className="block text-xs text-gray-500">{item.note}</span> : null}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {dashboard.enterprise_vision_phrases && dashboard.enterprise_vision_phrases.length > 0 ? (
        <section className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4">
          <h3 className="text-sm font-semibold text-indigo-900">{labels.visionPhrases}</h3>
          <ul className="mt-2 space-y-2 text-xs italic text-indigo-800">
            {dashboard.enterprise_vision_phrases.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${healthClass(summary.health_status as string)}`}
          >
            {String(summary.health_status ?? "healthy")}
          </span>
        </div>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.overall_score}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.overall_readiness_score ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.delegated_admins}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.delegated_admin_count ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.approval_chains}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.active_approval_chains ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.pending_milestones}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.pending_milestones ?? 0)}</p>
        </div>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.security_posture}</h3>
        <p className="mt-2 text-sm text-gray-600">
          {labels.securityScore}: {String(dashboard.security_posture?.score ?? "—")}
        </p>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.integration_landscape}</h3>
        <p className="mt-2 text-sm text-gray-600">
          {labels.connectedIntegrations}: {String(summary.integration_connected_count ?? 0)}
        </p>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.approval_bottlenecks}</h3>
        {(dashboard.approval_bottlenecks ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.approval_bottlenecks.map((item, idx) => (
              <li key={String(item.chain_key ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {String(item.chain_title ?? item.chain_key)} · {String(item.bottleneck_risk ?? "normal")}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.operational_risks}</h3>
        {(dashboard.operational_risks ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.operational_risks.map((item, idx) => (
              <li key={String(item.milestone_key ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {String(item.milestone_title ?? item.milestone_key)} · {String(item.status ?? "pending")}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.onboarding_milestones}</h3>
        {(dashboard.onboarding_milestones ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.onboarding_milestones.map((item, idx) => (
              <li key={String(item.milestone_key ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {String(item.milestone_title ?? item.milestone_key)} · {String(item.category ?? "")}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.deployment_readiness}</h3>
        <p className="mt-2 text-sm text-gray-600">
          {labels.deploymentModel}: {String(deployment.current_model ?? "multi_tenant_saas")}
        </p>
        {deployment.route ? (
          <Link href={String(deployment.route)} className="mt-2 inline-block text-sm text-blue-600 hover:underline">
            {labels.openDeploymentEngine}
          </Link>
        ) : null}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.reports}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {(dashboard.reports_available ?? ["executive", "operational", "governance", "audit_preparation"]).map(
            (type) => (
              <button
                key={type}
                type="button"
                disabled={reportLoading === type}
                onClick={() => void loadReport(type === "audit_preparation" ? "audit-preparation" : type)}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-50"
              >
                {type}
              </button>
            )
          )}
        </div>
      </section>

      {dashboard.principles && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.principles.map((pr) => (
              <li key={pr}>{pr}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
