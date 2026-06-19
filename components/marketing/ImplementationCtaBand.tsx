import Link from "next/link";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import { MARKETING_ENTERPRISE_CTA_HREFS } from "@/lib/marketing/primary-ctas";

export type ImplementationCtaBandLabels = {
  title: string;
  subtitle?: string;
  bookDemo: string;
  earlyAccess: string;
  speakWithAipify: string;
};

type ImplementationCtaBandProps = ImplementationCtaBandLabels;

export default function ImplementationCtaBand({
  title,
  subtitle,
  bookDemo,
  earlyAccess,
  speakWithAipify,
}: ImplementationCtaBandProps) {
  return (
    <section className="border-t border-aipify-border">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-blue-600/10 to-violet-600/10 px-8 py-12 text-center sm:px-12">
          <h2 className="text-2xl font-bold text-aipify-text sm:text-3xl">{title}</h2>
          {subtitle ? <p className="mx-auto mt-3 max-w-xl text-aipify-text-secondary">{subtitle}</p> : null}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={MARKETING_ENTERPRISE_CTA_HREFS.bookEnterpriseDemo}
              className={`w-full sm:w-auto ${AipifyMarketingClasses.primaryCta} px-7 py-3.5 text-base`}
              {...marketingDataAttr("cta_click", "implementation_cta_book_demo")}
            >
              {bookDemo}
            </Link>
            <Link
              href={MARKETING_ENTERPRISE_CTA_HREFS.earlyAccess}
              className={`w-full sm:w-auto ${AipifyMarketingClasses.secondaryCta} px-7 py-3.5 text-base`}
              {...marketingDataAttr("cta_click", "implementation_cta_early_access")}
            >
              {earlyAccess}
            </Link>
            <Link
              href={MARKETING_ENTERPRISE_CTA_HREFS.speakWithAipify}
              className={`w-full sm:w-auto ${AipifyMarketingClasses.secondaryCta} px-7 py-3.5 text-base`}
              {...marketingDataAttr("cta_click", "implementation_cta_speak_with_aipify")}
            >
              {speakWithAipify}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
