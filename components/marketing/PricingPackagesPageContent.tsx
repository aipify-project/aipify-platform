import Link from "next/link";

type Card = { title: string; body: string };
type Package = {
  key: string;
  name: string;
  target: string;
  idealFor: string;
  features: string[];
  status: string;
  statusKey?: "available" | "popular" | "enterprise";
  cta: string;
  ctaHref: string;
  highlighted?: boolean;
};
type FaqItem = { question: string; answer: string };

export type PricingPackagesPageLabels = {
  meta: { title: string; description: string };
  hero: {
    headline: string;
    subheadline: string;
    supporting: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  principles: { title: string; cards: Card[] };
  packages: { title: string; items: Package[] };
  businessPacks: {
    title: string;
    copy: string;
    examples: string[];
    status: string;
  };
  included: { title: string; items: string[] };
  upgradePath: {
    headline: string;
    copy: string;
    steps: string[];
  };
  enterpriseComparison: {
    headline: string;
    cards: Card[];
  };
  faq: { title: string; items: FaqItem[] };
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
    upgradeNote: string;
    upgradeFlow: string[];
  };
  finalPrinciple: string;
};

type Props = { labels: PricingPackagesPageLabels };

function SectionTitle({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
      {children}
    </h2>
  );
}

function PrincipleCard({ title, body }: Card) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{body}</p>
    </div>
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
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{pkg.status}</p>
        ) : null}
      </div>
      <p className="text-sm text-slate-400">
        <span className="font-medium text-slate-300">{pkg.target}</span>
      </p>
      <p className="mt-1 text-sm text-slate-500">{pkg.idealFor}</p>
      <ul className="mt-6 flex-1 space-y-2.5">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex gap-2 text-sm text-slate-300">
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

export default function PricingPackagesPageContent({ labels }: Props) {
  const {
    hero,
    principles,
    packages,
    businessPacks,
    included,
    upgradePath,
    enterpriseComparison,
    faq,
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

      {/* Hero */}
      <section className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">{hero.headline}</h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-400 sm:text-xl">{hero.subheadline}</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">{hero.supporting}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#packages"
                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:from-cyan-400 hover:to-violet-500 sm:w-auto"
              >
                {hero.ctaPrimary}
              </a>
              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10 sm:w-auto"
              >
                {hero.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{principles.title}</SectionTitle>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {principles.cards.map((card) => (
              <PrincipleCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
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

      {/* Business Packs */}
      <section id="business-packs" className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <SectionTitle>{businessPacks.title}</SectionTitle>
          <p className="mt-6 text-sm leading-relaxed text-slate-400 sm:text-base">{businessPacks.copy}</p>
          <ul className="mt-8 flex flex-wrap justify-center gap-3">
            {businessPacks.examples.map((example) => (
              <li
                key={example}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300"
              >
                {example}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm font-medium text-cyan-300/90">{businessPacks.status}</p>
        </div>
      </section>

      {/* Included in every plan */}
      <section className="border-y border-white/10 bg-violet-950/20 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{included.title}</SectionTitle>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {included.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="text-emerald-400" aria-hidden="true">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Upgrade path */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <SectionTitle>{upgradePath.headline}</SectionTitle>
          <div className="mt-10 flex flex-col items-center gap-2">
            {upgradePath.steps.map((step, i) => (
              <div key={step} className="flex flex-col items-center">
                <span className="rounded-xl border border-white/10 bg-white/5 px-8 py-3 text-base font-semibold text-white">
                  {step}
                </span>
                {i < upgradePath.steps.length - 1 ? (
                  <span className="my-2 text-slate-500" aria-hidden="true">
                    ↓
                  </span>
                ) : null}
              </div>
            ))}
          </div>
          <p className="mt-10 text-sm leading-relaxed text-slate-400">{upgradePath.copy}</p>
        </div>
      </section>

      {/* Enterprise comparison */}
      <section className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{enterpriseComparison.headline}</SectionTitle>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {enterpriseComparison.cards.map((card) => (
              <PrincipleCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{faq.title}</SectionTitle>
          <dl className="mt-10 space-y-6">
            {faq.items.map((item) => (
              <div key={item.question} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <dt className="font-semibold text-white">{item.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-slate-400">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Contact sales */}
      <section className="border-y border-white/10 bg-gradient-to-b from-violet-950/30 to-transparent py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{contactSales.headline}</h2>
          <p className="mt-4 text-slate-400">{contactSales.subheadline}</p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:from-cyan-400 hover:to-violet-500"
          >
            {contactSales.cta}
          </Link>
        </div>
      </section>

      {/* Billing architecture */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{billingArchitecture.title}</SectionTitle>
          <div className="mt-8 space-y-6 text-sm text-slate-400">
            <div>
              <p className="font-medium text-slate-300">Billing</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {billingArchitecture.billing.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium text-slate-300">Payment providers</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {billingArchitecture.paymentProviders.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <p>
              <span className="font-medium text-slate-300">Accounting: </span>
              {billingArchitecture.accounting}
            </p>
            <p className="font-medium text-cyan-300/90">{billingArchitecture.upgradeNote}</p>
            <ol className="space-y-2 rounded-xl border border-white/10 bg-white/[0.03] p-5">
              {billingArchitecture.upgradeFlow.map((step) => (
                <li key={step} className="flex items-center gap-2 text-slate-300">
                  <span className="text-emerald-400" aria-hidden="true">
                    →
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Final principle */}
      <section className="border-t border-white/10 py-12">
        <p className="mx-auto max-w-2xl px-4 text-center text-sm leading-relaxed text-slate-500 sm:text-base">
          {finalPrinciple}
        </p>
      </section>
    </div>
  );
}
