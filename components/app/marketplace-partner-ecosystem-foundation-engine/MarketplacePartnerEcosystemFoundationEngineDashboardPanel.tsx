"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  getPartnerTierLabel,
  parseMarketplacePartnerEcosystemFoundationEngineDashboard,
  type ConnectorMarketplaceEntry,
  type EcosystemObjective,
  type IndustryPack,
  type MarketplacePartnerEcosystemFoundationEngineDashboard,
  type PartnerCapability,
  type PartnerObjective,
  type PartnerRecord,
  type PartnerTier,
} from "@/lib/aipify/marketplace-partner-ecosystem-foundation-engine";

type Props = { labels: Record<string, string> };

function badgeClass(value?: string) {
  switch (value) {
    case "approved":
    case "certified":
    case "excellent":
      return "bg-emerald-100 text-emerald-800";
    case "pending":
    case "sales_representative":
    case "registered":
      return "bg-amber-100 text-amber-800";
    case "suspended":
      return "bg-rose-100 text-rose-800";
    case "expert":
    case "sales_expert":
    case "strategic":
    case "advanced":
      return "bg-indigo-100 text-indigo-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function MarketplacePartnerEcosystemFoundationEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<MarketplacePartnerEcosystemFoundationEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/marketplace-partner-ecosystem-foundation-engine/dashboard");
    if (res.ok) setDashboard(parseMarketplacePartnerEcosystemFoundationEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const partnerAction = async (partnerId: string, action: "approve" | "suspend" | "recertify") => {
    setBusyId(partnerId);
    setActionError(null);
    const res = await fetch(`/api/aipify/marketplace-partner-ecosystem-foundation-engine/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partner_id: partnerId }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
    setBusyId(null);
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const activation = dashboard.ecosystem_activation_summary;
  const partnerEngagement = dashboard.partner_engagement_summary;
  const allLinks = [
    ...(dashboard.integration_links ?? []),
    ...(dashboard.penbp_integration_links ?? []),
    ...(dashboard.egmibp_integration_links ?? []),
  ];
  const salesExpertLink = dashboard.sales_expert_os_link;
  const ecosystemGrowth = dashboard.ecosystem_growth_summary;
  const salesSignals = ecosystemGrowth?.sales_expert_signal_counts;

  return (
    <div className="space-y-6">
      {salesExpertLink?.route ? (
        <Link
          href={salesExpertLink.route}
          className="inline-flex rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-medium text-teal-900"
        >
          {salesExpertLink.label ?? labels.salesExpertPortal}
        </Link>
      ) : null}
      {allLinks.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {allLinks.map((link) =>
            link.route ? (
              <Link key={`${link.key ?? link.route}-${link.label}`} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
                {link.label ?? link.key?.replace(/_/g, " ")}
              </Link>
            ) : null
          )}
        </div>
      ) : null}

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold text-indigo-900">{labels.engineTitle}</h2>
        {dashboard.mission ? (
          <p className="mt-2 text-sm font-medium text-indigo-900">{dashboard.mission}</p>
        ) : null}
        <p className="mt-2 text-sm text-indigo-900">{dashboard.philosophy}</p>
        {dashboard.abos_principle ? (
          <p className="mt-2 text-xs text-indigo-800">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.implementation_blueprint?.title ? (
          <p className="mt-1 text-xs text-indigo-700">
            {dashboard.implementation_blueprint.title}
            {dashboard.implementation_blueprint.phase ? ` · Phase ${dashboard.implementation_blueprint.phase}` : ""}
          </p>
        ) : null}
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      {activation ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.ecosystemActivationSummary}</h3>
          {activation.activation_summary ? (
            <p className="mt-2 text-sm text-gray-700">{activation.activation_summary}</p>
          ) : null}
          <div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-3">
            <span>{labels.activeIntegrations}: {activation.active_integrations ?? 0}</span>
            <span>{labels.activeBusinessPacks}: {activation.active_business_packs ?? 0}</span>
            <span>{labels.enabledModules}: {activation.enabled_modules ?? 0}</span>
            <span>{labels.approvedPartnersCount}: {activation.approved_partners ?? 0}</span>
            <span>{labels.publishedOfferingsCount}: {activation.published_offerings ?? 0}</span>
            <span>{labels.pendingIntegrations}: {activation.pending_integrations ?? 0}</span>
          </div>
        </section>
      ) : null}

      {dashboard.ecosystem_objectives && dashboard.ecosystem_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.ecosystemObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.ecosystem_objectives.map((objective) => (
              <EcosystemObjectiveCard key={objective.key ?? objective.label} objective={objective} labels={labels} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.industry_packs && dashboard.industry_packs.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.industryPacks}</h3>
          <p className="mt-1 text-xs text-gray-500">{labels.industryPacksNote}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.industry_packs.map((pack) => (
              <IndustryPackCard key={pack.pack_key ?? pack.display_name} pack={pack} labels={labels} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.connector_marketplace && dashboard.connector_marketplace.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.connectorMarketplace}</h3>
          <p className="mt-1 text-xs text-gray-500">{labels.connectorMarketplaceNote}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {dashboard.connector_marketplace.map((connector) => (
              <ConnectorCard key={connector.connector_key ?? connector.label} connector={connector} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.knowledge_packs?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.knowledgePacks}</h3>
          <p className="mt-2 text-gray-600">{dashboard.knowledge_packs.principle}</p>
          {dashboard.knowledge_packs.pack_types && dashboard.knowledge_packs.pack_types.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-gray-600">
              {dashboard.knowledge_packs.pack_types.map((pt) => (
                <li key={pt.key ?? pt.label}>{pt.label}: {pt.description}</li>
              ))}
            </ul>
          ) : null}
          {dashboard.knowledge_packs.route ? (
            <Link href={dashboard.knowledge_packs.route} className="mt-2 inline-block text-xs text-indigo-700 underline">
              {labels.openKnowledgeCenter}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.companion_skills?.principle ? (
        <section className="rounded-lg border border-violet-100 bg-violet-50/40 p-4 text-sm text-violet-900">
          <h3 className="text-sm font-semibold">{labels.companionSkills}</h3>
          <p className="mt-1 text-xs uppercase tracking-wide text-violet-700">{labels.futureScaffold}</p>
          <p className="mt-2">{dashboard.companion_skills.principle}</p>
          {dashboard.companion_skills.companions && dashboard.companion_skills.companions.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {dashboard.companion_skills.companions.map((companion) =>
                companion.route ? (
                  <Link key={companion.key ?? companion.label} href={companion.route} className="rounded border border-violet-200 px-2 py-1 text-xs">
                    {companion.label}
                  </Link>
                ) : null
              )}
            </div>
          ) : null}
        </section>
      ) : null}

      {Array.isArray(dashboard.success_criteria) && dashboard.success_criteria.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.successCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.success_criteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              const note = typeof item.note === "string" ? item.note : null;
              return (
                <li key={item.key ?? label}>
                  <span className={met ? "text-green-800" : "text-gray-700"}>
                    {met ? "✓" : "○"} {label}
                  </span>
                  {note ? <p className="text-xs text-gray-500">{note}</p> : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {dashboard.self_love_connection?.principle ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.selfLoveConnection}</h3>
          <p className="mt-2">{dashboard.self_love_connection.principle}</p>
          {dashboard.self_love_connection.route ? (
            <Link href={dashboard.self_love_connection.route} className="mt-2 inline-block text-xs underline">
              {labels.openSelfLove}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.trust_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.trustConnection}</h3>
          <p className="mt-2 text-gray-600">{dashboard.trust_connection.principle}</p>
        </section>
      ) : null}

      {dashboard.quality_guardian_connection?.principle ? (
        <section className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-4 text-sm text-emerald-900">
          <h3 className="text-sm font-semibold">{labels.qualityGuardianConnection}</h3>
          <p className="mt-2">{dashboard.quality_guardian_connection.principle}</p>
          {dashboard.quality_guardian_connection.route ? (
            <Link href={dashboard.quality_guardian_connection.route} className="mt-2 inline-block text-xs underline">
              {labels.openQualityGuardian}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.dogfooding?.principle ? (
        <section className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm">
          <h3 className="text-sm font-semibold text-gray-800">{labels.dogfooding}</h3>
          <p className="mt-2 text-xs text-gray-600">{dashboard.dogfooding.principle}</p>
          {dashboard.dogfooding.aipify_group?.note ? (
            <p className="mt-2 text-xs text-gray-600"><strong>Aipify Group:</strong> {dashboard.dogfooding.aipify_group.note}</p>
          ) : null}
          {dashboard.dogfooding.unonight?.note ? (
            <p className="mt-1 text-xs text-gray-600"><strong>Unonight:</strong> {dashboard.dogfooding.unonight.note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.vision_phrases && dashboard.vision_phrases.length > 0 ? (
        <section className="rounded-lg border border-indigo-100 bg-indigo-50/30 px-4 py-3">
          <h3 className="text-sm font-semibold text-indigo-900">{labels.visionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-indigo-800">
            {dashboard.vision_phrases.map((phrase) => <li key={phrase}>{phrase}</li>)}
          </ul>
        </section>
      ) : null}

      {dashboard.partner_mission ? (
        <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
          <h2 className="text-sm font-semibold text-violet-900">{labels.partnerExpertNetworkTitle}</h2>
          <p className="mt-1 text-xs uppercase tracking-wide text-violet-700">{labels.blueprintPhase33}</p>
          <p className="mt-2 text-sm font-medium text-violet-900">{dashboard.partner_mission}</p>
          {dashboard.partner_philosophy ? (
            <p className="mt-2 text-sm text-violet-900">{dashboard.partner_philosophy}</p>
          ) : null}
          {dashboard.partner_abos_principle ? (
            <p className="mt-2 text-xs text-violet-800">{dashboard.partner_abos_principle}</p>
          ) : null}
          {dashboard.blueprint_distinction_note ? (
            <p className="mt-2 text-xs text-violet-700">{dashboard.blueprint_distinction_note}</p>
          ) : null}
        </section>
      ) : null}

      {partnerEngagement ? (
        <section className="rounded-lg border border-violet-100 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.partnerEngagementSummary}</h3>
          {partnerEngagement.tier_summary ? (
            <p className="mt-2 text-sm text-gray-700">{partnerEngagement.tier_summary}</p>
          ) : null}
          <div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-3">
            <span>{labels.salesRepresentativePartners}: {partnerEngagement.sales_representative_partners ?? 0}</span>
            <span>{labels.salesExpertPartners}: {partnerEngagement.sales_expert_partners ?? 0}</span>
            <span>{labels.certifiedPartners}: {partnerEngagement.certified_partners ?? 0}</span>
            <span>{labels.expertPartners}: {partnerEngagement.expert_partners ?? 0}</span>
            <span>{labels.pendingReviews}: {partnerEngagement.pending_reviews ?? 0}</span>
            <span>{labels.publishedOfferingsCount}: {partnerEngagement.published_offerings ?? 0}</span>
          </div>
        </section>
      ) : null}

      {dashboard.partner_objectives && dashboard.partner_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.partnerObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.partner_objectives.map((objective) => (
              <PartnerObjectiveCard key={objective.key ?? objective.label} objective={objective} labels={labels} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.partner_tiers && dashboard.partner_tiers.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.partnerTiers}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.partner_tiers.map((tier) => (
              <PartnerTierCard key={tier.tier_key ?? tier.display_name} tier={tier} labels={labels} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.partner_capabilities && dashboard.partner_capabilities.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.partnerCapabilities}</h3>
          <ul className="mt-2 space-y-2 text-sm text-gray-600">
            {dashboard.partner_capabilities.map((cap) => (
              <li key={cap.key ?? cap.label}>
                <span className="font-medium text-gray-800">{cap.label}</span>
                {cap.description ? <span className="text-gray-500"> — {cap.description}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.partner_marketplace_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.partnerMarketplaceConnection}</h3>
          <p className="mt-2 text-gray-600">{dashboard.partner_marketplace_connection.principle}</p>
          {dashboard.partner_marketplace_connection.discovery_steps && dashboard.partner_marketplace_connection.discovery_steps.length > 0 ? (
            <ol className="mt-2 list-inside list-decimal space-y-1 text-xs text-gray-600">
              {dashboard.partner_marketplace_connection.discovery_steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          ) : null}
        </section>
      ) : null}

      {dashboard.partner_portal_terminology?.principle ? (
        <section className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 text-sm">
          <h3 className="text-sm font-semibold text-slate-900">{labels.partnerPortalTerminology}</h3>
          <p className="mt-2 text-slate-700">{dashboard.partner_portal_terminology.principle}</p>
          {dashboard.partner_portal_terminology.preferred_terms && dashboard.partner_portal_terminology.preferred_terms.length > 0 ? (
            <ul className="mt-3 space-y-1 text-xs text-slate-700">
              {dashboard.partner_portal_terminology.preferred_terms.map((term) => (
                <li key={term.key ?? term.label}>
                  <span className="font-medium">{term.label}</span>
                  {term.replaces ? <span className="text-slate-500"> — replaces {term.replaces}</span> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.compensation_principle?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.compensationPrinciple}</h3>
          <p className="mt-2 text-gray-600">{dashboard.compensation_principle.principle}</p>
        </section>
      ) : null}

      {dashboard.certification_connection?.principle ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/40 p-4 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.certificationConnection}</h3>
          <p className="mt-2">{dashboard.certification_connection.principle}</p>
          {dashboard.certification_connection.pathways && dashboard.certification_connection.pathways.length > 0 ? (
            <ul className="mt-2 space-y-1 text-xs">
              {dashboard.certification_connection.pathways.map((pathway) => (
                <li key={pathway.key ?? pathway.label}>
                  <span className="font-medium">{pathway.label}</span>
                  {pathway.description ? `: ${pathway.description}` : ""}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            {dashboard.certification_connection.certification_route ? (
              <Link href={dashboard.certification_connection.certification_route} className="text-xs underline">
                {labels.openCertificationEngine}
              </Link>
            ) : null}
            {dashboard.certification_connection.training_route ? (
              <Link href={dashboard.certification_connection.training_route} className="text-xs underline">
                {labels.openLearningTraining}
              </Link>
            ) : null}
            {dashboard.certification_connection.partners_route ? (
              <Link href={dashboard.certification_connection.partners_route} className="text-xs underline">
                {labels.openPartnerPortal}
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}

      {Array.isArray(dashboard.blueprint_success_criteria) && dashboard.blueprint_success_criteria.length > 0 ? (
        <section className="rounded-lg border border-violet-100 bg-violet-50/30 p-4">
          <h3 className="text-sm font-semibold text-violet-900">{labels.blueprintSuccessCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.blueprint_success_criteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              const note = typeof item.note === "string" ? item.note : null;
              return (
                <li key={item.key ?? label}>
                  <span className={met ? "text-green-800" : "text-gray-700"}>
                    {met ? "✓" : "○"} {label}
                  </span>
                  {note ? <p className="text-xs text-gray-500">{note}</p> : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {dashboard.partner_self_love_connection?.principle ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.partnerSelfLoveConnection}</h3>
          <p className="mt-2">{dashboard.partner_self_love_connection.principle}</p>
          {dashboard.partner_self_love_connection.route ? (
            <Link href={dashboard.partner_self_love_connection.route} className="mt-2 inline-block text-xs underline">
              {labels.openSelfLove}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.partner_trust_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.partnerTrustConnection}</h3>
          <p className="mt-2 text-gray-600">{dashboard.partner_trust_connection.principle}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {dashboard.partner_trust_connection.security_route ? (
              <Link href={dashboard.partner_trust_connection.security_route} className="text-xs text-indigo-700 underline">
                {labels.openSecurityTrust}
              </Link>
            ) : null}
            {dashboard.partner_trust_connection.trust_route ? (
              <Link href={dashboard.partner_trust_connection.trust_route} className="text-xs text-indigo-700 underline">
                {labels.openTrustReputation}
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}

      {dashboard.partner_dogfooding?.principle ? (
        <section className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm">
          <h3 className="text-sm font-semibold text-gray-800">{labels.partnerDogfooding}</h3>
          <p className="mt-2 text-xs text-gray-600">{dashboard.partner_dogfooding.principle}</p>
          {dashboard.partner_dogfooding.aipify_group?.note ? (
            <p className="mt-2 text-xs text-gray-600"><strong>Aipify Group:</strong> {dashboard.partner_dogfooding.aipify_group.note}</p>
          ) : null}
          {dashboard.partner_dogfooding.unonight?.note ? (
            <p className="mt-1 text-xs text-gray-600"><strong>Unonight:</strong> {dashboard.partner_dogfooding.unonight.note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.partner_vision_phrases && dashboard.partner_vision_phrases.length > 0 ? (
        <section className="rounded-lg border border-violet-100 bg-violet-50/30 px-4 py-3">
          <h3 className="text-sm font-semibold text-violet-900">{labels.partnerVisionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-violet-800">
            {dashboard.partner_vision_phrases.map((phrase) => <li key={phrase}>{phrase}</li>)}
          </ul>
        </section>
      ) : null}

      {dashboard.market_intelligence_mission ? (
        <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
          <h2 className="text-sm font-semibold text-teal-900">{labels.marketIntelligenceTitle}</h2>
          <p className="mt-1 text-xs uppercase tracking-wide text-teal-700">{labels.blueprintPhase51}</p>
          <p className="mt-2 text-sm font-medium text-teal-900">{dashboard.market_intelligence_mission}</p>
          {dashboard.market_intelligence_philosophy ? (
            <p className="mt-2 text-sm text-teal-900">{dashboard.market_intelligence_philosophy}</p>
          ) : null}
          {dashboard.market_intelligence_abos_principle ? (
            <p className="mt-2 text-xs text-teal-800">{dashboard.market_intelligence_abos_principle}</p>
          ) : null}
          {dashboard.market_intelligence_distinction_note ? (
            <p className="mt-2 text-xs text-teal-700">{dashboard.market_intelligence_distinction_note}</p>
          ) : null}
        </section>
      ) : null}

      {ecosystemGrowth ? (
        <section className="rounded-lg border border-teal-100 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.ecosystemGrowthSummary}</h3>
          {ecosystemGrowth.ecosystem_summary ? (
            <p className="mt-2 text-sm text-gray-700">{ecosystemGrowth.ecosystem_summary}</p>
          ) : null}
          <div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-3">
            <span>{labels.nordicPartnerIndicators}: {ecosystemGrowth.nordic_partner_indicators ?? 0}</span>
            <span>{labels.openOpportunities}: {salesSignals?.open_opportunities ?? 0}</span>
            <span>{labels.activeCustomers}: {salesSignals?.active_customers ?? 0}</span>
            <span>{labels.scheduledFollowUps}: {salesSignals?.scheduled_follow_ups ?? 0}</span>
            <span>{labels.salesExpertSignals}: {salesSignals?.total_signals ?? 0}</span>
          </div>
          {ecosystemGrowth.privacy_note ? (
            <p className="mt-2 text-xs text-gray-500">{ecosystemGrowth.privacy_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.market_intelligence_objectives && dashboard.market_intelligence_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.marketIntelligenceObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.market_intelligence_objectives.map((objective) => (
              <EcosystemObjectiveCard key={objective.key ?? objective.label} objective={objective} labels={labels} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.market_observations?.principle ? (
        <section className="rounded-lg border border-sky-100 bg-sky-50/40 p-4 text-sm text-sky-900">
          <h3 className="text-sm font-semibold">{labels.marketObservations}</h3>
          <p className="mt-2">{dashboard.market_observations.principle}</p>
          {dashboard.market_observations.companion_examples && dashboard.market_observations.companion_examples.length > 0 ? (
            <ul className="mt-3 space-y-2 text-xs">
              {dashboard.market_observations.companion_examples.map((item) => (
                <li key={item.key ?? item.example}>
                  {item.emoji ? `${item.emoji} ` : ""}{item.example}
                </li>
              ))}
            </ul>
          ) : null}
          {dashboard.market_observations.tone ? (
            <p className="mt-2 text-xs text-sky-800">{dashboard.market_observations.tone}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.industry_intelligence?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.industryIntelligence}</h3>
          <p className="mt-2 text-gray-600">{dashboard.industry_intelligence.principle}</p>
          {dashboard.industry_intelligence.signal_categories && dashboard.industry_intelligence.signal_categories.length > 0 ? (
            <ul className="mt-2 space-y-1 text-xs text-gray-600">
              {dashboard.industry_intelligence.signal_categories.map((cat) => (
                <li key={cat.key ?? cat.label}>
                  <span className="font-medium text-gray-800">{cat.label}</span>
                  {cat.description ? `: ${cat.description}` : ""}
                </li>
              ))}
            </ul>
          ) : null}
          {dashboard.industry_intelligence.industry_intelligence_route ? (
            <Link href={dashboard.industry_intelligence.industry_intelligence_route} className="mt-2 inline-block text-xs text-indigo-700 underline">
              {labels.exploreIndustryIntelligence}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.regional_insights?.principle ? (
        <section className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-4 text-sm text-emerald-900">
          <h3 className="text-sm font-semibold">{labels.regionalInsights}</h3>
          <p className="mt-2">{dashboard.regional_insights.principle}</p>
          {dashboard.regional_insights.regions && dashboard.regional_insights.regions.length > 0 ? (
            <div className="mt-3 space-y-3">
              {dashboard.regional_insights.regions.map((region) => (
                <div key={region.key ?? region.label} className="rounded border border-emerald-200/60 p-3 text-xs">
                  <p className="font-medium">{region.label}</p>
                  {region.trends && region.trends.length > 0 ? (
                    <ul className="mt-1 list-inside list-disc text-emerald-800">
                      {region.trends.map((trend) => <li key={trend}>{trend}</li>)}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.sales_expert_feedback_loops?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.salesExpertFeedbackLoops}</h3>
          <p className="mt-2 text-gray-600">{dashboard.sales_expert_feedback_loops.principle}</p>
          {dashboard.sales_expert_feedback_loops.feedback_loops && dashboard.sales_expert_feedback_loops.feedback_loops.length > 0 ? (
            <ul className="mt-2 space-y-1 text-xs text-gray-600">
              {dashboard.sales_expert_feedback_loops.feedback_loops.map((loop) => (
                <li key={loop.key ?? loop.label}>
                  <span className="font-medium text-gray-800">{loop.label}</span>
                  {loop.description ? `: ${loop.description}` : ""}
                </li>
              ))}
            </ul>
          ) : null}
          {dashboard.sales_expert_feedback_loops.sales_expert_route ? (
            <Link href={dashboard.sales_expert_feedback_loops.sales_expert_route} className="mt-2 inline-block text-xs text-indigo-700 underline">
              {labels.salesExpertPortal}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.partner_ecosystem_insights?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.partnerEcosystemInsights}</h3>
          <p className="mt-2 text-gray-600">{dashboard.partner_ecosystem_insights.principle}</p>
          {dashboard.partner_ecosystem_insights.dimensions && dashboard.partner_ecosystem_insights.dimensions.length > 0 ? (
            <ul className="mt-2 space-y-1 text-xs text-gray-600">
              {dashboard.partner_ecosystem_insights.dimensions.map((dim) => (
                <li key={dim.key ?? dim.label}>
                  <span className="font-medium text-gray-800">{dim.label}</span>
                  {dim.description ? `: ${dim.description}` : ""}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.executive_support?.principle ? (
        <section className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4 text-sm text-indigo-900">
          <h3 className="text-sm font-semibold">{labels.executiveSupport}</h3>
          <p className="mt-2">{dashboard.executive_support.principle}</p>
          {dashboard.executive_support.support_types && dashboard.executive_support.support_types.length > 0 ? (
            <ul className="mt-3 space-y-2 text-xs">
              {dashboard.executive_support.support_types.map((item) => (
                <li key={item.key ?? item.label}>
                  {item.emoji ? `${item.emoji} ` : ""}
                  <span className="font-medium">{item.label}</span>
                  {item.description ? `: ${item.description}` : ""}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {Array.isArray(dashboard.market_intelligence_success_criteria) && dashboard.market_intelligence_success_criteria.length > 0 ? (
        <section className="rounded-lg border border-teal-100 bg-teal-50/30 p-4">
          <h3 className="text-sm font-semibold text-teal-900">{labels.marketIntelligenceSuccessCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.market_intelligence_success_criteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              const note = typeof item.note === "string" ? item.note : null;
              return (
                <li key={item.key ?? label}>
                  <span className={met ? "text-green-800" : "text-gray-700"}>
                    {met ? "✓" : "○"} {label}
                  </span>
                  {note ? <p className="text-xs text-gray-500">{note}</p> : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {dashboard.market_intelligence_self_love_connection?.principle ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.marketIntelligenceSelfLove}</h3>
          <p className="mt-2">{dashboard.market_intelligence_self_love_connection.principle}</p>
          {dashboard.market_intelligence_self_love_connection.route ? (
            <Link href={dashboard.market_intelligence_self_love_connection.route} className="mt-2 inline-block text-xs underline">
              {labels.openSelfLove}
            </Link>
          ) : null}
        </section>
      ) : null}

      {dashboard.market_intelligence_trust_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold text-gray-900">{labels.marketIntelligenceTrust}</h3>
          <p className="mt-2 text-gray-600">{dashboard.market_intelligence_trust_connection.principle}</p>
        </section>
      ) : null}

      {dashboard.market_intelligence_dogfooding?.principle ? (
        <section className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm">
          <h3 className="text-sm font-semibold text-gray-800">{labels.marketIntelligenceDogfooding}</h3>
          <p className="mt-2 text-xs text-gray-600">{dashboard.market_intelligence_dogfooding.principle}</p>
          {dashboard.market_intelligence_dogfooding.aipify_group?.note ? (
            <p className="mt-2 text-xs text-gray-600"><strong>Aipify Group:</strong> {dashboard.market_intelligence_dogfooding.aipify_group.note}</p>
          ) : null}
          {dashboard.market_intelligence_dogfooding.unonight?.note ? (
            <p className="mt-1 text-xs text-gray-600"><strong>Unonight:</strong> {dashboard.market_intelligence_dogfooding.unonight.note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.market_intelligence_vision_phrases && dashboard.market_intelligence_vision_phrases.length > 0 ? (
        <section className="rounded-lg border border-teal-100 bg-teal-50/30 px-4 py-3">
          <h3 className="text-sm font-semibold text-teal-900">{labels.marketIntelligenceVision}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-teal-800">
            {dashboard.market_intelligence_vision_phrases.map((phrase) => <li key={phrase}>{phrase}</li>)}
          </ul>
        </section>
      ) : null}

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-xs text-gray-500">{labels.summary}</p>
        <pre className="mt-2 overflow-auto text-xs text-gray-700">{JSON.stringify(summary, null, 2)}</pre>
      </div>

      {dashboard.principles && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.principles.map((pr) => <li key={pr}>{pr}</li>)}
          </ul>
        </section>
      )}

      {dashboard.approved_partners && dashboard.approved_partners.length > 0 && (
        <PartnerSection title={labels.approvedPartners} partners={dashboard.approved_partners} labels={labels}
          onSuspend={(id) => void partnerAction(id, "suspend")} onRecertify={(id) => void partnerAction(id, "recertify")}
          busyId={busyId} showSuspend showRecertify />
      )}

      {dashboard.pending_partners && dashboard.pending_partners.length > 0 && (
        <PartnerSection title={labels.pendingPartners} partners={dashboard.pending_partners} labels={labels}
          onApprove={(id) => void partnerAction(id, "approve")} busyId={busyId} showApprove />
      )}

      {dashboard.offerings && dashboard.offerings.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.offerings}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.offerings.map((item, idx) => {
              const offering = item.offering as Record<string, unknown> | undefined;
              return (
                <div key={String(offering?.id ?? idx)} className="rounded-lg border border-gray-200 p-3 text-sm">
                  <p className="font-medium text-gray-800">{String(offering?.title ?? "")}</p>
                  <p className="mt-1 text-gray-600">{String(offering?.description ?? "")}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className={`rounded-full px-2 py-0.5 uppercase ${badgeClass(String(offering?.offering_type))}`}>
                      {String(offering?.offering_type ?? "")}
                    </span>
                    <span className="text-gray-500">{item.partner_name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {dashboard.certification_breakdown && (
        <JsonSection title={labels.certificationStatus} data={dashboard.certification_breakdown} />
      )}

      {dashboard.quality_indicators && (
        <JsonSection title={labels.qualityIndicators} data={dashboard.quality_indicators} />
      )}

      {dashboard.integration_notes && (
        <JsonSection title={labels.integrationNotes} data={dashboard.integration_notes} />
      )}
    </div>
  );
}

function EcosystemObjectiveCard({ objective, labels }: { objective: EcosystemObjective; labels: Record<string, string> }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3 text-sm">
      <p className="font-medium text-gray-800">{objective.label}</p>
      {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
      {objective.status === "future_scaffold" ? (
        <span className="mt-2 inline-block text-xs text-violet-700">{labels.futureScaffold}</span>
      ) : null}
      {objective.route ? (
        <Link href={objective.route} className="mt-2 inline-block text-xs text-indigo-700 underline">
          {labels.explore}
        </Link>
      ) : null}
    </div>
  );
}

function IndustryPackCard({ pack, labels }: { pack: IndustryPack; labels: Record<string, string> }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3 text-sm">
      <p className="font-medium text-gray-800">{pack.display_name}</p>
      {pack.description ? <p className="mt-1 text-xs text-gray-600">{pack.description}</p> : null}
      {pack.status === "metadata_scaffold" ? (
        <span className="mt-2 inline-block text-xs text-gray-500">{labels.metadataScaffold}</span>
      ) : null}
      {pack.route ? (
        <Link href={pack.route} className="mt-2 inline-block text-xs text-indigo-700 underline">
          {labels.exploreIndustryIntelligence}
        </Link>
      ) : null}
    </div>
  );
}

function ConnectorCard({ connector }: { connector: ConnectorMarketplaceEntry }) {
  const content = (
    <span className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
      {connector.label}
      {connector.category ? <span className="ml-2 text-xs text-gray-500">{connector.category}</span> : null}
    </span>
  );
  return connector.route ? <Link href={connector.route}>{content}</Link> : content;
}

function PartnerObjectiveCard({ objective, labels }: { objective: PartnerObjective; labels: Record<string, string> }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3 text-sm">
      <p className="font-medium text-gray-800">{objective.label}</p>
      {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
      {objective.status === "future_scaffold" ? (
        <span className="mt-2 inline-block text-xs text-violet-700">{labels.futureScaffold}</span>
      ) : null}
    </div>
  );
}

function PartnerTierCard({ tier, labels }: { tier: PartnerTier; labels: Record<string, string> }) {
  return (
    <div className="rounded-lg border border-violet-100 bg-violet-50/30 p-4 text-sm">
      <p className="font-semibold text-violet-900">{tier.display_name}</p>
      {tier.focus ? <p className="mt-1 text-xs text-violet-800">{tier.focus}</p> : null}
      {tier.requirements && tier.requirements.length > 0 ? (
        <div className="mt-2">
          <p className="text-xs font-medium text-gray-700">{labels.tierRequirements}</p>
          <ul className="mt-1 list-inside list-disc text-xs text-gray-600">
            {tier.requirements.map((req) => <li key={req}>{req}</li>)}
          </ul>
        </div>
      ) : null}
      {tier.benefits && tier.benefits.length > 0 ? (
        <div className="mt-2">
          <p className="text-xs font-medium text-gray-700">{labels.tierBenefits}</p>
          <ul className="mt-1 list-inside list-disc text-xs text-gray-600">
            {tier.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function PartnerSection({
  title, partners, labels, onApprove, onSuspend, onRecertify, busyId, showApprove, showSuspend, showRecertify,
}: {
  title: string;
  partners: PartnerRecord[];
  labels: Record<string, string>;
  onApprove?: (id: string) => void;
  onSuspend?: (id: string) => void;
  onRecertify?: (id: string) => void;
  busyId: string | null;
  showApprove?: boolean;
  showSuspend?: boolean;
  showRecertify?: boolean;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <div className="mt-3 space-y-3">
        {partners.map((partner) => (
          <div key={partner.id} className="rounded-lg border border-gray-200 p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium text-gray-800">{partner.partner_name}</span>
              <div className="flex gap-1">
                <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(partner.status)}`}>
                  {partner.status}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs ${badgeClass(partner.certification_level)}`}>
                  {partner.certification_level_label ?? getPartnerTierLabel(partner.certification_level)}
                </span>
              </div>
            </div>
            {partner.website ? <p className="mt-1 text-xs text-gray-500">{partner.website}</p> : null}
            <div className="mt-2 flex gap-2">
              {showApprove && partner.id && onApprove && (
                <button type="button" disabled={busyId === partner.id}
                  onClick={() => onApprove(partner.id!)}
                  className="rounded border border-emerald-200 px-2 py-1 text-xs text-emerald-800 disabled:opacity-50">
                  {labels.approve}
                </button>
              )}
              {showSuspend && partner.id && onSuspend && (
                <button type="button" disabled={busyId === partner.id}
                  onClick={() => onSuspend(partner.id!)}
                  className="rounded border border-rose-200 px-2 py-1 text-xs text-rose-800 disabled:opacity-50">
                  {labels.suspend}
                </button>
              )}
              {showRecertify && partner.id && onRecertify && (
                <button type="button" disabled={busyId === partner.id}
                  onClick={() => onRecertify(partner.id!)}
                  className="rounded border border-indigo-200 px-2 py-1 text-xs text-indigo-800 disabled:opacity-50">
                  {labels.recertify}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function JsonSection({ title, data }: { title: string; data: unknown }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <pre className="mt-2 overflow-auto text-xs text-gray-700">{JSON.stringify(data, null, 2)}</pre>
    </section>
  );
}
