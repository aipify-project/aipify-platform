import Link from "next/link";

type Card = { title: string; body: string };
type Story = {
  organizationType: string;
  challenge: string;
  solution: string;
  results: string[];
  isExample?: boolean;
};
type IndustryExample = {
  industry: string;
  challenge: string;
  solution: string;
  outcome: string;
};
type PartnerStory = {
  profile: string;
  focus: string;
  outcomes: string[];
};
type VideoSlot = { type: string; description: string; status: string };
type ResultCategory = { title: string; example: string };

export type CustomerStoriesPageLabels = {
  meta: { title: string; description: string };
  hero: {
    headline: string;
    subheadline: string;
    cta: string;
  };
  categories: { title: string; items: Card[] };
  featured: {
    title: string;
    exampleLabel: string;
    challengeLabel: string;
    solutionLabel: string;
    resultsLabel: string;
    stories: Story[];
  };
  beforeAfter: {
    beforeTitle: string;
    beforeItems: string[];
    afterTitle: string;
    afterItems: string[];
  };
  industries: {
    title: string;
    challengeLabel: string;
    solutionLabel: string;
    outcomeLabel: string;
    items: IndustryExample[];
  };
  growthPartners: {
    headline: string;
    disclaimer: string;
    stories: PartnerStory[];
  };
  results: { title: string; items: ResultCategory[] };
  videoTestimonials: {
    title: string;
    subtitle: string;
    slots: VideoSlot[];
    comingSoon: string;
  };
  logoWall: {
    title: string;
    subtitle: string;
    customerLabel: string;
    partnerLabel: string;
    certificationLabel: string;
    placeholder: string;
  };
  companionImpact: {
    headline: string;
    quotes: string[];
    attributionNote: string;
  };
  finalCta: {
    headline: string;
    bookDemo: string;
    businessPacks: string;
    talkToSales: string;
  };
  finalPrinciple: string;
};

type Props = { labels: CustomerStoriesPageLabels };

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{children}</h2>;
}

function CategoryCard({ title, body }: Card) {
  return (
    <div className="rounded-2xl border border-aipify-border bg-white/[0.03] p-5 transition hover:border-cyan-500/20">
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-aipify-text-secondary">{body}</p>
    </div>
  );
}

