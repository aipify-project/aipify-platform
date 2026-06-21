import Link from "next/link";
import { PublicPageHero, PublicCTA } from "./public";
import PricingComparisonTable from "./pricing/PricingComparisonTable";
import PricingFaqAccordion from "./pricing/PricingFaqAccordion";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import { MARKETING_PRIMARY_CTA_HREFS } from "@/lib/marketing/primary-ctas";
import { resolvePricingComparison } from "@/lib/marketing/pricing-comparison/resolve";
import type { PricingComparisonLabels } from "@/lib/marketing/pricing-comparison/types";
import {
  formatLimitValue,
  formatPublicPlanPrice,
  getPublicPlanCatalog,
  type PublicMarketingPlanKey,
} from "@/lib/marketing/public-pricing";
import type { Locale } from "@/lib/i18n/config";

type Package = {
  key: PublicMarketingPlanKey;
  name: string;
  audience: string;
  idealFor?: string;
  features: string[];
  status: string;
  statusKey?: "available" | "popular" | "enterprise";
  cta: string;
  ctaHref: string;
  detailsHref?: string;
};

type FaqItem = { question: string; answer: string };

type EnterpriseItem = { label: string; status: "available" | "custom" | "planned" | "enterprise_only" };

export type PricingPackagesPageLabels = {
  meta: { title: string; description: string };
  breadcrumbs?: { home: string; pricing: string };
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    supporting: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trustLine?: string;
  };
  plansIntro: string;
  packages: { title: string; items: Package[]; detailsLink: string };
  pricingLabels: {
    custom: string;
    perMonth: string;
    perMonthShort?: string;
    currencyPrefix?: string;
    currencySuffix: string;
    notPubliclyPriced: string;
    includes: string;
    users: string;
    domains: string;
    businessPacks: string;
    support: string;
    supportLevels: { standard: string; priority: string; dedicated: string };
  };
  growthProgression: {
    title: string;
    stages: Array<{ name: string; items: string[] }>;
  };
  businessPacks: {
    title: string;
    copy: string;
    exploreAll: string;
    pricingStatus: Record<string, string>;
    planRequirementPrefix: string;
    viewDetails: string;
  };
  businessPackModel: {
    title: string;
    steps: string[];
    note: string;
  };
  enterpriseFlexibility: {
    title: string;
    intro: string;
    items: EnterpriseItem[];
    cta: string;
  };
  included: { title: string; items: string[] };
  planComparison: PricingComparisonLabels;
  outcomes: { title: string; items: Array<{ title: string; body: string }> };
  upgradeFlow: {
    title: string;
    intro: string;
    steps: Array<{ label: string; status: "done" | "progress" | "pending" }>;
    note: string;
  };
  faq: { title: string; items: FaqItem[] };
  trustPanel: { title: string; items: string[] };
  billingArchitecture: {
    title: string;
    billing: string[];
    paymentProviders: string[];
    accounting: string;
    regionalNote: string;
    taxNote: string;
  };
  finalCta: {
    headline: string;
    subheadline: string;
    primary: string;
    secondary: string;
    tertiary: string;
  };
};

type BusinessPackPricingCard = {
  slug: string;
  name: string;
  audience: string;
  value: string;
  commercialTypeLabel: string;
  minPlanLabel: string;
  detailHref: string;
};

type Props = {
  labels: PricingPackagesPageLabels;
  locale: Locale;
  businessPackCards: BusinessPackPricingCard[];
};

const SECTION = "scroll-mt-24 py-12 sm:py-14";

const STATUS_ICONS: Record<EnterpriseItem["status"], string> = {
  available: "✅",
  custom: "ℹ️",
  planned: "⏳",
  enterprise_only: "🔒",
};

