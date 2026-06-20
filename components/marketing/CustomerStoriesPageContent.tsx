import Link from "next/link";
import { PublicCard, PublicSection } from "./public";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";

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
    eyebrow?: string;
    headline: string;
    subheadline: string;
    cta: string;
    ctaSecondary?: string;
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
  storyGrid?: {
    title: string;
    readStory: string;
    items: Array<{
      industry: string;
      organizationType: string;
      challenge: string;
      capability: string;
      pack: string;
      outcome: string;
      isExample?: boolean;
    }>;
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
    linkLabel?: string;
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

const CATEGORY_ICONS = [
  <svg key="ops" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>,
  <svg key="support" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>,
  <svg key="commerce" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>,
  <svg key="hospitality" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" /></svg>,
  <svg key="services" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m0-1.45c.012-.225.012-.45.012-.675C15.75 3.504 13.245 3 10.5 3S5.25 3.504 5.25 6.075c0 .225 0 .45.012.675m13.088 6.855a48.104 48.104 0 0 1 .012 3.862m-13.088-3.862a48.104 48.104 0 0 0-.012 3.862m13.088 0V9.75a2.25 2.25 0 0 0-2.25-2.25h-2.286c-.622 0-1.17.312-1.5.832l-1.464 2.464a2.25 2.25 0 0 1-1.932 1.104h-.003a2.25 2.25 0 0 1-1.932-1.104L5.464 8.082A2.25 2.25 0 0 0 3.964 7.25H1.714A2.25 2.25 0 0 0-.536 9.75v4.5a2.25 2.25 0 0 0 2.25 2.25h2.25" /></svg>,
  <svg key="partners" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>,
] as const;

export default function CustomerStoriesPageContent({ labels }: Props) {
  const {
    categories,
    featured,
    storyGrid,
    beforeAfter,
    industries,
    growthPartners,
    results,
    videoTestimonials,
    logoWall,
    companionImpact,
  } = labels;

  return (
    <>
      <PublicSection title={categories.title}>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.items.map((item, index) => (
            <li key={item.title}>
              <PublicCard
                title={item.title}
                description={item.body}
                icon={CATEGORY_ICONS[index % CATEGORY_ICONS.length]}
              />
            </li>
          ))}
        </ul>
      </PublicSection>

      <PublicSection id="featured-stories" title={featured.title} alt>
        <div className="space-y-6">
          {featured.stories.map((story) => (
            <article key={story.organizationType} className={PublicMarketingClasses.card}>
              {story.isExample ? (
                <p className={PublicMarketingClasses.scenarioBadge}>{featured.exampleLabel}</p>
              ) : null}
              <h3 className={`${PublicMarketingClasses.cardTitle} ${story.isExample ? "mt-3" : ""}`}>
                {story.organizationType}
              </h3>
              <dl className="mt-6 grid gap-6 sm:grid-cols-3">
                <div>
                  <dt className={PublicMarketingClasses.cardLabel}>{featured.challengeLabel}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{story.challenge}</dd>
                </div>
                <div>
                  <dt className={PublicMarketingClasses.cardLabel}>{featured.solutionLabel}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{story.solution}</dd>
                </div>
                <div>
                  <dt className={PublicMarketingClasses.cardLabel}>{featured.resultsLabel}</dt>
                  <dd className="mt-2">
                    <ul className="space-y-2">
                      {story.results.map((result) => (
                        <li key={result} className="flex gap-2 text-sm text-aipify-text-secondary">
                          <span className="text-emerald-600" aria-hidden="true">
                            ✓
                          </span>
                          {result}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </PublicSection>

      {storyGrid && storyGrid.items.length > 0 ? (
        <PublicSection title={storyGrid.title}>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {storyGrid.items.map((item) => (
              <li key={`${item.industry}-${item.organizationType}`}>
                <PublicCard
                  title={item.industry}
                  description={`${item.challenge} · ${item.outcome}`}
                  badge={item.isExample ? featured.exampleLabel : undefined}
                  actionLabel={storyGrid.readStory}
                />
                <p className="mt-2 text-xs text-aipify-text-secondary">
                  {item.organizationType} · {item.pack} · {item.capability}
                </p>
              </li>
            ))}
          </ul>
        </PublicSection>
      ) : null}

      <PublicSection alt>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className={PublicMarketingClasses.beforePanel}>
            <h3 className={PublicMarketingClasses.beforeTitle}>{beforeAfter.beforeTitle}</h3>
            <ul className="mt-5 space-y-3">
              {beforeAfter.beforeItems.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-lg border border-red-100 bg-white px-4 py-3 text-sm text-aipify-text-secondary"
                >
                  <span className="text-red-500" aria-hidden="true">
                    —
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className={PublicMarketingClasses.afterPanel}>
            <h3 className={PublicMarketingClasses.afterTitle}>{beforeAfter.afterTitle}</h3>
            <ul className="mt-5 space-y-3">
              {beforeAfter.afterItems.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-lg border border-emerald-100 bg-white px-4 py-3 text-sm text-aipify-text-secondary"
                >
                  <span className="text-emerald-600" aria-hidden="true">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PublicSection>

      <PublicSection title={industries.title}>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industries.items.map((item) => (
            <li key={item.industry} className={PublicMarketingClasses.card}>
              <h3 className={PublicMarketingClasses.cardTitle}>{item.industry}</h3>
              <p className={`${PublicMarketingClasses.cardLabel} mt-4`}>{industries.challengeLabel}</p>
              <p className="mt-1 text-sm text-aipify-text-secondary">{item.challenge}</p>
              <p className={`${PublicMarketingClasses.cardLabel} mt-4`}>{industries.solutionLabel}</p>
              <p className="mt-1 text-sm text-aipify-text-secondary">{item.solution}</p>
              <p className={`${PublicMarketingClasses.cardLabel} mt-4 text-aipify-companion`}>{industries.outcomeLabel}</p>
              <p className="mt-1 text-sm font-medium text-aipify-text">{item.outcome}</p>
            </li>
          ))}
        </ul>
      </PublicSection>

      <PublicSection title={growthPartners.headline} alt subtitle={growthPartners.disclaimer}>
        <ul className="grid gap-5 lg:grid-cols-2">
          {growthPartners.stories.map((story) => (
            <li key={story.profile} className={PublicMarketingClasses.card}>
              <h3 className={PublicMarketingClasses.cardTitle}>{story.profile}</h3>
              <p className="mt-2 text-sm text-aipify-text-secondary">{story.focus}</p>
              <ul className="mt-4 space-y-2">
                {story.outcomes.map((outcome) => (
                  <li key={outcome} className="flex gap-2 text-sm text-aipify-text-secondary">
                    <span className="text-aipify-companion" aria-hidden="true">
                      ·
                    </span>
                    {outcome}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <Link href="/growth-partners" className={`mt-8 inline-block text-sm font-semibold ${PublicMarketingClasses.link}`}>
          {growthPartners.linkLabel ?? "Explore Growth Partners"} →
        </Link>
      </PublicSection>

      <PublicSection title={results.title}>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {results.items.map((item) => (
            <li key={item.title} className={PublicMarketingClasses.card}>
              <h3 className="font-medium text-aipify-text">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{item.example}</p>
            </li>
          ))}
        </ul>
      </PublicSection>

      <PublicSection title={videoTestimonials.title} subtitle={videoTestimonials.subtitle} alt>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {videoTestimonials.slots.map((slot) => (
            <li key={slot.type} className={PublicMarketingClasses.comingSoon}>
              <span className={PublicMarketingClasses.cardLabel}>{slot.type}</span>
              <p className="mt-2 text-sm text-aipify-text-secondary">{slot.description}</p>
              <span className="mt-3 inline-flex rounded-full border border-aipify-border bg-aipify-surface px-3 py-1 text-xs font-medium text-aipify-text-secondary">
                ℹ️ {slot.status}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-sm text-aipify-text-secondary">{videoTestimonials.comingSoon}</p>
      </PublicSection>

      <PublicSection title={logoWall.title} subtitle={logoWall.subtitle} alt>
        <div className="space-y-10 text-center">
          {[logoWall.customerLabel, logoWall.partnerLabel, logoWall.certificationLabel].map((label) => (
            <div key={label}>
              <p className={PublicMarketingClasses.cardLabel}>{label}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={`${label}-${i}`}
                    className="flex h-16 w-32 items-center justify-center rounded-lg border border-aipify-border bg-aipify-surface text-xs text-aipify-text-muted"
                  >
                    {logoWall.placeholder}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PublicSection>

      <PublicSection title={companionImpact.headline}>
        <div className="mx-auto max-w-3xl space-y-5">
          {companionImpact.quotes.map((quote) => (
            <blockquote
              key={quote}
              className="rounded-xl border border-aipify-border bg-aipify-accent-soft/40 px-6 py-5 text-base italic leading-relaxed text-aipify-text-secondary"
            >
              {quote}
            </blockquote>
          ))}
          <p className="text-center text-sm text-aipify-text-secondary">{companionImpact.attributionNote}</p>
        </div>
      </PublicSection>
    </>
  );
}
