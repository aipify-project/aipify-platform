"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseTenantIndustryProfileResponse } from "@/lib/aipify/industry-blueprints";

type IndustryBlueprintsSettingsPanelProps = {
  labels: Record<string, string>;
};

const GOALS = ["support", "administration", "quality", "automations", "knowledge", "compliance", "follow_up", "everything"];
const SIZES = ["solo", "small", "medium", "enterprise"];

export function IndustryBlueprintsSettingsPanel({ labels }: IndustryBlueprintsSettingsPanelProps) {
  const [profile, setProfile] = useState<ReturnType<typeof parseTenantIndustryProfileResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/industry-profile");
    if (res.ok) setProfile(parseTenantIndustryProfileResponse(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(patch: Record<string, unknown>) {
    setSaving(true);
    await fetch("/api/aipify/industry-profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    await load();
    setSaving(false);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  const p = profile?.profile;

  return (
    <div className="space-y-6">
      <Link href="/app/industry-blueprints" className="text-sm text-teal-600 hover:underline">{labels.back}</Link>

      <section className="rounded-lg border border-gray-200 p-4">
        <h2 className="text-sm font-semibold">{labels.currentBlueprint}</h2>
        <p className="mt-2 text-sm text-gray-700">
          {profile?.blueprint?.title ?? labels.noBlueprintSelected}
        </p>
      </section>

      <section className="space-y-3">
        <label className="block text-sm font-medium">{labels.businessSize}</label>
        <select
          className="rounded border border-gray-300 px-3 py-2 text-sm"
          value={p?.business_size ?? ""}
          onChange={(e) => void save({ business_size: e.target.value })}
          disabled={saving}
        >
          <option value="">{labels.selectSize}</option>
          {SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </section>

      <section className="space-y-2">
        <p className="text-sm font-medium">{labels.primaryGoals}</p>
        <div className="flex flex-wrap gap-2">
          {GOALS.map((goal) => {
            const selected = p?.primary_goals?.includes(goal);
            return (
              <button
                key={goal}
                type="button"
                disabled={saving}
                onClick={() => {
                  const goals = p?.primary_goals ?? [];
                  const next = selected ? goals.filter((g) => g !== goal) : [...goals, goal];
                  void save({ primary_goals: next });
                }}
                className={`rounded-full px-3 py-1 text-xs capitalize ${
                  selected ? "bg-teal-600 text-white" : "border border-gray-300 text-gray-600"
                }`}
              >
                {goal.replace(/_/g, " ")}
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={p?.auto_recommend_packs ?? true}
            onChange={(e) => void save({ auto_recommend_packs: e.target.checked })}
            disabled={saving}
          />
          {labels.autoRecommendPacks}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={p?.notify_new_packs ?? true}
            onChange={(e) => void save({ notify_new_packs: e.target.checked })}
            disabled={saving}
          />
          {labels.notifyNewPacks}
        </label>
      </section>
    </div>
  );
}