function PlanCard({
  pkg,
  catalogEntry,
  pricingLabels,
  locale,
  detailsLink,
}: {
  pkg: Package;
  catalogEntry: ReturnType<typeof getPublicPlanCatalog>[number];
  pricingLabels: PricingPackagesPageLabels["pricingLabels"];
  locale: Locale;
  detailsLink: string;
}) {
  const isPopular = pkg.statusKey === "popular";
  const priceDisplay = formatPublicPlanPrice(catalogEntry.price, locale, pricingLabels);
  const users = formatLimitValue(catalogEntry.limits.users, pricingLabels);
  const domains = formatLimitValue(catalogEntry.limits.domains, pricingLabels);

  return (
    <article
      className={`relative flex h-full flex-col rounded-2xl border p-6 shadow-sm ${
        isPopular
          ? "border-aipify-companion/40 bg-aipify-accent-soft/50"
          : "border-aipify-border bg-aipify-surface"
      }`}
    >
      {isPopular ? (
        <span className="absolute -top-3 left-6 rounded-full bg-aipify-companion px-3 py-1 text-xs font-semibold text-white">
          {pkg.status}
        </span>
      ) : pkg.statusKey === "enterprise" ? (
        <span className="text-xs font-semibold uppercase tracking-wide text-aipify-companion">{pkg.status}</span>
      ) : (
        <span className="text-xs font-semibold uppercase tracking-wide text-aipify-text-secondary">{pkg.status}</span>
      )}

      <div className="min-h-[4.5rem]">
        <h3 className="text-xl font-bold text-aipify-text">{pkg.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{pkg.audience}</p>
      </div>

      <div className="mt-5 min-h-[3.5rem] border-b border-aipify-border pb-5">
        <p className="text-2xl font-bold tracking-tight text-aipify-text">{priceDisplay}</p>
        {pkg.idealFor ? <p className="mt-1 text-xs font-medium text-aipify-text-secondary">{pkg.idealFor}</p> : null}
      </div>

      <div className="mt-5 space-y-2 text-sm text-aipify-text-secondary">
        <p className="text-xs font-semibold uppercase tracking-wide text-aipify-text">{pricingLabels.includes}</p>
        <ul className="space-y-1.5">
          <li>
            {pricingLabels.users}: <span className="font-medium text-aipify-text">{users}</span>
          </li>
          <li>
            {pricingLabels.domains}: <span className="font-medium text-aipify-text">{domains}</span>
          </li>
          <li>
            {pricingLabels.businessPacks}:{" "}
            <span className="font-medium text-aipify-text">{catalogEntry.businessPacks.note}</span>
          </li>
          <li>
            {pricingLabels.support}:{" "}
            <span className="font-medium text-aipify-text">{pricingLabels.supportLevels[catalogEntry.supportLevel]}</span>
          </li>
        </ul>
      </div>

      <ul className="mt-6 flex-1 space-y-2">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex gap-2 text-sm text-aipify-text-secondary">
            <span className="text-emerald-600" aria-hidden="true">
              ✓
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-8 space-y-2">
        <Link
          href={pkg.ctaHref}
          className={`inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition ${
            isPopular ? AipifyMarketingClasses.primaryCta : AipifyMarketingClasses.secondaryCta
          }`}
        >
          {pkg.cta}
        </Link>
        {pkg.detailsHref ? (
          <Link href={pkg.detailsHref} className={`block text-center text-sm font-medium ${PublicMarketingClasses.link}`}>
            {detailsLink}
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export default function PricingPackagesPageContent({ labels, locale, businessPackCards }: Props) {
  const catalog = getPublicPlanCatalog();
  const catalogByKey = Object.fromEntries(catalog.map((c) => [c.key, c])) as Record<
    PublicMarketingPlanKey,
    (typeof catalog)[number]
  >;
  const resolvedComparison = resolvePricingComparison(
    locale,
    labels.planComparison,
    labels.pricingLabels,
    labels.pricingLabels.supportLevels,
    labels.packages.items.map((pkg) => ({
      key: pkg.key,
      name: pkg.name,
      audience: pkg.audience,
      cta: pkg.cta,
      ctaHref: pkg.ctaHref,
      statusKey: pkg.statusKey,
    })),
  );

  return (
    <>
      <PublicPageHero
        eyebrow={labels.hero.eyebrow}
        title={labels.hero.headline}
        subtitle={labels.hero.subheadline}
        breadcrumbs={[
          { label: labels.breadcrumbs?.home ?? "Home", href: "/" },
          { label: labels.breadcrumbs?.pricing ?? "Pricing" },
        ]}
        primaryCta={{ label: labels.hero.ctaPrimary, href: "#plans", analyticsId: "pricing_hero_plans" }}
        secondaryCta={{ label: labels.hero.ctaSecondary, href: "/contact", analyticsId: "pricing_hero_contact" }}
        compact
        align="center"
      />

      {(labels.hero.supporting || labels.hero.trustLine) && (
        <p className="mx-auto -mt-4 max-w-2xl px-4 pb-6 text-center text-sm leading-relaxed text-aipify-text-secondary sm:px-6">
          {labels.hero.trustLine ?? labels.hero.supporting}
        </p>
      )}

      <section id="plans" className={`${SECTION} ${AipifyMarketingClasses.sectionAlt}`}>
        <div className={PublicMarketingClasses.container}>
          <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-aipify-text-secondary">{labels.plansIntro}</p>
          <h2 className="mt-8 text-center text-2xl font-bold tracking-tight text-aipify-text sm:text-3xl">{labels.packages.title}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {labels.packages.items.map((pkg) => (
              <PlanCard
                key={pkg.key}
                pkg={pkg}
                catalogEntry={catalogByKey[pkg.key]}
                pricingLabels={labels.pricingLabels}
                locale={locale}
                detailsLink={labels.packages.detailsLink}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="billing" className={SECTION}>
        <div className={`${PublicMarketingClasses.container} max-w-3xl`}>
          <h2 className={PublicMarketingClasses.sectionHeading}>{labels.billingArchitecture.title}</h2>
          <div className={`mt-6 ${PublicMarketingClasses.card} space-y-5 text-sm text-aipify-text-secondary`}>
            <div>
              <p className="font-semibold text-aipify-text">Billing frequency</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {labels.billingArchitecture.billing.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-aipify-text">Payment methods</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {labels.billingArchitecture.paymentProviders.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <p>{labels.billingArchitecture.accounting}</p>
            <p className="text-aipify-text-muted">{labels.billingArchitecture.regionalNote}</p>
            <p className="text-aipify-text-muted">{labels.billingArchitecture.taxNote}</p>
          </div>
        </div>
      </section>

      <section className={`${SECTION} ${AipifyMarketingClasses.sectionAlt}`}>
        <div className={PublicMarketingClasses.container}>
          <h2 className="text-center text-2xl font-bold tracking-tight text-aipify-text sm:text-3xl">{labels.growthProgression.title}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {labels.growthProgression.stages.map((stage, index) => (
              <div key={stage.name} className={PublicMarketingClasses.card}>
                <p className="text-xs font-bold uppercase tracking-wide text-aipify-companion">
                  {index === 0 ? "Start" : index === 1 ? "Grow" : "Scale"}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-aipify-text">{stage.name}</h3>
                <ul className="mt-4 space-y-2">
                  {stage.items.map((item) => (
                    <li key={item} className="text-sm text-aipify-text-secondary">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="business-packs" className={SECTION}>
        <div className={PublicMarketingClasses.container}>
          <h2 className={PublicMarketingClasses.sectionHeading}>{labels.businessPacks.title}</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-aipify-text-secondary">{labels.businessPacks.copy}</p>

          <div className={`mt-8 ${PublicMarketingClasses.card}`}>
            <h3 className="text-lg font-semibold text-aipify-text">{labels.businessPackModel.title}</h3>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-aipify-text-secondary">
              {labels.businessPackModel.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-aipify-text-muted">{labels.businessPackModel.note}</p>
          </div>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {businessPackCards.map((pack) => (
              <li key={pack.slug} className={PublicMarketingClasses.cardInteractive}>
                <h3 className="text-lg font-semibold text-aipify-text">{pack.name}</h3>
                <p className="mt-1 text-xs font-medium text-aipify-companion">{pack.audience}</p>
                <p className="mt-3 text-sm leading-relaxed text-aipify-text-secondary">{pack.value}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-aipify-text-secondary">
                  {pack.commercialTypeLabel}
                </p>
                <p className="mt-1 text-xs text-aipify-text-muted">
                  {labels.businessPacks.planRequirementPrefix} {pack.minPlanLabel}
                </p>
                <Link href={pack.detailHref} className={`mt-4 inline-block text-sm font-semibold ${PublicMarketingClasses.link}`}>
                  {labels.businessPacks.viewDetails} →
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/pricing#business-packs" className={`mt-8 inline-block text-sm font-semibold ${PublicMarketingClasses.link}`}>
            {labels.businessPacks.exploreAll} →
          </Link>
        </div>
      </section>

      <section className={`${SECTION} ${AipifyMarketingClasses.sectionAlt}`}>
        <div className={`${PublicMarketingClasses.container} grid gap-10 lg:grid-cols-2 lg:items-start`}>
          <div>
            <h2 className={PublicMarketingClasses.sectionHeading}>{labels.enterpriseFlexibility.title}</h2>
            <p className="mt-4 text-base leading-relaxed text-aipify-text-secondary">{labels.enterpriseFlexibility.intro}</p>
            <Link href="/contact" className={`mt-6 inline-flex ${AipifyMarketingClasses.primaryCta} px-6 py-3 text-sm`}>
              {labels.enterpriseFlexibility.cta}
            </Link>
          </div>
          <ul className="space-y-3">
            {labels.enterpriseFlexibility.items.map((item) => (
              <li key={item.label} className={`${PublicMarketingClasses.card} flex gap-3 px-4 py-3 text-sm`}>
                <span aria-hidden="true">{STATUS_ICONS[item.status]}</span>
                <span className="text-aipify-text-secondary">
                  <span className="font-medium text-aipify-text">{item.label}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={SECTION}>
        <div className={`${PublicMarketingClasses.container} max-w-3xl`}>
          <h2 className={PublicMarketingClasses.sectionHeading}>{labels.included.title}</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {labels.included.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-aipify-text-secondary">
                <span className="text-emerald-600" aria-hidden="true">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${SECTION} ${AipifyMarketingClasses.sectionAlt}`}>
        <div className={PublicMarketingClasses.container}>
          <PricingComparisonTable comparison={resolvedComparison} />
        </div>
      </section>

      <section className={SECTION}>
        <div className={PublicMarketingClasses.container}>
          <h2 className="text-center text-2xl font-bold tracking-tight text-aipify-text sm:text-3xl">{labels.outcomes.title}</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {labels.outcomes.items.map((item) => (
              <li key={item.title} className={PublicMarketingClasses.card}>
                <h3 className="font-semibold text-aipify-text">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${SECTION} ${AipifyMarketingClasses.sectionAlt}`}>
        <div className={`${PublicMarketingClasses.container} max-w-4xl`}>
          <h2 className="text-center text-2xl font-bold tracking-tight text-aipify-text sm:text-3xl">{labels.upgradeFlow.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-aipify-text-secondary">{labels.upgradeFlow.intro}</p>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {labels.upgradeFlow.steps.map((step) => (
              <li key={step.label} className={`${PublicMarketingClasses.card} text-center text-sm`}>
                <span className="block text-lg" aria-hidden="true">
                  {step.status === "done" ? "✅" : step.status === "progress" ? "⏳" : "○"}
                </span>
                <span className="mt-2 block font-medium text-aipify-text">{step.label}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-center text-sm text-aipify-text-muted">{labels.upgradeFlow.note}</p>
        </div>
      </section>

      <section id="faq" className={SECTION}>
        <div className={`${PublicMarketingClasses.container} max-w-3xl`}>
          <h2 className={PublicMarketingClasses.sectionHeading}>{labels.faq.title}</h2>
          <div className="mt-8">
            <PricingFaqAccordion items={labels.faq.items} />
          </div>
        </div>
      </section>

      <section className={`${SECTION} ${AipifyMarketingClasses.sectionAlt}`}>
        <div className={`${PublicMarketingClasses.container} max-w-3xl`}>
          <h2 className="text-center text-lg font-semibold text-aipify-text">{labels.trustPanel.title}</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {labels.trustPanel.items.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-aipify-text-secondary">
                <span className="text-emerald-600" aria-hidden="true">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <PublicCTA
        title={labels.finalCta.headline}
        subtitle={labels.finalCta.subheadline}
        primaryLabel={labels.finalCta.primary}
        primaryHref="/contact"
        secondaryLabel={labels.finalCta.secondary}
        secondaryHref={MARKETING_PRIMARY_CTA_HREFS.bookDemo}
        analyticsPrimary="pricing_final_contact"
        analyticsSecondary="pricing_final_demo"
      />
      <div className="pb-8 text-center">
        <Link href="#business-packs" className={`text-sm font-semibold ${PublicMarketingClasses.link}`}>
          {labels.finalCta.tertiary} →
        </Link>
      </div>
    </>
  );
}
