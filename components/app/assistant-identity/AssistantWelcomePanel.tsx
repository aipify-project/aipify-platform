"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseAssistantIdentityBundle,
  parseWelcomeComplete,
  type AssistantIdentityBundle,
} from "@/lib/aipify/assistant-identity";

type AssistantWelcomePanelProps = {
  labels: Record<string, string>;
  focusOptions: Record<string, string>;
  styleOptions: Record<string, string>;
  uncertaintyOptions: Record<string, string>;
  addressModeOptions: Record<string, string>;
};

type Step = 1 | 2 | 3 | 4 | 5 | 6;

export function AssistantWelcomePanel({
  labels,
  focusOptions,
  styleOptions,
  uncertaintyOptions,
  addressModeOptions,
}: AssistantWelcomePanelProps) {
  const [step, setStep] = useState<Step>(1);
  const [bundle, setBundle] = useState<AssistantIdentityBundle | null>(null);
  const [ownerName, setOwnerName] = useState("");
  const [addressMode, setAddressMode] = useState("first_name");
  const [customAddress, setCustomAddress] = useState("");
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [commStyle, setCommStyle] = useState("professional_warm");
  const [uncertainty, setUncertainty] = useState("ask_first");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    await fetch("/api/aipify/assistant-identity/welcome/start", { method: "POST" });
    const res = await fetch("/api/aipify/assistant-identity/profile");
    if (res.ok) {
      const data = parseAssistantIdentityBundle(await res.json());
      setBundle(data);
      if (data.profile?.welcome_completed) setStep(6);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function saveProfile(patch: Record<string, unknown>, next?: Step) {
    setSaving(true);
    await fetch("/api/aipify/assistant-identity/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (next) setStep(next);
    setSaving(false);
  }

  function resolvedAddressName() {
    if (addressMode === "custom") return customAddress || ownerName;
    if (addressMode === "first_name") return ownerName.split(/\s+/)[0] ?? ownerName;
    return ownerName;
  }

  async function finishWelcome() {
    setSaving(true);
    const res = await fetch("/api/aipify/assistant-identity/welcome/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assistant_owner_name: ownerName,
        preferred_address_name: resolvedAddressName(),
        address_name_mode: addressMode,
        preferred_communication_style: commStyle,
        primary_focus_areas: focusAreas,
        uncertainty_handling_preference: uncertainty,
        welcome_step: 6,
      }),
    });
    if (res.ok) {
      const result = parseWelcomeComplete(await res.json());
      setWelcomeMessage(result.welcome_message ?? "");
      setStep(6);
    }
    setSaving(false);
  }

  function toggleFocus(key: string) {
    setFocusAreas((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  if (bundle?.profile?.welcome_completed && step === 6 && !welcomeMessage) {
    return (
      <div className="mx-auto max-w-xl space-y-4 p-6">
        <h1 className="text-2xl font-semibold">{labels.alreadyComplete}</h1>
        <Link href="/app" className="text-sm text-teal-700">{labels.goHome}</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
      </div>

      {step === 1 ? (
        <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-gray-800">{labels.step1Question}</p>
          <input
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            placeholder={labels.namePlaceholder}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <button
            type="button"
            disabled={!ownerName.trim() || saving}
            onClick={() => void saveProfile({ assistant_owner_name: ownerName, welcome_step: 1 }, 2)}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {labels.continue}
          </button>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-gray-800">{labels.step2Question}</p>
          <div className="space-y-2">
            {Object.entries(addressModeOptions).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input type="radio" name="address" checked={addressMode === key} onChange={() => setAddressMode(key)} />
                {label}
              </label>
            ))}
          </div>
          {addressMode === "custom" ? (
            <input
              type="text"
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          ) : null}
          <button type="button" disabled={saving} onClick={() => void saveProfile({ preferred_address_name: resolvedAddressName(), address_name_mode: addressMode, welcome_step: 2 }, 3)} className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white">{labels.continue}</button>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-gray-800">{labels.step3Question}</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(focusOptions).map(([key, label]) => (
              <button key={key} type="button" onClick={() => toggleFocus(key)} className={`rounded-full px-3 py-1 text-xs ${focusAreas.includes(key) ? "bg-teal-600 text-white" : "bg-gray-100"}`}>{label}</button>
            ))}
          </div>
          <button type="button" disabled={saving || focusAreas.length === 0} onClick={() => void saveProfile({ primary_focus_areas: focusAreas, welcome_step: 3 }, 4)} className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-50">{labels.continue}</button>
        </section>
      ) : null}

      {step === 4 ? (
        <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-gray-800">{labels.step4Question}</p>
          <div className="space-y-2">
            {Object.entries(styleOptions).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input type="radio" name="style" checked={commStyle === key} onChange={() => setCommStyle(key)} />
                {label}
              </label>
            ))}
          </div>
          <button type="button" disabled={saving} onClick={() => void saveProfile({ preferred_communication_style: commStyle, welcome_step: 4 }, 5)} className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white">{labels.continue}</button>
        </section>
      ) : null}

      {step === 5 ? (
        <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-gray-800">{labels.step5Question}</p>
          <div className="space-y-2">
            {Object.entries(uncertaintyOptions).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input type="radio" name="uncertainty" checked={uncertainty === key} onChange={() => setUncertainty(key)} />
                {label}
              </label>
            ))}
          </div>
          <button type="button" disabled={saving} onClick={() => void finishWelcome()} className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white">{labels.finish}</button>
        </section>
      ) : null}

      {step === 6 && welcomeMessage ? (
        <section className="space-y-4 rounded-lg border border-teal-100 bg-teal-50/50 p-5">
          <p className="whitespace-pre-line text-gray-800">{welcomeMessage}</p>
          <Link href="/app" className="inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm text-white">{labels.getStarted}</Link>
        </section>
      ) : null}

      <p className="text-xs text-gray-500">{labels.privacy}</p>
    </div>
  );
}
