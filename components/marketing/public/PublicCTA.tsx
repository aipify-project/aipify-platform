import Link from "next/link";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { marketingDataAttr } from "@/lib/marketing/analytics";

type PublicCTAProps = {
  title: string;
  subtitle?: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  analyticsPrimary?: string;
  analyticsSecondary?: string;
};

export default function PublicCTA({
  title,
  subtitle,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  analyticsPrimary = "public_cta_primary",
  analyticsSecondary = "public_cta_secondary",
}: PublicCTAProps) {
  return (
    <section className={AipifyMarketingClasses.sectionAlt} aria-labelledby="public-cta-title">
      <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="public-cta-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-4 text-lg leading-relaxed text-aipify-text-secondary">{subtitle}</p>
          ) : null}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={primaryHref}
              className={`${AipifyMarketingClasses.primaryCta} px-7 py-3.5 text-base`}
              {...marketingDataAttr("cta_click", analyticsPrimary)}
            >
              {primaryLabel}
            </Link>
            {secondaryLabel && secondaryHref ? (
              <Link
                href={secondaryHref}
                className={`${AipifyMarketingClasses.secondaryCta} px-7 py-3.5 text-base`}
                {...marketingDataAttr("cta_click", analyticsSecondary)}
              >
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
