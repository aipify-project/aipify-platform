import { BookOpen, Eye, Shield, Users } from "lucide-react";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import { KNOWLEDGE_CONTAINER } from "./KnowledgeHero";
import type { KnowledgePageRedesignLabels } from "./types";

const TRUST_ICONS = [BookOpen, Shield, Users, Eye];

type KnowledgeTrustSectionProps = {
  trust: KnowledgePageRedesignLabels["trust"];
};

export default function KnowledgeTrustSection({ trust }: KnowledgeTrustSectionProps) {
  return (
    <section aria-labelledby="knowledge-trust-title" className={PublicMarketingClasses.section}>
      <div className={KNOWLEDGE_CONTAINER}>
        <div className="max-w-2xl">
          <h2 id="knowledge-trust-title" className={PublicMarketingClasses.sectionHeading}>
            {trust.title}
          </h2>
          {trust.subtitle ? <p className={`mt-3 ${PublicMarketingClasses.sectionSubtitle}`}>{trust.subtitle}</p> : null}
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trust.principles.map((principle, index) => {
            const Icon = TRUST_ICONS[index % TRUST_ICONS.length];
            return (
              <li key={principle.title} className="rounded-2xl border border-aipify-border bg-aipify-surface p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-aipify-accent-soft">
                  <Icon className="h-5 w-5 text-aipify-companion" aria-hidden="true" />
                </div>
                <h3 className={`mt-4 ${PublicMarketingClasses.cardTitle}`}>{principle.title}</h3>
                <p className={`${PublicMarketingClasses.cardBody} text-sm`}>{principle.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
