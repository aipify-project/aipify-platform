import Link from "next/link";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import type { GrowthPartnersPageRedesignLabels } from "./types";

type Props = {
  finalCta: GrowthPartnersPageRedesignLabels["finalCta"];
};

export default function GrowthPartnerFinalCta({ finalCta }: Props) {
  return (
    <section className="border-t border-aipify-border">
      <div className={`${PublicMarketingClasses.container} py-16 sm:py-20`}>
        <div className="rounded-3xl border border-aipify-border bg-gradient-to-br from-aipify-accent-soft/60 via-aipify-surface to-violet-50/40 px-8 py-12 text-center sm:px-12">
          <h2 className={PublicMarketingClasses.sectionTitle}>{finalCta.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-aipify-text-secondary">{finalCta.subtitle}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="#apply"
              className={`w-full sm:w-auto ${AipifyMarketingClasses.primaryCta} px-7 py-3.5 text-base`}
              {...marketingDataAttr("cta_click", "growth_partner_final_apply")}
            >
              {finalCta.primary}
            </a>
            <Link
              href="/contact"
              className={`w-full sm:w-auto ${AipifyMarketingClasses.secondaryCta} px-7 py-3.5 text-base`}
              {...marketingDataAttr("cta_click", "growth_partner_final_speak_success")}
            >
              {finalCta.secondary}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
