import Link from "next/link";

type Card = { title: string; body: string };
type ComparisonColumn = { title: string; items: string[] };

export type WhyAipifyPageLabels = {
  meta: { title: string; description: string };
  hero: {
    headline: string;
    subheadline: string;
    supporting: string;
    cta: string;
  };
  problem: {
    headline: string;
    tools: string[];
    disconnected: string;
    supporting: string;
  };
  difference: {
    headline: string;
    cards: Card[];
  };
  builtForHumans: {
    headline: string;
    subheadline: string;
    supporting: string;
    positions: string[];
  };
  companion: {
    headline: string;
    traditional: ComparisonColumn;
    aipify: ComparisonColumn;
    examples: string[];
  };
  builtToGrow: {
    headline: string;
    steps: string[];
    supporting: string;
  };
  enterpriseReady: {
    headline: string;
    cards: Card[];
  };
  vision: {
    headline: string;
    supporting: string;
    stages: string[];
  };
  norway: {
    headline: string;
    subheadline: string;
    copy: string;
    footerQuote: string;
  };
  finalCta: {
    headline: string;
    explore: string;
    businessPacks: string;
    talkToSales: string;
  };
  finalPrinciple: string;
};

type Props = { labels: WhyAipifyPageLabels };

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{children}</h2>;
}

function InfoCard({ title, body }: Card) {
  return (
    <div className="rounded-2xl border border-aipify-border bg-white/[0.03] p-6">
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{body}</p>
    </div>
  );
}

export default function WhyAipifyPageContent({ labels }: Props) {
  const {
    hero,
    problem,
    difference,
    builtForHumans,
    companion,
    builtToGrow,
    enterpriseReady,
    vision,
    norway,
    finalCta,
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
            <p className="mt-6 text-lg leading-relaxed text-aipify-text-secondary sm:text-xl">{hero.subheadline}</p>
            <p className="mt-4 text-sm leading-relaxed text-aipify-text-muted sm:text-base">{hero.supporting}</p>
            <Link
              href="/product"
              className="mt-10 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-8 py-4 text-base font-semibold text-aipify-text shadow-lg shadow-violet-600/25 transition hover:from-cyan-400 hover:to-violet-500"
            >
              {hero.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{problem.headline}</SectionTitle>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {problem.tools.map((tool) => (
              <span
                key={tool}
                className="rounded-xl border border-aipify-border bg-white/5 px-4 py-2.5 text-sm font-medium text-aipify-text-secondary"
              >
                {tool}
              </span>
            ))}
          </div>
          <p className="mt-8 text-center text-base font-medium text-amber-200/90">{problem.disconnected}</p>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-aipify-text-secondary sm:text-base">
            {problem.supporting}
          </p>
        </div>
      </section>

      {/* Difference */}
      <section className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{difference.headline}</SectionTitle>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {difference.cards.map((card) => (
              <InfoCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* Built for humans */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <SectionTitle>{builtForHumans.headline}</SectionTitle>
          <p className="mt-4 text-xl font-medium text-cyan-300/90">{builtForHumans.subheadline}</p>
          <p className="mt-6 text-sm leading-relaxed text-aipify-text-secondary sm:text-base">{builtForHumans.supporting}</p>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {builtForHumans.positions.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 px-4 py-3 text-sm font-medium text-emerald-100/90"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Companion */}
      <section className="border-y border-white/10 bg-violet-950/20 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{companion.headline}</SectionTitle>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-aipify-border bg-white/[0.03] p-6">
              <h3 className="font-semibold text-aipify-text-secondary">{companion.traditional.title}</h3>
              <ul className="mt-4 space-y-2">
                {companion.traditional.items.map((item) => (
                  <li key={item} className="text-sm text-aipify-text-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-6">
              <h3 className="font-semibold text-white">{companion.aipify.title}</h3>
              <ul className="mt-4 space-y-2">
                {companion.aipify.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-aipify-text-secondary">
                    <span className="text-cyan-400" aria-hidden="true">
                      ·
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-3">
            {companion.examples.map((example) => (
              <li
                key={example}
                className="rounded-full border border-aipify-border bg-white/5 px-4 py-2 text-xs font-medium text-aipify-text-secondary"
              >
                {example}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Built to grow */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <SectionTitle>{builtToGrow.headline}</SectionTitle>
          <div className="mt-10 flex flex-col items-center gap-2">
            {builtToGrow.steps.map((step, i) => (
              <div key={step} className="flex flex-col items-center">
                <span className="rounded-xl border border-aipify-border bg-white/5 px-8 py-3 text-base font-semibold text-aipify-text">
                  {step}
                </span>
                {i < builtToGrow.steps.length - 1 ? (
                  <span className="my-2 text-aipify-text-muted" aria-hidden="true">
                    ↓
                  </span>
                ) : null}
              </div>
            ))}
          </div>
          <p className="mt-10 text-sm leading-relaxed text-aipify-text-secondary">{builtToGrow.supporting}</p>
        </div>
      </section>

      {/* Enterprise ready */}
      <section className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{enterpriseReady.headline}</SectionTitle>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {enterpriseReady.cards.map((card) => (
              <InfoCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <SectionTitle>{vision.headline}</SectionTitle>
          <p className="mt-6 text-sm leading-relaxed text-aipify-text-secondary sm:text-base">{vision.supporting}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {vision.stages.map((stage) => (
              <span
                key={stage}
                className="rounded-xl border border-violet-500/30 bg-violet-950/30 px-6 py-3 text-sm font-semibold text-violet-100"
              >
                {stage}
              </span>
            ))}
          </div>
          <p className="mt-10 text-sm font-medium text-aipify-text-secondary">
            {finalPrinciple}
          </p>
        </div>
      </section>

      {/* Norway */}
      <section className="border-y border-white/10 bg-gradient-to-b from-cyan-950/20 to-transparent py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-widest text-cyan-400/80">Bergen. Norway. For the world.</p>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">{norway.headline}</h2>
          <p className="mt-2 text-lg text-aipify-text-secondary">{norway.subheadline}</p>
          <p className="mt-6 text-sm leading-relaxed text-aipify-text-secondary">{norway.copy}</p>
          <blockquote className="mt-10 border-l-2 border-cyan-500/50 pl-6 text-left text-base italic leading-relaxed text-aipify-text-secondary sm:text-lg">
            {norway.footerQuote}
          </blockquote>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{finalCta.headline}</h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
            <Link
              href="/product"
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-8 py-4 text-base font-semibold text-aipify-text shadow-lg shadow-violet-600/25 transition hover:from-cyan-400 hover:to-violet-500 sm:w-auto"
            >
              {finalCta.explore}
            </Link>
            <Link
              href="/pricing#business-packs"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-aipify-text transition hover:bg-white/10 sm:w-auto"
            >
              {finalCta.businessPacks}
            </Link>
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-aipify-text transition hover:bg-white/10 sm:w-auto"
            >
              {finalCta.talkToSales}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
