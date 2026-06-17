"use client";

import { useState } from "react";

type Props = {
  labels: Record<string, string>;
  onComplete: () => void;
};

export function DesktopCompanionFirstRunPanel({ labels, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [locale, setLocale] = useState("en");
  const [timezone, setTimezone] = useState("Europe/Oslo");
  const [style, setStyle] = useState("balanced");
  const [busy, setBusy] = useState(false);

  async function finish() {
    setBusy(true);
    await fetch("/api/aipify/desktop/foundation/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile: {
          locale,
          timezone,
          companion_style: style,
          first_run_intro_seen: true,
          first_run_complete: true,
        },
      }),
    });
    setBusy(false);
    onComplete();
  }

  if (step === 0) {
    return (
      <div className="mx-auto max-w-lg space-y-4 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold">{labels.firstRunTitle}</h1>
        <p className="whitespace-pre-line text-sm text-gray-700">{labels.firstRunIntro}</p>
        <button
          type="button"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
          onClick={() => setStep(1)}
        >
          {labels.firstRunContinue}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-4 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="text-lg font-semibold">{labels.completeSetup}</h2>
      <label className="block text-sm">
        <span className="text-gray-600">{labels.firstRunLanguage}</span>
        <select
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
        >
          <option value="en">English</option>
          <option value="no">Norsk</option>
          <option value="sv">Svenska</option>
          <option value="da">Dansk</option>
        </select>
      </label>
      <label className="block text-sm">
        <span className="text-gray-600">{labels.firstRunTimezone}</span>
        <input
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="text-gray-600">{labels.firstRunStyle}</span>
        <select
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
        >
          <option value="calm">Calm</option>
          <option value="balanced">Balanced</option>
          <option value="proactive">Proactive</option>
        </select>
      </label>
      <p className="text-xs text-gray-500">{labels.permissionsNote}</p>
      <button
        type="button"
        disabled={busy}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        onClick={() => void finish()}
      >
        {labels.firstRunFinish}
      </button>
    </div>
  );
}
