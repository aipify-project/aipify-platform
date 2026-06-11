"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parsePredictionSettings,
  type PredictionSettings,
} from "@/lib/aipify/predictive-intelligence";

type PredictionSettingsPanelProps = {
  labels: {
    title: string;
    description: string;
    privacy: string;
    loading: string;
    back: string;
    save: string;
    saved: string;
    upgradeTitle: string;
    upgradeBody: string;
    upgradeCta: string;
    modelsTitle: string;
    fields: {
      enable: string;
      bottlenecks: string;
      churn: string;
      workload: string;
      growth: string;
      followup: string;
      sla: string;
      approval: string;
      horizon: string;
    };
    predictionsLink: string;
  };
};

export function PredictionSettingsPanel({ labels }: PredictionSettingsPanelProps) {
  const [settings, setSettings] = useState<PredictionSettings | null>(null);
  const [hasAccess, setHasAccess] = useState(true);
  const [upgradeRequired, setUpgradeRequired] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/aipify/predictions/settings");
    if (res.ok) {
      const parsed = parsePredictionSettings(await res.json());
      setHasAccess(parsed.has_access);
      setUpgradeRequired(parsed.upgrade_required);
      setSettings(parsed.settings);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    if (!settings) return;
    await fetch("/api/aipify/predictions/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
    void load();
  }

  function patch<K extends keyof PredictionSettings>(key: K, value: PredictionSettings[K]) {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  }

  if (loading) return <p className="text-sm text-gray-500">{labels.loading}</p>;

  if (upgradeRequired || !hasAccess) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 p-6">
        <Link href="/app/settings" className="text-sm text-indigo-600 hover:underline">
          {labels.back}
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900">{labels.upgradeTitle}</h2>
          <p className="mt-2 text-sm text-gray-600">{labels.upgradeBody}</p>
          <Link
            href="/app/settings/billing"
            className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {labels.upgradeCta}
          </Link>
        </div>
      </div>
    );
  }

  if (!settings) return null;

  const toggles: { key: keyof PredictionSettings; label: string }[] = [
    { key: "enabled", label: labels.fields.enable },
    { key: "allow_bottleneck_predictions", label: labels.fields.bottlenecks },
    { key: "allow_sla_predictions", label: labels.fields.sla },
    { key: "allow_followup_predictions", label: labels.fields.followup },
    { key: "allow_churn_predictions", label: labels.fields.churn },
    { key: "allow_growth_predictions", label: labels.fields.growth },
    { key: "allow_workload_predictions", label: labels.fields.workload },
    { key: "require_admin_approval_for_actions", label: labels.fields.approval },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <Link href="/app/settings" className="text-sm text-indigo-600 hover:underline">
        {labels.back}
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.description}</p>
        <p className="mt-2 text-sm text-gray-500">{labels.privacy}</p>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        {toggles.map(({ key, label }) => (
          <label key={key} className="flex items-center justify-between gap-4 text-sm">
            <span className="text-gray-800">{label}</span>
            <input
              type="checkbox"
              checked={Boolean(settings[key])}
              onChange={(e) => patch(key, e.target.checked as PredictionSettings[typeof key])}
              className="h-4 w-4 rounded border-gray-300"
            />
          </label>
        ))}

        <label className="block text-sm">
          <span className="text-gray-800">{labels.fields.horizon}</span>
          <input
            type="number"
            min={7}
            max={90}
            value={settings.prediction_horizon_days}
            onChange={(e) => patch("prediction_horizon_days", Number(e.target.value))}
            className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2"
          />
        </label>
      </section>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => void save()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {labels.save}
        </button>
        {saved ? <span className="text-sm text-emerald-600">{labels.saved}</span> : null}
      </div>

      <Link href="/app/predictions" className="text-sm text-indigo-600 hover:underline">
        {labels.predictionsLink}
      </Link>
    </div>
  );
}
