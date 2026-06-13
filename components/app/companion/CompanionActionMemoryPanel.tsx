"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ACTION_MEMORY_CORE_PRINCIPLE,
  ACTION_MEMORY_PHILOSOPHY,
  ACTION_MEMORY_VISION,
  parseCompanionActionMemoryCenter,
  type CompanionActionMemoryCenter,
} from "@/lib/companion-action-memory";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  visionTitle: string;
  preferencesTitle: string;
  recentTitle: string;
  suggestionsTitle: string;
  validationsTitle: string;
  settingsTitle: string;
  memoryEnabled: string;
  accept: string;
  reject: string;
  confirm: string;
  delete: string;
  dismiss: string;
  resetMemory: string;
  saveSettings: string;
  confidence: string;
  lastUsed: string;
  privacyNote: string;
  actionMarketplaceLink: string;
  assistantMemoryLink: string;
  approvalsLink: string;
  categories: Record<string, string>;
  confidenceLevels: Record<string, string>;
};

type CompanionActionMemoryPanelProps = {
  labels: PanelLabels;
};

function confidenceBadge(level: string) {
  switch (level) {
    case "strong":
      return "bg-emerald-100 text-emerald-800";
    case "established":
      return "bg-sky-100 text-sky-800";
    case "emerging":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function CompanionActionMemoryPanel({ labels }: CompanionActionMemoryPanelProps) {
  const [center, setCenter] = useState<CompanionActionMemoryCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [memoryEnabled, setMemoryEnabled] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/companion-action-memory/center");
    if (res.ok) {
      const parsed = parseCompanionActionMemoryCenter(await res.json());
      setCenter(parsed);
      if (parsed.settings) setMemoryEnabled(parsed.settings.memory_enabled);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/companion-action-memory/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  if (loading) return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.companion_action_marketplace && (
          <Link href={center.links.companion_action_marketplace} className="text-fuchsia-600 hover:underline">
            {labels.actionMarketplaceLink}
          </Link>
        )}
        {center?.links?.assistant_memory && (
          <Link href={center.links.assistant_memory} className="text-fuchsia-600 hover:underline">
            {labels.assistantMemoryLink}
          </Link>
        )}
        {center?.links?.approvals && (
          <Link href={center.links.approvals} className="text-fuchsia-600 hover:underline">
            {labels.approvalsLink}
          </Link>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-fuchsia-100 bg-fuchsia-50 px-4 py-3 text-sm text-fuchsia-900">
          {labels.corePrinciple}: {ACTION_MEMORY_CORE_PRINCIPLE}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {labels.philosophyTitle}: {ACTION_MEMORY_PHILOSOPHY}
        </p>
        <p className="mt-1 text-sm text-gray-600">
          {labels.visionTitle}: {ACTION_MEMORY_VISION}
        </p>
        {center?.privacy_note && (
          <p className="mt-2 text-sm text-gray-500">
            {labels.privacyNote}: {center.privacy_note}
          </p>
        )}
      </div>

      {center && center.validations.length > 0 && (
        <section className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5">
          <h2 className="font-semibold text-amber-900">{labels.validationsTitle}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {center.validations.map((validation) => (
              <li key={validation.validation_key} className="rounded-xl border border-amber-100 bg-white p-4">
                <p className="text-gray-800">{validation.message}</p>
                {center.can_record && (
                  <button
                    type="button"
                    onClick={() =>
                      void postAction({
                        action: "record",
                        validation_key: validation.validation_key,
                        decision: "dismiss",
                      })
                    }
                    className="mt-2 text-xs text-gray-600 hover:underline"
                  >
                    {labels.dismiss}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {center && center.suggestions.length > 0 && (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold text-indigo-900">{labels.suggestionsTitle}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {center.suggestions.map((suggestion) => (
              <li key={suggestion.suggestion_key} className="rounded-xl border border-indigo-100 bg-white p-4">
                <p className="text-gray-800">{suggestion.message}</p>
                {center.can_record && suggestion.status === "pending" && (
                  <div className="mt-2 flex gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() =>
                        void postAction({
                          action: "record",
                          suggestion_key: suggestion.suggestion_key,
                          memory_key: suggestion.memory_key,
                          decision: "accept",
                        })
                      }
                      className="text-indigo-700 hover:underline"
                    >
                      {labels.accept}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        void postAction({
                          action: "record",
                          suggestion_key: suggestion.suggestion_key,
                          decision: "reject",
                        })
                      }
                      className="text-gray-600 hover:underline"
                    >
                      {labels.reject}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {center && center.remembered_preferences.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.preferencesTitle}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {center.remembered_preferences.map((pref) => (
              <li key={pref.memory_key} className="rounded-xl border border-gray-100 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{pref.description}</span>
                  <span className={`rounded px-2 py-0.5 text-xs ${confidenceBadge(pref.confidence_level)}`}>
                    {labels.confidenceLevels[pref.confidence_level] ?? pref.confidence_level}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {labels.categories[pref.category] ?? pref.category}
                  {pref.last_used_at && (
                    <span>
                      {" "}
                      · {labels.lastUsed}: {pref.last_used_at}
                    </span>
                  )}
                </p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs">
                  {center.can_record && !pref.user_confirmed && (
                    <button
                      type="button"
                      onClick={() =>
                        void postAction({ action: "confirm", memory_key: pref.memory_key, confirmed: true })
                      }
                      className="text-fuchsia-700 hover:underline"
                    >
                      {labels.confirm}
                    </button>
                  )}
                  {center.can_delete && (
                    <button
                      type="button"
                      onClick={() =>
                        void postAction({
                          action: "record",
                          memory_key: pref.memory_key,
                          decision: "delete",
                        })
                      }
                      className="text-gray-600 hover:underline"
                    >
                      {labels.delete}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {center && center.recent_patterns.length > 0 && (
        <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5">
          <h2 className="font-semibold text-violet-900">{labels.recentTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {center.recent_patterns.map((pref) => (
              <li key={`recent-${pref.memory_key}`} className="text-violet-950">
                {pref.description}
              </li>
            ))}
          </ul>
        </section>
      )}

      {center?.can_manage && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm text-sm">
          <h2 className="font-semibold text-gray-900">{labels.settingsTitle}</h2>
          <label className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={memoryEnabled}
              onChange={(e) => setMemoryEnabled(e.target.checked)}
            />
            <span>{labels.memoryEnabled}</span>
          </label>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                void postAction({ action: "update_settings", memory_enabled: memoryEnabled })
              }
              className="rounded-lg bg-fuchsia-700 px-4 py-2 text-sm font-medium text-white hover:bg-fuchsia-800"
            >
              {labels.saveSettings}
            </button>
            {center.can_delete && (
              <button
                type="button"
                onClick={() => void postAction({ action: "reset" })}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {labels.resetMemory}
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
