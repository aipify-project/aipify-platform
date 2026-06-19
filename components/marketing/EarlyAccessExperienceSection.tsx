import Link from "next/link";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { MARKETING_PRIMARY_CTA_HREFS } from "@/lib/marketing/primary-ctas";

type EarlyAccessExperienceSectionProps = {
  title: string;
  intro: string;
  benefits: string[];
  ctaLabel: string;
};

export default function EarlyAccessExperienceSection({
  title,
  intro,
  benefits,
  ctaLabel,
}: EarlyAccessExperienceSectionProps) {
  return (
    <section aria-labelledby="early-access-experience-title" className="bg-aipify-surface">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
        <h2 id="early-access-experience-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-aipify-text-secondary">{intro}</p>
        <ul className="mx-auto mt-8 grid max-w-xl gap-3 text-left sm:grid-cols-2">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex gap-3 text-sm text-aipify-text-secondary">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aipify-companion" aria-hidden="true" />
              {benefit}
            </li>
          ))}
        </ul>
        <Link href={MARKETING_PRIMARY_CTA_HREFS.earlyAccess} className={`mt-8 inline-flex ${AipifyMarketingClasses.primaryCta} px-6 py-3`}>
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