export default function CustomerStoriesPageContent({ labels }: Props) {
  const {
    hero,
    categories,
    featured,
    beforeAfter,
    industries,
    growthPartners,
    results,
    videoTestimonials,
    logoWall,
    companionImpact,
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
            <a
              href="#featured-stories"
              className="mt-10 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-8 py-4 text-base font-semibold text-aipify-text shadow-lg shadow-violet-600/25 transition hover:from-cyan-400 hover:to-violet-500"
            >
              {hero.cta}
            </a>
          </div>
        </div>
      </section>

      {/* Success categories */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{categories.title}</SectionTitle>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.items.map((item) => (
              <CategoryCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured stories */}
      <section id="featured-stories" className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{featured.title}</SectionTitle>
          <div className="mt-10 space-y-8">
            {featured.stories.map((story) => (
              <article
                key={story.organizationType}
                className="rounded-2xl border border-aipify-border bg-white/[0.03] p-6 sm:p-8"
              >
                {story.isExample ? (
                  <p className="mb-4 text-xs font-medium uppercase tracking-wide text-cyan-400/80">
                    {featured.exampleLabel}
                  </p>
                ) : null}
                <h3 className="text-lg font-semibold text-aipify-text">{story.organizationType}</h3>
                <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">{featured.challengeLabel}</dt>
                    <dd className="mt-1 text-sm text-aipify-text-secondary">{story.challenge}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">{featured.solutionLabel}</dt>
                    <dd className="mt-1 text-sm text-aipify-text-secondary">{story.solution}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">{featured.resultsLabel}</dt>
                    <dd className="mt-1">
                      <ul className="space-y-1">
                        {story.results.map((r) => (
                          <li key={r} className="flex gap-2 text-sm text-emerald-100/90">
                            <span className="text-emerald-400" aria-hidden="true">
                              ✓
                            </span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Before & After */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-6">
              <h3 className="text-lg font-semibold text-red-200/90">{beforeAfter.beforeTitle}</h3>
              <ul className="mt-6 space-y-3">
                {beforeAfter.beforeItems.map((item) => (
                  <li key={item} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3 text-sm text-aipify-text-secondary">
                    <span className="text-red-400/70" aria-hidden="true">
                      —
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-6">
              <h3 className="text-lg font-semibold text-emerald-200/90">{beforeAfter.afterTitle}</h3>
              <ul className="mt-6 space-y-3">
                {beforeAfter.afterItems.map((item) => (
                  <li key={item} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3 text-sm text-aipify-text-secondary">
                    <span className="text-emerald-400" aria-hidden="true">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Industry examples */}
      <section className="border-y border-white/10 bg-violet-950/20 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{industries.title}</SectionTitle>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {industries.items.map((item) => (
              <div key={item.industry} className="rounded-xl border border-aipify-border bg-white/[0.03] p-5">
                <h3 className="font-semibold text-white">{item.industry}</h3>
                <p className="mt-3 text-xs font-medium uppercase text-aipify-text-muted">{industries.challengeLabel}</p>
                <p className="mt-1 text-sm text-aipify-text-secondary">{item.challenge}</p>
                <p className="mt-3 text-xs font-medium uppercase text-aipify-text-muted">{industries.solutionLabel}</p>
                <p className="mt-1 text-sm text-aipify-text-secondary">{item.solution}</p>
                <p className="mt-3 text-xs font-medium uppercase text-cyan-500/80">{industries.outcomeLabel}</p>
                <p className="mt-1 text-sm text-cyan-100/80">{item.outcome}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Growth partners */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{growthPartners.headline}</SectionTitle>
          <p className="mt-4 max-w-2xl text-sm text-aipify-text-muted">{growthPartners.disclaimer}</p>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {growthPartners.stories.map((story) => (
              <div key={story.profile} className="rounded-2xl border border-violet-500/20 bg-violet-950/20 p-6">
                <h3 className="font-semibold text-white">{story.profile}</h3>
                <p className="mt-2 text-sm text-aipify-text-secondary">{story.focus}</p>
                <ul className="mt-4 space-y-2">
                  {story.outcomes.map((o) => (
                    <li key={o} className="flex gap-2 text-sm text-aipify-text-secondary">
                      <span className="text-violet-400" aria-hidden="true">
                        ·
                      </span>
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Link href="/growth-partners" className="mt-8 inline-block text-sm font-medium text-violet-300 hover:text-violet-200">
            /growth-partners
          </Link>
        </div>
      </section>

      {/* Results categories */}
      <section className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{results.title}</SectionTitle>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {results.items.map((item) => (
              <div key={item.title} className="rounded-xl border border-aipify-border p-4">
                <h3 className="font-medium text-white">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-aipify-text-muted">{item.example}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video testimonials ready */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{videoTestimonials.title}</SectionTitle>
          <p className="mt-4 text-sm text-aipify-text-secondary">{videoTestimonials.subtitle}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {videoTestimonials.slots.map((slot) => (
              <div
                key={slot.type}
                className="flex aspect-video flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-4 text-center"
              >
                <span className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">{slot.type}</span>
                <p className="mt-2 text-sm text-aipify-text-secondary">{slot.description}</p>
                <span className="mt-3 rounded-full bg-white/5 px-3 py-1 text-xs text-aipify-text-muted">{slot.status}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-aipify-text-muted">{videoTestimonials.comingSoon}</p>
        </div>
      </section>

      {/* Logo wall */}
      <section className="border-y border-white/10 bg-aipify-surface-muted py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <SectionTitle>{logoWall.title}</SectionTitle>
          <p className="mx-auto mt-4 max-w-xl text-sm text-aipify-text-muted">{logoWall.subtitle}</p>
          <div className="mt-12 space-y-10">
            {[
              { label: logoWall.customerLabel },
              { label: logoWall.partnerLabel },
              { label: logoWall.certificationLabel },
            ].map(({ label }) => (
              <div key={label}>
                <p className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">{label}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={`${label}-${i}`}
                      className="flex h-16 w-32 items-center justify-center rounded-lg border border-aipify-border bg-white/[0.03] text-xs text-slate-600"
                    >
                      {logoWall.placeholder}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Companion impact */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{companionImpact.headline}</SectionTitle>
          <div className="mt-10 space-y-6">
            {companionImpact.quotes.map((quote) => (
              <blockquote
                key={quote}
                className="rounded-xl border border-cyan-500/20 bg-cyan-950/10 px-6 py-5 text-base italic leading-relaxed text-aipify-text-secondary"
              >
                {quote}
              </blockquote>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-aipify-text-muted">{companionImpact.attributionNote}</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-aipify-border bg-gradient-to-b from-violet-950/30 to-transparent py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{finalCta.headline}</h2>
          <p className="mt-6 text-sm text-aipify-text-muted">{finalPrinciple}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-8 py-4 text-base font-semibold text-aipify-text shadow-lg shadow-violet-600/25 transition hover:from-cyan-400 hover:to-violet-500 sm:w-auto"
            >
              {finalCta.bookDemo}
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
