import Link from "next/link";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import { MARKETING_PRIMARY_CTA_HREFS, type MarketingPrimaryCtaLabels } from "@/lib/marketing/primary-ctas";

type MarketingPrimaryCtasProps = {
  labels: MarketingPrimaryCtaLabels;
  layout?: "row" | "stack";
  analyticsPrefix?: string;
  includeSeeHowItWorks?: boolean;
};

export default function MarketingPrimaryCtas({
  labels,
  layout = "row",
  analyticsPrefix = "primary_cta",
  includeSeeHowItWorks = false,
}: MarketingPrimaryCtasProps) {
  const stack = layout === "stack";

  return (
    <div
      className={
        stack
          ? "flex flex-col items-stretch gap-3"
          : "flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap"
      }
    >
      <Link
        href={MARKETING_PRIMARY_CTA_HREFS.bookDemo}
        className={`${stack ? "w-full" : "w-full sm:w-auto"} ${AipifyMarketingClasses.primaryCta} px-7 py-3.5 text-base`}
        {...marketingDataAttr("cta_click", `${analyticsPrefix}_book_demo`)}
      >
        {labels.bookDemo}
      </Link>
      <Link
        href={MARKETING_PRIMARY_CTA_HREFS.earlyAccess}
        className={`${stack ? "w-full" : "w-full sm:w-auto"} ${AipifyMarketingClasses.secondaryCta} px-7 py-3.5 text-base`}
        {...marketingDataAttr("cta_click", `${analyticsPrefix}_early_access`)}
      >
        {labels.earlyAccess}
      </Link>
      <Link
        href={MARKETING_PRIMARY_CTA_HREFS.growthPartners}
        className={`${stack ? "w-full" : "w-full sm:w-auto"} ${AipifyMarketingClasses.secondaryCta} px-7 py-3.5 text-base`}
        {...marketingDataAttr("cta_click", `${analyticsPrefix}_growth_partners`)}
      >
        {labels.growthPartners}
      </Link>
      {includeSeeHowItWorks && labels.seeHowItWorks ? (
        <Link
          href={MARKETING_PRIMARY_CTA_HREFS.seeHowItWorks}
          className={`${stack ? "w-full" : "w-full sm:w-auto"} text-sm font-semibold text-aipify-companion transition hover:text-aipify-companion-hover px-2 py-2`}
          {...marketingDataAttr("cta_click", `${analyticsPrefix}_see_how_it_works`)}
        >
          {labels.seeHowItWorks}
        </Link>
      ) : null}
    </div>
  );
}
