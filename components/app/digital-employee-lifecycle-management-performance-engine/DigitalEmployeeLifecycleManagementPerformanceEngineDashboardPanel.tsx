"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/shared/AipifyLoader";
import {
  parseDigitalEmployeeLifecycleManagementCenter,
  type DigitalEmployeeLifecycleManagementCenter,
} from "@/lib/aipify/digital-employee-lifecycle-management-performance-engine";

type Props = { labels: Record<string, string> };

export function DigitalEmployeeLifecycleManagementPerformanceEngineDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<DigitalEmployeeLifecycleManagementCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeRole, setEmployeeRole] = useState("support_specialist");

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/digital-employee-lifecycle-management-performance-engine/dashboard");
    if (res.ok) {
      setCenter(parseDigitalEmployeeLifecycleManagementCenter(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.loadFailed);
    }
    setLoading(false);
  }, [labels.loadFailed]);

  useEffect(() => {
    void load();
  }, [load]);

  const createEmployee = async () => {
    if (!employeeName.trim()) return;
    setCreating(true);
    setActionError(null);
    const res = await fetch("/api/aipify/digital-employee-lifecycle-management-performance-engine/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_employee",
        employee_name: employeeName.trim(),
        employee_role: employeeRole,
        employee_status: "provisioning",
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.createFailed);
    } else {
      setEmployeeName("");
      await load();
    }
    setCreating(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found || !center.has_access) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <p className="font-medium">{labels.accessRequiredTitle}</p>
        <p className="mt-2 text-sm">{center?.error ?? labels.accessRequiredBody}</p>
      </div>
    );
  }

  const overview = center.overview ?? {};
  const ops = center.operations ?? {};

  return (
    <div className="space-y-6">
      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</div>
      ) : null}

      <section className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.overviewTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{center.philosophy}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [labels.metricActiveEmployees, overview.active_employees ?? 0],
            [labels.metricDepartments, overview.departments ?? 0],
            [labels.metricAssignedTasks, overview.assigned_tasks ?? 0],
            [labels.metricCompletedTasks, overview.completed_tasks ?? 0],
            [labels.metricPerformance, overview.performance_score ?? 0],
            [labels.metricTrainingCoverage, `${overview.training_coverage ?? 0}%`],
            [labels.metricHealth, overview.employee_health_score ?? 0],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-white bg-white/80 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.operationsTitle}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            [labels.openDirectory, ops.directory_route],
            [labels.openRoles, ops.roles_route],
            [labels.openPerformance, ops.performance_route],
            [labels.openTraining, ops.training_route],
            [labels.openLifecycle, ops.lifecycle_route],
            [labels.openGovernance, ops.governance_route],
            [labels.openAnalytics, ops.analytics_route],
            [labels.openOrchestration, ops.orchestration_route],
          ].map(([label, href]) =>
            href ? (
              <Link
                key={String(label)}
                href={href}
                className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400"
              >
                {label}
              </Link>
            ) : null
          )}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.directoryTitle}</h2>
        {(center.employees ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noEmployees}</p>
        ) : (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {(center.employees ?? []).map((emp) => (
              <li key={emp.id} className="rounded-lg bg-gray-50 px-4 py-3 text-sm">
                <p className="font-medium text-gray-900">{emp.employee_name}</p>
                <p className="text-gray-600">
                  {emp.department} · {emp.employee_role} · {emp.employee_status}
                </p>
                <p className="text-gray-500">
                  {labels.performanceLabel}: {emp.performance_score} · {labels.healthLabel}: {emp.health_score}
                </p>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <input
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder={labels.employeeNamePlaceholder}
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
          />
          <select
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={employeeRole}
            onChange={(e) => setEmployeeRole(e.target.value)}
          >
            <option value="support_specialist">{labels.roleSupport}</option>
            <option value="operations_specialist">{labels.roleOperations}</option>
            <option value="compliance_specialist">{labels.roleCompliance}</option>
            <option value="executive_assistant">{labels.roleExecutive}</option>
            <option value="custom">{labels.roleCustom}</option>
          </select>
          <button
            type="button"
            disabled={creating}
            onClick={() => void createEmployee()}
            className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {creating ? labels.creating : labels.addEmployee}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.advisorTitle}</h2>
        <div className="mt-4 space-y-4">
          {(center.advisor_signals ?? []).map((sig) => (
            <article key={sig.id} className="rounded-lg bg-gray-50 p-4">
              <p className="font-medium text-gray-900">{sig.observation}</p>
              {sig.recommendation ? (
                <p className="mt-2 text-sm font-medium text-gray-800">
                  {labels.recommendation}: {sig.recommendation}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-500">{center.abos_principle}</p>
    </div>
  );
}
