"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseEnterpriseDeploymentFrameworkDashboard,
  type EnterpriseDeploymentFrameworkDashboard,
  type DeploymentStage,
} from "@/lib/aipify/enterprise-deployment-framework";

type EnterpriseDeploymentFrameworkPanelProps = {
  labels: Record<string, string>;
};

function stageStatusClass(status?: string) {
  switch (status) {
    case "completed":
      return "bg-emerald-100 text-emerald-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export function EnterpriseDeploymentFrameworkPanel({ labels }: EnterpriseDeploymentFrameworkPanelProps) {
  const [dashboard, setDashboard] = useState<EnterpriseDeploymentFrameworkDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/enterprise-deployment-framework/dashboard");
    if (res.ok) setDashboard(parseEnterpriseDeploymentFrameworkDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/enterprise-deployment-framework/briefings/generate", { method: "POST" });
    await load();
  };

  const advanceStage = async (projectId: string) => {
    setActing(projectId);
    await fetch(`/api/aipify/enterprise-deployment-framework/projects/${projectId}/advance-stage`, { method: "POST" });
    setActing(null);
    await load();
  };

  const activatePolicy = async (policyId: string) => {
    setActing(policyId);
    await fetch(`/api/aipify/enterprise-deployment-framework/governance/${policyId}/activate`, { method: "POST" });
    setActing(null);
    await load();
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/enterprise" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.backToEnterprise}</Link>
        <Link href="/app/enterprise/deployment" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.deploymentSettings}</Link>
        <Link href="/app/enterprise/audit" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">{labels.auditCompliance}</Link>
      </div>

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold text-indigo-900">{labels.frameworkScore}</h2>
        <p className="mt-2 text-4xl font-bold text-indigo-800">
          {dashboard.framework_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className="mt-1 text-sm font-medium text-indigo-700">{dashboard.current_stage_label}</p>
        <p className="mt-2 text-sm text-indigo-800">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-indigo-700">{dashboard.safety_note}</p>
        {dashboard.pilot_recommended ? (
          <p className="mt-2 text-xs text-amber-800">{labels.pilotRecommended}</p>
        ) : null}
        <button
          type="button"
          onClick={() => void generateBriefing()}
          className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {labels.generateBriefing}
        </button>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: labels.deploymentReadiness, value: `${dashboard.deployment_readiness ?? 0}/100` },
          { label: labels.userAdoption, value: `${dashboard.user_adoption_pct ?? 0}%` },
          { label: labels.governanceActive, value: dashboard.governance_policies_active ?? 0 },
          { label: labels.securityControls, value: dashboard.security_controls_enabled ?? 0 },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">{m.label}</p>
            <p className="text-lg font-semibold text-gray-900">{m.value}</p>
          </div>
        ))}
      </section>

      {dashboard.project ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">{dashboard.project.project_name}</h2>
              <p className="mt-1 text-xs text-gray-600">
                {dashboard.project.deployment_model_label} · {labels.readiness}: {dashboard.project.readiness_score}/100
              </p>
            </div>
            {dashboard.project.current_stage !== "optimization" ? (
              <button
                type="button"
                disabled={acting === dashboard.project.id}
                onClick={() => advanceStage(dashboard.project!.id)}
                className="rounded-md border border-indigo-300 px-3 py-1.5 text-xs font-medium text-indigo-800 hover:bg-indigo-50 disabled:opacity-50"
              >
                {labels.advanceStage}
              </button>
            ) : null}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.deploymentStages}</h2>
        <div className="mt-3 space-y-2">
          {dashboard.deployment_stages.map((s: DeploymentStage) => (
            <div key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
              <span className="font-medium text-gray-900">{s.stage_label ?? s.stage_key}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${stageStatusClass(s.status)}`}>
                {s.status?.replace(/_/g, " ")} · {s.progress_pct}%
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.readinessAssessment}</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {dashboard.readiness_assessments.map((a) => (
            <div key={a.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
              <span className="capitalize text-gray-700">{a.assessment_area?.replace(/_/g, " ")}</span>
              <span className="ml-2 font-medium text-indigo-700">{a.score}/100</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.deploymentModels}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {dashboard.deployment_models?.map((m) => (
            <article key={m.key} className="rounded-lg border border-gray-200 bg-white p-3 text-sm">
              <p className="font-medium text-gray-900">{m.label}</p>
              <p className="mt-1 text-xs text-gray-600">{m.description}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.iamCapabilities}</h2>
          <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
            {dashboard.iam_capabilities?.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.enterpriseRoles}</h2>
          <ul className="mt-2 space-y-1 text-xs text-gray-600">
            {dashboard.enterprise_roles.map((r) => (
              <li key={r.id}><span className="font-medium text-gray-800">{r.title}</span> — {r.description}</li>
            ))}
          </ul>
        </section>
      </div>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.governancePolicies}</h2>
        <ul className="mt-3 space-y-2">
          {dashboard.governance_policies.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-violet-100 bg-violet-50 px-3 py-2 text-sm">
              <span className="text-violet-900">{p.title}</span>
              {p.status === "draft" ? (
                <button
                  type="button"
                  disabled={acting === p.id}
                  onClick={() => activatePolicy(p.id)}
                  className="rounded-md border border-violet-300 px-2 py-1 text-xs font-medium text-violet-800 hover:bg-violet-100 disabled:opacity-50"
                >
                  {labels.activatePolicy}
                </button>
              ) : (
                <span className="text-xs capitalize text-emerald-700">{p.status}</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.securityControlsTitle}</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {dashboard.security_policies.map((p) => (
            <li key={p.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-700">
              <span className="font-medium">{p.title}</span>
              <span className={`ml-2 text-xs ${p.enabled ? "text-emerald-700" : "text-gray-500"}`}>
                {p.enabled ? labels.enabled : labels.disabled}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {dashboard.integrations.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.integrationFramework}</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.integrations.map((i) => (
              <li key={i.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span className="font-medium text-gray-900">{i.display_name}</span>
                <span className="ml-2 text-xs capitalize text-gray-500">{i.category} · {i.status}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.change_initiatives.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.changeManagement}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.change_initiatives.map((c) => (
              <li key={c.id} className="rounded-lg border border-teal-100 bg-teal-50 px-3 py-2 text-sm text-teal-900">
                <span className="font-medium">{c.title}</span>
                <p className="mt-1 text-xs text-teal-800">{c.description}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.success_metrics.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.successMetrics}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.success_metrics.map((m) => (
              <div key={m.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm">
                <p className="text-xs text-gray-500">{m.title}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {m.current_value}{m.unit === "percent" ? "%" : ""}
                  {m.target_value ? <span className="text-sm font-normal text-gray-500"> / {m.target_value}{m.unit === "percent" ? "%" : ""}</span> : null}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.continuity_plans.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.businessContinuity}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.continuity_plans.map((p) => (
              <li key={p.id} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-900">
                <span className="font-medium">{p.title}</span>
                <span className="ml-2 text-xs text-slate-600">RTO {p.rto_hours}h · RPO {p.rpo_hours}h</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
        <h2 className="text-sm font-semibold text-gray-900">{labels.supportModel}</h2>
        <p className="mt-1 text-xs text-gray-600">{labels.currentTier}: <span className="capitalize">{dashboard.support_tier?.replace(/_/g, " ")}</span></p>
        <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
          {dashboard.support_tiers?.map((t) => (
            <li key={t.tier}>{t.label}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
