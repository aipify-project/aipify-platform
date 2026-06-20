import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import type { HomepageRedesignContent } from "@/lib/marketing/parse-homepage";
import CommandBriefMockup from "./CommandBriefMockup";

type CommandBriefSectionProps = {
  labels: HomepageRedesignContent["commandBrief"];
};

export default function CommandBriefSection({ labels }: CommandBriefSectionProps) {
  return (
    <section className={AipifyMarketingClasses.sectionAlt} aria-labelledby="command-brief-title">
      <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <h2 id="command-brief-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
            {labels.title}
          </h2>
          {labels.subtitle ? (
            <p className="mt-4 text-lg leading-relaxed text-aipify-text-secondary">{labels.subtitle}</p>
          ) : null}
        </div>

        <div className="mt-10">
          <CommandBriefMockup labels={labels} />
        </div>
      </div>
    </section>
  );
}
