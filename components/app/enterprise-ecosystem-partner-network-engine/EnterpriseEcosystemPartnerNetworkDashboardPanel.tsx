"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseEnterpriseEcosystemPartnerNetworkCenter,
  type EnterpriseEcosystemPartnerNetworkCenter,
} from "@/lib/aipify/enterprise-ecosystem-partner-network-engine";

type Props = { labels: Record<string, string> };

function metricValue(value: unknown): string | number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return value;
  return 0;
}

function statusBadgeClass(status?: string): string {
  switch (status) {
    case "active":
    case "published":
    case "available":
    case "approved":
      return "bg-emerald-100 text-emerald-800";
    case "pending":
    case "review":
    case "limited":
    case "paused":
    case "draft":
      return "bg-amber-100 text-amber-800";
    case "suspended":
    case "archived":
    case "deprecated":
    case "unavailable":
      return "bg-red-100 text-red-800";
    default:
      return "bg-violet-100 text-violet-800";
  }
}

export function EnterpriseEcosystemPartnerNetworkDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<EnterpriseEcosystemPartnerNetworkCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/enterprise-ecosystem-partner-network-engine/dashboard");
    if (res.ok) {
      setCenter(parseEnterpriseEcosystemPartnerNetworkCenter(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.loadFailed);
    }
    setLoading(false);
  }, [labels.loadFailed]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (action: string, extra?: Record<string, unknown>) => {
    setActing(true);
    setActionError(null);
    const res = await fetch("/api/aipify/enterprise-ecosystem-partner-network-engine/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
    setActing(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <AipifyLoader label={labels.loading} centered />
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
  const exec = center.executive_dashboard ?? {};

  return (
    <div className="space-y-6">
      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-indigo-50/40 to-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.overviewTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{center.philosophy}</p>
        <p className="mt-2 text-xs text-gray-500">{center.abos_principle}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [labels.metricPartners, metricValue(overview.partners_count)],
            [labels.metricGrowthPartners, metricValue(overview.growth_partners_count)],
            [labels.metricDevelopers, metricValue(overview.developers_count)],
            [labels.metricExperts, metricValue(overview.industry_experts_count)],
            [labels.metricServiceProviders, metricValue(overview.service_providers_count)],
            [labels.metricMarketplace, metricValue(overview.marketplace_listings_count)],
            [labels.metricHealth, metricValue(overview.ecosystem_health_score)],
            [labels.metricGlobalReach, metricValue(overview.global_reach_score)],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-white bg-white/90 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {center.growth_partner_portal_route ? (
            <Link href={center.growth_partner_portal_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openGrowthPartnerPortal}
            </Link>
          ) : null}
          {center.ecosystem_governance_route ? (
            <Link href={center.ecosystem_governance_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openEcosystemGovernance}
            </Link>
          ) : null}
          {center.ecosystem_intelligence_route ? (
            <Link href={center.ecosystem_intelligence_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openEcosystemIntelligence}
            </Link>
          ) : null}
        </div>
      </section>

      <section id="partners" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.partnersTitle}</h2>
        {center.partners?.length ? (
          <ul className="mt-4 space-y-3">
            {center.partners.map((p) => (
              <li key={p.id ?? p.partner_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{p.company_name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(p.partnership_status)}`}>{p.partnership_status}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {p.partner_type} · {p.regions} · {labels.ratingLabel} {p.rating}
                </p>
                {p.summary ? <p className="mt-1 text-sm text-gray-600">{p.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noPartners}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" disabled={acting} onClick={() => void runAction("create_partner", { company_name: "New partner", partner_type: "technology" })} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50">
            {labels.createPartner}
          </button>
          <button type="button" disabled={acting} onClick={() => void runAction("approve_partner", { partner_key: "PTR-001" })} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            {labels.approvePartner}
          </button>
        </div>
      </section>

      <section id="growth-partners" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.growthPartnersTitle}</h2>
        {center.growth_partners?.length ? (
          <ul className="mt-4 space-y-3">
            {center.growth_partners.map((gp) => (
              <li key={gp.id ?? gp.growth_partner_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{gp.partner_name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(gp.status)}`}>{gp.certification_level}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {labels.commissionLabel} {gp.commission_rate_percent}% · {labels.healthLabel} {gp.partner_health_score}
                </p>
                {gp.summary ? <p className="mt-1 text-sm text-gray-600">{gp.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noGrowthPartners}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" disabled={acting} onClick={() => void runAction("grant_certification", { growth_partner_key: "GP-001", certification_level: "expert" })} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50">
            {labels.grantCertification}
          </button>
          <button type="button" disabled={acting} onClick={() => void runAction("record_commission_paid", { growth_partner_key: "GP-001", amount: "1500" })} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            {labels.recordCommission}
          </button>
        </div>
      </section>

      <section id="service-providers" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.serviceProvidersTitle}</h2>
        {center.service_providers?.length ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {center.service_providers.map((sp) => (
              <li key={sp.id ?? sp.provider_key} className="rounded-lg border border-gray-100 p-3 text-sm">
                <p className="font-medium text-gray-900">{sp.provider_name}</p>
                <p className="text-xs text-gray-500">{sp.provider_type} · {sp.regions} · {sp.availability}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noServiceProviders}</p>
        )}
        {center.industry_experts?.length ? (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-800">{labels.industryExpertsTitle}</h3>
            <ul className="mt-3 space-y-2">
              {center.industry_experts.map((ex) => (
                <li key={ex.id ?? ex.expert_key} className="text-sm text-gray-700">
                  <span className="font-medium">{ex.expert_name}</span>
                  <span className="text-xs text-gray-500"> · {ex.expertise} · {ex.customer_rating}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section id="developers" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.developerEcosystemTitle}</h2>
        {center.developer_assets?.length ? (
          <ul className="mt-4 space-y-3">
            {center.developer_assets.map((asset) => (
              <li key={asset.id ?? asset.asset_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{asset.asset_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(asset.status)}`}>{asset.asset_type}</span>
                </div>
                {asset.summary ? <p className="mt-1 text-sm text-gray-600">{asset.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noDeveloperAssets}</p>
        )}
      </section>

      <section id="marketplace" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.marketplaceTitle}</h2>
        {center.marketplace_listings?.length ? (
          <ul className="mt-4 space-y-3">
            {center.marketplace_listings.map((listing) => (
              <li key={listing.id ?? listing.listing_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{listing.listing_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(listing.status)}`}>{listing.listing_type}</span>
                </div>
                {listing.summary ? <p className="mt-1 text-sm text-gray-600">{listing.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noMarketplace}</p>
        )}
        {center.partner_success?.length ? (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-800">{labels.partnerSuccessTitle}</h3>
            <ul className="mt-3 space-y-2">
              {center.partner_success.map((ps) => (
                <li key={ps.id ?? ps.success_key} className="flex flex-wrap justify-between gap-2 text-sm text-gray-700">
                  <span>{ps.partner_name}</span>
                  <span className="text-xs text-gray-500">{labels.healthLabel} {ps.partner_health}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <button type="button" disabled={acting} onClick={() => void runAction("create_marketplace_listing", { listing_title: "Partner service", listing_type: "partner_service" })} className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50">
          {labels.createListing}
        </button>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.intelligenceTitle}</h2>
          {center.intelligence_signals?.length ? (
            <ul className="mt-4 space-y-3">
              {center.intelligence_signals.map((s) => (
                <li key={s.id ?? s.signal_type} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{s.observation}</p>
                  {s.recommendation ? <p className="mt-1 text-sm text-gray-600">{labels.recommendation}: {s.recommendation}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noIntelligence}</p>
          )}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.advisorTitle}</h2>
          {center.advisor_signals?.length ? (
            <ul className="mt-4 space-y-3">
              {center.advisor_signals.map((s) => (
                <li key={s.id ?? s.signal_type} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{s.observation}</p>
                  {s.recommendation ? <p className="mt-1 text-sm text-gray-600">{labels.recommendation}: {s.recommendation}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noAdvisor}</p>
          )}
        </section>
      </div>

      <section id="governance" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.governanceTitle}</h2>
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          <li>{labels.governanceVerification}</li>
          <li>{labels.governanceCertification}</li>
          <li>{labels.governancePayout}</li>
          <li>{labels.governanceMarketplace}</li>
          <li>{labels.governanceAudit}</li>
        </ul>
        <button type="button" disabled={acting} onClick={() => void runAction("suspend_partner", { partner_key: "PTR-003" })} className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50">
          {labels.suspendPartner}
        </button>
        <p className="mt-4 text-xs text-gray-500">{center.distinction_note}</p>
      </section>

      <section id="analytics" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.analyticsTitle}</h2>
        {center.audit_logs?.length ? (
          <ul className="mt-4 space-y-2">
            {center.audit_logs.map((log) => (
              <li key={String(log.id)} className="flex justify-between gap-4 text-sm text-gray-700">
                <span>{String(log.summary ?? "")}</span>
                <span className="shrink-0 text-xs uppercase text-gray-400">{String(log.event_type ?? "")}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noAudit}</p>
        )}
        <button type="button" disabled={acting} onClick={() => void runAction("refresh_analytics")} className="mt-4 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
          {labels.refreshAnalytics}
        </button>
      </section>

      <section className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">{labels.executiveTitle}</p>
        <p className="mt-1">
          {labels.executiveSummary}: {labels.networkLabel} {String(exec.partner_network ?? "—")} · {labels.reachLabel}{" "}
          {String(exec.global_reach ?? "—")} · {labels.revenueLabel} {String(exec.partner_revenue_index ?? "—")} · {labels.activityLabel}{" "}
          {String(exec.marketplace_activity ?? "—")}
        </p>
        {center.privacy_note ? <p className="mt-2">{center.privacy_note}</p> : null}
      </section>
    </div>
  );
}
