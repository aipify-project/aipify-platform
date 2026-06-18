"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/shared/AipifyLoader";
import {
  parseProfessionalServicesConsultingClientDeliveryCenter,
  type ProfessionalServicesConsultingClientDeliveryCenter,
} from "@/lib/aipify/professional-services-consulting-client-delivery-pack";

type Props = { labels: Record<string, string> };

export function ProfessionalServicesConsultingClientDeliveryPackDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<ProfessionalServicesConsultingClientDeliveryCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectStatus, setProjectStatus] = useState("planned");

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/professional-services-consulting-client-delivery-pack/dashboard");
    if (res.ok) {
      setCenter(parseProfessionalServicesConsultingClientDeliveryCenter(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.loadFailed);
    }
    setLoading(false);
  }, [labels.loadFailed]);

  useEffect(() => {
    void load();
  }, [load]);

  const createProject = async () => {
    if (!projectName.trim()) return;
    setCreating(true);
    setActionError(null);
    const res = await fetch("/api/aipify/professional-services-consulting-client-delivery-pack/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_project",
        project_name: projectName.trim(),
        project_status: projectStatus,
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.createFailed);
    } else {
      setProjectName("");
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

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.overviewTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{center.philosophy}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [labels.metricClients, overview.clients ?? 0],
            [labels.metricProjects, overview.projects ?? 0],
            [labels.metricConsultants, overview.consultants ?? 0],
            [labels.metricRevenue, overview.revenue ?? 0],
            [labels.metricProfitability, overview.profitability ?? 0],
            [labels.metricUtilization, overview.utilization ?? 0],
            [labels.metricSatisfaction, overview.client_satisfaction ?? 0],
            [labels.metricHealth, overview.services_health_score ?? 0],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg bg-gray-50 p-4">
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
            [labels.openClients, ops.clients_route],
            [labels.openProjects, ops.projects_route],
            [labels.openConsultants, ops.consultants_route],
            [labels.openDelivery, ops.delivery_route],
            [labels.openProfitability, ops.profitability_route],
            [labels.openClientSuccess, ops.client_success_route],
            [labels.openExecutive, center.executive_dashboard?.executive_route as string],
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
        <h2 className="text-lg font-semibold text-gray-900">{labels.projectsTitle}</h2>
        {(center.projects ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noProjects}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {(center.projects ?? []).map((p) => (
              <li key={p.id} className="flex justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm">
                <span className="font-medium text-gray-900">{p.project_name}</span>
                <span className="text-gray-600">
                  {p.project_status} · {p.gross_margin_percent}%
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <input
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder={labels.projectNamePlaceholder}
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <select
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={projectStatus}
            onChange={(e) => setProjectStatus(e.target.value)}
          >
            <option value="planned">{labels.statusPlanned}</option>
            <option value="approved">{labels.statusApproved}</option>
            <option value="in_progress">{labels.statusInProgress}</option>
          </select>
          <button
            type="button"
            disabled={creating}
            onClick={() => void createProject()}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {creating ? labels.creating : labels.addProject}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.clientsTitle}</h2>
        {(center.clients ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noClients}</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            {(center.clients ?? []).slice(0, 10).map((c) => (
              <li key={c.id} className="flex justify-between rounded-lg bg-gray-50 px-3 py-2">
                <span>{c.client_name}</span>
                <span>{c.client_status} · {c.health_score}</span>
              </li>
            ))}
          </ul>
        )}
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

      <p className="text-sm text-gray-500">
        <Link href={center.industry_packs_route ?? "/app/industry-packs"} className="underline">
          {labels.industryPacksLink}
        </Link>
      </p>
    </div>
  );
}
