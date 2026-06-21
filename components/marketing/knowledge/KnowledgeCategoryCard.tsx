import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PublicKnowledgeCategory } from "@/lib/marketing/knowledge/types";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import KnowledgeIcon from "./KnowledgeIcon";
import { KNOWLEDGE_CONTAINER } from "./KnowledgeHero";
import type { KnowledgePageRedesignLabels } from "./types";

type KnowledgeCategoryCardProps = {
  category: PublicKnowledgeCategory;
  exploreLabel: string;
};

export function KnowledgeCategoryCard({ category, exploreLabel }: KnowledgeCategoryCardProps) {
  return (
    <Link
      href={`/knowledge/${category.id}`}
      className="group flex h-full flex-col rounded-2xl border border-aipify-border bg-aipify-surface p-5 shadow-sm transition hover:border-aipify-companion/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-aipify-accent-soft">
        <KnowledgeIcon categoryId={category.id} className="h-5 w-5 text-aipify-companion" />
      </div>
      <h3 className={`mt-4 ${PublicMarketingClasses.cardTitle} group-hover:text-aipify-companion`}>{category.name}</h3>
      <p className={`${PublicMarketingClasses.cardBody} flex-1 text-sm`}>{category.description}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-aipify-companion">
        {exploreLabel}
        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </Link>
  );
}

type CategoryNavigationProps = {
  labels: KnowledgePageRedesignLabels["categories"];
  categories: PublicKnowledgeCategory[];
};

export default function CategoryNavigation({ labels, categories }: CategoryNavigationProps) {
  return (
    <section aria-labelledby="category-nav-title" className={PublicMarketingClasses.section}>
      <div className={KNOWLEDGE_CONTAINER}>
        <h2 id="category-nav-title" className={PublicMarketingClasses.sectionHeading}>
          {labels.title}
        </h2>
        {labels.subtitle ? <p className={`mt-3 ${PublicMarketingClasses.sectionSubtitle}`}>{labels.subtitle}</p> : null}

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <li key={category.id}>
              <KnowledgeCategoryCard category={category} exploreLabel={labels.exploreCategory} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
