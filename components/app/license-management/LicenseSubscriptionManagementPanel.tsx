"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseLicenseSubscriptionCenter,
  type LicenseManagementLabels,
  type LicenseSubscriptionCenter,
} from "@/lib/license-management";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";

function statusBadge(status: string | undefined, labels: LicenseManagementLabels) {
  const map: Record<string, { label: string; className: string }> = {
    active: { label: labels.active, className: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
    trial: { label: labels.trial, className: "bg-sky-50 text-sky-800 ring-sky-200" },
    grace_period: { label: labels.gracePeriod, className: "bg-amber-50 text-amber-900 ring-amber-200" },
    suspended: { label: labels.suspended, className: "bg-red-50 text-red-800 ring-red-200" },
    cancelled: { label: labels.cancelled, className: "bg-gray-100 text-gray-700 ring-gray-200" },
    upgrade_required: { label: labels.upgradeRequired, className: "bg-amber-50 text-amber-900 ring-amber-200" },
    near_capacity: { label: labels.nearCapacity, className: "bg-amber-50 text-amber-900 ring-amber-200" },
    unlimited: { label: labels.unlimited, className: "bg-violet-50 text-violet-800 ring-violet-200" },
  };
  const item = map[status ?? ""] ?? { label: status ?? "—", className: "bg-gray-50 text-gray-700 ring-gray-200" };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${item.className}`}>
      {item.label}
    </span>
  );
}

function StatCard({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: "amber" | "indigo" }) {
  const bg = highlight === "amber" ? "border-amber-100 bg-amber-50/40" : highlight === "indigo" ? "border-indigo-100 bg-indigo-50/40" : "border-gray-200 bg-white";
  return (
    <div className={`rounded-xl border p-4 ${bg}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
      {sub ? <p className="mt-1 text-sm text-gray-500">{sub}</p> : null}
    </div>
  );
}

