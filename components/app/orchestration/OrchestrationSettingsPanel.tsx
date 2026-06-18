"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { useCallback, useEffect, useState } from "react";
import { parseOrchestrationSettings, type OrchestrationSettings } from "@/lib/aipify/orchestration";

type OrchestrationSettingsPanelProps = {
  labels: Record<string, string>;
};

export function OrchestrationSettingsPanel({ labels }: OrchestrationSettingsPanelProps) {
  const [settings, setSettings] = useState<OrchestrationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/orchestration/settings");
    if (res.ok) {
      const data = await res.json();
      setSettings(parseOrchestrationSettings({ has_customer: true, settings: data.settings }));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async (patch: Partial<OrchestrationSettings>) => {
    if (!settings) return;
    setSaving(true);
    const res = await fetch("/api/aipify/orchestration/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      const data = await res.json();
      setSettings(parseOrchestrationSettings({ has_customer: true, settings: data.settings }));
    }
    setSaving(false);
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!settings) return null;

  const toggles: { key: keyof OrchestrationSettings; label: string }[] = [
    { key: "enabled", label: labels.enabled },
    { key: "auto_route_events", label: labels.autoRoute },
    { key: "require_policy_engine", label: labels.requirePolicy },
    { key: "suppress_duplicate_events", label: labels.suppressDuplicates },
    { key: "notify_on_critical", label: labels.notifyCritical },
  ];

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {toggles.map(({ key, label }) => (
          <li key={key} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
            <span>{label}</span>
            <button
              type="button"
              disabled={saving}
              onClick={() => void save({ [key]: !settings[key] })}
              className={`rounded px-3 py-1 text-xs font-medium ${settings[key] ? "bg-indigo-100 text-indigo-800" : "bg-gray-100 text-gray-600"}`}
            >
              {settings[key] ? labels.on : labels.off}
            </button>
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-500">{labels.safetyNote}</p>
    </div>
  );
}
