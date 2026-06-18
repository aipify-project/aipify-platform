"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { parseOffboardingCenter, type EmployeeLifecycleLabels, type OffboardingCenter } from "@/lib/employee-lifecycle";

export function OffboardingPanel({ labels }: { labels: EmployeeLifecycleLabels }) {
  const [center, setCenter] = useState<OffboardingCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/employee-lifecycle/offboarding");
    if (res.ok) setCenter(parseOffboardingCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function completeItem(itemId: string) {
    setBusy(true);
    await fetch("/api/app/employee-lifecycle/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type: "complete_offboarding_item", payload: { checklist_item_id: itemId } }),
    });
    setBusy(false);
    await load();
  }

  async function finishRun(runId: string) {
    setBusy(true);
    await fetch("/api/app/employee-lifecycle/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type: "complete_offboarding", payload: { offboarding_run_id: runId } }),
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
        <h1 className="mt-2 text-2xl font-bold text-gray-900">{labels.offboardingTitle}</h1>
        {center.principle ? <p className="mt-2 text-sm text-gray-600">{center.principle}</p> : null}
      </div>

      <div className="space-y-4">
        {(center.runs ?? []).map((run, i) => (
          <div key={i} className="rounded-xl border border-amber-100 bg-white p-4 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-900">{String(run.employee_name ?? "")}</p>
                <p className="text-gray-500">{String(run.status ?? "")} · {String(run.progress_percent ?? 0)}% · departure {String(run.departure_date ?? "—")}</p>
              </div>
              {run.status !== "completed" ? (
                <button type="button" disabled={busy} onClick={() => void finishRun(String(run.run_id))} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white">{labels.completeOffboarding}</button>
              ) : null}
            </div>
            <h3 className="mt-3 font-medium text-gray-900">{labels.checklist}</h3>
            <ul className="mt-2 space-y-1">
              {Array.isArray(run.checklist) ? (run.checklist as Record<string, unknown>[]).map((c) => (
                <li key={String(c.id)} className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2">
                  <span>{String(c.title ?? "")} · {String(c.status ?? "")}</span>
                  {c.status === "pending" ? (
                    <button type="button" disabled={busy} onClick={() => void completeItem(String(c.id))} className="text-xs text-indigo-700 hover:underline">{labels.completeStep}</button>
                  ) : null}
                </li>
              )) : null}
            </ul>
            {Array.isArray(run.assets) && (run.assets as unknown[]).length > 0 ? (
              <p className="mt-2 text-gray-500">{labels.assetsAssigned}: {(run.assets as Record<string, unknown>[]).map((a) => String(a.name)).join(", ")}</p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
