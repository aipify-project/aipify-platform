import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import { KNOWLEDGE_CONTAINER } from "./KnowledgeHero";
import type { BusinessPackSummary, KnowledgePageRedesignLabels } from "./types";

type BusinessPackKnowledgeCardProps = {
  pack: BusinessPackSummary;
  exploreLabel: string;
};

export function BusinessPackKnowledgeCard({ pack, exploreLabel }: BusinessPackKnowledgeCardProps) {
  return (
    <Link
      href={`/business-packs/${pack.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-aipify-companion/20 bg-aipify-surface p-6 shadow-sm transition hover:border-aipify-companion/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-aipify-companion to-aipify-accent" aria-hidden="true" />
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-aipify-accent-soft">
        <Package className="h-5 w-5 text-aipify-companion" aria-hidden="true" />
      </div>
      <h3 className={`mt-4 ${PublicMarketingClasses.cardTitle} group-hover:text-aipify-companion`}>{pack.name}</h3>
      <p className={`${PublicMarketingClasses.cardBody} flex-1 text-sm`}>{pack.metaDescription}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-aipify-companion">
        {exploreLabel}
        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </Link>
  );
}

type BusinessPackKnowledgeProps = {
  labels: KnowledgePageRedesignLabels["businessPacks"];
  businessPacks: BusinessPackSummary[];
};

export default function BusinessPackKnowledge({ labels, businessPacks }: BusinessPackKnowledgeProps) {
  return (
    <section id="business-packs" aria-labelledby="business-pack-knowledge-title" className={`${PublicMarketingClasses.section} scroll-mt-24`}>
      <div className={KNOWLEDGE_CONTAINER}>
        <h2 id="business-pack-knowledge-title" className={PublicMarketingClasses.sectionHeading}>
          {labels.title}
        </h2>
        {labels.subtitle ? <p className={`mt-3 ${PublicMarketingClasses.sectionSubtitle}`}>{labels.subtitle}</p> : null}

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {businessPacks.map((pack) => (
            <li key={pack.slug}>
              <BusinessPackKnowledgeCard pack={pack} exploreLabel={labels.explorePack} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
