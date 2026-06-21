import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";
import type { PublicKnowledgeIndustry } from "@/lib/marketing/knowledge/types";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import { KNOWLEDGE_CONTAINER } from "./KnowledgeHero";
import type { KnowledgePageRedesignLabels } from "./types";

type IndustryGuideCardProps = {
  industry: PublicKnowledgeIndustry;
  exploreLabel: string;
};

export function IndustryGuideCard({ industry, exploreLabel }: IndustryGuideCardProps) {
  return (
    <Link
      href={`/knowledge/industry/${industry.id}`}
      className="group flex h-full flex-col rounded-2xl border border-aipify-border/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition hover:border-aipify-companion/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
        <Building2 className="h-5 w-5 text-aipify-accent" aria-hidden="true" />
      </div>
      <h3 className={`mt-4 ${PublicMarketingClasses.cardTitle} group-hover:text-aipify-companion`}>{industry.name}</h3>
      <p className={`${PublicMarketingClasses.cardBody} flex-1 text-sm`}>{industry.description}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-aipify-companion">
        {exploreLabel}
        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </Link>
  );
}

type IndustryGuidesProps = {
  labels: KnowledgePageRedesignLabels["industries"];
  industries: PublicKnowledgeIndustry[];
};

export default function IndustryGuides({ labels, industries }: IndustryGuidesProps) {
  return (
    <section
      aria-labelledby="industry-guides-title"
      className={`${PublicMarketingClasses.section} bg-gradient-to-b from-indigo-50/60 to-aipify-canvas`}
    >
      <div className={KNOWLEDGE_CONTAINER}>
        <h2 id="industry-guides-title" className={PublicMarketingClasses.sectionHeading}>
          {labels.title}
        </h2>
        {labels.subtitle ? <p className={`mt-3 ${PublicMarketingClasses.sectionSubtitle}`}>{labels.subtitle}</p> : null}

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <li key={industry.id}>
              <IndustryGuideCard industry={industry} exploreLabel={labels.exploreIndustry} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
