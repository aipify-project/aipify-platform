"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  packLandingRoute,
  parseBusinessPackIdentityEngineDashboard,
  STATUS_BADGE_STYLE,
  type BusinessPackIdentityEngineDashboard,
  type BusinessPackIdentityRecord,
} from "@/lib/aipify/business-pack-identity-engine";

type Props = { labels: Record<string, string> };

function PackRow({ pack, labels }: { pack: BusinessPackIdentityRecord; labels: Record<string, string> }) {
  const statusLabel = labels[`status_${pack.status}`] ?? pack.status;
  const statusStyle = STATUS_BADGE_STYLE[pack.status] ?? "bg-gray-100 text-gray-700 ring-gray-200";

  return (
    <article className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-gray-900">{pack.pack_name}</h3>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusStyle}`}>{statusLabel}</span>
        </div>
        <p className="mt-1 text-sm text-gray-600">{pack.short_description}</p>
        <p className="mt-1 text-xs text-gray-500">
          {labels.version} {pack.version}
          <span className="mx-1">·</span>
          {pack.pack_key}
        </p>
      </div>
      <Link
        href={packLandingRoute(pack.pack_key)}
        className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-800 hover:bg-indigo-100"
      >
        {labels.viewLanding}
      </Link>
    </article>
  );
}

export function BusinessPackIdentityEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<BusinessPackIdentityEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/business-pack-identity-engine/dashboard");
    if (res.ok) setDashboard(parseBusinessPackIdentityEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <AipifyLoader label={labels.loading} />
      </div>
    );
  }

  if (!dashboard?.has_access) return null;

  const criteria = dashboard.success_criteria ?? {};

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold text-indigo-900">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm text-indigo-900">{dashboard.positioning}</p>
        {dashboard.is_platform_admin && (
          <p className="mt-2 text-xs font-medium text-indigo-800">{labels.platformAdminNote}</p>
        )}
      </section>

      <section className="grid gap-3 sm:grid-cols-4">
        {[
          ["packsWithIdentity", criteria.packs_with_identity],
          ["activePacks", criteria.active_packs],
          ["betaPacks", criteria.beta_packs],
          ["identityComplete", criteria.identity_complete],
        ].map(([key, value]) => (
          <div key={key as string} className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{value ?? 0}</p>
            <p className="mt-1 text-xs text-gray-500">{labels[key as string]}</p>
          </div>
        ))}
      </section>

      {dashboard.landing_experience && dashboard.landing_experience.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.landingExperience}</h3>
          <ol className="mt-3 flex flex-wrap gap-2">
            {dashboard.landing_experience.map((step, index) => (
              <li key={step} className="flex items-center gap-1 text-sm text-gray-700">
                {index > 0 && <span className="text-gray-300">→</span>}
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 capitalize">{step.replace(/_/g, " ")}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {dashboard.governance && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.governance}</h3>
          <dl className="mt-3 space-y-2">
            {Object.entries(dashboard.governance).map(([role, note]) => (
              <div key={role}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{role.replace(/_/g, " ")}</dt>
                <dd className="text-sm text-gray-700">{note}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">{labels.catalogTitle}</h3>
        {(dashboard.packs ?? []).map((pack) => (
          <PackRow key={pack.pack_key} pack={pack} labels={labels} />
        ))}
      </section>

      <section className="rounded-xl border border-amber-100 bg-amber-50/50 p-5">
        <h3 className="text-sm font-semibold text-amber-900">{labels.forbiddenTitle}</h3>
        <ul className="mt-2 space-y-1 text-sm text-amber-950">
          {(dashboard.forbidden ?? []).map((item) => (
            <li key={item} className="flex gap-2"><span>×</span>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
