import Link from "next/link";
import { PublicPageHero } from "./public";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";

type Card = { title: string; body: string };
type Package = {
  key: string;
  name: string;
  audience: string;
  idealFor?: string;
  features: string[];
  status: string;
  statusKey?: "available" | "popular" | "enterprise";
  cta: string;
  ctaHref: string;
};
type FaqItem = { question: string; answer: string };
type PlanComparisonCategory = {
  name: string;
  starter: string;
  professional: string;
  business: string;
  enterprise: string;
};

export type PricingPackagesPageLabels = {
  meta: { title: string; description: string };
  hero: {
    headline: string;
    subheadline: string;
    supporting: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  pricingPhilosophy: { title: string; paragraphs: string[] };
  packages: { title: string; items: Package[] };
  upgradeGrowth: { title: string; items: string[] };
  businessPacks: {
    title: string;
    copy: string;
    examples: string[];
    status: string;
  };
  enterpriseOptions: { title: string; items: string[] };
  included: { title: string; items: string[] };
  planComparison: { title: string; categories: PlanComparisonCategory[] };
  roiExplanation: { title: string; intro: string; benefits: string[] };
  upgradeExperience: { title: string; intro: string; steps: string[] };
  upgradePath: {
    headline: string;
    copy: string;
    steps: string[];
  };
  faq: { title: string; items: FaqItem[] };
  purchasingConfidence: { title: string; paragraphs: string[] };
  contactSales: {
    headline: string;
    subheadline: string;
    cta: string;
  };
  billingArchitecture: {
    title: string;
    billing: string[];
    paymentProviders: string[];
    accounting: string;
  };
  finalPrinciple: string;
};

type Props = { labels: PricingPackagesPageLabels };

const PLAN_LABELS: Record<string, string> = {
  starter: "Starter",
  professional: "Professional",
  business: "Business",
  enterprise: "Enterprise",
};

function SectionTitle({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} className="text-2xl font-bold tracking-tight text-aipify-text sm:text-3xl">
      {children}
    </h2>
  );
}

