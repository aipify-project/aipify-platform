"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/shared/AipifyLoader";
import {
  parseEnterpriseOrganizationCenter,
  type EnterpriseOrganizationCenter,
} from "@/lib/aipify/enterprise-organization-engine";

type Props = { labels: Record<string, string> };

export function EnterpriseOrganizationEngineDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<EnterpriseOrganizationCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [entityName, setEntityName] = useState("");
  const [entitySlug, setEntitySlug] = useState("");
  const [entityType, setEntityType] = useState("business_unit");

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/enterprise-organization-engine/dashboard");
    if (res.ok) {
      setCenter(parseEnterpriseOrganizationCenter(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.loadFailed);
    }
    setLoading(false);
  }, [labels.loadFailed]);

  useEffect(() => {
    void load();
  }, [load]);

  const createEntity = async () => {
    if (!entityName.trim()) return;
    setCreating(true);
    setActionError(null);
    const res = await fetch("/api/aipify/enterprise-organization-engine/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_entity",
        name: entityName.trim(),
        slug: entitySlug.trim() || undefined,
        entity_type: entityType,
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.createFailed);
    } else {
      setEntityName("");
      setEntitySlug("");
      await load();
    }
    setCreating(false);
  };

  const generateReport = async () => {
    setReporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/enterprise-organization-engine/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generate_consolidated_report" }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.reportFailed);
    } else {
      await load();
    }
    setReporting(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
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
  const group = center.group ?? {};

  return (
    <div className="space-y-6">
      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</div>
      ) : null}

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.overviewTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{center.distinction_note}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [labels.metricOrganizations, overview.organizations ?? 1],
            [labels.metricSubsidiaries, overview.subsidiaries ?? 0],
            [labels.metricBusinessUnits, overview.business_units ?? 0],
            [labels.metricRegions, overview.regions ?? 0],
            [labels.metricEmployees, overview.employees ?? 0],
            [labels.metricDigitalEmployees, overview.digital_employees ?? 0],
            [labels.metricBusinessPacks, overview.active_business_packs ?? 0],
            [labels.metricHealthScore, overview.organization_health_score ?? group.health_score ?? 0],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.modulesTitle}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {(center.modules ?? []).map((mod) => (
            <Link
              key={mod.key}
              href={mod.route ?? "/app/organizations"}
              className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400 hover:text-gray-900"
            >
              {labels[`module_${mod.key}` as keyof typeof labels] ?? mod.key}
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.structureTitle}</h2>
        <ul className="mt-4 space-y-2">
          {(center.hierarchy ?? []).length === 0 ? (
            <li className="text-sm text-gray-500">{labels.noHierarchy}</li>
          ) : (
            (center.hierarchy ?? []).map((node) => (
              <li key={String(node.id)} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm">
                <span>
                  <span className="font-medium text-gray-900">{String(node.name)}</span>
                  <span className="ml-2 text-gray-500">{String(node.entity_type)}</span>
                </span>
                <span className="text-gray-600">{labels.health}: {String(node.health_score)}</span>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.advisorTitle}</h2>
        <div className="mt-4 space-y-4">
          {(center.advisor_signals ?? []).length === 0 ? (
            <p className="text-sm text-gray-500">{labels.noSignals}</p>
          ) : (
            (center.advisor_signals ?? []).map((sig) => (
              <article key={sig.id} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <p className="font-medium text-gray-900">{sig.observation}</p>
                {sig.impact ? <p className="mt-2 text-sm text-gray-600">{sig.impact}</p> : null}
                {sig.recommendation ? (
                  <p className="mt-2 text-sm font-medium text-gray-800">{labels.recommendation}: {sig.recommendation}</p>
                ) : null}
              </article>
            ))
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.regionalTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            {(center.regions ?? []).map((r) => (
              <li key={String(r.id)} className="rounded-lg bg-gray-50 px-3 py-2">
                {String(r.region_name)} · {String(r.country_code)} · {String(r.currency)}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.sharedServicesTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            {(center.shared_services ?? []).map((s) => (
              <li key={String(s.id)} className="flex justify-between rounded-lg bg-gray-50 px-3 py-2">
                <span>{String(s.name)}</span>
                <span>{String(s.utilization_percent)}%</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.createEntityTitle}</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <input
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder={labels.entityNamePlaceholder}
            value={entityName}
            onChange={(e) => setEntityName(e.target.value)}
          />
          <input
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder={labels.entitySlugPlaceholder}
            value={entitySlug}
            onChange={(e) => setEntitySlug(e.target.value)}
          />
          <select
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
          >
            <option value="business_unit">{labels.typeBusinessUnit}</option>
            <option value="subsidiary">{labels.typeSubsidiary}</option>
            <option value="regional_entity">{labels.typeRegional}</option>
            <option value="holding_company">{labels.typeHolding}</option>
            <option value="franchise_organization">{labels.typeFranchise}</option>
          </select>
          <button
            type="button"
            disabled={creating}
            onClick={() => void createEntity()}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {creating ? labels.creating : labels.createEntityButton}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{labels.consolidationTitle}</h2>
            <p className="mt-1 text-sm text-gray-600">{center.privacy_note}</p>
          </div>
          <button
            type="button"
            disabled={reporting}
            onClick={() => void generateReport()}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 disabled:opacity-50"
          >
            {reporting ? labels.reporting : labels.generateReport}
          </button>
        </div>
        <p className="mt-3 text-sm text-gray-500">
          {labels.workspaceCrossLink}{" "}
          <Link href={center.organization_workspace_route ?? "/app/organization-workspace-engine"} className="underline">
            {labels.workspaceLink}
          </Link>
        </p>
      </section>
    </div>
  );
}
