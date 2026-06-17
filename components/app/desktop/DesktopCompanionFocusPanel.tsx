"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { parseDesktopCompanionProfile } from "@/lib/desktop-companion-foundation";

type Props = {
  labels: Record<string, string>;
};

export function DesktopCompanionFocusPanel({ labels }: Props) {
  const [profile, setProfile] = useState<ReturnType<typeof parseDesktopCompanionProfile> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/desktop/foundation/preferences");
    if (res.ok) setProfile(parseDesktopCompanionProfile(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function toggleFocus(active: boolean) {
    setBusy(true);
    await fetch("/api/aipify/desktop/foundation/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ focus: { active } }),
    });
    await load();
    setBusy(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  const state = profile?.state;
  const active = state?.focus_mode_active;

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold">{labels.focusTitle}</h1>
      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-gray-500">{labels.focusPriority}</dt>
          <dd>{state?.focus_priority || "—"}</dd>
        </div>
        <div>
          <dt className="text-gray-500">{labels.focusActiveTask}</dt>
          <dd>{state?.focus_task_id || "—"}</dd>
        </div>
        <div>
          <dt className="text-gray-500">{labels.focusTimeEstimate}</dt>
          <dd>{state?.focus_time_estimate_minutes ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-gray-500">{labels.focusSuggestedNext}</dt>
          <dd>{state?.focus_suggested_next || "—"}</dd>
        </div>
      </dl>
      <button
        type="button"
        disabled={busy}
        className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
        onClick={() => void toggleFocus(!active)}
      >
        {active ? labels.focusEnd : labels.focusStart}
      </button>
    </section>
  );
}
