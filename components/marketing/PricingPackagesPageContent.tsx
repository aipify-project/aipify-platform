import Link from "next/link";

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
    <h2 id={id} className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
      {children}
    </h2>
  );
}

function PackageCard({ pkg }: { pkg: Package }) {
  const isPopular = pkg.statusKey === "popular";
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 shadow-lg ${
        isPopular
          ? "border-cyan-500/40 bg-gradient-to-b from-cyan-950/40 to-violet-950/30 shadow-cyan-900/20"
          : "border-white/10 bg-white/[0.03] shadow-violet-900/10"
      }`}
    >
      {isPopular ? (
        <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 px-3 py-1 text-xs font-semibold text-white">
          {pkg.status}
        </span>
      ) : null}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
        {!isPopular && pkg.status ? (
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-aipify-text-muted">{pkg.status}</p>
        ) : null}
      </div>
      <p className="text-sm leading-relaxed text-aipify-text-secondary">{pkg.audience}</p>
      {pkg.idealFor ? <p className="mt-2 text-xs text-aipify-text-muted">{pkg.idealFor}</p> : null}
      <ul className="mt-6 flex-1 space-y-2.5">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex gap-2 text-sm text-aipify-text-secondary">
            <span className="text-cyan-400/90" aria-hidden="true">
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
            ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg shadow-violet-600/25 hover:from-cyan-400 hover:to-violet-500"
            : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
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
    <div className="rounded-2xl border border-aipify-border bg-white/[0.03] p-5 sm:p-6">
      <h3 className="text-base font-semibold text-cyan-300/90">{category.name}</h3>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {levels.map(({ key, value }) => (
          <div key={key} className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-3">
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
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 right-0 h-[420px] w-[420px] rounded-full bg-violet-600/15 blur-3xl" />
        <div className="absolute top-48 -left-32 h-[360px] w-[360px] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <section className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">{hero.headline}</h1>
            <p className="mt-6 text-lg leading-relaxed text-aipify-text-secondary sm:text-xl">{hero.subheadline}</p>
            <p className="mt-4 text-sm leading-relaxed text-aipify-text-muted">{hero.supporting}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#packages"
                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-8 py-4 text-base font-semibold text-aipify-text shadow-lg shadow-violet-600/25 transition hover:from-cyan-400 hover:to-violet-500 sm:w-auto"
              >
                {hero.ctaPrimary}
              </a>
              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-aipify-text transition hover:bg-white/10 sm:w-auto"
              >
                {hero.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <SectionTitle>{pricingPhilosophy.title}</SectionTitle>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-aipify-text-secondary">
            {pricingPhilosophy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section id="packages" className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{packages.title}</SectionTitle>
          <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {packages.items.map((pkg) => (
              <PackageCard key={pkg.key} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{upgradeGrowth.title}</SectionTitle>
          <ul className="mt-10 flex flex-wrap justify-center gap-3">
            {upgradeGrowth.items.map((item) => (
              <li
                key={item}
                className="rounded-full border border-aipify-border bg-white/5 px-4 py-2 text-sm font-medium text-aipify-text-secondary"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="business-packs" className="border-y border-white/10 bg-violet-950/20 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <SectionTitle>{businessPacks.title}</SectionTitle>
          <p className="mt-6 text-sm leading-relaxed text-aipify-text-secondary sm:text-base">{businessPacks.copy}</p>
          <ul className="mt-8 flex flex-wrap justify-center gap-3">
            {businessPacks.examples.map((example) => (
              <li
                key={example}
                className="rounded-full border border-aipify-border bg-white/5 px-4 py-2 text-sm font-medium text-aipify-text-secondary"
              >
                {example}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm font-medium text-cyan-300/90">{businessPacks.status}</p>
        </div>
      </section>

      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{enterpriseOptions.title}</SectionTitle>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {enterpriseOptions.items.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-aipify-border bg-white/[0.03] px-4 py-3 text-sm font-medium text-aipify-text-secondary"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{included.title}</SectionTitle>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {included.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-aipify-text-secondary">
                <span className="text-emerald-400" aria-hidden="true">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="compare-plans" className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{planComparison.title}</SectionTitle>
          <div className="mt-10 space-y-4">
            {planComparison.categories.map((category) => (
              <PlanComparisonGroup key={category.name} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-violet-950/20 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <SectionTitle>{roiExplanation.title}</SectionTitle>
          <p className="mt-6 text-base leading-relaxed text-aipify-text-secondary">{roiExplanation.intro}</p>
          <ul className="mx-auto mt-8 grid max-w-xl gap-3 text-left">
            {roiExplanation.benefits.map((benefit) => (
              <li key={benefit} className="flex gap-3 text-sm text-aipify-text-secondary">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <SectionTitle>{upgradeExperience.title}</SectionTitle>
          <p className="mt-4 text-sm leading-relaxed text-aipify-text-secondary">{upgradeExperience.intro}</p>
          <div className="mt-10 flex flex-col items-center gap-2">
            {upgradeExperience.steps.map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <span className="rounded-xl border border-aipify-border bg-white/5 px-8 py-3 text-base font-semibold text-aipify-text">
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

      <section className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <SectionTitle>{upgradePath.headline}</SectionTitle>
          <div className="mt-10 flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
            {upgradePath.steps.map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <span className="rounded-xl border border-aipify-border bg-white/5 px-6 py-2.5 text-sm font-semibold text-aipify-text">
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

      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{faq.title}</SectionTitle>
          <dl className="mt-10 space-y-6">
            {faq.items.map((item) => (
              <div key={item.question} className="rounded-xl border border-aipify-border bg-white/[0.03] p-5">
                <dt className="font-semibold text-white">{item.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-y border-white/10 bg-gradient-to-b from-violet-950/30 to-transparent py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <SectionTitle>{purchasingConfidence.title}</SectionTitle>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-aipify-text-secondary">
            {purchasingConfidence.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{contactSales.headline}</h2>
          <p className="mt-4 text-aipify-text-secondary">{contactSales.subheadline}</p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-8 py-4 text-base font-semibold text-aipify-text shadow-lg shadow-violet-600/25 transition hover:from-cyan-400 hover:to-violet-500"
          >
            {contactSales.cta}
          </Link>
        </div>
      </section>

      <section className="border-t border-white/10 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{billingArchitecture.title}</SectionTitle>
          <div className="mt-8 space-y-6 text-sm text-aipify-text-secondary">
            <div>
              <p className="font-medium text-aipify-text-secondary">Billing</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {billingArchitecture.billing.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium text-aipify-text-secondary">Payment providers</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {billingArchitecture.paymentProviders.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <p>
              <span className="font-medium text-aipify-text-secondary">Accounting: </span>
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
    </div>
  );
}
