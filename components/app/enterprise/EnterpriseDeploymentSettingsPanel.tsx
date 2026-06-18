"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  DEPLOYMENT_MODES,
  DATA_RESIDENCY_MODES,
  CONNECTIVITY_MODES,
  DESKTOP_ENDPOINT_MODES,
  parseTenantDeploymentBundle,
  type TenantDeploymentBundle,
} from "@/lib/aipify/enterprise";

type EnterpriseDeploymentSettingsPanelProps = {
  labels: Record<string, string>;
  modeLabels: Record<string, string>;
  residencyLabels: Record<string, string>;
  connectivityLabels: Record<string, string>;
  endpointLabels: Record<string, string>;
};

export function EnterpriseDeploymentSettingsPanel({
  labels,
  modeLabels,
  residencyLabels,
  connectivityLabels,
  endpointLabels,
}: EnterpriseDeploymentSettingsPanelProps) {
  const [bundle, setBundle] = useState<TenantDeploymentBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/enterprise/deployment");
    if (res.ok) setBundle(parseTenantDeploymentBundle(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(patch: Record<string, unknown>) {
    setSaving(true);
    await fetch("/api/aipify/enterprise/deployment", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    await load();
    setSaving(false);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!bundle?.has_customer) return null;

  const s = bundle.settings ?? {};
  const locked = bundle.upgrade_required;

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <Link href="/app/enterprise" className="text-sm text-indigo-700">{labels.back}</Link>
      </div>
      <p className="text-sm text-gray-600">{labels.subtitle}</p>

      {locked ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{labels.upgradeRequired}</div>
      ) : null}

      <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
        <label className="block text-sm">
          <span className="font-medium">{labels.deploymentMode}</span>
          <select
            defaultValue={s.deployment_mode ?? "cloud_saas"}
            disabled={locked || saving}
            onChange={(e) => void save({ deployment_mode: e.target.value })}
            className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm disabled:opacity-50"
          >
            {DEPLOYMENT_MODES.map((m) => (
              <option key={m} value={m}>{modeLabels[m] ?? m}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="font-medium">{labels.dataResidency}</span>
          <select
            defaultValue={s.data_residency_mode ?? "cloud"}
            disabled={locked || saving}
            onChange={(e) => void save({ data_residency_mode: e.target.value })}
            className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm disabled:opacity-50"
          >
            {DATA_RESIDENCY_MODES.map((m) => (
              <option key={m} value={m}>{residencyLabels[m] ?? m}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="font-medium">{labels.connectivity}</span>
          <select
            defaultValue={s.connectivity_mode ?? "internet"}
            disabled={locked || saving}
            onChange={(e) => void save({ connectivity_mode: e.target.value })}
            className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm disabled:opacity-50"
          >
            {CONNECTIVITY_MODES.map((m) => (
              <option key={m} value={m}>{connectivityLabels[m] ?? m}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="font-medium">{labels.desktopEndpoint}</span>
          <select
            defaultValue={s.desktop_endpoint_mode ?? "cloud"}
            disabled={locked || saving}
            onChange={(e) => void save({ desktop_endpoint_mode: e.target.value })}
            className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm disabled:opacity-50"
          >
            {DESKTOP_ENDPOINT_MODES.map((m) => (
              <option key={m} value={m}>{endpointLabels[m] ?? m}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="font-medium">{labels.customEndpoint}</span>
          <input
            type="url"
            defaultValue={s.custom_desktop_endpoint_url ?? ""}
            disabled={locked || saving}
            onBlur={(e) => void save({ custom_desktop_endpoint_url: e.target.value || null })}
            placeholder="https://aipify.internal.company.local"
            className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm disabled:opacity-50"
          />
        </label>

        {[
          ["cloud_sync_allowed", labels.cloudSync],
          ["raw_data_cloud_sync_allowed", labels.rawCloudSync],
          ["redaction_required", labels.redactionRequired],
          ["local_knowledge_enabled", labels.localKnowledge],
          ["local_memory_enabled", labels.localMemory],
          ["enterprise_governance_enabled", labels.enterpriseGovernance],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              defaultChecked={Boolean(s[key as keyof typeof s])}
              disabled={locked || saving}
              onChange={(e) => void save({ [key]: e.target.checked })}
            />
            {label}
          </label>
        ))}
      </section>

      <p className="text-xs text-gray-500">{labels.privacy}</p>
    </div>
  );
}
