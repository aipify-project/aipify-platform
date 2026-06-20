import Link from "next/link";
import EarlyAccessForm from "@/components/marketing/EarlyAccessForm";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import { MARKETING_PRIMARY_CTA_HREFS } from "@/lib/marketing/primary-ctas";
import type { HumanVerificationLabels } from "@/lib/system-notice/types";

type EarlyAccessLabels = Parameters<typeof EarlyAccessForm>[0]["labels"];

type HomepageFinalCtaProps = {
  title: string;
  subtitle: string;
  bookDemo: string;
  earlyAccessDivider: string;
  earlyAccessLabels: EarlyAccessLabels;
  verificationLabels: HumanVerificationLabels;
};

export default function HomepageFinalCta({
  title,
  subtitle,
  bookDemo,
  earlyAccessDivider,
  earlyAccessLabels,
  verificationLabels,
}: HomepageFinalCtaProps) {
  return (
    <section className="border-t border-aipify-border">
      <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-aipify-text sm:text-3xl">{title}</h2>
            {subtitle ? <p className="mt-3 text-lg leading-relaxed text-aipify-text-secondary">{subtitle}</p> : null}
            <Link
              href={MARKETING_PRIMARY_CTA_HREFS.bookDemo}
              className={`mt-8 inline-flex ${AipifyMarketingClasses.primaryCta}`}
              {...marketingDataAttr("cta_click", "final_book_demo")}
            >
              {bookDemo}
            </Link>
          </div>

          <div className="rounded-2xl border border-aipify-border bg-aipify-surface p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium text-aipify-text-muted">{earlyAccessDivider}</p>
            <div className="mt-4">
              <EarlyAccessForm
                labels={earlyAccessLabels}
                verificationLabels={verificationLabels}
                variant="light"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
