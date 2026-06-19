import {
  First30DaysSection,
  ImplementationCtaBand,
  MarketingDifferentiationStrip,
  MarketingPageHeader,
  OnboardingChecklistSection,
  VerticalFlowSection,
} from "@/components/marketing";
import type { ImplementationCtaBandLabels } from "@/components/marketing/ImplementationCtaBand";

export type GetStartedPageLabels = {
  meta: { title: string; description: string };
  hero: { title: string; subtitle: string };
  first30Days: { title: string; milestones: Array<{ day: string; label: string }> };
  implementationTimeline: { title: string; steps: string[] };
  companionOnboarding: { title: string; intro: string; learns: string[]; closing: string };
  businessPackActivation: { title: string; steps: string[] };
  implementationSupport: { title: string; items: string[] };
  timeToValue: { title: string; outcomes: string[] };
  companionChecklist: { title: string; items: string[] };
  customerSuccessJourney: { title: string; steps: string[] };
  implementationStories: {
    title: string;
    stories: Array<{ title: string; steps: string[] }>;
  };
  complexityReassurance: { title: string; paragraphs: string[] };
  implementationCta: ImplementationCtaBandLabels;
};

type Props = {
  labels: GetStartedPageLabels;
  differentiationThemes: string[];
};

export default function GetStartedPageContent({ labels, differentiationThemes }: Props) {
  return (
    <>
      <MarketingPageHeader title={labels.hero.title} subtitle={labels.hero.subtitle} />
      <MarketingDifferentiationStrip themes={differentiationThemes} />

      <First30DaysSection title={labels.first30Days.title} milestones={labels.first30Days.milestones} />

      <VerticalFlowSection
        sectionId="implementation-timeline"
        title={labels.implementationTimeline.title}
        steps={labels.implementationTimeline.steps}
        muted
      />

      <section aria-labelledby="companion-onboarding-title" className="bg-aipify-surface">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
          <h2 id="companion-onboarding-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
            {labels.companionOnboarding.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-aipify-text-secondary">{labels.companionOnboarding.intro}</p>
          <ul className="mx-auto mt-8 grid max-w-xl gap-3 text-left sm:grid-cols-2">
            {labels.companionOnboarding.learns.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-aipify-text-secondary">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aipify-companion" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm font-medium text-aipify-text">{labels.companionOnboarding.closing}</p>
        </div>
      </section>

      <VerticalFlowSection
        sectionId="business-pack-activation"
        title={labels.businessPackActivation.title}
        steps={labels.businessPackActivation.steps}
        muted
      />

      <section aria-labelledby="implementation-support-title" className="bg-aipify-surface">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <h2 id="implementation-support-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
            {labels.implementationSupport.title}
          </h2>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {labels.implementationSupport.items.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-aipify-border bg-aipify-surface-muted/60 px-4 py-3 text-center text-sm font-medium text-aipify-text-secondary"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="time-to-value-title" className="border-y border-aipify-border bg-aipify-accent-soft/25">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <h2 id="time-to-value-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
            {labels.timeToValue.title}
          </h2>
          <ul className="mt-10 flex flex-wrap justify-center gap-3">
            {labels.timeToValue.outcomes.map((outcome) => (
              <li
                key={outcome}
                className="rounded-full border border-aipify-companion/20 bg-aipify-surface px-4 py-2 text-sm font-medium text-aipify-text-secondary"
              >
                {outcome}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <OnboardingChecklistSection title={labels.companionChecklist.title} items={labels.companionChecklist.items} />

      <VerticalFlowSection
        sectionId="customer-success-journey"
        title={labels.customerSuccessJourney.title}
        steps={labels.customerSuccessJourney.steps}
      />

      <section aria-labelledby="implementation-stories-title" className="border-y border-aipify-border bg-aipify-surface-muted/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <h2 id="implementation-stories-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
            {labels.implementationStories.title}
          </h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {labels.implementationStories.stories.map((story) => (
              <div key={story.title} className="rounded-2xl border border-aipify-border bg-aipify-surface p-6">
                <h3 className="text-center text-lg font-semibold text-aipify-companion">{story.title}</h3>
                <ol className="mt-6 space-y-0">
                  {story.steps.map((step, index) => (
                    <li key={step} className="flex flex-col items-center">
                      <div className="w-full rounded-xl border border-aipify-border bg-aipify-surface-muted/60 px-4 py-3 text-center text-sm text-aipify-text-secondary">
                        {step}
                      </div>
                      {index < story.steps.length - 1 ? (
                        <span className="my-2 text-lg text-aipify-companion" aria-hidden="true">
                          ↓
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="complexity-reassurance-title" className="bg-aipify-surface">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
          <h2 id="complexity-reassurance-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
            {labels.complexityReassurance.title}
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-aipify-text-secondary">
            {labels.complexityReassurance.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <ImplementationCtaBand {...labels.implementationCta} />
    </>
  );
}