export function LicenseSubscriptionManagementPanel({ labels }: { labels: LicenseManagementLabels }) {
  const [center, setCenter] = useState<LicenseSubscriptionCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/licenses");
    if (res.ok) {
      setLoadError(null);
      setCenter(parseLicenseSubscriptionCenter(await res.json()));
    } else {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setLoadError(body.error ?? "Failed to load licenses");
      setCenter(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/licenses/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
  }

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (loadError) {
    return <p className="p-6 text-sm text-red-600">{loadError}</p>;
  }

  if (!center?.found) {
    return (
      <AipifyModuleAccessDenied message={labels.accessDenied} />
    );
  }

  const overview = center.overview;
  const capacity = center.capacity;
  const domains = center.domain_licenses;
  const upgrade = center.upgrade_center;
  const routes = center.routes;
  const domainPacks = center.domain_pack_installations ?? [];
  const tenantPacks = center.business_packs ?? [];
  const reports = center.reports?.license_usage as Record<string, unknown> | undefined;

  const capacityLabel = capacity?.total_capacity == null
    ? labels.unlimited
    : `${capacity?.used ?? 0} / ${capacity.total_capacity}`;

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6">
      <div>
        <Link href={routes?.store ?? "/app/store"} className="text-sm text-indigo-600 hover:underline">← {labels.back}</Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-sm font-medium text-violet-800">{center.principle}</p> : null}
        {center.commercial_principle ? <p className="mt-1 text-sm text-gray-600">{center.commercial_principle}</p> : null}
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          {routes?.billing ? <Link href={routes.billing} className="text-indigo-700 hover:underline">{labels.billing}</Link> : null}
          {routes?.trust_center ? <Link href={routes.trust_center} className="text-indigo-700 hover:underline">{labels.trustCenter}</Link> : null}
          {routes?.domains ? <Link href={routes.domains} className="text-indigo-700 hover:underline">{labels.manageDomains}</Link> : null}
        </div>
      </div>

      {center.app_license?.access_blocked ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {labels.suspended} — {labels.billing}
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={labels.appLicense}
          value={center.app_license?.plan_key ?? "—"}
          sub={`${labels.status}: ${center.app_license?.status ?? "—"}`}
          highlight="indigo"
        />
        <StatCard
          label={labels.domains}
          value={`${overview?.domains_used ?? domains?.used ?? 0} / ${overview?.domains_purchased ?? domains?.purchased ?? 1}`}
          sub={labels.domainLicenses}
        />
        <StatCard
          label={labels.employees}
          value={capacityLabel}
          sub={capacity?.capacity_status === "upgrade_required" ? labels.upgradeRequired : undefined}
          highlight={capacity?.capacity_status === "upgrade_required" ? "amber" : undefined}
        />
        <StatCard
          label={labels.packs}
          value={String(overview?.business_pack_count ?? 0)}
          sub={labels.businessPacks}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-gray-900">{labels.appLicense}</h2>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {statusBadge(center.app_license?.status, labels)}
            {center.app_license?.renewal_date ? (
              <span className="text-sm text-gray-500">{labels.renewalDate}: {center.app_license.renewal_date}</span>
            ) : null}
          </div>
          {center.app_license?.includes?.length ? (
            <ul className="mt-4 space-y-1 text-sm text-gray-600">
              {center.app_license.includes.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-gray-900">{labels.capacity}</h2>
          <p className="mt-2 text-sm text-gray-600">{labels.employeeCapacity}</p>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-500">{labels.usage}</span><p className="font-medium">{capacity?.used ?? 0}</p></div>
            <div><span className="text-gray-500">{labels.capacity}</span><p className="font-medium">{capacity?.total_capacity ?? labels.unlimited}</p></div>
            <div><span className="text-gray-500">{labels.active}</span><p className="font-medium">{capacity?.active_employees ?? 0}</p></div>
            <div><span className="text-gray-500">{labels.renewals}</span><p className="font-medium">{capacity?.pending_invitations ?? 0} pending</p></div>
          </div>
          {capacity?.capacity_status === "upgrade_required" ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void runAction("purchase_user_capacity", { quantity: 5 })}
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {labels.purchaseCapacity}
            </button>
          ) : null}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">{labels.upgradeCenter}</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={upgrade?.purchase_capacity_route ?? "/app/store/capacity"} className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50">{labels.purchaseCapacity}</Link>
          <Link href={upgrade?.purchase_domain_route ?? "/app/store/additional_domain_license"} className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50">{labels.purchaseDomain}</Link>
          <Link href={upgrade?.upgrade_subscription_route ?? "/app/settings/billing"} className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50">{labels.upgradeSubscription}</Link>
          <Link href={upgrade?.install_packs_route ?? "/app/store"} className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-100">{labels.installPacks}</Link>
          <Link href={upgrade?.enterprise_route ?? "/app/support"} className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-900 hover:bg-violet-100">{labels.enterpriseUpgrade}</Link>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">{labels.domainInstallations}</h2>
        {domainPacks.length === 0 && tenantPacks.length === 0 ? (
          <PlatformEmptyState
            title={labels.noPacks}
            message={labels.noPacksHint}
            primaryAction={{ label: labels.browseStore, href: routes?.store ?? "/app/store" }}
          />
        ) : (
          <div className="mt-4 space-y-3">
            {domainPacks.map((pack) => (
              <div key={`${pack.domain}-${pack.pack_key}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4">
                <div>
                  <p className="font-medium text-gray-900">{pack.pack_key}</p>
                  <p className="text-sm text-gray-500">{pack.domain} · {labels.status}: {pack.license_status}</p>
                </div>
                <Link href={`/app/store/${pack.pack_key}`} className="text-sm text-indigo-600 hover:underline">{labels.manageDomains}</Link>
              </div>
            ))}
            {tenantPacks.map((pack) => {
              const card = pack.card as Record<string, unknown> | undefined;
              return (
                <div key={String(pack.pack_key)} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4">
                  <div>
                    <p className="font-medium text-gray-900">{String(card?.pack_name ?? pack.pack_key)}</p>
                    <p className="text-sm text-gray-500">{labels.status}: {String(pack.license_status ?? "active")}</p>
                  </div>
                  <Link href={`/app/store/${String(pack.pack_key)}`} className="text-sm text-indigo-600 hover:underline">{labels.installPacks}</Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {reports ? (
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-gray-900">{labels.reports}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div><p className="text-gray-500">{labels.licenseUsage}</p><p className="font-medium capitalize">{String(reports.app_status ?? "—")}</p></div>
            <div><p className="text-gray-500">{labels.domainUsage}</p><p className="font-medium">{reports.domain_usage_pct != null ? `${reports.domain_usage_pct}%` : "—"}</p></div>
            <div><p className="text-gray-500">{labels.employeeCapacity}</p><p className="font-medium">{reports.employee_capacity_pct != null ? `${reports.employee_capacity_pct}%` : labels.unlimited}</p></div>
            <div><p className="text-gray-500">{labels.packAdoption}</p><p className="font-medium">{String(reports.business_pack_adoption ?? 0)}</p></div>
          </div>
        </section>
      ) : null}

      {center.audit_recent && center.audit_recent.length > 0 ? (
        <section>
          <h2 className="text-lg font-semibold text-gray-900">{labels.auditLog}</h2>
          <ul className="mt-4 space-y-2">
            {center.audit_recent.map((entry, i) => (
              <li key={`${entry.action}-${i}`} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm">
                <p className="font-medium text-gray-900">{entry.summary}</p>
                <p className="text-xs text-gray-500">{entry.action} · {entry.created_at ? new Date(entry.created_at).toLocaleString() : ""}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
