"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseBusinessPackIdentityLanding,
  STATUS_BADGE_STYLE,
  type BusinessPackIdentityLanding,
} from "@/lib/aipify/business-pack-identity-engine";

type Props = {
  packKey: string;
  labels: Record<string, string>;
};

function PackLogo({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  if (logoUrl) {
    return (
      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoUrl} alt="" className="h-full w-full object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} />
      </div>
    );
  }
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-sm">
      {name.charAt(0)}
    </div>
  );
}

export function BusinessPackIdentityLandingPanel({ packKey, labels }: Props) {
  const [landing, setLanding] = useState<BusinessPackIdentityLanding | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/aipify/business-pack-identity-engine/landing?packKey=${encodeURIComponent(packKey)}`);
      if (!res.ok) throw new Error("failed");
      setLanding(parseBusinessPackIdentityLanding(await res.json()));
    } catch {
      setError(true);
    }
    setLoading(false);
  }, [packKey]);

  useEffect(() => { void load(); }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader label={labels.loading} />
      </div>
    );
  }

  if (error || !landing?.found || !landing.identity) {
    return (
      <PlatformEmptyState
        title={labels.notFoundTitle}
        message={labels.notFoundMessage}
        primaryAction={{ label: labels.backToMarketplace, href: "/app/marketplace/activation" }}
      />
    );
  }

  const { identity, layout, actions } = landing;
  const statusLabel = labels[`status_${identity.status}`] ?? identity.status.replace(/_/g, " ");
  const categoryLabel = labels[`category_${identity.pack_category}`] ?? identity.pack_category.replace(/_/g, " ");
  const statusStyle = STATUS_BADGE_STYLE[identity.status] ?? "bg-gray-100 text-gray-700 ring-gray-200";
  const bizValue = layout?.business_value ?? identity.business_value;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-wrap items-start gap-4 border-b border-gray-200 pb-6">
        <PackLogo name={identity.pack_name} logoUrl={identity.pack_logo_url} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{identity.pack_name}</h1>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${statusStyle}`}>
              {statusLabel}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {labels.version} {identity.version}
            <span className="mx-2">·</span>
            {categoryLabel}
          </p>
          {landing.versioning_note && (
            <p className="mt-2 text-xs text-gray-500">{landing.versioning_note}</p>
          )}
        </div>
        <Link
          href="/app/marketplace/activation"
          className="text-sm font-medium text-indigo-700 hover:text-indigo-900"
        >
          {labels.backToMarketplace}
        </Link>
      </header>

      {/* Hero */}
      <section className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-white">
        <div className="grid gap-6 p-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-lg font-medium text-gray-900">
              {layout?.hero.short_description ?? identity.short_description}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-indigo-900">
              {layout?.hero.value_statement ?? identity.business_value_statement}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {actions?.card_status === "installed" && actions.workspace_route && (
                <Link
                  href={actions.workspace_route}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  {labels.openWorkspace}
                </Link>
              )}
              {actions?.install_allowed && (
                <Link
                  href={actions.activation_route}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  {labels.install}
                </Link>
              )}
              {actions?.upgrade_route && actions.card_status === "available" && (
                <Link
                  href={actions.upgrade_route}
                  className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-100"
                >
                  {labels.upgrade}
                </Link>
              )}
              {!actions?.install_allowed && identity.status === "coming_soon" && (
                <span className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-800">
                  {labels.comingSoon}
                </span>
              )}
            </div>
          </div>
          <div className="hidden h-48 rounded-xl bg-indigo-100/60 lg:block" aria-hidden />
        </div>
      </section>

      {/* Overview */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{labels.overview}</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          {layout?.overview.long_description ?? identity.long_description}
        </p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.intendedAudience}</dt>
            <dd className="mt-1 text-sm text-gray-800">{layout?.overview.audience ?? identity.intended_audience}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.primaryUseCases}</dt>
            <dd className="mt-1">
              <ul className="space-y-1 text-sm text-gray-800">
                {(layout?.overview.use_cases ?? identity.primary_use_cases).map((item) => (
                  <li key={item} className="flex gap-2"><span className="text-indigo-500">·</span>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.expectedOutcomes}</dt>
            <dd className="mt-1">
              <ul className="space-y-1 text-sm text-gray-800">
                {(layout?.overview.outcomes ?? identity.expected_outcomes).map((item) => (
                  <li key={item} className="flex gap-2"><span className="text-emerald-500">✓</span>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </section>

      {/* Business Value */}
      <section className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-6">
        <h2 className="text-sm font-semibold text-emerald-900">{labels.businessValue}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          {bizValue.why && (
            <div>
              <dt className="text-xs font-semibold text-emerald-800">{labels.whyExists}</dt>
              <dd className="mt-1 text-sm text-emerald-950">{bizValue.why}</dd>
            </div>
          )}
          {bizValue.who_benefits && (
            <div>
              <dt className="text-xs font-semibold text-emerald-800">{labels.whoBenefits}</dt>
              <dd className="mt-1 text-sm text-emerald-950">{bizValue.who_benefits}</dd>
            </div>
          )}
          {bizValue.problems_solved && (
            <div>
              <dt className="text-xs font-semibold text-emerald-800">{labels.problemsSolved}</dt>
              <dd className="mt-1 text-sm text-emerald-950">{bizValue.problems_solved}</dd>
            </div>
          )}
          {bizValue.measurable_outcomes && (
            <div>
              <dt className="text-xs font-semibold text-emerald-800">{labels.measurableOutcomes}</dt>
              <dd className="mt-1 text-sm text-emerald-950">{bizValue.measurable_outcomes}</dd>
            </div>
          )}
        </dl>
        {identity.key_benefits.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {identity.key_benefits.map((benefit) => (
              <li key={benefit} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-emerald-900 ring-1 ring-emerald-200">
                {benefit}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Features */}
      {(layout?.features ?? identity.features).length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{labels.features}</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {(layout?.features ?? identity.features).map((feature) => (
              <li key={feature} className="flex gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-800">
                <span className="text-indigo-500">·</span>
                {feature}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Knowledge Center + Licensing */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900">{labels.knowledgeCenter}</h2>
          <p className="mt-2 text-sm text-gray-600">{labels.knowledgeCenterNote}</p>
          <Link
            href={`/app/marketplace/packs/${packKey}/knowledge`}
            className="mt-3 inline-block text-sm font-medium text-indigo-700 hover:text-indigo-900"
          >
            {labels.viewKnowledgeCenter}
          </Link>
          {identity.knowledge_center_category && (
            <Link
              href={`/app/knowledge?category=${identity.knowledge_center_category}`}
              className="mt-3 ml-4 inline-block text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              {labels.viewKnowledge}
            </Link>
          )}
        </div>
        {identity.licensing_summary && (
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900">{labels.licensing}</h2>
            <p className="mt-2 text-sm text-gray-600">{identity.licensing_summary}</p>
            <Link
              href={`/app/marketplace/packs/${packKey}/license`}
              className="mt-3 inline-block text-sm font-medium text-indigo-700 hover:text-indigo-900"
            >
              {labels.viewLicenseCenter}
            </Link>
            <Link
              href={`/app/marketplace/packs/${packKey}/languages`}
              className="mt-3 ml-4 inline-block text-sm font-medium text-indigo-700 hover:text-indigo-900"
            >
              {labels.viewLanguageCenter}
            </Link>
            <Link
              href={`/app/marketplace/packs/${packKey}/legal`}
              className="mt-3 ml-4 inline-block text-sm font-medium text-indigo-700 hover:text-indigo-900"
            >
              {labels.viewLegalCenter}
            </Link>
          </div>
        )}
      </section>

      {landing.governance_note && (
        <p className="text-center text-xs text-gray-500">{landing.governance_note}</p>
      )}
    </div>
  );
}
