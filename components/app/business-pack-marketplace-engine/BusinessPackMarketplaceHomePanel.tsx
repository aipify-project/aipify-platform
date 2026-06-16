"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  MARKETPLACE_CARD_STATUS_STYLE,
  parseBusinessPackMarketplaceHome,
  type BusinessPackMarketplaceHome,
  type MarketplacePackListing,
} from "@/lib/aipify/business-pack-marketplace-engine";

type Props = { labels: Record<string, string>; locale?: string };

function PackListingCard({
  listing,
  labels,
  busy,
  onTrial,
  onInstall,
  onUpgrade,
}: {
  listing: MarketplacePackListing;
  labels: Record<string, string>;
  busy: boolean;
  onTrial: (packKey: string) => void;
  onInstall: (packKey: string) => void;
  onUpgrade: (packKey: string) => void;
}) {
  const statusStyle =
    MARKETPLACE_CARD_STATUS_STYLE[listing.card_status] ??
    MARKETPLACE_CARD_STATUS_STYLE[listing.status_badge] ??
    MARKETPLACE_CARD_STATUS_STYLE.available;
  const statusLabel = labels[`status_${listing.card_status}`] ?? listing.card_status.replace(/_/g, " ");
  const categoryLabel = labels[`category_${listing.category}`] ?? listing.category.replace(/_/g, " ");

  return (
    <article className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-violet-50 text-lg font-bold text-indigo-800">
          {listing.pack_logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={listing.pack_logo_url} alt="" className="h-12 w-12 rounded-xl object-cover" />
          ) : (
            listing.pack_name.charAt(0)
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={listing.landing_route} className="font-semibold text-gray-900 hover:text-indigo-700">
              {listing.pack_name}
            </Link>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusStyle}`}>{statusLabel}</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {categoryLabel} · {labels.version} {listing.version}
          </p>
        </div>
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">{listing.short_description}</p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-gray-100 pt-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">{listing.starting_price}</p>
          {listing.trial_available && !listing.installed && (
            <p className="text-xs text-sky-700">{labels.trialAvailable}</p>
          )}
          {listing.trial_days_left != null && listing.trial_days_left > 0 && (
            <p className="text-xs text-sky-700">{labels.trialDaysLeft.replace("{days}", String(listing.trial_days_left))}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={listing.landing_route}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {labels.viewDetails}
          </Link>
          {listing.installed && listing.workspace_route && (
            <Link
              href={listing.workspace_route}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              {labels.openWorkspace}
            </Link>
          )}
          {(listing.upgrade_required || listing.card_status === "upgrade_required") && (
            <button
              type="button"
              disabled={busy}
              onClick={() => onUpgrade(listing.pack_key)}
              className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-100 disabled:opacity-60"
            >
              {labels.upgrade}
            </button>
          )}
          {!listing.installed && listing.trial_available && listing.card_status === "trial_available" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => onTrial(listing.pack_key)}
              className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-800 hover:bg-sky-100 disabled:opacity-60"
            >
              {labels.startTrial}
            </button>
          )}
          {!listing.installed && listing.install_available && listing.card_status === "available" && (
            <Link
              href={listing.install_route}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              {labels.install}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

function SectionGrid({
  title,
  listings,
  labels,
  busy,
  onTrial,
  onInstall,
  onUpgrade,
  emptyTitle,
  emptyMessage,
}: {
  title: string;
  listings: MarketplacePackListing[];
  labels: Record<string, string>;
  busy: boolean;
  onTrial: (k: string) => void;
  onInstall: (k: string) => void;
  onUpgrade: (k: string) => void;
  emptyTitle?: string;
  emptyMessage?: string;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h2>
      {listings.length === 0 ? (
        emptyTitle ? <PlatformEmptyState title={emptyTitle} message={emptyMessage ?? ""} /> : null
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <PackListingCard
              key={listing.pack_key}
              listing={listing}
              labels={labels}
              busy={busy}
              onTrial={onTrial}
              onInstall={onInstall}
              onUpgrade={onUpgrade}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export function BusinessPackMarketplaceHomePanel({ labels, locale = "en" }: Props) {
  const [home, setHome] = useState<BusinessPackMarketplaceHome | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/business-pack-marketplace-engine/home?locale=${encodeURIComponent(locale)}`);
    if (res.ok) setHome(parseBusinessPackMarketplaceHome(await res.json()));
    setLoading(false);
  }, [locale]);

  useEffect(() => { void load(); }, [load]);

  const runAction = async (actionType: string, packKey: string) => {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/aipify/business-pack-marketplace-engine/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type: actionType, pack_key: packKey }),
    });
    const body = (await res.json()) as { message?: string; error?: string; license_route?: string };
    if (!res.ok) {
      setMessage(body.error ?? labels.actionFailed);
    } else {
      setMessage(body.message ?? labels.actionSuccess);
      if (body.license_route && actionType === "start_upgrade") {
        window.location.href = body.license_route;
        return;
      }
      await load();
    }
    setBusy(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <AipifyLoader label={labels.loading} />
      </div>
    );
  }

  if (!home?.found) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, href: "/app/marketplace/business-packs" }}
      />
    );
  }

  const sections = home.sections ?? {};

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-700">{labels.engineTitle}</p>
        <h2 className="mt-2 text-xl font-bold text-gray-900">{home.principle}</h2>
        {home.commercial_principles && home.commercial_principles.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {home.commercial_principles.map((item) => (
              <li key={item} className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-indigo-900 ring-1 ring-indigo-100">
                {item}
              </li>
            ))}
          </ul>
        )}
      </section>

      {message && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">{message}</div>
      )}

      {(sections.continue_setup ?? []).length > 0 && (
        <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
          <h2 className="text-sm font-semibold text-amber-950">{labels.section_continue_setup}</h2>
          <ul className="mt-3 space-y-2">
            {sections.continue_setup!.map((item) => (
              <li key={item.pack_key}>
                <Link href={item.install_route} className="text-sm font-medium text-amber-900 hover:underline">
                  {item.card?.pack_name ?? item.pack_key} — {item.workflow_step.replace(/_/g, " ")}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <SectionGrid
        title={labels.section_recommended_for_you}
        listings={sections.recommended_for_you ?? []}
        labels={labels}
        busy={busy}
        onTrial={(k) => void runAction("start_trial", k)}
        onInstall={(k) => void runAction("activate_pack", k)}
        onUpgrade={(k) => void runAction("start_upgrade", k)}
        emptyTitle={labels.emptyRecommendedTitle}
        emptyMessage={labels.emptyRecommendedMessage}
      />

      <SectionGrid
        title={labels.section_installed}
        listings={sections.installed ?? []}
        labels={labels}
        busy={busy}
        onTrial={(k) => void runAction("start_trial", k)}
        onInstall={(k) => void runAction("activate_pack", k)}
        onUpgrade={(k) => void runAction("start_upgrade", k)}
        emptyTitle={labels.emptyInstalledTitle}
        emptyMessage={labels.emptyInstalledMessage}
      />

      <SectionGrid
        title={labels.section_upgrade_opportunities}
        listings={sections.upgrade_opportunities ?? []}
        labels={labels}
        busy={busy}
        onTrial={(k) => void runAction("start_trial", k)}
        onInstall={(k) => void runAction("activate_pack", k)}
        onUpgrade={(k) => void runAction("start_upgrade", k)}
      />

      <SectionGrid
        title={labels.section_popular}
        listings={sections.popular ?? []}
        labels={labels}
        busy={busy}
        onTrial={(k) => void runAction("start_trial", k)}
        onInstall={(k) => void runAction("activate_pack", k)}
        onUpgrade={(k) => void runAction("start_upgrade", k)}
      />

      <SectionGrid
        title={labels.section_recently_added}
        listings={sections.recently_added ?? []}
        labels={labels}
        busy={busy}
        onTrial={(k) => void runAction("start_trial", k)}
        onInstall={(k) => void runAction("activate_pack", k)}
        onUpgrade={(k) => void runAction("start_upgrade", k)}
      />

      {home.governance_note && (
        <p className="text-center text-xs text-gray-500">{home.governance_note}</p>
      )}
    </div>
  );
}
