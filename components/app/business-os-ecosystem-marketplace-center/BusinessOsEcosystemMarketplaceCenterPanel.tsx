"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseBusinessOsEcosystemMarketplaceAction,
  parseBusinessOsEcosystemMarketplaceCenter,
  type BusinessOsEcosystemMarketplaceCenter,
  type CertificationProgram,
  type CompanionEcosystemItem,
  type EcosystemAnalyticsMetric,
  type EcosystemSectionItem,
  type GrowthPartnerItem,
  type IntegrationListing,
  type MarketplaceListing,
  type RevenueStream,
  type SolutionProvider,
} from "@/lib/business-os-ecosystem-marketplace-center";
import type { BusinessOsEcosystemMarketplaceCenterLabels } from "@/lib/business-os-ecosystem-marketplace-center/labels";
import { EcosystemStatusBadge } from "./EcosystemStatusBadge";

type Props = { labels: BusinessOsEcosystemMarketplaceCenterLabels };

function SectionCard({ title, items }: { title: string; items: EcosystemSectionItem[] }) {
  if (items.length === 0) return null;
  const item = items[0];
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{title}</p>
      <p className="mt-1 font-semibold text-zinc-900">{item.title}</p>
      {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
      {item.metricValue ? <p className="mt-2 text-lg font-bold text-violet-900">{item.metricLabel}: {item.metricValue}</p> : null}
    </div>
  );
}

export function BusinessOsEcosystemMarketplaceCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<BusinessOsEcosystemMarketplaceCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/ecosystem/marketplace");
    if (res.ok) setCenter(parseBusinessOsEcosystemMarketplaceCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handleAction = async (itemType: string, id: string, action: string) => {
    setBusy(true);
    const res = await fetch("/api/ecosystem/marketplace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "manage", item_type: itemType, item_id: id, manage_action: action }),
    });
    if (parseBusinessOsEcosystemMarketplaceAction(await res.json()).ok) await load();
    setBusy(false);
  };

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.title}</span>
      </div>
    );
  }

  if (!center?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.accessDenied}</p>
        {center?.error ? <p className="mt-2 text-sm">{center.error}</p> : null}
      </div>
    );
  }

  const packListings = center.businessPackStore.length > 0 ? center.businessPackStore : center.marketplaceListings.filter(
    (l) => l.listingType === "business_pack" || l.listingType === "industry_pack"
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-600">{labels.philosophy}</p>
          {center.governanceNote ? <p className="mt-2 text-sm font-medium text-violet-900">{center.governanceNote}</p> : null}
          {center.privacyNote ? <p className="mt-2 text-xs text-zinc-500">{center.privacyNote}</p> : null}
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link href="/app/ecosystem-governance" className="text-violet-700 hover:underline">{labels.links.ecosystemGovernance}</Link>
            <Link href="/app/ecosystem-intelligence" className="text-violet-700 hover:underline">{labels.links.ecosystemIntelligence}</Link>
            <Link href="/app/ecosystem-orchestration" className="text-violet-700 hover:underline">{labels.links.ecosystemOrchestration}</Link>
            <Link href="/app/skills" className="text-violet-700 hover:underline">{labels.links.skillsMarketplace}</Link>
          </div>
        </div>
        <button type="button" disabled={busy} onClick={() => void load()} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.refresh}</button>
      </div>

      <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5">
        <h2 className="text-lg font-semibold text-zinc-900">{labels.marketplaceSettings.title}</h2>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-700">
          <span>{center.marketplaceSettings.marketplaceEnabled ? labels.marketplaceSettings.enabled : labels.accessDenied}</span>
          {center.marketplaceSettings.reviewRequired ? <span>{labels.marketplaceSettings.reviewRequired}</span> : null}
          {center.marketplaceSettings.revenueSharingEnabled ? <span>{labels.marketplaceSettings.revenueSharing}</span> : null}
        </div>
      </section>

      {center.ecosystemAnalytics.length > 0 ? (
        <section className="rounded-2xl border border-violet-200 bg-violet-50/40 p-5">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.ecosystemAnalytics.title}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {center.ecosystemAnalytics.map((m: EcosystemAnalyticsMetric) => (
              <div key={m.id} className="rounded-xl border border-violet-100 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 capitalize">{m.metricKey.replace(/_/g, " ")}</p>
                <p className="mt-1 text-2xl font-bold text-violet-900">{m.metricValue}</p>
                {m.trendLabel ? <p className="mt-1 text-xs text-zinc-600">{m.trendLabel}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <SectionCard title={labels.sections.marketplace} items={center.sections.marketplace} />
        <SectionCard title={labels.sections.businessPacks} items={center.sections.businessPacks} />
        <SectionCard title={labels.sections.skills} items={center.sections.skills} />
        <SectionCard title={labels.sections.integrations} items={center.sections.integrations} />
        <SectionCard title={labels.sections.growthPartners} items={center.sections.growthPartners} />
        <SectionCard title={labels.sections.solutionProviders} items={center.sections.solutionProviders} />
        <SectionCard title={labels.sections.certifications} items={center.sections.certifications} />
        <SectionCard title={labels.sections.revenueSharing} items={center.sections.revenueSharing} />
      </div>

      {packListings.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.businessPackStore.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {packListings.map((l: MarketplaceListing) => (
              <div key={l.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-zinc-900">{l.listingName}</p>
                  <EcosystemStatusBadge statusKey={l.statusKey} labels={labels.status} />
                </div>
                <p className="mt-1 text-xs capitalize text-zinc-500">{labels.category}: {l.listingCategory.replace(/_/g, " ")}</p>
                <p className="mt-1 text-sm text-zinc-600">{labels.vendor}: {l.vendorName}</p>
                <p className="mt-2 text-sm text-zinc-600">
                  {labels.rating}: {l.ratingLabel} · {labels.downloads}: {l.downloadsLabel} · {labels.version}: {l.versionLabel}
                </p>
                <p className="mt-1 text-sm font-medium text-violet-900">{labels.price}: {l.priceLabel}</p>
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("listing", l.id, "approve")} className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">{labels.actions.approve}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("listing", l.id, "escalate")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.escalate}</button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.marketplaceListings.filter((l) => !packListings.some((p) => p.id === l.id)).length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.sections.marketplace}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {center.marketplaceListings.filter((l) => !packListings.some((p) => p.id === l.id)).map((l: MarketplaceListing) => (
              <div key={l.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="font-medium text-zinc-900">{l.listingName}</p>
                <p className="mt-1 text-xs capitalize text-violet-700">{l.listingType.replace(/_/g, " ")}</p>
                <p className="mt-1 text-sm text-zinc-600">{labels.vendor}: {l.vendorName} · {labels.rating}: {l.ratingLabel}</p>
                <EcosystemStatusBadge statusKey={l.statusKey} labels={labels.status} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.integrationMarketplace.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.integrationMarketplace.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {center.integrationMarketplace.map((i: IntegrationListing) => (
              <div key={i.id} className="rounded-xl border border-violet-100 bg-violet-50/30 p-4">
                <p className="font-medium text-zinc-900">{i.integrationName}</p>
                <p className="mt-1 text-xs capitalize text-violet-700">{i.integrationType.replace(/_/g, " ")}</p>
                <p className="mt-1 text-sm text-zinc-600">{i.providerName}</p>
                {i.summary ? <p className="mt-2 text-sm text-zinc-600">{i.summary}</p> : null}
                <div className="mt-2"><EcosystemStatusBadge statusKey={i.statusKey} labels={labels.status} /></div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.solutionProviderDirectory.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.solutionProviderDirectory.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {center.solutionProviderDirectory.map((p: SolutionProvider) => (
              <div key={p.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="font-medium text-zinc-900">{p.providerName}</p>
                <p className="mt-1 text-xs capitalize text-zinc-500">{p.providerType.replace(/_/g, " ")}</p>
                <p className="mt-2 text-sm text-violet-800">{p.certificationLabel}</p>
                <p className="mt-1 text-sm text-zinc-600">{labels.rating}: {p.ratingLabel} · {labels.regions}: {p.regionsLabel}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.certificationFramework.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.certificationFramework.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {center.certificationFramework.map((c: CertificationProgram) => (
              <div key={c.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="font-medium text-zinc-900">{c.certificationName}</p>
                <p className="mt-1 text-sm text-zinc-600">{labels.holders}: {c.holderCount}</p>
                <div className="mt-2"><EcosystemStatusBadge statusKey={c.statusKey} labels={labels.status} /></div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.revenueSharingEngine.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.revenueSharingEngine.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {center.revenueSharingEngine.map((r: RevenueStream) => (
              <div key={r.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="text-xs capitalize text-zinc-500">{r.revenueType.replace(/_/g, " ")}</p>
                <p className="mt-1 font-medium text-zinc-900">{r.revenueLabel}</p>
                <p className="mt-2 text-lg font-bold text-violet-900">{labels.amount}: {r.amountLabel}</p>
                <p className="text-xs text-zinc-500">{labels.period}: {r.periodLabel}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.growthPartnerEcosystem.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.growthPartnerEcosystem.title}</h2>
          <ul className="space-y-3">
            {center.growthPartnerEcosystem.map((g: GrowthPartnerItem) => (
              <li key={g.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-zinc-900">{g.partnerName}</p>
                    <p className="mt-1 text-xs capitalize text-violet-700">{labels.tier}: {g.partnerTier.replace(/_/g, " ")}</p>
                    <p className="mt-2 text-sm text-zinc-600">
                      {labels.leads}: {g.leadsLabel} · {labels.revenue}: {g.revenueLabel} · {labels.commission}: {g.commissionLabel}
                    </p>
                    <p className="mt-1 text-sm text-zinc-600">{g.certificationsLabel} · {labels.performance}: {g.performanceLabel}</p>
                  </div>
                  <EcosystemStatusBadge statusKey={g.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.companionAdvisor.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.companionAdvisor.title}</h2>
          <ul className="space-y-3">
            {center.companionAdvisor.map((item: CompanionEcosystemItem) => (
              <li key={item.id} className="rounded-xl border border-violet-200 bg-violet-50/30 p-4">
                <p className="text-xs font-medium uppercase text-violet-700">{item.recommendationType.replace(/_/g, " ")}</p>
                <p className="mt-1 font-medium text-zinc-900">{item.recommendation}</p>
                {item.reason ? <p className="mt-2 text-sm text-zinc-600"><span className="font-medium">{labels.companionAdvisor.reason}:</span> {item.reason}</p> : null}
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("companion", item.id, "acknowledge")} className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">{labels.actions.acknowledge}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("companion", item.id, "dismiss")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.dismiss}</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
