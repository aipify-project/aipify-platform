import PricingFaqAccordion from "@/components/marketing/pricing/PricingFaqAccordion";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import type { GrowthPartnersPageRedesignLabels } from "./types";

type Props = {
  faq: GrowthPartnersPageRedesignLabels["faq"];
};

export default function GrowthPartnerFaqAccordion({ faq }: Props) {
  return (
    <section aria-labelledby="gp-faq-title" className={`${PublicMarketingClasses.sectionAlt} py-16 sm:py-20`}>
      <div className={`${PublicMarketingClasses.containerWide} max-w-3xl`}>
        <h2 id="gp-faq-title" className={`text-center ${PublicMarketingClasses.sectionHeading}`}>{faq.title}</h2>
        <div className="mt-10">
          <PricingFaqAccordion items={faq.items} />
        </div>
      </div>
    </section>
  );
}
