"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parsePackageUpgradeCheckout,
  type PackageUpgradeCheckout,
  type PaymentProviderKey,
  type PaymentProviderLabels,
} from "@/lib/payment-providers";
import { PaymentProviderLogo } from "@/components/shared/payment-providers";
import {
  PACKAGE_TIER_LABELS,
  parsePackageAccessCenter,
  type PackageAccessCenter,
  type PackageComparison,
} from "@/lib/package-access";

type PackageAccessCenterPanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  billingLink: string;
  currentPackage: string;
  subscriptionStatus: string;
  renewal: string;
  seats: string;
  recommendationTitle: string;
  packagesTitle: string;
  lockedTitle: string;
  noLocked: string;
  auditTitle: string;
  noAudit: string;
  upgrade: string;
  upgrading: string;
  upgradeComplete: string;
  goldNugget: string;
  whoFor: string;
  instantAccess: string;
  privacyNote: string;
  tiers: Record<string, string>;
  upgradeFlow?: PaymentProviderLabels["upgrade"];
  providerNames?: Record<string, string>;
};

type PackageAccessCenterPanelProps = {
  labels: PackageAccessCenterPanelLabels;
};

export function PackageAccessCenterPanel({ labels }: PackageAccessCenterPanelProps) {
  const [center, setCenter] = useState<PackageAccessCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [upgradeMessage, setUpgradeMessage] = useState<string | null>(null);
  const [pendingUpgrade, setPendingUpgrade] = useState<{
    eventId: string;
    target: string;
  } | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState<PackageComparison | null>(null);
  const [checkout, setCheckout] = useState<PackageUpgradeCheckout | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<PaymentProviderKey>("stripe");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/package-access/center");
    if (res.ok) setCenter(parsePackageAccessCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function loadCheckoutPreview(pkg: PackageComparison, provider: PaymentProviderKey) {
    setCheckoutLoading(true);
    const res = await fetch(
      `/api/package-access/upgrade/checkout?target_package=${pkg.package_key}&payment_provider=${provider}`
    );
    if (res.ok) setCheckout(parsePackageUpgradeCheckout(await res.json()));
    setCheckoutLoading(false);
  }

  async function openUpgrade(pkg: PackageComparison) {
    setCheckoutOpen(pkg);
    setSelectedProvider("stripe");
    await loadCheckoutPreview(pkg, "stripe");
  }

  async function handleUpgrade(pkg: PackageComparison) {
    if (!center?.can_upgrade || !pkg.is_upgrade) return;
    if (labels.upgradeFlow) {
      await openUpgrade(pkg);
      return;
    }
    await executeUpgrade(pkg, "stripe");
  }

  async function executeUpgrade(pkg: PackageComparison, provider: PaymentProviderKey) {
    setUpgrading(pkg.package_key);
    setUpgradeMessage(null);

    const startRes = await fetch("/api/package-access/upgrade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start", target_package: pkg.package_key }),
    });

    if (!startRes.ok) {
      setUpgrading(null);
      return;
    }

    const start = await startRes.json();
    setPendingUpgrade({ eventId: start.upgrade_event_id, target: pkg.package_key });

    const completeRes = await fetch("/api/package-access/upgrade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "complete",
        target_package: pkg.package_key,
        upgrade_event_id: start.upgrade_event_id,
        payment_provider: provider,
      }),
    });

    setUpgrading(null);
    setPendingUpgrade(null);
    setCheckoutOpen(null);
    setCheckout(null);

    if (completeRes.ok) {
      const result = await completeRes.json();
      setUpgradeMessage(result.confirmation || result.message || labels.upgradeComplete);
      await load();
    }
  }

  if (loading) return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;

  const currentKey = center?.current_package.package_key ?? "starter";

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Link href="/app/settings" className="text-indigo-600 hover:underline">
          ← {labels.back}
        </Link>
        <Link href="/app/settings/billing" className="text-indigo-600 hover:underline">
          {labels.billingLink}
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center?.privacy_note && (
          <p className="mt-2 text-sm text-gray-500">{labels.privacyNote}</p>
        )}
        {upgradeMessage && (
          <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {upgradeMessage}
          </p>
        )}
      </div>

      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5 shadow-sm">
        <h2 className="font-semibold text-indigo-900">{labels.currentPackage}</h2>
        <p className="mt-2 text-xl font-bold text-gray-900">
          {labels.tiers[currentKey] ?? PACKAGE_TIER_LABELS[currentKey]}
        </p>
        <div className="mt-3 grid gap-2 text-sm text-gray-600 sm:grid-cols-3">
          <span>
            {labels.subscriptionStatus}: {center?.subscription.subscription_status}
          </span>
          <span>
            {labels.renewal}:{" "}
            {center?.subscription.renewal_at
              ? new Date(center.subscription.renewal_at).toLocaleDateString()
              : "—"}
          </span>
          <span>
            {labels.seats}: {center?.subscription.seat_count}
          </span>
        </div>
        {center?.subscription.instant_access_enabled && (
          <p className="mt-2 text-sm text-indigo-800">{labels.instantAccess}</p>
        )}
      </section>

      {center?.recommendation && (
        <section className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
          <h2 className="font-semibold text-amber-900">{labels.recommendationTitle}</h2>
          <p className="mt-2 text-sm text-amber-950">
            {labels.tiers[center.recommendation.best_fit] ?? center.recommendation.best_fit} —{" "}
            {center.recommendation.reason}
          </p>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.packagesTitle}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {center?.packages.map((pkg) => (
            <article
              key={pkg.package_key}
              className={`rounded-xl border p-4 ${
                pkg.is_current ? "border-indigo-300 bg-indigo-50/40" : "border-gray-100"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900">
                  {labels.tiers[pkg.package_key] ?? pkg.package_name}
                </h3>
                {pkg.is_current && (
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-800">
                    Current
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-600">{pkg.description}</p>
              {pkg.is_upgrade && center.can_upgrade && (
                <button
                  type="button"
                  disabled={upgrading === pkg.package_key}
                  onClick={() => void handleUpgrade(pkg)}
                  className="mt-4 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {upgrading === pkg.package_key || pendingUpgrade?.target === pkg.package_key
                    ? labels.upgrading
                    : labels.upgrade}
                </button>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.lockedTitle}</h2>
        {center?.locked_features.length ? (
          <ul className="mt-4 space-y-3">
            {center.locked_features.map((feature) => (
              <li
                key={feature.feature_key}
                className="rounded-xl border border-gray-100 p-4 text-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-gray-900">{feature.feature_label}</span>
                  {feature.is_gold_nugget && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-900">
                      {labels.goldNugget}
                    </span>
                  )}
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                    {labels.tiers[feature.required_package] ?? feature.required_package}
                  </span>
                </div>
                <p className="mt-2 text-gray-600">
                  {feature.upgrade_message_en || feature.upgrade_message}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-gray-500">{labels.noLocked}</p>
        )}
      </section>

      {checkoutOpen && labels.upgradeFlow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900">{labels.upgradeFlow.title}</h2>
            {checkoutLoading || !checkout ? (
              <p className="mt-4 text-sm text-gray-500">{labels.upgrading}</p>
            ) : (
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">{labels.upgradeFlow.currentPlan}</dt>
                  <dd className="font-medium">{labels.tiers[checkout.current_plan] ?? checkout.current_plan}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">{labels.upgradeFlow.newPlan}</dt>
                  <dd className="font-medium">{labels.tiers[checkout.new_plan] ?? checkout.new_plan}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">{labels.upgradeFlow.currentPrice}</dt>
                  <dd>${checkout.current_price_monthly} {labels.upgradeFlow.perMonth}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">{labels.upgradeFlow.newPrice}</dt>
                  <dd>${checkout.new_price_monthly} {labels.upgradeFlow.perMonth}</dd>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-3">
                  <dt className="font-medium text-gray-700">{labels.upgradeFlow.difference}</dt>
                  <dd className="font-semibold text-indigo-700">
                    +${checkout.price_difference_monthly} {labels.upgradeFlow.perMonth}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">{labels.upgradeFlow.paymentProvider}</dt>
                  <div className="mt-2 grid gap-2">
                    {(["stripe", "klarna", "vipps", "dnb"] as PaymentProviderKey[]).map((key) => (
                      <label
                        key={key}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 ${
                          selectedProvider === key
                            ? "border-indigo-300 bg-indigo-50/60"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment_provider"
                          value={key}
                          checked={selectedProvider === key}
                          onChange={() => {
                            setSelectedProvider(key);
                            void loadCheckoutPreview(checkoutOpen, key);
                          }}
                          className="sr-only"
                        />
                        <PaymentProviderLogo
                          provider={key}
                          alt={labels.providerNames?.[key] ?? key}
                        />
                        <span className="text-sm font-medium text-gray-800">
                          {labels.providerNames?.[key] ?? key}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <p className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-900">
                  {labels.upgradeFlow.access}: {checkout.instant_access_message}
                </p>
              </dl>
            )}
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setCheckoutOpen(null);
                  setCheckout(null);
                }}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
              >
                {labels.back}
              </button>
              <button
                type="button"
                disabled={upgrading === checkoutOpen.package_key || checkoutLoading}
                onClick={() => void executeUpgrade(checkoutOpen, selectedProvider)}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {upgrading === checkoutOpen.package_key
                  ? labels.upgradeFlow.confirming
                  : labels.upgradeFlow.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.auditTitle}</h2>
        {center?.recent_events.length ? (
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            {center.recent_events.map((event) => (
              <li key={event.id} className="rounded-lg bg-gray-50 px-3 py-2">
                <span className="font-medium text-gray-800">{event.event_type}</span>
                {event.summary ? ` — ${event.summary}` : ""}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-gray-500">{labels.noAudit}</p>
        )}
      </section>
    </div>
  );
}
