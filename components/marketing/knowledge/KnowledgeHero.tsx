import PublicBreadcrumbs from "@/components/marketing/public/PublicBreadcrumbs";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import type { KnowledgePageRedesignLabels } from "./types";

const KNOWLEDGE_CONTAINER = "mx-auto max-w-[77.5rem] px-4 sm:px-6 lg:px-8";

type KnowledgeHeroProps = {
  hero: KnowledgePageRedesignLabels["hero"];
};

export default function KnowledgeHero({ hero }: KnowledgeHeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className={AipifyMarketingClasses.heroGradient} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 right-0 h-[320px] w-[320px] rounded-full bg-violet-100/50 blur-3xl" />
        <div className="absolute top-20 -left-20 h-[260px] w-[260px] rounded-full bg-indigo-50/80 blur-3xl" />
      </div>

      <div className={`relative ${KNOWLEDGE_CONTAINER} py-14 sm:py-16 lg:py-20`}>
        <PublicBreadcrumbs
          items={[
            { label: hero.breadcrumbHome, href: "/" },
            { label: hero.breadcrumbKnowledge },
          ]}
        />

        <div className="max-w-3xl">
          <span className={PublicMarketingClasses.eyebrow}>{hero.eyebrow}</span>
          <h1 className={`mt-5 ${PublicMarketingClasses.pageTitle}`}>{hero.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-aipify-text-secondary">{hero.subtitle}</p>
          {hero.authorityNote ? (
            <p className="mt-6 text-sm leading-relaxed text-aipify-text-secondary">{hero.authorityNote}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export { KNOWLEDGE_CONTAINER };
