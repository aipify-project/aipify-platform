import Link from "next/link";
import PublicCTA from "@/components/marketing/public/PublicCTA";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import { MARKETING_PRIMARY_CTA_HREFS } from "@/lib/marketing/primary-ctas";
import type { KnowledgePageRedesignLabels } from "./types";

type KnowledgeCTAProps = {
  cta: KnowledgePageRedesignLabels["cta"];
};

export default function KnowledgeCTA({ cta }: KnowledgeCTAProps) {
  return (
    <div className="border-t border-aipify-border">
      <PublicCTA
        title={cta.title}
        subtitle={cta.subtitle}
        primaryLabel={cta.bookDemo}
        primaryHref={MARKETING_PRIMARY_CTA_HREFS.bookDemo}
        secondaryLabel={cta.explorePacks}
        secondaryHref="/pricing#business-packs"
        analyticsPrimary="knowledge_final_book_demo"
        analyticsSecondary="knowledge_final_explore_packs"
      />
      <div className={`${PublicMarketingClasses.container} pb-14 text-center sm:pb-16`}>
        <Link
          href={MARKETING_PRIMARY_CTA_HREFS.earlyAccess}
          className="text-sm font-semibold text-aipify-accent hover:text-aipify-companion"
          {...marketingDataAttr("cta_click", "knowledge_final_early_access")}
        >
          {cta.earlyAccess} →
        </Link>
      </div>
    </div>
  );
}
