"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseAutomationSettings, type AutomationSettings } from "@/lib/aipify/adaptive-automation";

type AutomationSettingsPanelProps = {
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
    fields: Record<string, string>;
    centerLink: string;
  };
};

export function AutomationSettingsPanel({ labels }: AutomationSettingsPanelProps) {
  const [settings, setSettings] = useState<AutomationSettings | null>(null);
  const [hasAccess, setHasAccess] = useState(true);
  const [upgradeRequired, setUpgradeRequired] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/aipify/automation/settings");
    if (res.ok) {
      const parsed = parseAutomationSettings(await res.json());
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
    await fetch("/api/aipify/automation/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
    void load();
  }

  function patch<K extends keyof AutomationSettings>(key: K, value: AutomationSettings[K]) {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

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

  const toggles: { key: keyof AutomationSettings; label: string }[] = [
    { key: "enabled", label: labels.fields.enable },
    { key: "allow_automation_discovery", label: labels.fields.discovery },
    { key: "allow_ai_generated_drafts", label: labels.fields.aiDrafts },
    { key: "allow_low_risk_auto_execution", label: labels.fields.lowRiskExecution },
    { key: "require_approval_for_medium_risk", label: labels.fields.mediumApproval },
    { key: "require_approval_for_high_risk", label: labels.fields.highApproval },
    { key: "enable_value_estimation", label: labels.fields.valueEstimation },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <Link href="/app/settings" className="text-sm text-indigo-600 hover:underline">{labels.back}</Link>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.description}</p>
        <p className="mt-2 text-sm text-gray-500">{labels.privacy}</p>
      </div>
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        {toggles.map(({ key, label }) => (
          <label key={key} className="flex items-center justify-between gap-4 text-sm">
            <span>{label}</span>
            <input type="checkbox" checked={Boolean(settings[key])} onChange={(e) => patch(key, e.target.checked as AutomationSettings[typeof key])} className="h-4 w-4" />
          </label>
        ))}
        <label className="block text-sm">
          <span>{labels.fields.maxDaily}</span>
          <input type="number" min={1} max={500} value={settings.max_daily_executions} onChange={(e) => patch("max_daily_executions", Number(e.target.value))} className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span>{labels.fields.maxMessages}</span>
          <input type="number" min={0} max={100} value={settings.max_external_messages_per_day} onChange={(e) => patch("max_external_messages_per_day", Number(e.target.value))} className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2" />
        </label>
      </section>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => void save()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white">{labels.save}</button>
        {saved ? <span className="text-sm text-emerald-600">{labels.saved}</span> : null}
      </div>
      <Link href="/app/automations" className="text-sm text-indigo-600 hover:underline">{labels.centerLink}</Link>
    </div>
  );
}
