import type { ReactNode } from "react";
import Link from "next/link";
import { PublicCTA, PublicPageHero } from "@/components/marketing/public";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import { formatMarketingPlanLabel, type MarketingPlanLabelMap } from "@/lib/marketing/business-packs/plan-labels";
import type {
  BusinessPackDetailPackContent,
  BusinessPackDetailSharedLabels,
} from "@/lib/marketing/business-packs/parse-detail-page";
import {
  buildMarketingBusinessPackPrimaryCtaHref,
} from "@/lib/marketing/business-packs/registration-url";
import type { MarketingBusinessPackRegistryEntry } from "@/lib/marketing/business-packs/registry";
import { MARKETING_PRIMARY_CTA_HREFS } from "@/lib/marketing/primary-ctas";

type RelatedPackLink = { slug: string; name: string; href: string };

type BusinessPackDetailPageContentProps = {
  entry: MarketingBusinessPackRegistryEntry;
  content: BusinessPackDetailPackContent;
  labels: BusinessPackDetailSharedLabels;
  catalog: { audience: string; value: string };
  relatedPacks: RelatedPackLink[];
};

function SectionShell({
  id,
  title,
  alt = false,
  children,
}: {
  id: string;
  title: string;
  alt?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={alt ? AipifyMarketingClasses.sectionAlt : undefined}
      aria-labelledby={`${id}-title`}
    >
      <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id={`${id}-title`} className={PublicMarketingClasses.sectionHeading}>{title}</h2>
        {children}
      </div>
    </section>
  );
}

