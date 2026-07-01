import Link from "next/link";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import { MARKETING_ENTERPRISE_CTA_HREFS, MARKETING_PRIMARY_CTA_HREFS } from "@/lib/marketing/primary-ctas";
import HomepageSectionShell from "./HomepageSectionShell";

type HomepageFinalCtaProps = {
  title: string;
  subtitle: string;
  bookDemo: string;
  talkToAipify: string;
};

export default function HomepageFinalCta({ title, subtitle, bookDemo, talkToAipify }: HomepageFinalCtaProps) {
  return (
    <HomepageSectionShell className="border-t border-aipify-border bg-aipify-surface-muted/40">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">{title}</h2>
        {subtitle ? <p className="mt-4 text-lg leading-relaxed text-aipify-text-secondary">{subtitle}</p> : null}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={MARKETING_PRIMARY_CTA_HREFS.bookDemo}
            className={`${AipifyMarketingClasses.primaryCta} px-8 py-3.5 text-base`}
            {...marketingDataAttr("cta_click", "final_book_demo")}
          >
            {bookDemo}
          </Link>
          <Link
            href={MARKETING_ENTERPRISE_CTA_HREFS.speakWithAipify}
            className={`${AipifyMarketingClasses.secondaryCta} px-8 py-3.5 text-base`}
            {...marketingDataAttr("cta_click", "final_talk_to_aipify")}
          >
            {talkToAipify}
          </Link>
        </div>
      </div>
    </HomepageSectionShell>
  );
}
