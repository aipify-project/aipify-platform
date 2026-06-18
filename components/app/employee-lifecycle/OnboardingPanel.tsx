"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { parseOnboardingCenter, type EmployeeLifecycleLabels, type OnboardingCenter } from "@/lib/employee-lifecycle";

export function OnboardingPanel({ labels }: { labels: EmployeeLifecycleLabels }) {
  const [center, setCenter] = useState<OnboardingCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/employee-lifecycle/onboarding");
    if (res.ok) setCenter(parseOnboardingCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function completeStep(stepId: string) {
    setBusy(true);
    await fetch("/api/app/employee-lifecycle/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type: "complete_onboarding_step", payload: { step_id: stepId } }),
    });
    setBusy(false);
    await load();
  }

  if (loading && !center) return <div className="flex min-h-[320px] items-center justify-center"><AipifyLoader centered /></div>;
  if (!center?.found) return <div className="mx-auto max-w-3xl p-6"><p className="font-medium text-amber-900">{labels.accessDenied}</p></div>;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div>
        <Link href="/app/employees" className="text-sm text-indigo-600 hover:underline">{labels.backToEmployees}</Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">{labels.onboardingTitle}</h1>
        {center.principle ? <p className="mt-2 text-sm text-gray-600">{center.principle}</p> : null}
      </div>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">{labels.templates}</h2>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          {(center.templates ?? []).map((t, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
              <p className="font-semibold text-gray-900">{String(t.name ?? "")}</p>
              <p className="text-gray-500">{String(t.description ?? "")}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">{labels.onboarding}</h2>
        <div className="mt-3 space-y-3">
          {(center.runs ?? []).map((run, i) => (
            <div key={i} className="rounded-xl border border-sky-100 bg-white p-4 text-sm">
              <p className="font-medium text-gray-900">{String(run.employee_name ?? "")}</p>
              <p className="text-gray-500">{String(run.status ?? "")} · {String(run.progress_percent ?? 0)}%</p>
              <ul className="mt-2 space-y-1">
                {Array.isArray(run.steps) ? (run.steps as Record<string, unknown>[]).map((s) => (
                  <li key={String(s.id)} className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2">
                    <span>{String(s.title ?? "")} · {String(s.status ?? "")}</span>
                    {s.status === "pending" ? (
                      <button type="button" disabled={busy} onClick={() => void completeStep(String(s.id))} className="text-xs text-indigo-700 hover:underline">{labels.completeStep}</button>
                    ) : null}
                  </li>
                )) : null}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
