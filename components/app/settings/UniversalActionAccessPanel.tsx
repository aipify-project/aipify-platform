"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseUaafActionAccessCenter,
  UAAF_CORE_PRINCIPLE,
  type UaafActionAccessCenter,
} from "@/lib/universal-action-access";

type UniversalActionAccessPanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  integrationsTitle: string;
  noIntegrations: string;
  auditTitle: string;
  noAudit: string;
  settingsTitle: string;
  enabled: string;
  businessHoursOnly: string;
  emergencyHonored: string;
  saveSettings: string;
  saved: string;
  approvalLevels: Record<string, string>;
  categories: Record<string, string>;
  links: {
    approvals: string;
    actionCenter: string;
    printers: string;
  };
  settings: string;
};

type UniversalActionAccessPanelProps = {
  labels: UniversalActionAccessPanelLabels;
};

export function UniversalActionAccessPanel({ labels }: UniversalActionAccessPanelProps) {
  const [center, setCenter] = useState<UaafActionAccessCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    enabled: true,
    business_hours_only: false,
    emergency_stop_honored: true,
  });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/uaaf/center");
    if (res.ok) {
      const data = parseUaafActionAccessCenter(await res.json());
      setCenter(data);
      setForm({
        enabled: data.settings.enabled,
        business_hours_only: data.settings.business_hours_only,
        emergency_stop_honored: data.settings.emergency_stop_honored,
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveSettings() {
    await fetch("/api/uaaf/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
    await load();
  }

  if (loading) return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <Link href="/app/settings" className="text-sm text-indigo-600 hover:underline">
        {labels.settings}
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
          {labels.corePrinciple}: {center?.core_principle || UAAF_CORE_PRINCIPLE}
        </p>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm text-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.settingsTitle}</h2>
        <div className="mt-4 space-y-3">
          {(
            [
              ["enabled", labels.enabled],
              ["business_hours_only", labels.businessHoursOnly],
              ["emergency_stop_honored", labels.emergencyHonored],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.checked }))}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
        <button
          type="button"
          onClick={() => void saveSettings()}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
        >
          {saved ? labels.saved : labels.saveSettings}
        </button>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.integrationsTitle}</h2>
        {center?.integrations.length ? (
          <ul className="mt-4 space-y-3 text-sm">
            {center.integrations.map((integration) => (
              <li key={integration.id} className="rounded-xl border border-gray-100 p-4">
                <div className="font-medium text-gray-900">{integration.integration_label}</div>
                <p className="mt-1 text-gray-600">
                  {labels.categories[integration.action_category] ?? integration.action_category} ·{" "}
                  {labels.approvalLevels[integration.approval_level] ?? integration.approval_level}
                </p>
                <p className="mt-1 text-gray-500">
                  {integration.access_scope} · {integration.execute_scope}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-gray-500">{labels.noIntegrations}</p>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.auditTitle}</h2>
        {center?.recent_audit.length ? (
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            {center.recent_audit.map((entry) => (
              <li key={entry.id}>
                {entry.summary ?? entry.action_label ?? entry.action_key} ·{" "}
                {new Date(entry.created_at).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-gray-500">{labels.noAudit}</p>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-2 text-sm">
        <Link href="/app/approvals" className="block text-indigo-600 hover:underline">
          {labels.links.approvals}
        </Link>
        <Link href="/app/action-center" className="block text-indigo-600 hover:underline">
          {labels.links.actionCenter}
        </Link>
        <Link href="/app/settings/devices/printers" className="block text-indigo-600 hover:underline">
          {labels.links.printers}
        </Link>
      </section>
    </div>
  );
}
