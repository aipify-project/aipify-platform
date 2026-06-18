"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseGlobalDeploymentEnterpriseInfrastructureCenter,
  type GlobalDeploymentEnterpriseInfrastructureCenter,
} from "@/lib/aipify/global-deployment-enterprise-infrastructure-engine";

type Props = { labels: Record<string, string> };

function metricValue(value: unknown): string | number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return value;
  return 0;
}

function statusBadgeClass(status?: string): string {
  switch (status) {
    case "active":
    case "compliant":
      return "bg-emerald-100 text-emerald-800";
    case "planned":
    case "review":
    case "migrating":
      return "bg-amber-100 text-amber-800";
    case "gap":
    case "archived":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export function GlobalDeploymentEnterpriseInfrastructureDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<GlobalDeploymentEnterpriseInfrastructureCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/global-deployment-enterprise-infrastructure-engine/dashboard");
    if (res.ok) {
      setCenter(parseGlobalDeploymentEnterpriseInfrastructureCenter(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.loadFailed);
    }
    setLoading(false);
  }, [labels.loadFailed]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (action: string, extra?: Record<string, unknown>) => {
    setActing(true);
    setActionError(null);
    const res = await fetch("/api/aipify/global-deployment-enterprise-infrastructure-engine/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
    setActing(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <AipifyLoader label={labels.loading} centered />
      </div>
    );
  }

  if (!center?.found || !center.has_access) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <p className="font-medium">{labels.accessRequiredTitle}</p>
        <p className="mt-2 text-sm">{center?.error ?? labels.accessRequiredBody}</p>
      </div>
    );
  }

  const overview = center.overview ?? {};
  const exec = center.executive_dashboard ?? {};

  return (
    <div className="space-y-6">
      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.overviewTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{center.philosophy}</p>
        <p className="mt-2 text-xs text-gray-500">{center.abos_principle}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [labels.metricRegions, metricValue(overview.regions)],
            [labels.metricCountries, metricValue(overview.countries)],
            [labels.metricLanguages, metricValue(overview.languages)],
            [labels.metricDeployments, metricValue(overview.deployments)],
            [labels.metricCompliance, metricValue(overview.compliance_coverage)],
            [labels.metricHealth, metricValue(overview.global_health_score)],
            [labels.metricUsage, metricValue(overview.regional_usage_score)],
            [labels.metricInfraHealth, metricValue(overview.infrastructure_health)],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-white bg-white/90 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {center.global_expansion_route ? (
            <Link href={center.global_expansion_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openGlobalExpansion}
            </Link>
          ) : null}
          {center.deployment_environment_route ? (
            <Link href={center.deployment_environment_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openDeploymentEnvironment}
            </Link>
          ) : null}
          {center.observability_route ? (
            <Link href={center.observability_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openObservability}
            </Link>
          ) : null}
        </div>
      </section>

      <section id="regions" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.regionsTitle}</h2>
        {center.regions?.length ? (
          <ul className="mt-4 space-y-3">
            {center.regions.map((r) => (
              <li key={r.id ?? r.region_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{r.region_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(r.status)}`}>{r.status}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {r.region_type} · {r.countries_count} {labels.countriesLabel}
                </p>
                {r.summary ? <p className="mt-1 text-sm text-gray-600">{r.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noRegions}</p>
        )}
        <button
          type="button"
          disabled={acting}
          onClick={() => void runAction("add_region", { region_title: "Custom region", region_type: "custom" })}
          className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {labels.addRegion}
        </button>
      </section>

      <section id="countries" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.countriesTitle}</h2>
        {center.countries?.length ? (
          <ul className="mt-4 space-y-3">
            {center.countries.map((c) => (
              <li key={c.id ?? c.country_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{c.country_name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(c.compliance_status)}`}>
                    {c.compliance_status}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {c.primary_language} · {c.currency_code} · {c.timezone}
                </p>
                {c.summary ? <p className="mt-1 text-sm text-gray-600">{c.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noCountries}</p>
        )}
        <button
          type="button"
          disabled={acting}
          onClick={() => void runAction("add_country", { country_name: "New market", primary_language: "en", currency_code: "USD" })}
          className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {labels.addCountry}
        </button>
      </section>

      <section id="localization" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.localizationTitle}</h2>
        {center.core_languages?.length ? (
          <p className="mt-2 text-xs text-gray-500">
            {labels.coreLanguagesLabel}: {center.core_languages.join(", ")}
          </p>
        ) : null}
        {center.localizations?.length ? (
          <ul className="mt-4 space-y-3">
            {center.localizations.map((l) => (
              <li key={l.id ?? l.locale_key} className="rounded-lg border border-gray-100 p-3">
                <p className="font-medium text-gray-900">{l.locale_title}</p>
                <p className="text-xs text-gray-500">
                  {l.language_code} · {l.currency_code} · {l.adoption_percent}% {labels.adoptionLabel}
                </p>
                {l.summary ? <p className="mt-1 text-sm text-gray-600">{l.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noLocalizations}</p>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section id="compliance" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.complianceTitle}</h2>
          {center.compliance_policies?.length ? (
            <ul className="mt-4 space-y-3">
              {center.compliance_policies.map((p) => (
                <li key={p.id ?? p.policy_key} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{p.policy_title}</p>
                  <p className="text-xs text-gray-500">
                    {p.policy_type} · {p.region_scope}
                  </p>
                  {p.summary ? <p className="mt-1 text-sm text-gray-600">{p.summary}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noCompliance}</p>
          )}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.residencyTitle}</h2>
          {center.data_residency?.length ? (
            <ul className="mt-4 space-y-3">
              {center.data_residency.map((d) => (
                <li key={d.id ?? d.residency_key} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{d.residency_title}</p>
                  <p className="text-xs text-gray-500">
                    {d.storage_type} · {d.region_scope}
                  </p>
                  {d.summary ? <p className="mt-1 text-sm text-gray-600">{d.summary}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noResidency}</p>
          )}
        </section>
      </div>

      <section id="infrastructure" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.infrastructureTitle}</h2>
        {center.deployments?.length ? (
          <ul className="mt-4 space-y-3">
            {center.deployments.map((d) => (
              <li key={d.id ?? d.deployment_key} className="rounded-lg border border-gray-100 p-3">
                <p className="font-medium text-gray-900">{d.deployment_title}</p>
                <p className="text-xs text-gray-500">
                  {d.deployment_model} · {labels.healthLabel} {d.health_score}
                </p>
                {d.summary ? <p className="mt-1 text-sm text-gray-600">{d.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noDeployments}</p>
        )}
        {center.infrastructure_profiles?.length ? (
          <ul className="mt-4 space-y-3">
            {center.infrastructure_profiles.map((p) => (
              <li key={p.id ?? p.profile_key} className="rounded-lg border border-gray-100 p-3">
                <p className="font-medium text-gray-900">{p.profile_title}</p>
                <p className="text-xs text-gray-500">
                  {p.profile_type} · {labels.readinessLabel} {p.readiness_score}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("create_deployment", { deployment_title: "Regional deployment", deployment_model: "dedicated_cloud" })}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {labels.createDeployment}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("update_infrastructure", { profile_key: "INF-HA", delta: 1 })}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {labels.updateInfrastructure}
          </button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.intelligenceTitle}</h2>
          {center.intelligence_signals?.length ? (
            <ul className="mt-4 space-y-3">
              {center.intelligence_signals.map((s) => (
                <li key={s.id ?? s.signal_type} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{s.observation}</p>
                  {s.recommendation ? (
                    <p className="mt-1 text-sm text-gray-600">
                      {labels.recommendation}: {s.recommendation}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noIntelligence}</p>
          )}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.advisorTitle}</h2>
          {center.advisor_signals?.length ? (
            <ul className="mt-4 space-y-3">
              {center.advisor_signals.map((s) => (
                <li key={s.id ?? s.signal_type} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{s.observation}</p>
                  {s.recommendation ? (
                    <p className="mt-1 text-sm text-gray-600">
                      {labels.recommendation}: {s.recommendation}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noAdvisor}</p>
          )}
        </section>
      </div>

      <section id="governance" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.governanceTitle}</h2>
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          <li>{labels.governanceTenantIsolation}</li>
          <li>{labels.governanceRegionalGovernance}</li>
          <li>{labels.governanceRegionalCompliance}</li>
          <li>{labels.governanceDeploymentFlexibility}</li>
          <li>{labels.governanceHumanApproval}</li>
        </ul>
        <p className="mt-4 text-xs text-gray-500">{center.distinction_note}</p>
      </section>

      <section id="analytics" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.auditTitle}</h2>
        {center.audit_logs?.length ? (
          <ul className="mt-4 space-y-2">
            {center.audit_logs.map((log) => (
              <li key={String(log.id)} className="flex justify-between gap-4 text-sm text-gray-700">
                <span>{String(log.summary ?? "")}</span>
                <span className="shrink-0 text-xs uppercase text-gray-400">{String(log.event_type ?? "")}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noAudit}</p>
        )}
        <button
          type="button"
          disabled={acting}
          onClick={() => void runAction("refresh_analytics")}
          className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {labels.refreshAnalytics}
        </button>
      </section>

      <section className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">{labels.executiveTitle}</p>
        <p className="mt-1">
          {labels.executiveSummary}: {labels.footprintLabel} {String(exec.global_footprint ?? "—")} ·{" "}
          {labels.complianceLabel} {String(exec.compliance_status ?? "—")} · {labels.adoptionExecutiveLabel}{" "}
          {String(exec.language_adoption ?? "—")}
        </p>
        {center.privacy_note ? <p className="mt-2">{center.privacy_note}</p> : null}
      </section>
    </div>
  );
}
