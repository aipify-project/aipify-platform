import Link from "next/link";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
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
    <section className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-cyan-950/20 px-8 py-12 text-center sm:px-12">
          {title ? <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2> : null}
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
              className={`w-full sm:w-auto text-sm font-semibold text-cyan-400 transition hover:text-cyan-300 px-4 py-3`}
              {...marketingDataAttr("cta_click", "growth_partner_learn_more")}
            >
              {learnMoreLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
