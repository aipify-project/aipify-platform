"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { parseEmployeeDashboard, type EmployeeDashboard, type EmployeeManagementLabels } from "@/lib/employee-management";

export function EmployeeDashboardPanel({ labels }: { labels: EmployeeManagementLabels }) {
  const [dashboard, setDashboard] = useState<EmployeeDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/employees/me");
    if (res.ok) setDashboard(parseEmployeeDashboard(await res.json()));
    else setDashboard(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (!dashboard?.found) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <Link href="/app/employees" className="text-sm text-indigo-600 hover:underline">← {labels.back}</Link>
        <p className="mt-4 text-gray-600">{dashboard?.error ?? labels.accessDenied}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <Link href="/app/employees" className="text-sm text-indigo-600 hover:underline">← {labels.back}</Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">{labels.myWorkspace}</h1>
        {dashboard.profile?.full_name ? <p className="mt-1 text-gray-600">{dashboard.profile.full_name}{dashboard.profile.job_title ? ` · ${dashboard.profile.job_title}` : ""}</p> : null}
        {dashboard.principle ? <p className="mt-2 text-sm text-violet-800">{dashboard.principle}</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[labels.myTasks, labels.myCalendar, labels.myNotifications].map((title) => (
          <div key={title} className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-semibold text-gray-900">{title}</h2>
            <p className="mt-2 text-sm text-gray-500">—</p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="font-semibold text-gray-900">{labels.assignedModules}</h2>
        {(dashboard.assigned_modules?.length ?? 0) === 0 ? (
          <p className="mt-2 text-sm text-gray-500">No modules assigned yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.assigned_modules?.map((m) => (
              <li key={m.module_key}>
                {m.route_href ? (
                  <Link href={m.route_href} className="text-sm font-medium text-indigo-700 hover:underline">{m.module_name}</Link>
                ) : (
                  <span className="text-sm text-gray-700">{m.module_name}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