export default function BusinessPackDetailPageContent({
  entry,
  content,
  labels,
  catalog,
  relatedPacks,
}: BusinessPackDetailPageContentProps) {
  const primaryHref = buildMarketingBusinessPackPrimaryCtaHref(entry.slug);
  const planLabel = formatMarketingPlanLabel(entry.minPlan, labels.planNames as MarketingPlanLabelMap);
  const commercialLabel = labels.commercialTypes[entry.commercialType];

  return (
    <>
      <PublicPageHero
        eyebrow={content.label}
        title={content.headline}
        subtitle={content.introduction}
        breadcrumbs={[
          { label: labels.breadcrumbs.home, href: "/" },
          { label: labels.breadcrumbs.businessPacks, href: "/pricing#business-packs" },
          { label: content.name },
        ]}
        primaryCta={{
          label: content.primaryCta,
          href: primaryHref,
          analyticsId: `business_pack_${entry.slug}_hero_primary`,
        }}
        secondaryCta={{
          label: labels.ctas.bookDemo,
          href: MARKETING_PRIMARY_CTA_HREFS.bookDemo,
          analyticsId: `business_pack_${entry.slug}_hero_demo`,
        }}
      />

      <section className="border-b border-aipify-border bg-aipify-surface">
        <div className="mx-auto max-w-[90rem] px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className={PublicMarketingClasses.card}>
                <p className="text-xs font-semibold uppercase tracking-wide text-aipify-text-muted">
                  {labels.availableFrom}
                </p>
                <p className="mt-2 text-lg font-semibold text-aipify-text">{planLabel}</p>
                <p className="mt-1 text-sm font-medium text-aipify-companion">{commercialLabel}</p>
              </div>
              <div className={PublicMarketingClasses.card}>
                <p className="text-xs font-semibold uppercase tracking-wide text-aipify-text-muted">
                  {labels.sections.whoFor}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{catalog.audience}</p>
              </div>
            </div>

            <div className={PublicMarketingClasses.card}>
              <p className="text-xs font-semibold uppercase tracking-wide text-aipify-companion">
                {labels.sections.heroPanel}
              </p>
              <ul className="mt-4 space-y-2.5">
                {content.heroCapabilities.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-aipify-text-secondary">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-aipify-companion"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <SectionShell id="business-value" title={labels.sections.businessValue}>
        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {content.outcomes.map((outcome) => (
            <li key={outcome.title} className={PublicMarketingClasses.card}>
              <h3 className="text-lg font-semibold text-aipify-text">{outcome.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-aipify-text-secondary">{outcome.body}</p>
            </li>
          ))}
        </ul>
      </SectionShell>

      <SectionShell id="capabilities" title={labels.sections.capabilities} alt>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.capabilities.map((capability) => (
            <li
              key={capability}
              className="rounded-xl border border-aipify-border bg-aipify-surface px-4 py-3.5 text-sm text-aipify-text-secondary"
            >
              {capability}
            </li>
          ))}
        </ul>
      </SectionShell>

      <SectionShell id="how-it-works" title={labels.sections.howItWorks}>
        <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {content.steps.map((step, index) => (
            <li key={step.title} className={PublicMarketingClasses.card}>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-aipify-companion text-sm font-bold text-white">
                {index + 1}
              </span>
              <h3 className="mt-4 text-base font-semibold text-aipify-text">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{step.body}</p>
            </li>
          ))}
        </ol>
      </SectionShell>

      <SectionShell id="governance" title={labels.sections.governance} alt>
        <div className="mt-8 max-w-3xl">
          {content.governanceTitle ? (
            <h3 className="text-lg font-semibold text-aipify-text">{content.governanceTitle}</h3>
          ) : null}
          <p className="mt-4 text-base leading-relaxed text-aipify-text-secondary">{content.governanceBody}</p>
        </div>
      </SectionShell>

      <SectionShell id="who-it-is-for" title={labels.sections.whoFor}>
        <div className="mt-8 max-w-3xl">
          {content.whoForTitle ? (
            <h3 className="text-lg font-semibold text-aipify-text">{content.whoForTitle}</h3>
          ) : null}
          <p className="mt-4 text-base leading-relaxed text-aipify-text-secondary">{content.whoForBody}</p>
        </div>
      </SectionShell>

      <SectionShell id="plan-activation" title={labels.sections.planActivation} alt>
        <div className="mt-8 max-w-3xl">
          {content.planActivationTitle ? (
            <h3 className="text-lg font-semibold text-aipify-text">{content.planActivationTitle}</h3>
          ) : null}
          <p className="mt-4 text-base leading-relaxed text-aipify-text-secondary">{content.planActivationBody}</p>
          <p className="mt-6 text-sm font-medium text-aipify-text-secondary">
            {labels.availableFrom}{" "}
            <span className="text-aipify-text">{planLabel}</span>
            <span className="mx-2 text-aipify-border-strong">·</span>
            <span className="text-aipify-companion">{commercialLabel}</span>
          </p>
        </div>
      </SectionShell>

      <PublicCTA
        title={content.finalCtaTitle}
        subtitle={content.finalCtaSubtitle}
        primaryLabel={content.primaryCta}
        primaryHref={primaryHref}
        secondaryLabel={labels.ctas.bookDemo}
        secondaryHref={MARKETING_PRIMARY_CTA_HREFS.bookDemo}
        analyticsPrimary={`business_pack_${entry.slug}_final_primary`}
        analyticsSecondary={`business_pack_${entry.slug}_final_demo`}
      />

      {relatedPacks.length > 0 ? (
        <section className="border-t border-aipify-border" aria-labelledby="related-packs-title">
          <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8">
            <h2 id="related-packs-title" className={PublicMarketingClasses.sectionHeading}>
              {labels.sections.relatedPacks}
            </h2>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPacks.map((pack) => (
                <li key={pack.slug} className={PublicMarketingClasses.cardInteractive}>
                  <h3 className="text-lg font-semibold text-aipify-text">{pack.name}</h3>
                  <Link
                    href={pack.href}
                    className={`mt-4 inline-block text-sm font-semibold ${PublicMarketingClasses.link}`}
                    {...marketingDataAttr("cta_click", `business_pack_related_${pack.slug}`)}
                  >
                    {labels.ctas.viewDetails} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
