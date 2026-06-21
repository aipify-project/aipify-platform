import Link from "next/link";
import { ArrowRight, Layers, Sparkles } from "lucide-react";
import { PUBLIC_KNOWLEDGE_HUBS } from "@/lib/marketing/knowledge/types";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import { KNOWLEDGE_CONTAINER } from "./KnowledgeHero";
import type { KnowledgePageRedesignLabels } from "./types";

const HUB_ICONS = {
  "business-operating-system": Layers,
  companion: Sparkles,
} as const;

type KnowledgeHubCardProps = {
  hubId: (typeof PUBLIC_KNOWLEDGE_HUBS)[number];
  title: string;
  description: string;
  exploreLabel: string;
};

export function KnowledgeHubCard({ hubId, title, description, exploreLabel }: KnowledgeHubCardProps) {
  const Icon = HUB_ICONS[hubId] ?? Layers;

  return (
    <Link
      href={`/knowledge/${hubId}`}
      className="group flex h-full flex-col rounded-2xl border border-aipify-border bg-aipify-surface p-7 shadow-sm transition hover:border-aipify-companion/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-aipify-accent-soft">
        <Icon className="h-6 w-6 text-aipify-companion" aria-hidden="true" />
      </div>
      <h3 className={`mt-5 ${PublicMarketingClasses.cardTitle} text-xl group-hover:text-aipify-companion`}>{title}</h3>
      <p className={`${PublicMarketingClasses.cardBody} flex-1`}>{description}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-aipify-companion">
        {exploreLabel}
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </Link>
  );
}

type ContentHubsProps = {
  labels: KnowledgePageRedesignLabels["hubs"];
};

export default function ContentHubs({ labels }: ContentHubsProps) {
  return (
    <section aria-labelledby="content-hubs-title" className={`${PublicMarketingClasses.sectionAlt} ${PublicMarketingClasses.section}`}>
      <div className={KNOWLEDGE_CONTAINER}>
        <h2 id="content-hubs-title" className={PublicMarketingClasses.sectionHeading}>
          {labels.title}
        </h2>
        {labels.subtitle ? <p className={`mt-3 ${PublicMarketingClasses.sectionSubtitle}`}>{labels.subtitle}</p> : null}

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {PUBLIC_KNOWLEDGE_HUBS.map((hubId) => {
            const item = labels.items[hubId];
            if (!item) return null;
            return (
              <KnowledgeHubCard
                key={hubId}
                hubId={hubId}
                title={item.title}
                description={item.description}
                exploreLabel={labels.exploreHub}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
