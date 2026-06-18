"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseEnterpriseDeploymentDeviceRolloutEngineDashboard,
  type EnterpriseDeploymentDeviceRolloutEngineDashboard,
} from "@/lib/aipify/enterprise-deployment-device-rollout-engine";

type Props = { labels: Record<string, string> };

function statusClass(status?: string) {
  switch (status) {
    case "active":
    case "verified":
      return "bg-emerald-100 text-emerald-800";
    case "pending":
    case "draft":
      return "bg-amber-100 text-amber-800";
    case "stale":
    case "failed":
    case "expired":
      return "bg-rose-100 text-rose-800";
    case "revoked":
    case "suspended":
      return "bg-stone-200 text-stone-700";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function EnterpriseDeploymentDeviceRolloutEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] =
    useState<EnterpriseDeploymentDeviceRolloutEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/enterprise-deployment-device-rollout-engine/dashboard");
    if (res.ok) {
      setDashboard(parseEnterpriseDeploymentDeviceRolloutEngineDashboard(await res.json()));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link
          href="/app/enterprise-readiness-engine"
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
        >
          {labels.enterpriseReadiness}
        </Link>
        <Link href="/app/command-center/connect" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.commandCenter}
        </Link>
        <Link
          href="/app/subscription-plan-management-engine"
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
        >
          {labels.subscription}
        </Link>
        <Link href="/app/aipify-install-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.installEngine}
        </Link>
      </div>

      <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.privacy_note ? (
          <p className="mt-2 text-xs text-slate-700">{dashboard.privacy_note}</p>
        ) : null}
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.active_licenses}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.active_licenses ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.active_seats}</p>
          <p className="mt-1 text-2xl font-semibold">
            {String(summary.active_seats ?? 0)} / {String(summary.total_seats ?? 0)}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.registered_devices}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.registered_devices ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.stale_or_failed_devices}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.stale_or_failed_devices ?? 0)}</p>
        </div>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.licenses}</h3>
        {(dashboard.licenses ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.licenses.map((item, idx) => (
              <li key={String(item.id ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span>{String(item.license_type ?? "enterprise")}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusClass(item.status as string)}`}>
                    {String(item.status ?? "active")}
                  </span>
                  <span className="text-xs text-gray-500">
                    {String(item.active_seats ?? 0)} / {String(item.seat_limit ?? 0)} {labels.seats}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.devices}</h3>
        {(dashboard.devices ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.devices.map((item, idx) => (
              <li key={String(item.id ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span>{String(item.device_name ?? "Device")}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusClass(item.status as string)}`}>
                    {String(item.status ?? "pending")}
                  </span>
                  <span className="text-xs text-gray-500">
                    {String(item.os ?? "")} · {String(item.enrollment_method ?? "")}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.enrollmentTokens}</h3>
        {(dashboard.enrollment_tokens ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.enrollment_tokens.map((item, idx) => (
              <li key={String(item.id ?? idx)} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                {String(item.token_name ?? "Token")} · {String(item.used_count ?? 0)} /{" "}
                {String(item.max_uses ?? 0)} ·{" "}
                <span className={`rounded-full px-2 py-0.5 text-xs ${statusClass(item.status as string)}`}>
                  {String(item.status ?? "active")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.staleEnrollments}</h3>
        {(dashboard.stale_enrollments ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noItems}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.stale_enrollments.map((item, idx) => (
              <li
                key={String(item.id ?? idx)}
                className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm"
              >
                {String(item.device_name ?? "Device")} · {String(item.status ?? "")}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.domainsAndSso}</h3>
          <p className="mt-2 text-sm text-gray-600">
            {labels.verified_domains}: {String(summary.verified_domains ?? 0)} · {labels.sso_ready}:{" "}
            {String(summary.sso_providers_ready ?? 0)}
          </p>
          {(dashboard.domains ?? []).length > 0 ? (
            <ul className="mt-3 space-y-1 text-sm text-gray-600">
              {dashboard.domains.map((d, idx) => (
                <li key={String(d.id ?? idx)}>
                  {String(d.domain ?? "")} · {String(d.verification_status ?? "pending")}
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.scimReadiness}</h3>
          <p className="mt-2 text-sm text-gray-600">
            {labels.scimStatus}:{" "}
            {String(
              (dashboard.scim_readiness as Record<string, unknown> | undefined)?.readiness_status ??
                "not_configured"
            )}
          </p>
          <p className="mt-1 text-xs text-gray-500">{labels.scimScaffoldNote}</p>
        </section>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-900">{labels.installerDownloads}</h3>
        <p className="mt-2 text-sm text-gray-600">{labels.installerPending}</p>
      </section>

      {dashboard.principles?.length ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
            {dashboard.principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
