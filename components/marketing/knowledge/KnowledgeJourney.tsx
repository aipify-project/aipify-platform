import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import { KNOWLEDGE_CONTAINER } from "./KnowledgeHero";
import type { KnowledgePageRedesignLabels } from "./types";

type KnowledgeJourneyProps = {
  journey: KnowledgePageRedesignLabels["journey"];
};

export default function KnowledgeJourney({ journey }: KnowledgeJourneyProps) {
  return (
    <section id="knowledge-journey" aria-labelledby="knowledge-journey-title" className={`${PublicMarketingClasses.sectionAlt} ${PublicMarketingClasses.section} scroll-mt-24`}>
      <div className={KNOWLEDGE_CONTAINER}>
        <h2 id="knowledge-journey-title" className={`text-center ${PublicMarketingClasses.sectionHeading}`}>
          {journey.title}
        </h2>

        <ol className="mt-12 hidden lg:grid lg:grid-cols-4 lg:gap-4">
          {journey.steps.map((step, index) => (
            <li key={step.title} className="relative text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-aipify-companion text-sm font-bold text-white">
                {index + 1}
              </div>
              {index < journey.steps.length - 1 ? (
                <div
                  className="absolute left-[calc(50%+20px)] top-5 h-0.5 w-[calc(100%-40px)] bg-aipify-border"
                  aria-hidden="true"
                />
              ) : null}
              <h3 className="mt-4 text-sm font-semibold text-aipify-text">{step.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-aipify-text-secondary">{step.description}</p>
            </li>
          ))}
        </ol>

        <ol className="mt-10 space-y-0 lg:hidden">
          {journey.steps.map((step, index) => (
            <li key={step.title} className="relative flex gap-4 pb-8 last:pb-0">
              {index < journey.steps.length - 1 ? (
                <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-aipify-border" aria-hidden="true" />
              ) : null}
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-aipify-companion text-sm font-bold text-white">
                {index + 1}
              </div>
              <div className="pt-1">
                <h3 className="text-sm font-semibold text-aipify-text">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
