"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { packLandingRoute } from "@/lib/aipify/business-pack-identity-engine";
import {
  parseMarketplaceSelfServiceActionResult,
  parseMarketplaceSelfServiceDashboard,
  type MarketplacePackCard,
  type MarketplaceRecommendation,
  type MarketplaceSelfServiceDashboard,
  type MarketplaceSelfServiceSectionKey,
} from "@/lib/aipify/marketplace-self-service-activation";

type Props = { labels: Record<string, string> };

const SECTION_KEYS: MarketplaceSelfServiceSectionKey[] = [
  "installed",
  "recommended",
  "discover",
  "trials",
  "billing",
];

const STATUS_STYLE: Record<string, string> = {
  installed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  available: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  upgrade_required: "bg-amber-50 text-amber-900 ring-amber-200",
  trial_available: "bg-sky-50 text-sky-800 ring-sky-200",
};

function EmptyBoard({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-10 text-center">
      <p className="text-sm font-medium text-gray-800">{title}</p>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
}

function PackCard({
  card,
  labels,
  busy,
  onActivate,
  onTrial,
  onUpgrade,
}: {
  card: MarketplacePackCard;
  labels: Record<string, string>;
  busy: boolean;
  onActivate: (packKey: string) => void;
  onTrial: (packKey: string) => void;
  onUpgrade: (packKey: string) => void;
}) {
  const statusLabel = labels[`status_${card.card_status}`] ?? card.card_status.replace(/_/g, " ");

  return (
    <article className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <Link href={packLandingRoute(card.pack_key)} className="text-lg font-semibold text-gray-900 hover:text-indigo-700">
          {card.name}
        </Link>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${STATUS_STYLE[card.card_status] ?? "bg-gray-100 text-gray-700 ring-gray-200"}`}>
          {statusLabel}
        </span>
      </div>
      <p className="mt-2 flex-1 text-sm text-gray-600">{card.description}</p>
      {card.features.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm text-gray-700">
          {card.features.slice(0, 4).map((feature) => (
            <li key={feature} className="flex gap-2">
              <span className="text-indigo-500">·</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4">
        <div>
          <p className="text-sm font-medium text-gray-900">{card.pricing_label}</p>
          {card.trial_available && (
            <p className="text-xs text-gray-500">{labels.trialAvailable}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={packLandingRoute(card.pack_key)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {labels.viewPackDetails}
          </Link>
          {card.card_status === "installed" && (
            <Link
              href={card.workspace_route}
              className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-800 hover:bg-indigo-100"
            >
              {labels.openWorkspace}
            </Link>
          )}
          {card.card_status === "upgrade_required" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => onUpgrade(card.pack_key)}
              className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-100 disabled:opacity-60"
            >
              {labels.upgradeToActivate}
            </button>
          )}
          {card.card_status === "trial_available" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => onTrial(card.pack_key)}
              className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-800 hover:bg-sky-100 disabled:opacity-60"
            >
              {labels.startTrial}
            </button>
          )}
          {(card.card_status === "available" || card.card_status === "trial_available") && (
            <button
              type="button"
              disabled={busy}
              onClick={() => onActivate(card.pack_key)}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {labels.activate}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function RecommendationCard({
  rec,
  labels,
  busy,
  onAction,
}: {
  rec: MarketplaceRecommendation;
  labels: Record<string, string>;
  busy: boolean;
  onAction: (rec: MarketplaceRecommendation) => void;
}) {
  return (
    <article className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
      <h3 className="font-semibold text-gray-900">{rec.title}</h3>
      <p className="mt-1 text-sm text-gray-600">{rec.message}</p>
      <button
        type="button"
        disabled={busy}
        onClick={() => onAction(rec)}
        className="mt-3 text-sm font-medium text-indigo-700 hover:text-indigo-900 disabled:opacity-60"
      >
        {rec.action_type === "addon" ? labels.viewAddon : rec.action_type === "upgrade" ? labels.oneClickUpgrade : labels.activate}
      </button>
    </article>
  );
}

export function MarketplaceSelfServiceActivationDashboardPanel({ labels }: Props) {
  const [section, setSection] = useState<MarketplaceSelfServiceSectionKey>("discover");
  const [dashboard, setDashboard] = useState<MarketplaceSelfServiceDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [reviewPack, setReviewPack] = useState<MarketplacePackCard | null>(null);

  const load = useCallback(async (nextSection: MarketplaceSelfServiceSectionKey) => {
    setLoading(true);
    setActionError(null);
    const res = await fetch(`/api/aipify/marketplace-self-service-activation/dashboard?section=${nextSection}`);
    if (res.ok) setDashboard(parseMarketplaceSelfServiceDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load(section);
  }, [load, section]);

  const runAction = async (actionType: string, packKey?: string, payload?: Record<string, unknown>) => {
    setBusy(true);
    setActionError(null);
    setSuccessMessage(null);
    const res = await fetch("/api/aipify/marketplace-self-service-activation/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type: actionType, pack_key: packKey, payload }),
    });
    const body = await res.json();
    if (!res.ok) {
      setActionError(typeof body.error === "string" ? body.error : labels.actionFailed);
      setBusy(false);
      return null;
    }
    const result = parseMarketplaceSelfServiceActionResult(body);
    setBusy(false);
    return result;
  };

  const handleActivate = async (packKey: string) => {
    const pack = dashboard?.cards.find((c) => c.pack_key === packKey);
    if (pack) setReviewPack(pack);

    const result = await runAction("activate_pack", packKey);
    if (!result) return;

    if (result.status === "upgrade_required") {
      setReviewPack(null);
      window.location.href = result.billing_route ?? dashboard?.packages_route ?? "/app/settings/billing/packages";
      return;
    }

    setReviewPack(null);
    setSuccessMessage(result.message ?? labels.activationSuccess);
    await load(section);
  };

  const handleTrial = async (packKey: string) => {
    const result = await runAction("start_trial", packKey);
    if (!result) return;
    setSuccessMessage(result.message ?? labels.trialSuccess);
    await load(section);
  };

  const handleUpgrade = async (packKey: string) => {
    const result = await runAction("start_upgrade", packKey);
    if (!result) return;
    if (result.requires_payment || result.status === "started") {
      window.location.href = result.billing_route ?? dashboard?.packages_route ?? "/app/settings/billing/packages";
      return;
    }
    await load(section);
  };

  const handleRecommendation = async (rec: MarketplaceRecommendation) => {
    if (rec.action_type === "addon" && rec.action_target) {
      if (rec.action_target === "hosts_5" || rec.recommendation_key === "hosts_property_upgrade") {
        await handleUpgrade(rec.pack_key ?? "aipify_hosts");
        return;
      }
      setBusy(true);
      const res = await fetch("/api/aipify/billing-commercial/addons/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addon_key: rec.action_target }),
      });
      setBusy(false);
      if (res.ok) {
        setSuccessMessage(labels.addonSuccess);
        await load(section);
      } else {
        setActionError(labels.actionFailed);
      }
      return;
    }
    if (rec.pack_key) {
      if (rec.action_type === "upgrade") await handleUpgrade(rec.pack_key);
      else await handleActivate(rec.pack_key);
    }
  };

  if (loading && !dashboard) {
    return (
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <AipifyLoader size="sm" />
        {labels.loading}
      </div>
    );
  }

  if (!dashboard?.has_customer) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
      />
    );
  }

  const cards = dashboard.cards ?? [];
  const recommendations = dashboard.recommendations ?? [];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 text-sm text-indigo-950">
        <p>{dashboard.philosophy}</p>
        <p className="mt-2 text-xs text-indigo-800">{dashboard.principle}</p>
      </div>

      <p className="text-xs text-gray-500">{dashboard.governance_note}</p>

      {successMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {successMessage}
        </div>
      )}
      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {actionError}
        </div>
      )}

      {reviewPack && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{labels.activationFlow}</h2>
          <ol className="mt-3 space-y-2">
            {(dashboard.activation_steps ?? []).map((step) => (
              <li key={step.key} className="flex items-center gap-3 text-sm text-gray-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-800">
                  {step.step}
                </span>
                {step.label}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm font-medium text-gray-900">{reviewPack.name}</p>
          <p className="mt-1 text-sm text-gray-600">{reviewPack.description}</p>
        </section>
      )}

      <nav className="flex flex-wrap gap-2 border-b border-gray-200 pb-1">
        {SECTION_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setSection(key)}
            className={`rounded-t-lg px-4 py-2 text-sm font-medium transition ${
              section === key
                ? "border-b-2 border-indigo-600 text-indigo-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {labels[`section_${key}`] ?? key}
          </button>
        ))}
      </nav>

      {section === "billing" && (
        <section className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900">{labels.billingOverview}</h3>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
              <div>
                <dt className="text-gray-500">{labels.currentPlan}</dt>
                <dd className="font-medium text-gray-900">{dashboard.current_tier}</dd>
              </div>
              <div>
                <dt className="text-gray-500">{labels.subscriptionStatus}</dt>
                <dd className="font-medium text-gray-900">{String(dashboard.billing_summary?.subscription_status ?? "—")}</dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={dashboard.billing_route ?? "/app/settings/billing"} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50">
                {labels.manageBilling}
              </Link>
              <Link href={dashboard.packages_route ?? "/app/settings/billing/packages"} className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-800 hover:bg-indigo-100">
                {labels.viewPlans}
              </Link>
            </div>
          </div>
          {(dashboard.addon_modules ?? []).length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">{labels.addonModules}</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {(dashboard.addon_modules ?? []).map((addon) => (
                  <li key={String(addon.addon_key)} className="flex justify-between gap-2 rounded-lg border border-gray-100 px-3 py-2">
                    <span>{String(addon.title ?? addon.addon_key)}</span>
                    <span className="text-gray-500">{String(addon.status ?? "")}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {section === "recommended" && (
        recommendations.length === 0 ? (
          <EmptyBoard title={labels.emptyRecommendedTitle} message={labels.emptyRecommendedMessage} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.map((rec) => (
              <RecommendationCard key={rec.id} rec={rec} labels={labels} busy={busy} onAction={handleRecommendation} />
            ))}
          </div>
        )
      )}

      {section !== "billing" && section !== "recommended" && (
        cards.length === 0 ? (
          <EmptyBoard
            title={labels[`empty_${section}_title`] ?? labels.emptyDiscoverTitle}
            message={labels[`empty_${section}_message`] ?? labels.emptyDiscoverMessage}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {cards.map((card) => (
              <PackCard
                key={card.pack_key}
                card={card}
                labels={labels}
                busy={busy}
                onActivate={handleActivate}
                onTrial={handleTrial}
                onUpgrade={handleUpgrade}
              />
            ))}
          </div>
        )
      )}

      <div className="flex flex-wrap gap-2 text-sm">
        <Link href="/app/marketplace" className="text-indigo-700 hover:text-indigo-900">{labels.backToMarketplace}</Link>
        <Link href="/app/settings/billing" className="text-gray-600 hover:text-gray-900">{labels.manageBilling}</Link>
      </div>
    </div>
  );
}
