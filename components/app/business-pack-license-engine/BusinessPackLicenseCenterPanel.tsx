"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  packLicenseRoute,
  parseBusinessPackLicenseCenter,
  type BusinessPackLicenseCenter,
  type LicenseTier,
} from "@/lib/aipify/business-pack-license-engine";
import { packLandingRoute } from "@/lib/aipify/business-pack-identity-engine";

type Props = { packKey: string; labels: Record<string, string> };

function TierCard({
  tier,
  currentTier,
  labels,
  onUpgrade,
  busy,
}: {
  tier: LicenseTier;
  currentTier: string;
  labels: Record<string, string>;
  onUpgrade: (tierKey: string) => void;
  busy: boolean;
}) {
  const isCurrent = tier.key === currentTier;
  const capacity =
    tier.custom_capacity
      ? labels.customCapacity
      : tier.capacity_max != null
        ? `${tier.capacity_min ?? 1}–${tier.capacity_max}`
        : String(tier.capacity_min ?? "—");

  return (
    <article className={`rounded-xl border p-4 ${isCurrent ? "border-indigo-300 bg-indigo-50/50 ring-1 ring-indigo-200" : "border-gray-200 bg-white"}`}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900">{tier.label}</h3>
        {isCurrent && (
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">
            {labels.currentPlan}
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-gray-600">{capacity} {labels.capacityUnit}</p>
      {tier.monthly_price != null && !tier.contact_sales && (
        <p className="mt-2 text-sm font-medium text-gray-900">
          €{tier.monthly_price}/{labels.monthly}
        </p>
      )}
      {tier.contact_sales && (
        <p className="mt-2 text-sm text-gray-600">{labels.contactSales}</p>
      )}
      {!isCurrent && !tier.contact_sales && (
        <button
          type="button"
          disabled={busy}
          onClick={() => onUpgrade(tier.key)}
          className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {labels.upgrade}
        </button>
      )}
    </article>
  );
}

export function BusinessPackLicenseCenterPanel({ packKey, labels }: Props) {
  const [center, setCenter] = useState<BusinessPackLicenseCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/aipify/business-pack-license-engine/center?packKey=${encodeURIComponent(packKey)}`);
      if (res.ok) setCenter(parseBusinessPackLicenseCenter(await res.json()));
    } catch {
      setCenter(null);
    }
    setLoading(false);
  }, [packKey]);

  useEffect(() => { void load(); }, [load]);

  const startUpgrade = async (tierKey?: string) => {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/aipify/business-pack-license-engine/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action_type: tierKey ? "apply_tier" : "start_upgrade",
        pack_key: packKey,
        payload: tierKey ? { tier_key: tierKey } : {},
      }),
    });
    const body = (await res.json()) as { message?: string; activation_route?: string; error?: string };
    if (!res.ok) {
      setMessage(body.error ?? labels.actionFailed);
    } else if (body.activation_route && !tierKey) {
      window.location.href = body.activation_route;
      return;
    } else {
      setMessage(body.message ?? labels.upgradeSuccess);
      await load();
    }
    setBusy(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader label={labels.loading} />
      </div>
    );
  }

  if (!center?.found || !center.definition) {
    return (
      <PlatformEmptyState
        title={labels.notFoundTitle}
        description={labels.notFoundMessage}
        action={{ label: labels.backToMarketplace, href: "/app/marketplace/activation" }}
      />
    );
  }

  const { definition, overview, usage, upgrade } = center;
  const usagePercent =
    usage?.capacity_limit && usage.capacity_limit > 0
      ? Math.min(100, Math.round((usage.usage_count / usage.capacity_limit) * 100))
      : 0;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <p className="text-sm font-medium text-indigo-700">{labels.licenseCenter}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">{definition.pack_name}</h1>
          {center.principle && <p className="mt-2 text-sm text-gray-600">{center.principle}</p>}
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href={packLandingRoute(packKey)} className="font-medium text-indigo-700 hover:text-indigo-900">
            {labels.viewPack}
          </Link>
          <Link href="/app/marketplace/activation" className="font-medium text-gray-600 hover:text-gray-900">
            {labels.backToMarketplace}
          </Link>
        </div>
      </header>

      {message && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">{message}</div>
      )}

      {usage?.upgrade_required && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <p className="font-medium">{labels.atCapacityTitle}</p>
          <p className="mt-1">{labels.atCapacityMessage}</p>
          <button
            type="button"
            disabled={busy}
            onClick={() => void startUpgrade()}
            className="mt-2 font-medium text-amber-900 underline disabled:opacity-60"
          >
            {labels.upgradeNow}
          </button>
        </div>
      )}

      {/* Overview */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{labels.overview}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.currentPlan}</dt>
            <dd className="mt-1 text-sm font-medium text-gray-900">{overview?.plan_name ?? definition.pack_name}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.currentTier}</dt>
            <dd className="mt-1 text-sm text-gray-800 capitalize">{overview?.current_tier?.replace(/_/g, " ") ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.licenseStatus}</dt>
            <dd className="mt-1 text-sm capitalize text-gray-800">{overview?.license_status?.replace(/_/g, " ") ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.billingFrequency}</dt>
            <dd className="mt-1 text-sm capitalize text-gray-800">{overview?.billing_frequency ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.renewalDate}</dt>
            <dd className="mt-1 text-sm text-gray-800">{overview?.renewal_date ?? labels.notScheduled}</dd>
          </div>
          {overview?.trial_ends_at && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.trialEnds}</dt>
              <dd className="mt-1 text-sm text-gray-800">{new Date(overview.trial_ends_at).toLocaleDateString()}</dd>
            </div>
          )}
        </dl>
      </section>

      {/* Usage */}
      <section className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-6">
        <h2 className="text-sm font-semibold text-indigo-900">{labels.usageSection}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">{labels.capacityUsed}</p>
            <p className="mt-1 text-2xl font-bold text-indigo-950">
              {usage?.capacity_label ?? `${usage?.usage_count ?? 0} ${usage?.metric_label_plural ?? definition.metric_label_plural}`}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">{labels.capacityRemaining}</p>
            <p className="mt-1 text-2xl font-bold text-indigo-950">
              {usage?.remaining_capacity ?? "—"} {usage?.metric_label_plural ?? definition.metric_label_plural}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">{labels.usageTrend}</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-indigo-200">
              <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${usagePercent}%` }} />
            </div>
            <p className="mt-1 text-xs text-indigo-800">{usagePercent}% {labels.ofCapacity}</p>
          </div>
        </div>
      </section>

      {/* Upgrade tiers */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{labels.upgradeSection}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(upgrade?.available_tiers ?? definition.tiers).map((tier) => (
            <TierCard
              key={tier.key}
              tier={tier}
              currentTier={overview?.current_tier ?? "growth"}
              labels={labels}
              onUpgrade={(key) => void startUpgrade(key)}
              busy={busy}
            />
          ))}
        </div>
      </section>

      {/* Feature comparison */}
      {(upgrade?.feature_comparison ?? definition.feature_comparison).length > 0 && (
        <section className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <h2 className="border-b border-gray-100 px-6 py-4 text-sm font-semibold text-gray-900">{labels.featureComparison}</h2>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">{labels.feature}</th>
                <th className="px-4 py-3">{labels.entry}</th>
                <th className="px-4 py-3">{labels.growth}</th>
                <th className="px-4 py-3">{labels.professional}</th>
                <th className="px-4 py-3">{labels.enterprise}</th>
              </tr>
            </thead>
            <tbody>
              {(upgrade?.feature_comparison ?? definition.feature_comparison).map((row) => (
                <tr key={String(row.feature)} className="border-b border-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{String(row.feature)}</td>
                  <td className="px-4 py-3 text-gray-600">{String(row.entry ?? "—")}</td>
                  <td className="px-4 py-3 text-gray-600">{String(row.growth ?? "—")}</td>
                  <td className="px-4 py-3 text-gray-600">{String(row.professional ?? "—")}</td>
                  <td className="px-4 py-3 text-gray-600">{String(row.enterprise ?? "—")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {center.governance_note && (
        <p className="text-center text-xs text-gray-500">{center.governance_note}</p>
      )}
    </div>
  );
}
