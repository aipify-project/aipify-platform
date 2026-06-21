import Link from "next/link";
import dynamic from "next/dynamic";
import PublicCTA from "@/components/marketing/public/PublicCTA";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import type { ProductPageContent } from "@/lib/marketing/parse-product-page";
import { MARKETING_PRIMARY_CTA_HREFS } from "@/lib/marketing/primary-ctas";
import ProductBusinessPacksSection from "./ProductBusinessPacksSection";
import ProductCommandBriefSection from "./ProductCommandBriefSection";
import ProductCompanionSection from "./ProductCompanionSection";
import ProductCoordinationVisual from "./ProductCoordinationVisual";
import ProductEnterpriseSection from "./ProductEnterpriseSection";
import ProductExpansionSection from "./ProductExpansionSection";
import ProductGovernanceSection from "./ProductGovernanceSection";
import ProductHero from "./ProductHero";
import ProductPlatformLayers from "./ProductPlatformLayers";

const ProductWorkflowDemo = dynamic(() => import("./ProductWorkflowDemo"), { loading: () => null });
const ProductEnginesExplorer = dynamic(() => import("./ProductEnginesExplorer"), { loading: () => null });

type ProductPageContentProps = {
  content: ProductPageContent;
  appName: string;
};

export default function ProductPageContent({ content, appName }: ProductPageContentProps) {
  return (
    <>
      <ProductHero hero={content.hero} breadcrumbs={content.breadcrumbs} commandBrief={content.commandBriefHero} />
      <ProductCommandBriefSection section={content.commandBriefSection} />
      <ProductWorkflowDemo {...content.workflow} />
      <ProductCoordinationVisual {...content.coordination} />
      <ProductCompanionSection {...content.companion} appName={appName} />
      <ProductPlatformLayers {...content.platform} />
      <ProductEnginesExplorer {...content.engines} />
      <ProductBusinessPacksSection {...content.businessPacks} />
      <ProductGovernanceSection {...content.governance} />
      <ProductEnterpriseSection {...content.enterprise} />
      <ProductExpansionSection {...content.expansion} />

      <div className="border-t border-aipify-border">
        <PublicCTA
          title={content.finalCta.title}
          subtitle={content.finalCta.subtitle}
          primaryLabel={content.finalCta.primary}
          primaryHref={MARKETING_PRIMARY_CTA_HREFS.bookDemo}
          secondaryLabel={content.finalCta.secondary}
          secondaryHref="/pricing#business-packs"
          analyticsPrimary="product_final_book_demo"
          analyticsSecondary="product_final_explore_packs"
        />
        <div className={`${PublicMarketingClasses.container} pb-14 text-center sm:pb-16`}>
          <Link
            href={MARKETING_PRIMARY_CTA_HREFS.earlyAccess}
            className="text-sm font-semibold text-aipify-accent hover:text-aipify-companion"
            {...marketingDataAttr("cta_click", "product_final_early_access")}
          >
            {content.finalCta.tertiary} →
          </Link>
        </div>
      </div>
    </>
  );
}
