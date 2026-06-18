"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseGlobalBusinessNetworkAction,
  parseGlobalBusinessNetworkCenter,
  type CollaborationItem,
  type CompanionNetworkItem,
  type ExecutiveNetworkMetric,
  type GlobalBusinessNetworkCenter,
  type GrowthPartnerNetworkItem,
  type NetworkOpportunity,
  type NetworkSectionItem,
  type OrganizationProfile,
  type SmartMatch,
  type TrustedVendor,
} from "@/lib/global-business-network-center";
import type { GlobalBusinessNetworkCenterLabels } from "@/lib/global-business-network-center/labels";
import { NetworkStatusBadge } from "./NetworkStatusBadge";
import { VerificationBadge } from "./VerificationBadge";

type Props = { labels: GlobalBusinessNetworkCenterLabels };

function SectionCard({ title, items }: { title: string; items: NetworkSectionItem[] }) {
  if (items.length === 0) return null;
  const item = items[0];
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{title}</p>
      <p className="mt-1 font-semibold text-zinc-900">{item.title}</p>
      {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
      {item.metricValue ? <p className="mt-2 text-lg font-bold text-sky-900">{item.metricLabel}: {item.metricValue}</p> : null}
    </div>
  );
}

export function GlobalBusinessNetworkCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<GlobalBusinessNetworkCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/network");
    if (res.ok) setCenter(parseGlobalBusinessNetworkCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handleAction = async (itemType: string, id: string, action: string) => {
    setBusy(true);
    const res = await fetch("/api/network", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "manage", item_type: itemType, item_id: id, manage_action: action }),
    });
    if (parseGlobalBusinessNetworkAction(await res.json()).ok) await load();
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

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-600">{labels.philosophy}</p>
          {center.governanceNote ? <p className="mt-2 text-sm font-medium text-sky-900">{center.governanceNote}</p> : null}
          {center.privacyNote ? <p className="mt-2 text-xs text-zinc-500">{center.privacyNote}</p> : null}
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link href="/app/ecosystem" className="text-sky-700 hover:underline">{labels.links.ecosystem}</Link>
            <Link href="/app/growth-partner-operations" className="text-sky-700 hover:underline">{labels.links.growthPartners}</Link>
          </div>
        </div>
        <button type="button" disabled={busy} onClick={() => void load()} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.refresh}</button>
      </div>

      <section className="rounded-2xl border border-sky-100 bg-sky-50/40 p-5">
        <h2 className="text-lg font-semibold text-zinc-900">{labels.networkSettings.title}</h2>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-700">
          <span>{center.networkSettings.networkEnabled ? labels.networkSettings.enabled : labels.accessDenied}</span>
          {center.networkSettings.publicProfileEnabled ? <span>{labels.networkSettings.publicProfile}</span> : null}
          {center.networkSettings.connectionRequestsEnabled ? <span>{labels.networkSettings.connections}</span> : null}
        </div>
      </section>

      {center.executiveDashboard.length > 0 ? (
        <section className="rounded-2xl border border-sky-200 bg-sky-50/40 p-5">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.executiveDashboard.title}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {center.executiveDashboard.map((m: ExecutiveNetworkMetric) => (
              <div key={m.id} className="rounded-xl border border-sky-100 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 capitalize">{m.metricKey.replace(/_/g, " ")}</p>
                <p className="mt-1 text-2xl font-bold text-sky-900">{m.metricValue}</p>
                {m.trendLabel ? <p className="mt-1 text-xs text-zinc-600">{m.trendLabel}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <SectionCard title={labels.sections.organizations} items={center.sections.organizations} />
        <SectionCard title={labels.sections.partners} items={center.sections.partners} />
        <SectionCard title={labels.sections.vendors} items={center.sections.vendors} />
        <SectionCard title={labels.sections.serviceProviders} items={center.sections.serviceProviders} />
        <SectionCard title={labels.sections.growthPartners} items={center.sections.growthPartners} />
        <SectionCard title={labels.sections.opportunities} items={center.sections.opportunities} />
        <SectionCard title={labels.sections.introductions} items={center.sections.introductions} />
        <SectionCard title={labels.sections.collaboration} items={center.sections.collaboration} />
      </div>

      {center.organizationProfiles.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.organizationProfiles.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {center.organizationProfiles.map((p: OrganizationProfile) => (
              <div key={p.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-zinc-900">{p.companyName}</p>
                  <VerificationBadge status={p.verificationStatus} labels={labels.verification} />
                </div>
                <p className="mt-1 text-sm text-zinc-600">{labels.industry}: {p.industry} · {labels.country}: {p.country}</p>
                <p className="mt-1 text-sm text-zinc-600">{labels.languages}: {p.languagesLabel}</p>
                <p className="mt-2 text-sm text-zinc-600">{labels.services}: {p.servicesLabel}</p>
                <p className="mt-1 text-sm text-zinc-600">{labels.products}: {p.productsLabel}</p>
                <p className="mt-1 text-sm text-sky-800">{labels.businessPacks}: {p.businessPacksLabel}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.opportunityMarketplace.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.opportunityMarketplace.title}</h2>
          <ul className="space-y-3">
            {center.opportunityMarketplace.map((o: NetworkOpportunity) => (
              <li key={o.id} className="rounded-xl border border-sky-100 bg-sky-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-sky-700">{o.opportunityType.replace(/_/g, " ")}</p>
                    <p className="mt-1 font-medium text-zinc-900">{o.title}</p>
                    {o.summary ? <p className="mt-1 text-sm text-zinc-600">{o.summary}</p> : null}
                    <p className="mt-2 text-xs text-zinc-500">{labels.industry}: {o.industry} · {labels.location}: {o.locationLabel}</p>
                  </div>
                  <NetworkStatusBadge statusKey={o.statusKey} labels={labels.status} />
                </div>
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("opportunity", o.id, "acknowledge")} className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">{labels.actions.acknowledge}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("opportunity", o.id, "escalate")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.escalate}</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.smartMatching.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.smartMatching.title}</h2>
          <ul className="space-y-3">
            {center.smartMatching.map((m: SmartMatch) => (
              <li key={m.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium uppercase text-sky-700">{m.matchType.replace(/_/g, " ")}</p>
                <p className="mt-1 font-medium text-zinc-900">{m.matchName}</p>
                {m.matchReason ? <p className="mt-2 text-sm text-zinc-600">{m.matchReason}</p> : null}
                <p className="mt-2 text-xs text-zinc-500">{labels.industry}: {m.industry} · {labels.location}: {m.locationLabel} · {labels.confidence}: {m.confidenceLabel}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.trustedVendorDirectory.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.trustedVendorDirectory.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {center.trustedVendorDirectory.map((v: TrustedVendor) => (
              <div key={v.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-zinc-900">{v.vendorName}</p>
                  <VerificationBadge status={v.verificationStatus} labels={labels.verification} />
                </div>
                <p className="mt-1 text-sm text-zinc-600">{labels.industry}: {v.industry} · {labels.country}: {v.country}</p>
                <p className="mt-2 text-sm text-zinc-600">{labels.rating}: {v.ratingLabel}</p>
                <p className="mt-1 text-sm text-sky-800">{labels.specialties}: {v.specialtiesLabel}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.growthPartnerNetwork.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.growthPartnerNetwork.title}</h2>
          <ul className="space-y-3">
            {center.growthPartnerNetwork.map((g: GrowthPartnerNetworkItem) => (
              <li key={g.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="font-medium text-zinc-900">{g.partnerName}</p>
                <p className="mt-1 text-sm text-zinc-600">{labels.territory}: {g.territoryLabel}</p>
                <p className="mt-2 text-sm text-zinc-600">{labels.prospects}: {g.prospectsLabel} · {labels.team}: {g.teamLabel}</p>
                <p className="mt-1 text-sm text-zinc-600">{g.opportunitiesLabel} · {labels.performance}: {g.performanceLabel}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.collaborationCenter.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.collaborationCenter.title}</h2>
          <ul className="space-y-3">
            {center.collaborationCenter.map((c: CollaborationItem) => (
              <li key={c.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-500">{c.collaborationType.replace(/_/g, " ")}</p>
                    <p className="mt-1 font-medium text-zinc-900">{c.title}</p>
                    {c.partnerName ? <p className="mt-1 text-sm text-zinc-600">{c.partnerName}</p> : null}
                    {c.summary ? <p className="mt-1 text-sm text-zinc-600">{c.summary}</p> : null}
                  </div>
                  <NetworkStatusBadge statusKey={c.statusKey} labels={labels.status} />
                </div>
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("collaboration", c.id, "connect")} className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">{labels.actions.connect}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("collaboration", c.id, "escalate")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.escalate}</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.companionAdvisor.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.companionAdvisor.title}</h2>
          <ul className="space-y-3">
            {center.companionAdvisor.map((item: CompanionNetworkItem) => (
              <li key={item.id} className="rounded-xl border border-sky-200 bg-sky-50/30 p-4">
                <p className="text-xs font-medium uppercase text-sky-700">{item.recommendationType.replace(/_/g, " ")}</p>
                <p className="mt-1 font-medium text-zinc-900">{item.recommendation}</p>
                {item.reason ? <p className="mt-2 text-sm text-zinc-600"><span className="font-medium">{labels.companionAdvisor.reason}:</span> {item.reason}</p> : null}
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("companion", item.id, "acknowledge")} className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">{labels.actions.acknowledge}</button>
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
