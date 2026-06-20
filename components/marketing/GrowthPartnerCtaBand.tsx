import Link from "next/link";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import { marketingDataAttr } from "@/lib/marketing/analytics";

export type GrowthPartnerCtaBandLabels = {
  title?: string;
  applyLabel: string;
  speakLabel: string;
  learnMoreLabel: string;
};

type GrowthPartnerCtaBandProps = GrowthPartnerCtaBandLabels;

export default function GrowthPartnerCtaBand({
  title,
  applyLabel,
  speakLabel,
  learnMoreLabel,
}: GrowthPartnerCtaBandProps) {
  return (
    <section className="border-t border-aipify-border">
      <div className={`${PublicMarketingClasses.container} py-16 sm:py-20`}>
        <div className="rounded-3xl border border-aipify-border bg-gradient-to-br from-aipify-accent-soft/60 via-aipify-surface to-violet-50/40 px-8 py-12 text-center sm:px-12">
          {title ? <h2 className={PublicMarketingClasses.sectionTitle}>{title}</h2> : null}
          <div className={`flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap ${title ? "mt-8" : ""}`}>
            <a
              href="#signup"
              className={`w-full sm:w-auto ${AipifyMarketingClasses.primaryCta} px-7 py-3.5 text-base`}
              {...marketingDataAttr("cta_click", "growth_partner_apply")}
            >
              {applyLabel}
            </a>
            <Link
              href="/contact"
              className={`w-full sm:w-auto ${AipifyMarketingClasses.secondaryCta} px-7 py-3.5 text-base`}
              {...marketingDataAttr("cta_click", "growth_partner_speak_success")}
            >
              {speakLabel}
            </Link>
            <a
              href="#partner-journey"
              className={`text-sm font-semibold ${PublicMarketingClasses.link} px-4 py-3`}
              {...marketingDataAttr("cta_click", "growth_partner_learn_more")}
            >
              {learnMoreLabel} →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
