"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { formatExecutiveMetric, formatOverviewMetric } from "@/lib/ui/overview-metrics";
import {
  parseIndustryPackEcosystemCenter,
  type IndustryPackEcosystemCenter,
  type IndustryPackRegistry,
} from "@/lib/aipify/industry-pack-ecosystem-engine";

type Props = { labels: Record<string, string> };

export function IndustryPackEcosystemEngineDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<IndustryPackEcosystemCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [installing, setInstalling] = useState<string | null>(null);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/industry-pack-ecosystem-engine/dashboard");
    if (res.ok) {
      setCenter(parseIndustryPackEcosystemCenter(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.loadFailed);
    }
    setLoading(false);
  }, [labels.loadFailed]);

  useEffect(() => {
    void load();
  }, [load]);

  const installPack = async (pack: IndustryPackRegistry) => {
    if (!pack.id) return;
    setInstalling(pack.id);
    setActionError(null);
    const res = await fetch("/api/aipify/industry-pack-ecosystem-engine/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "install_pack", registry_id: pack.id, install_mode: "guided" }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.installFailed);
    } else {
      await load();
    }
    setInstalling(null);
  };

  const upgradePack = async (installId: string) => {
    setUpgrading(installId);
    setActionError(null);
    const res = await fetch("/api/aipify/industry-pack-ecosystem-engine/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "upgrade_pack", install_id: installId, version_label: "1.1.0" }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.upgradeFailed);
    } else {
      await load();
    }
    setUpgrading(null);
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

  return (
    <div className="space-y-6">
      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</div>
      ) : null}

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.overviewTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{center.distinction_note}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [labels.metricInstalled, formatOverviewMetric(overview.pack_adoption)],
            [labels.metricAvailable, (center.available_packs ?? []).length],
            [labels.metricMarketplace, formatOverviewMetric(overview.marketplace_catalog_count)],
            [labels.metricHealth, formatOverviewMetric(overview.average_health_score)],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.architectureTitle}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(center.inherited_architecture ?? []).map((item) => (
            <span key={item} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
              {item.replace(/_/g, " ")}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.installedTitle}</h2>
        {(center.installed_packs ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noInstalled}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {(center.installed_packs ?? []).map((install) => (
              <li key={install.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-gray-50 px-4 py-3">
                <div>
                  <p className="font-medium text-gray-900">{install.pack?.display_name}</p>
                  <p className="text-sm text-gray-500">
                    {install.pack?.industry_type} · v{install.version_label} · {labels.health}: {install.health_score}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={upgrading === install.id}
                  onClick={() => install.id && void upgradePack(install.id)}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50"
                >
                  {upgrading === install.id ? labels.upgrading : labels.upgradePack}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.availableTitle}</h2>
        <ul className="mt-4 space-y-3">
          {(center.available_packs ?? []).map((pack) => (
            <li key={pack.id} className="rounded-lg border border-gray-100 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-gray-900">{pack.display_name}</p>
                  <p className="mt-1 text-sm text-gray-600">{pack.short_description}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {pack.industry_type} · {pack.pack_source} · {pack.lifecycle_status}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={installing === pack.id}
                  onClick={() => void installPack(pack)}
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {installing === pack.id ? labels.installing : labels.installPack}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.advisorTitle}</h2>
        <div className="mt-4 space-y-4">
          {(center.advisor_signals ?? []).map((sig) => (
            <article key={sig.id} className="rounded-lg bg-gray-50 p-4">
              <p className="font-medium text-gray-900">{sig.observation}</p>
              {sig.impact ? <p className="mt-2 text-sm text-gray-600">{sig.impact}</p> : null}
              {sig.recommendation ? (
                <p className="mt-2 text-sm font-medium text-gray-800">
                  {labels.recommendation}: {sig.recommendation}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.governanceTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            {(center.governance_policies ?? []).map((policy) => (
              <li key={String(policy.id)} className="rounded-lg bg-gray-50 px-3 py-2">
                {String(policy.policy_label)}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.marketplaceTitle}</h2>
          <p className="mt-2 text-sm text-gray-600">{labels.marketplaceNote}</p>
          <Link href={center.marketplace_route ?? "/app/marketplace"} className="mt-3 inline-block text-sm font-medium underline">
            {labels.openMarketplace}
          </Link>
        </div>
      </section>

      <p className="text-sm text-gray-500">
        {labels.businessPacksCrossLink}{" "}
        <Link href={center.business_packs_route ?? "/app/business-packs-foundation-engine"} className="underline">
          {labels.businessPacksLink}
        </Link>
      </p>
    </div>
  );
}