function PackageCard({ pkg }: { pkg: Package }) {
  const isPopular = pkg.statusKey === "popular";
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 shadow-sm ${
        isPopular
          ? "border-aipify-companion/40 bg-aipify-accent-soft/40"
          : "border-aipify-border bg-aipify-surface"
      }`}
    >
      {isPopular ? (
        <span className="absolute -top-3 left-6 rounded-full bg-aipify-companion px-3 py-1 text-xs font-semibold text-white">
          {pkg.status}
        </span>
      ) : null}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-aipify-text">{pkg.name}</h3>
        {!isPopular && pkg.status ? (
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-aipify-text-muted">{pkg.status}</p>
        ) : null}
      </div>
      <p className="text-sm leading-relaxed text-aipify-text-secondary">{pkg.audience}</p>
      {pkg.idealFor ? <p className="mt-2 text-xs text-aipify-text-muted">{pkg.idealFor}</p> : null}
      <ul className="mt-6 flex-1 space-y-2.5">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex gap-2 text-sm text-aipify-text-secondary">
            <span className="text-aipify-companion" aria-hidden="true">
              ·
            </span>
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href={pkg.ctaHref}
        className={`mt-8 inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition ${
          isPopular
            ? `${AipifyMarketingClasses.primaryCta} w-full`
            : `${AipifyMarketingClasses.secondaryCta} w-full`
        }`}
      >
        {pkg.cta}
      </Link>
    </div>
  );
}

function PlanComparisonGroup({ category }: { category: PlanComparisonCategory }) {
  const levels = [
    { key: "starter", value: category.starter },
    { key: "professional", value: category.professional },
    { key: "business", value: category.business },
    { key: "enterprise", value: category.enterprise },
  ];

  return (
    <div className={`${AipifyMarketingClasses.card} sm:p-6`}>
      <h3 className="text-base font-semibold text-aipify-companion">{category.name}</h3>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {levels.map(({ key, value }) => (
          <div key={key} className="rounded-xl border border-aipify-border bg-aipify-surface-muted px-3 py-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-aipify-text-muted">
              {PLAN_LABELS[key]}
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-aipify-text-secondary">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function PricingPackagesPageContent({ labels }: Props) {
  const {
    hero,
    pricingPhilosophy,
    packages,
    upgradeGrowth,
    businessPacks,
    enterpriseOptions,
    included,
    planComparison,
    roiExplanation,
    upgradeExperience,
    upgradePath,
    faq,
    purchasingConfidence,
    contactSales,
    billingArchitecture,
    finalPrinciple,
  } = labels;

  return (
    <>
      <PublicPageHero
        eyebrow="Business Packs & Plans"
        title={hero.headline}
        subtitle={hero.subheadline}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Business Packs" },
        ]}
        primaryCta={{ label: hero.ctaPrimary, href: "#packages", analyticsId: "pricing_hero_packages" }}
        secondaryCta={{ label: hero.ctaSecondary, href: "/contact", analyticsId: "pricing_hero_contact" }}
        align="center"
      />

      {hero.supporting ? (
        <p className="mx-auto -mt-8 max-w-2xl px-4 pb-8 text-center text-sm leading-relaxed text-aipify-text-muted sm:px-6">
          {hero.supporting}
        </p>
      ) : null}

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <SectionTitle>{pricingPhilosophy.title}</SectionTitle>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-aipify-text-secondary">
            {pricingPhilosophy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section id="packages" className={`${AipifyMarketingClasses.sectionAlt} py-16 sm:py-20`}>
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
          <SectionTitle>{packages.title}</SectionTitle>
          <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {packages.items.map((pkg) => (
              <PackageCard key={pkg.key} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{upgradeGrowth.title}</SectionTitle>
          <ul className="mt-10 flex flex-wrap justify-center gap-3">
            {upgradeGrowth.items.map((item) => (
              <li
                key={item}
                className="rounded-full border border-aipify-border bg-aipify-surface px-4 py-2 text-sm font-medium text-aipify-text-secondary"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="business-packs" className={`${AipifyMarketingClasses.sectionAlt} py-16 sm:py-20`}>
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <SectionTitle>{businessPacks.title}</SectionTitle>
          <p className="mt-6 text-sm leading-relaxed text-aipify-text-secondary sm:text-base">{businessPacks.copy}</p>
          <ul className="mt-8 flex flex-wrap justify-center gap-3">
            {businessPacks.examples.map((example) => (
              <li
                key={example}
                className="rounded-full border border-aipify-border bg-aipify-surface px-4 py-2 text-sm font-medium text-aipify-text-secondary"
              >
                {example}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm font-medium text-aipify-companion">{businessPacks.status}</p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{enterpriseOptions.title}</SectionTitle>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {enterpriseOptions.items.map((item) => (
              <li
                key={item}
                className={`${AipifyMarketingClasses.card} px-4 py-3 text-sm font-medium text-aipify-text-secondary`}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${AipifyMarketingClasses.sectionAlt} py-16 sm:py-20`}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{included.title}</SectionTitle>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {included.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-aipify-text-secondary">
                <span className="text-aipify-companion" aria-hidden="true">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="compare-plans" className="py-16 sm:py-20">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
          <SectionTitle>{planComparison.title}</SectionTitle>
          <div className="mt-10 space-y-4">
            {planComparison.categories.map((category) => (
              <PlanComparisonGroup key={category.name} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className={`${AipifyMarketingClasses.sectionAlt} py-16 sm:py-20`}>
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <SectionTitle>{roiExplanation.title}</SectionTitle>
          <p className="mt-6 text-base leading-relaxed text-aipify-text-secondary">{roiExplanation.intro}</p>
          <ul className="mx-auto mt-8 grid max-w-xl gap-3 text-left">
            {roiExplanation.benefits.map((benefit) => (
              <li key={benefit} className="flex gap-3 text-sm text-aipify-text-secondary">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aipify-companion" aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <SectionTitle>{upgradeExperience.title}</SectionTitle>
          <p className="mt-4 text-sm leading-relaxed text-aipify-text-secondary">{upgradeExperience.intro}</p>
          <div className="mt-10 flex flex-col items-center gap-2">
            {upgradeExperience.steps.map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <span className={`${AipifyMarketingClasses.card} px-8 py-3 text-base font-semibold text-aipify-text`}>
                  {step}
                </span>
                {index < upgradeExperience.steps.length - 1 ? (
                  <span className="my-2 text-aipify-text-muted" aria-hidden="true">
                    ↓
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${AipifyMarketingClasses.sectionAlt} py-16 sm:py-20`}>
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <SectionTitle>{upgradePath.headline}</SectionTitle>
          <div className="mt-10 flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
            {upgradePath.steps.map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <span className={`${AipifyMarketingClasses.card} px-6 py-2.5 text-sm font-semibold text-aipify-text`}>
                  {step}
                </span>
                {index < upgradePath.steps.length - 1 ? (
                  <span className="hidden text-aipify-text-muted sm:inline" aria-hidden="true">
                    →
                  </span>
                ) : null}
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm leading-relaxed text-aipify-text-secondary">{upgradePath.copy}</p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{faq.title}</SectionTitle>
          <dl className="mt-10 space-y-6">
            {faq.items.map((item) => (
              <div key={item.question} className={AipifyMarketingClasses.card}>
                <dt className="font-semibold text-aipify-text">{item.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={`${AipifyMarketingClasses.sectionAlt} py-16 sm:py-20`}>
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <SectionTitle>{purchasingConfidence.title}</SectionTitle>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-aipify-text-secondary">
            {purchasingConfidence.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-aipify-text sm:text-3xl">{contactSales.headline}</h2>
          <p className="mt-4 text-aipify-text-secondary">{contactSales.subheadline}</p>
          <Link href="/contact" className={`mt-8 ${AipifyMarketingClasses.primaryCta} px-8 py-4 text-base`}>
            {contactSales.cta}
          </Link>
        </div>
      </section>

      <section className="border-t border-aipify-border py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{billingArchitecture.title}</SectionTitle>
          <div className="mt-8 space-y-6 text-sm text-aipify-text-secondary">
            <div>
              <p className="font-medium text-aipify-text">Billing</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {billingArchitecture.billing.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium text-aipify-text">Payment providers</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {billingArchitecture.paymentProviders.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <p>
              <span className="font-medium text-aipify-text">Accounting: </span>
              {billingArchitecture.accounting}
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-aipify-border py-12">
        <p className="mx-auto max-w-2xl px-4 text-center text-sm leading-relaxed text-aipify-text-muted sm:text-base">
          {finalPrinciple}
        </p>
      </section>
    </>
  );
}
