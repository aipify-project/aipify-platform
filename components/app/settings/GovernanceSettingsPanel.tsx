"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  GOVERNANCE_MODES,
  parseGovernanceSettings,
  type GovernanceMode,
  type GovernanceSettings,
} from "@/lib/aipify/governance";

type GovernanceSettingsPanelProps = {
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
    centerLink: string;
    modes: Record<string, string>;
    fields: Record<string, string>;
  };
};

export function GovernanceSettingsPanel({ labels }: GovernanceSettingsPanelProps) {
  const [settings, setSettings] = useState<GovernanceSettings | null>(null);
  const [hasAccess, setHasAccess] = useState(true);
  const [upgradeRequired, setUpgradeRequired] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/aipify/governance/settings");
    if (res.ok) {
      const parsed = parseGovernanceSettings(await res.json());
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
    await fetch("/api/aipify/governance/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
    void load();
  }

  function patch<K extends keyof GovernanceSettings>(key: K, value: GovernanceSettings[K]) {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  }

  if (loading) return <p className="text-sm text-gray-500">{labels.loading}</p>;

  if (upgradeRequired || !hasAccess) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 p-6">
        <Link href="/app/settings" className="text-sm text-indigo-600 hover:underline">{labels.back}</Link>
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium">{labels.upgradeTitle}</h2>
          <p className="mt-2 text-sm text-gray-600">{labels.upgradeBody}</p>
          <Link href="/app/settings/billing" className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white">{labels.upgradeCta}</Link>
        </div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <Link href="/app/settings" className="text-sm text-indigo-600 hover:underline">{labels.back}</Link>
      <h1 className="text-2xl font-semibold">{labels.title}</h1>
      <p className="text-sm text-gray-600">{labels.description}</p>
      <p className="text-xs text-gray-500">{labels.privacy}</p>
      <Link href="/app/governance" className="block text-sm text-indigo-600 hover:underline">{labels.centerLink}</Link>

      <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
        <label className="block text-sm">
          <span className="font-medium">{labels.fields.mode}</span>
          <select
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={settings.governance_mode}
            onChange={(e) => patch("governance_mode", e.target.value as GovernanceMode)}
          >
            {GOVERNANCE_MODES.map((mode) => (
              <option key={mode} value={mode}>{labels.modes[mode] ?? mode}</option>
            ))}
          </select>
        </label>

        {[
          ["emergency_controls_enabled", labels.fields.emergency],
          ["explainability_enabled", labels.fields.explainability],
          ["trust_scoring_enabled", labels.fields.trustScoring],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings[key as keyof GovernanceSettings] as boolean}
              onChange={(e) => patch(key as keyof GovernanceSettings, e.target.checked as GovernanceSettings[keyof GovernanceSettings])}
            />
            <span>{label}</span>
          </label>
        ))}

        <label className="block text-sm">
          <span className="font-medium">{labels.fields.retention}</span>
          <input
            type="number"
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={settings.audit_retention_days}
            onChange={(e) => patch("audit_retention_days", Number(e.target.value))}
          />
        </label>

        <button type="button" onClick={() => void save()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white">
          {saved ? labels.saved : labels.save}
        </button>
      </div>
    </div>
  );
}
